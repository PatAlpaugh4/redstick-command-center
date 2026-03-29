/**
 * Bundle Analyzer Configuration
 * =============================
 * Webpack bundle analyzer setup for analyzing and optimizing bundle size.
 * Run with: ANALYZE=true npm run build
 * 
 * This module provides:
 * - Webpack plugin configuration
 * - Bundle size analysis utilities
 * - Performance budget checking
 * - Chunk analysis helpers
 */

import type { Configuration, WebpackPluginInstance } from 'webpack';

// =============================================================================
// Configuration
// =============================================================================

interface BundleAnalyzerOptions {
  /** Port for the analyzer server */
  analyzerPort?: number;
  /** Whether to open the analyzer in the browser */
  openAnalyzer?: boolean;
  /** Output filename for the static report */
  reportFilename?: string;
  /** Generate static HTML file instead of server */
  generateStatsFile?: boolean;
  /** Stats filename */
  statsFilename?: string;
  /** Log level */
  logLevel?: 'info' | 'warn' | 'error' | 'silent';
}

const defaultOptions: BundleAnalyzerOptions = {
  analyzerPort: 8888,
  openAnalyzer: true,
  reportFilename: 'report.html',
  generateStatsFile: true,
  statsFilename: 'stats.json',
  logLevel: 'info',
};

// =============================================================================
// Webpack Plugin Setup
// =============================================================================

/**
 * Creates webpack bundle analyzer plugin configuration
 * 
 * @example
 * // next.config.js
 * const { withBundleAnalyzer } = require('./src/lib/analyze-bundle');
 * 
 * module.exports = withBundleAnalyzer({
 *   // your next config
 * });
 */
export function createBundleAnalyzerPlugin(
  options: BundleAnalyzerOptions = {}
): WebpackPluginInstance | null {
  // Only run in analyze mode
  if (process.env.ANALYZE !== 'true') {
    return null;
  }

  try {
    // Dynamic import to avoid loading in production
    const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
    
    const mergedOptions = { ...defaultOptions, ...options };
    
    return new BundleAnalyzerPlugin({
      analyzerMode: 'server',
      analyzerPort: mergedOptions.analyzerPort,
      openAnalyzer: mergedOptions.openAnalyzer,
      reportFilename: mergedOptions.reportFilename,
      generateStatsFile: mergedOptions.generateStatsFile,
      statsFilename: mergedOptions.statsFilename,
      logLevel: mergedOptions.logLevel,
    });
  } catch (error) {
    console.warn('webpack-bundle-analyzer not installed. Skipping bundle analysis.');
    console.warn('Install with: npm install --save-dev webpack-bundle-analyzer');
    return null;
  }
}

// =============================================================================
// Next.js Integration
// =============================================================================

interface NextConfig {
  [key: string]: any;
}

/**
 * Wraps Next.js config with bundle analyzer support
 * 
 * @example
 * // next.config.js
 * const { withBundleAnalyzer } = require('./src/lib/analyze-bundle');
 * 
 * module.exports = withBundleAnalyzer({
 *   reactStrictMode: true,
 *   // ... other config
 * });
 */
export function withBundleAnalyzer(nextConfig: NextConfig = {}): NextConfig {
  return {
    ...nextConfig,
    webpack: (config: Configuration, options: any) => {
      // Call original webpack config if exists
      if (nextConfig.webpack) {
        config = nextConfig.webpack(config, options);
      }

      // Add bundle analyzer plugin
      const plugin = createBundleAnalyzerPlugin();
      if (plugin && config.plugins) {
        config.plugins.push(plugin);
      }

      return config;
    },
  };
}

// =============================================================================
// Performance Budgets
// =============================================================================

interface PerformanceBudget {
  /** Bundle name pattern */
  name: string;
  /** Maximum size in KB */
  maxSize: number;
  /** Warning threshold in KB */
  warnSize?: number;
}

/**
 * Default performance budgets for common chunk types
 */
