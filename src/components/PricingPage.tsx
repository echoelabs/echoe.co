import React from 'react';
import { motion } from 'framer-motion';
import { Check, Lock } from 'lucide-react';
import { trackButtonClick } from '../services/analytics';

const PricingPage: React.FC = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
      className="relative bg-white pt-24 pb-16 text-slate-900 sm:pt-28 sm:pb-20 md:pt-32 md:pb-24"
    >
      <div className="mx-auto max-w-[1400px] px-3 sm:px-4 md:px-8 lg:px-16">
        <div className="mb-16 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="font-display mb-6 text-2xl leading-tight font-semibold tracking-tight text-slate-900 sm:text-3xl md:text-4xl lg:text-5xl"
          >
            Start small.
            <br />
            Scale infinitely.
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.8 }}
            className="mx-auto max-w-2xl text-sm font-normal text-gray-500 md:text-base"
          >
            We believe the best way to grow echoe is to let you grow for free. Upgrade only when
            your volume demands it.
          </motion.p>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 gap-4 sm:gap-6 md:grid-cols-2 lg:grid-cols-4">
          {/* 1. STARTER */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative z-10 flex h-full flex-col rounded-2xl border-2 border-blue-500 bg-white p-5 shadow-xl shadow-blue-500/10 transition-shadow duration-300 hover:shadow-2xl hover:shadow-blue-500/20 sm:p-6 lg:p-8"
          >
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-blue-500 px-3 py-1 text-[10px] font-semibold tracking-wider text-white uppercase">
              Live Early 2026
            </div>
            <div className="mb-6 pt-4">
              <h3 className="mb-2 text-lg font-semibold text-gray-900">Starter</h3>
              <div className="mb-2 flex items-baseline gap-2">
                <span className="font-display text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl">
                  $0
                </span>
                <span className="text-sm font-medium text-gray-500">/ forever</span>
              </div>
              <p className="text-xs leading-relaxed text-gray-600">
                Perfect for side hustles and new launches.
              </p>
            </div>
            <ul className="mb-6 flex-1 space-y-2">
              {[
                'Unlimited Unified Chats',
                'Unlimited Chat Channels',
                'Generous AI & Human Agents',
                'Mobile App Access',
                'Basic Analytics Dashboard',
                'Email Notifications',
                'Generous Order Limit',
                'Single Team Member',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-[11px] sm:text-xs">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" strokeWidth={2.5} />
                  <span className="leading-relaxed text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
            <a
              href="/waitlist"
              onClick={() => trackButtonClick('join_waitlist', 'pricing_page_starter')}
              className="touch-target block w-full rounded-full bg-blue-500 py-3.5 text-center text-xs font-medium text-white shadow-lg shadow-blue-500/30 transition-colors hover:bg-blue-600 sm:py-3"
            >
              Join Waitlist
            </a>
          </motion.div>

          {/* 2. GROWTH */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="group relative z-10 flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-lg transition-shadow duration-300 hover:border-gray-300 hover:shadow-xl sm:p-6 lg:p-8"
          >
            <div className="pointer-events-none absolute inset-0 z-10 rounded-2xl bg-gradient-to-b from-white/70 to-white/50 backdrop-blur-[3px] transition-all duration-500 group-hover:opacity-60 group-hover:backdrop-blur-sm"></div>
            <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center rounded-2xl">
              <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 shadow-md">
                <Lock className="h-4 w-4 text-gray-500" />
                <span className="text-[10px] font-semibold tracking-wider text-gray-600 uppercase">
                  Coming Late 2026
                </span>
              </div>
            </div>
            <div className="mb-6 pt-4 opacity-80 blur-[4px] transition-all duration-500 group-hover:opacity-95 group-hover:blur-[2px]">
              <h3 className="mb-2 text-lg font-semibold text-gray-900">Growth</h3>
              <div className="mb-2 flex items-baseline gap-2">
                <span className="font-display text-4xl font-bold text-gray-900 lg:text-5xl">
                  TBD
                </span>
                <span className="text-sm font-medium text-gray-500">/ mo</span>
              </div>
              <p className="text-xs leading-relaxed text-gray-600">TBD volume tier.</p>
            </div>
            <ul className="mb-6 flex-1 space-y-2 opacity-80 blur-[4px] transition-all duration-500 group-hover:opacity-95 group-hover:blur-[2px]">
              {[
                'TBD Features',
                'TBD Insights',
                'TBD Support',
                'TBD Branding',
                'TBD Email Support',
                'TBD Analytics',
                'TBD Workflows',
                'TBD Integrations',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" strokeWidth={2.5} />
                  <span className="leading-relaxed text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
            <button
              disabled
              className="w-full cursor-not-allowed rounded-full bg-gray-100 py-3 text-xs font-medium text-gray-500 opacity-80 blur-[4px] transition-all duration-500 group-hover:opacity-95 group-hover:blur-[2px]"
            >
              Coming Soon
            </button>
          </motion.div>

          {/* 3. SCALE */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="group relative z-10 flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-lg transition-shadow duration-300 hover:border-gray-300 hover:shadow-xl sm:p-6 lg:p-8"
          >
            <div className="pointer-events-none absolute inset-0 z-10 rounded-2xl bg-gradient-to-b from-white/70 to-white/50 backdrop-blur-[3px] transition-all duration-500 group-hover:opacity-60 group-hover:backdrop-blur-sm"></div>
            <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center rounded-2xl">
              <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 shadow-md">
                <Lock className="h-4 w-4 text-gray-500" />
                <span className="text-[10px] font-semibold tracking-wider text-gray-600 uppercase">
                  Coming 2027
                </span>
              </div>
            </div>
            <div className="mb-6 pt-4 opacity-80 blur-[4px] transition-all duration-500 group-hover:opacity-95 group-hover:blur-[2px]">
              <h3 className="mb-2 text-lg font-semibold text-gray-900">Scale</h3>
              <div className="mb-2 flex items-baseline gap-2">
                <span className="font-display text-4xl font-bold text-gray-900 lg:text-5xl">
                  TBD
                </span>
                <span className="text-sm font-medium text-gray-500">/ mo</span>
              </div>
              <p className="text-xs leading-relaxed text-gray-600">TBD volume tier.</p>
            </div>
            <ul className="mb-6 flex-1 space-y-2 opacity-80 blur-[4px] transition-all duration-500 group-hover:opacity-95 group-hover:blur-[2px]">
              {[
                'TBD in Growth',
                'TBD Tools',
                'TBD Analysis',
                'TBD Support 24/7',
                'TBD Analytics Suite',
                'TBD Options',
                'TBD Rate Limit',
                'TBD Account Manager',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" strokeWidth={2.5} />
                  <span className="leading-relaxed text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
            <button
              disabled
              className="w-full cursor-not-allowed rounded-full bg-gray-100 py-3 text-xs font-medium text-gray-500 opacity-80 blur-[4px] transition-all duration-500 group-hover:opacity-95 group-hover:blur-[2px]"
            >
              Coming Soon
            </button>
          </motion.div>

          {/* 4. ENTERPRISE */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
            className="group relative z-10 flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-lg transition-shadow duration-300 hover:border-gray-300 hover:shadow-xl sm:p-6 lg:p-8"
          >
            <div className="pointer-events-none absolute inset-0 z-10 rounded-2xl bg-gradient-to-b from-white/70 to-white/50 backdrop-blur-[3px] transition-all duration-500 group-hover:opacity-60 group-hover:backdrop-blur-sm"></div>
            <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center rounded-2xl">
              <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-4 py-2 shadow-md">
                <Lock className="h-4 w-4 text-gray-500" />
                <span className="text-[10px] font-semibold tracking-wider text-gray-600 uppercase">
                  Coming Late 2027
                </span>
              </div>
            </div>
            <div className="mb-6 pt-4 opacity-80 blur-[4px] transition-all duration-500 group-hover:opacity-95 group-hover:blur-[2px]">
              <h3 className="mb-2 text-lg font-semibold text-gray-900">Enterprise</h3>
              <div className="mb-2 flex items-baseline gap-2">
                <span className="font-display text-4xl font-bold text-gray-900 lg:text-5xl">
                  Custom
                </span>
              </div>
              <p className="text-xs leading-relaxed text-gray-600">TBD enterprise tier.</p>
            </div>
            <ul className="mb-6 flex-1 space-y-2 opacity-80 blur-[4px] transition-all duration-500 group-hover:opacity-95 group-hover:blur-[2px]">
              {[
                'TBD in Scale',
                'TBD API Access',
                'TBD Integrations',
                'TBD Success Manager',
                'TBD SLA Guarantee',
                'TBD Security (SSO)',
                'TBD Training Sessions',
                'TBD Feature Requests',
              ].map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-xs">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-gray-400" strokeWidth={2.5} />
                  <span className="leading-relaxed text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
            <button
              disabled
              className="w-full cursor-not-allowed rounded-full bg-gray-100 py-3 text-xs font-medium text-gray-500 opacity-80 blur-[4px] transition-all duration-500 group-hover:opacity-95 group-hover:blur-[2px]"
            >
              Contact Sales
            </button>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default PricingPage;
