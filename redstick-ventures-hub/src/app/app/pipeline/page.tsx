"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal,
  Calendar,
  DollarSign,
  Users,
  Building2,
  ArrowRight
} from "lucide-react";
import { ANIMATION } from "@/lib/animations";

const pipelineStages = [
  { id: "inbound", name: "Inbound", count: 24 },
  { id: "screening", name: "Screening", count: 12 },
  { id: "first_meeting", name: "1st Meeting", count: 8 },
  { id: "deep_dive", name: "Deep Dive", count: 5 },
  { id: "diligence", name: "Due Diligence", count: 3 },
  { id: "ic_review", name: "IC Review", count: 2 },
  { id: "term_sheet", name: "Term Sheet", count: 1 },
  { id: "closed", name: "Closed", count: 0 },
];

const deals = [
  {
    id: "1",
    company: "AquaCulture Labs",
    stage: "DUE_DILIGENCE",
    amount: "$4.2M",
    round: "Series A",
    lead: "Sarah Chen",
    date: "2024-01-15",
    tags: ["aquaculture", "biotech"],
    score: 8.5,
  },
  {
    id: "2",
    company: "FarmGrid Analytics",
    stage: "IC_REVIEW",
    amount: "$1.8M",
    round: "Seed",
    lead: "Marcus Johnson",
    date: "2024-01-12",
    tags: ["data", "saas"],
    score: 7.8,
  },
  {
    id: "3",
    company: "VerticalHarvest",
    stage: "TERM_SHEET",
    amount: "$12M",
    round: "Series B",
    lead: "Sarah Chen",
    date: "2024-01-10",
    tags: ["vertical_farming", "cex"],
    score: 9.1,
  },
  {
    id: "4",
    company: "ProteinFuture",
    stage: "DEEP_DIVE",
    amount: "$3.5M",
    round: "Series A",
    lead: "Dr. Elena Rodriguez",
    date: "2024-01-08",
    tags: ["alt_protein", "biotech"],
    score: 8.2,
  },
  {
    id: "5",
    company: "SupplyChain AI",
    stage: "FIRST_MEETING",
    amount: "$2.0M",
    round: "Seed",
    lead: "James Park",
    date: "2024-01-05",
    tags: ["ai", "supply_chain"],
    score: 7.5,
  },
];

