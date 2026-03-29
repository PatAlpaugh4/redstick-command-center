"use client";

import { motion } from "framer-motion";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { cardContainer, cardItem, fadeInUp, slideInLeft, slideInRight, ANIMATION } from "@/lib/animations";
import { useState } from "react";
import { Send, Check, Building2, Users, Zap, Target } from "lucide-react";

const criteria = [
  {
    icon: Building2,
    title: "Sector Fit",
    description: "Food systems, agriculture, or AI-enabled solutions in our thesis areas.",
  },
  {
    icon: Users,
    title: "Exceptional Team",
    description: "Technical founders with deep domain expertise and execution capability.",
  },
  {
    icon: Zap,
    title: "Traction",
    description: "Seed: MVP + early customers. Series A: $500K+ ARR with strong growth.",
  },
  {
    icon: Target,
    title: "Market Size",
    description: "Addressable market of $1B+ with clear path to category leadership.",
  },
];

export function ApplySection() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { ref: headerRef, isInView: headerInView } = useScrollAnimation(ANIMATION.threshold);
  const { ref: criteriaRef, isInView: criteriaInView } = useScrollAnimation(ANIMATION.threshold);
  const { ref: formRef, isInView: formInView } = useScrollAnimation(ANIMATION.threshold);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <section id="apply" className="py-32 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          ref={headerRef}
          initial="hidden"
          animate={headerInView ? "visible" : "hidden"}
          variants={fadeInUp}
          className="text-center mb-20"
        >
          <span className="text-accent text-xs font-semibold uppercase tracking-wider">
            For Founders
          </span>
          <h2 className="text-h2 font-bold text-text-primary mt-4 mb-6">
            Let&apos;s build the future
            <br />
            <span className="marker-underline">together</span>
          </h2>
          <p className="text-body text-text-secondary max-w-3xl mx-auto">
            We&apos;re always looking for exceptional founders building category-defining 
            companies. If that&apos;s you, we&apos;d love to hear from you.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-16">
          {/* Criteria */}
          <motion.div
            ref={criteriaRef}
            initial="hidden"
            animate={criteriaInView ? "visible" : "hidden"}
            variants={slideInLeft}
          >
            <h3 className="text-h3 font-bold text-text-primary mb-8">
              What we look for
            </h3>
            <motion.div 
              variants={cardContainer}
              className="space-y-6"
            >
              {criteria.map((item) => {
                const Icon = item.icon;
                return (
                  <motion.div
                    key={item.title}
                    variants={cardItem}
                    className="flex gap-4 p-4 bg-surface border border-border rounded-xl card-hover"
                  >
                    <div className="w-12 h-12 bg-accent/10 rounded-lg flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6 text-accent" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-text-primary mb-1">
                        {item.title}
                      </h4>
                      <p className="text-small text-text-secondary">
                        {item.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>

            <motion.div 
              variants={cardItem}
              className="mt-8 p-6 bg-surface border border-border rounded-xl"
            >
              <h4 className="font-semibold text-text-primary mb-2">
                Typical Check Sizes
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-h3 font-bold text-accent">$500K - $2M</div>
                  <div className="text-small text-text-tertiary">Seed Stage</div>
                </div>
                <div>
                  <div className="text-h3 font-bold text-accent">$2M - $5M</div>
                  <div className="text-small text-text-tertiary">Series A</div>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* Application Form */}
          <motion.div
            ref={formRef}
            initial="hidden"
            animate={formInView ? "visible" : "hidden"}
            variants={slideInRight}
          >
            <div className="bg-surface border border-border rounded-2xl p-8">
              <h3 className="text-h3 font-bold text-text-primary mb-2">
                Submit Your Pitch
              </h3>
              <p className="text-small text-text-secondary mb-8">
                Fill out the form below and we&apos;ll get back to you within 48 hours.
              </p>

              {isSubmitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, ease: ANIMATION.easing.default }}
                  className="text-center py-12"
                >
                  <div className="w-16 h-16 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="w-8 h-8 text-success" />
                  </div>
                  <h4 className="text-h4 font-bold text-text-primary mb-2">
                    Application Received!
                  </h4>
                  <p className="text-small text-text-secondary">
                    We&apos;ll review your pitch and get back to you soon.
                  </p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-small font-medium text-text-secondary mb-1.5">
                        First Name
                      </label>
                      <input
                        type="text"
                        placeholder="John"
                        required
                        className="input-field"
                      />
                    </div>
                    <div>
                      <label className="block text-small font-medium text-text-secondary mb-1.5">
                        Last Name
                      </label>
                      <input
                        type="text"
                        placeholder="Doe"
                        required
                        className="input-field"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-small font-medium text-text-secondary mb-1.5">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="john@company.com"
                      required
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-small font-medium text-text-secondary mb-1.5">
                      Company Name
                    </label>
                    <input
                      type="text"
                      placeholder="Acme Inc."
                      required
                      className="input-field"
                    />
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-small font-medium text-text-secondary mb-1.5">
                        Stage
                      </label>
                      <select className="input-field">
                        <option value="">Select stage</option>
                        <option value="pre-seed">Pre-seed</option>
                        <option value="seed">Seed</option>
                        <option value="series-a">Series A</option>
                        <option value="series-b">Series B+</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-small font-medium text-text-secondary mb-1.5">
                        Sector
                      </label>
                      <select className="input-field">
                        <option value="">Select sector</option>
                        <option value="agtech">AgTech</option>
                        <option value="food">Food Tech</option>
                        <option value="supply-chain">Supply Chain</option>
                        <option value="alternative-protein">Alternative Protein</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-small font-medium text-text-secondary mb-1.5">
                      Pitch Deck URL
                    </label>
                    <input
                      type="url"
                      placeholder="https://..."
                      className="input-field"
                    />
                  </div>

                  <div>
                    <label className="block text-small font-medium text-text-secondary mb-1.5">
                      Tell us about your company
                    </label>
                    <textarea
                      rows={4}
                      placeholder="What are you building? What's your traction? Why now?"
                      className="input-field resize-none"
                    />
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="btn-hover w-full flex items-center justify-center gap-2 px-6 py-3 bg-accent text-white font-medium rounded-lg"
                  >
                    Submit Application
                    <Send className="w-4 h-4" />
                  </motion.button>

                  <p className="text-xs text-text-tertiary text-center">
                    By submitting, you agree to our{" "}
                    <a href="#" className="text-accent hover:underline">Privacy Policy</a>
                  </p>
                </form>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
