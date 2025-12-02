import { useState, useCallback, useRef } from 'react';
import type { TurnstileInstance } from '@marsidev/react-turnstile';

interface UseTurnstileOptions {
  onSuccess?: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
}

interface UseTurnstileReturn {
  token: string | null;
  isVerified: boolean;
  isExpired: boolean;
  error: boolean;
  widgetRef: React.RefObject<TurnstileInstance | null>;
  handleSuccess: (token: string) => void;
  handleError: () => void;
  handleExpire: () => void;
  reset: () => void;
  siteKey: string;
}

export function useTurnstile(options: UseTurnstileOptions = {}): UseTurnstileReturn {
  const [token, setToken] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [isExpired, setIsExpired] = useState(false);
  const [error, setError] = useState(false);
  const widgetRef = useRef<TurnstileInstance | null>(null);

  const siteKey = import.meta.env.PUBLIC_TURNSTILE_SITE_KEY || '';

  const handleSuccess = useCallback(
    (newToken: string) => {
      setToken(newToken);
      setIsVerified(true);
      setIsExpired(false);
      setError(false);
      options.onSuccess?.(newToken);
    },
    [options]
  );

  const handleError = useCallback(() => {
    setToken(null);
    setIsVerified(false);
    setError(true);
    options.onError?.();
  }, [options]);

  const handleExpire = useCallback(() => {
    setToken(null);
    setIsVerified(false);
    setIsExpired(true);
    options.onExpire?.();
  }, [options]);

  const reset = useCallback(() => {
    setToken(null);
    setIsVerified(false);
    setIsExpired(false);
    setError(false);
    widgetRef.current?.reset();
  }, []);

  return {
    token,
    isVerified,
    isExpired,
    error,
    widgetRef,
    handleSuccess,
    handleError,
    handleExpire,
    reset,
    siteKey,
  };
}
