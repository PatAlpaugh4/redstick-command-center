"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Home, Search, ArrowLeft, Compass, LayoutDashboard, Briefcase, Building2, Settings, HelpCircle } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        {/* Animated Compass Icon */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="w-24 h-24 mx-auto bg-surface rounded-2xl border border-border flex items-center justify-center">
            <Compass className="w-12 h-12 text-accent" />
          </div>
        </motion.div>

        {/* 404 Text */}
        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="text-6xl font-bold text-text-primary mb-4"
        >
          404
        </motion.h1>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-text-secondary mb-2"
        >
          Page not found
        </motion.p>

        <motion.p
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-text-tertiary mb-8"
        >
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </motion.p>

        {/* Search */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
            <input
              type="text"
              placeholder="Search for pages..."
              className="w-full pl-10 pr-4 py-3 bg-surface border border-border rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent"
            />
          </div>
        </motion.div>

        {/* Quick Links */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="grid grid-cols-2 gap-3 mb-8"
        >
          <Link href="/app">
            <Button variant="secondary" className="w-full justify-start">
              <LayoutDashboard className="w-4 h-4 mr-2" />
              Dashboard
            </Button>
          </Link>
          <Link href="/app/pipeline">
            <Button variant="secondary" className="w-full justify-start">
              <Briefcase className="w-4 h-4 mr-2" />
              Pipeline
            </Button>
          </Link>
          <Link href="/app/portfolio">
            <Button variant="secondary" className="w-full justify-start">
              <Building2 className="w-4 h-4 mr-2" />
              Portfolio
            </Button>
          </Link>
          <Link href="/app/settings">
            <Button variant="secondary" className="w-full justify-start">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </Link>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center justify-center gap-4"
        >
          <Button onClick={() => window.history.back()} variant="ghost">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back
          </Button>
          <Link href="/">
            <Button>
              <Home className="w-4 h-4 mr-2" />
              Home
            </Button>
          </Link>
        </motion.div>

        {/* Help */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="mt-8 text-sm text-text-tertiary"
        >
          Need help?{" "}
          <Link href="/contact" className="text-accent hover:underline">
            Contact support
          </Link>
          {" "}or{" "}
          <Link href="/help" className="text-accent hover:underline">
            visit our help center
          </Link>
        </motion.p>
      </div>
    </div>
  );
}
