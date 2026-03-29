"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Twitter, Linkedin, Github, Mail } from "lucide-react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { fadeInUp, ANIMATION } from "@/lib/animations";

const footerLinks = {
  firm: [
    { label: "About", href: "/about" },
    { label: "Team", href: "/team" },
    { label: "Thesis", href: "/thesis" },
    { label: "Portfolio", href: "/portfolio" },
  ],
  resources: [
    { label: "Founder FAQ", href: "#" },
    { label: "LP Portal", href: "/login" },
    { label: "Press Kit", href: "#" },
    { label: "Careers", href: "#" },
  ],
  legal: [
    { label: "Privacy Policy", href: "#" },
    { label: "Terms of Service", href: "#" },
    { label: "Cookie Policy", href: "#" },
  ],
};

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Mail, href: "mailto:hello@redstick.vc", label: "Email" },
];

export function Footer() {
  const { ref, isInView } = useScrollAnimation(ANIMATION.threshold);

  return (
    <motion.footer
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={fadeInUp}
      className="border-t border-border bg-surface"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <motion.div 
            className="col-span-2"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.1, ease: ANIMATION.easing.default }}
          >
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">R</span>
              </div>
              <span className="font-bold text-xl text-text-primary">
                Redstick
              </span>
            </Link>
            <p className="text-text-secondary text-sm mb-6 max-w-xs">
              Early-stage venture capital firm investing at the intersection of 
              food systems, agriculture, and AI.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social, index) => {
                const Icon = social.icon;
                return (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isInView ? { opacity: 1, scale: 1 } : {}}
                    transition={{ 
                      duration: 0.3, 
                      delay: 0.3 + index * 0.1,
                      ease: ANIMATION.easing.default 
                    }}
                    className="w-10 h-10 bg-surface-elevated rounded-lg flex items-center justify-center text-text-tertiary hover:text-accent hover:bg-accent/10 transition-all duration-200"
                    aria-label={social.label}
                  >
                    <Icon className="w-5 h-5" />
                  </motion.a>
                );
              })}
            </div>
          </motion.div>

          {/* Firm Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: ANIMATION.easing.default }}
          >
            <h4 className="font-semibold text-text-primary mb-4">Firm</h4>
            <ul className="space-y-3">
              {footerLinks.firm.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-small text-text-secondary hover:text-accent transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Resources Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3, ease: ANIMATION.easing.default }}
          >
            <h4 className="font-semibold text-text-primary mb-4">Resources</h4>
            <ul className="space-y-3">
              {footerLinks.resources.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-small text-text-secondary hover:text-accent transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Legal Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.4, ease: ANIMATION.easing.default }}
          >
            <h4 className="font-semibold text-text-primary mb-4">Legal</h4>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-small text-text-secondary hover:text-accent transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>

        {/* Bottom Bar */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.5, ease: ANIMATION.easing.default }}
          className="pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4"
        >
          <p className="text-small text-text-tertiary">
            © {new Date().getFullYear()} Redstick Ventures. All rights reserved.
          </p>
          <p className="text-small text-text-tertiary">
            Built with{" "}
            <span className="text-accent">♥</span>
            {" "}in Baton Rouge
          </p>
        </motion.div>
      </div>
    </motion.footer>
  );
}
