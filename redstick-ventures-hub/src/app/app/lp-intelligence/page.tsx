"use client";

import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { 
  TrendingUp, 
  TrendingDown,
  Download,
  Calendar,
  FileText,
  Users,
  DollarSign,
  BarChart3
} from "lucide-react";
import { ANIMATION } from "@/lib/animations";

const fundMetrics = {
  fundSize: "$75M",
  called: "$45M (60%)",
  deployed: "$38M (51%)",
  dryPowder: "$30M",
  rvpi: "1.84x",
  dpi: "0.11x",
  tvpi: "1.95x",
  irr: "28%",
};

const capitalCalls = [
  { id: "1", date: "2024-01-15", amount: "$2.5M", purpose: "Follow-on investment", status: "PAID" },
  { id: "2", date: "2023-10-01", amount: "$5.0M", purpose: "New investment", status: "PAID" },
  { id: "3", date: "2023-07-15", amount: "$3.5M", purpose: "Follow-on investment", status: "PAID" },
];

const distributions = [
  { id: "1", date: "2024-01-10", amount: "$1.2M", source: "Exit - GreenTech Co", type: "RETURN_OF_CAPITAL" },
  { id: "2", date: "2023-12-15", amount: "$800K", source: "Exit - AgriTech Inc", type: "PROFIT" },
];

const documents = [
  { id: "1", name: "Q4 2023 LP Letter", date: "2024-01-15", type: "Quarterly Report" },
  { id: "2", name: "2023 Annual Audit", date: "2024-01-10", type: "Audit" },
  { id: "3", name: "Q3 2023 LP Letter", date: "2023-10-15", type: "Quarterly Report" },
  { id: "4", name: "Fund II PPM", date: "2023-06-01", type: "Legal" },
  { id: "5", name: "Q2 2023 LP Letter", date: "2023-07-15", type: "Quarterly Report" },
];

export default function LPIntelligencePage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: ANIMATION.easing.default }}
      >
        <h2 className="text-h2 font-bold text-text-primary">LP Intelligence</h2>
        <p className="text-body text-text-secondary mt-1">
          Fund performance metrics and LP communications
        </p>
      </motion.div>

      {/* Fund Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: ANIMATION.easing.default }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <Card>
          <CardContent className="p-6">
            <p className="text-xs text-text-tertiary uppercase">Fund Size</p>
            <p className="text-h3 font-bold text-text-primary mt-1">
              {fundMetrics.fundSize}
            </p>
            <p className="text-xs text-text-tertiary mt-1">Fund II</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-xs text-text-tertiary uppercase">TVPI</p>
            <p className="text-h3 font-bold text-text-primary mt-1">
              {fundMetrics.tvpi}
            </p>
            <p className="text-xs text-success flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              +0.15x QoQ
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-xs text-text-tertiary uppercase">Gross IRR</p>
            <p className="text-h3 font-bold text-text-primary mt-1">
              {fundMetrics.irr}
            </p>
            <p className="text-xs text-success flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              +3pp YoY
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-xs text-text-tertiary uppercase">Dry Powder</p>
            <p className="text-h3 font-bold text-text-primary mt-1">
              {fundMetrics.dryPowder}
            </p>
            <p className="text-xs text-text-tertiary mt-1">40% remaining</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Capital Calls & Distributions */}
      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: ANIMATION.easing.default }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Capital Calls</CardTitle>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-small text-accent hover:underline transition-all duration-200"
              >
                View all
              </motion.button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {capitalCalls.map((call, index) => (
                  <motion.div
                    key={call.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                    className="flex items-center justify-between p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                        <DollarSign className="w-4 h-4 text-accent" />
                      </div>
                      <div>
                        <p className="font-medium text-text-primary">{call.amount}</p>
                        <p className="text-xs text-text-secondary">{call.purpose}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant="success">{call.status}</Badge>
                      <p className="text-xs text-text-tertiary mt-1">{call.date}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: ANIMATION.easing.default }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Distributions</CardTitle>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="text-small text-accent hover:underline transition-all duration-200"
              >
                View all
              </motion.button>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {distributions.map((dist, index) => (
                  <motion.div
                    key={dist.id}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.4 + index * 0.05 }}
                    className="flex items-center justify-between p-4"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-success/10 rounded-lg flex items-center justify-center">
                        <TrendingUp className="w-4 h-4 text-success" />
                      </div>
                      <div>
                        <p className="font-medium text-text-primary">{dist.amount}</p>
                        <p className="text-xs text-text-secondary">{dist.source}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge variant={dist.type === "PROFIT" ? "success" : "default"}>
                        {dist.type.replace("_", " ")}
                      </Badge>
                      <p className="text-xs text-text-tertiary mt-1">{dist.date}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Documents */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4, ease: ANIMATION.easing.default }}
      >
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Documents</CardTitle>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center gap-2 text-small text-accent hover:underline transition-all duration-200"
            >
              <Download className="w-4 h-4" />
              Download All
            </motion.button>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {documents.map((doc, index) => (
                <motion.div
                  key={doc.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                  className="flex items-center justify-between p-4 hover:bg-surface-elevated/50 transition-colors duration-200 cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-surface-elevated rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">{doc.name}</p>
                      <p className="text-xs text-text-secondary">{doc.type}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-text-tertiary">{doc.date}</span>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 hover:bg-surface-elevated rounded-lg transition-colors duration-200"
                    >
                      <Download className="w-4 h-4 text-text-tertiary" />
                    </motion.button>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Upcoming Events */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5, ease: ANIMATION.easing.default }}
      >
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Upcoming Events
        </h3>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            { title: "Annual LP Meeting", date: "Mar 15, 2024", type: "Meeting" },
            { title: "Q1 2024 Letter", date: "Apr 15, 2024", type: "Report" },
            { title: "Portfolio Day", date: "May 20, 2024", type: "Event" },
          ].map((event, index) => (
            <motion.div
              key={event.title}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 + index * 0.05 }}
            >
              <Card hover className="cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <Badge variant="primary" className="mb-2">{event.type}</Badge>
                      <h4 className="font-medium text-text-primary">{event.title}</h4>
                      <p className="text-xs text-text-secondary mt-1 flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {event.date}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
