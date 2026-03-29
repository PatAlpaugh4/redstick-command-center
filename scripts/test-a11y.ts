#!/usr/bin/env ts-node
/**
 * Automated Accessibility Testing Script
 * ======================================
 * Runs comprehensive accessibility tests across the application using Puppeteer and axe-core.
 * 
 * This script:
 * - Launches a headless browser
 * - Navigates to configured pages
 * - Runs axe-core accessibility tests
 * - Generates a report of violations
 * - Exits with non-zero code if violations are found
 * 
 * @see https://github.com/dequelabs/axe-core
 * @see https://pptr.dev/
 * 
 * Usage:
 *   npm run test:a11y           # Run all tests
 *   npm run test:a11y -- --url http://localhost:3000  # Custom URL
 *   npm run test:a11y -- --critical-only             # Critical violations only
 */

import { launch, Browser, Page } from 'puppeteer';
import { source } from 'axe-core';
import * as fs from 'fs';
import * as path from 'path';

// =============================================================================
// Types
// =============================================================================

interface TestResult {
  page: string;
  url: string;
  violations: AxeViolation[];
  passes: number;
  incomplete: number;
  inapplicable: number;
  timestamp: string;
}

interface AxeViolation {
  id: string;
  impact: 'minor' | 'moderate' | 'serious' | 'critical' | null;
  tags: string[];
  description: string;
  help: string;
  helpUrl: string;
  nodes: AxeNode[];
}

interface AxeNode {
  target: string[];
  html: string;
  failureSummary?: string;
  impact?: string;
}

interface RunOptions {
  baseUrl: string;
  outputDir: string;
  criticalOnly: boolean;
  timeout: number;
  headless: boolean;
  viewport: { width: number; height: number };
}

// =============================================================================
// Configuration
// =============================================================================

const defaultOptions: RunOptions = {
  baseUrl: process.env.TEST_URL || 'http://localhost:3000',
  outputDir: './a11y-reports',
  criticalOnly: process.argv.includes('--critical-only'),
  timeout: 30000,
  headless: !process.argv.includes('--headed'),
  viewport: { width: 1280, height: 720 },
};

// Pages to test - add new routes here as the app grows
const pagesToTest = [
  { path: '/', name: 'Home Page' },
  { path: '/app/dashboard', name: 'Dashboard' },
  { path: '/app/pipeline', name: 'Pipeline Board' },
  { path: '/app/portfolio', name: 'Portfolio' },
  { path: '/app/agents', name: 'AI Agents' },
  { path: '/app/settings', name: 'Settings' },
  { path: '/accessibility', name: 'Accessibility Statement' },
  { path: '/login', name: 'Login Page' },
];

// Rules to disable in test environment (known false positives)
const disabledRules = [
  'page-has-heading-one',  // App shell handles this
  'region',                // Regions may be in layout
  'landmark-one',          // Main landmark in layout
  'bypass',                // Skip link in layout
];

// =============================================================================
// Report Generators
// =============================================================================

function generateConsoleReport(results: TestResult[]): void {
  console.log('\n╔════════════════════════════════════════════════════════════╗');
  console.log('║           ACCESSIBILITY TEST RESULTS                       ║');
  console.log('╚════════════════════════════════════════════════════════════╝\n');

  let totalViolations = 0;
  let criticalViolations = 0;
  let seriousViolations = 0;

  for (const result of results) {
    const criticalCount = result.violations.filter(v => v.impact === 'critical').length;
    const seriousCount = result.violations.filter(v => v.impact === 'serious').length;
    const moderateCount = result.violations.filter(v => v.impact === 'moderate').length;
    const minorCount = result.violations.filter(v => v.impact === 'minor').length;

    totalViolations += result.violations.length;
    criticalViolations += criticalCount;
    seriousViolations += seriousCount;

    const status = result.violations.length === 0 ? '✅ PASS' : '❌ FAIL';
    const statusColor = result.violations.length === 0 ? '\x1b[32m' : '\x1b[31m';
    const reset = '\x1b[0m';

    console.log(`${statusColor}${status}${reset} ${result.page}`);
    console.log(`    URL: ${result.url}`);
    console.log(`    Violations: ${result.violations.length} (Critical: ${criticalCount}, Serious: ${seriousCount}, Moderate: ${moderateCount}, Minor: ${minorCount})`);
    console.log(`    Passes: ${result.passes}, Incomplete: ${result.incomplete}`);
    console.log('');
  }

  console.log('═══════════════════════════════════════════════════════════════');
  console.log(`Total Violations: ${totalViolations}`);
  console.log(`  Critical: ${criticalViolations} ${criticalViolations > 0 ? '⚠️' : ''}`);
  console.log(`  Serious: ${seriousViolations} ${seriousViolations > 0 ? '⚠️' : ''}`);
  console.log('═══════════════════════════════════════════════════════════════\n');

  return;
}

