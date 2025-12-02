import { forwardRef } from 'react';
import { Turnstile } from '@marsidev/react-turnstile';
import type { TurnstileInstance } from '@marsidev/react-turnstile';

interface TurnstileWidgetProps {
  siteKey: string;
  onSuccess: (token: string) => void;
  onError?: () => void;
  onExpire?: () => void;
  theme?: 'light' | 'dark' | 'auto';
  className?: string;
}

const TurnstileWidget = forwardRef<TurnstileInstance, TurnstileWidgetProps>(
  ({ siteKey, onSuccess, onError, onExpire, theme = 'auto', className }, ref) => {
    if (!siteKey) {
      // In development without a key, render nothing but don't break the form
      return null;
    }

    return (
      <div className={className}>
        <Turnstile
          ref={ref}
          siteKey={siteKey}
          onSuccess={onSuccess}
          onError={onError}
          onExpire={onExpire}
          options={{
            theme,
            size: 'invisible',
            execution: 'render',
          }}
        />
      </div>
    );
  }
);

TurnstileWidget.displayName = 'TurnstileWidget';

export default TurnstileWidget;
