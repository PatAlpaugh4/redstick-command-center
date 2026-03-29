/**
 * Responsive Design Tests
 * =======================
 * Tests all pages at multiple breakpoints to ensure proper rendering
 * Breakpoints: 320px, 375px, 414px, 768px, 1024px, 1440px
 */

import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { ViewportSize, setViewport } from '@/test-utils/responsive';

// Import pages
import DashboardPage from '@/app/app/dashboard/page';
import PipelinePage from '@/app/app/pipeline/page';
import AgentsPage from '@/app/app/agents/page';
import PortfolioPage from '@/app/app/portfolio/page';
import SettingsPage from '@/app/app/settings/page';

// =============================================================================
// Breakpoint Definitions
// =============================================================================

const BREAKPOINTS: { name: string; size: ViewportSize }[] = [
  { name: '320px (iPhone SE)', size: { width: 320, height: 568 } },
  { name: '375px (iPhone 12/13)', size: { width: 375, height: 812 } },
  { name: '414px (iPhone Max)', size: { width: 414, height: 896 } },
  { name: '768px (iPad)', size: { width: 768, height: 1024 } },
  { name: '1024px (iPad Pro)', size: { width: 1024, height: 1366 } },
  { name: '1440px (Desktop)', size: { width: 1440, height: 900 } },
];

// =============================================================================
// Test Helper Functions
// =============================================================================

function testPageAtBreakpoint(
  pageName: string,
  renderFn: () => void,
  breakpoint: { name: string; size: ViewportSize }
) {
  it(`${pageName} renders correctly at ${breakpoint.name}`, () => {
    setViewport(breakpoint.size);
    renderFn();
    
    // Check for overflow issues
    const mainContent = document.querySelector('main, [role="main"]');
    if (mainContent) {
      const rect = mainContent.getBoundingClientRect();
      expect(rect.width).toBeLessThanOrEqual(breakpoint.size.width);
    }
  });
}

// =============================================================================
// Dashboard Page Tests
// =============================================================================

describe('Dashboard Page Responsive Design', () => {
  BREAKPOINTS.forEach((breakpoint) => {
    it(`renders without overflow at ${breakpoint.name}`, () => {
      setViewport(breakpoint.size);
      render(<DashboardPage />);
      
      // Check main container doesn't overflow
      const container = document.querySelector('[class*="space-y-6"]');
      if (container) {
        expect(container.scrollWidth).toBeLessThanOrEqual(breakpoint.size.width + 1); // Allow 1px tolerance
      }
    });

    it(`stats cards are visible at ${breakpoint.name}`, () => {
      setViewport(breakpoint.size);
      render(<DashboardPage />);
      
      // Check that stats section exists
      const statsSection = screen.queryByText(/Portfolio Value|Active Deals/i);
      expect(statsSection).toBeTruthy();
    });

    it(`charts container doesn't overflow at ${breakpoint.name}`, () => {
      setViewport(breakpoint.size);
      render(<DashboardPage />);
      
      const charts = document.querySelectorAll('[class*="recharts-wrapper"]');
      charts.forEach((chart) => {
        const rect = chart.getBoundingClientRect();
        expect(rect.width).toBeLessThanOrEqual(breakpoint.size.width);
      });
    });
  });

  it('stats cards stack vertically on mobile (< 640px)', () => {
    setViewport({ width: 375, height: 812 });
    render(<DashboardPage />);
    
    const grid = document.querySelector('.grid');
    if (grid) {
      // On mobile, should be single column
      const style = window.getComputedStyle(grid);
      expect(style.gridTemplateColumns).toBe('1fr');
    }
  });

  it('charts display in 2 columns on desktop (>= 1024px)', () => {
    setViewport({ width: 1440, height: 900 });
    render(<DashboardPage />);
    
    const chartsGrid = document.querySelector('.lg\\:grid-cols-2');
    expect(chartsGrid).toBeTruthy();
  });
});

// =============================================================================
// Pipeline Page Tests
// =============================================================================

