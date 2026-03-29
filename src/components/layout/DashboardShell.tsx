/**
 * Workstream 5A: Mobile Layout Optimization
 * DashboardShell Component with Mobile Drawer Support
 * 
 * Features:
 * - Mobile: Drawer that slides in from the left
 * - Desktop: Fixed sidebar
 * - Responsive breakpoints: 320px, 375px, 414px, 768px, 1024px, 1440px+
 */

'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Menu, X, Home, Users, BarChart3, Settings, FileText, Pipeline, Bell } from 'lucide-react';

// ============================================
// TYPES
// ============================================

interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: React.ReactNode;
  badge?: number;
}

interface DashboardShellProps {
  children: React.ReactNode;
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  activePage?: string;
}

// ============================================
// NAVIGATION CONFIGURATION
// ============================================

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', href: '/dashboard', icon: <Home size={20} /> },
  { id: 'pipeline', label: 'Pipeline', href: '/pipeline', icon: <Pipeline size={20} /> },
  { id: 'contacts', label: 'Contacts', href: '/contacts', icon: <Users size={20} /> },
  { id: 'reports', label: 'Reports', href: '/reports', icon: <BarChart3 size={20} /> },
  { id: 'documents', label: 'Documents', href: '/documents', icon: <FileText size={20} /> },
  { id: 'settings', label: 'Settings', href: '/settings', icon: <Settings size={20} /> },
];

// ============================================
// MOBILE MENU BUTTON COMPONENT
// ============================================

interface MobileMenuButtonProps {
  onClick: () => void;
  isOpen: boolean;
}

const MobileMenuButton: React.FC<MobileMenuButtonProps> = ({ onClick, isOpen }) => (
  <button
    type="button"
    onClick={onClick}
    className="lg:hidden touch-target touch-comfortable flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
    aria-expanded={isOpen}
    aria-controls="mobile-drawer"
    aria-label={isOpen ? 'Close menu' : 'Open menu'}
  >
    {isOpen ? <X size={24} /> : <Menu size={24} />}
  </button>
);

// ============================================
// SIDEBAR CONTENT COMPONENT
// ============================================

interface SidebarContentProps {
  activePage?: string;
  user?: DashboardShellProps['user'];
  onNavClick?: () => void;
}

