import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion';
import {
  MessageSquare,
  Package,
  Box,
  Bot,
  Globe,
  TrendingUp,
  ArrowRight,
  Check,
  Sparkles,
} from 'lucide-react';

// --- DYNAMIC CONTENT COMPONENTS ---

const UnifiedChatVisual = () => {
  return (
    <div className="flex h-full w-full flex-col justify-center gap-4">
      {/* Platform indicators */}
      <div className="mb-2 flex gap-2">
        <span className="rounded-full bg-pink-100 px-2 py-1 text-xs font-medium text-pink-600">
          Platform A
        </span>
        <span className="rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-600">
          Platform B
        </span>
        <span className="rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-600">
          Platform C
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-[75%] self-start rounded-2xl rounded-tl-none bg-slate-100 px-5 py-3 text-sm text-slate-700"
      >
        <span className="mb-1 block text-xs text-slate-400">@sarah_m via Platform A</span>
        Is this item in stock? I need it for a gift!
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.6 }}
        className="max-w-[75%] self-end rounded-2xl rounded-tr-none bg-slate-900 px-5 py-3 text-sm text-white"
      >
        Yes! We have 3 left in Red and 5 in White. Want me to reserve one for you?
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.0 }}
        className="max-w-[75%] self-start rounded-2xl rounded-tl-none bg-slate-100 px-5 py-3 text-sm text-slate-700"
      >
        Red please! Can you ship to Bangkok?
      </motion.div>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.4 }}
        className="max-w-[75%] self-end rounded-2xl rounded-tr-none bg-slate-900 px-5 py-3 text-sm text-white"
      >
        Absolutely! Shipping is 50 THB. I'll create your order now.
      </motion.div>
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.8 }}
        className="mt-2 flex items-center gap-2 self-center rounded-full bg-emerald-50 px-4 py-2 text-xs font-medium text-emerald-600"
      >
        <Check className="h-3 w-3" /> Order #2930 Created
      </motion.div>
    </div>
  );
};

const OrderCentralVisual = () => {
  const orders = [
    {
      id: 4091,
      customer: 'Sarah M.',
      items: 2,
      total: '฿1,450',
      status: 'Processing',
      statusColor: 'blue',
      time: 'Just now',
    },
    {
      id: 4090,
      customer: 'Mike T.',
      items: 1,
      total: '฿890',
      status: 'Shipped',
      statusColor: 'emerald',
      time: '5 min ago',
    },
    {
      id: 4089,
      customer: 'Lisa K.',
      items: 3,
      total: '฿2,340',
      status: 'Processing',
      statusColor: 'blue',
      time: '12 min ago',
    },
    {
      id: 4088,
      customer: 'John D.',
      items: 1,
      total: '฿650',
      status: 'Packed',
      statusColor: 'amber',
      time: '18 min ago',
    },
    {
      id: 4087,
      customer: 'Amy W.',
      items: 4,
      total: '฿3,200',
      status: 'Delivered',
      statusColor: 'slate',
      time: '1 hour ago',
    },
  ];

  return (
    <div className="flex h-full w-full flex-col gap-3 overflow-hidden">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-700">Today's Orders</span>
        <span className="text-xs text-slate-400">12 total</span>
      </div>
      {orders.map((order, i) => (
        <motion.div
          key={order.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.15 }}
          className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4 shadow-sm transition-shadow hover:shadow-lg"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100">
              <Package className="h-5 w-5 text-slate-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-900">
                #{order.id} · {order.customer}
              </span>
              <span className="text-xs text-slate-400">
                {order.items} items · {order.total} · {order.time}
              </span>
            </div>
          </div>
          <span
            className={`rounded-full px-3 py-1.5 text-xs font-medium bg-${order.statusColor}-50 text-${order.statusColor}-600`}
          >
            {order.status}
          </span>
        </motion.div>
      ))}
    </div>
  );
};

