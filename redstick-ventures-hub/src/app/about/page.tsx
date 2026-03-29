"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/Card";
import { Target, Users, Lightbulb, MapPin } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { fadeInUp, staggerContainer, ANIMATION } from "@/lib/animations";

const values = [
  {
    icon: Target,
    title: "Conviction Over Consensus",
    description:
      "We make bold bets based on deep research, not following the herd. Our best investments often started as contrarian views.",
  },
  {
    icon: Users,
    title: "Founder-First",
    description:
      "Great companies are built by exceptional people. We prioritize the team, their vision, and their ability to execute.",
  },
  {
    icon: Lightbulb,
    title: "Deep Domain Expertise",
    description:
      "Our team's background in agriculture, food science, and technology gives us unique insights into this sector.",
  },
  {
    icon: MapPin,
    title: "Regional Strength",
    description:
      "Based in the heart of America's agricultural corridor, we leverage regional networks while thinking globally.",
  },
];

export default function AboutPage() {
  const { ref: headerRef, isInView: headerInView } = useScrollAnimation();
  const { ref: storyRef, isInView: storyInView } = useScrollAnimation();
  const { ref: valuesRef, isInView: valuesInView } = useScrollAnimation();

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
              About Redstick
            </motion.span>
            <motion.h1
              variants={fadeInUp}
              className="text-h1 font-bold text-text-primary mb-6"
            >
              We&apos;re building the future of food from the ground up
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-body-large text-text-secondary"
            >
              Redstick Ventures is a sector-focused venture capital firm investing 
              at the intersection of food systems, agriculture, and AI. We back 
              exceptional founders solving humanity&apos;s most pressing food challenges.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section ref={storyRef} className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={storyInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, ease: ANIMATION.easing.default }}
            >
              <h2 className="text-h2 font-bold text-text-primary mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-body text-text-secondary">
                <p>
                  Founded in 2019 by a team of operators, technologists, and 
                  agricultural experts, Redstick emerged from a simple observation: 
                  the global food system was facing unprecedented challenges, yet 
                  the venture capital world was largely ignoring the space.
                </p>
                <p>
                  We set out to change that. Based in Baton Rouge, Louisiana—at 
                  the heart of America&apos;s agricultural corridor—we&apos;ve built a firm 
                  that combines deep domain expertise with the speed and pattern 
                  recognition of Silicon Valley.
                </p>
                <p>
                  Today, we manage $150M across two funds and have backed 30+ 
                  companies that are transforming how we grow, produce, distribute, 
                  and consume food.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={storyInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1, ease: ANIMATION.easing.default }}
              className="grid grid-cols-2 gap-6"
            >
              {[
                { number: "$150M", label: "AUM" },
                { number: "30+", label: "Portfolio Companies" },
                { number: "2", label: "Funds" },
                { number: "5", label: "Team Members" },
              ].map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={storyInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.2 + index * 0.08 }}
                  className="bg-background p-6 rounded-xl text-center"
                >
                  <div className="text-h2 font-bold text-accent">{stat.number}</div>
                  <div className="text-small text-text-secondary mt-1">{stat.label}</div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section ref={valuesRef} className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={valuesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: ANIMATION.easing.default }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <h2 className="text-h2 font-bold text-text-primary mb-4">
              What We Believe
            </h2>
            <p className="text-body text-text-secondary">
              Our values guide every decision we make, from which founders we 
              back to how we support them on their journey.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={valuesInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-6"
          >
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <motion.div key={value.title} variants={fadeInUp}>
                  <Card hover className="h-full">
                    <CardContent className="p-8">
                      <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-6">
                        <Icon className="w-6 h-6 text-accent" />
                      </div>
                      <h3 className="text-xl font-semibold text-text-primary mb-3">
                        {value.title}
                      </h3>
                      <p className="text-body text-text-secondary">
                        {value.description}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
