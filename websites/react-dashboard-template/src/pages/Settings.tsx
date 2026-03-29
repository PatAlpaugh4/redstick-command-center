/**
 * Settings Page
 * =============
 * Application settings and configuration.
 */

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@components/ui/Card'
import { Button } from '@components/ui/Button'
import { Badge } from '@components/ui/Badge'
import { cn } from '@utils/cn'
import { Bell, Lock, User, Globe, Palette } from 'lucide-react'

interface SettingSection {
  id: string
  title: string
  description: string
  icon: React.ElementType
}

const sections: SettingSection[] = [
  {
    id: 'profile',
    title: 'Profile',
    description: 'Manage your personal information and preferences.',
    icon: User,
  },
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'Configure how you receive notifications.',
    icon: Bell,
  },
  {
    id: 'security',
    title: 'Security',
    description: 'Update your password and security settings.',
    icon: Lock,
  },
  {
    id: 'appearance',
    title: 'Appearance',
    description: 'Customize the look and feel of the dashboard.',
    icon: Palette,
  },
  {
    id: 'language',
    title: 'Language & Region',
    description: 'Set your preferred language and timezone.',
    icon: Globe,
  },
]

export function Settings() {
  const [activeSection, setActiveSection] = useState('profile')
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    marketing: false,
  })

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your account settings and preferences.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        {/* Sidebar */}
        <Card className="lg:col-span-1">
          <CardContent className="p-4">
            <nav className="space-y-1">
              {sections.map((section) => {
                const Icon = section.icon
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={cn(
                      'flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      activeSection === section.id
                        ? 'bg-primary text-primary-foreground'
                        : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {section.title}
                  </button>
                )
              })}
            </nav>
          </CardContent>
        </Card>

        {/* Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Profile Settings */}
          {activeSection === 'profile' && (
            <Card>
              <CardHeader>
                <CardTitle>Profile Information</CardTitle>
                <CardDescription>
                  Update your account's profile information.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">First Name</label>
                    <input
                      type="text"
                      defaultValue="Admin"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Last Name</label>
                    <input
                      type="text"
                      defaultValue="User"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <input
                    type="email"
                    defaultValue="admin@example.com"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
                <div className="flex justify-end">
                  <Button>Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Notification Settings */}
          {activeSection === 'notifications' && (
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>
                  Choose how you want to be notified.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  { id: 'email', label: 'Email Notifications', description: 'Receive updates via email' },
                  { id: 'push', label: 'Push Notifications', description: 'Receive push notifications' },
                  { id: 'marketing', label: 'Marketing Emails', description: 'Receive marketing and promotional emails' },
                ].map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-lg border p-4"
                  >
                    <div>
                      <p className="font-medium">{item.label}</p>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                    <button
                      onClick={() =>
                        setNotifications((prev) => ({
                          ...prev,
                          [item.id]: !prev[item.id as keyof typeof notifications],
                        }))
                      }
                      className={cn(
                        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                        notifications[item.id as keyof typeof notifications]
                          ? 'bg-primary'
                          : 'bg-muted'
                      )}
                    >
                      <span
                        className={cn(
                          'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                          notifications[item.id as keyof typeof notifications]
                            ? 'translate-x-6'
                            : 'translate-x-1'
                        )}
                      />
                    </button>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Security Settings */}
          {activeSection === 'security' && (
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>
                  Update your password and security preferences.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Current Password</label>
                  <input
                    type="password"
                    placeholder="Enter current password"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">New Password</label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Confirm Password</label>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  />
                </div>
                <div className="flex justify-end">
                  <Button>Update Password</Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Other sections placeholder */}
          {['appearance', 'language'].includes(activeSection) && (
            <Card>
              <CardHeader>
                <CardTitle>{sections.find((s) => s.id === activeSection)?.title}</CardTitle>
                <CardDescription>
                  {sections.find((s) => s.id === activeSection)?.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Coming soon...</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
