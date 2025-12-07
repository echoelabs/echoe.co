import React, { useState, useRef, useEffect } from 'react';
import {
  motion,
  useScroll,
  useTransform,
  AnimatePresence,
  useMotionValueEvent,
} from 'framer-motion';
import { Check, Lock, Loader2 } from 'lucide-react';
import isEmail from 'validator/lib/isEmail';
import FooterReact from './FooterReact';
import { trackSignup, trackButtonClick } from '../services/analytics';
import { useTurnstile } from '../hooks/useTurnstile';
import TurnstileWidget from './TurnstileWidget';

const EarlyAccess: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [isFocused, setIsFocused] = useState(false);

  const {
    token,
    siteKey,
    handleSuccess: handleTurnstileSuccess,
    handleError: handleTurnstileError,
    handleExpire: handleTurnstileExpire,
    reset: resetTurnstile,
    widgetRef,
  } = useTurnstile();

  // Attach ref to the parent section to track the full scroll progress
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start start', 'end end'],
  });

  // Mobile detection for disabling expensive parallax
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // --- REFINED PHYSICS-BASED SKY TRANSITION ---
  // HEIGHT: 800vh total
  // Background moves UP to reveal the "night" section.
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '-75%']);

  // Parallax for stars:
  const starsY = useTransform(scrollYProgress, [0, 1], ['10%', '-20%']);

  // Fade stars in later to ensure sky is dark enough
  const starsOpacity = useTransform(scrollYProgress, [0.6, 0.8], [0, 1]);

  // EXTRA DENSE STARS for the bottom (Galaxy effect)
  // Fades in during the latter part of the scroll
  const denseStarsOpacity = useTransform(scrollYProgress, [0.75, 1], [0, 1]);

  // Fade Aurora in slightly later than before to ensure background is dark indigo/black
  // This prevents the "washed out white" look on the blue sky
  const auroraOpacity = useTransform(scrollYProgress, [0.55, 0.75], [0, 1]);

  // BOTTOM AURORA
  // Mobile: Fade in early (0.2) to match the earlier form appearance.
  // Desktop: Fade in late (0.8) for the second step.
  const bottomAuroraOpacity = useTransform(
    scrollYProgress,
    isMobile ? [0.2, 0.4] : [0.8, 0.95],
    [0, 1]
  );

  // Content Animations
  // Mobile: Fade in early (0.2-0.4) to replace the "Step 1" text phase.
  // Desktop: Fade in late (0.65-0.8) after the text phase.
  const newsletterOpacity = useTransform(
    scrollYProgress,
    isMobile ? [0.2, 0.4] : [0.65, 0.8],
    [0, 1]
  );
  const newsletterScale = useTransform(
    scrollYProgress,
    isMobile ? [0.2, 0.4] : [0.65, 0.8],
    isMobile ? [0.95, 1] : [0.9, 1]
  );

  // DYNAMIC SAFARI SAFE AREA COLOR TOGGLE
  // Switches body background to black when user scrolls deep into the dark area.
  useMotionValueEvent(scrollYProgress, 'change', (latest: number) => {
    // Threshold: 0.25 (When the blue/dark gradient is significant covering the screen)
    // This ensures bottom bar/overscroll matches the content visual.
    const isDark = latest > 0.25;
    if (typeof document !== 'undefined') {
      const targetColor = isDark ? '#000000' : '#ffffff';
      if (document.body.style.backgroundColor !== targetColor) {
        document.body.style.backgroundColor = targetColor;
        document.documentElement.style.backgroundColor = targetColor;
      }
    }
  });

  // Reset to white on unmount
  useEffect(() => {
    return () => {
      if (typeof document !== 'undefined') {
        document.body.style.backgroundColor = '#ffffff';
        document.documentElement.style.backgroundColor = '#ffffff';
      }
    };
  }, []);

  // DYNAMIC POSITIONING - calculated based on footer height
  const footerRef = useRef<HTMLDivElement>(null);
  const [finalYOffset, setFinalYOffset] = useState(0);

  useEffect(() => {
    const updateYOffset = () => {
      const footerHeight = footerRef.current?.offsetHeight || 0;
      // Center newsletter in space above footer
      // Available space = vh - footerHeight
      // To center: move up by footerHeight / 2
      setFinalYOffset(-footerHeight / 2);
    };

    updateYOffset();
    window.addEventListener('resize', updateYOffset);

    // Also observe footer size changes
    const observer = new ResizeObserver(updateYOffset);
    if (footerRef.current) {
      observer.observe(footerRef.current);
    }

    return () => {
      window.removeEventListener('resize', updateYOffset);
      observer.disconnect();
    };
  }, []);

  const newsletterY = useTransform(
    scrollYProgress,
    isMobile ? [0.2, 0.9, 0.95, 1] : [0.65, 0.85, 0.95, 1],
    // Mobile: Lock to finalYOffset / 2 (Middle Ground).
    // Original (finalYOffset) was too high. 0 was too low.
    // Desktop: Slide in from 150 -> 0 -> finalYOffset.
    isMobile
      ? [finalYOffset / 2, finalYOffset / 2, finalYOffset / 2, finalYOffset / 2]
      : [150, 0, 0, finalYOffset]
  );

  // Footer fade in
  // Mobile: Sync with newsletter (0.2-0.4) for single-step appearance.
  // Desktop: Fade in at end.
  const footerOpacity = useTransform(scrollYProgress, isMobile ? [0.2, 0.4] : [0.95, 1], [0, 1]);

  // Newsletter collapse when footer appears - hide heading/description
  const headingOpacity = useTransform(scrollYProgress, [0.92, 0.96], [1, 0]);
  const headingScale = useTransform(scrollYProgress, [0.92, 0.96], [1, 0.95]);
  const headingY = useTransform(scrollYProgress, [0.92, 0.96], [0, -20]);

  // Generate stars only on client to avoid hydration mismatch
  type Star = {
    id: number;
    top: string;
    left: string;
    size: string;
    opacity: number;
    delay: string;
  };
  const [stars, setStars] = useState<Star[]>([]);
  const [denseStars, setDenseStars] = useState<Star[]>([]);

  useEffect(() => {
    // Generate stars on client only - reduce count on mobile for performance
    const starCount = isMobile ? 25 : 50;
    const denseStarCount = isMobile ? 60 : 150;

    setStars(
      [...Array(starCount)].map((_, i) => ({
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: Math.random() * 3 + 'px',
        opacity: Math.random(),
        delay: `${Math.random() * 3}s`,
      }))
    );

    setDenseStars(
      [...Array(denseStarCount)].map((_, i) => ({
        id: i,
        top: `${Math.random() * 100}%`,
        left: `${Math.random() * 100}%`,
        size: Math.random() * 2 + 'px',
        opacity: Math.random() * 0.8 + 0.2,
        delay: `${Math.random() * 5}s`,
      }))
    );
  }, [isMobile]);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !isEmail(email)) {
      setStatus('error');
      return;
    }

    // Check for Turnstile token (only if site key is configured)
    if (siteKey && !token) {
      setStatus('error');
      return;
    }

    setStatus('loading');

    // Track signup event
    trackSignup(email);

    try {
      const response = await fetch('/api/waitlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, turnstileToken: token }),
      });

      if (!response.ok) {
        const data = await response.json();
        console.error('Waitlist error:', data.error);
        setStatus('error');
        resetTurnstile();
        return;
      }

      setStatus('success');
      setEmail('');
      resetTurnstile();
    } catch (error) {
      console.error('Waitlist error:', error);
      setStatus('error');
      resetTurnstile();
    }
  };

  return (
    <>
      {/* PRICING SECTION - Static white background, normal flow */}
      <section id="pricing" className="relative bg-white py-16 text-slate-900 sm:py-20 md:py-24">
        <div className="mx-auto max-w-[1600px] px-6 sm:px-4 md:px-12 lg:px-16">
          <div className="mb-16 text-center">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="font-display mb-6 text-2xl leading-tight font-semibold tracking-tight text-slate-900 sm:text-3xl md:text-4xl lg:text-5xl"
            >
              Start small.
              <br />
              Scale infinitely.
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.5 }}
              viewport={{ once: true }}
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
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
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
              <button
                onClick={() => {
                  trackButtonClick('join_waitlist', 'pricing_starter');
                  const section = document.getElementById('early-access');
                  if (section) {
                    const sectionTop = section.offsetTop;
                    const sectionHeight = section.offsetHeight;
                    // Newsletter appears at ~70% scroll progress through the 800vh section
                    const targetScroll = sectionTop + sectionHeight * 0.7;
                    window.scrollTo({ top: targetScroll, behavior: 'smooth' });
                  }
                }}
                className="touch-target w-full rounded-full bg-blue-500 py-3.5 text-xs font-medium text-white shadow-lg shadow-blue-500/30 transition-colors hover:bg-blue-600 sm:py-3"
              >
                Join Waitlist
              </button>
            </motion.div>

            {/* 2. GROWTH */}
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ delay: 0.1, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="group relative z-10 flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-lg transition-shadow duration-300 hover:border-gray-300 hover:shadow-xl sm:p-6 lg:p-8"
            >
              {/* Overlay */}
              <div className="pointer-events-none absolute inset-0 z-10 rounded-2xl bg-gradient-to-b from-white/70 to-white/50 backdrop-blur-[3px] transition-all duration-500 group-hover:opacity-60 group-hover:backdrop-blur-sm"></div>
              {/* Lock Badge - Separate from overlay to maintain full opacity */}
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
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ delay: 0.2, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="group relative z-10 flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-lg transition-shadow duration-300 hover:border-gray-300 hover:shadow-xl sm:p-6 lg:p-8"
            >
              {/* Overlay */}
              <div className="pointer-events-none absolute inset-0 z-10 rounded-2xl bg-gradient-to-b from-white/70 to-white/50 backdrop-blur-[3px] transition-all duration-500 group-hover:opacity-60 group-hover:backdrop-blur-sm"></div>
              {/* Lock Badge - Separate from overlay to maintain full opacity */}
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
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.1 }}
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ delay: 0.3, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
              className="group relative z-10 flex h-full flex-col rounded-2xl border border-gray-200 bg-white p-5 shadow-lg transition-shadow duration-300 hover:border-gray-300 hover:shadow-xl sm:p-6 lg:p-8"
            >
              {/* Overlay */}
              <div className="pointer-events-none absolute inset-0 z-10 rounded-2xl bg-gradient-to-b from-white/70 to-white/50 backdrop-blur-[3px] transition-all duration-500 group-hover:opacity-60 group-hover:backdrop-blur-sm"></div>
              {/* Lock Badge - Separate from overlay to maintain full opacity */}
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
      </section>

      {/* ANIMATED BACKGROUND SECTION - Starts after pricing */}
      <section
        id="early-access"
        ref={sectionRef}
        className="relative h-[200vh] bg-black text-slate-900 sm:h-[350vh] md:h-[500vh] lg:h-[800vh]"
        style={{ position: 'relative' }}
      >
        {/* 1. STICKY STAGE (Backgrounds + Newsletter + Footer) */}
        {/* This container stays pinned to the viewport while the parent section scrolls */}
        <div className="sticky top-0 h-[100svh] w-full overflow-hidden">
          {/* A. BACKGROUND LAYERS (z-0) */}
          <div className="pointer-events-none absolute inset-0 z-0 h-full w-full">
            {/* Base White Background (for the start) */}
            <div className="absolute inset-0 bg-white" />

            {/* Space Gradient (Sky -> Space) - Moves UP */}
            <motion.div
              style={{ y: backgroundY }}
              className="absolute left-0 h-[400%] w-full bg-gradient-to-b from-white via-blue-200 via-blue-900 to-black"
            >
              {/* Gradient Stops Layout:
                0-25%: White (Visible during pricing cards 0-15% scroll)
                25-50%: Blue-200 (Sky transition)
                50-75%: Blue-900 (Dark transition)
                75-100%: Black (Space)
            */}
            </motion.div>

            {/* Standard Stars */}
            <motion.div style={{ y: starsY, opacity: starsOpacity }} className="absolute inset-0">
              {stars.map((star) => (
                <div
                  key={star.id}
                  className="animate-twinkle absolute rounded-full bg-white"
                  style={{
                    top: star.top,
                    left: star.left,
                    width: star.size,
                    height: star.size,
                    opacity: star.opacity,
                    animationDelay: star.delay,
                  }}
                />
              ))}
            </motion.div>

            {/* Deep Space Stars (Dense Galaxy Effect) - Bottom Only */}
            <motion.div style={{ opacity: denseStarsOpacity }} className="absolute inset-0">
              {denseStars.map((star) => (
                <div
                  key={`dense-${star.id}`}
                  className="animate-twinkle absolute rounded-full bg-blue-100"
                  style={{
                    top: star.top,
                    left: star.left,
                    width: star.size,
                    height: star.size,
                    opacity: star.opacity,
                    animationDelay: star.delay,
                    boxShadow: '0 0 2px rgba(255, 255, 255, 0.8)',
                  }}
                />
              ))}
            </motion.div>

            {/* Top Aurora (Higher position) */}
            <motion.div
              style={{ opacity: auroraOpacity }}
              className="mask-linear-fade absolute top-[25%] left-0 h-[60vh] w-full mix-blend-plus-lighter"
            >
              {/* Desktop Animated Aurora - Restored on Mobile */}
              <div className="animate-aurora-1 absolute top-0 left-[-10%] h-full w-[120%] bg-gradient-to-r from-emerald-500/10 via-teal-500/20 to-emerald-500/10 blur-[100px]" />
              <div className="animate-aurora-2 absolute top-[20%] right-[-10%] h-full w-[120%] bg-gradient-to-l from-cyan-500/10 via-blue-500/20 to-cyan-500/10 blur-[80px]" />
            </motion.div>

            {/* Bottom Dynamic Aurora (Intense Green/Teal at bottom) */}
            <motion.div
              style={{ opacity: bottomAuroraOpacity }}
              className="absolute bottom-[-10%] left-0 h-[80vh] w-full mix-blend-screen"
            >
              {/* Main Green Glow */}
              <div className="animate-aurora-shimmer absolute bottom-0 left-0 h-full w-full bg-gradient-to-t from-emerald-600/30 via-teal-500/10 to-transparent blur-[120px]" />

              {/* Moving Curtains */}
              <div className="animate-aurora-1 absolute bottom-0 left-[-20%] h-[80%] w-[140%] bg-gradient-to-tr from-green-400/20 via-emerald-300/10 to-transparent blur-[60px]" />
              <div className="animate-aurora-2 absolute right-[-20%] bottom-[-20%] h-[90%] w-[140%] bg-gradient-to-tl from-teal-300/20 via-cyan-400/10 to-transparent blur-[70px] delay-1000" />
            </motion.div>
          </div>

          {/* B. NEWSLETTER & FOOTER OVERLAY (z-30) */}
          <div className="pointer-events-none relative z-30 flex h-full w-full flex-col items-center justify-center">
            {/* Newsletter Form */}
            <motion.div
              style={{
                opacity: newsletterOpacity,
                scale: newsletterScale,
                y: newsletterY,
              }}
              className="pointer-events-auto relative z-40 flex w-full max-w-xl flex-col items-center justify-center px-6"
            >
              {/* Full heading - fades out when footer appears */}
              {/* Full heading - fades out when footer appears - DESKTOP ONLY */}
              {!isMobile && (
                <motion.div
                  style={{
                    opacity: headingOpacity,
                    scale: headingScale,
                    y: headingY,
                  }}
                  className="mb-8 text-center"
                >
                  <h2 className="font-display mb-6 text-4xl leading-none font-semibold tracking-tighter text-white drop-shadow-2xl sm:text-5xl md:text-6xl lg:text-7xl">
                    Ready to <br />
                    echoe?
                  </h2>
                  <p className="mx-auto max-w-md text-sm font-normal text-blue-200/80 md:text-base">
                    Join the waiting list for early access updates and be the first to experience
                    the future.
                  </p>
                </motion.div>
              )}

              {/* Compact "Join..." label - fades in when footer appears */}
              <motion.p
                style={{
                  opacity: footerOpacity,
                }}
                className="mb-8 max-w-md px-4 text-center text-sm font-medium tracking-wide text-white/70"
              >
                Join the waiting list for early access updates and be the first to experience the
                future.
              </motion.p>

              <div className="relative flex min-h-[60px] items-center justify-center sm:min-h-[70px]">
                <AnimatePresence mode="wait">
                  {status === 'success' ? (
                    <motion.div
                      key="success-badge"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                      className="flex w-full items-center justify-center gap-3 rounded-full border border-emerald-500/50 bg-emerald-500/20 px-6 py-3 shadow-[0_0_30px_rgba(16,185,129,0.2)] backdrop-blur-xl"
                      role="status"
                      aria-live="polite"
                    >
                      <div className="rounded-full bg-emerald-500 p-1">
                        <Check className="h-4 w-4 text-white" strokeWidth={3} />
                      </div>
                      <span className="text-base font-medium text-emerald-100">
                        You're on the list.
                      </span>
                    </motion.div>
                  ) : (
                    <motion.form
                      key="signup-form"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                      onSubmit={handleSubscribe}
                      className="relative w-full"
                    >
                      <div
                        className={`relative flex items-center rounded-full border bg-white/10 p-2 backdrop-blur-xl transition-all duration-300 ${
                          status === 'error'
                            ? 'border-red-500/70 shadow-[0_0_20px_rgba(239,68,68,0.2)]'
                            : isFocused
                              ? 'border-white/50 shadow-[0_0_30px_rgba(255,255,255,0.2)]'
                              : 'border-white/20 hover:border-white/30'
                        }`}
                      >
                        <label htmlFor="waitlist-email" className="sr-only">
                          Email address
                        </label>
                        <input
                          id="waitlist-email"
                          type="email"
                          inputMode="email"
                          autoComplete="email"
                          placeholder="Enter your email"
                          value={email}
                          onChange={(e) => {
                            setEmail(e.target.value);
                            if (status === 'error') setStatus('idle');
                          }}
                          onFocus={() => setIsFocused(true)}
                          onBlur={() => setIsFocused(false)}
                          disabled={status === 'loading'}
                          aria-label="Email address for waitlist"
                          aria-invalid={status === 'error'}
                          aria-describedby={status === 'error' ? 'email-error' : undefined}
                          style={{ transform: 'translate3d(0,0,0)' }}
                          className="m-0 h-12 min-w-0 flex-1 appearance-none border-none bg-transparent px-4 py-0 align-middle text-base leading-normal text-white placeholder-blue-200/50 outline-none focus:ring-0 sm:h-auto sm:px-5 sm:py-3 sm:text-sm"
                        />
                        <button
                          type="submit"
                          disabled={status === 'loading'}
                          aria-label="Join the waitlist"
                          className="touch-target relative min-w-[110px] rounded-full bg-slate-900 px-5 py-3.5 text-sm font-medium whitespace-nowrap text-white shadow-lg transition-all hover:scale-105 hover:bg-black active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 sm:min-w-[130px] sm:px-6 sm:py-3"
                        >
                          <span className={status === 'loading' ? 'opacity-0' : 'opacity-100'}>
                            Join Waitlist
                          </span>
                          {status === 'loading' && (
                            <div className="absolute inset-0 flex items-center justify-center">
                              <Loader2 className="h-5 w-5 animate-spin" />
                            </div>
                          )}
                        </button>
                      </div>
                      {/* Turnstile widget - positioned absolutely to not affect layout or capture focus */}
                      <div className="pointer-events-none absolute inset-0 -z-10">
                        <TurnstileWidget
                          ref={widgetRef}
                          siteKey={siteKey}
                          onSuccess={handleTurnstileSuccess}
                          onError={handleTurnstileError}
                          onExpire={handleTurnstileExpire}
                          theme="dark"
                        />
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>

              {/* Privacy note - always visible */}
              <p className="mt-6 text-xs text-blue-200/60">
                By joining, you agree to our{' '}
                <a href="/privacy" className="underline transition-colors hover:text-blue-200/80">
                  Privacy Policy
                </a>
              </p>
            </motion.div>

            {/* Footer sticks to bottom of this sticky container - BLENDED WITH GRADIENT */}
            <motion.div
              ref={footerRef}
              style={{
                opacity: footerOpacity,
                paddingBottom: 'max(2rem, env(safe-area-inset-bottom))',
              }}
              className="pointer-events-auto absolute bottom-0 w-full bg-gradient-to-t from-black via-black/90 to-transparent pt-32"
            >
              <FooterReact darkMode={true} />
            </motion.div>
          </div>
        </div>
      </section>
    </>
  );
};

export default EarlyAccess;
