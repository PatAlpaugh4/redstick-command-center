/**
 * App Shell
 * =========
 * Unified app container for public pages.
 * Provides header with global search, notifications, and user menu,
 * main content area with proper padding, and footer.
 */

"use client";

import { ReactNode } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Search, Bell, Menu, X } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { useNotifications } from "@/components/providers/NotificationProvider";

interface AppShellProps {
  children: ReactNode;
  showFooter?: boolean;
  className?: string;
}

// =============================================================================
// Global Search Component
// =============================================================================

function GlobalSearch() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(true)}
        aria-label="Open global search"
        className="flex items-center gap-2 px-4 py-2 bg-[#1a1a2e] border border-white/10 rounded-lg text-[#a0a0b0] hover:text-white hover:border-white/20 transition-colors w-full sm:w-64"
      >
        <Search className="w-4 h-4" aria-hidden="true" />
        <span className="text-sm hidden sm:inline">Search...</span>
        <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 text-xs bg-white/5 rounded">
          ⌘K
        </kbd>
      </button>

      {/* Search Modal */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] bg-black/50 backdrop-blur-sm"
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="w-full max-w-xl mx-4 bg-[#1a1a2e] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            role="search"
            aria-label="Global search"
          >
            <div className="flex items-center gap-3 p-4 border-b border-white/10">
              <Search className="w-5 h-5 text-[#a0a0b0]" aria-hidden="true" />
              <input
                type="search"
                placeholder="Search deals, companies, contacts..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="flex-1 bg-transparent text-white placeholder-[#6a6a7a] outline-none"
                autoFocus
                aria-label="Search deals, companies, and contacts"
              />
              <button
                onClick={() => setIsOpen(false)}
                aria-label="Close search"
                className="p-1 hover:bg-white/10 rounded"
              >
                <X className="w-4 h-4 text-[#a0a0b0]" aria-hidden="true" />
              </button>
            </div>
            <div className="p-4">
              <p className="text-sm text-[#6a6a7a]">
                Start typing to search across your dashboard...
              </p>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
}

// =============================================================================
// Notification Bell Component
// =============================================================================

function NotificationBell() {
  const { unreadCount, notifications, markAsRead, markAllAsRead } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={`Notifications ${unreadCount > 0 ? `(${unreadCount} unread)` : ''}`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="relative p-2 text-[#a0a0b0] hover:text-white hover:bg-white/10 rounded-lg transition-colors"
      >
        <Bell className="w-5 h-5" aria-hidden="true" />
        {unreadCount > 0 && (
          <span 
            className="absolute top-1 right-1 w-4 h-4 bg-[#e94560] text-white text-xs rounded-full flex items-center justify-center"
            aria-hidden="true"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 top-full mt-2 w-80 bg-[#1a1a2e] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
            role="region"
            aria-label="Notifications"
          >
            <div className="flex items-center justify-between p-4 border-b border-white/10">
              <h3 id="notifications-heading" className="font-semibold text-white">Notifications</h3>
              {unreadCount > 0 && (
                <button
                  onClick={markAllAsRead}
                  className="text-xs text-[#e94560] hover:text-[#ff6b6b]"
                  aria-describedby="notifications-heading"
                >
                  Mark all read
                </button>
              )}
            </div>
            <div className="max-h-80 overflow-y-auto" role="list" aria-label="Notification list">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-[#6a6a7a]">
                  <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" aria-hidden="true" />
                  <p>No notifications yet</p>
                </div>
              ) : (
                notifications.slice(0, 5).map((notification) => (
                  <button
                    key={notification.id}
                    onClick={() => markAsRead(notification.id)}
                    className={cn(
                      "w-full p-4 text-left border-b border-white/5 hover:bg-white/5 transition-colors",
                      !notification.read && "bg-[#e94560]/5"
                    )}
                    role="listitem"
                    aria-label={`${notification.title}. ${notification.read ? 'Read' : 'Unread'}`}
                  >
                    <p className="text-sm font-medium text-white">
                      {notification.title}
                    </p>
                    <p className="text-xs text-[#a0a0b0] mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-[#6a6a7a] mt-2">
                      {new Date(notification.createdAt).toLocaleTimeString()}
                    </p>
                  </button>
                ))
              )}
            </div>
            <div className="p-3 border-t border-white/10">
              <Link
                href="/app/notifications"
                className="block text-center text-sm text-[#e94560] hover:text-[#ff6b6b]"
                onClick={() => setIsOpen(false)}
              >
                View all notifications
              </Link>
            </div>
          </motion.div>
        </>
      )}
    </div>
  );
}

