/**
 * ReducedMotionProvider
 * =====================
 * Context provider for reduced motion preferences.
 * Allows app-wide access to motion settings and user overrides.
 * 
 * @example
 * // In your root layout
 * <ReducedMotionProvider>
 *   <App />
 * </ReducedMotionProvider>
 * 
 * // In a component
 * const { prefersReducedMotion, setOverride } = useReducedMotionContext();
 */

"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
  useMemo,
} from "react";

// =============================================================================
// Types
// =============================================================================

export interface ReducedMotionContextValue {
  /** Whether reduced motion is preferred (system or override) */
  prefersReducedMotion: boolean;
  /** System preference only */
  systemPreference: boolean;
  /** User override value (null = use system) */
  userOverride: boolean | null;
  /** Set user override */
  setOverride: (value: boolean | null) => void;
  /** Clear user override (use system preference) */
  clearOverride: () => void;
  /** Whether user has set an override */
  hasOverride: boolean;
}

interface ReducedMotionProviderProps {
  children: ReactNode;
  /** Storage key for persisting preference */
  storageKey?: string;
}

// =============================================================================
// Context
// =============================================================================

const ReducedMotionContext = createContext<ReducedMotionContextValue | undefined>(
  undefined
);

// =============================================================================
// Provider
// =============================================================================

export function ReducedMotionProvider({
  children,
  storageKey = "reduced-motion-preference",
}: ReducedMotionProviderProps) {
  // System preference state
  const [systemPreference, setSystemPreference] = useState(false);
  
  // User override state (null means use system)
  const [userOverride, setUserOverride] = useState<boolean | null>(null);
  
  // Hydration state
  const [isHydrated, setIsHydrated] = useState(false);

  // Load saved preference on mount
  useEffect(() => {
    setIsHydrated(true);
    
    if (typeof window === "undefined") return;

    // Load saved preference
    try {
      const saved = localStorage.getItem(storageKey);
      if (saved !== null) {
        setUserOverride(saved === "true");
      }
    } catch {
      // Ignore localStorage errors (private browsing, etc.)
    }

    // Listen for system preference changes
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setSystemPreference(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setSystemPreference(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handler);
    } else {
      mediaQuery.addListener(handler);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handler);
      } else {
        mediaQuery.removeListener(handler);
      }
    };
  }, [storageKey]);

  // Calculate effective preference
  const prefersReducedMotion = useMemo(() => {
    // Use override if set, otherwise use system preference
    return userOverride !== null ? userOverride : systemPreference;
  }, [userOverride, systemPreference]);

  // Set override with persistence
  const setOverride = useCallback(
    (value: boolean | null) => {
      setUserOverride(value);
      
      if (typeof window === "undefined") return;

      try {
        if (value === null) {
          localStorage.removeItem(storageKey);
        } else {
          localStorage.setItem(storageKey, String(value));
        }
      } catch {
        // Ignore localStorage errors
      }
    },
    [storageKey]
  );

  // Clear override
  const clearOverride = useCallback(() => {
    setOverride(null);
  }, [setOverride]);

  // Context value
  const value: ReducedMotionContextValue = {
    prefersReducedMotion,
    systemPreference,
    userOverride,
    setOverride,
    clearOverride,
    hasOverride: userOverride !== null,
  };

  // Prevent hydration mismatch
  if (!isHydrated) {
    return (
      <ReducedMotionContext.Provider
        value={{
          prefersReducedMotion: false,
          systemPreference: false,
          userOverride: null,
          setOverride: () => {},
          clearOverride: () => {},
          hasOverride: false,
        }}
      >
        {children}
      </ReducedMotionContext.Provider>
    );
  }

  return (
    <ReducedMotionContext.Provider value={value}>
      {children}
    </ReducedMotionContext.Provider>
  );
}

// =============================================================================
// Hook
// =============================================================================

/**
 * Hook to access reduced motion context
 * Must be used within ReducedMotionProvider
 */
export function useReducedMotionContext(): ReducedMotionContextValue {
  const context = useContext(ReducedMotionContext);
  
  if (context === undefined) {
    throw new Error(
      "useReducedMotionContext must be used within a ReducedMotionProvider"
    );
  }
  
  return context;
}

// =============================================================================
// Utility Hook (compatible with standalone useReducedMotion)
// =============================================================================

/**
 * Hook that works with or without ReducedMotionProvider
 * Falls back to standalone detection if provider is not present
 */
export function useReducedMotionPreference(): boolean {
  const context = useContext(ReducedMotionContext);
  
  if (context !== undefined) {
    return context.prefersReducedMotion;
  }
  
  // Fallback: use standalone detection
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  
  useEffect(() => {
    if (typeof window === "undefined") return;
    
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);

    const handler = (e: MediaQueryListEvent) => {
      setPrefersReducedMotion(e.matches);
    };

    if (mediaQuery.addEventListener) {
      mediaQuery.addEventListener("change", handler);
    } else {
      mediaQuery.addListener(handler);
    }

    return () => {
      if (mediaQuery.removeEventListener) {
        mediaQuery.removeEventListener("change", handler);
      } else {
        mediaQuery.removeListener(handler);
      }
    };
  }, []);
  
  return prefersReducedMotion;
}

export default ReducedMotionProvider;
