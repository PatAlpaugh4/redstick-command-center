"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/Card";
import { 
  Sprout, 
  Brain, 
  Truck, 
  Factory,
  ArrowRight 
} from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { fadeInUp, staggerContainer, ANIMATION } from "@/lib/animations";

const themes = [
  {
    icon: Sprout,
    title: "Sustainable Agriculture",
    description: "Technologies that reduce environmental impact while increasing yield and farmer profitability.",
    examples: ["Precision agriculture", "Biological crop protection", "Regenerative farming tools"],
  },
  {
    icon: Brain,
    title: "AI & Data Analytics",
    description: "Intelligent systems that optimize decision-making across the food value chain.",
    examples: ["Predictive analytics", "Computer vision", "Supply chain optimization"],
  },
  {
    icon: Factory,
    title: "Food Production Innovation",
    description: "New methods of producing food that are more efficient, sustainable, and scalable.",
    examples: ["Alternative proteins", "Cellular agriculture", "Novel ingredients"],
  },
  {
    icon: Truck,
    title: "Supply Chain Modernization",
    description: "Solutions that reduce waste, improve traceability, and create more resilient food systems.",
    examples: ["Cold chain logistics", "Food waste reduction", "Direct-to-consumer platforms"],
  },
];

const investmentCriteria = [
  { label: "Stage", value: "Pre-seed to Series A" },
  { label: "Check Size", value: "$500K - $3M" },
  { label: "Lead", value: "Lead or co-lead" },
  { label: "Focus", value: "Food, Ag & AI" },
];

export default function ThesisPage() {
  const { ref: headerRef, isInView: headerInView } = useScrollAnimation();
  const { ref: themesRef, isInView: themesInView } = useScrollAnimation();
  const { ref: criteriaRef, isInView: criteriaInView } = useScrollAnimation();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section ref={headerRef} className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate={headerInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="max-w-3xl"
          >
            <motion.span
              variants={fadeInUp}
              className="inline-block px-3 py-1 bg-accent/10 text-accent text-sm font-medium rounded-full mb-6"
            >
              Investment Thesis
            </motion.span>
            <motion.h1
              variants={fadeInUp}
              className="text-h1 font-bold text-text-primary mb-6"
            >
              We invest at the intersection of food, agriculture, and AI
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-body-large text-text-secondary"
            >
              The global food system faces unprecedented challenges: feeding 10 billion 
              people by 2050, reducing environmental impact, and adapting to climate change. 
              We believe technology is the key to solving these challenges.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Investment Themes */}
      <section ref={themesRef} className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={themesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: ANIMATION.easing.default }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <h2 className="text-h2 font-bold text-text-primary mb-4">
              Investment Themes
            </h2>
            <p className="text-body text-text-secondary">
              We focus on four key areas where we see the greatest opportunity for impact and returns.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={themesInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-6"
          >
            {themes.map((theme) => {
              const Icon = theme.icon;
              return (
                <motion.div key={theme.title} variants={fadeInUp}>
                  <Card hover className="h-full">
                    <CardContent className="p-8">
                      <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-6">
                        <Icon className="w-6 h-6 text-accent" />
                      </div>
                      <h3 className="text-xl font-semibold text-text-primary mb-3">
                        {theme.title}
                      </h3>
                      <p className="text-body text-text-secondary mb-4">
                        {theme.description}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {theme.examples.map((example) => (
                          <span
                            key={example}
                            className="px-3 py-1 bg-surface-elevated text-text-secondary text-xs rounded-full"
                          >
                            {example}
                          </span>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Investment Criteria */}
      <section ref={criteriaRef} className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={criteriaInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, ease: ANIMATION.easing.default }}
            >
              <h2 className="text-h2 font-bold text-text-primary mb-6">
                Our Investment Criteria
              </h2>
              <p className="text-body text-text-secondary mb-8">
                We look for exceptional founders building transformative companies. 
                While we have specific criteria, we remain open to opportunities that 
                challenge conventional wisdom.
              </p>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                {investmentCriteria.map((criteria, index) => (
                  <motion.div
                    key={criteria.label}
                    initial={{ opacity: 0, y: 20 }}
                    animate={criteriaInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.5, delay: 0.1 + index * 0.08 }}
                  >
                    <p className="text-xs text-text-tertiary uppercase tracking-wider">
                      {criteria.label}
                    </p>
                    <p className="text-lg font-semibold text-text-primary">
                      {criteria.value}
                    </p>
                  </motion.div>
                ))}
              </div>

              <motion.a
                href="/contact"
                initial={{ opacity: 0, y: 20 }}
                animate={criteriaInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="btn-hover inline-flex items-center gap-2 px-6 py-3 bg-accent text-white font-medium rounded-lg"
              >
                Pitch Us Your Company
                <ArrowRight className="w-4 h-4" />
              </motion.a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={criteriaInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2, ease: ANIMATION.easing.default }}
              className="bg-surface rounded-2xl p-8 border border-border"
            >
              <h3 className="text-lg font-semibold text-text-primary mb-6">
                What We Look For
              </h3>
              <ul className="space-y-4">
                {[
                  "Exceptional founding team with domain expertise",
                  "Large addressable market ($1B+)",
                  "Differentiated technology or business model",
                  "Clear path to sustainable competitive advantage",
                  "Alignment with our impact and return goals",
                  "Willingness to engage with our AI agent platform",
                ].map((item, index) => (
                  <motion.li
                    key={item}
                    initial={{ opacity: 0, x: -10 }}
                    animate={criteriaInView ? { opacity: 1, x: 0 } : {}}
                    transition={{ duration: 0.3, delay: 0.3 + index * 0.05 }}
                    className="flex items-start gap-3"
                  >
                    <span className="w-1.5 h-1.5 bg-accent rounded-full mt-2" />
                    <span className="text-body text-text-secondary">{item}</span>
                  </motion.li>
                ))}
              </ul>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
