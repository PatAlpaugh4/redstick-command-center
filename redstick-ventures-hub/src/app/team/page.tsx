"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/Card";
import { Linkedin, Twitter } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { fadeInUp, staggerContainer, ANIMATION } from "@/lib/animations";

const team = [
  {
    name: "Sarah Chen",
    role: "Managing Partner",
    bio: "Former VP at a16z, led 30+ agtech investments. MS Stanford, BS MIT.",
    image: "/team/sarah.jpg",
  },
  {
    name: "Marcus Johnson",
    role: "Partner",
    bio: "Ex-CEO of AgriData (acq. 2019), 15 years in precision agriculture.",
    image: "/team/marcus.jpg",
  },
  {
    name: "Dr. Elena Rodriguez",
    role: "Partner",
    bio: "PhD Food Science, former head of R&D at Impossible Foods.",
    image: "/team/elena.jpg",
  },
  {
    name: "James Park",
    role: "Principal",
    bio: "Former ML engineer at Google X, MBA Wharton, BS Berkeley.",
    image: "/team/james.jpg",
  },
  {
    name: "Aisha Williams",
    role: "VP Platform",
    bio: "Built founder support programs at Techstars and 500 Startups.",
    image: "/team/aisha.jpg",
  },
  {
    name: "David Kim",
    role: "VP Data & Operations",
    bio: "Ex-McKinsey, built data infrastructure at two unicorn startups.",
    image: "/team/david.jpg",
  },
];

const advisors = [
  {
    name: "Tom Colicchio",
    role: "Culinary Advisor",
    bio: "Award-winning chef and founder of Crafted Hospitality.",
  },
  {
    name: "Dr. Pamela Ronald",
    role: "Science Advisor",
    bio: "Distinguished Professor, UC Davis, plant genetics pioneer.",
  },
  {
    name: "Chuck Templeton",
    role: "Strategy Advisor",
    bio: "Founder of OpenTable, Managing Director at S2G Ventures.",
  },
];

export default function TeamPage() {
  const { ref: headerRef, isInView: headerInView } = useScrollAnimation();
  const { ref: teamRef, isInView: teamInView } = useScrollAnimation();
  const { ref: advisorsRef, isInView: advisorsInView } = useScrollAnimation();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <section ref={headerRef} className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate={headerInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="text-center max-w-3xl mx-auto"
          >
            <motion.span
              variants={fadeInUp}
              className="inline-block px-3 py-1 bg-accent/10 text-accent text-sm font-medium rounded-full mb-6"
            >
              Our Team
            </motion.span>
            <motion.h1
              variants={fadeInUp}
              className="text-h1 font-bold text-text-primary mb-6"
            >
              Meet the people behind Redstick
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-body-large text-text-secondary"
            >
              A diverse team of investors, operators, scientists, and technologists 
              united by our passion for transforming the food system.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Team Grid */}
      <section ref={teamRef} className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial="hidden"
            animate={teamInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {team.map((member, index) => (
              <motion.div key={member.name} variants={fadeInUp}>
                <Card hover className="h-full text-center">
                  <CardContent className="p-8">
                    <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-gradient-to-br from-accent/20 to-accent/5 flex items-center justify-center">
                      <span className="text-3xl font-bold text-accent">
                        {member.name.split(" ").map((n) => n[0]).join("")}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-text-primary">
                      {member.name}
                    </h3>
                    <p className="text-accent text-small font-medium mt-1">
                      {member.role}
                    </p>
                    <p className="text-body text-text-secondary mt-4">
                      {member.bio}
                    </p>
                    <div className="flex items-center justify-center gap-3 mt-6">
                      <motion.a
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        href="#"
                        className="p-2 text-text-tertiary hover:text-accent transition-colors duration-200"
                      >
                        <Linkedin className="w-5 h-5" />
                      </motion.a>
                      <motion.a
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        href="#"
                        className="p-2 text-text-tertiary hover:text-accent transition-colors duration-200"
                      >
                        <Twitter className="w-5 h-5" />
                      </motion.a>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Advisors */}
      <section ref={advisorsRef} className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={advisorsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: ANIMATION.easing.default }}
            className="text-center max-w-2xl mx-auto mb-16"
          >
            <h2 className="text-h2 font-bold text-text-primary mb-4">
              Strategic Advisors
            </h2>
            <p className="text-body text-text-secondary">
              World-class experts who guide our investment strategy and support our portfolio.
            </p>
          </motion.div>

          <motion.div
            initial="hidden"
            animate={advisorsInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
          >
            {advisors.map((advisor) => (
              <motion.div key={advisor.name} variants={fadeInUp}>
                <Card hover className="h-full text-center">
                  <CardContent className="p-6">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-surface-elevated to-surface flex items-center justify-center">
                      <span className="text-2xl font-bold text-text-primary">
                        {advisor.name.split(" ").map((n) => n[0]).join("")}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-text-primary">
                      {advisor.name}
                    </h3>
                    <p className="text-accent text-small font-medium mt-1">
                      {advisor.role}
                    </p>
                    <p className="text-xs text-text-tertiary mt-3">
                      {advisor.bio}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
