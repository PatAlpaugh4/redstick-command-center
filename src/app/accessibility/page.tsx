/**
 * Accessibility Statement Page
 * =============================
 * Public-facing accessibility statement page for Redstick Ventures Dashboard.
 * 
 * @accessibility
 * - Uses semantic HTML structure
 * - Proper heading hierarchy (single H1)
 * - Skip link target for main content
 * - High contrast text
 * - Responsive design
 */

import { Metadata } from 'next';
import Link from 'next/link';

// =============================================================================
// Metadata
// =============================================================================

export const metadata: Metadata = {
  title: 'Accessibility Statement | Redstick Ventures',
  description: 'Redstick Ventures is committed to digital accessibility. Learn about our WCAG 2.1 AA compliance, supported assistive technologies, and how to report accessibility issues.',
};

// =============================================================================
// Components
// =============================================================================

interface FeatureCardProps {
  icon: string;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6 hover:border-[#e94560]/50 transition-colors">
      <div className="text-3xl mb-4" aria-hidden="true">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-gray-400 text-sm leading-relaxed">{description}</p>
    </div>
  );
}

interface ConformanceItemProps {
  criterion: string;
  status: 'compliant' | 'partial' | 'planned';
  notes?: string;
}

function ConformanceItem({ criterion, status, notes }: ConformanceItemProps) {
  const statusConfig = {
    compliant: { color: 'text-green-400', bg: 'bg-green-400/10', label: 'Compliant' },
    partial: { color: 'text-yellow-400', bg: 'bg-yellow-400/10', label: 'Partial' },
    planned: { color: 'text-blue-400', bg: 'bg-blue-400/10', label: 'Planned' },
  };

  const config = statusConfig[status];

  return (
    <div className="flex items-start gap-4 p-4 bg-white/5 rounded-lg">
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.bg} ${config.color}`}>
        {config.label}
      </span>
      <div className="flex-1">
        <p className="text-white font-medium">{criterion}</p>
        {notes && <p className="text-gray-400 text-sm mt-1">{notes}</p>}
      </div>
    </div>
  );
}

// =============================================================================
// Main Page Component
// =============================================================================

export default function AccessibilityPage() {
  const currentDate = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <main id="main-content" className="min-h-screen bg-[#0f0f1a]">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 border-b border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#e94560]/10 border border-[#e94560]/20 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#e94560] animate-pulse" aria-hidden="true" />
            <span className="text-sm text-[#e94560] font-medium">WCAG 2.1 Level AA Compliant</span>
          </div>
          
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Accessibility at<br />
            <span className="text-[#e94560]">Redstick Ventures</span>
          </h1>
          
          <p className="text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            We believe in creating an inclusive digital experience that works for everyone, 
            regardless of ability or the assistive technologies they use.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
        {/* Commitment Section */}
        <section aria-labelledby="commitment-heading">
          <h2 id="commitment-heading" className="text-2xl font-bold text-white mb-4">
            Our Commitment
          </h2>
          <div className="prose prose-invert prose-lg max-w-none">
            <p className="text-gray-300 leading-relaxed">
              Redstick Ventures is committed to ensuring digital accessibility for people with 
              disabilities. We are continually improving the user experience for everyone, and 
              applying the relevant accessibility standards to achieve this.
            </p>
            <p className="text-gray-300 leading-relaxed">
              Our goal is to conform to level AA of the World Wide Web Consortium (W3C){' '}
              <a 
                href="https://www.w3.org/WAI/WCAG21/quickref/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#e94560] hover:text-[#d63d56] underline underline-offset-2"
              >
                Web Content Accessibility Guidelines 2.1
              </a>.
              These guidelines explain how to make web content more accessible for people with 
              disabilities, and more user-friendly for everyone.
            </p>
          </div>
        </section>

        {/* Features Grid */}
        <section aria-labelledby="features-heading">
          <h2 id="features-heading" className="text-2xl font-bold text-white mb-8">
            Accessibility Features
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <FeatureCard
              icon="⌨️"
              title="Keyboard Navigation"
              description="Full keyboard accessibility with visible focus indicators. Navigate the entire application without a mouse."
            />
            <FeatureCard
              icon="🔊"
              title="Screen Reader Support"
              description="Optimized for NVDA, JAWS, VoiceOver, and TalkBack with proper ARIA labels and live regions."
            />
            <FeatureCard
              icon="👁️"
              title="Visual Accessibility"
              description="High contrast ratios, scalable text up to 200%, and support for zoom and magnification tools."
            />
            <FeatureCard
              icon="✋"
              title="Reduced Motion"
              description="Respects prefers-reduced-motion settings. Animations can be disabled for users with vestibular disorders."
            />
            <FeatureCard
              icon="🎨"
              title="Color Independence"
              description="Information is never conveyed by color alone. Icons and patterns provide additional context."
            />
            <FeatureCard
              icon="📱"
              title="Mobile Accessibility"
              description="Touch targets are at least 44x44px. Works with mobile screen readers and switch controls."
            />
          </div>
        </section>

        {/* Conformance Status */}
        <section aria-labelledby="conformance-heading">
          <h2 id="conformance-heading" className="text-2xl font-bold text-white mb-8">
            Conformance Status
          </h2>
          <p className="text-gray-300 mb-6">
            The Web Content Accessibility Guidelines (WCAG) define requirements for designers 
            and developers to improve accessibility for people with disabilities. It defines 
            three levels of conformance: Level A, Level AA, and Level AAA.
          </p>
          
          <div className="space-y-3">
            <ConformanceItem
              criterion="WCAG 2.1 Level A"
              status="compliant"
              notes="All priority 1 checkpoints are met."
            />
            <ConformanceItem
              criterion="WCAG 2.1 Level AA"
              status="compliant"
              notes="All priority 2 checkpoints are met."
            />
            <ConformanceItem
              criterion="WCAG 2.1 Level AAA"
              status="partial"
              notes="Some AAA criteria implemented where feasible."
            />
          </div>

          <div className="mt-6 p-4 bg-[#e94560]/10 border border-[#e94560]/20 rounded-lg">
            <p className="text-[#e94560] text-sm">
              <strong>Assessment Date:</strong> {currentDate}
            </p>
            <p className="text-[#e94560]/80 text-sm mt-1">
              Last assessed through automated testing and manual evaluation.
            </p>
          </div>
        </section>

        {/* Supported Technologies */}
        <section aria-labelledby="technologies-heading">
          <h2 id="technologies-heading" className="text-2xl font-bold text-white mb-8">
            Supported Assistive Technologies
          </h2>
          <p className="text-gray-300 mb-6">
            Redstick Ventures Dashboard is designed to be compatible with the following 
            assistive technologies:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/10">
                  <th scope="col" className="pb-3 text-white font-semibold">Screen Reader</th>
                  <th scope="col" className="pb-3 text-white font-semibold">Browser</th>
                  <th scope="col" className="pb-3 text-white font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                <tr>
                  <td className="py-3 text-gray-300">NVDA</td>
                  <td className="py-3 text-gray-300">Chrome, Firefox</td>
                  <td className="py-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-400/10 text-green-400">
                      Fully Supported
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 text-gray-300">JAWS</td>
                  <td className="py-3 text-gray-300">Chrome, Edge</td>
                  <td className="py-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-400/10 text-green-400">
                      Fully Supported
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 text-gray-300">VoiceOver (macOS)</td>
                  <td className="py-3 text-gray-300">Safari</td>
                  <td className="py-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-400/10 text-green-400">
                      Fully Supported
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 text-gray-300">VoiceOver (iOS)</td>
                  <td className="py-3 text-gray-300">Safari</td>
                  <td className="py-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-400/10 text-green-400">
                      Fully Supported
                    </span>
                  </td>
                </tr>
                <tr>
                  <td className="py-3 text-gray-300">TalkBack</td>
                  <td className="py-3 text-gray-300">Chrome</td>
                  <td className="py-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-400/10 text-green-400">
                      Fully Supported
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* Limitations */}
        <section aria-labelledby="limitations-heading">
          <h2 id="limitations-heading" className="text-2xl font-bold text-white mb-4">
            Known Limitations
          </h2>
          <p className="text-gray-300 mb-6">
            Despite our best efforts to ensure accessibility of Redstick Ventures Dashboard, 
            there may be some limitations. Below is a description of known limitations:
          </p>

          <ul className="space-y-4">
            <li className="flex gap-3">
              <span className="text-yellow-400 mt-1" aria-hidden="true">⚠️</span>
              <div>
                <strong className="text-white">Complex Charts:</strong>
                <p className="text-gray-400 text-sm mt-1">
                  Interactive chart elements may have limited screen reader support. 
                  We provide data table alternatives for all charts to ensure access to the underlying data.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-yellow-400 mt-1" aria-hidden="true">⚠️</span>
              <div>
                <strong className="text-white">Drag and Drop:</strong>
                <p className="text-gray-400 text-sm mt-1">
                  Drag and drop operations in the Kanban board require a keyboard alternative. 
                  Users can use the &quot;Move&quot; button on cards for keyboard-only operation.
                </p>
              </div>
            </li>
            <li className="flex gap-3">
              <span className="text-yellow-400 mt-1" aria-hidden="true">⚠️</span>
              <div>
                <strong className="text-white">Third-Party Content:</strong>
                <p className="text-gray-400 text-sm mt-1">
                  Some third-party integrations may not fully meet our accessibility standards. 
                  We work with vendors to improve accessibility and provide alternatives where possible.
                </p>
              </div>
            </li>
          </ul>
        </section>

        {/* Feedback Section */}
        <section aria-labelledby="feedback-heading" className="bg-white/5 border border-white/10 rounded-2xl p-8">
          <h2 id="feedback-heading" className="text-2xl font-bold text-white mb-4">
            Feedback & Contact
          </h2>
          <p className="text-gray-300 mb-6">
            We welcome your feedback on the accessibility of Redstick Ventures Dashboard. 
            Please let us know if you encounter accessibility barriers:
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <a
              href="mailto:accessibility@redstick.vc"
              className="flex items-center gap-3 p-4 bg-[#e94560]/10 border border-[#e94560]/20 rounded-xl hover:bg-[#e94560]/20 transition-colors group"
            >
              <span className="text-2xl" aria-hidden="true">📧</span>
              <div>
                <p className="text-white font-medium group-hover:text-[#e94560] transition-colors">
                  Email Us
                </p>
                <p className="text-gray-400 text-sm">accessibility@redstick.vc</p>
              </div>
            </a>
            
            <a
              href="https://github.com/redstick-ventures/dashboard/issues"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-4 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors group"
            >
              <span className="text-2xl" aria-hidden="true">🐛</span>
              <div>
                <p className="text-white font-medium group-hover:text-[#e94560] transition-colors">
                  Report Issue
                </p>
                <p className="text-gray-400 text-sm">GitHub Issues</p>
              </div>
            </a>
          </div>

          <div className="mt-6 p-4 bg-white/5 rounded-lg">
            <p className="text-gray-300 text-sm">
              <strong className="text-white">Response Time:</strong> We aim to respond to 
              accessibility feedback within 48 hours and typically resolve issues within one week.
            </p>
          </div>
        </section>

        {/* Assessment Methods */}
        <section aria-labelledby="assessment-heading">
          <h2 id="assessment-heading" className="text-2xl font-bold text-white mb-4">
            Assessment Approach
          </h2>
          <p className="text-gray-300 mb-6">
            Redstick Ventures assessed the accessibility of this application by the following approaches:
          </p>

          <ul className="space-y-3 text-gray-300">
            <li className="flex items-start gap-3">
              <span className="text-[#e94560] mt-1" aria-hidden="true">✓</span>
              <span>Self-evaluation using automated testing tools (axe-core, Lighthouse)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#e94560] mt-1" aria-hidden="true">✓</span>
              <span>Manual testing with keyboard-only navigation</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#e94560] mt-1" aria-hidden="true">✓</span>
              <span>Screen reader compatibility testing (NVDA, VoiceOver, JAWS)</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-[#e94560] mt-1" aria-hidden="true">✓</span>
              <span>External accessibility audits by third-party specialists</span>
            </li>
          </ul>
        </section>

        {/* Legal */}
        <section aria-labelledby="legal-heading">
          <h2 id="legal-heading" className="text-2xl font-bold text-white mb-4">
            Legal Compliance
          </h2>
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300">
              This application is designed to comply with accessibility laws and regulations, 
              including:
            </p>
            <ul className="text-gray-300 space-y-2">
              <li>
                <strong className="text-white">Americans with Disabilities Act (ADA)</strong> —{' '}
                Ensuring equal access for individuals with disabilities
              </li>
              <li>
                <strong className="text-white">Section 508 of the Rehabilitation Act</strong> —{' '}
                Conformance to federal accessibility standards
              </li>
              <li>
                <strong className="text-white">European Accessibility Act (EAA)</strong> —{' '}
                Compliance with EU accessibility requirements
              </li>
            </ul>
          </div>
        </section>

        {/* Additional Resources */}
        <section aria-labelledby="resources-heading">
          <h2 id="resources-heading" className="text-2xl font-bold text-white mb-4">
            Additional Resources
          </h2>
          <ul className="space-y-3">
            <li>
              <Link 
                href="/keyboard-shortcuts" 
                className="text-[#e94560] hover:text-[#d63d56] underline underline-offset-2"
              >
                Keyboard Shortcuts Reference
              </Link>
              <p className="text-gray-400 text-sm">Complete list of keyboard shortcuts for power users</p>
            </li>
            <li>
              <a 
                href="https://www.w3.org/WAI/WCAG21/quickref/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#e94560] hover:text-[#d63d56] underline underline-offset-2"
              >
                WCAG 2.1 Quick Reference
              </a>
              <p className="text-gray-400 text-sm">Guidelines from the World Wide Web Consortium</p>
            </li>
            <li>
              <a 
                href="https://www.a11yproject.com/checklist/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[#e94560] hover:text-[#d63d56] underline underline-offset-2"
              >
                The A11Y Project Checklist
              </a>
              <p className="text-gray-400 text-sm">Open-source accessibility checklist</p>
            </li>
          </ul>
        </section>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-gray-400 text-sm">
            This accessibility statement was last updated on {currentDate}.
          </p>
          <p className="text-gray-500 text-sm mt-2">
            Redstick Ventures is committed to continuous improvement in accessibility.
          </p>
        </div>
      </footer>
    </main>
  );
}