const InventoryVisual = () => {
  const products = [
    { name: 'Minimal Vase', sku: 'MV-001', stock: 4, max: 50, status: 'Low' },
    { name: 'Linen Throw', sku: 'LT-002', stock: 18, max: 30, status: 'OK' },
    { name: 'Soy Candle', sku: 'SC-003', stock: 42, max: 100, status: 'OK' },
    { name: 'Matte Plate', sku: 'MP-004', stock: 0, max: 25, status: 'Out' },
    { name: 'Oak Shelf', sku: 'OS-005', stock: 8, max: 20, status: 'Low' },
  ];

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-700">Stock Levels</span>
        <span className="rounded-full bg-amber-50 px-2 py-1 text-xs text-amber-600">2 alerts</span>
      </div>
      {products.map((product, i) => (
        <motion.div
          key={product.sku}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex flex-col gap-2"
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-slate-800">{product.name}</span>
              <span className="ml-2 text-xs text-slate-400">{product.sku}</span>
            </div>
            <span
              className={`text-xs font-semibold ${product.status === 'Out' ? 'text-red-500' : product.status === 'Low' ? 'text-amber-500' : 'text-emerald-500'}`}
            >
              {product.stock}/{product.max}
            </span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${(product.stock / product.max) * 100}%` }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className={`h-full rounded-full ${product.status === 'Out' ? 'bg-red-400' : product.status === 'Low' ? 'bg-amber-400' : 'bg-emerald-400'}`}
            />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

const AIAutopilotVisual = () => {
  const [text, setText] = useState('');
  const fullText =
    'Hi! Thanks for reaching out. Yes, the Minimal Vase is available in both White and Terracotta. Would you like me to create an order for you?';

  useEffect(() => {
    let i = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, i + 1));
      i++;
      if (i > fullText.length) {
        setTimeout(() => {
          i = 0;
          setText('');
        }, 2000);
      }
    }, 30);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-100">
            <Sparkles className="h-4 w-4 text-indigo-600" />
          </div>
          <span className="text-xs font-semibold text-slate-700">AI Autopilot</span>
        </div>
        <span className="rounded-full bg-emerald-50 px-2 py-1 text-xs text-emerald-600">
          Active
        </span>
      </div>

      {/* Customer message */}
      <div className="max-w-[85%] rounded-2xl rounded-tl-none bg-slate-100 p-4">
        <span className="mb-1 block text-xs text-slate-400">Customer inquiry</span>
        <p className="text-sm text-slate-700">
          Do you have the Minimal Vase in stock? What colors?
        </p>
      </div>

      {/* AI drafting */}
      <div className="max-w-[85%] self-end rounded-2xl rounded-tr-none border border-indigo-100 bg-indigo-50 p-4">
        <div className="mb-2 flex items-center gap-2">
          <Sparkles className="h-3 w-3 text-indigo-500" />
          <span className="text-xs font-medium text-indigo-600">AI-generated reply</span>
        </div>
        <p className="min-h-[60px] text-sm text-slate-700">
          {text}
          <span className="animate-pulse text-indigo-400">|</span>
        </p>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2 self-end">
        <button className="rounded-full border border-slate-200 px-3 py-1.5 text-xs text-slate-500 hover:bg-slate-50">
          Edit
        </button>
        <button className="rounded-full bg-indigo-600 px-3 py-1.5 text-xs text-white hover:bg-indigo-700">
          Send
        </button>
      </div>
    </div>
  );
};

const MarketIntelVisual = () => {
  const trends = [
    { label: 'Minimal Home Decor', change: '+24%', trend: 'up', volume: '12.4K searches' },
    { label: 'Ceramic Vases', change: '+18%', trend: 'up', volume: '8.2K searches' },
    { label: 'Linen Textiles', change: '+12%', trend: 'up', volume: '6.8K searches' },
    { label: 'Scented Candles', change: '-3%', trend: 'down', volume: '15.1K searches' },
  ];

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-700">Trending in Your Category</span>
        <span className="text-xs text-slate-400">Last 7 days</span>
      </div>

      {trends.map((trend, i) => (
        <motion.div
          key={trend.label}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.1 }}
          className="flex items-center justify-between rounded-2xl border border-slate-100 bg-white p-4"
        >
          <div className="flex flex-col">
            <span className="text-xs font-medium text-slate-800">{trend.label}</span>
            <span className="text-xs text-slate-400">{trend.volume}</span>
          </div>
          <span
            className={`text-xs font-semibold ${trend.trend === 'up' ? 'text-emerald-500' : 'text-red-500'}`}
          >
            {trend.change}
          </span>
        </motion.div>
      ))}

      <div className="mt-auto border-t border-slate-100 pt-4">
        <div className="flex items-center gap-2 text-xs text-indigo-600">
          <ArrowRight className="h-3 w-3" />
          <span>View full market report</span>
        </div>
      </div>
    </div>
  );
};

const CompetitorWatchVisual = () => {
  const competitors = [
    { name: 'Your Store', price: '฿450', change: null, isYou: true },
    { name: 'HomeStyle Co.', price: '฿480', change: '+฿30', changeType: 'up' },
    { name: 'Modern Living', price: '฿420', change: '-฿15', changeType: 'down' },
    { name: 'Decor Plus', price: '฿465', change: null, changeType: null },
  ];

  return (
    <div className="flex h-full w-full flex-col gap-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-700">Price Comparison</span>
        <span className="text-xs text-slate-400">Minimal Vase</span>
      </div>

      <div className="mb-2 rounded-2xl border border-amber-200 bg-amber-50 p-3">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 animate-pulse rounded-full bg-amber-500" />
          <span className="text-xs font-medium text-amber-700">
            Modern Living dropped price by ฿15
          </span>
        </div>
      </div>

      {competitors.map((comp, i) => (
        <motion.div
          key={comp.name}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }}
          className={`flex items-center justify-between rounded-2xl border p-4 ${comp.isYou ? 'border-indigo-200 bg-indigo-50' : 'border-slate-100 bg-white'}`}
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${comp.isYou ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-500'}`}
            >
              {comp.name.charAt(0)}
            </div>
            <span
              className={`text-xs font-medium ${comp.isYou ? 'text-indigo-700' : 'text-slate-700'}`}
            >
              {comp.name}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-slate-900">{comp.price}</span>
            {comp.change && (
              <span
                className={`text-xs ${comp.changeType === 'down' ? 'text-red-500' : 'text-emerald-500'}`}
              >
                {comp.change}
              </span>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

// --- MAIN COMPONENT ---

const Features: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState<number>(0);
  const [dimensions, setDimensions] = useState({
    sectionHeight: '160vh', // fallback for SSR
    scrollPerCard: 120, // fallback
  });
  const containerRef = useRef<HTMLElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [tuple, setTuple] = useState([0, activeIndex]); // [prev, current]

  if (tuple[1] !== activeIndex) {
    setTuple([tuple[1], activeIndex]);
  }

  const direction = tuple[1] > tuple[0] ? 1 : -1;

  const variants = {
    enter: (direction: number) => ({
      y: direction > 0 ? 50 : -50,
      opacity: 0,
      scale: 0.95,
    }),
    center: {
      zIndex: 1,
      y: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      y: direction < 0 ? 50 : -50,
      opacity: 0,
      scale: 0.95,
    }),
  };

  const featureIds = useMemo(
    () => ['chat', 'order', 'inventory', 'ai', 'market', 'competitor'],
    []
  );

  const numCards = featureIds.length;
  const headerHeight = 56; // 3.5rem in pixels

  // Calculate dimensions on mount
  useEffect(() => {
    const calculate = () => {
      const vh = window.innerHeight;
      const isMobile = window.innerWidth < 1024; // lg breakpoint

      const stickyHeight = vh - headerHeight;
      // Use smaller scroll-per-card on mobile for tighter experience
      const scrollPerCard = isMobile ? vh * 0.1 : vh * 0.18;
      const sectionHeight = stickyHeight + (numCards - 1) * scrollPerCard + headerHeight;

      setDimensions({
        sectionHeight: `${sectionHeight}px`,
        scrollPerCard,
      });
    };

    calculate();
    window.addEventListener('resize', calculate);
    return () => window.removeEventListener('resize', calculate);
  }, [numCards]);

  // Scroll-based card switching
  useEffect(() => {
    const handleScroll = () => {
      const section = containerRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const sectionTop = rect.top;

      // How far past the header is the section top? (negative = scrolled past)
      const scrolledPast = headerHeight - sectionTop;

      if (scrolledPast < 0) {
        // Section hasn't reached header yet
        setActiveIndex(0);
        return;
      }

      // Calculate which card based on scroll distance
      const cardIndex = Math.floor(scrolledPast / dimensions.scrollPerCard);
      const clampedIndex = Math.max(0, Math.min(cardIndex, numCards - 1));
      setActiveIndex(clampedIndex);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial check
    return () => window.removeEventListener('scroll', handleScroll);
  }, [dimensions.scrollPerCard, numCards]);

  // Handle card click - scroll to card position
  const handleCardClick = (index: number) => {
    const section = containerRef.current;
    if (!section) return;

    // Calculate target scroll position for this card
    const sectionOffsetTop = section.offsetTop;
    const targetScroll = sectionOffsetTop - headerHeight + index * dimensions.scrollPerCard;

    // Use Lenis for smooth scroll if available
    const lenis = (
      window as unknown as {
        lenis?: { scrollTo: (target: number, options?: { duration?: number }) => void };
      }
    ).lenis;
    if (lenis) {
      lenis.scrollTo(targetScroll, { duration: 0.8 });
    } else {
      window.scrollTo({ top: targetScroll, behavior: 'smooth' });
    }
  };

  const activeId = featureIds[activeIndex];

  const handleMouseMove = (e: React.MouseEvent) => {
    const sticky = stickyRef.current;
    if (!sticky) return;
    const { left, top } = sticky.getBoundingClientRect();
    mouseX.set(e.clientX - left);
    mouseY.set(e.clientY - top);
  };

  const features = [
    {
      id: 'chat',
      title: 'Unified Chat',
      desc: 'All your social DMs in one place. Reply to all your channels from a single dashboard.',
      icon: <MessageSquare className="h-5 w-5" />,
      visual: <UnifiedChatVisual />,
    },
    {
      id: 'order',
      title: 'Order Central',
      desc: 'Process orders instantly. Sync status across all platforms and print labels with one click.',
      icon: <Package className="h-5 w-5" />,
      visual: <OrderCentralVisual />,
    },
    {
      id: 'inventory',
      title: 'Inventory Command',
      desc: 'Real-time stock sync. Never oversell again with automatic inventory updates across all channels.',
      icon: <Box className="h-5 w-5" />,
      visual: <InventoryVisual />,
    },
    {
      id: 'ai',
      title: 'AI Autopilot',
      desc: 'Draft replies automatically. Our AI learns your brand voice and suggests perfect responses.',
      icon: <Bot className="h-5 w-5" />,
      visual: <AIAutopilotVisual />,
    },
    {
      id: 'market',
      title: 'Market Intelligence',
      desc: 'Spot viral trends early. Analyze competitor data and market shifts in real-time.',
      icon: <Globe className="h-5 w-5" />,
      visual: <MarketIntelVisual />,
    },
    {
      id: 'competitor',
      title: 'Competitor Watch',
      desc: 'Track pricing moves. Get alerted when competitors change prices or launch new products.',
      icon: <TrendingUp className="h-5 w-5" />,
      visual: <CompetitorWatchVisual />,
    },
  ];

  return (
    <section
      id="features"
      ref={containerRef}
      onMouseMove={handleMouseMove}
      className="relative z-10 bg-white px-6 md:px-8 lg:px-24 xl:px-32"
      style={{ height: dimensions.sectionHeight }}
    >
      {/* Sticky content wrapper - Reduced vertical padding on mobile */}
      <div
        ref={stickyRef}
        className="sticky top-14 flex h-[calc(100dvh-3.5rem)] flex-col py-4 lg:py-8"
      >
        {/* --- BACKGROUND (bg color + dot grid) --- */}
        <div className="pointer-events-none absolute inset-y-0 -right-3 -left-3 bg-white sm:-right-4 sm:-left-4 md:-right-8 md:-left-8 lg:-right-16 lg:-left-16">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
              backgroundSize: '32px 32px',
              opacity: 0.3,
            }}
          />
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundImage: 'radial-gradient(#94a3b8 1.5px, transparent 1.5px)',
              backgroundSize: '32px 32px',
              WebkitMaskImage: useMotionValueTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, black, transparent)`,
              maskImage: useMotionValueTemplate`radial-gradient(300px circle at ${mouseX}px ${mouseY}px, black, transparent)`,
            }}
          />
        </div>

        <div className="relative z-10 mx-auto flex min-h-0 w-full max-w-[2200px] flex-1 flex-col pb-4 lg:pb-8">
          <div className="shrink-0 pb-3 text-center lg:pb-8">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="font-display mb-3 text-xl leading-tight font-semibold tracking-tight text-slate-900 sm:mb-6 sm:text-3xl md:text-4xl lg:text-5xl"
            >
              Command Center.
              <br />
              For Modern Commerce.
            </motion.h2>
          </div>

          <div className="grid min-h-0 flex-1 grid-cols-1 items-start gap-3 overflow-visible sm:gap-6 lg:grid-cols-12 lg:gap-8">
            {/* LEFT COLUMN: THE STREAM (Navigation) */}
            <div className="no-scrollbar flex h-full flex-col justify-start gap-2 overflow-y-auto py-1 sm:gap-3 sm:py-4 lg:col-span-5 lg:justify-start lg:gap-4">
              {features.map((feature, index) => {
                const isActive = activeId === feature.id;
                return (
                  <motion.div
                    key={feature.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05, duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
                    onClick={() => handleCardClick(index)}
                    whileHover={{ scale: isActive ? 1 : 1.01 }}
                    className={`relative cursor-pointer rounded-2xl border p-4 transition-all duration-300 ease-out sm:p-5 ${isActive ? 'border-slate-200 bg-white shadow-md' : 'border-slate-200/50 bg-white hover:shadow-sm'}`}
                  >
                    <motion.div
                      className="flex gap-3"
                      animate={{ alignItems: isActive ? 'flex-start' : 'center' }}
                      transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                    >
                      <motion.div
                        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-2xl sm:h-10 sm:w-10"
                        animate={{
                          backgroundColor: isActive ? '#4f46e5' : '#f1f5f9',
                          color: isActive ? '#ffffff' : '#64748b',
                          boxShadow: isActive
                            ? '0 10px 15px -3px rgba(79, 70, 229, 0.3)'
                            : '0 0 0 0 transparent',
                        }}
                        transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                      >
                        {feature.icon}
                      </motion.div>
                      <div className="flex-1">
                        <motion.h3
                          className="font-display text-sm font-semibold sm:text-base"
                          animate={{
                            color: isActive ? '#0f172a' : '#475569',
                            marginBottom: isActive ? 8 : 0,
                          }}
                          transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                        >
                          {feature.title}
                        </motion.h3>
                        <AnimatePresence initial={false}>
                          {isActive && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
                              className="overflow-hidden"
                            >
                              <p className="text-sm leading-relaxed text-slate-500">
                                {feature.desc}
                              </p>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>

            {/* RIGHT COLUMN: THE STAGE (Sticky Visual) - matches expanded list height */}
            <div className="relative hidden w-full lg:col-span-7 lg:block aspect-square xl:aspect-[5/4] max-h-[800px]">
              <div className="h-full w-full">
                <div className="relative h-full w-full overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-2xl ring-1 shadow-slate-200/50 ring-slate-100">
                  {/* Monitor Header / HUD */}
                  <div className="absolute top-0 right-0 left-0 z-20 flex h-10 items-center justify-between border-b border-slate-100 bg-slate-50/80 px-4 backdrop-blur-md">
                    <div className="flex gap-2">
                      <div className="h-3 w-3 rounded-full bg-slate-200" />
                      <div className="h-3 w-3 rounded-full bg-slate-200" />
                      <div className="h-3 w-3 rounded-full bg-slate-200" />
                    </div>
                    <div className="font-mono text-[10px] tracking-wider text-slate-400 uppercase">
                      System Active
                    </div>
                  </div>

                  {/* Visual Content Area - Added scroll handling for smaller screens */}
                  <div className="no-scrollbar absolute inset-0 overflow-y-auto bg-slate-50/30 pt-10 pb-4">
                    <AnimatePresence mode="popLayout" custom={direction}>
                      <motion.div
                        key={activeId}
                        custom={direction}
                        variants={variants}
                        initial="enter"
                        animate="center"
                        exit="exit"
                        transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
                        className="flex h-full w-full items-start justify-center p-4"
                      >
                        {features.find((f) => f.id === activeId)?.visual}
                      </motion.div>
                    </AnimatePresence>
                  </div>

                  {/* Scanline / Glare Overlay */}
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-50" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Disclaimer - only show on lg+ where the graphic panel is visible */}
        <div className="absolute right-0 bottom-8 left-0 hidden justify-center lg:flex">
          <p className="text-center text-[10px] leading-relaxed font-medium text-slate-400">
            * This is a conceptual mockup. Actual application design and functionality may change
            during development.
          </p>
        </div>
      </div>{' '}
      {/* End sticky wrapper */}
    </section>
  );
};

// Helper for Motion Value Template
function useMotionValueTemplate(
  strings: TemplateStringsArray,
  ...values: ReturnType<typeof useMotionValue<number>>[]
) {
  return useTransform(values, (latestValues: number[]) => {
    let result = '';
    for (let i = 0; i < strings.length; i++) {
      result += strings[i];
      if (i < latestValues.length) {
        result += latestValues[i];
      }
    }
    return result;
  });
}

export default Features;
