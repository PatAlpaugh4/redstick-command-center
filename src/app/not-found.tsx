/**
 * Not Found Page (404)
 * ====================
 * Beautiful 404 error page with illustration, helpful message,
 * common page links, and search suggestion.
 * 
 * @accessibility
 * - Proper heading hierarchy with h1
 * - ARIA labels for navigation
 * - Focus visible states on all interactive elements
 * - Reduced motion support
 */

'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Home,
  Search,
  ArrowLeft,
  FileText,
  Users,
  BarChart3,
  Settings,
  HelpCircle,
  Compass,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';

// =============================================================================
// Animation Configuration
// =============================================================================

const ANIMATION = {
  duration: { fast: 0.2, normal: 0.5, slow: 0.8 },
  easing: { default: [0.16, 1, 0.3, 1] as const },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: ANIMATION.duration.normal,
      ease: ANIMATION.easing.default,
    },
  },
};

// =============================================================================
// Types
// =============================================================================

interface QuickLinkProps {
  href: string;
  icon: React.ReactNode;
  label: string;
  description: string;
}

// =============================================================================
// Quick Link Component
// =============================================================================

const QuickLink: React.FC<QuickLinkProps> = ({ href, icon, label, description }) => (
  <Link
    href={href}
    className="group flex items-start gap-4 p-4 rounded-xl bg-[#1a1a2e] border border-white/10 hover:border-[#e94560]/50 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[#e94560] focus:ring-offset-2 focus:ring-offset-[#0f0f1a]"
    aria-label={`Navigate to ${label}: ${description}`}
  >
    <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-[#e94560]/10 flex items-center justify-center group-hover:bg-[#e94560]/20 transition-colors">
      <span className="text-[#e94560]">{icon}</span>
    </div>
    <div className="flex-1 min-w-0">
      <h3 className="text-white font-medium group-hover:text-[#e94560] transition-colors">
        {label}
      </h3>
      <p className="text-[#6a6a7a] text-sm truncate">{description}</p>
    </div>
  </Link>
);

// =============================================================================
// 404 Illustration Component
// =============================================================================

const NotFoundIllustration: React.FC = () => (
  <div className="relative w-64 h-64 mx-auto" aria-hidden="true">
    {/* Background Glow */}
    <div className="absolute inset-0 bg-[#e94560]/20 rounded-full blur-3xl" />
    
    {/* Main Illustration */}
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.8, ease: ANIMATION.easing.default }}
      className="relative z-10 w-full h-full"
    >
      <svg viewBox="0 0 200 200" className="w-full h-full">
        {/* Outer Circle */}
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke="#e94560"
          strokeWidth="2"
          strokeDasharray="8 4"
          opacity="0.3"
        />
        
        {/* Inner Circle */}
        <circle
          cx="100"
          cy="100"
          r="70"
          fill="#1a1a2e"
          stroke="#e94560"
          strokeWidth="2"
        />
        
        {/* 404 Text */}
        <text
          x="100"
          y="95"
          textAnchor="middle"
          fill="#e94560"
          fontSize="48"
          fontWeight="bold"
          fontFamily="system-ui"
        >
          404
        </text>
        
        {/* Compass Icon */}
        <g transform="translate(85, 105)">
          <Compass className="w-8 h-8 text-[#e94560]" />
        </g>
        
        {/* Decorative Dots */}
        <circle cx="40" cy="60" r="4" fill="#e94560" opacity="0.6">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
        </circle>
        <circle cx="160" cy="60" r="4" fill="#e94560" opacity="0.6">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" begin="0.5s" repeatCount="indefinite" />
        </circle>
        <circle cx="40" cy="140" r="4" fill="#e94560" opacity="0.6">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" begin="1s" repeatCount="indefinite" />
        </circle>
        <circle cx="160" cy="140" r="4" fill="#e94560" opacity="0.6">
          <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" begin="1.5s" repeatCount="indefinite" />
        </circle>
      </svg>
    </motion.div>
    
    {/* Floating Elements */}
    <motion.div
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-0 right-0 w-8 h-8 rounded-lg bg-[#1a1a2e] border border-white/10 flex items-center justify-center"
    >
      <span className="text-lg">🚀</span>
    </motion.div>
    
    <motion.div
      animate={{ y: [0, 10, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      className="absolute bottom-4 left-0 w-8 h-8 rounded-lg bg-[#1a1a2e] border border-white/10 flex items-center justify-center"
    >
      <span className="text-lg">💼</span>
    </motion.div>
  </div>
);

// =============================================================================
// Main 404 Page Component
// =============================================================================

export default function NotFoundPage(): React.ReactElement {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (e: React.FormEvent): void => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/app/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleGoBack = (): void => {
    router.back();
  };

  const quickLinks: QuickLinkProps[] = [
    {
      href: '/app',
      icon: <Home className="w-5 h-5" />,
      label: 'Dashboard',
      description: 'View your portfolio overview and key metrics',
    },
    {
      href: '/app/deals',
      icon: <FileText className="w-5 h-5" />,
      label: 'Deals',
      description: 'Manage your investment pipeline',
    },
    {
      href: '/app/portfolio',
      icon: <BarChart3 className="w-5 h-5" />,
      label: 'Portfolio',
      description: 'Track portfolio company performance',
    },
    {
      href: '/app/companies',
      icon: <Users className="w-5 h-5" />,
      label: 'Companies',
      description: 'Browse and manage companies',
    },
    {
      href: '/app/settings',
      icon: <Settings className="w-5 h-5" />,
      label: 'Settings',
      description: 'Configure your account preferences',
    },
    {
      href: '/app/help',
      icon: <HelpCircle className="w-5 h-5" />,
      label: 'Help Center',
      description: 'Get help and documentation',
    },
  ];

  return (
    <main 
      className="min-h-screen bg-[#0f0f1a] flex items-center justify-center p-4 sm:p-6 lg:p-8"
      role="main"
      aria-labelledby="error-heading"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-4xl"
      >
        {/* Illustration */}
        <motion.div variants={itemVariants} className="mb-8">
          <NotFoundIllustration />
        </motion.div>

        {/* Error Message */}
        <motion.div variants={itemVariants} className="text-center mb-8">
          <h1 
            id="error-heading"
            className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4"
          >
            Page Not Found
          </h1>
          <p className="text-[#a0a0b0] text-lg sm:text-xl max-w-2xl mx-auto">
            We couldn&apos;t find the page you&apos;re looking for. It might have been moved,
            deleted, or you may have typed the URL incorrectly.
          </p>
        </motion.div>

        {/* Search Box */}
        <motion.div variants={itemVariants} className="max-w-md mx-auto mb-10">
          <form onSubmit={handleSearch} className="relative">
            <label htmlFor="search-input" className="sr-only">
              Search for pages or content
            </label>
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-[#6a6a7a]" />
              <input
                id="search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for pages or content..."
                className="w-full pl-12 pr-4 py-4 bg-[#1a1a2e] border border-white/10 rounded-xl text-white placeholder-[#6a6a7a] focus:outline-none focus:border-[#e94560] focus:ring-2 focus:ring-[#e94560]/20 transition-all"
                aria-label="Search query"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#6a6a7a] hover:text-white transition-colors"
                  aria-label="Clear search"
                >
                  <span aria-hidden="true">&times;</span>
                </button>
              )}
            </div>
            <Button
              type="submit"
              className="w-full mt-3 bg-[#e94560] hover:bg-[#d63d56] text-white py-3 rounded-xl font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#e94560] focus:ring-offset-2 focus:ring-offset-[#0f0f1a]"
              aria-label="Search"
            >
              Search
            </Button>
          </form>
        </motion.div>

        {/* Quick Navigation */}
        <motion.div variants={itemVariants}>
          <h2 className="text-white font-semibold text-lg mb-4 text-center">
            Or try these popular pages
          </h2>
          <nav aria-label="Quick navigation">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {quickLinks.map((link) => (
                <QuickLink key={link.href} {...link} />
              ))}
            </div>
          </nav>
        </motion.div>

        {/* Back Button */}
        <motion.div variants={itemVariants} className="mt-10 text-center">
          <Button
            onClick={handleGoBack}
            variant="outline"
            className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-white hover:bg-white/5 rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-[#e94560] focus:ring-offset-2 focus:ring-offset-[#0f0f1a]"
            aria-label="Go back to previous page"
          >
            <ArrowLeft className="w-4 h-4" />
            Go Back
          </Button>
        </motion.div>

        {/* Footer */}
        <motion.footer 
          variants={itemVariants}
          className="mt-12 pt-8 border-t border-white/10 text-center"
        >
          <p className="text-[#6a6a7a] text-sm">
            Need help? Contact{' '}
            <a 
              href="mailto:support@redstick.vc" 
              className="text-[#e94560] hover:underline focus:outline-none focus:ring-2 focus:ring-[#e94560] rounded"
            >
              support@redstick.vc
            </a>
          </p>
          <p className="text-[#4a4a5a] text-xs mt-2">
            Error Code: 404 | Page Not Found
          </p>
        </motion.footer>
      </motion.div>
    </main>
  );
}