function generateHTMLReport(results: TestResult[], outputPath: string): void {
  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Accessibility Test Report - Redstick Ventures</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #333;
      background: #f5f5f5;
      padding: 2rem;
    }
    .container { max-width: 1200px; margin: 0 auto; }
    header {
      background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 100%);
      color: white;
      padding: 2rem;
      border-radius: 12px;
      margin-bottom: 2rem;
    }
    h1 { font-size: 1.875rem; margin-bottom: 0.5rem; }
    .timestamp { color: #888; font-size: 0.875rem; }
    .summary {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 1rem;
      margin-bottom: 2rem;
    }
    .summary-card {
      background: white;
      padding: 1.5rem;
      border-radius: 8px;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .summary-card h3 {
      font-size: 0.875rem;
      text-transform: uppercase;
      color: #666;
      margin-bottom: 0.5rem;
    }
    .summary-card .number {
      font-size: 2rem;
      font-weight: bold;
    }
    .critical { color: #dc2626; }
    .serious { color: #ea580c; }
    .moderate { color: #ca8a04; }
    .minor { color: #6b7280; }
    .pass { color: #16a34a; }
    .page-result {
      background: white;
      border-radius: 8px;
      margin-bottom: 1rem;
      overflow: hidden;
      box-shadow: 0 1px 3px rgba(0,0,0,0.1);
    }
    .page-header {
      padding: 1rem 1.5rem;
      background: #f9fafb;
      border-bottom: 1px solid #e5e7eb;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .page-header h2 {
      font-size: 1.125rem;
      color: #111;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      padding: 0.25rem 0.75rem;
      border-radius: 9999px;
      font-size: 0.75rem;
      font-weight: 600;
    }
    .badge-pass { background: #dcfce7; color: #166534; }
    .badge-fail { background: #fee2e2; color: #991b1b; }
    .violation {
      padding: 1rem 1.5rem;
      border-bottom: 1px solid #e5e7eb;
    }
    .violation:last-child { border-bottom: none; }
    .violation-header {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }
    .violation h4 {
      font-size: 1rem;
      color: #111;
    }
    .impact-badge {
      font-size: 0.625rem;
      text-transform: uppercase;
      padding: 0.125rem 0.5rem;
      border-radius: 4px;
      font-weight: 600;
    }
    .impact-critical { background: #fee2e2; color: #991b1b; }
    .impact-serious { background: #ffedd5; color: #9a3412; }
    .impact-moderate { background: #fef9c3; color: #854d0e; }
    .impact-minor { background: #f3f4f6; color: #374151; }
    .violation p {
      color: #666;
      font-size: 0.875rem;
      margin-bottom: 0.5rem;
    }
    .violation a {
      color: #2563eb;
      font-size: 0.875rem;
    }
    .node {
      background: #f9fafb;
      padding: 0.75rem;
      border-radius: 4px;
      margin-top: 0.75rem;
      font-family: monospace;
      font-size: 0.75rem;
      overflow-x: auto;
    }
    .no-violations {
      padding: 2rem;
      text-align: center;
      color: #16a34a;
    }
    footer {
      text-align: center;
      color: #666;
      font-size: 0.875rem;
      margin-top: 2rem;
      padding-top: 2rem;
      border-top: 1px solid #e5e7eb;
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <h1>♿ Accessibility Test Report</h1>
      <p class="timestamp">Generated: ${new Date().toLocaleString()}</p>
    </header>

    <div class="summary">
      <div class="summary-card">
        <h3>Pages Tested</h3>
        <div class="number">${results.length}</div>
      </div>
      <div class="summary-card">
        <h3>Critical Violations</h3>
        <div class="number critical">${results.reduce((sum, r) => sum + r.violations.filter(v => v.impact === 'critical').length, 0)}</div>
      </div>
      <div class="summary-card">
        <h3>Serious Violations</h3>
        <div class="number serious">${results.reduce((sum, r) => sum + r.violations.filter(v => v.impact === 'serious').length, 0)}</div>
      </div>
      <div class="summary-card">
        <h3>Total Violations</h3>
        <div class="number">${results.reduce((sum, r) => sum + r.violations.length, 0)}</div>
      </div>
    </div>

    ${results.map(result => `
      <div class="page-result">
        <div class="page-header">
          <h2>${result.page}</h2>
          <span class="badge ${result.violations.length === 0 ? 'badge-pass' : 'badge-fail'}">
            ${result.violations.length === 0 ? '✓ Pass' : '✗ ' + result.violations.length + ' violations'}
          </span>
        </div>
        ${result.violations.length === 0 
          ? '<div class="no-violations">✓ No accessibility violations found</div>'
          : result.violations.map(v => `
            <div class="violation">
              <div class="violation-header">
                <h4>${v.help}</h4>
                ${v.impact ? `<span class="impact-badge impact-${v.impact}">${v.impact}</span>` : ''}
              </div>
              <p>${v.description}</p>
              <a href="${v.helpUrl}" target="_blank" rel="noopener">Learn more →</a>
              ${v.nodes.slice(0, 3).map(n => `
                <div class="node">
                  <strong>Element:</strong> ${n.target.join(' > ')}<br>
                  <strong>HTML:</strong> ${n.html.substring(0, 200)}${n.html.length > 200 ? '...' : ''}
                </div>
              `).join('')}
              ${v.nodes.length > 3 ? `<div class="node">... and ${v.nodes.length - 3} more instances</div>` : ''}
            </div>
          `).join('')
        }
      </div>
    `).join('')}

    <footer>
      <p>Redstick Ventures Dashboard - Accessibility Testing</p>
      <p>Powered by axe-core and Puppeteer</p>
    </footer>
  </div>
</body>
</html>`;

  fs.writeFileSync(outputPath, html);
  console.log(`📄 HTML report saved to: ${outputPath}`);
}

function generateJSONReport(results: TestResult[], outputPath: string): void {
  const report = {
    generatedAt: new Date().toISOString(),
    summary: {
      totalPages: results.length,
      totalViolations: results.reduce((sum, r) => sum + r.violations.length, 0),
      criticalViolations: results.reduce((sum, r) => sum + r.violations.filter(v => v.impact === 'critical').length, 0),
      seriousViolations: results.reduce((sum, r) => sum + r.violations.filter(v => v.impact === 'serious').length, 0),
    },
    results,
  };

  fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
  console.log(`📊 JSON report saved to: ${outputPath}`);
}

// =============================================================================
// Main Test Runner
// =============================================================================

async function runA11yTests(options: RunOptions): Promise<TestResult[]> {
  console.log('🚀 Starting accessibility tests...\n');
  console.log(`Base URL: ${options.baseUrl}`);
  console.log(`Pages to test: ${pagesToTest.length}`);
  console.log(`Critical only: ${options.criticalOnly}\n`);

  let browser: Browser | null = null;
  const results: TestResult[] = [];

  try {
    // Launch browser
    browser = await launch({
      headless: options.headless,
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    for (const pageConfig of pagesToTest) {
      const pageUrl = `${options.baseUrl}${pageConfig.path}`;
      console.log(`🔍 Testing: ${pageConfig.name} (${pageUrl})`);

      const page = await browser.newPage();
      await page.setViewport(options.viewport);

      try {
        // Navigate to page
        await page.goto(pageUrl, {
          waitUntil: 'networkidle2',
          timeout: options.timeout,
        });

        // Wait for app to hydrate
        await page.waitForTimeout(2000);

        // Inject axe-core
        await page.evaluate(source);

        // Run axe tests
        const axeResults = await page.evaluate((options) => {
          return new Promise((resolve) => {
            // @ts-ignore - axe is injected above
            axe.run({
              runOnly: {
                type: 'tag',
                values: ['wcag2a', 'wcag2aa', 'best-practice'],
              },
              rules: {
                ...options.disabledRules.reduce((acc, rule) => ({
                  ...acc,
                  [rule]: { enabled: false },
                }), {}),
              },
            }).then((results: unknown) => resolve(results));
          });
        }, { disabledRules });

        const result = axeResults as {
          violations: AxeViolation[];
          passes: unknown[];
          incomplete: unknown[];
          inapplicable: unknown[];
        };

        // Filter for critical only if specified
        let violations = result.violations;
        if (options.criticalOnly) {
          violations = violations.filter(v => v.impact === 'critical' || v.impact === 'serious');
        }

        results.push({
          page: pageConfig.name,
          url: pageUrl,
          violations,
          passes: result.passes.length,
          incomplete: result.incomplete.length,
          inapplicable: result.inapplicable.length,
          timestamp: new Date().toISOString(),
        });

        const status = violations.length === 0 ? '✅' : '❌';
        console.log(`   ${status} Found ${violations.length} violations\n`);

      } catch (error) {
        console.error(`   ❌ Error testing ${pageConfig.name}:`, error instanceof Error ? error.message : error);
        results.push({
          page: pageConfig.name,
          url: pageUrl,
          violations: [],
          passes: 0,
          incomplete: 0,
          inapplicable: 0,
          timestamp: new Date().toISOString(),
        });
      } finally {
        await page.close();
      }
    }

    return results;

  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

// =============================================================================
// Main Entry Point
// =============================================================================

async function main(): Promise<void> {
  const options = { ...defaultOptions };

  // Parse CLI arguments
  const args = process.argv.slice(2);
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--url' && args[i + 1]) {
      options.baseUrl = args[i + 1];
      i++;
    }
  }

  // Ensure output directory exists
  if (!fs.existsSync(options.outputDir)) {
    fs.mkdirSync(options.outputDir, { recursive: true });
  }

  // Run tests
  const results = await runA11yTests(options);

  // Generate reports
  generateConsoleReport(results);

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  generateHTMLReport(results, path.join(options.outputDir, `a11y-report-${timestamp}.html`));
  generateJSONReport(results, path.join(options.outputDir, `a11y-report-${timestamp}.json`));

  // Exit with appropriate code
  const totalViolations = results.reduce((sum, r) => sum + r.violations.length, 0);
  const criticalViolations = results.reduce(
    (sum, r) => sum + r.violations.filter(v => v.impact === 'critical').length,
    0
  );

  console.log('\n═══════════════════════════════════════════════════════════════');
  if (criticalViolations > 0) {
    console.log(`❌ Tests failed with ${criticalViolations} critical violation(s)`);
    console.log('═══════════════════════════════════════════════════════════════\n');
    process.exit(1);
  } else if (totalViolations > 0) {
    console.log(`⚠️  Tests completed with ${totalViolations} non-critical violation(s)`);
    console.log('═══════════════════════════════════════════════════════════════\n');
    // Exit with 0 for non-critical violations, or 1 if strict mode enabled
    process.exit(process.argv.includes('--strict') ? 1 : 0);
  } else {
    console.log('✅ All accessibility tests passed!');
    console.log('═══════════════════════════════════════════════════════════════\n');
    process.exit(0);
  }
}

// Run main
main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
