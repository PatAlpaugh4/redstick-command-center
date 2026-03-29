"use client";

import { Suspense, useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  Calendar,
  Search,
  Filter,
  Download,
  Trash2,
  Edit,
  Eye,
  Plus,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  MoreHorizontal,
} from "lucide-react";

import { ErrorBoundary } from "@/components/error";
import { ErrorFallback, ApiError } from "@/components/error";
import { TableSkeleton } from "@/components/skeletons";
import { DataTable, type ColumnDef, type BulkAction } from "@/components/ui";
import { Button } from "@/components/ui";
import { BulkActionsBar } from "@/components/ui";
import { useToast } from "@/hooks/useToast";
import { useExport } from "@/hooks/useExport";
import type { ContentItem, ContentStatus, ContentType } from "@/types";

// =============================================================================
// Mock Data
// =============================================================================

const MOCK_CONTENT: ContentItem[] = [
  {
    id: "content-1",
    title: "Q4 2024 Portfolio Update",
    description: "Comprehensive update on portfolio performance in Q4",
    type: "report",
    status: "published",
    author: "Sarah Chen",
    authorId: "user-1",
    tags: ["portfolio", "quarterly", "update"],
    views: 245,
    likes: 18,
    publishedAt: "2024-12-15T10:00:00Z",
    createdAt: "2024-12-10T08:00:00Z",
    updatedAt: "2024-12-15T10:00:00Z",
  },
  {
    id: "content-2",
    title: "Market Analysis: AI in Healthcare",
    description: "Deep dive into AI opportunities in healthcare sector",
    type: "blog",
    status: "published",
    author: "Mike Ross",
    authorId: "user-2",
    tags: ["ai", "healthcare", "analysis"],
    views: 1892,
    likes: 127,
    publishedAt: "2024-12-12T14:30:00Z",
    createdAt: "2024-12-08T09:00:00Z",
    updatedAt: "2024-12-12T14:30:00Z",
  },
  {
    id: "content-3",
    title: "LP Newsletter - December 2024",
    description: "Monthly newsletter for limited partners",
    type: "newsletter",
    status: "scheduled",
    author: "Sarah Chen",
    authorId: "user-1",
    tags: ["newsletter", "lp", "monthly"],
    views: 0,
    likes: 0,
    scheduledAt: "2024-12-28T09:00:00Z",
    createdAt: "2024-12-20T11:00:00Z",
    updatedAt: "2024-12-22T16:00:00Z",
  },
  {
    id: "content-4",
    title: "Investment Thesis: Climate Tech",
    description: "Our updated investment thesis for climate technology",
    type: "report",
    status: "draft",
    author: "David Kim",
    authorId: "user-3",
    tags: ["climate", "thesis", "investment"],
    views: 0,
    likes: 0,
    createdAt: "2024-12-18T13:00:00Z",
    updatedAt: "2024-12-21T15:30:00Z",
  },
  {
    id: "content-5",
    title: "LinkedIn: Top 10 Fintech Trends 2025",
    description: "Social media post about upcoming fintech trends",
    type: "social",
    status: "published",
    author: "Mike Ross",
    authorId: "user-2",
    tags: ["fintech", "trends", "social"],
    views: 3421,
    likes: 89,
    publishedAt: "2024-12-20T10:00:00Z",
    createdAt: "2024-12-19T14:00:00Z",
    updatedAt: "2024-12-20T10:00:00Z",
  },
  {
    id: "content-6",
    title: "Portfolio Company Spotlight: NexGen AI",
    description: "Feature article on our latest portfolio addition",
    type: "blog",
    status: "draft",
    author: "Sarah Chen",
    authorId: "user-1",
    tags: ["spotlight", "portfolio", "ai"],
    views: 0,
    likes: 0,
    createdAt: "2024-12-22T09:00:00Z",
    updatedAt: "2024-12-23T11:00:00Z",
  },
  {
    id: "content-7",
    title: "Annual Report 2024",
    description: "Comprehensive annual report for stakeholders",
    type: "report",
    status: "archived",
    author: "Sarah Chen",
    authorId: "user-1",
    tags: ["annual", "report", "2024"],
    views: 567,
    likes: 45,
    publishedAt: "2024-01-31T00:00:00Z",
    createdAt: "2024-01-15T08:00:00Z",
    updatedAt: "2024-01-31T00:00:00Z",
  },
  {
    id: "content-8",
    title: "Twitter Thread: Valuation Basics",
    description: "Educational thread on startup valuation fundamentals",
    type: "social",
    status: "scheduled",
    author: "David Kim",
    authorId: "user-3",
    tags: ["education", "valuation", "twitter"],
    views: 0,
    likes: 0,
    scheduledAt: "2024-12-26T13:00:00Z",
    createdAt: "2024-12-24T10:00:00Z",
    updatedAt: "2024-12-25T09:00:00Z",
  },
];

