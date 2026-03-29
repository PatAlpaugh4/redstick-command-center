"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Mail, MapPin, Clock } from "lucide-react";
import { useState } from "react";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { fadeInUp, staggerContainer, ANIMATION } from "@/lib/animations";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
    type: "founder",
  });

  const { ref: headerRef, isInView: headerInView } = useScrollAnimation();
  const { ref: formRef, isInView: formInView } = useScrollAnimation();
  const { ref: infoRef, isInView: infoInView } = useScrollAnimation();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Form submitted:", formData);
  };

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
              Contact Us
            </motion.span>
            <motion.h1
              variants={fadeInUp}
              className="text-h1 font-bold text-text-primary mb-6"
            >
              Let&apos;s start a conversation
            </motion.h1>
            <motion.p
              variants={fadeInUp}
              className="text-body-large text-text-secondary"
            >
              Whether you&apos;re a founder looking for investment, an LP interested in 
              our fund, or just want to connect, we&apos;d love to hear from you.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Form */}
            <motion.div
              ref={formRef}
              initial={{ opacity: 0, x: -30 }}
              animate={formInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, ease: ANIMATION.easing.default }}
              className="lg:col-span-3"
            >
              <Card>
                <CardContent className="p-8">
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <label className="block text-small font-medium text-text-primary mb-2">
                        I am a...
                      </label>
                      <div className="flex gap-4">
                        {["founder", "investor", "other"].map((type) => (
                          <motion.button
                            key={type}
                            type="button"
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setFormData({ ...formData, type })}
                            className={`flex-1 py-3 px-4 rounded-lg border transition-all duration-200 ${
                              formData.type === type
                                ? "border-accent bg-accent/10 text-accent"
                                : "border-border text-text-secondary hover:border-accent/50"
                            }`}
                          >
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </motion.button>
                        ))}
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-small font-medium text-text-primary mb-2">
                          Name
                        </label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent transition-colors duration-200"
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="block text-small font-medium text-text-primary mb-2">
                          Email
                        </label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent transition-colors duration-200"
                          placeholder="you@company.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-small font-medium text-text-primary mb-2">
                        Company (Optional)
                      </label>
                      <input
                        type="text"
                        value={formData.company}
                        onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent transition-colors duration-200"
                        placeholder="Company name"
                      />
                    </div>

                    <div>
                      <label className="block text-small font-medium text-text-primary mb-2">
                        Message
                      </label>
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        rows={5}
                        className="w-full px-4 py-3 bg-background border border-border rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:border-accent transition-colors duration-200 resize-none"
                        placeholder="Tell us about your company or inquiry..."
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full">
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Info */}
            <motion.div
              ref={infoRef}
              initial={{ opacity: 0, x: 30 }}
              animate={infoInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1, ease: ANIMATION.easing.default }}
              className="lg:col-span-2 space-y-6"
            >
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-primary mb-1">Email</h3>
                      <p className="text-small text-text-secondary mb-2">
                        For general inquiries and pitch decks
                      </p>
                      <a 
                        href="mailto:hello@redstick.vc" 
                        className="text-accent hover:underline transition-all duration-200"
                      >
                        hello@redstick.vc
                      </a>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-primary mb-1">Location</h3>
                      <p className="text-small text-text-secondary">
                        Baton Rouge, Louisiana<br />
                        United States
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-accent" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-text-primary mb-1">Response Time</h3>
                      <p className="text-small text-text-secondary">
                        We aim to respond to all inquiries within 48 hours.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}