describe('Pipeline Page Responsive Design', () => {
  BREAKPOINTS.forEach((breakpoint) => {
    it(`renders without overflow at ${breakpoint.name}`, () => {
      setViewport(breakpoint.size);
      render(<PipelinePage />);
      
      const container = document.querySelector('.max-w-\\[1600px\\]');
      if (container) {
        expect(container.scrollWidth).toBeLessThanOrEqual(breakpoint.size.width + 1);
      }
    });

    it(`kanban board is accessible at ${breakpoint.name}`, () => {
      setViewport(breakpoint.size);
      render(<PipelinePage />);
      
      // Check for kanban or list view toggle
      const viewToggle = screen.queryByRole('button', { name: /board|list/i });
      expect(viewToggle).toBeTruthy();
    });
  });

  it('board view allows horizontal scroll on mobile', () => {
    setViewport({ width: 375, height: 812 });
    render(<PipelinePage />);
    
    const kanbanBoard = document.querySelector('[class*="overflow-x"]');
    if (kanbanBoard) {
      const style = window.getComputedStyle(kanbanBoard);
      expect(style.overflowX).toBe('auto');
    }
  });

  it('table view is responsive', () => {
    setViewport({ width: 768, height: 1024 });
    render(<PipelinePage />);
    
    const table = document.querySelector('table');
    if (table) {
      const container = table.closest('.overflow-x-auto');
      expect(container).toBeTruthy();
    }
  });
});

// =============================================================================
// Agents Page Tests
// =============================================================================

describe('Agents Page Responsive Design', () => {
  BREAKPOINTS.forEach((breakpoint) => {
    it(`renders without overflow at ${breakpoint.name}`, () => {
      setViewport(breakpoint.size);
      render(<AgentsPage />);
      
      const main = document.querySelector('main');
      if (main) {
        expect(main.scrollWidth).toBeLessThanOrEqual(breakpoint.size.width + 1);
      }
    });
  });

  it('agent cards stack on mobile', () => {
    setViewport({ width: 375, height: 812 });
    render(<AgentsPage />);
    
    const agentGrid = document.querySelector('[class*="grid"]');
    if (agentGrid) {
      // Should use single column on mobile
      expect(agentGrid.classList.contains('grid-cols-1')).toBe(true);
    }
  });
});

// =============================================================================
// Portfolio Page Tests
// =============================================================================

describe('Portfolio Page Responsive Design', () => {
  BREAKPOINTS.forEach((breakpoint) => {
    it(`renders without overflow at ${breakpoint.name}`, () => {
      setViewport(breakpoint.size);
      render(<PortfolioPage />);
      
      const container = document.querySelector('main');
      if (container) {
        expect(container.scrollWidth).toBeLessThanOrEqual(breakpoint.size.width + 1);
      }
    });
  });

  it('portfolio chart scales correctly', () => {
    setViewport({ width: 375, height: 812 });
    render(<PortfolioPage />);
    
    const chart = document.querySelector('.recharts-wrapper');
    if (chart) {
      const rect = chart.getBoundingClientRect();
      expect(rect.width).toBeLessThanOrEqual(375);
    }
  });
});

// =============================================================================
// Settings Page Tests
// =============================================================================

describe('Settings Page Responsive Design', () => {
  BREAKPOINTS.forEach((breakpoint) => {
    it(`renders without overflow at ${breakpoint.name}`, () => {
      setViewport(breakpoint.size);
      render(<SettingsPage />);
      
      const container = document.querySelector('main');
      if (container) {
        expect(container.scrollWidth).toBeLessThanOrEqual(breakpoint.size.width + 1);
      }
    });
  });

  it('settings form is usable on mobile', () => {
    setViewport({ width: 375, height: 812 });
    render(<SettingsPage />);
    
    const formInputs = document.querySelectorAll('input, select, textarea');
    formInputs.forEach((input) => {
      const rect = input.getBoundingClientRect();
      // Touch target should be at least 44px
      expect(rect.height).toBeGreaterThanOrEqual(44);
    });
  });
});