export const DEFAULT_BUDGETS: PerformanceBudget[] = [
  { name: 'framework', maxSize: 60, warnSize: 50 },       // React, Next.js
  { name: 'lib-react', maxSize: 50, warnSize: 40 },       // React ecosystem
  { name: 'lib-lodash', maxSize: 30, warnSize: 20 },      // Lodash (if used)
  { name: 'lib-moment', maxSize: 100, warnSize: 80 },     // Moment.js (replace with date-fns!)
  { name: 'lib-recharts', maxSize: 150, warnSize: 120 },  // Charts library
  { name: 'lib-framer', maxSize: 80, warnSize: 60 },      // Framer Motion
  { name: 'lib-dnd', maxSize: 50, warnSize: 40 },         // @dnd-kit
  { name: 'main', maxSize: 200, warnSize: 150 },          // Main application code
  { name: 'pages/_app', maxSize: 100, warnSize: 80 },     // App component
  { name: 'pages/', maxSize: 100, warnSize: 80 },         // Individual pages
];

interface BudgetCheckResult {
  passed: boolean;
  name: string;
  size: number;
  maxSize: number;
  warnSize: number;
  status: 'pass' | 'warn' | 'fail';
}

/**
 * Check bundle stats against performance budgets
 * 
 * @example
 * import { checkPerformanceBudgets, DEFAULT_BUDGETS } from '@/lib/analyze-bundle';
 * 
 * const stats = require('./.next/stats.json');
 * const results = checkPerformanceBudgets(stats, DEFAULT_BUDGETS);
 * 
 * results.forEach(result => {
 *   if (result.status === 'fail') {
 *     console.error(`❌ ${result.name}: ${result.size}KB exceeds ${result.maxSize}KB`);
 *   }
 * });
 */
export function checkPerformanceBudgets(
  stats: any,
  budgets: PerformanceBudget[] = DEFAULT_BUDGETS
): BudgetCheckResult[] {
  if (!stats || !stats.chunks) {
    console.warn('Invalid stats file provided');
    return [];
  }

  const results: BudgetCheckResult[] = [];

  stats.chunks.forEach((chunk: any) => {
    const chunkName = chunk.names?.[0] || chunk.id;
    const sizeKB = (chunk.size / 1024).toFixed(2);
    const sizeNum = parseFloat(sizeKB);

    // Find matching budget
    const budget = budgets.find((b) => {
      // Exact match
      if (b.name === chunkName) return true;
      // Pattern match
      if (b.name.includes('*')) {
        const pattern = b.name.replace(/\*/g, '.*');
        const regex = new RegExp(pattern);
        return regex.test(chunkName);
      }
      return false;
    });

    if (budget) {
      const warnSize = budget.warnSize || budget.maxSize * 0.8;
      const status: 'pass' | 'warn' | 'fail' =
        sizeNum > budget.maxSize ? 'fail' : sizeNum > warnSize ? 'warn' : 'pass';

      results.push({
        passed: status !== 'fail',
        name: chunkName,
        size: sizeNum,
        maxSize: budget.maxSize,
        warnSize,
        status,
      });
    }
  });

  return results;
}

// =============================================================================
// Bundle Analysis Utilities
// =============================================================================

interface ChunkAnalysis {
  id: string | number;
  name: string;
  size: number;
  sizeKB: string;
  modules: number;
  files: string[];
}

/**
 * Analyze webpack stats and extract chunk information
 */
export function analyzeChunks(stats: any): ChunkAnalysis[] {
  if (!stats || !stats.chunks) {
    return [];
  }

  return stats.chunks.map((chunk: any) => ({
    id: chunk.id,
    name: chunk.names?.[0] || chunk.id,
    size: chunk.size,
    sizeKB: (chunk.size / 1024).toFixed(2),
    modules: chunk.modules?.length || 0,
    files: chunk.files || [],
  }));
}

