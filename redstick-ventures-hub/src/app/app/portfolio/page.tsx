"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { 
  TrendingUp, 
  TrendingDown,
  Building2,
  ExternalLink,
  Plus
} from "lucide-react";
import { ANIMATION } from "@/lib/animations";

const portfolioStats = {
  totalCompanies: 12,
  portfolioValue: "$47.2M",
  totalDeployed: "$23.1M",
  multiple: "2.04x",
  grossIrr: "31%",
  realized: "$8.5M",
  unrealized: "$38.7M",
};

const portfolioCompanies = [
  {
    id: "1",
    name: "AquaCulture Labs",
    sector: "Aquaculture",
    stage: "Series A",
    investment: "$2.0M",
    valuation: "$12M",
    multiple: "6.0x",
    irr: "145%",
    status: "performing",
    founded: "2021",
    employees: 24,
    lastRound: "Series B",
  },
  {
    id: "2",
    name: "FarmGrid Analytics",
    sector: "AgTech",
    stage: "Series A",
    investment: "$1.5M",
    valuation: "$8M",
    multiple: "5.3x",
    irr: "120%",
    status: "performing",
    founded: "2020",
    employees: 18,
    lastRound: "Series A",
  },
  {
    id: "3",
    name: "VerticalHarvest",
    sector: "Vertical Farming",
    stage: "Series B",
    investment: "$3.0M",
    valuation: "$25M",
    multiple: "8.3x",
    irr: "95%",
    status: "performing",
    founded: "2019",
    employees: 45,
    lastRound: "Series B",
  },
  {
    id: "4",
    name: "ProteinFuture",
    sector: "Alternative Protein",
    stage: "Series A",
    investment: "$1.8M",
    valuation: "$6M",
    multiple: "3.3x",
    irr: "78%",
    status: "performing",
    founded: "2021",
    employees: 12,
    lastRound: "Seed",
  },
  {
    id: "5",
    name: "SupplyChain AI",
    sector: "Supply Chain",
    stage: "Seed",
    investment: "$500K",
    valuation: "$4M",
    multiple: "8.0x",
    irr: "200%",
    status: "performing",
    founded: "2022",
    employees: 8,
    lastRound: "Seed",
  },
  {
    id: "6",
    name: "GreenYield",
    sector: "Precision Ag",
    stage: "Series B",
    investment: "$2.5M",
    valuation: "$15M",
    multiple: "6.0x",
    irr: "85%",
    status: "performing",
    founded: "2018",
    employees: 32,
    lastRound: "Series B",
  },
];

const recentActivity = [
  { id: "1", company: "AquaCulture Labs", action: "Raised Series B", value: "$15M", date: "2 days ago" },
  { id: "2", company: "FarmGrid Analytics", action: "Partnership announced", value: "—", date: "1 week ago" },
  { id: "3", company: "VerticalHarvest", action: "New facility opening", value: "—", date: "2 weeks ago" },
  { id: "4", company: "ProteinFuture", action: "FDA approval received", value: "—", date: "3 weeks ago" },
];