// =============================================================================
// Helper Functions
// =============================================================================

const getStatusIcon = (status: ContentStatus) => {
  switch (status) {
    case "published":
      return <CheckCircle2 className="h-4 w-4 text-green-400" />;
    case "draft":
      return <FileText className="h-4 w-4 text-gray-400" />;
    case "scheduled":
      return <Clock className="h-4 w-4 text-blue-400" />;
    case "archived":
      return <XCircle className="h-4 w-4 text-purple-400" />;
    default:
      return <AlertCircle className="h-4 w-4 text-gray-400" />;
  }
};

const getStatusColor = (status: ContentStatus): string => {
  const colors: Record<ContentStatus, string> = {
    published: "#22c55e",
    draft: "#6b7280",
    scheduled: "#3b82f6",
    archived: "#8b5cf6",
  };
  return colors[status] || "#6b7280";
};

const getStatusLabel = (status: ContentStatus): string => {
  return status.charAt(0).toUpperCase() + status.slice(1);
};

const getTypeIcon = (type: ContentType) => {
  switch (type) {
    case "blog":
      return <FileText className="h-4 w-4" />;
    case "newsletter":
      return <MailIcon className="h-4 w-4" />;
    case "report":
      return <FileText className="h-4 w-4" />;
    case "social":
      return <ShareIcon className="h-4 w-4" />;
    case "update":
      return <AlertCircle className="h-4 w-4" />;
    default:
      return <FileText className="h-4 w-4" />;
  }
};

const getTypeLabel = (type: ContentType): string => {
  return type.charAt(0).toUpperCase() + type.slice(1);
};

// =============================================================================
// Icons
// =============================================================================

function MailIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  );
}

function ShareIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
    </svg>
  );
}

// =============================================================================
// Table Columns Configuration
// =============================================================================

