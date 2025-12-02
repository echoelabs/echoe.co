import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Loader2 } from 'lucide-react';
import isEmail from 'validator/lib/isEmail';
import { trackSignup } from '../services/analytics';
import { useTurnstile } from '../hooks/useTurnstile';
import TurnstileWidget from './TurnstileWidget';

const WaitlistPage: React.FC = () => {
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
    <div className="relative overflow-hidden">
      <div className="relative z-10 flex min-h-[var(--min-vh-page)] flex-col items-center px-3 pt-48 pb-24 sm:px-4 sm:pt-60 sm:pb-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.1, 0.25, 1] }}
          className="w-full max-w-xl text-center"
        >
          {/* Heading */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mx-auto mb-10 max-w-md text-lg leading-relaxed font-light text-gray-600 md:text-xl"
          >
            Join the waiting list for early access updates and be the first to experience the
            future.
          </motion.p>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="relative flex min-h-[60px] items-center justify-center sm:min-h-[70px]"
          >
            <AnimatePresence mode="wait">
              {status === 'success' ? (
                <motion.div
                  key="success-badge"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                  className="flex w-full items-center justify-center gap-3 rounded-full border border-emerald-200 bg-emerald-50 px-6 py-4"
                >
                  <div className="rounded-full bg-emerald-500 p-1">
                    <Check className="h-4 w-4 text-white" strokeWidth={3} />
                  </div>
                  <span className="text-base font-medium text-emerald-700">
                    You're on the list!
                  </span>
                </motion.div>
              ) : (
                <motion.form
                  key="signup-form"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  onSubmit={handleSubscribe}
                  className="relative w-full"
                >
                  <TurnstileWidget
                    ref={widgetRef}
                    siteKey={siteKey}
                    onSuccess={handleTurnstileSuccess}
                    onError={handleTurnstileError}
                    onExpire={handleTurnstileExpire}
                    theme="light"
                  />
                  <div
                    className={`relative flex items-center rounded-full border bg-gray-50 p-2 transition-all duration-300 ${
                      status === 'error'
                        ? 'border-red-300 shadow-[0_0_20px_rgba(239,68,68,0.1)]'
                        : isFocused
                          ? 'border-gray-300 shadow-lg'
                          : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (status === 'error') setStatus('idle');
                      }}
                      onFocus={() => setIsFocused(true)}
                      onBlur={() => setIsFocused(false)}
                      disabled={status === 'loading'}
                      className="min-w-0 flex-1 border-none bg-transparent px-4 py-3.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:ring-0 sm:px-5 sm:py-3"
                    />
                    <button
                      type="submit"
                      disabled={status === 'loading'}
                      className="touch-target relative min-w-[120px] rounded-full bg-black px-5 py-3.5 text-sm font-medium whitespace-nowrap text-white shadow-md transition-all hover:scale-105 hover:bg-gray-800 active:scale-95 disabled:cursor-not-allowed disabled:opacity-70 sm:min-w-[140px] sm:px-6 sm:py-3"
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
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Privacy note */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="mt-6 text-xs text-gray-500"
          >
            By joining, you agree to our{' '}
            <a href="/privacy" className="underline transition-colors hover:text-gray-700">
              Privacy Policy
            </a>
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default WaitlistPage;
