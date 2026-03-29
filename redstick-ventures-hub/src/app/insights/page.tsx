"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { ArrowRight, Clock } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { fadeInUp, staggerContainer, ANIMATION } from "@/lib/animations";

const featuredPosts = [
  {
    id: "1",
    title: "The AI Revolution in Agriculture: 2024 Outlook",
    excerpt: "How artificial intelligence is transforming farming from seed to harvest, and what it means for investors.",
    category: "Market Analysis",
    readTime: "8 min read",
    date: "Jan 10, 2024",
    featured: true,
  },
  {
    id: "2",
    title: "Why We Invested in AquaCulture Labs",
    excerpt: "Our thesis on sustainable aquaculture and the $300B opportunity in alternative seafood.",
    category: "Investment Thesis",
    readTime: "5 min read",
    date: "Dec 15, 2023",
    featured: true,
  },
];

const posts = [
  {
    id: "3",
    title: "Building the Venture-Scale AI Agent Stack",
    excerpt: "How we're using AI agents to transform our investment process.",
    category: "Technology",
    readTime: "6 min read",
    date: "Dec 1, 2023",
  },
  {
    id: "4",
    title: "Climate Tech in Agriculture: A Deep Dive",
    excerpt: "The technologies helping farmers adapt to and mitigate climate change.",
    category: "Research",
    readTime: "10 min read",
    date: "Nov 20, 2023",
  },
  {
    id: "5",
    title: "Food as Medicine: The $50B Opportunity",
    excerpt: "How personalized nutrition is creating new market opportunities.",
    category: "Market Analysis",
    readTime: "7 min read",
    date: "Nov 5, 2023",
  },
  {
    id: "6",
    title: "Supply Chain Resilience Post-COVID",
    excerpt: "Less learned and opportunities in food supply chain modernization.",
    category: "Industry",
    readTime: "5 min read",
    date: "Oct 22, 2023",
  },
];

export default function InsightsPage() {
  const { ref: headerRef, isInView: headerInView } = useScrollAnimation();
  const { ref: featuredRef, isInView: featuredInView } = useScrollAnimation();
  const { ref: postsRef, isInView: postsInView } = useScrollAnimation();

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
              Insights
            </motion.span>
            <motion.h1
              variants={fadeInUp}
              className="text-h1 font-bold text-text-primary mb-6"
            >
              Thoughts on food, technology, and the future
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-body-large text-text-secondary"
            >
              Market analysis, investment theses, and perspectives from the Redstick team.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Featured Posts */}
      <section ref={featuredRef} className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={featuredInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: ANIMATION.easing.default }}
            className="text-h3 font-bold text-text-primary mb-8"
          >
            Featured
          </motion.h2>

          <motion.div
            initial="hidden"
            animate={featuredInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-8"
          >
            {featuredPosts.map((post) => (
              <motion.article key={post.id} variants={fadeInUp}>
                <Card hover className="h-full cursor-pointer">
                  <CardContent className="p-8 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-4">
                      <Badge variant="primary">{post.category}</Badge>
                      <span className="text-xs text-text-tertiary flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-text-primary mb-3">
                      {post.title}
                    </h3>
                    <p className="text-body text-text-secondary mb-6 flex-1">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-text-tertiary">
                        {post.date}
                      </span>
                      <span className="text-accent text-small font-medium flex items-center gap-1">
                        Read more
                        <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>

      {/* All Posts */}
      <section ref={postsRef} className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={postsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: ANIMATION.easing.default }}
            className="text-h3 font-bold text-text-primary mb-8"
          >
            Latest Insights
          </motion.h2>

          <motion.div
            initial="hidden"
            animate={postsInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="grid md:grid-cols-2 gap-6"
          >
            {posts.map((post) => (
              <motion.article key={post.id} variants={fadeInUp}>
                <Card hover className="h-full cursor-pointer">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge variant="default">{post.category}</Badge>
                      <span className="text-xs text-text-tertiary flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {post.readTime}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-text-primary mb-2">
                      {post.title}
                    </h3>
                    <p className="text-small text-text-secondary mb-4 flex-1">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-text-tertiary">
                        {post.date}
                      </span>
                      <span className="text-accent text-small font-medium flex items-center gap-1">
                        Read
                        <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </motion.article>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
