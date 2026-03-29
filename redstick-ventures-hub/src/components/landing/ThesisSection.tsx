"use client";

import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cardContainer, cardItem, fadeInUp, ANIMATION } from "@/lib/animations";
import { Cpu, Sprout, Network, TrendingUp, Shield, Globe } from "lucide-react";

const thesisAreas = [
  {
    icon: Sprout,
    title: "Climate-Smart Agriculture",
    description:
      "Precision farming, vertical agriculture, and regenerative practices that reduce environmental impact while increasing yields.",
    stat: "40%",
    statLabel: "of global emissions from food systems",
  },
  {
    icon: Cpu,
    title: "AI & Automation",
    description:
      "Machine learning for crop optimization, predictive analytics, robotics, and supply chain intelligence.",
    stat: "$15B",
    statLabel: "AI in agriculture market by 2030",
  },
  {
    icon: Network,
    title: "Supply Chain Resilience",
    description:
      "Distributed food systems, cold chain innovation, traceability solutions, and local production networks.",
    stat: "30%",
    statLabel: "of food produced is lost or wasted",
  },
  {
    icon: TrendingUp,
    title: "Novel Foods",
    description:
      "Alternative proteins, cellular agriculture, functional ingredients, and sustainable nutrition solutions.",
    stat: "$290B",
    statLabel: "alternative protein market by 2035",
  },
  {
    icon: Shield,
    title: "Food Safety & Quality",
    description:
      "Pathogen detection, contamination prevention, quality monitoring, and compliance automation.",
    stat: "600M",
    statLabel: "annual cases of foodborne illness",
  },
  {
    icon: Globe,
    title: "Global Food Security",
    description:
      "Technologies that improve access to nutritious food in underserved markets and emerging economies.",
    stat: "800M",
    statLabel: "people face hunger globally",
  },
];

export function ThesisSection() {
  const { ref: sectionRef, isInView: sectionInView } = useScrollAnimation(ANIMATION.threshold);
  const { ref: cardsRef, isInView: cardsInView } = useScrollAnimation(ANIMATION.threshold);

  return (
    <section id="thesis" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          ref={sectionRef}
          initial="hidden"
          animate={sectionInView ? "visible" : "hidden"}
          variants={fadeInUp}
          className="text-center mb-20"
        >
          <span className="text-accent text-xs font-semibold uppercase tracking-wider">
            Investment Thesis
          </span>
          <h2 className="text-h2 font-bold text-text-primary mt-4 mb-6">
            The future of food is
            <br />
            <span className="marker-underline">technology-enabled</span>
          </h2>
          <p className="text-body text-text-secondary max-w-3xl mx-auto">
            We invest in seed and Series A companies transforming how we produce, 
            distribute, and consume food. Our focus areas represent massive market 
            opportunities with significant impact potential.
          </p>
        </motion.div>

        {/* Thesis Grid */}
        <motion.div
          ref={cardsRef}
          variants={cardContainer}
          initial="hidden"
          animate={cardsInView ? "visible" : "hidden"}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {thesisAreas.map((area) => {
            const Icon = area.icon;
            return (
              <motion.div
                key={area.title}
                variants={cardItem}
                className="group p-6 bg-surface border border-border rounded-2xl hover:border-accent/30 transition-all duration-300 card-hover"
              >
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-accent/20 transition-colors duration-300">
                  <Icon className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-h4 font-semibold text-text-primary mb-3">
                  {area.title}
                </h3>
                <p className="text-small text-text-secondary mb-6 leading-relaxed">
                  {area.description}
                </p>
                <div className="pt-4 border-t border-border">
                  <div className="text-h3 font-bold text-accent">{area.stat}</div>
                  <div className="text-xs text-text-tertiary mt-1">
                    {area.statLabel}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* AI Platform Highlight */}
        <AIPlatformHighlight />
      </div>
    </section>
  );
}

function AIPlatformHighlight() {
  const { ref, isInView } = useScrollAnimation(ANIMATION.threshold);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ 
        duration: ANIMATION.duration.slow, 
        ease: ANIMATION.easing.default 
      }}
      className="mt-20 p-8 sm:p-12 bg-gradient-to-br from-accent/10 to-primary/20 border border-accent/20 rounded-3xl"
    >
      <div className="flex flex-col lg:flex-row items-center gap-12">
        <div className="flex-1">
          <span className="text-accent text-xs font-semibold uppercase tracking-wider">
            Our Edge
          </span>
          <h3 className="text-h2 font-bold text-text-primary mt-4 mb-4">
            AI-Powered Investment Intelligence
          </h3>
          <p className="text-body text-text-secondary mb-6 leading-relaxed">
            We&apos;ve built a proprietary AI platform that gives our portfolio 
            companies and our investment team a competitive edge. Our agents 
            continuously monitor markets, screen deals, and provide actionable 
            intelligence.
          </p>
          <ul className="space-y-3">
            {[
              "Automated deal sourcing and screening",
              "Real-time market intelligence",
              "Portfolio monitoring and alerts",
              "Predictive analytics for exits",
            ].map((item) => (
              <li key={item} className="flex items-center gap-3 text-small text-text-secondary">
                <div className="w-1.5 h-1.5 bg-accent rounded-full" />
                {item}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex-1 w-full max-w-md">
          <div className="relative">
            <div className="absolute -inset-4 bg-accent/20 rounded-2xl blur-2xl" />
            <div className="relative bg-surface border border-border rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-small font-medium text-text-primary">AI Agents Active</span>
                <span className="px-2 py-1 bg-success/10 text-success text-xs rounded-full">12 Online</span>
              </div>
              <div className="space-y-3">
                {[
                  { name: "Deal Screener", status: "Running", progress: 78 },
                  { name: "Market Intel", status: "Active", progress: 92 },
                  { name: "Portfolio Monitor", status: "Running", progress: 65 },
                ].map((agent) => (
                  <div key={agent.name} className="p-3 bg-background rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-small text-text-primary">{agent.name}</span>
                      <span className="text-xs text-success">{agent.status}</span>
                    </div>
                    <div className="h-1.5 bg-surface-elevated rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${agent.progress}%` }}
                        transition={{ duration: 1, delay: 0.5, ease: ANIMATION.easing.default }}
                        className="h-full bg-accent rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
