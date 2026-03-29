"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ANIMATION } from "@/lib/animations";
import {
  User,
  Building2,
  Bell,
  Link2,
  Shield,
  Camera,
  Check,
  Copy,
  ExternalLink,
  Eye,
  EyeOff,
  Key,
  Lock,
  Mail,
  Phone,
  Plus,
  Save,
  Trash2,
} from "lucide-react";

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "firm", label: "Firm Settings", icon: Building2 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "integrations", label: "Integrations", icon: Link2 },
  { id: "security", label: "Security", icon: Shield },
];

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${
        checked ? "bg-accent" : "bg-surface-elevated"
      }`}
    >
      <motion.div
        animate={{ x: checked ? 22 : 2 }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="absolute top-1 w-4 h-4 bg-white rounded-full"
      />
    </button>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [showApiKey, setShowApiKey] = useState<string | null>(null);

  // Mock data
  const [profile, setProfile] = useState({
    name: "Sarah Chen",
    email: "sarah@redstick.vc",
    phone: "+1 (225) 555-0123",
    timezone: "America/Chicago",
    title: "Managing Partner",
    bio: "Former VP at a16z, focused on AgTech and Food Systems.",
  });

  const [firm, setFirm] = useState({
    name: "Redstick Ventures",
    website: "https://redstick.vc",
    aum: "$150M",
    founded: "2019",
    description: "Early-stage venture capital firm investing at the intersection of food systems, agriculture, and AI.",
  });

  const [notifications, setNotifications] = useState({
    email: {
      dealAlerts: true,
      pipelineUpdates: true,
      weeklyDigest: true,
      mentions: true,
    },
    push: {
      dealAlerts: false,
      pipelineUpdates: true,
      mentions: true,
    },
    inApp: {
      dealAlerts: true,
      pipelineUpdates: true,
      mentions: true,
      systemUpdates: true,
    },
  });

  const [integrations] = useState([
    { id: "1", name: "Salesforce", status: "connected", icon: "S" },
    { id: "2", name: "Slack", status: "connected", icon: "S" },
    { id: "3", name: "Notion", status: "disconnected", icon: "N" },
    { id: "4", name: "Google Drive", status: "connected", icon: "G" },
    { id: "5", name: "PitchBook", status: "disconnected", icon: "P" },
    { id: "6", name: "Carta", status: "connected", icon: "C" },
  ]);

  const [apiKeys] = useState([
    { id: "1", name: "Production API Key", key: "sk_live_...7f8g9h", created: "2024-01-15", lastUsed: "2 hours ago" },
    { id: "2", name: "Development API Key", key: "sk_dev_...3k4l5m", created: "2024-01-10", lastUsed: "1 day ago" },
  ]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: ANIMATION.easing.default }}
      >
        <h2 className="text-h2 font-bold text-text-primary">Settings</h2>
        <p className="text-body text-text-secondary mt-1">
          Manage your account, firm settings, and preferences
        </p>
      </motion.div>

      {/* Tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1, ease: ANIMATION.easing.default }}
        className="border-b border-border"
      >
        <div className="flex gap-1 overflow-x-auto">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors duration-200 whitespace-nowrap ${
                  activeTab === tab.id
                    ? "border-accent text-accent"
                    : "border-transparent text-text-secondary hover:text-text-primary"
                }`}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </motion.div>

      {/* Content */}
      <AnimatePresence mode="wait">
        {/* Profile Tab */}
        {activeTab === "profile" && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: ANIMATION.easing.default }}
            className="grid lg:grid-cols-3 gap-6"
          >
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={profile.name}
                        onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent transition-colors duration-200"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Title
                      </label>
                      <input
                        type="text"
                        value={profile.title}
                        onChange={(e) => setProfile({ ...profile, title: e.target.value })}
                        className="w-full px-4 py-2 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent transition-colors duration-200"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Email
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                      <input
                        type="email"
                        value={profile.email}
                        onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent transition-colors duration-200"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Phone
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                      <input
                        type="tel"
                        value={profile.phone}
                        onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                        className="w-full pl-10 pr-4 py-2 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent transition-colors duration-200"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Bio
                    </label>
                    <textarea
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent transition-colors duration-200 resize-none"
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Preferences</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Timezone
                    </label>
                    <select
                      value={profile.timezone}
                      onChange={(e) => setProfile({ ...profile, timezone: e.target.value })}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent transition-colors duration-200"
                    >
                      <option value="America/New_York">Eastern Time (ET)</option>
                      <option value="America/Chicago">Central Time (CT)</option>
                      <option value="America/Denver">Mountain Time (MT)</option>
                      <option value="America/Los_Angeles">Pacific Time (PT)</option>
                    </select>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Profile Picture</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
                    <span className="text-3xl font-bold text-accent">
                      {profile.name.split(" ").map((n) => n[0]).join("")}
                    </span>
                  </div>
                  <Button variant="secondary" size="sm" className="w-full">
                    <Camera className="w-4 h-4 mr-2" />
                    Change Photo
                  </Button>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {/* Firm Settings Tab */}
        {activeTab === "firm" && (
          <motion.div
            key="firm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: ANIMATION.easing.default }}
            className="grid lg:grid-cols-3 gap-6"
          >
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Firm Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Firm Name
                    </label>
                    <input
                      type="text"
                      value={firm.name}
                      onChange={(e) => setFirm({ ...firm, name: e.target.value })}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent transition-colors duration-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      value={firm.website}
                      onChange={(e) => setFirm({ ...firm, website: e.target.value })}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent transition-colors duration-200"
                    />
                  </div>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        AUM
                      </label>
                      <input
                        type="text"
                        value={firm.aum}
                        disabled
                        className="w-full px-4 py-2 bg-surface-elevated border border-border rounded-lg text-text-tertiary"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-text-secondary mb-2">
                        Founded
                      </label>
                      <input
                        type="text"
                        value={firm.founded}
                        disabled
                        className="w-full px-4 py-2 bg-surface-elevated border border-border rounded-lg text-text-tertiary"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-text-secondary mb-2">
                      Description
                    </label>
                    <textarea
                      value={firm.description}
                      onChange={(e) => setFirm({ ...firm, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent transition-colors duration-200 resize-none"
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Firm Logo</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <div className="w-20 h-20 mx-auto mb-4 bg-accent rounded-lg flex items-center justify-center">
                    <span className="text-2xl font-bold text-white">R</span>
                  </div>
                  <Button variant="secondary" size="sm" className="w-full">
                    <Camera className="w-4 h-4 mr-2" />
                    Change Logo
                  </Button>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <motion.div
            key="notifications"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: ANIMATION.easing.default }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Email Notifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { key: "dealAlerts", label: "Deal Alerts", description: "New deals matching your criteria" },
                  { key: "pipelineUpdates", label: "Pipeline Updates", description: "Status changes on tracked deals" },
                  { key: "weeklyDigest", label: "Weekly Digest", description: "Summary of weekly activity" },
                  { key: "mentions", label: "Mentions", description: "When you're mentioned in comments" },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between">
                    <div>
                      <p className="font-medium text-text-primary">{item.label}</p>
                      <p className="text-sm text-text-secondary">{item.description}</p>
                    </div>
                    <Toggle
                      checked={notifications.email[item.key as keyof typeof notifications.email]}
                      onChange={(checked) =>
                        setNotifications({
                          ...notifications,
                          email: { ...notifications.email, [item.key]: checked },
                        })
                      }
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Integrations Tab */}
        {activeTab === "integrations" && (
          <motion.div
            key="integrations"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: ANIMATION.easing.default }}
            className="grid md:grid-cols-2 gap-4"
          >
            {integrations.map((integration, index) => (
              <motion.div
                key={integration.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-surface-elevated rounded-lg flex items-center justify-center font-bold text-text-primary">
                          {integration.icon}
                        </div>
                        <div>
                          <p className="font-medium text-text-primary">{integration.name}</p>
                          <Badge
                            variant={integration.status === "connected" ? "success" : "default"}
                            className="mt-1"
                          >
                            {integration.status}
                          </Badge>
                        </div>
                      </div>
                      <Button
                        variant={integration.status === "connected" ? "ghost" : "secondary"}
                        size="sm"
                      >
                        {integration.status === "connected" ? "Disconnect" : "Connect"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <motion.div
            key="security"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3, ease: ANIMATION.easing.default }}
            className="space-y-6"
          >
            <Card>
              <CardHeader>
                <CardTitle>Change Password</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    Current Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter current password"
                      className="w-full pl-10 pr-12 py-2 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent transition-colors duration-200"
                    />
                    <button
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-secondary"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-secondary mb-2">
                    New Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    className="w-full px-4 py-2 bg-background border border-border rounded-lg text-text-primary focus:outline-none focus:border-accent transition-colors duration-200"
                  />
                </div>
                <Button>Update Password</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Two-Factor Authentication</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-success" />
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">2FA Enabled</p>
                      <p className="text-sm text-text-secondary">Authenticator app connected</p>
                    </div>
                  </div>
                  <Button variant="secondary">Configure</Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>API Keys</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {apiKeys.map((apiKey) => (
                  <div
                    key={apiKey.id}
                    className="flex items-center justify-between p-4 bg-background rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-text-primary">{apiKey.name}</p>
                      <p className="text-xs text-text-tertiary">
                        Created {apiKey.created} • Last used {apiKey.lastUsed}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="px-3 py-1 bg-surface-elevated rounded text-sm text-text-secondary">
                        {showApiKey === apiKey.id ? apiKey.key : apiKey.key.replace(/./g, "•")}
                      </code>
                      <button
                        onClick={() => setShowApiKey(showApiKey === apiKey.id ? null : apiKey.id)}
                        className="p-2 hover:bg-surface-elevated rounded-lg transition-colors duration-200"
                      >
                        {showApiKey === apiKey.id ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                      <button className="p-2 hover:bg-surface-elevated rounded-lg transition-colors duration-200">
                        <Copy className="w-4 h-4" />
                      </button>
                      <button className="p-2 hover:bg-error/10 text-error rounded-lg transition-colors duration-200">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                <Button variant="secondary" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Generate New API Key
                </Button>
              </CardContent>
            </Card>

            <Card className="border-error/30">
              <CardHeader>
                <CardTitle className="text-error">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-text-primary">Delete Account</p>
                    <p className="text-sm text-text-secondary">
                      Permanently delete your account and all associated data
                    </p>
                  </div>
                  <Button variant="danger">Delete Account</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Save Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="flex justify-end pt-4 border-t border-border"
      >
        <Button size="lg">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </motion.div>
    </div>
  );
}