const getContentColumns = (toast: ReturnType<typeof useToast>): ColumnDef<ContentItem>[] => [
  {
    key: "title",
    header: "Title",
    sortable: true,
    filterable: true,
    width: "35%",
    render: (value, row) => (
      <div className="flex items-start gap-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: `${getStatusColor(row.status)}20` }}
        >
          {getStatusIcon(row.status)}
        </div>
        <div className="min-w-0">
          <span className="font-medium text-white block truncate">{value}</span>
          <span className="text-xs text-[#6a6a7a] line-clamp-1">{row.description}</span>
        </div>
      </div>
    ),
  },
  {
    key: "type",
    header: "Type",
    sortable: true,
    filterable: true,
    width: "10%",
    render: (value) => (
      <div className="flex items-center gap-2 text-[#a0a0b0]">
        {getTypeIcon(value as ContentType)}
        <span className="capitalize">{getTypeLabel(value as ContentType)}</span>
      </div>
    ),
  },
  {
    key: "status",
    header: "Status",
    sortable: true,
    filterable: true,
    width: "10%",
    render: (value) => (
      <span
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
        style={{
          backgroundColor: `${getStatusColor(value as ContentStatus)}20`,
          color: getStatusColor(value as ContentStatus),
        }}
      >
        {getStatusIcon(value as ContentStatus)}
        {getStatusLabel(value as ContentStatus)}
      </span>
    ),
  },
  {
    key: "author",
    header: "Author",
    sortable: true,
    filterable: true,
    width: "12%",
    render: (value) => <span className="text-[#a0a0b0]">{value}</span>,
  },
  {
    key: "views",
    header: "Views",
    sortable: true,
    width: "8%",
    render: (value) => (
      <div className="flex items-center gap-1 text-[#a0a0b0]">
        <Eye className="h-4 w-4" />
        {(value as number).toLocaleString()}
      </div>
    ),
  },
  {
    key: "publishedAt",
    header: "Published",
    sortable: true,
    width: "12%",
    render: (value, row) => {
      const date = value || row.scheduledAt;
      return (
        <span className="text-[#a0a0b0]">
          {date ? new Date(date as string).toLocaleDateString() : "-"}
        </span>
      );
    },
  },
  {
    key: "updatedAt",
    header: "Last Modified",
    sortable: true,
    width: "10%",
    render: (value) => (
      <span className="text-[#6a6a7a] text-sm">
        {new Date(value as string).toLocaleDateString()}
      </span>
    ),
  },
  {
    key: "id",
    header: "Actions",
    width: "3%",
    render: (_, row) => (
      <div className="flex items-center justify-end">
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-[#a0a0b0] hover:text-white"
          onClick={(e) => {
            e.stopPropagation();
            // More actions
          }}
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </div>
    ),
  },
];

// =============================================================================
// Main Page Component
// =============================================================================

export default function ContentStudioPage() {
  const toast = useToast();
  const [isLoading] = useState(false);
  const [selectedContent, setSelectedContent] = useState<ContentItem[]>([]);
  const [statusFilter, setStatusFilter] = useState<ContentStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<ContentType | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Filter content based on filters and search
  const filteredContent = useMemo(() => {
    return MOCK_CONTENT.filter((item) => {
      if (statusFilter !== "all" && item.status !== statusFilter) return false;
      if (typeFilter !== "all" && item.type !== typeFilter) return false;
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        return (
          item.title.toLowerCase().includes(query) ||
          item.description?.toLowerCase().includes(query) ||
          item.tags.some((tag) => tag.toLowerCase().includes(query))
        );
      }
      return true;
    });
  }, [statusFilter, typeFilter, searchQuery]);

  // Export functionality
  const { exportCSV, isExporting } = useExport({
    data: selectedContent.length > 0 ? selectedContent : filteredContent,
    filename: `content-${new Date().toISOString().split("T")[0]}`,
    onSuccess: () => {
      toast.success("Export Complete", "Content exported successfully");
    },
    onError: (err) => {
      toast.error("Export Failed", err.message);
    },
  });

  // Handle bulk publish
  const handleBulkPublish = useCallback(
    async (selectedRows: ContentItem[]) => {
      const draftItems = selectedRows.filter((item) => item.status === "draft");
      if (draftItems.length === 0) {
        toast.warning("No Draft Items", "Select draft items to publish");
        return;
      }

      toast.success(
        "Published",
        `${draftItems.length} item(s) published successfully`
      );
    },
    [toast]
  );

  // Handle bulk delete
  const handleBulkDelete = useCallback(
    async (selectedRows: ContentItem[]) => {
      if (!confirm(`Delete ${selectedRows.length} items? This action cannot be undone.`)) {
        return;
      }

      toast.success("Deleted", `${selectedRows.length} item(s) deleted successfully`);
      setSelectedContent([]);
    },
    [toast]
  );

  // Bulk actions for DataTable
  const bulkActions: BulkAction<ContentItem>[] = [
    {
      label: "Export",
      icon: <Download className="h-4 w-4 mr-2" />,
      onClick: () => exportCSV(),
    },
    {
      label: "Publish",
      icon: <CheckCircle2 className="h-4 w-4 mr-2" />,
      onClick: handleBulkPublish,
    },
    {
      label: "Delete",
      icon: <Trash2 className="h-4 w-4 mr-2" />,
      variant: "destructive",
      onClick: handleBulkDelete,
    },
  ];

  // Stats
  const stats = {
    total: MOCK_CONTENT.length,
    published: MOCK_CONTENT.filter((c) => c.status === "published").length,
    draft: MOCK_CONTENT.filter((c) => c.status === "draft").length,
    scheduled: MOCK_CONTENT.filter((c) => c.status === "scheduled").length,
    archived: MOCK_CONTENT.filter((c) => c.status === "archived").length,
    totalViews: MOCK_CONTENT.reduce((sum, c) => sum + c.views, 0),
    totalLikes: MOCK_CONTENT.reduce((sum, c) => sum + c.likes, 0),
  };

  return (
    <div className="min-h-screen bg-[#0f0f1a] p-6">
      <div className="max-w-[1600px] mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
        >
          <div>
            <h1 className="text-3xl font-bold text-white mb-1">Content Studio</h1>
            <p className="text-[#a0a0b0]">
              Create, manage, and publish content for your audience
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Export Button */}
            <Button
              variant="outline"
              onClick={() => exportCSV()}
              disabled={isExporting}
              className="border-white/10 text-[#a0a0b0] hover:text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>

            {/* Add Content Button */}
            <Button
              className="bg-[#e94560] hover:bg-[#d63d56] text-white"
              onClick={() => {
                toast.info("Coming Soon", "Content creation will be available soon");
              }}
            >
              <Plus className="h-4 w-4 mr-2" />
              New Content
            </Button>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-6"
        >
          <StatCard
            label="Total Content"
            value={stats.total.toString()}
            color="#e94560"
          />
          <StatCard
            label="Published"
            value={stats.published.toString()}
            color="#22c55e"
          />
          <StatCard
            label="Drafts"
            value={stats.draft.toString()}
            color="#6b7280"
          />
          <StatCard
            label="Scheduled"
            value={stats.scheduled.toString()}
            color="#3b82f6"
          />
          <StatCard
            label="Total Views"
            value={stats.totalViews.toLocaleString()}
            color="#f59e0b"
          />
          <StatCard
            label="Total Likes"
            value={stats.totalLikes.toLocaleString()}
            color="#ec4899"
          />
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 mb-6"
        >
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#6a6a7a]" />
            <input
              type="text"
              placeholder="Search content..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#1a1a2e] border border-white/10 rounded-lg text-white placeholder-[#6a6a7a] focus:outline-none focus:border-[#e94560]/50"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-[#6a6a7a]" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as ContentStatus | "all")}
              className="px-3 py-2.5 bg-[#1a1a2e] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#e94560]/50"
            >
              <option value="all">All Status</option>
              <option value="published">Published</option>
              <option value="draft">Draft</option>
              <option value="scheduled">Scheduled</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          {/* Type Filter */}
          <div className="flex items-center gap-2">
            <FileText className="h-4 w-4 text-[#6a6a7a]" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value as ContentType | "all")}
              className="px-3 py-2.5 bg-[#1a1a2e] border border-white/10 rounded-lg text-white focus:outline-none focus:border-[#e94560]/50"
            >
              <option value="all">All Types</option>
              <option value="blog">Blog</option>
              <option value="newsletter">Newsletter</option>
              <option value="report">Report</option>
              <option value="social">Social</option>
              <option value="update">Update</option>
            </select>
          </div>
        </motion.div>

        {/* Content Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <ErrorBoundary
            fallback={<ErrorFallback />}
            onError={(error) => {
              console.error("Content studio error:", error);
              toast.error("Error", "Something went wrong loading content");
            }}
          >
            <Suspense fallback={<TableSkeleton />}>
              <DataTable
                data={filteredContent}
                columns={getContentColumns(toast)}
                pageSize={10}
                onSelectionChange={setSelectedContent}
                bulkActions={bulkActions}
                rowKey="id"
                loading={isLoading}
                emptyState={{
                  title: "No content found",
                  description: "Create your first piece of content to get started.",
                }}
              />
            </Suspense>
          </ErrorBoundary>
        </motion.div>

        {/* Bulk Actions Bar */}
        <BulkActionsBar
          selectedCount={selectedContent.length}
          totalCount={filteredContent.length}
          onSelectAll={() => setSelectedContent(filteredContent)}
          onClearSelection={() => setSelectedContent([])}
          actions={[
            {
              label: "Export Selected",
              icon: <Download className="h-4 w-4" />,
              onClick: () => exportCSV(),
              variant: "default",
            },
            {
              label: "Publish",
              icon: <CheckCircle2 className="h-4 w-4" />,
              onClick: () => handleBulkPublish(selectedContent),
              variant: "primary",
            },
            {
              label: "Delete",
              icon: <Trash2 className="h-4 w-4" />,
              onClick: () => handleBulkDelete(selectedContent),
              variant: "danger",
            },
          ]}
        />
      </div>
    </div>
  );
}

// =============================================================================
// Stat Card Component
// =============================================================================

function StatCard({
  label,
  value,
  color,
}: {
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="bg-[#1a1a2e] rounded-xl p-4 border border-white/10">
      <p className="text-[#a0a0b0] text-sm mb-1">{label}</p>
      <p className="text-xl font-bold" style={{ color }}>
        {value}
      </p>
    </div>
  );
}
