"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { ANIMATION } from "@/lib/animations";
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  FileText,
  Calendar,
  Clock,
  TrendingUp,
  X,
  ChevronRight,
  BarChart3,
  Megaphone,
  LayoutGrid,
  CheckSquare,
} from "lucide-react";

type ContentStatus = "published" | "draft" | "scheduled";
type ContentType = "blog" | "lp-letter" | "market-analysis";

interface ContentItem {
  id: string;
  title: string;
  type: ContentType;
  author: string;
  status: ContentStatus;
  publishDate: string;
  views: number;
  excerpt: string;
  tags: string[];
}

const mockContent: ContentItem[] = [
  {
    id: "1",
    title: "The Future of Regenerative Agriculture: 2025 Outlook",
    type: "blog",
    author: "Sarah Chen",
    status: "published",
    publishDate: "2025-12-15",
    views: 2847,
    excerpt: "An in-depth analysis of emerging trends in regenerative farming practices and their impact on venture capital investments...",
    tags: ["AgTech", "Sustainability"],
  },
  {
    id: "2",
    title: "Q4 2025 LP Letter: Portfolio Performance Update",
    type: "lp-letter",
    author: "Michael Torres",
    status: "published",
    publishDate: "2025-12-10",
    views: 156,
    excerpt: "Dear Limited Partners, we are pleased to share our quarterly performance report highlighting key milestones...",
    tags: ["Investor Update", "Performance"],
  },
  {
    id: "3",
    title: "Alternative Protein Market Analysis: Beyond the Hype",
    type: "market-analysis",
    author: "Dr. Emily Watson",
    status: "draft",
    publishDate: "",
    views: 0,
    excerpt: "A comprehensive evaluation of the alternative protein sector, examining technical challenges and market realities...",
    tags: ["FoodTech", "Research"],
  },
  {
    id: "4",
    title: "Precision Farming: AI-Driven Crop Management",
    type: "blog",
    author: "Sarah Chen",
    status: "scheduled",
    publishDate: "2026-01-05",
    views: 0,
    excerpt: "How artificial intelligence is revolutionizing decision-making in modern agriculture operations...",
    tags: ["AI", "AgTech"],
  },
  {
    id: "5",
    title: "Annual LP Report 2025: Year in Review",
    type: "lp-letter",
    author: "Michael Torres",
    status: "draft",
    publishDate: "",
    views: 0,
    excerpt: "Reflecting on a transformative year for Redstick Ventures and our portfolio companies in the food and ag ecosystem...",
    tags: ["Annual Report", "LP Only"],
  },
  {
    id: "6",
    title: "Vertical Farming Economics: Unit Economics Deep Dive",
    type: "market-analysis",
    author: "James Liu",
    status: "published",
    publishDate: "2025-11-28",
    views: 1923,
    excerpt: "Examining the true cost structures of vertical farming operations and their path to profitability...",
    tags: ["Vertical Farming", "Economics"],
  },
  {
    id: "7",
    title: "Supply Chain Resilience in Food Systems",
    type: "blog",
    author: "Sarah Chen",
    status: "scheduled",
    publishDate: "2026-01-12",
    views: 0,
    excerpt: "Lessons learned from recent disruptions and strategies for building more resilient food supply chains...",
    tags: ["Supply Chain", "Risk"],
  },
  {
    id: "8",
    title: "Emerging Markets: Latin American Ag Opportunities",
    type: "market-analysis",
    author: "Dr. Emily Watson",
    status: "draft",
    publishDate: "",
    views: 0,
    excerpt: "Exploring investment opportunities in Latin America's rapidly evolving agricultural technology landscape...",
    tags: ["LatAm", "Emerging Markets"],
  },
];

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

const tabs = [
  { id: "all", label: "All Content", count: mockContent.length },
  { id: "published", label: "Published", count: mockContent.filter((c) => c.status === "published").length },
  { id: "draft", label: "Drafts", count: mockContent.filter((c) => c.status === "draft").length },
  { id: "scheduled", label: "Scheduled", count: mockContent.filter((c) => c.status === "scheduled").length },
];

const statusColors: Record<ContentStatus, string> = {
  published: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  draft: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  scheduled: "bg-blue-500/20 text-blue-400 border-blue-500/30",
};

const typeIcons: Record<ContentType, React.ReactNode> = {
  blog: <FileText className="w-4 h-4" />,
  "lp-letter": <Megaphone className="w-4 h-4" />,
  "market-analysis": <BarChart3 className="w-4 h-4" />,
};