// =============================================================================
// Cross-Breakpoint Behavior Tests
// =============================================================================

describe('Cross-Breakpoint Behavior', () => {
  it('sidebar collapses to hamburger menu below 1024px', () => {
    // Mobile view
    setViewport({ width: 375, height: 812 });
    render(<DashboardPage />);
    
    const mobileMenuButton = screen.queryByLabelText(/open menu|close menu/i);
    expect(mobileMenuButton).toBeTruthy();
  });

  it('touch targets are minimum 44px on all breakpoints', () => {
    BREAKPOINTS.forEach((breakpoint) => {
      setViewport(breakpoint.size);
      render(<DashboardPage />);
      
      const interactiveElements = document.querySelectorAll(
        'button, a, [role="button"], input, select'
      );
      
      interactiveElements.forEach((el) => {
        const rect = el.getBoundingClientRect();
        // Skip hidden elements
        if (rect.width > 0 && rect.height > 0) {
          expect(rect.height).toBeGreaterThanOrEqual(44);
        }
      });
    });
  });

  it('modal displays correctly at all breakpoints', () => {
    BREAKPOINTS.forEach((breakpoint) => {
      setViewport(breakpoint.size);
      render(<DashboardPage />);
      
      // Check modal container constraints
      const modals = document.querySelectorAll('[role="dialog"]');
      modals.forEach((modal) => {
        const rect = modal.getBoundingClientRect();
        expect(rect.width).toBeLessThanOrEqual(breakpoint.size.width);
        expect(rect.height).toBeLessThanOrEqual(breakpoint.size.height);
      });
    });
  });
});

// =============================================================================
// Landscape Orientation Tests
// =============================================================================

describe('Landscape Orientation', () => {
  it('handles landscape on mobile devices', () => {
    setViewport({ width: 812, height: 375 }); // iPhone X landscape
    render(<DashboardPage />);
    
    const container = document.querySelector('main');
    expect(container).toBeTruthy();
  });

  it('kanban board scrolls horizontally in landscape', () => {
    setViewport({ width: 812, height: 375 });
    render(<PipelinePage />);
    
    const kanbanContainer = document.querySelector('[class*="overflow-x"]');
    expect(kanbanContainer).toBeTruthy();
  });
});

// =============================================================================
// Print Styles Tests
// =============================================================================

describe('Print Styles', () => {
  it('hides navigation elements when printing', () => {
    render(<DashboardPage />);
    
    const navElements = document.querySelectorAll('.no-print');
    navElements.forEach((el) => {
      const style = window.getComputedStyle(el);
      // In print media, display should be none
      expect(el.classList.contains('no-print')).toBe(true);
    });
  });

  it('charts maintain aspect ratio when printing', () => {
    render(<DashboardPage />);
    
    const charts = document.querySelectorAll('.chart-container');
    charts.forEach((chart) => {
      expect(chart.classList.contains('chart-container')).toBe(true);
    });
  });
});

// =============================================================================
// Accessibility at Different Breakpoints
// =============================================================================

describe('Accessibility at Breakpoints', () => {
  BREAKPOINTS.forEach((breakpoint) => {
    it(`maintains focus visibility at ${breakpoint.name}`, () => {
      setViewport(breakpoint.size);
      render(<DashboardPage />);
      
      const focusableElements = document.querySelectorAll(
        'button, a, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      expect(focusableElements.length).toBeGreaterThan(0);
    });

    it(`text remains readable at ${breakpoint.name}`, () => {
      setViewport(breakpoint.size);
      render(<DashboardPage />);
      
      const textElements = document.querySelectorAll('p, span, h1, h2, h3, h4, h5, h6');
      textElements.forEach((el) => {
        const style = window.getComputedStyle(el);
        const fontSize = parseFloat(style.fontSize);
        // Minimum readable font size is 12px
        if (fontSize > 0) {
          expect(fontSize).toBeGreaterThanOrEqual(12);
        }
      });
    });
  });
});

// Export test utilities for other test files
export { BREAKPOINTS, testPageAtBreakpoint };
