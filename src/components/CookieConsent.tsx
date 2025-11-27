import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { initPostHog, trackConsentChoice } from '../services/analytics';

const COOKIE_CONSENT_KEY = 'echoe-cookie-consent';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

const defaultPreferences: CookiePreferences = {
  necessary: true,
  analytics: false,
  marketing: false,
  preferences: false,
};

const allAccepted: CookiePreferences = {
  necessary: true,
  analytics: true,
  marketing: true,
  preferences: true,
};

const CookieConsent: React.FC = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showPreferences, setShowPreferences] = useState(false);
  const [cookiePrefs, setCookiePrefs] = useState<CookiePreferences>(allAccepted);

  useEffect(() => {
    const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
    if (!consent) {
      const timer = setTimeout(() => setShowBanner(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const savePreferences = (
    prefs: CookiePreferences,
    choice: 'accept_all' | 'necessary_only' | 'custom'
  ) => {
    localStorage.setItem(COOKIE_CONSENT_KEY, JSON.stringify(prefs));
    // Re-initialize PostHog with new consent state
    initPostHog();
    // Track the consent choice
    trackConsentChoice(choice, prefs);
    setShowBanner(false);
  };

  const handleAccept = () => {
    savePreferences(allAccepted, 'accept_all');
  };

  const handleNecessaryOnly = () => {
    savePreferences(defaultPreferences, 'necessary_only');
  };

  const handleSavePreferences = () => {
    savePreferences(cookiePrefs, 'custom');
  };

  const togglePreference = (key: keyof CookiePreferences) => {
    if (key === 'necessary') return;
    setCookiePrefs((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const cookieTypes = [
    {
      key: 'necessary' as const,
      label: 'Necessary',
      description: 'Essential for the website to function. Cannot be disabled.',
      required: true,
    },
    {
      key: 'analytics' as const,
      label: 'Analytics',
      description: 'Help us understand how visitors interact with our website.',
      required: false,
    },
    {
      key: 'marketing' as const,
      label: 'Marketing',
      description: 'Used to deliver personalized advertisements.',
      required: false,
    },
    {
      key: 'preferences' as const,
      label: 'Preferences',
      description: 'Remember your settings and preferences.',
      required: false,
    },
  ];

  return (
    <AnimatePresence>
      {showBanner && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="fixed right-4 bottom-4 left-4 z-50 md:right-auto md:bottom-6 md:left-6 md:max-w-md"
        >
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white/95 shadow-lg shadow-black/5 backdrop-blur-md">
            <div className="p-4 md:p-5">
              <p className="text-sm leading-relaxed text-gray-600">
                We use cookies to enhance your experience. By clicking "Accept", you consent to all
                cookies.{' '}
                <a href="/cookie" className="underline transition-colors hover:text-gray-900">
                  Cookie Policy
                </a>
              </p>

              {/* Expandable Preferences */}
              <AnimatePresence>
                {showPreferences && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="mt-4 space-y-3 border-t border-gray-100 pt-4">
                      {cookieTypes.map((type) => (
                        <div key={type.key} className="flex items-start justify-between gap-3">
                          <div className="min-w-0 flex-1">
                            <p className="text-xs font-medium text-gray-900">{type.label}</p>
                            <p className="mt-0.5 text-[11px] leading-tight text-gray-500">
                              {type.description}
                            </p>
                          </div>
                          <button
                            onClick={() => togglePreference(type.key)}
                            disabled={type.required}
                            className={`relative h-7 w-12 flex-shrink-0 rounded-full transition-colors sm:h-6 sm:w-10 ${
                              cookiePrefs[type.key] ? 'bg-black' : 'bg-gray-200'
                            } ${type.required ? 'cursor-not-allowed opacity-60' : 'cursor-pointer hover:opacity-80'}`}
                          >
                            <span
                              className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow-sm transition-transform sm:h-4 sm:w-4 ${
                                cookiePrefs[type.key] ? 'left-6 sm:left-5' : 'left-1'
                              }`}
                            />
                          </button>
                        </div>
                      ))}

                      {/* Action buttons in expanded view */}
                      <div className="flex items-center gap-2 pt-3">
                        <button
                          onClick={handleSavePreferences}
                          className="touch-target flex-1 rounded-full bg-black px-4 py-3 text-xs font-medium text-white transition-all hover:scale-[1.02] hover:bg-gray-800 active:scale-[0.98] sm:py-2.5"
                        >
                          Save Preferences
                        </button>
                        <button
                          onClick={handleNecessaryOnly}
                          className="touch-target flex-1 rounded-full bg-gray-100 px-4 py-3 text-xs font-medium text-gray-600 transition-all hover:scale-[1.02] hover:bg-gray-200 active:scale-[0.98] sm:py-2.5"
                        >
                          Necessary Only
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Main buttons (only shown when preferences collapsed) */}
              {!showPreferences && (
                <div className="mt-4 flex flex-col gap-2">
                  <button
                    onClick={handleAccept}
                    className="touch-target w-full rounded-full bg-black px-4 py-3 text-xs font-medium text-white transition-all hover:scale-[1.02] hover:bg-gray-800 active:scale-[0.98] sm:py-2.5"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => setShowPreferences(true)}
                    className="w-full px-4 py-2 text-xs font-medium text-gray-500 transition-colors hover:text-gray-700"
                  >
                    Customize
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
