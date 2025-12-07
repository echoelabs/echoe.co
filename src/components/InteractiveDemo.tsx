import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import {
  Send,
  Sparkles,
  Loader2,
  Package,
  MoreHorizontal,
  Activity,
  ShoppingCart,
  Trash2,
  Download,
  Settings,
  Users,
} from 'lucide-react';
import { generateEchoeResponse } from '../services/geminiService';
import type { Message, InventoryItem } from '../types';

const InteractiveDemo: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'model',
      text: 'Good morning! ☀️ You have 3 pending orders and 1 low stock alert (White Vase). Should I process the orders for you?',
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Live Metrics Simulation
  const [revenue, setRevenue] = useState(1240.5);
  const [visitors, setVisitors] = useState(14);
  const [activeCarts, setActiveCarts] = useState(3);
  const [revenueChanged, setRevenueChanged] = useState(false);

  // Dashboard UI State
  const [showMenu, setShowMenu] = useState(false);

  // Sticky Zoom Effect Logic (Zoom IN)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  });

  // Scale from 0.75 (quite zoomed out) to 1 (full size) as user scrolls down
  // Updated: Finish zooming at 0.5 so it stays full size for the remaining 50% of the scroll ("Stay longer")
  const scale = useTransform(scrollYProgress, [0, 0.5], [0.75, 1]);

  // Simulated Dashboard Data
  const [inventory, setInventory] = useState<InventoryItem[]>([
    { id: '1', name: 'Minimal Vase', stock: 4, price: 45, status: 'Low Stock' },
    { id: '2', name: 'Linen Throw', stock: 18, price: 120, status: 'In Stock' },
    { id: '3', name: 'Soy Candle', stock: 42, price: 28, status: 'In Stock' },
    { id: '4', name: 'Matte Plate', stock: 8, price: 32, status: 'In Stock' },
  ]);

  // Context string for Gemini to act as the "brain"
  const dashboardContext = `
    Business Name: Echoe Concept Store (Year: 2026)
    Inventory Status:
    ${inventory.map((i) => `- ${i.name}: ${i.stock} left (${i.status})`).join('\n')}
    
    Pending Action:
    - 3 orders pending shipment.
    - Customer asking about "Linen Throw" dimensions.
  `;

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages, isTyping]);

  // Simulate Live Data Changes
  useEffect(() => {
    const interval = setInterval(() => {
      // Jitter revenue more noticeably
      if (Math.random() > 0.5) {
        setRevenue((prev) => {
          setRevenueChanged(true);
          setTimeout(() => setRevenueChanged(false), 500); // Reset flash
          return prev + Math.random() * 120;
        });
      }

      // Jitter visitors with larger swings
      if (Math.random() > 0.4) {
        setVisitors((prev) => Math.max(5, prev + Math.floor(Math.random() * 5) - 2));
      }

      // Jitter carts
      if (Math.random() > 0.6) {
        setActiveCarts((prev) => Math.max(0, prev + Math.floor(Math.random() * 3) - 1));
      }

      // Dynamic Inventory Simulation (Stock dropping randomly)
      if (Math.random() > 0.7) {
        setInventory((prev) =>
          prev.map((item) => {
            if (Math.random() > 0.6 && item.stock > 0) {
              const newStock = item.stock - 1;
              return {
                ...item,
                stock: newStock,
                status: newStock < 5 ? (newStock === 0 ? 'Out of Stock' : 'Low Stock') : 'In Stock',
              };
            }
            return item;
          })
        );
      }
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: inputValue,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputValue('');
    setIsTyping(true);

    // Call the actual AI service
    const aiText = await generateEchoeResponse(userMsg.text, dashboardContext);

    setIsTyping(false);
    setMessages((prev) => [
      ...prev,
      {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: aiText,
        timestamp: new Date(),
      },
    ]);
  };

  const handleClearChat = () => {
    setMessages([
      {
        id: Date.now().toString(),
        role: 'model',
        text: 'Chat cleared. Ready for the next task.',
        timestamp: new Date(),
      },
    ]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    // Updated background to pure white and removed margin-top to prevent gaps
    // Increased height to 400vh for even longer stay
    <section id="demo" className="relative z-20 -mt-4 -mb-1 bg-white">
      {/* Title section - scrolls normally */}
      <div className="px-6 pt-24 pb-8 md:px-8 lg:px-24 xl:px-32">
        <div className="mx-auto w-full max-w-[90vw] lg:max-w-[1800px] xl:max-w-[2000px] 2xl:max-w-[2200px]">
          <div className="relative z-10 mb-8 shrink-0 text-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              className="mb-4 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 shadow-sm"
            >
              <span className="h-1.5 w-1.5 animate-[ping_1.5s_infinite] rounded-full bg-blue-600" />
              <span className="text-[10px] font-medium tracking-wider text-gray-500 uppercase">
                Live Simulation
              </span>
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true, amount: 0.5 }}
              className="font-display text-2xl leading-tight font-semibold tracking-tight text-slate-900 sm:text-3xl md:text-4xl lg:text-5xl"
            >
              Command Center.
              <br />
              Without the Clutter.
            </motion.h2>
          </div>
        </div>
      </div>

      {/* Simulation section - sticky with zoom effect */}
      <div
        ref={containerRef}
        className="relative h-[200vh] sm:h-[280vh] lg:h-[380vh]"
        style={{ position: 'relative' }}
      >
        <div className="sticky top-16 flex h-[var(--vh-hero)] flex-col px-6 py-1 sm:top-20 sm:py-4 md:px-8 lg:px-24 lg:py-6 xl:px-32">
          {/* Dynamic Background decoration - Removed Grid Pattern Completely */}
          <div className="pointer-events-none absolute top-1/4 left-0 h-[500px] w-full bg-gradient-to-r from-blue-100/40 via-purple-100/40 to-pink-100/40 opacity-60 blur-3xl" />
          <div className="pointer-events-none absolute top-1/2 right-10 h-64 w-64 animate-pulse rounded-full bg-emerald-100/30 blur-[80px]" />

          <div className="mx-auto flex min-h-0 w-full max-w-[2200px] flex-1 flex-col">
            {/* Wrapper for the floating app window - TRANSPARENT */}
            <motion.div
              id="simulation-window"
              style={{ scale }}
              className="relative z-10 flex min-h-0 w-full flex-1 flex-col items-center border-none bg-transparent shadow-none"
            >
              {/* The Main Interface Container (The App Window) */}
              {/* Added more horizontal padding (px-6 md:px-12) to prevent shadow cutoff */}
              <div className="no-scrollbar mx-auto flex min-h-0 w-full flex-1 flex-col">
                <motion.div
                  initial={{ y: 60, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  viewport={{ once: true, amount: 0.1 }}
                  className="relative grid h-[calc(100dvh-110px)] grid-cols-1 grid-rows-[1fr] gap-0 overflow-hidden rounded-[2rem] border border-t border-gray-200/80 border-white/50 bg-white shadow-xl shadow-blue-900/5 sm:h-[calc(100dvh-130px)] sm:rounded-[2.5rem] lg:h-[calc(100dvh-160px)] lg:grid-cols-12"
                >
                  {/* Scanning Effect Overlay */}
                  <div
                    className="absolute top-0 left-0 h-1 w-full animate-[shimmer_3s_infinite_translateX] bg-gradient-to-r from-transparent via-blue-400/50 to-transparent"
                    style={{ zIndex: 50 }}
                  />

                  {/* LEFT PANEL: Visual Store Management Dashboard */}
                  <div className="hidden flex-col border-r border-gray-100 bg-gray-50/30 p-6 backdrop-blur-sm lg:col-span-5 lg:flex">
                    <div className="relative mb-6 flex items-center justify-between">
                      <h3 className="flex items-center gap-3 text-sm font-semibold text-gray-900">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white shadow-sm">
                          <Activity className="h-4 w-4 text-black" />
                        </div>
                        Store Overview
                      </h3>

                      {/* Three Dots Menu */}
                      <div className="relative">
                        <MoreHorizontal
                          className="h-4 w-4 cursor-pointer text-gray-400 transition-colors hover:text-black"
                          onClick={() => setShowMenu(!showMenu)}
                        />
                        <AnimatePresence>
                          {showMenu && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: 5 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="absolute top-full right-0 z-20 mt-2 w-36 rounded-2xl border border-gray-100 bg-white p-1 shadow-lg"
                            >
                              <button className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs text-gray-600 transition-colors hover:bg-gray-50">
                                <Download className="h-3 w-3" /> Export Report
                              </button>
                              <button className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-xs text-gray-600 transition-colors hover:bg-gray-50">
                                <Settings className="h-3 w-3" /> Settings
                              </button>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </div>

                    {/* Simulated Revenue Chart */}
                    <div
                      className={`group relative mb-4 overflow-hidden rounded-2xl border bg-white p-5 shadow-sm transition-colors duration-300 ${revenueChanged ? 'border-emerald-200 bg-emerald-50/10' : 'border-gray-100'}`}
                    >
                      <div className="mb-3 flex items-end justify-between">
                        <div>
                          <div className="mb-1 text-xs text-gray-400">Today's Revenue</div>
                          <div
                            className={`font-display text-2xl font-semibold tabular-nums transition-all duration-300 ${revenueChanged ? 'origin-left scale-105 text-emerald-600' : 'text-gray-900'}`}
                          >
                            ${revenue.toFixed(2)}
                          </div>
                        </div>
                        <div className="animate-pulse rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">
                          +12%
                        </div>
                      </div>
                      <div className="flex h-28 items-end gap-2">
                        {[40, 65, 45, 80, 55, 90, 70, 85, 60].map((h, i) => (
                          <motion.div
                            key={i}
                            initial={{ height: 0 }}
                            whileInView={{ height: `${h}%` }}
                            transition={{ delay: i * 0.05, duration: 0.5 }}
                            viewport={{ once: true }}
                            className="flex-1 cursor-pointer rounded-t-sm bg-gray-900 opacity-10 transition-opacity hover:opacity-80"
                          />
                        ))}
                      </div>
                    </div>

                    {/* Inventory List */}
                    <div className="flex flex-1 flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
                      <div className="mb-4 flex items-center justify-between">
                        <span className="text-xs font-semibold text-gray-900">
                          Inventory Status
                        </span>
                        <Package className="h-4 w-4 text-gray-400" />
                      </div>
                      <div className="no-scrollbar -mr-1 flex-1 space-y-2 overflow-y-auto pr-1">
                        <AnimatePresence>
                          {inventory.map((item) => (
                            <motion.div
                              initial={{ opacity: 0 }}
                              animate={{
                                opacity: 1,
                                backgroundColor: item.stock < 5 ? '#FFF1F2' : 'rgba(0, 0, 0, 0)',
                              }}
                              transition={{ duration: 0.3 }}
                              key={item.id}
                              className="group flex cursor-pointer items-center justify-between rounded-2xl border border-transparent p-3 transition-colors hover:bg-gray-50"
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl border border-gray-200 bg-gray-100 text-xs font-medium text-gray-400">
                                  {item.name.substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                  <div className="text-xs font-medium text-gray-900">
                                    {item.name}
                                  </div>
                                  <div className="text-[11px] text-gray-400">${item.price}</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <motion.div
                                  key={item.stock} // Animate when number changes
                                  initial={{
                                    scale: 1.5,
                                    color: item.stock < 5 ? '#f43f5e' : '#10b981',
                                  }}
                                  animate={{ scale: 1, color: '#111827' }}
                                  className="text-xs font-medium text-gray-900 tabular-nums"
                                >
                                  {item.stock}
                                </motion.div>
                                <div
                                  className={`text-[10px] font-medium transition-colors ${
                                    item.status === 'Out of Stock'
                                      ? 'text-gray-400'
                                      : item.status === 'Low Stock'
                                        ? 'font-bold text-rose-500'
                                        : 'text-emerald-500'
                                  }`}
                                >
                                  {item.status}
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center justify-between px-2">
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <Users className="h-4 w-4" />
                        <span className="font-medium text-gray-600 tabular-nums transition-all">
                          {visitors} visitors
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400">
                        <ShoppingCart className="h-4 w-4" />
                        <span className="font-medium text-gray-600 tabular-nums transition-all">
                          {activeCarts} carts
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* RIGHT PANEL: Chat Interface */}
                  <div className="relative z-10 col-span-1 flex min-h-0 flex-col bg-white lg:col-span-7">
                    {/* Mobile Stats Bar - visible when dashboard is hidden */}
                    <div className="flex justify-around border-b border-gray-100 bg-gray-50/50 py-3 lg:hidden">
                      <div className="text-center">
                        <div className="text-xs font-medium text-gray-900">
                          ${revenue.toFixed(0)}
                        </div>
                        <div className="text-[10px] text-gray-400">Revenue</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs font-medium text-gray-900">{visitors}</div>
                        <div className="text-[10px] text-gray-400">Visitors</div>
                      </div>
                      <div className="text-center">
                        <div className="text-xs font-medium text-gray-900">{activeCarts}</div>
                        <div className="text-[10px] text-gray-400">Carts</div>
                      </div>
                    </div>
                    {/* Header */}
                    <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gray-50 bg-white/90 px-6 py-4 backdrop-blur-md">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-white shadow-lg shadow-black/20">
                            <Sparkles className="h-4 w-4" />
                          </div>
                          <div className="absolute -right-0.5 -bottom-0.5 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-white">
                            <div className="h-2.5 w-2.5 animate-pulse rounded-full border border-white bg-emerald-500" />
                          </div>
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-gray-900">echoe assistant</h3>
                          <p className="flex items-center gap-1.5 text-xs text-gray-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                            Always active
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={handleClearChat}
                        className="group flex items-center gap-1.5 text-xs font-medium text-gray-400 transition-colors hover:text-rose-500"
                      >
                        <Trash2 className="h-4 w-4 transition-transform group-hover:scale-110" />
                        Clear
                      </button>
                    </div>

                    {/* Messages Area */}
                    <div
                      className="no-scrollbar flex-1 space-y-6 overflow-y-auto scroll-smooth p-6"
                      ref={scrollRef}
                    >
                      <AnimatePresence mode="popLayout">
                        {messages.map((msg) => (
                          <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`flex max-w-[85%] flex-col gap-1.5 ${msg.role === 'user' ? 'items-end' : 'items-start'}`}
                            >
                              <div
                                className={`relative overflow-hidden rounded-2xl px-5 py-3 text-sm leading-relaxed shadow-sm ${
                                  msg.role === 'user'
                                    ? 'rounded-br-none bg-black text-white shadow-black/10'
                                    : 'rounded-bl-none border border-gray-100 bg-white text-gray-700 shadow-gray-200/50'
                                }`}
                              >
                                {msg.role === 'user' && (
                                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent" />
                                )}
                                {msg.text}
                              </div>
                              <span className="px-1 text-[10px] font-medium text-gray-300">
                                {msg.timestamp.toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </span>
                            </div>
                          </motion.div>
                        ))}

                        {isTyping && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9 }}
                            className="flex justify-start"
                          >
                            <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-none border border-gray-100 bg-white px-5 py-4 shadow-sm">
                              <span className="h-1.5 w-1.5 animate-[bounce_1s_infinite_0ms] rounded-full bg-gray-400" />
                              <span className="h-1.5 w-1.5 animate-[bounce_1s_infinite_200ms] rounded-full bg-gray-400" />
                              <span className="h-1.5 w-1.5 animate-[bounce_1s_infinite_400ms] rounded-full bg-gray-400" />
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Input Area - mt-auto ensures it stays at bottom */}
                    <div className="mt-auto border-t border-gray-50 bg-white p-4">
                      {/* Quick Actions */}
                      <div className="no-scrollbar mask-linear-fade mb-3 flex gap-2 overflow-x-auto pb-1">
                        {[
                          'Yes, process orders',
                          'Do we have candles left?',
                          'Draft reply to Sarah',
                        ].map((suggestion, idx) => (
                          <motion.button
                            key={suggestion}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            onClick={() => setInputValue(suggestion)}
                            className="rounded-full border border-transparent bg-gray-50 px-2.5 py-2 text-[11px] font-medium whitespace-nowrap text-gray-600 transition-colors hover:border-gray-200 hover:bg-gray-100 hover:text-black sm:px-3 sm:text-xs"
                          >
                            {suggestion}
                          </motion.button>
                        ))}
                      </div>

                      <div className="group relative">
                        <input
                          type="text"
                          value={inputValue}
                          onChange={(e) => setInputValue(e.target.value)}
                          onKeyDown={handleKeyDown}
                          placeholder="Ask echoe anything..."
                          className="w-full rounded-full border border-gray-200 bg-white py-3 pr-12 pl-5 text-sm text-gray-900 placeholder-gray-400 shadow-sm transition-all group-hover:shadow-md focus:border-gray-300 focus:ring-2 focus:ring-black/5 focus:outline-none"
                        />
                        <button
                          onClick={handleSend}
                          disabled={!inputValue.trim() || isTyping}
                          aria-label={isTyping ? 'Sending message' : 'Send message'}
                          className="touch-target absolute top-1/2 right-2 -translate-y-1/2 rounded-full bg-black p-2.5 text-white shadow-lg shadow-black/20 transition-all hover:scale-105 hover:bg-gray-800 active:scale-95 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {isTyping ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : (
                            <Send className="h-4 w-4" />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <div className="mx-auto mt-2 flex w-full max-w-[90vw] shrink-0 justify-center pb-1 sm:mt-4 sm:pb-4 lg:mt-6 lg:max-w-[1800px] lg:pb-6 xl:max-w-[2000px] 2xl:max-w-[2200px]">
                  <p className="text-center text-[10px] leading-relaxed font-medium text-zinc-400">
                    * This is a conceptual mockup. Actual application design and functionality may
                    change drastically during development.
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default InteractiveDemo;
