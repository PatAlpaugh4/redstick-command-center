/**
 * Reduced Motion Example
 * ======================
 * Example component demonstrating reduced motion best practices.
 * This file serves as a reference for implementing accessible animations.
 * 
 * @example
 * <ReducedMotionExample />
 */

"use client";

import { motion } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  fadeVariants,
  slideUpVariants,
  slideUpVariantsReduced,
  scaleVariants,
  scaleVariantsReduced,
  staggerContainer,
  staggerContainerReduced,
  staggerItem,
  staggerItemReduced,
  selectVariants,
  disableIfReducedMotion,
} from "@/lib/animations";
import {
  MotionWrapper,
  FadeIn,
  SlideUp,
  ScaleIn,
  StaggerContainer,
  StaggerItem,
  Pulse,
  Spin,
} from "./MotionWrapper";
import { Modal } from "@/components/ui/modal";
import { useState } from "react";

// =============================================================================
// Example 1: Basic Reduced Motion Check
// =============================================================================

function BasicExample() {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{
        opacity: 1,
        // Remove y animation for reduced motion
        y: prefersReducedMotion ? 0 : 0,
      }}
      transition={{
        // Instant transition for reduced motion
        duration: prefersReducedMotion ? 0.01 : 0.3,
      }}
    >
      Animated Content
    </motion.div>
  );
}

// =============================================================================
// Example 2: Using Variant Helpers
// =============================================================================

function VariantHelperExample() {
  const prefersReducedMotion = useReducedMotion();

  // Automatically selects appropriate variants
  const variants = selectVariants(
    slideUpVariants,
    slideUpVariantsReduced,
    prefersReducedMotion
  );

  return (
    <motion.div
      variants={variants}
      initial="hidden"
      animate="visible"
    >
      Content with automatic reduced motion support
    </motion.div>
  );
}

// =============================================================================
// Example 3: MotionWrapper Component
// =============================================================================

function WrapperExample() {
  return (
    <MotionWrapper
      variants={fadeVariants}
      initial="hidden"
      animate="visible"
      className="p-4 bg-[#1a1a2e] rounded-lg"
    >
      <p>This content fades in automatically respecting reduced motion.</p>
    </MotionWrapper>
  );
}

// =============================================================================
// Example 4: Pre-built Components
// =============================================================================

function PrebuiltComponentsExample() {
  return (
    <div className="space-y-4">
      <FadeIn delay={0.1}>
        <div className="p-4 bg-[#1a1a2e] rounded-lg">Fades in</div>
      </FadeIn>

      <SlideUp y={30}>
        <div className="p-4 bg-[#1a1a2e] rounded-lg">Slides up (or fades in reduced mode)</div>
      </SlideUp>

      <ScaleIn>
        <div className="p-4 bg-[#1a1a2e] rounded-lg">Scales in (or fades in reduced mode)</div>
      </ScaleIn>
    </div>
  );
}

// =============================================================================
// Example 5: Staggered List
// =============================================================================

function StaggeredListExample() {
  const prefersReducedMotion = useReducedMotion();
  const containerVariants = prefersReducedMotion
    ? staggerContainerReduced
    : staggerContainer;
  const itemVariants = prefersReducedMotion ? staggerItemReduced : staggerItem;

  const items = ["Item 1", "Item 2", "Item 3", "Item 4"];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-2"
    >
      {items.map((item) => (
        <motion.div
          key={item}
          variants={itemVariants}
          className="p-3 bg-[#1a1a2e] rounded-lg"
        >
          {item}
        </motion.div>
      ))}
    </motion.div>
  );
}

// =============================================================================
// Example 6: Disabling Continuous Animations
// =============================================================================

function ContinuousAnimationExample() {
  const prefersReducedMotion = useReducedMotion();

  // Using helper to disable completely
  const pulseAnimation = disableIfReducedMotion(prefersReducedMotion, {
    scale: [1, 1.05, 1],
    transition: { duration: 2, repeat: Infinity },
  });

  return (
    <div className="space-y-4">
      {/* Method 1: Using disableIfReducedMotion helper */}
      <motion.div
        animate={pulseAnimation}
        className="p-4 bg-[#e94560]/20 rounded-lg"
      >
        Pulsing content (disabled in reduced motion)
      </motion.div>

      {/* Method 2: Using Pulse component (handles reduced motion internally) */}
      <Pulse>
        <div className="p-4 bg-[#e94560]/20 rounded-lg">
          Auto-handled pulse
        </div>
      </Pulse>

      {/* Method 3: Using Spin component */}
      <Spin duration={2}>
        <div className="p-4 bg-blue-500/20 rounded-lg">
          Spinning content (disabled in reduced motion)
        </div>
      </Spin>
    </div>
  );
}

// =============================================================================
// Example 7: Modal with Reduced Motion
// =============================================================================

function ModalExample() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-[#e94560] text-white rounded-lg"
      >
        Open Modal
      </button>

      <Modal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Accessible Modal"
        description="This modal automatically respects reduced motion preferences"
        footer={
          <>
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 text-white bg-white/10 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 bg-[#e94560] text-white rounded-lg"
            >
              Confirm
            </button>
          </>
        }
      >
        <p className="text-[#a0a0b0]">
          Modal content with automatic reduced motion support. The animation
          will be a fade only when reduced motion is preferred.
        </p>
      </Modal>
    </>
  );
}

// =============================================================================
// Example 8: Toast with Reduced Motion
// =============================================================================

// See src/components/toast/Toast.tsx for the implementation
// It automatically uses toastVariants or toastVariantsReduced based on preference

// =============================================================================
// Main Example Component
// =============================================================================

export function ReducedMotionExample() {
  return (
    <div className="space-y-8 p-6 bg-[#0f0f1a] min-h-screen">
      <h1 className="text-2xl font-bold text-white">Reduced Motion Examples</h1>
      
      <section>
        <h2 className="text-lg font-semibold text-white mb-4">1. Basic Example</h2>
        <BasicExample />
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-4">2. Variant Helpers</h2>
        <VariantHelperExample />
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-4">3. MotionWrapper</h2>
        <WrapperExample />
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-4">4. Pre-built Components</h2>
        <PrebuiltComponentsExample />
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-4">5. Staggered List</h2>
        <StaggeredListExample />
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-4">6. Continuous Animations</h2>
        <ContinuousAnimationExample />
      </section>

      <section>
        <h2 className="text-lg font-semibold text-white mb-4">7. Modal</h2>
        <ModalExample />
      </section>
    </div>
  );
}

export default ReducedMotionExample;