export default function PortfolioPage() {
  const [view, setView] = useState<"grid" | "table">("grid");

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
          <h2 className="text-h2 font-bold text-text-primary">Portfolio</h2>
          <p className="text-body text-text-secondary mt-1">
            Track performance of your portfolio companies
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.98 }}
          className="btn-hover flex items-center gap-2 px-6 py-3 bg-accent text-white font-medium rounded-lg"
        >
          <Plus className="w-4 h-4" />
          Add Investment
        </motion.button>
      </motion.div>

      {/* Portfolio Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: ANIMATION.easing.default }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        <Card>
          <CardContent className="p-6">
            <p className="text-xs text-text-tertiary uppercase">Portfolio Value</p>
            <p className="text-h3 font-bold text-text-primary mt-1">
              {portfolioStats.portfolioValue}
            </p>
            <p className="text-xs text-success flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              +23% YoY
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-xs text-text-tertiary uppercase">Multiple</p>
            <p className="text-h3 font-bold text-text-primary mt-1">
              {portfolioStats.multiple}
            </p>
            <p className="text-xs text-text-tertiary mt-1">TVPI</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-xs text-text-tertiary uppercase">Gross IRR</p>
            <p className="text-h3 font-bold text-text-primary mt-1">
              {portfolioStats.grossIrr}
            </p>
            <p className="text-xs text-success flex items-center gap-1 mt-1">
              <TrendingUp className="w-3 h-3" />
              +4pp
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-xs text-text-tertiary uppercase">Companies</p>
            <p className="text-h3 font-bold text-text-primary mt-1">
              {portfolioStats.totalCompanies}
            </p>
            <p className="text-xs text-text-tertiary mt-1">
              2 exits to date
            </p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Portfolio Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-text-primary">
            Portfolio Companies
          </h3>
          <div className="flex bg-surface rounded-lg p-1 border border-border">
            <button
              onClick={() => setView("grid")}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors duration-200 ${
                view === "grid" ? "bg-surface-elevated text-text-primary" : "text-text-secondary"
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setView("table")}
              className={`px-3 py-1.5 text-sm rounded-md transition-colors duration-200 ${
                view === "table" ? "bg-surface-elevated text-text-primary" : "text-text-secondary"
              }`}
            >
              Table
            </button>
          </div>
        </div>

        {view === "grid" ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {portfolioCompanies.map((company, index) => (
              <motion.div
                key={company.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 + index * 0.08, ease: ANIMATION.easing.default }}
              >
                <Card hover className="h-full cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center">
                          <Building2 className="w-5 h-5 text-accent" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-text-primary">
                            {company.name}
                          </h4>
                          <p className="text-xs text-text-tertiary">
                            {company.sector}
                          </p>
                        </div>
                      </div>
                      <Badge variant="success">{company.status}</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-text-tertiary">Multiple</p>
                        <p className="text-lg font-semibold text-success">
                          {company.multiple}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-text-tertiary">IRR</p>
                        <p className="text-lg font-semibold text-text-primary">
                          {company.irr}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-border">
                      <div className="text-xs text-text-tertiary">
                        {company.employees} employees • Founded {company.founded}
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        className="p-1 hover:bg-surface-elevated rounded transition-colors duration-200"
                      >
                        <ExternalLink className="w-4 h-4 text-text-tertiary" />
                      </motion.button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-xs font-medium text-text-tertiary uppercase tracking-wider">
                    <th className="pb-3 px-6 pt-4">Company</th>
                    <th className="pb-3 px-4 pt-4">Sector</th>
                    <th className="pb-3 px-4 pt-4">Stage</th>
                    <th className="pb-3 px-4 pt-4">Investment</th>
                    <th className="pb-3 px-4 pt-4">Multiple</th>
                    <th className="pb-3 px-4 pt-4">IRR</th>
                    <th className="pb-3 px-6 pt-4">Status</th>
                  </tr>
                </thead>
                <tbody className="text-small">
                  {portfolioCompanies.map((company, index) => (
                    <motion.tr
                      key={company.id}
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
                            {company.name}
                          </span>
                        </div>
                      </td>
                      <td className="py-4 px-4 text-text-secondary">{company.sector}</td>
                      <td className="py-4 px-4 text-text-secondary">{company.stage}</td>
                      <td className="py-4 px-4 text-text-secondary">{company.investment}</td>
                      <td className="py-4 px-4">
                        <span className="text-success font-medium">{company.multiple}</span>
                      </td>
                      <td className="py-4 px-4 text-text-secondary">{company.irr}</td>
                      <td className="py-4 px-6">
                        <Badge variant="success">{company.status}</Badge>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        )}
      </motion.div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4, ease: ANIMATION.easing.default }}
      >
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Recent Activity
        </h3>
        <Card>
          <CardContent className="p-0">
            <div className="divide-y divide-border">
              {recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 + index * 0.05 }}
                  className="flex items-center justify-between p-4 hover:bg-surface-elevated/50 transition-colors duration-200"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-accent/10 rounded-lg flex items-center justify-center">
                      <Building2 className="w-4 h-4 text-accent" />
                    </div>
                    <div>
                      <p className="font-medium text-text-primary">
                        {activity.company}
                      </p>
                      <p className="text-xs text-text-secondary">
                        {activity.action}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-text-primary">
                      {activity.value}
                    </p>
                    <p className="text-xs text-text-tertiary">{activity.date}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