// =============================================================================
// User Menu Component
// =============================================================================

function UserMenu() {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { label: "Profile", href: "/app/settings?tab=profile" },
    { label: "Settings", href: "/app/settings" },
    { label: "Help & Support", href: "/help" },
    { label: "Sign Out", href: "/api/auth/signout", danger: true },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1 pr-3 rounded-full hover:bg-white/10 transition-colors"
        aria-label="User menu"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#e94560] to-[#ff6b6b] flex items-center justify-center text-white text-sm font-medium" aria-hidden="true">
          SC
        </div>
        <span className="hidden md:block text-sm text-white">Sarah Chen</span>
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 top-full mt-2 w-48 bg-[#1a1a2e] border border-white/10 rounded-xl shadow-2xl z-50 overflow-hidden"
            role="menu"
            aria-label="User menu"
          >
            {menuItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "block px-4 py-2 text-sm hover:bg-white/5 transition-colors",
                  item.danger
                    ? "text-red-400 hover:text-red-300"
                    : "text-[#a0a0b0] hover:text-white"
                )}
                onClick={() => setIsOpen(false)}
                role="menuitem"
              >
                {item.label}
              </Link>
            ))}
          </motion.div>
        </>
      )}
    </div>
  );
}

// =============================================================================
// Header Component
// =============================================================================

function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "Pricing", href: "#pricing" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <header role="banner" className="sticky top-0 z-30 bg-[#0f0f1a]/80 backdrop-blur-xl border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#e94560] to-[#ff6b6b] flex items-center justify-center">
              <span className="text-white font-bold text-sm">R</span>
            </div>
            <span className="text-white font-semibold hidden sm:block">
              Redstick Ventures
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="text-sm text-[#a0a0b0] hover:text-white transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            <GlobalSearch />
            <NotificationBell />
            <UserMenu />

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-navigation"
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5" aria-hidden="true" />
              ) : (
                <Menu className="w-5 h-5" aria-hidden="true" />
              )}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <motion.nav
            id="mobile-navigation"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-white/10"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="px-4 py-2 text-[#a0a0b0] hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </div>
    </header>
  );
}

// =============================================================================
// Footer Component
// =============================================================================

function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Product",
      links: [
        { label: "Features", href: "#features" },
        { label: "Pricing", href: "#pricing" },
        { label: "Integrations", href: "#integrations" },
        { label: "Changelog", href: "#changelog" },
      ],
    },
    {
      title: "Company",
      links: [
        { label: "About", href: "#about" },
        { label: "Blog", href: "#blog" },
        { label: "Careers", href: "#careers" },
        { label: "Contact", href: "#contact" },
      ],
    },
    {
      title: "Resources",
      links: [
        { label: "Documentation", href: "#docs" },
        { label: "Help Center", href: "#help" },
        { label: "API Reference", href: "#api" },
        { label: "Status", href: "#status" },
      ],
    },
    {
      title: "Legal",
      links: [
        { label: "Privacy", href: "#privacy" },
        { label: "Terms", href: "#terms" },
        { label: "Security", href: "#security" },
        { label: "Cookies", href: "#cookies" },
      ],
    },
  ];

  return (
    <footer role="contentinfo" className="border-t border-white/10 bg-[#0f0f1a]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#e94560] to-[#ff6b6b] flex items-center justify-center">
                <span className="text-white font-bold text-sm">R</span>
              </div>
              <span className="text-white font-semibold">
                Redstick Ventures
              </span>
            </Link>
            <p className="text-sm text-[#6a6a7a] max-w-xs">
              Modern venture capital portfolio management platform for the next
              generation of investors.
            </p>
          </div>

          {/* Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h4 className="font-medium text-white mb-4">{section.title}</h4>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-[#6a6a7a] hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-[#6a6a7a]">
            © {currentYear} Redstick Ventures. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="#"
              className="text-[#6a6a7a] hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </Link>
            <Link
              href="#"
              className="text-[#6a6a7a] hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </Link>
            <Link
              href="#"
              className="text-[#6a6a7a] hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

// =============================================================================
// Main App Shell Component
// =============================================================================

export function AppShell({
  children,
  showFooter = true,
  className,
}: AppShellProps) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: "#0f0f1a" }}>
      <Header />
      <main id="main-content" role="main" className={cn("flex-1", className)}>
        {children}
      </main>
      {showFooter && <Footer />}
    </div>
  );
}

export default AppShell;
