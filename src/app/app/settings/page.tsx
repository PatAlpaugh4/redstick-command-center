"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import {
  User,
  Building2,
  Bell,
  Link2,
  Shield,
  Camera,
  Mail,
  Smartphone,
  Globe,
  Lock,
  Key,
  Save,
  Check,
  X,
  RefreshCw,
  ChevronRight,
  Slack,
  Figma,
  Github,
  Trello,
  MoreHorizontal,
  Eye,
  Monitor,
} from "lucide-react";
import { useReducedMotionContext } from "@/components/providers/ReducedMotionProvider"; 

const ANIMATION = {
  duration: { fast: 0.2, normal: 0.5, slow: 0.8 },
  easing: { default: [0.16, 1, 0.3, 1] },
  stagger: { card: 0.08 },
};

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: ANIMATION.stagger.card,
      delayChildren: 0.1,
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

// Reduced motion variants for tab content
const reducedItemVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.01,
    },
  },
};

const tabs = [
  { id: "profile", label: "Profile", icon: User },
  { id: "firm", label: "Firm Settings", icon: Building2 },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "preferences", label: "Preferences", icon: Eye },
  { id: "integrations", label: "Integrations", icon: Link2 },
  { id: "security", label: "Security", icon: Shield },
];

// Mock data
const userProfile = {
  firstName: "Sarah",
  lastName: "Chen",
  email: "sarah.chen@redstick.vc",
  role: "Managing Partner",
  phone: "+1 (555) 123-4567",
  timezone: "America/New_York",
  avatar: "SC",
};

const firmSettings = {
  name: "Redstick Ventures",
  website: "https://redstick.vc",
  founded: "2019",
  stage: "Series A - D",
  aum: "$250M",
  primaryColor: "#e94560",
  logo: null,
};

const notificationSettings = {
  email: {
    dealAlerts: true,
    portfolioUpdates: true,
    weeklyDigest: true,
    meetingReminders: true,
    marketNews: false,
  },
  push: {
    dealAlerts: true,
    messages: true,
    mentions: true,
    systemUpdates: false,
  },
  inApp: {
    dealAlerts: true,
    messages: true,
    mentions: true,
    tasks: true,
    systemUpdates: true,
  },
};

const integrations = [
  {
    id: "salesforce",
    name: "Salesforce",
    category: "CRM",
    connected: true,
    icon: "💼",
    lastSync: "2 hours ago",
  },
  {
    id: "slack",
    name: "Slack",
    category: "Communication",
    connected: true,
    icon: "💬",
    lastSync: "Just now",
  },
  {
    id: "hubspot",
    name: "HubSpot",
    category: "CRM",
    connected: false,
    icon: "🎯",
    lastSync: null,
  },
  {
    id: "notion",
    name: "Notion",
    category: "Productivity",
    connected: true,
    icon: "📝",
    lastSync: "1 day ago",
  },
  {
    id: "drive",
    name: "Google Drive",
    category: "Storage",
    connected: true,
    icon: "☁️",
    lastSync: "3 hours ago",
  },
  {
    id: "zoom",
    name: "Zoom",
    category: "Communication",
    connected: false,
    icon: "📹",
    lastSync: null,
  },
];