/**
 * Find duplicate dependencies across chunks
 */
export function findDuplicateDependencies(stats: any): Record<string, string[]> {
  if (!stats || !stats.chunks) {
    return {};
  }

  const moduleMap: Record<string, Set<string>> = {};

  stats.chunks.forEach((chunk: any) => {
    const chunkName = chunk.names?.[0] || chunk.id;
    
    chunk.modules?.forEach((module: any) => {
      const name = module.name || module.identifier;
      if (!name) return;

      if (!moduleMap[name]) {
        moduleMap[name] = new Set();
      }
      moduleMap[name].add(chunkName);
    });
  });

  // Filter for modules in multiple chunks
  const duplicates: Record<string, string[]> = {};
  Object.entries(moduleMap).forEach(([moduleName, chunks]) => {
    if (chunks.size > 1) {
      duplicates[moduleName] = Array.from(chunks);
    }
  });

  return duplicates;
}

/**
 * Get largest chunks for optimization targets
 */
export function getLargestChunks(stats: any, limit: number = 10): ChunkAnalysis[] {
  const chunks = analyzeChunks(stats);
  return chunks
    .sort((a, b) => b.size - a.size)
    .slice(0, limit);
}

// =============================================================================
// CLI Script
// =============================================================================

/**
 * Run bundle analysis from CLI
 * Usage: npx ts-node src/lib/analyze-bundle.ts
 */
if (require.main === module) {
  const fs = require('fs');
  const path = require('path');

  const statsPath = path.join(process.cwd(), '.next', 'stats.json');

  if (!fs.existsSync(statsPath)) {
    console.error('❌ Stats file not found. Run build with ANALYZE=true first.');
    console.error('   ANALYZE=true npm run build');
    process.exit(1);
  }

  const stats = JSON.parse(fs.readFileSync(statsPath, 'utf-8'));

  console.log('\n📦 Bundle Analysis\n');
  console.log('=' .repeat(50));

  // Largest chunks
  console.log('\n🔍 Top 10 Largest Chunks:');
  const largest = getLargestChunks(stats, 10);
  largest.forEach((chunk, i) => {
    console.log(`  ${i + 1}. ${chunk.name}: ${chunk.sizeKB} KB (${chunk.modules} modules)`);
  });

  // Performance budgets
  console.log('\n📏 Performance Budget Check:');
  const budgetResults = checkPerformanceBudgets(stats, DEFAULT_BUDGETS);
  let hasFailures = false;

  budgetResults.forEach((result) => {
    const icon = result.status === 'pass' ? '✅' : result.status === 'warn' ? '⚠️' : '❌';
    console.log(`  ${icon} ${result.name}: ${result.size.toFixed(2)} KB`);
    if (result.status === 'fail') hasFailures = true;
  });

  // Duplicate dependencies
  console.log('\n🔄 Duplicate Dependencies:');
  const duplicates = findDuplicateDependencies(stats);
  const duplicateEntries = Object.entries(duplicates);
  
  if (duplicateEntries.length === 0) {
    console.log('  ✅ No duplicates found');
  } else {
    duplicateEntries.slice(0, 10).forEach(([module, chunks]) => {
      console.log(`  ⚠️ ${module}`);
      console.log(`     Found in: ${chunks.join(', ')}`);
    });
    
    if (duplicateEntries.length > 10) {
      console.log(`  ... and ${duplicateEntries.length - 10} more`);
    }
  }

  console.log('\n' + '='.repeat(50));

  if (hasFailures) {
    console.log('\n❌ Some bundles exceed performance budgets!');
    process.exit(1);
  } else {
    console.log('\n✅ All bundles within performance budgets!');
    process.exit(0);
  }
}

export default {
  createBundleAnalyzerPlugin,
  withBundleAnalyzer,
  checkPerformanceBudgets,
  analyzeChunks,
  findDuplicateDependencies,
  getLargestChunks,
  DEFAULT_BUDGETS,
};