const typeLabels: Record<ContentType, string> = {
  blog: "Blog Post",
  "lp-letter": "LP Letter",
  "market-analysis": "Market Analysis",
};

export default function ContentStudioPage() {
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const stats = {
    published: mockContent.filter((c) => c.status === "published").length,
    drafts: mockContent.filter((c) => c.status === "draft").length,
    scheduled: mockContent.filter((c) => c.status === "scheduled").length,
    totalViews: mockContent.reduce((acc, c) => acc + c.views, 0),
  };

  const filteredContent = mockContent.filter((item) => {
    const matchesTab = activeTab === "all" || item.status === activeTab;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesTab && matchesSearch;
  });

  const toggleItemSelection = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleAllSelection = () => {
    if (selectedItems.length === filteredContent.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(filteredContent.map((item) => item.id));
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-h2 font-bold text-text-primary">Content Studio</h2>
          <p className="text-body text-text-secondary">Manage blog posts, LP letters, and market analysis</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Create New
        </Button>
      </div>

      {/* Stats Cards */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
      >
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-small text-text-secondary">Published</p>
                  <p className="text-h3 font-bold text-text-primary mt-1">{stats.published}</p>
                </div>
                <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                  <CheckSquare className="w-5 h-5 text-success" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-small text-text-secondary">Drafts</p>
                  <p className="text-h3 font-bold text-text-primary mt-1">{stats.drafts}</p>
                </div>
                <div className="w-10 h-10 bg-warning/10 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-warning" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-small text-text-secondary">Scheduled</p>
                  <p className="text-h3 font-bold text-text-primary mt-1">{stats.scheduled}</p>
                </div>
                <div className="w-10 h-10 bg-info/10 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-info" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-small text-text-secondary">Total Views</p>
                  <p className="text-h3 font-bold text-text-primary mt-1">
                    {stats.totalViews.toLocaleString()}
                  </p>
                </div>
                <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-accent" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* Tabs and Search */}
      <div className="flex flex-col lg:flex-row lg:items-center gap-4">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                activeTab === tab.id
                  ? "bg-accent text-white"
                  : "bg-surface text-text-secondary hover:text-white border border-border"
              }`}
            >
              {tab.label}
              <span
                className={`ml-2 px-2 py-0.5 rounded-full text-xs ${
                  activeTab === tab.id ? "bg-white/20" : "bg-white/5"
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        <div className="flex-1 flex gap-3 lg:justify-end">
          <div className="relative flex-1 lg:flex-none lg:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
            <input
              type="text"
              placeholder="Search content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface border border-border rounded-lg pl-10 pr-4 py-2 text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent transition-colors duration-200"
            />
          </div>
          <Button variant="secondary">
            <Filter className="w-4 h-4 mr-2" />
            Filter
          </Button>
        </div>
      </div>

      {/* Bulk Actions */}
      <AnimatePresence>
        {selectedItems.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="flex items-center gap-3 p-3 bg-surface border border-border rounded-xl"
          >
            <span className="text-small text-text-secondary">
              {selectedItems.length} selected
            </span>
            <div className="h-4 w-px bg-border" />
            <button className="text-small text-text-secondary hover:text-text-primary transition-colors">
              Publish
            </button>
            <button className="text-small text-text-secondary hover:text-text-primary transition-colors">
              Move to Drafts
            </button>
            <button className="text-small text-error hover:text-error transition-colors">
              Delete
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content List */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-3"
      >
        {/* List Header */}
        <div className="flex items-center gap-4 px-4 py-2 text-sm text-text-tertiary">
          <input
            type="checkbox"
            checked={selectedItems.length === filteredContent.length && filteredContent.length > 0}
            onChange={toggleAllSelection}
            className="w-4 h-4 rounded border-border bg-surface text-accent focus:ring-accent/50"
          />
          <div className="flex-1">Content</div>
          <div className="hidden md:block w-32">Author</div>
          <div className="hidden lg:block w-28">Status</div>
          <div className="hidden sm:block w-28">Date</div>
          <div className="w-20 text-right">Views</div>
          <div className="w-10" />
        </div>

        {/* Content Items */}
        <AnimatePresence mode="popLayout">
          {filteredContent.map((item) => (
            <motion.div
              key={item.id}
              variants={itemVariants}
              layout
              className="group"
            >
              <Card hover>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => toggleItemSelection(item.id)}
                      className="w-4 h-4 rounded border-border bg-surface text-accent focus:ring-accent/50"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="p-1.5 rounded-md bg-surface-elevated text-text-secondary">
                          {typeIcons[item.type]}
                        </span>
                        <h3
                          className="text-white font-medium truncate cursor-pointer hover:text-accent transition-colors"
                          onClick={() => setSelectedContent(item)}
                        >
                          {item.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {item.tags.map((tag) => (
                          <Badge key={tag} variant="default" className="text-[10px] px-1.5 py-0">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="hidden md:block w-32 text-sm text-text-secondary truncate">
                      {item.author}
                    </div>

                    <div className="hidden lg:block w-28">
                      <Badge variant="outline" className={`${statusColors[item.status]} text-xs capitalize`}>
                        {item.status}
                      </Badge>
                    </div>

                    <div className="hidden sm:block w-28 text-sm text-text-tertiary">
                      {item.publishDate
                        ? new Date(item.publishDate).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "—"}
                    </div>

                    <div className="w-20 text-right text-sm text-text-secondary">
                      {item.views > 0 ? item.views.toLocaleString() : "—"}
                    </div>

                    <div className="w-10 flex justify-end">
                      <button className="p-2 rounded-lg hover:bg-surface-elevated text-text-tertiary hover:text-text-primary transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {filteredContent.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-surface flex items-center justify-center">
              <Search className="w-8 h-8 text-text-tertiary" />
            </div>
            <p className="text-text-secondary">No content found matching your criteria</p>
          </motion.div>
        )}
      </motion.div>

      {/* Content Editor Preview Modal */}
      <AnimatePresence>
        {selectedContent && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedContent(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: ANIMATION.duration.fast, ease: ANIMATION.easing.default }}
              className="bg-surface border border-border rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-border">
                <div className="flex items-center gap-3">
                  <span className="p-2 rounded-lg bg-surface-elevated text-text-secondary">
                    {typeIcons[selectedContent.type]}
                  </span>
                  <div>
                    <h2 className="text-lg font-semibold text-text-primary">
                      {typeLabels[selectedContent.type]} Preview
                    </h2>
                    <p className="text-sm text-text-tertiary">Read-only view</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="secondary" size="sm">
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <button
                    onClick={() => setSelectedContent(null)}
                    className="p-2 rounded-lg hover:bg-surface-elevated text-text-tertiary hover:text-text-primary transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-140px)]">
                <div className="p-8">
                  {/* Article Header */}
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="outline" className={`${statusColors[selectedContent.status]} text-xs capitalize`}>
                        {selectedContent.status}
                      </Badge>
                      {selectedContent.tags.map((tag) => (
                        <Badge key={tag} variant="default" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <h1 className="text-3xl font-bold text-text-primary mb-4 leading-tight">
                      {selectedContent.title}
                    </h1>
                    <div className="flex items-center gap-6 text-sm text-text-tertiary">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent text-xs font-medium">
                          {selectedContent.author.split(" ").map((n) => n[0]).join("")}
                        </div>
                        <span>{selectedContent.author}</span>
                      </div>
                      {selectedContent.publishDate && (
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(selectedContent.publishDate).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </div>
                      )}
                      {selectedContent.views > 0 && (
                        <div className="flex items-center gap-1">
                          <Eye className="w-4 h-4" />
                          {selectedContent.views.toLocaleString()} views
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Article Body Preview */}
                  <div className="prose prose-invert max-w-none">
                    <p className="text-lg text-text-secondary leading-relaxed mb-6">
                      {selectedContent.excerpt}
                    </p>
                    <div className="space-y-4 text-text-secondary">
                      <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
                        incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis
                        nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                      </p>
                      <p>
                        Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore
                        eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt
                        in culpa qui officia deserunt mollit anim id est laborum.
                      </p>
                      <div className="my-8 p-6 bg-surface-elevated rounded-xl border border-border">
                        <h3 className="text-text-primary font-semibold mb-2">Key Takeaways</h3>
                        <ul className="list-disc list-inside space-y-2">
                          <li>Strategic insights into emerging market trends</li>
                          <li>Analysis of competitive landscape and opportunities</li>
                          <li>Recommendations for portfolio positioning</li>
                        </ul>
                      </div>
                      <p>
                        Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium
                        doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
                        veritatis et quasi architecto beatae vitae dicta sunt explicabo.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between p-4 border-t border-border bg-surface-elevated/50">
                <div className="flex items-center gap-2 text-sm text-text-tertiary">
                  <LayoutGrid className="w-4 h-4" />
                  <span>Word count: 1,247</span>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="secondary" size="sm">
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete
                  </Button>
                  <Button size="sm">
                    <ChevronRight className="w-4 h-4 mr-2" />
                    Open Full Editor
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
