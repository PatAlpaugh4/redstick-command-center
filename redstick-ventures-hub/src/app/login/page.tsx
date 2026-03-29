"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Eye, EyeOff, Lock, Mail, ArrowLeft } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    // Simulate login
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    // For demo, redirect to dashboard
    router.push("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Side - Branding */}
      <div className="hidden lg:flex flex-1 bg-surface relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-30" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        
        <div className="relative z-10 flex flex-col justify-between p-12">
          <Link href="/landing" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">R</span>
            </div>
            <span className="font-display font-bold text-xl text-text-primary">
              Redstick
            </span>
          </Link>

          <div>
            <h2 className="font-display text-4xl font-bold text-text-primary mb-4">
              Welcome back to
              <br />
              <span className="text-accent">Redstick Ventures</span>
            </h2>
            <p className="text-text-secondary max-w-md">
              Access the Redstick Command Center to manage your AI agents, 
              track deal flow, and monitor portfolio performance.
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="w-10 h-10 bg-surface-elevated border-2 border-surface rounded-full flex items-center justify-center"
                >
                  <span className="text-xs text-text-tertiary">U{i}</span>
                </div>
              ))}
            </div>
            <p className="text-sm text-text-secondary">
              Trusted by <span className="text-text-primary font-medium">50+</span> team members
            </p>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile Header */}
          <div className="lg:hidden mb-8">
            <Link href="/landing" className="flex items-center gap-2 text-text-secondary hover:text-text-primary mb-6">
              <ArrowLeft className="w-4 h-4" />
              Back to website
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">R</span>
              </div>
              <span className="font-display font-bold text-xl text-text-primary">
                Redstick
              </span>
            </div>
          </div>

          <div className="mb-8">
            <h1 className="text-2xl font-bold text-text-primary mb-2">
              Sign in to your account
            </h1>
            <p className="text-text-secondary">
              Enter your credentials to access the dashboard
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg text-error text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                <input
                  type="email"
                  required
                  placeholder="name@company.com"
                  className="w-full pl-12 pr-4 py-3 bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text-secondary mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-text-tertiary" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-3 bg-surface border border-border rounded-lg text-text-primary placeholder:text-text-tertiary focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-text-tertiary hover:text-text-primary transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-border bg-surface text-accent focus:ring-accent"
                />
                <span className="text-sm text-text-secondary">Remember me</span>
              </label>
              <Link
                href="#"
                className="text-sm text-accent hover:text-accent-hover transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            <Button
              type="submit"
              className="w-full"
              size="lg"
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-text-secondary">
              Don&apos;t have an account?{" "}
              <Link
                href="#"
                className="text-accent hover:text-accent-hover transition-colors"
              >
                Contact your admin
              </Link>
            </p>
          </div>

          {/* Demo Credentials */}
          <div className="mt-8 p-4 bg-surface border border-border rounded-lg">
            <p className="text-xs font-medium text-text-tertiary uppercase tracking-wider mb-2">
              Demo Credentials
            </p>
            <div className="space-y-1 text-sm">
              <p className="text-text-secondary">
                <span className="text-text-primary">Email:</span> partner@redstick.vc
              </p>
              <p className="text-text-secondary">
                <span className="text-text-primary">Password:</span> any password works
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
