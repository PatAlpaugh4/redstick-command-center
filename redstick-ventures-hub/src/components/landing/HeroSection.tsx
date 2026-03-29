"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Play } from "lucide-react";
import { heroContainer, heroItem } from "@/lib/animations";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24">
      {/* Background Elements */}
      <div className="absolute inset-0 grid-pattern opacity-30" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary-light/20 rounded-full blur-3xl" />

      <motion.div
        variants={heroContainer}
        initial="hidden"
        animate="visible"
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center"
      >
        {/* Badge */}
        <motion.div
          variants={heroItem}
          className="inline-flex items-center gap-2 px-4 py-2 bg-surface border border-border rounded-full mb-8"
        >
          <span className="w-2 h-2 bg-success rounded-full animate-pulse" />
          <span className="text-small text-text-secondary">
            Now deploying Fund II — $50M
          </span>
        </motion.div>

        {/* Main Headline */}
        <motion.h1
          variants={heroItem}
          className="text-hero font-bold text-text-primary mb-6"
        >
          We back founders building
          <br />
          <span className="relative inline-block">
            <span className="marker-underline">the future of food</span>
          </span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          variants={heroItem}
          className="text-h4 text-text-secondary max-w-2xl mx-auto mb-10"
        >
          Redstick Ventures is an early-stage VC firm investing at the intersection of 
          food systems, agriculture, and AI. We provide capital, AI-powered insights, 
          and deep industry networks.
        </motion.p>

        {/* CTAs */}
        <motion.div
          variants={heroItem}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link
            href="/contact"
            className="group btn-hover flex items-center gap-2 px-8 py-4 bg-accent text-white font-medium rounded-xl hover:bg-accent-hover transition-all duration-300 hover:shadow-glow"
          >
            Apply for Funding
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" />
          </Link>
          <Link
            href="/portfolio"
            className="flex items-center gap-2 px-8 py-4 text-text-primary font-medium hover:text-accent transition-colors duration-200"
          >
            <Play className="w-5 h-5" />
            View Portfolio
          </Link>
        </motion.div>

        {/* Stats */}
        <motion.div
          variants={heroItem}
          className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto"
        >
          {[
            { value: "$50M", label: "Fund II" },
            { value: "35+", label: "Portfolio Companies" },
            { value: "12", label: "Exits" },
            { value: "3.2x", label: "Average MOIC" },
          ].map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 0.6, 
                delay: 0.6 + index * 0.1,
                ease: [0.16, 1, 0.3, 1]
              }}
              className="text-center"
            >
              <div className="text-h3 font-bold text-text-primary mb-2">
                {stat.value}
              </div>
              <div className="text-small text-text-secondary">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-2">
          <span className="text-xs text-text-tertiary uppercase tracking-wider">
            Scroll
          </span>
          <div className="w-6 h-10 border-2 border-border rounded-full flex justify-center pt-2">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="w-1.5 h-1.5 bg-accent rounded-full"
            />
          </div>
        </div>
      </motion.div>
    </section>
  );
}