export default function PipelinePage() {
  const [selectedStage, setSelectedStage] = useState<string | null>(null);
  const [view, setView] = useState<"board" | "list">("board");

  const getStatusColor = (stage: string) => {
    switch (stage) {
      case "TERM_SHEET": return "success";
      case "IC_REVIEW": return "info";
      case "DUE_DILIGENCE": return "info";
      case "CLOSED": return "success";
      case "PASSED": return "error";
      default: return "default";
    }
  };

  const filteredDeals = selectedStage
    ? deals.filter((d) => d.stage === selectedStage.toUpperCase())
    : deals;

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: ANIMATION.easing.default }}
        className="flex flex-col md:flex-row md:items-center justify-between gap-4"
      >
        <div>
          <h2 className="text-h2 font-bold text-text-primary">Deal Pipeline</h2>
          <p className="text-body text-text-secondary mt-1">
            Track and manage your active investment opportunities
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex bg-surface rounded-lg p-1 border border-border">
            <button
              onClick={() => setView("board")}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors duration-200 ${
                view === "board" ? "bg-surface-elevated text-text-primary" : "text-text-secondary"
              }`}
            >
              Board
            </button>
            <button
              onClick={() => setView("list")}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors duration-200 ${
                view === "list" ? "bg-surface-elevated text-text-primary" : "text-text-secondary"
              }`}
            >
              List
            </button>
          </div>
          <Button className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Deal
          </Button>
        </div>
      </motion.div>

      {/* Pipeline Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: ANIMATION.easing.default }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-text-tertiary uppercase">Total Active</p>
            <p className="text-h3 font-bold text-text-primary mt-1">55</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-text-tertiary uppercase">In Diligence</p>
            <p className="text-h3 font-bold text-text-primary mt-1">3</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-text-tertiary uppercase">IC Pending</p>
            <p className="text-h3 font-bold text-text-primary mt-1">2</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-text-tertiary uppercase">Term Sheets</p>
            <p className="text-h3 font-bold text-text-primary mt-1">1</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Filters */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2, ease: ANIMATION.easing.default }}
        className="flex flex-col md:flex-row gap-4"
      >
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-tertiary" />
          <input
            type="text"
            placeholder="Search deals..."
            className="w-full pl-10 pr-4 py-2 bg-surface border border-border rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent transition-colors duration-200"
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-lg text-text-secondary hover:bg-surface-elevated transition-colors duration-200">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </motion.div>

      {/* Pipeline Board */}
      {view === "board" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="overflow-x-auto"
        >
          <div className="flex gap-4 min-w-max pb-4">
            {pipelineStages.map((stage, stageIndex) => (
              <motion.div
                key={stage.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + stageIndex * 0.05 }}
                className="w-72 flex-shrink-0"
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-semibold text-text-primary">
                    {stage.name}
                  </h3>
                  <span className="px-2 py-0.5 bg-surface text-text-tertiary text-xs rounded-full">
                    {stage.count}
                  </span>
                </div>
                <div className="space-y-3">
                  {deals
                    .filter((d) => d.stage === stage.id.toUpperCase())
                    .map((deal, dealIndex) => (
                      <motion.div
                        key={deal.id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: 0.4 + dealIndex * 0.05 }}
                      >
                        <Card hover className="cursor-pointer">
                          <CardContent className="p-4">
                            <div className="flex items-start justify-between mb-3">
                              <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                                <Building2 className="w-4 h-4 text-accent" />
                              </div>
                              <button className="p-1 hover:bg-surface-elevated rounded transition-colors duration-200">
                                <MoreHorizontal className="w-4 h-4 text-text-tertiary" />
                              </button>
                            </div>
                            <h4 className="font-semibold text-text-primary mb-1">
                              {deal.company}
                            </h4>
                            <p className="text-xs text-text-secondary mb-3">
                              {deal.round} • {deal.amount}
                            </p>
                            <div className="flex items-center justify-between">
                              <div className="flex gap-1">
                                {deal.tags.slice(0, 2).map((tag) => (
                                  <span
                                    key={tag}
                                    className="px-2 py-0.5 bg-surface-elevated text-text-tertiary text-xs rounded"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                              <span className={`text-xs font-medium ${
                                deal.score >= 8 ? "text-success" : 
                                deal.score >= 7 ? "text-warning" : "text-text-tertiary"
                              }`}>
                                {deal.score}
                              </span>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    className="w-full py-2 border border-dashed border-border rounded-lg text-text-tertiary text-sm hover:border-accent hover:text-accent transition-colors duration-200"
                  >
                    + Add deal
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* List View */}
      {view === "list" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <Card>
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                    <th className="pb-3 px-6 pt-4">Company</th>
                    <th className="pb-3 px-4 pt-4">Stage</th>
                    <th className="pb-3 px-4 pt-4">Round</th>
                    <th className="pb-3 px-4 pt-4">Amount</th>
                    <th className="pb-3 px-4 pt-4">Lead</th>
                    <th className="pb-3 px-4 pt-4">Score</th>
                    <th className="pb-3 px-6 pt-4"></th>
                  </tr>
                </thead>
                <tbody className="text-small">
                  {deals.map((deal, index) => (
                    <motion.tr
                      key={deal.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                      className="border-t border-border hover:bg-surface-elevated/50 transition-colors duration-200 cursor-pointer"
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                            <Building2 className="w-4 h-4 text-accent" />
                          </div>
                          <span className="font-medium text-text-primary">
                            {deal.company}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge variant={getStatusColor(deal.stage)}>
                          {deal.stage.replace("_", " ")}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-text-secondary">{deal.round}</td>
                      <td className="py-4 px-4 text-text-secondary">{deal.amount}</td>
                      <td className="py-4 px-4 text-text-secondary">{deal.lead}</td>
                      <td className="py-4 px-4">
                        <span className={`font-medium ${
                          deal.score >= 8 ? "text-success" : 
                          deal.score >= 7 ? "text-warning" : "text-text-tertiary"
                        }`}>
                          {deal.score}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <button className="p-1 hover:bg-surface-elevated rounded transition-colors duration-200">
                          <ArrowRight className="w-4 h-4 text-text-tertiary" />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