const SidebarContent: React.FC<SidebarContentProps> = ({ 
  activePage = 'dashboard', 
  user,
  onNavClick 
}) => {
  return (
    <div className="flex h-full flex-col">
      {/* Logo Section */}
      <div className="flex h-16 items-center border-b border-gray-200 px-4 sm:px-6">
        <a href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">RV</span>
          </div>
          <span className="text-lg font-semibold text-gray-900 hidden sm:inline">
            Redstick Ventures
          </span>
          <span className="text-lg font-semibold text-gray-900 sm:hidden">
            RV
          </span>
        </a>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4" aria-label="Main navigation">
        <ul className="space-y-1">
          {NAV_ITEMS.map((item) => {
            const isActive = activePage === item.id;
            return (
              <li key={item.id}>
                <a
                  href={item.href}
                  onClick={onNavClick}
                  className={`
                    flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors
                    touch-target touch-comfortable
                    ${isActive 
                      ? 'bg-blue-50 text-blue-700' 
                      : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                    }
                    focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500
                  `}
                  aria-current={isActive ? 'page' : undefined}
                >
                  <span className={isActive ? 'text-blue-600' : 'text-gray-400'} aria-hidden="true">
                    {item.icon}
                  </span>
                  <span className="flex-1">{item.label}</span>
                  {item.badge && (
                    <span className="inline-flex h-5 min-w-[20px] items-center justify-center rounded-full bg-red-100 px-1.5 text-xs font-medium text-red-600">
                      {item.badge > 99 ? '99+' : item.badge}
                    </span>
                  )}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* User Section */}
      {user && (
        <div className="border-t border-gray-200 p-4">
          <div className="flex items-center gap-3">
            {user.avatar ? (
              <img
                src={user.avatar}
                alt=""
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-sm font-medium text-gray-600">
                  {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                </span>
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.name}
              </p>
              <p className="text-xs text-gray-500 truncate">
                {user.email}
              </p>
            </div>
            <button
              type="button"
              className="p-2 rounded-lg text-gray-400 hover:text-gray-500 hover:bg-gray-100 touch-target"
              aria-label="View notifications"
            >
              <Bell size={18} aria-hidden="true" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// ============================================
// MOBILE DRAWER COMPONENT
// ============================================

interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const MobileDrawer: React.FC<MobileDrawerProps> = ({ isOpen, onClose, children }) => {
  const drawerRef = useRef<HTMLElement>(null);
  const firstFocusableRef = useRef<HTMLElement | null>(null);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.touchAction = 'none'; // Prevent touch scrolling
    } else {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.touchAction = '';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Focus management - move focus to first focusable element when opened
  useEffect(() => {
    if (isOpen && drawerRef.current) {
      // Find first focusable element
      const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
        'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      firstFocusableRef.current = focusableElements[0];
      
      // Small delay to allow animation to start
      setTimeout(() => {
        firstFocusableRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  // Focus trap within drawer
  useEffect(() => {
    if (!isOpen || !drawerRef.current) return;

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      const focusableElements = drawerRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      
      if (!focusableElements || focusableElements.length === 0) return;

      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    drawerRef.current.addEventListener('keydown', handleTabKey);
    return () => drawerRef.current?.removeEventListener('keydown', handleTabKey);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop overlay - clickable to close */}
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[var(--z-modal-backdrop)] lg:hidden animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
        style={{ 
          animation: 'fadeIn 0.2s ease-out',
          zIndex: 400 
        }}
      />
      
      {/* Drawer */}
      <aside
        ref={drawerRef}
        id="mobile-drawer"
        className="fixed left-0 top-0 h-full w-64 bg-white z-[var(--z-modal)] lg:hidden shadow-2xl mobile-drawer scroll-momentum"
        style={{ 
          animation: 'slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
          maxWidth: '85vw', // Slightly wider for better usability
          zIndex: 500
        }}
        role="dialog"
        aria-modal="true"
        aria-label="Mobile navigation menu"
      >
        {children}
      </aside>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideIn {
          from { 
            opacity: 0;
            transform: translateX(-100%); 
          }
          to { 
            opacity: 1;
            transform: translateX(0); 
          }
        }
      `}</style>
    </>
  );
};

// ============================================
// MAIN DASHBOARD SHELL COMPONENT
// ============================================

export const DashboardShell: React.FC<DashboardShellProps> = ({
  children,
  user,
  activePage = 'dashboard',
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleCloseMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  const handleOpenMobileMenu = useCallback(() => {
    setMobileMenuOpen(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header role="banner" className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-200">
        <div className="flex h-16 items-center justify-between px-4">
          <MobileMenuButton 
            onClick={handleOpenMobileMenu} 
            isOpen={mobileMenuOpen} 
          />
          
          <a href="/" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
              <span className="text-white font-bold text-sm">RV</span>
            </div>
            <span className="text-lg font-semibold text-gray-900">
              Redstick
            </span>
          </a>

          <div className="w-10" /> {/* Spacer for alignment */}
        </div>
      </header>

      <div className="flex min-h-[calc(100vh-4rem)] lg:min-h-screen">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-64 bg-white border-r border-gray-200 fixed left-0 top-0 h-full" role="navigation" aria-label="Dashboard sidebar">
          <SidebarContent 
            activePage={activePage} 
            user={user} 
          />
        </aside>

        {/* Mobile Drawer */}
        <MobileDrawer 
          isOpen={mobileMenuOpen} 
          onClose={handleCloseMobileMenu}
        >
          <div className="flex h-full flex-col">
            {/* Close button in drawer header */}
            <div className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
              <span className="text-lg font-semibold text-gray-900">Menu</span>
              <button
                type="button"
                onClick={handleCloseMobileMenu}
                className="touch-target touch-comfortable rounded-md p-2 text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                aria-label="Close menu"
              >
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <SidebarContent 
                activePage={activePage} 
                user={user}
                onNavClick={handleCloseMobileMenu}
              />
            </div>
          </div>
        </MobileDrawer>

        {/* Main Content */}
        <main id="main-content" role="main" className="flex-1 lg:ml-64">
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardShell;
