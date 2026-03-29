"use client";

import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/landing/Footer";
import { ArrowUpRight, ExternalLink } from "lucide-react";
import { useState } from "react";

const portfolioCompanies = [
  {
    name: "AquaCulture Labs",
    sector: "Aquaculture",
    stage: "Series A",
    description: "AI-powered shrimp farming systems with 40% higher yields and 60% less water usage.",
    metrics: { arr: "$4.2M", growth: "+340%", employees: 28 },
    color: "from-cyan-500/20 to-blue-500/20",
    year: "2023"
  },
  {
    name: "GrainChain",
    sector: "Supply Chain",
    stage: "Series B",
    description: "Blockchain-based grain traceability and commodity trading platform.",
    metrics: { arr: "$12M", growth: "+180%", employees: 65 },
    color: "from-amber-500/20 to-orange-500/20",
    year: "2022"
  },
  {
    name: "NovoProtein",
    sector: "Alternative Protein",
    stage: "Seed",
    description: "Precision fermentation platform for alternative protein ingredients.",
    metrics: { arr: "$800K", growth: "Pre-revenue", employees: 12 },
    color: "from-emerald-500/20 to-teal-500/20",
    year: "2023"
  },
  {
    name: "FarmRobotics",
    sector: "AgTech",
    stage: "Series A",
    description: "Autonomous weeding robots reducing herbicide use by 90%.",
    metrics: { arr: "$6.5M", growth: "+220%", employees: 42 },
    color: "from-lime-500/20 to-green-500/20",
    year: "2023"
  },
  {
    name: "VerticalHarvest",
    sector: "Vertical Farming",
    stage: "Series B",
    description: "Modular vertical farming systems for urban environments.",
    metrics: { arr: "$18M", growth: "+95%", employees: 89 },
    color: "from-green-500/20 to-emerald-500/20",
    year: "2021"
  },
  {
    name: "BioSense",
    sector: "Food Safety",
    stage: "Series A",
    description: "Real-time pathogen detection for food processing facilities.",
    metrics: { arr: "$3.1M", growth: "+275%", employees: 24 },
    color: "from-rose-500/20 to-pink-500/20",
    year: "2023"
  },
];

const stageFilters = ["All", "Seed", "Series A", "Series B", "Growth"];

export default function PortfolioPage() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filteredCompanies = activeFilter === "All" 
    ? portfolioCompanies 
    : portfolioCompanies.filter((c) => c.stage === activeFilter);

  return (
    <main className="bg-background min-h-screen">
      <Header />
      
      {/* Hero */}
      <section className="pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <span className="text-accent text-xs font-semibold uppercase tracking-wider">Portfolio</span>
            <h1 className="text-hero font-bold text-text-primary mt-4 mb-6">
              Companies we&apos;re proud to
              <span className="marker-underline"> back</span>
            </h1>
            <p className="text-body text-text-secondary">
              From seed to Series B, we partner with exceptional founders building 
              the future of food and agriculture.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Portfolio Stats */}
      <section className="py-12 bg-surface/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: "35+", label: "Portfolio Companies" },
              { value: "$85M", label: "Total Invested" },
              { value: "3.2x", label: "Avg Multiple" },
              { value: "12", label: "Exits" },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 bg-surface border border-border rounded-2xl"
              >
                <div className="text-h2 font-bold text-accent">{stat.value}</div>
                <div className="text-small text-text-secondary mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-12">
            {stageFilters.map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`px-4 py-2 text-small font-medium rounded-lg transition-all duration-200 ${
                  activeFilter === filter
                    ? "bg-accent text-white"
                    : "bg-surface text-text-secondary hover:text-text-primary border border-border"
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company, index) => (
              <motion.div
                key={company.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative bg-surface border border-border rounded-2xl overflow-hidden hover:border-accent/30 transition-all duration-300 card-hover"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${company.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
                <div className="relative p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded-full">
                          {company.stage}
                        </span>
                        <span className="text-xs text-text-tertiary">{company.sector}</span>
                      </div>
                      <h3 className="text-h4 font-bold text-text-primary">{company.name}</h3>
                    </div>
                    <div className="w-10 h-10 bg-surface-elevated rounded-lg flex items-center justify-center group-hover:bg-accent/20 transition-colors">
                      <ArrowUpRight className="w-5 h-5 text-text-tertiary group-hover:text-accent transition-colors" />
                    </div>
                  </div>
                  <p className="text-small text-text-secondary mb-6 leading-relaxed">{company.description}</p>
                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border">
                    <div>
                      <div className="text-h4 font-bold text-text-primary">{company.metrics.arr}</div>
                      <div className="text-xs text-text-tertiary">ARR</div>
                    </div>
                    <div>
                      <div className="text-h4 font-bold text-success">{company.metrics.growth}</div>
                      <div className="text-xs text-text-tertiary">YoY Growth</div>
                    </div>
                    <div>
                      <div className="text-h4 font-bold text-text-primary">{company.metrics.employees}</div>
                      <div className="text-xs text-text-tertiary">Employees</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
