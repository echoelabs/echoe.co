import React, { useRef, useState, useEffect } from 'react';
import {
  LazyMotion,
  domAnimation,
  m,
  useScroll,
  useTransform,
  useMotionValue,
} from 'framer-motion';
import {
  Check,
  MessageCircle,
  DollarSign,
  AlertCircle,
  Star,
  Package,
  Truck,
  Activity,
} from 'lucide-react';
import { trackButtonClick } from '../services/analytics';

// Notification Types Definition
interface NotificationItem {
  icon: React.ReactNode;
  text: string;
  colorClass: string;
  iconBgClass: string;
}

// Position Definition
interface Position {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  rotation: number;
}

const TYPEWRITER_SENTENCES = [
  'Manage your entire business from one intelligent stream.',
  'Turn social conversations into conversions instantly.',
  'Inventory, orders, and support, unified at last.',
  'The operating system for the next generation of commerce.',
] as const;

const TypewriterHeadline = () => {
  const [text, setText] = useState('');
  const [sentenceIndex, setSentenceIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [delta, setDelta] = useState(50);

  useEffect(() => {
    const ticker = setTimeout(() => {
      const currentSentence = TYPEWRITER_SENTENCES[sentenceIndex];

      if (isDeleting) {
        setText(currentSentence.substring(0, text.length - 1));
        setDelta(10); // Super fast deletion
      } else {
        setText(currentSentence.substring(0, text.length + 1));
        setDelta(5 + Math.random() * 10); // Ultra Fast typing (5-15ms)
      }

      if (!isDeleting && text === currentSentence) {
        setDelta(1500); // Wait 1.5s before deleting
        setIsDeleting(true);
      } else if (isDeleting && text === '') {
        setIsDeleting(false);
        setSentenceIndex((prev) => (prev + 1) % TYPEWRITER_SENTENCES.length);
        setDelta(200); // Brief pause before typing next
      }
    }, delta);

    return () => clearTimeout(ticker);
  }, [text, isDeleting, delta, sentenceIndex]);

  return (
    <div className="mx-auto flex min-h-[3.5rem] max-w-lg items-center justify-center px-4 text-sm font-normal text-slate-500 sm:min-h-[4rem] sm:max-w-xl sm:text-base md:min-h-[5rem] md:text-lg">
      <span className="text-center">
        {text}
        <span className="ml-0.5 inline-block h-5 animate-pulse border-r-2 border-slate-400 align-middle"></span>
      </span>
    </div>
  );
};

const Hero: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // iOS detection for scroll animation optimization
  const [isIOS, setIsIOS] = useState(false);

  useEffect(() => {
    setIsIOS(/iPad|iPhone|iPod/.test(navigator.userAgent));
  }, []);

  // Title Sets - pick random one on client only to avoid hydration mismatch
  const titleSets = [
    {
      t1: ['Simplify Your', 'Commerce.'],
      t2: ['Manage', 'Everything.'],
    },
    {
      t1: ['From Chaos', 'To Clarity.'],
      t2: ['Business', 'Unified.'],
    },
    {
      t1: ['Your Store', 'On Autopilot.'],
      t2: ['Sell', 'Everywhere.'],
    },
    {
      t1: ['One Stream', 'For All.'],
      t2: ['Focus', 'On Creation.'],
    },
  ];
  const [titles, setTitles] = useState(titleSets[0]);

  useEffect(() => {
    setTitles(titleSets[Math.floor(Math.random() * titleSets.length)]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Randomize Notifications & Positions on Mount
  const [activeBubbles, setActiveBubbles] = useState<
    {
      item: NotificationItem;
      pos: Position;
      tabletPos: Position | null;
      group: 'group1' | 'group2';
    }[]
  >([]);

  useEffect(() => {
    const pool: NotificationItem[] = [
      {
        icon: <Check className="h-4 w-4" />,
        text: 'Order #2940 Shipped',
        colorClass: 'text-green-600',
        iconBgClass: 'bg-green-100',
      },
      {
        icon: <MessageCircle className="h-4 w-4" />,
        text: 'New message from Sarah',
        colorClass: 'text-blue-600',
        iconBgClass: 'bg-blue-100',
      },
      {
        icon: <DollarSign className="h-4 w-4" />,
        text: 'Payment $120.00 Received',
        colorClass: 'text-indigo-600',
        iconBgClass: 'bg-indigo-100',
      },
      {
        icon: <AlertCircle className="h-4 w-4" />,
        text: 'Low Stock: White Vase',
        colorClass: 'text-amber-600',
        iconBgClass: 'bg-amber-100',
      },
      {
        icon: <Star className="h-4 w-4 fill-current" />,
        text: 'New 5-star Review',
        colorClass: 'text-purple-600',
        iconBgClass: 'bg-purple-100',
      },
      {
        icon: <Package className="h-4 w-4" />,
        text: 'Inventory Synced',
        colorClass: 'text-teal-600',
        iconBgClass: 'bg-teal-100',
      },
      {
        icon: <Truck className="h-4 w-4" />,
        text: 'Label Generated',
        colorClass: 'text-slate-600',
        iconBgClass: 'bg-slate-100',
      },
      {
        icon: <Activity className="h-4 w-4" />,
        text: 'Traffic Spike detected',
        colorClass: 'text-rose-600',
        iconBgClass: 'bg-rose-100',
      },
    ];

    // Desktop Safe Zones (lg: 1024px+) - 6 positions spread around edges
    const desktopZones: Position[] = [
      { top: '28%', left: '12%', rotation: -4 }, // Upper Left
      { top: '32%', right: '10%', rotation: 5 }, // Upper Right
      { top: '45%', left: '8%', rotation: -2 }, // Mid Left
      { top: '42%', right: '8%', rotation: 3 }, // Mid Right
      { bottom: '28%', left: '12%', rotation: -5 }, // Lower Left
      { bottom: '25%', right: '10%', rotation: 4 }, // Lower Right
    ];

    // Tablet Safe Zones (md: 768-1024px) - within the content band (below badge, above buttons)
    const tabletZones: Position[] = [
      { top: '32%', left: '3%', rotation: -3 }, // Left side, title level
      { top: '35%', right: '3%', rotation: 4 }, // Right side, title level
      { top: '50%', left: '4%', rotation: -2 }, // Left side, mid level
    ];

    // Shuffle Function
    const shuffle = <T,>(array: T[]): T[] => array.sort(() => Math.random() - 0.5);

    const shuffledItems = shuffle([...pool]);
    const shuffledDesktopZones = shuffle([...desktopZones]);
    const shuffledTabletZones = shuffle([...tabletZones]);

    // Pick 6 bubbles for desktop, first 3 will also be used for tablet
    const count = 6;
    const selected = shuffledDesktopZones.slice(0, count).map((pos: Position, i: number) => ({
      pos,
      tabletPos: i < 3 ? shuffledTabletZones[i] : null, // Only first 3 get tablet positions
      item: shuffledItems[i],
      // Group 1 appears early, Group 2 appears later
      group: i < 3 ? ('group1' as const) : ('group2' as const),
    }));

    setActiveBubbles(selected);
  }, []);

  // Track scroll progress relative to section (0 to 1)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // STICKY SCROLL LOGIC - Based on scroll progress (0-1) instead of absolute pixels
  // Title 1 fades out from 0% to 60% of scroll
  const title1Opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const title1Scale = useTransform(scrollYProgress, [0, 0.6], isIOS ? [1, 1] : [1, 0.9]);
  const title1Y = useTransform(scrollYProgress, [0, 0.6], [0, -50]);

  // Title 2 fades in from 40% to 100% of scroll
  const title2Opacity = useTransform(scrollYProgress, [0.4, 1], [0, 1]);
  const title2Scale = useTransform(scrollYProgress, [0.4, 1], isIOS ? [1, 1] : [1.1, 1]);
  const title2Y = useTransform(scrollYProgress, [0.4, 1], [50, 0]);

  // Bubble Visibility Logic - Group 1 appears early, Group 2 appears mid-scroll
  const group1Opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);
  const group2Opacity = useTransform(scrollYProgress, [0.3, 0.6], [0, 1]);
  const bubbleY = useTransform(scrollYProgress, [0, 1], [0, -100]);

  // Interactive Mouse Effect
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    mouseX.set(clientX / innerWidth);
    mouseY.set(clientY / innerHeight);
  };

  // Canvas Animation Effect (Distorted Grid Mesh Ripple)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let animationFrameId: number;

    // Mouse tracking for canvas
    const mouseRef = { x: -1000, y: -1000 };
    const lastSpawn = { x: -1000, y: -1000, time: 0 };
    let stopTimer: NodeJS.Timeout;
    let movementIntensity = 0; // 0 to 1, fades out when static

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = width;
      canvas.height = height;
    };

    // Configuration - Adjust grid spacing for performance
    const isMobile = window.innerWidth < 640;
    const GRID_SPACING = isMobile ? 30 : 25; // Larger grid = fewer lines = better performance
    const MAX_RIPPLES = 60;
    const DRAG_SPAWN_DIST = 10; // Frequent for smooth stream

    interface Ripple {
      x: number;
      y: number;
      r: number; // Current radius
      maxR: number; // Max radius before death
      strength: number; // Amplitude of distortion
      speed: number; // Expansion speed
      life: number; // 0 to 1
      type: 'drag' | 'stop'; // Track type for different physics
    }

    const ripples: Ripple[] = [];

    const spawnRipple = (x: number, y: number, type: 'drag' | 'stop') => {
      if (ripples.length >= MAX_RIPPLES) ripples.shift();

      if (type === 'drag') {
        ripples.push({
          x,
          y,
          r: 0,
          maxR: 200 + Math.random() * 50,
          strength: 1.5, // Slightly reduced for smoother blend
          speed: 2.5,
          life: 0.7,
          type: 'drag',
        });
      } else {
        // STOP RIPPLE SEQUENCE
        // Subtle ripples for all browsers (performance optimization)
        const stopRippleDelays = [0, 150, 300];
        stopRippleDelays.forEach((delay, i) => {
          setTimeout(() => {
            ripples.push({
              x,
              y,
              r: 0,
              maxR: 400 + i * 40, // Reduced from 600+
              strength: 2.5 - i * 0.4, // Reduced from 4.0
              speed: 3.5,
              life: 1.0, // Reduced from 1.5
              type: 'stop',
            });
          }, delay);
        });
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.x = e.clientX;
      mouseRef.y = e.clientY;
      movementIntensity = 1; // Reset intensity on move

      // Stop Detection
      clearTimeout(stopTimer);
      stopTimer = setTimeout(() => {
        if (mouseRef.x > 0) {
          spawnRipple(mouseRef.x, mouseRef.y, 'stop');
        }
      }, 80);
    };

    const onMouseLeave = () => {
      mouseRef.x = -1000;
      mouseRef.y = -1000;
      movementIntensity = 0;
      clearTimeout(stopTimer);
    };

    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove);
    window.addEventListener('mouseleave', onMouseLeave);
    resize();

    const draw = (time: number) => {
      if (!ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, width, height);

      // Decay movement intensity
      movementIntensity = Math.max(0, movementIntensity - 0.02);

      // --- 1. Spawn Ripples on Mouse Move (DRAG) ---
      const dx = mouseRef.x - lastSpawn.x;
      const dy = mouseRef.y - lastSpawn.y;
      const distMoved = Math.sqrt(dx * dx + dy * dy);

      if (distMoved > DRAG_SPAWN_DIST) {
        spawnRipple(mouseRef.x, mouseRef.y, 'drag');
        lastSpawn.x = mouseRef.x;
        lastSpawn.y = mouseRef.y;
        lastSpawn.time = time;
      }

      // --- 2. Update Ripples ---
      for (let i = ripples.length - 1; i >= 0; i--) {
        const r = ripples[i];
        r.r += r.speed;

        if (r.type === 'drag') {
          r.strength *= 0.94; // Fast decay for drag to avoid mess
          r.life -= 0.015;
        } else {
          r.strength *= 0.98; // Slow decay for stop ripples
          r.life -= 0.008;
        }

        // Remove dead ripples
        if (r.life <= 0 || r.r > r.maxR) {
          ripples.splice(i, 1);
        }
      }

      // --- 3. Draw Distorted Grid ---
      const getPointInfo = (x: number, y: number) => {
        let dx = 0;
        let dy = 0;
        let rippleInfluence = 0;

        // --- SPHERICAL LENS DISTORTION (Cursor) ---
        // This creates the "looking at a sphere" effect
        const distToCursor = Math.sqrt((x - mouseRef.x) ** 2 + (y - mouseRef.y) ** 2);
        const lensRadius = 150; // Reduced from 400 for smaller ball

        if (distToCursor < lensRadius && movementIntensity > 0) {
          // Calculate spherical distortion
          // Points are pushed OUTWARD from the cursor to simulate a magnifying lens / sphere
          const amount = 1 - Math.pow(distToCursor / lensRadius, 2); // Quadratic falloff
          const distortion = amount * 15 * movementIntensity; // Apply movement intensity

          const ux = (x - mouseRef.x) / distToCursor;
          const uy = (y - mouseRef.y) / distToCursor;

          dx += ux * distortion;
          dy += uy * distortion;
        }

        // --- RIPPLE DISTORTION ---
        // Calculate ripple displacement and influence
        for (const rip of ripples) {
          const vx = x - rip.x;
          const vy = y - rip.y;
          const dist = Math.sqrt(vx * vx + vy * vy);

          // Physics based on type
          let zHeight = 0;

          if (rip.type === 'drag') {
            // FISH EYE / SMOOTH WAKE
            // Instead of a wave, we use a smooth Gaussian-like bulge
            const influenceRadius = 120;
            const distFromCenter = dist; // From ripple center

            if (distFromCenter < influenceRadius) {
              // Smooth bell curve (0 to 1 to 0)
              const t = distFromCenter / influenceRadius;
              const envelope = (1 - t * t) * (1 - t * t); // Quartic falloff (very smooth)
              zHeight = envelope * rip.strength;
            }
          } else {
            // CLASSIC RIPPLE (Wave)
            const distFromWave = dist - rip.r;
            const WAVE_WIDTH = 100;
            if (Math.abs(distFromWave) < WAVE_WIDTH) {
              const t = distFromWave / WAVE_WIDTH;
              const packetEnvelope = Math.max(0, 1 - Math.abs(t));
              zHeight = Math.cos(t * 2 * Math.PI) * packetEnvelope * rip.strength;
            }
          }

          if (zHeight !== 0) {
            const ux = vx / (dist || 1);
            const uy = vy / (dist || 1);

            dx += ux * zHeight * 10;
            dy += uy * zHeight * 10;

            rippleInfluence += Math.abs(zHeight) * Math.min(1, rip.life);
          }
        }

        // Cursor Flashlight Influence (Fades with movement)
        const cursorInfluence = Math.max(0, 1 - distToCursor / 350) * movementIntensity;

        // Total Visibility (Alpha)
        // Grid is visible if near cursor OR affected by ripple
        let alpha = Math.max(cursorInfluence * 0.6, rippleInfluence * 1.5);
        alpha = Math.min(1, alpha); // Clamp

        return { x: x + dx, y: y + dy, alpha };
      };

      ctx.lineWidth = 1;

      // Batch segments by alpha for better performance
      interface Segment {
        p1: { x: number; y: number };
        p2: { x: number; y: number };
        alpha: number;
      }

      const segments: Segment[] = [];

      // Collect Horizontal Lines
      for (let y = 0; y <= height + GRID_SPACING; y += GRID_SPACING) {
        let p1 = getPointInfo(0, y);
        for (let x = GRID_SPACING; x <= width + GRID_SPACING; x += GRID_SPACING) {
          const p2 = getPointInfo(x, y);
          const avgAlpha = (p1.alpha + p2.alpha) / 2;
          if (avgAlpha >= 0.02) {
            segments.push({
              p1: { x: p1.x, y: p1.y },
              p2: { x: p2.x, y: p2.y },
              alpha: avgAlpha,
            });
          }
          p1 = p2;
        }
      }

      // Collect Vertical Lines
      for (let x = 0; x <= width + GRID_SPACING; x += GRID_SPACING) {
        let p1 = getPointInfo(x, 0);
        for (let y = GRID_SPACING; y <= height + GRID_SPACING; y += GRID_SPACING) {
          const p2 = getPointInfo(x, y);
          const avgAlpha = (p1.alpha + p2.alpha) / 2;
          if (avgAlpha >= 0.02) {
            segments.push({
              p1: { x: p1.x, y: p1.y },
              p2: { x: p2.x, y: p2.y },
              alpha: avgAlpha,
            });
          }
          p1 = p2;
        }
      }

      // Group segments by alpha (rounded to reduce groups)
      const segmentsByAlpha = new Map<number, Segment[]>();
      for (const seg of segments) {
        const alphaKey = Math.round(seg.alpha * 20) / 20; // Round to 0.05 increments
        const existing = segmentsByAlpha.get(alphaKey);
        if (existing) {
          existing.push(seg);
        } else {
          segmentsByAlpha.set(alphaKey, [seg]);
        }
      }

      // Draw all segments with same alpha in one batch
      for (const [alpha, segs] of segmentsByAlpha) {
        ctx.strokeStyle = `rgba(15, 23, 42, ${alpha * 0.25})`;
        ctx.beginPath();
        for (const seg of segs) {
          ctx.moveTo(seg.p1.x, seg.p1.y);
          ctx.lineTo(seg.p2.x, seg.p2.y);
        }
        ctx.stroke();
      }

      animationFrameId = requestAnimationFrame(() => draw(Date.now()));
    };

    draw(Date.now());

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mouseleave', onMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <LazyMotion features={domAnimation}>
      <div
        ref={containerRef}
        className="relative h-[150vh] bg-white sm:h-[200vh] lg:h-[250vh]"
        style={{ position: 'relative' }}
        onMouseMove={handleMouseMove}
      >
        <div className="sticky top-0 flex h-dvh w-full flex-col items-center justify-center overflow-hidden">
          {/* --- Content Wrapper (Standard Sticky) --- */}
          <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden bg-white shadow-none">
            {/* --- Canvas Background --- */}
            <canvas
              ref={canvasRef}
              className="pointer-events-none absolute inset-0 z-0"
              aria-hidden="true"
              role="presentation"
            />

            {/* --- Fade Out Gradient at Bottom - Reduced to 30vh to show more grid --- */}
            <div className="pointer-events-none absolute right-0 bottom-0 left-0 z-20 h-[30vh] bg-gradient-to-t from-white via-white/80 to-transparent" />

            {/* --- Content Layer --- */}
            {/* Z-INDEX INCREASED TO 30 TO SIT ABOVE THE FADE GRADIENT */}
            <div className="relative z-30 mx-auto flex w-full max-w-6xl flex-col items-center justify-center px-6 text-center">
              {/* Badge */}
              <m.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-2.5 py-1 shadow-sm backdrop-blur-md sm:px-3"
              >
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-blue-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-blue-500"></span>
                </span>
                <span className="text-xs font-medium tracking-wider text-slate-600 uppercase">
                  Early Access 2026
                </span>
              </m.div>

              {/* Dynamic Titles Wrapper */}
              <div className="perspective-1000 relative flex h-[140px] w-full items-center justify-center sm:h-[180px] md:h-[280px]">
                {/* Title 1 */}
                <m.div
                  style={{ opacity: title1Opacity, scale: title1Scale, y: title1Y }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <h1 className="font-display text-3xl leading-tight font-semibold tracking-tight text-slate-900 sm:text-4xl md:text-5xl lg:text-6xl">
                    {titles.t1[0]}
                    <br />
                    {titles.t1[1]}
                  </h1>
                </m.div>

                {/* Title 2 */}
                <m.div
                  style={{ opacity: title2Opacity, scale: title2Scale, y: title2Y }}
                  className="absolute inset-0 flex items-center justify-center"
                >
                  <h1 className="font-display text-3xl leading-tight font-semibold tracking-tight text-slate-900 sm:text-4xl md:text-5xl lg:text-6xl">
                    {titles.t2[0]}
                    <br />
                    {titles.t2[1]}
                  </h1>
                </m.div>
              </div>

              {/* Subtitle & CTA */}
              <m.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="mt-6 flex w-full flex-col items-center"
              >
                {/* Typewriter Subheadline */}
                <div className="mb-8 min-h-[5rem] w-full">
                  <TypewriterHeadline />
                </div>

                <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                  <button
                    onClick={() => {
                      trackButtonClick('join_waitlist', 'hero');
                      document
                        .getElementById('early-access')
                        ?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="touch-target rounded-full bg-slate-900 px-5 py-3 text-xs font-medium text-white shadow-lg shadow-slate-900/20 transition-all hover:scale-105 hover:bg-slate-800 active:scale-95 sm:px-6"
                  >
                    Join Waitlist
                  </button>
                  <button
                    onClick={() => {
                      trackButtonClick('see_simulation', 'hero');
                      const el = document.getElementById('simulation-window');
                      if (el) {
                        const headerOffset = 80;
                        const elementPosition = el.getBoundingClientRect().top + window.scrollY;
                        window.scrollTo({
                          top: elementPosition - headerOffset,
                          behavior: 'smooth',
                        });
                      }
                    }}
                    className="touch-target rounded-full border border-slate-200 bg-white px-5 py-3 text-xs font-medium text-slate-600 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50 active:scale-95 sm:px-6"
                  >
                    See Simulation
                  </button>
                </div>
              </m.div>
            </div>

            {/* --- Desktop Floating Notifications (lg: 1024px+) - 6 tags --- */}
            {activeBubbles.map((bubble, index) => (
              <m.div
                key={`desktop-${index}`}
                style={{
                  opacity: bubble.group === 'group1' ? group1Opacity : group2Opacity,
                  y: bubbleY,
                  ...bubble.pos,
                }}
                className="absolute z-20 hidden rounded-2xl border border-slate-200/50 bg-white/90 px-4 py-3 shadow-xl shadow-slate-200/30 backdrop-blur-xl transition-transform duration-700 will-change-transform lg:block"
                initial={{ scale: 0.8 }}
                animate={{ scale: 1, rotate: bubble.pos.rotation }}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-full ${bubble.item.iconBgClass} ${bubble.item.colorClass}`}
                  >
                    {bubble.item.icon}
                  </div>
                  <div className="text-xs font-medium whitespace-nowrap text-slate-700">
                    {bubble.item.text}
                  </div>
                </div>
              </m.div>
            ))}

            {/* --- Tablet Floating Notifications (md: 768-1024px) - 3 compact tags at corners --- */}
            {activeBubbles
              .filter((bubble) => bubble.tabletPos !== null)
              .map((bubble, index) => (
                <m.div
                  key={`tablet-${index}`}
                  style={{
                    opacity: group1Opacity,
                    y: bubbleY,
                    ...bubble.tabletPos,
                  }}
                  className="absolute z-20 hidden rounded-lg border border-slate-200/50 bg-white/90 px-2 py-1.5 shadow-lg shadow-slate-200/20 backdrop-blur-xl transition-transform duration-700 will-change-transform md:block lg:hidden"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1, rotate: bubble.tabletPos?.rotation || 0 }}
                >
                  <div className="flex items-center gap-1.5">
                    <div
                      className={`flex h-5 w-5 items-center justify-center rounded-full ${bubble.item.iconBgClass} ${bubble.item.colorClass} [&>svg]:h-2.5 [&>svg]:w-2.5`}
                    >
                      {bubble.item.icon}
                    </div>
                    <div className="text-[9px] font-medium whitespace-nowrap text-slate-700">
                      {bubble.item.text}
                    </div>
                  </div>
                </m.div>
              ))}
          </div>

          {/* Scroll Indicator */}
          <m.div
            style={{ opacity: useTransform(scrollYProgress, [0, 0.1], [1, 0]) }}
            className="pointer-events-none absolute bottom-8 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-2"
          >
            <div className="h-10 w-[1px] bg-gradient-to-b from-slate-300 to-transparent" />
            <span className="text-[10px] font-medium tracking-wide text-slate-400 uppercase">
              Scroll
            </span>
          </m.div>
        </div>
      </div>
    </LazyMotion>
  );
};

export default Hero;
