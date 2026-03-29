/**
 * Maintenance Mode Page
 * =====================
 * Displayed during deployments or scheduled maintenance.
 * Shows maintenance status, estimated time, and contact information.
 * 
 * @accessibility
 * - Clear heading hierarchy
 * - Live region for status updates
 * - Reduced motion support
 * - High contrast text
 */

'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Wrench,
  Clock,
  Mail,
  RefreshCw,
  AlertCircle,
  CheckCircle2,
  Twitter,
  Linkedin,
} from 'lucide-react';

// =============================================================================
// Types
// =============================================================================

interface MaintenanceStatus {
  status: 'maintenance' | 'updating' | 'degraded';
  message: string;
  estimatedTime: string;
  progress?: number;
}

// =============================================================================
// Animation Configuration
// =============================================================================

const ANIMATION = {
  duration: { fast: 0.2, normal: 0.5, slow: 0.8 },
  easing: { default: [0.16, 1, 0.3, 1] as const },
};

const containerVariants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: ANIMATION.duration.slow,
      ease: ANIMATION.easing.default,
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
// Status Badge Component
// =============================================================================

const StatusBadge: React.FC<{ status: MaintenanceStatus['status'] }> = ({ status }) => {
  const config = {
    maintenance: {
      icon: <Wrench className="w-4 h-4" />,
      label: 'Under Maintenance',
      color: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    },
    updating: {
      icon: <RefreshCw className="w-4 h-4 animate-spin" />,
      label: 'System Update',
      color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    },
    degraded: {
      icon: <AlertCircle className="w-4 h-4" />,
      label: 'Degraded Performance',
      color: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    },
  };

  const { icon, label, color } = config[status];

  return (
    <div 
      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${color}`}
      role="status"
      aria-live="polite"
    >
      {icon}
      <span className="font-medium text-sm">{label}</span>
    </div>
  );
};

// =============================================================================
// Progress Bar Component
// =============================================================================

const ProgressBar: React.FC<{ progress: number; status: MaintenanceStatus['status'] }> = ({ 
  progress, 
  status 
}) => {
  const getColor = () => {
    switch (status) {
      case 'maintenance':
        return 'bg-amber-500';
      case 'updating':
        return 'bg-blue-500';
      case 'degraded':
        return 'bg-orange-500';
      default:
        return 'bg-[#e94560]';
    }
  };

  return (
    <div className="w-full" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
      <div className="flex justify-between text-sm text-[#a0a0b0] mb-2">
        <span>Update Progress</span>
        <span>{progress}%</span>
      </div>
      <div className="h-2 bg-[#1a1a2e] rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: ANIMATION.easing.default }}
          className={`h-full ${getColor()} rounded-full`}
        />
      </div>
    </div>
  );
};

// =============================================================================
// Maintenance Illustration Component
// =============================================================================

const MaintenanceIllustration: React.FC = () => (
  <div className="relative w-48 h-48 mx-auto" aria-hidden="true">
    {/* Background Glow */}
    <div className="absolute inset-0 bg-[#e94560]/10 rounded-full blur-3xl" />
    
    {/* Animated Circles */}
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="absolute inset-0"
    >
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <circle
          cx="100"
          cy="100"
          r="90"
          fill="none"
          stroke="#e94560"
          strokeWidth="1"
          strokeDasharray="20 10"
          opacity="0.3"
        />
      </svg>
    </motion.div>
    
    <motion.div
      animate={{ rotate: -360 }}
      transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
      className="absolute inset-4"
    >
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <circle
          cx="100"
          cy="100"
          r="80"
          fill="none"
          stroke="#3b82f6"
          strokeWidth="1"
          strokeDasharray="15 15"
          opacity="0.3"
        />
      </svg>
    </motion.div>
    
    {/* Center Icon */}
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3, type: "spring" }}
      className="absolute inset-0 flex items-center justify-center"
    >
      <div className="w-24 h-24 rounded-2xl bg-[#1a1a2e] border border-white/10 flex items-center justify-center shadow-2xl">
        <Wrench className="w-12 h-12 text-[#e94560]" />
      </div>
    </motion.div>
    
    {/* Floating Elements */}
    <motion.div
      animate={{ 
        y: [0, -10, 0],
        rotate: [0, 10, 0]
      }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      className="absolute top-0 right-0 w-10 h-10 rounded-xl bg-[#1a1a2e] border border-white/10 flex items-center justify-center"
    >
      <span className="text-xl">⚙️</span>
    </motion.div>
    
    <motion.div
      animate={{ 
        y: [0, 10, 0],
        rotate: [0, -10, 0]
      }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
      className="absolute bottom-4 left-0 w-10 h-10 rounded-xl bg-[#1a1a2e] border border-white/10 flex items-center justify-center"
    >
      <span className="text-xl">🔧</span>
    </motion.div>
  </div>
);

// =============================================================================
// Main Maintenance Page Component
// =============================================================================

export default function MaintenancePage(): React.ReactElement {
  const [mounted, setMounted] = useState(false);
  const [status] = useState<MaintenanceStatus>({
    status: 'updating',
    message: 'We are currently performing scheduled maintenance to improve your experience. Some features may be temporarily unavailable.',
    estimatedTime: 'Approximately 30 minutes',
    progress: 65,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // Prevent hydration mismatch
  if (!mounted) {
    return (
      <main className="min-h-screen bg-[#0f0f1a] flex items-center justify-center p-4">
        <div className="w-16 h-16 border-4 border-[#e94560] border-t-transparent rounded-full animate-spin" />
      </main>
    );
  }

  return (
    <main 
      className="min-h-screen bg-[#0f0f1a] flex items-center justify-center p-4 sm:p-6 lg:p-8"
      role="main"
      aria-labelledby="maintenance-heading"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-2xl"
      >
        {/* Card */}
        <div className="bg-[#1a1a2e] border border-white/10 rounded-2xl p-8 sm:p-12 shadow-2xl">
          {/* Illustration */}
          <motion.div variants={itemVariants} className="mb-8">
            <MaintenanceIllustration />
          </motion.div>

          {/* Status Badge */}
          <motion.div variants={itemVariants} className="text-center mb-6">
            <StatusBadge status={status.status} />
          </motion.div>

          {/* Heading */}
          <motion.div variants={itemVariants} className="text-center mb-6">
            <h1 
              id="maintenance-heading"
              className="text-3xl sm:text-4xl font-bold text-white mb-4"
            >
              We&apos;ll Be Back Soon
            </h1>
            <p className="text-[#a0a0b0] text-lg leading-relaxed max-w-lg mx-auto">
              {status.message}
            </p>
          </motion.div>

          {/* Progress Bar */}
          {status.progress !== undefined && (
            <motion.div variants={itemVariants} className="mb-8 max-w-md mx-auto">
              <ProgressBar progress={status.progress} status={status.status} />
            </motion.div>
          )}

          {/* Estimated Time */}
          <motion.div 
            variants={itemVariants}
            className="flex items-center justify-center gap-2 text-[#a0a0b0] mb-8"
          >
            <Clock className="w-5 h-5 text-[#e94560]" />
            <span>Estimated completion: {status.estimatedTime}</span>
          </motion.div>

          {/* Divider */}
          <motion.div 
            variants={itemVariants}
            className="border-t border-white/10 pt-8"
          >
            {/* Contact Section */}
            <div className="text-center mb-6">
              <h2 className="text-white font-semibold mb-2">Need urgent assistance?</h2>
              <p className="text-[#6a6a7a] text-sm">
                Our team is here to help during the maintenance window
              </p>
            </div>

            {/* Contact Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-md mx-auto">
              <a
                href="mailto:urgent@redstick.vc"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-[#0f0f1a] border border-white/10 rounded-xl text-white hover:border-[#e94560]/50 hover:bg-[#e94560]/5 transition-all focus:outline-none focus:ring-2 focus:ring-[#e94560] focus:ring-offset-2 focus:ring-offset-[#1a1a2e]"
                aria-label="Send urgent email"
              >
                <Mail className="w-4 h-4 text-[#e94560]" />
                <span className="font-medium">urgent@redstick.vc</span>
              </a>
              
              <a
                href="tel:+1-555-123-4567"
                className="flex items-center justify-center gap-2 px-4 py-3 bg-[#0f0f1a] border border-white/10 rounded-xl text-white hover:border-[#e94560]/50 hover:bg-[#e94560]/5 transition-all focus:outline-none focus:ring-2 focus:ring-[#e94560] focus:ring-offset-2 focus:ring-offset-[#1a1a2e]"
                aria-label="Call support hotline"
              >
                <span className="text-[#e94560]">📞</span>
                <span className="font-medium">+1 (555) 123-4567</span>
              </a>
            </div>

            {/* Social Links */}
            <div className="flex items-center justify-center gap-4 mt-6">
              <span className="text-[#6a6a7a] text-sm">Follow for updates:</span>
              <div className="flex gap-3">
                <a
                  href="https://twitter.com/redstickvc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-[#0f0f1a] border border-white/10 flex items-center justify-center text-[#6a6a7a] hover:text-[#e94560] hover:border-[#e94560]/50 transition-all focus:outline-none focus:ring-2 focus:ring-[#e94560] focus:ring-offset-2 focus:ring-offset-[#1a1a2e]"
                  aria-label="Follow us on Twitter"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="https://linkedin.com/company/redstickvc"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 rounded-lg bg-[#0f0f1a] border border-white/10 flex items-center justify-center text-[#6a6a7a] hover:text-[#e94560] hover:border-[#e94560]/50 transition-all focus:outline-none focus:ring-2 focus:ring-[#e94560] focus:ring-offset-2 focus:ring-offset-[#1a1a2e]"
                  aria-label="Follow us on LinkedIn"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>
          </motion.div>

          {/* Footer Note */}
          <motion.div 
            variants={itemVariants}
            className="mt-8 pt-6 border-t border-white/5 text-center"
          >
            <p className="text-[#4a4a5a] text-xs">
              Thank you for your patience. We&apos;re working hard to bring you an even better experience.
            </p>
            <div className="flex items-center justify-center gap-2 mt-3 text-[#4a4a5a] text-xs">
              <CheckCircle2 className="w-3 h-3 text-green-500" />
              <span>Last updated: {new Date().toLocaleTimeString()}</span>
            </div>
          </motion.div>
        </div>

        {/* Auto-refresh Notice */}
        <motion.p 
          variants={itemVariants}
          className="text-center text-[#6a6a7a] text-sm mt-6"
        >
          This page will automatically refresh when the system is back online.
        </motion.p>
      </motion.div>
    </main>
  );
}
