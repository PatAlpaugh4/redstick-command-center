import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Brand Colors
        primary: {
          DEFAULT: "#1a1a2e",
          light: "#16213e",
        },
        accent: {
          DEFAULT: "#e94560",
          hover: "#ff6b6b",
        },
        // Background Colors
        background: "#0f0f1a",
        surface: {
          DEFAULT: "#1a1a2e",
          elevated: "#252542",
        },
        border: "#2d2d4a",
        // Text Colors
        "text-primary": "#ffffff",
        "text-secondary": "#a0a0b0",
        "text-tertiary": "#6b6b7b",
        // Semantic Colors
        success: "#4ade80",
        warning: "#fbbf24",
        error: "#ef4444",
        info: "#60a5fa",
      },
      fontFamily: {
        sans: ["Inter", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      fontSize: {
        // Type Scale
        hero: ["4rem", { lineHeight: "1.1", letterSpacing: "-0.02em" }],
        h1: ["2.5rem", { lineHeight: "1.2", letterSpacing: "-0.01em" }],
        h2: ["2rem", { lineHeight: "1.25" }],
        h3: ["1.5rem", { lineHeight: "1.3" }],
        h4: ["1.25rem", { lineHeight: "1.4" }],
        body: ["1rem", { lineHeight: "1.6" }],
        small: ["0.875rem", { lineHeight: "1.5" }],
        xs: ["0.75rem", { lineHeight: "1.5" }],
      },
      fontWeight: {
        normal: "400",
        medium: "500",
        semibold: "600",
        bold: "700",
      },
      spacing: {
        // Spacing System (base: 4px)
        1: "0.25rem",   // 4px
        2: "0.5rem",    // 8px
        3: "0.75rem",   // 12px
        4: "1rem",      // 16px
        6: "1.5rem",    // 24px
        8: "2rem",      // 32px
        12: "3rem",     // 48px
        16: "4rem",     // 64px
        24: "6rem",     // 96px
      },
      borderRadius: {
        sm: "4px",
        md: "8px",
        lg: "12px",
        xl: "16px",
        full: "9999px",
      },
      boxShadow: {
        sm: "0 1px 2px rgba(0, 0, 0, 0.3)",
        md: "0 4px 6px rgba(0, 0, 0, 0.4)",
        lg: "0 10px 15px rgba(0, 0, 0, 0.5)",
        glow: "0 0 20px rgba(233, 69, 96, 0.3)",
        "glow-lg": "0 0 40px rgba(233, 69, 96, 0.4)",
      },
      transitionTimingFunction: {
        // Custom easing curves
        "smooth-decel": "cubic-bezier(0.16, 1, 0.3, 1)",
        "ease-out-custom": "cubic-bezier(0, 0, 0.2, 1)",
        "ease-in-out-custom": "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      animation: {
        // Content reveals
        "fade-in-up": "fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "fade-in": "fadeIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        "slide-up": "slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        
        // Marker animation
        "marker-draw": "markerDraw 1s cubic-bezier(0.16, 1, 0.3, 1) forwards",
        
        // Status indicators
        "agent-pulse": "agentPulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "status-pulse": "statusPulse 2s ease-in-out infinite",
        "pulse-soft": "pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        
        // Loading states
        shimmer: "shimmer 1.5s infinite",
        "spin-slow": "spin 3s linear infinite",
        
        // Scroll indicator
        "bounce-subtle": "bounceSubtle 1.5s ease-in-out infinite",
      },
      keyframes: {
        // Content reveal keyframes
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        
        // Marker underline keyframe
        markerDraw: {
          "0%": { width: "0%", opacity: "0" },
          "50%": { opacity: "1" },
          "100%": { width: "100%", opacity: "1" },
        },
        
        // Status indicator keyframes
        agentPulse: {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.5", transform: "scale(0.95)" },
        },
        statusPulse: {
          "0%, 100%": { opacity: "1", boxShadow: "0 0 0 0 currentColor" },
          "50%": { opacity: "0.8", boxShadow: "0 0 0 4px transparent" },
        },
        pulseSoft: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        
        // Loading keyframes
        shimmer: {
          "0%": { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
        
        // Scroll indicator keyframe
        bounceSubtle: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(8px)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};

export default config;
