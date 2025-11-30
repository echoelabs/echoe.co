import posthog from 'posthog-js';

const POSTHOG_KEY = import.meta.env.PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = import.meta.env.PUBLIC_POSTHOG_HOST || 'https://a.echoe.co';
const COOKIE_CONSENT_KEY = 'echoe-cookie-consent';

interface CookiePreferences {
  necessary: boolean;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
}

let isInitialized = false;

/**
 * Get current cookie consent preferences
 */
export function getCookieConsent(): CookiePreferences | null {
  const consent = localStorage.getItem(COOKIE_CONSENT_KEY);
  if (!consent) return null;
  try {
    return JSON.parse(consent);
  } catch {
    return null;
  }
}

/**
 * Check if user has given analytics consent
 */
export function hasAnalyticsConsent(): boolean {
  const consent = getCookieConsent();
  return consent?.analytics ?? false;
}

/**
 * Initialize PostHog based on consent state
 * - With consent: Full tracking with session replay
 * - Without consent: Anonymous/cookieless mode
 */
export function initPostHog(): void {
  if (!POSTHOG_KEY) {
    console.warn('PostHog key not found. Set PUBLIC_POSTHOG_KEY in your .env file.');
    return;
  }

  const consent = getCookieConsent();
  const hasConsent = consent?.analytics ?? false;

  // Skip if already initialized with same consent state
  if (isInitialized && posthog._isIdentified !== undefined) {
    // Only re-init if consent actually changed
    const currentPersistence = posthog.config?.persistence;
    const needsReinit =
      (hasConsent && currentPersistence === 'memory') ||
      (!hasConsent && currentPersistence !== 'memory');
    if (!needsReinit) return;
    posthog.reset();
  }

  if (hasConsent) {
    // Full tracking mode
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      ui_host: 'https://us.posthog.com',
      persistence: 'localStorage+cookie',
      disable_session_recording: false,
      autocapture: true,
      capture_pageview: true,
      capture_pageleave: true,
    });
  } else {
    // Anonymous/cookieless mode
    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      ui_host: 'https://us.posthog.com',
      persistence: 'memory',
      disable_session_recording: true,
      disable_persistence: true,
      autocapture: false,
      capture_pageview: true,
      capture_pageleave: false,
    });
  }

  isInitialized = true;
}

/**
 * Track a custom event
 */
export function trackEvent(eventName: string, properties?: Record<string, unknown>): void {
  if (!isInitialized) return;
  posthog.capture(eventName, properties);
}

/**
 * Track email signup
 */
export function trackSignup(email: string): void {
  const hasConsent = hasAnalyticsConsent();
  trackEvent('signup_submitted', {
    // Only include email if user consented, otherwise just track the event
    ...(hasConsent ? { email } : {}),
    has_consent: hasConsent,
  });
}

/**
 * Track button click
 */
export function trackButtonClick(buttonName: string, location: string): void {
  trackEvent('button_click', {
    button_name: buttonName,
    location,
  });
}

/**
 * Track section view (when section enters viewport)
 */
export function trackSectionView(sectionName: string): void {
  trackEvent('section_view', {
    section_name: sectionName,
  });
}

/**
 * Track navigation click
 */
export function trackNavClick(targetSection: string): void {
  trackEvent('nav_click', {
    target_section: targetSection,
  });
}

/**
 * Track cookie consent choice
 */
export function trackConsentChoice(
  choice: 'accept_all' | 'necessary_only' | 'custom',
  preferences?: CookiePreferences
): void {
  trackEvent('cookie_consent', {
    choice,
    ...(preferences ? { preferences } : {}),
  });
}

/**
 * Identify user (only if they have consented)
 */
export function identifyUser(userId: string, properties?: Record<string, unknown>): void {
  if (!hasAnalyticsConsent()) return;
  posthog.identify(userId, properties);
}
