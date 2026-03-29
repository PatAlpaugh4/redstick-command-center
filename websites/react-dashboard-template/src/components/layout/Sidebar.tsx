/**
 * Sidebar Component
 * =================
 * Navigation sidebar with menu items and user profile.
 * Collapsible on mobile devices.
 */

import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { cn } from '@utils/cn'
import {
  LayoutDashboard,
  BarChart3,
  Users,
  Package,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react'

interface NavItem {
  label: string
  href: string
  icon: React.ElementType
  badge?: number
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Analytics', href: '/analytics', icon: BarChart3 },
  { label: 'Users', href: '/users', icon: Users, badge: 3 },
  { label: 'Products', href: '/products', icon: Package },
  { label: 'Settings', href: '/settings', icon: Settings },
]

export function Sidebar() {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  const toggleSidebar = () => setCollapsed(!collapsed)
  const toggleMobile = () => setMobileOpen(!mobileOpen)

  return (
    <>
      {/* Mobile Overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          'fixed left-0 top-0 z-50 h-screen bg-card border-r border-border transition-all duration-300',
          collapsed ? 'w-20' : 'w-64',
          mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        )}
      >
        {/* Logo */}
        <div className="flex h-16 items-center justify-between border-b border-border px-4">
          <div className={cn('flex items-center gap-3', collapsed && 'justify-center w-full')}>
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <LayoutDashboard className="h-6 w-6 text-primary-foreground" />
            </div>
            {!collapsed && (
              <span className="text-lg font-semibold">Dashboard</span>
            )}
          </div>
          
          {/* Collapse Button (Desktop) */}
          <button
            onClick={toggleSidebar}
            className={cn(
              'hidden lg:flex h-8 w-8 items-center justify-center rounded-md hover:bg-muted transition-colors',
              collapsed && 'absolute -right-4 top-6 h-8 w-8 bg-card border border-border shadow-sm'
            )}
          >
            {collapsed ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-auto p-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                      collapsed && 'justify-center'
                    )
                  }
                  title={collapsed ? item.label : undefined}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1">{item.label}</span>
                      {item.badge && (
                        <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-destructive text-[10px] font-medium text-destructive-foreground px-1.5">
                          {item.badge}
                        </span>
                      )}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* User Profile */}
        <div className="border-t border-border p-4">
          <div
            className={cn(
              'flex items-center gap-3',
              collapsed && 'justify-center'
            )}
          >
            <img
              src="https://api.dicebear.com/7.x/avataaars/svg?seed=Admin"
              alt="Admin User"
              className="h-10 w-10 rounded-full bg-muted"
            />
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">Admin User</p>
                <p className="text-xs text-muted-foreground truncate">admin@example.com</p>
              </div>
            )}
            {!collapsed && (
              <button
                className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                title="Logout"
              >
                <LogOut className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Mobile Toggle Button */}
      <button
        onClick={toggleMobile}
        className="fixed left-4 top-4 z-30 flex h-10 w-10 items-center justify-center rounded-md bg-card border border-border shadow-sm lg:hidden"
      >
        <LayoutDashboard className="h-5 w-5" />
      </button>
    </>
  )
}