const apiKeys = [
  {
    id: "prod_key",
    name: "Production API Key",
    key: "rs_live_***************************k9m2",
    created: "2024-01-15",
    lastUsed: "2 hours ago",
  },
  {
    id: "test_key",
    name: "Test API Key",
    key: "rs_test_***************************7xp4",
    created: "2024-02-01",
    lastUsed: "5 days ago",
  },
];

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 ${
        checked ? "bg-[#e94560]" : "bg-[#2a2a3e]"
      }`}
    >
      <motion.span
        initial={false}
        animate={{
          x: checked ? 24 : 2,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30 }}
        className="inline-block h-4 w-4 rounded-full bg-white"
      />
    </button>
  );
}

function ProfileTab() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <Card className="bg-[#1a1a2e] border border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Profile Information</CardTitle>
            <CardDescription className="text-[#a0a0b0]">
              Update your personal details and how others see you
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#e94560] to-[#ff6b6b] flex items-center justify-center text-white text-2xl font-bold">
                  {userProfile.avatar}
                </div>
                <button className="absolute bottom-0 right-0 w-8 h-8 bg-[#2a2a3e] border border-white/10 rounded-full flex items-center justify-center text-[#a0a0b0] hover:text-white hover:border-[#e94560] transition-colors">
                  <Camera className="w-4 h-4" />
                </button>
              </div>
              <div>
                <h3 className="text-white font-semibold">
                  {userProfile.firstName} {userProfile.lastName}
                </h3>
                <p className="text-[#a0a0b0] text-sm">{userProfile.role}</p>
                <p className="text-[#6a6a7a] text-sm mt-1">{userProfile.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-[#a0a0b0]">First Name</label>
                <input
                  type="text"
                  defaultValue={userProfile.firstName}
                  className="w-full px-4 py-2 bg-[#0f0f1a] border border-white/10 rounded-lg text-white placeholder-[#6a6a7a] focus:outline-none focus:border-[#e94560] transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-[#a0a0b0]">Last Name</label>
                <input
                  type="text"
                  defaultValue={userProfile.lastName}
                  className="w-full px-4 py-2 bg-[#0f0f1a] border border-white/10 rounded-lg text-white placeholder-[#6a0a7a] focus:outline-none focus:border-[#e94560] transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-[#a0a0b0]">Email</label>
                <input
                  type="email"
                  defaultValue={userProfile.email}
                  className="w-full px-4 py-2 bg-[#0f0f1a] border border-white/10 rounded-lg text-white placeholder-[#6a6a7a] focus:outline-none focus:border-[#e94560] transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-[#a0a0b0]">Phone</label>
                <input
                  type="tel"
                  defaultValue={userProfile.phone}
                  className="w-full px-4 py-2 bg-[#0f0f1a] border border-white/10 rounded-lg text-white placeholder-[#6a6a7a] focus:outline-none focus:border-[#e94560] transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-[#a0a0b0]">Timezone</label>
              <select
                defaultValue={userProfile.timezone}
                className="w-full px-4 py-2 bg-[#0f0f1a] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#e94560] transition-colors"
              >
                <option value="America/New_York">Eastern Time (ET)</option>
                <option value="America/Chicago">Central Time (CT)</option>
                <option value="America/Denver">Mountain Time (MT)</option>
                <option value="America/Los_Angeles">Pacific Time (PT)</option>
                <option value="Europe/London">London (GMT)</option>
                <option value="Europe/Paris">Paris (CET)</option>
                <option value="Asia/Tokyo">Tokyo (JST)</option>
              </select>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="bg-[#1a1a2e] border border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Preferences</CardTitle>
            <CardDescription className="text-[#a0a0b0]">
              Customize your dashboard experience
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { label: "Compact Mode", description: "Show more content with less spacing" },
              { label: "Auto-save Deals", description: "Automatically save deal drafts" },
              { label: "Show Valuations", description: "Display portfolio company valuations" },
            ].map((pref) => (
              <div
                key={pref.label}
                className="flex items-center justify-between py-2"
              >
                <div>
                  <p className="text-white font-medium">{pref.label}</p>
                  <p className="text-[#6a6a7a] text-sm">{pref.description}</p>
                </div>
                <Toggle checked={false} onChange={() => {}} />
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants} className="flex justify-end">
        <Button className="bg-[#e94560] hover:bg-[#d63d56] text-white px-6">
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </motion.div>
    </motion.div>
  );
}

function FirmTab() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <Card className="bg-[#1a1a2e] border border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Firm Information</CardTitle>
            <CardDescription className="text-[#a0a0b0]">
              Manage your firm&apos;s public profile and details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex items-center gap-6">
              <div className="w-20 h-20 rounded-xl bg-gradient-to-br from-[#e94560] to-[#ff6b6b] flex items-center justify-center text-white text-2xl font-bold">
                RV
              </div>
              <div className="space-y-2">
                <Button variant="outline" size="sm">
                  <Camera className="w-4 h-4 mr-2" />
                  Upload Logo
                </Button>
                <p className="text-[#6a6a7a] text-xs">
                  Recommended: 400x400px PNG or SVG
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm text-[#a0a0b0]">Firm Name</label>
                <input
                  type="text"
                  defaultValue={firmSettings.name}
                  className="w-full px-4 py-2 bg-[#0f0f1a] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#e94560] transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-[#a0a0b0]">Website</label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6a6a7a]" />
                  <input
                    type="url"
                    defaultValue={firmSettings.website}
                    className="w-full pl-10 pr-4 py-2 bg-[#0f0f1a] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#e94560] transition-colors"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm text-[#a0a0b0]">Founded Year</label>
                <input
                  type="text"
                  defaultValue={firmSettings.founded}
                  className="w-full px-4 py-2 bg-[#0f0f1a] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#e94560] transition-colors"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm text-[#a0a0b0]">Assets Under Management</label>
                <input
                  type="text"
                  defaultValue={firmSettings.aum}
                  className="w-full px-4 py-2 bg-[#0f0f1a] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#e94560] transition-colors"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm text-[#a0a0b0]">Investment Stage Focus</label>
              <input
                type="text"
                defaultValue={firmSettings.stage}
                className="w-full px-4 py-2 bg-[#0f0f1a] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#e94560] transition-colors"
              />
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="bg-[#1a1a2e] border border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Branding</CardTitle>
            <CardDescription className="text-[#a0a0b0]">
              Customize your firm&apos;s visual identity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-white font-medium">Primary Color</p>
                <p className="text-[#6a6a7a] text-sm">
                  Used for buttons, links, and accents
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-[#0f0f1a] border border-white/10 rounded-lg">
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: firmSettings.primaryColor }}
                  />
                  <span className="text-white text-sm">{firmSettings.primaryColor}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-white font-medium">Dark Mode Default</p>
                <p className="text-[#6a6a7a] text-sm">
                  Set dark theme as default for all users
                </p>
              </div>
              <Toggle checked={true} onChange={() => {}} />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-white font-medium">Custom Domain</p>
                <p className="text-[#6a6a7a] text-sm">
                  Use your own domain for the platform
                </p>
              </div>
              <Button variant="outline" size="sm">
                Configure
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants} className="flex justify-end">
        <Button className="bg-[#e94560] hover:bg-[#d63d56] text-white px-6">
          <Save className="w-4 h-4 mr-2" />
          Save Firm Settings
        </Button>
      </motion.div>
    </motion.div>
  );
}

function NotificationsTab() {
  const [emailSettings, setEmailSettings] = useState(notificationSettings.email);
  const [pushSettings, setPushSettings] = useState(notificationSettings.push);
  const [inAppSettings, setInAppSettings] = useState(notificationSettings.inApp);

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <Card className="bg-[#1a1a2e] border border-white/10">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#e94560]/20 flex items-center justify-center">
                <Mail className="w-5 h-5 text-[#e94560]" />
              </div>
              <div>
                <CardTitle className="text-white">Email Notifications</CardTitle>
                <CardDescription className="text-[#a0a0b0]">
                  Configure what you receive via email
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { key: "dealAlerts", label: "Deal Alerts", desc: "New deals matching your criteria" },
              { key: "portfolioUpdates", label: "Portfolio Updates", desc: "Weekly performance summaries" },
              { key: "weeklyDigest", label: "Weekly Digest", desc: "Top stories and market insights" },
              { key: "meetingReminders", label: "Meeting Reminders", desc: "Upcoming calls and events" },
              { key: "marketNews", label: "Market News", desc: "Industry news and analysis" },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between py-2"
              >
                <div>
                  <p className="text-white font-medium">{item.label}</p>
                  <p className="text-[#6a6a7a] text-sm">{item.desc}</p>
                </div>
                <Toggle
                  checked={emailSettings[item.key as keyof typeof emailSettings]}
                  onChange={() =>
                    setEmailSettings((prev) => ({
                      ...prev,
                      [item.key]: !prev[item.key as keyof typeof prev],
                    }))
                  }
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="bg-[#1a1a2e] border border-white/10">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Smartphone className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <CardTitle className="text-white">Push Notifications</CardTitle>
                <CardDescription className="text-[#a0a0b0]">
                  Mobile and browser push notifications
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { key: "dealAlerts", label: "High Priority Deals", desc: "Urgent deal opportunities" },
              { key: "messages", label: "Direct Messages", desc: "When someone messages you" },
              { key: "mentions", label: "Mentions", desc: "When you&apos;re mentioned in comments" },
              { key: "systemUpdates", label: "System Updates", desc: "Platform maintenance alerts" },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between py-2"
              >
                <div>
                  <p className="text-white font-medium">{item.label}</p>
                  <p className="text-[#6a6a7a] text-sm">{item.desc}</p>
                </div>
                <Toggle
                  checked={pushSettings[item.key as keyof typeof pushSettings]}
                  onChange={() =>
                    setPushSettings((prev) => ({
                      ...prev,
                      [item.key]: !prev[item.key as keyof typeof prev],
                    }))
                  }
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="bg-[#1a1a2e] border border-white/10">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Bell className="w-5 h-5 text-purple-500" />
              </div>
              <div>
                <CardTitle className="text-white">In-App Notifications</CardTitle>
                <CardDescription className="text-[#a0a0b0]">
                  Notifications within the platform
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { key: "dealAlerts", label: "Deal Alerts", desc: "New deal activity" },
              { key: "messages", label: "Messages", desc: "Chat and conversation updates" },
              { key: "mentions", label: "Mentions", desc: "Comments and discussions" },
              { key: "tasks", label: "Tasks", desc: "Assigned tasks and due dates" },
              { key: "systemUpdates", label: "System Updates", desc: "New features and changes" },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between py-2"
              >
                <div>
                  <p className="text-white font-medium">{item.label}</p>
                  <p className="text-[#6a6a7a] text-sm">{item.desc}</p>
                </div>
                <Toggle
                  checked={inAppSettings[item.key as keyof typeof inAppSettings]}
                  onChange={() =>
                    setInAppSettings((prev) => ({
                      ...prev,
                      [item.key]: !prev[item.key as keyof typeof prev],
                    }))
                  }
                />
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

function IntegrationsTab() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <Card className="bg-[#1a1a2e] border border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Connected Services</CardTitle>
            <CardDescription className="text-[#a0a0b0]">
              Manage integrations with your favorite tools
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {integrations.map((integration) => (
              <motion.div
                key={integration.id}
                whileHover={{ scale: 1.01 }}
                className="flex items-center justify-between p-4 bg-[#0f0f1a] border border-white/5 rounded-xl hover:border-white/10 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-[#1a1a2e] flex items-center justify-center text-2xl">
                    {integration.icon}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-white font-medium">{integration.name}</p>
                      {integration.connected ? (
                        <Badge className="bg-green-500/20 text-green-400 border-0 text-xs">
                          <Check className="w-3 h-3 mr-1" />
                          Connected
                        </Badge>
                      ) : (
                        <Badge className="bg-[#6a6a7a]/20 text-[#6a6a7a] border-0 text-xs">
                          Not Connected
                        </Badge>
                      )}
                    </div>
                    <p className="text-[#6a6a7a] text-sm">{integration.category}</p>
                    {integration.connected && integration.lastSync && (
                      <p className="text-[#a0a0b0] text-xs mt-1">
                        Last synced {integration.lastSync}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {integration.connected ? (
                    <>
                      <Button variant="ghost" size="sm" className="text-[#a0a0b0]">
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                      >
                        Disconnect
                      </Button>
                    </>
                  ) : (
                    <Button
                      size="sm"
                      className="bg-[#e94560] hover:bg-[#d63d56] text-white"
                    >
                      Connect
                    </Button>
                  )}
                </div>
              </motion.div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="bg-[#1a1a2e] border border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Available Integrations</CardTitle>
            <CardDescription className="text-[#a0a0b0]">
              More services you can connect
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {[
                { name: "Asana", icon: "📋", category: "Productivity" },
                { name: "Stripe", icon: "💳", category: "Payments" },
                { name: "QuickBooks", icon: "📊", category: "Finance" },
                { name: "DocuSign", icon: "✍️", category: "Legal" },
                { name: "LinkedIn", icon: "💼", category: "Social" },
                { name: "AngelList", icon: "👼", category: "Investing" },
              ].map((item) => (
                <motion.button
                  key={item.name}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex items-center gap-3 p-3 bg-[#0f0f1a] border border-white/5 rounded-lg hover:border-[#e94560]/50 transition-colors text-left"
                >
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <p className="text-white font-medium text-sm">{item.name}</p>
                    <p className="text-[#6a6a7a] text-xs">{item.category}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

function SecurityTab() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <Card className="bg-[#1a1a2e] border border-white/10">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#e94560]/20 flex items-center justify-center">
                <Lock className="w-5 h-5 text-[#e94560]" />
              </div>
              <div>
                <CardTitle className="text-white">Password</CardTitle>
                <CardDescription className="text-[#a0a0b0]">
                  Update your password regularly
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm text-[#a0a0b0]">Current Password</label>
              <input
                type="password"
                placeholder="Enter current password"
                className="w-full px-4 py-2 bg-[#0f0f1a] border border-white/10 rounded-lg text-white placeholder-[#6a6a7a] focus:outline-none focus:border-[#e94560] transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-[#a0a0b0]">New Password</label>
              <input
                type="password"
                placeholder="Enter new password"
                className="w-full px-4 py-2 bg-[#0f0f1a] border border-white/10 rounded-lg text-white placeholder-[#6a6a7a] focus:outline-none focus:border-[#e94560] transition-colors"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-[#a0a0b0]">Confirm New Password</label>
              <input
                type="password"
                placeholder="Confirm new password"
                className="w-full px-4 py-2 bg-[#0f0f1a] border border-white/10 rounded-lg text-white placeholder-[#6a6a7a] focus:outline-none focus:border-[#e94560] transition-colors"
              />
            </div>
            <Button className="bg-[#e94560] hover:bg-[#d63d56] text-white">
              Update Password
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="bg-[#1a1a2e] border border-white/10">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-green-500/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-green-500" />
              </div>
              <div>
                <CardTitle className="text-white">Two-Factor Authentication</CardTitle>
                <CardDescription className="text-[#a0a0b0]">
                  Add an extra layer of security
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Check className="w-5 h-5 text-green-500" />
                </div>
                <div>
                  <p className="text-white font-medium">2FA Enabled</p>
                  <p className="text-green-400 text-sm">
                    Authenticator app configured
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Configure
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="bg-[#1a1a2e] border border-white/10">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Key className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <CardTitle className="text-white">API Keys</CardTitle>
                <CardDescription className="text-[#a0a0b0]">
                  Manage API access for integrations
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {apiKeys.map((apiKey) => (
              <div
                key={apiKey.id}
                className="flex items-center justify-between p-4 bg-[#0f0f1a] border border-white/5 rounded-xl"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-white font-medium">{apiKey.name}</p>
                    <Badge
                      variant="outline"
                      className="border-green-500/30 text-green-400 text-xs"
                    >
                      Active
                    </Badge>
                  </div>
                  <code className="text-[#6a6a7a] text-sm mt-1 block">
                    {apiKey.key}
                  </code>
                  <p className="text-[#a0a0b0] text-xs mt-1">
                    Created {apiKey.created} • Last used {apiKey.lastUsed}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" className="text-[#a0a0b0]">
                    Copy
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-400 hover:text-red-300"
                  >
                    Revoke
                  </Button>
                </div>
              </div>
            ))}
            <Button variant="outline" className="w-full mt-2">
              <Key className="w-4 h-4 mr-2" />
              Generate New API Key
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="bg-[#1a1a2e] border border-red-500/20">
          <CardHeader>
            <CardTitle className="text-red-400">Danger Zone</CardTitle>
            <CardDescription className="text-[#a0a0b0]">
              Irreversible actions for your account
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between py-2">
              <div>
                <p className="text-white font-medium">Export All Data</p>
                <p className="text-[#6a6a7a] text-sm">
                  Download a copy of all your data
                </p>
              </div>
              <Button variant="outline" size="sm">
                Export
              </Button>
            </div>
            <div className="flex items-center justify-between py-2 border-t border-white/10 pt-4">
              <div>
                <p className="text-white font-medium">Delete Account</p>
                <p className="text-[#6a6a7a] text-sm">
                  Permanently delete your account and all data
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-red-500/30 text-red-400 hover:bg-red-500/10"
              >
                Delete
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

function PreferencesTab() {
  const {
    prefersReducedMotion,
    systemPreference,
    userOverride,
    setOverride,
    hasOverride,
  } = useReducedMotionContext();

  const handleReducedMotionChange = (checked: boolean) => {
    setOverride(checked);
  };

  const handleUseSystemPreference = () => {
    setOverride(null);
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.div variants={itemVariants}>
        <Card className="bg-[#1a1a2e] border border-white/10">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#e94560]/20 flex items-center justify-center">
                <Monitor className="w-5 h-5 text-[#e94560]" />
              </div>
              <div>
                <CardTitle className="text-white">Motion & Animation</CardTitle>
                <CardDescription className="text-[#a0a0b0]">
                  Control animations and visual effects
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Reduced Motion Toggle */}
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-white/5">
                <div>
                  <p className="text-white font-medium">Reduce Motion</p>
                  <p className="text-[#6a6a7a] text-sm">
                    Minimize animations for accessibility
                  </p>
                </div>
                <Toggle
                  checked={prefersReducedMotion}
                  onChange={() => handleReducedMotionChange(!prefersReducedMotion)}
                />
              </div>

              {/* System Preference Info */}
              <div className="p-4 bg-[#0f0f1a] rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-[#a0a0b0]">System Preference</span>
                  <Badge
                    variant="outline"
                    className={`text-xs ${
                      systemPreference
                        ? "border-amber-500/30 text-amber-400"
                        : "border-green-500/30 text-green-400"
                    }`}
                  >
                    {systemPreference ? "Reduced" : "Full Motion"}
                  </Badge>
                </div>
                <p className="text-xs text-[#6a6a7a]">
                  Your operating system preference is{" "}
                  {systemPreference ? "set to reduce motion" : "set to allow animations"}.
                </p>
              </div>

              {/* Override Status */}
              {hasOverride && (
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-500/20 text-blue-400 border-0 text-xs">
                    Custom Setting
                  </Badge>
                  <button
                    onClick={handleUseSystemPreference}
                    className="text-xs text-[#a0a0b0] hover:text-white underline"
                  >
                    Use system preference
                  </button>
                </div>
              )}

              {/* Info Box */}
              <div className="p-4 bg-[#0f0f1a] rounded-lg border border-white/5">
                <p className="text-sm text-[#a0a0b0] mb-2">
                  <strong className="text-white">What changes when enabled?</strong>
                </p>
                <ul className="text-sm text-[#6a6a7a] space-y-1 list-disc list-inside">
                  <li>Animations become instant (0.01ms)</li>
                  <li>Slide transitions become simple fades</li>
                  <li>Continuous animations (pulses, spins) are disabled</li>
                  <li>Parallax effects are removed</li>
                  <li>Page transitions are simplified</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants}>
        <Card className="bg-[#1a1a2e] border border-white/10">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500/20 flex items-center justify-center">
                <Eye className="w-5 h-5 text-blue-500" />
              </div>
              <div>
                <CardTitle className="text-white">Display Preferences</CardTitle>
                <CardDescription className="text-[#a0a0b0]">
                  Customize your visual experience
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              {
                label: "Compact Mode",
                description: "Show more content with less spacing",
                checked: false,
              },
              {
                label: "High Contrast",
                description: "Increase contrast for better visibility",
                checked: false,
              },
              {
                label: "Large Text",
                description: "Increase text size throughout the app",
                checked: false,
              },
            ].map((pref) => (
              <div
                key={pref.label}
                className="flex items-center justify-between py-3 border-b border-white/5 last:border-0"
              >
                <div>
                  <p className="text-white font-medium">{pref.label}</p>
                  <p className="text-[#6a6a7a] text-sm">{pref.description}</p>
                </div>
                <Toggle checked={pref.checked} onChange={() => {}} />
              </div>
            ))}
          </CardContent>
        </Card>
      </motion.div>

      <motion.div variants={itemVariants} className="flex justify-end">
        <Button className="bg-[#e94560] hover:bg-[#d63d56] text-white px-6">
          <Save className="w-4 h-4 mr-2" />
          Save Preferences
        </Button>
      </motion.div>
    </motion.div>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileTab />;
      case "firm":
        return <FirmTab />;
      case "notifications":
        return <NotificationsTab />;
      case "preferences":
        return <PreferencesTab />;
      case "integrations":
        return <IntegrationsTab />;
      case "security":
        return <SecurityTab />;
      default:
        return <ProfileTab />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: ANIMATION.duration.normal, ease: ANIMATION.easing.default }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white mb-2">Settings</h1>
          <p className="text-[#a0a0b0]">
            Manage your account, firm, and preferences
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: ANIMATION.duration.normal, ease: ANIMATION.easing.default, delay: 0.1 }}
          className="mb-8"
        >
          <div className="flex flex-wrap gap-2 p-1 bg-[#1a1a2e] rounded-xl border border-white/10">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-lg font-medium text-sm transition-all duration-200 ${
                    activeTab === tab.id
                      ? "bg-[#e94560] text-white"
                      : "text-[#a0a0b0] hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </motion.div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: ANIMATION.duration.fast, ease: ANIMATION.easing.default }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
