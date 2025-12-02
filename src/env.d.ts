/// <reference types="astro/client" />
/// <reference types="@astrojs/cloudflare" />

// Client-side environment variables (must be prefixed with PUBLIC_ in .env)
interface ImportMetaEnv {
  readonly PUBLIC_POSTHOG_KEY: string;
  readonly PUBLIC_POSTHOG_HOST: string;
  readonly PUBLIC_TURNSTILE_SITE_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Cloudflare runtime environment bindings (secrets set via wrangler)
interface RuntimeEnv {
  GEMINI_API_KEY: string;
  RESEND_API_KEY: string;
  POSTHOG_KEY: string;
  TURNSTILE_SECRET_KEY: string;
}

declare namespace App {
  interface Locals {
    runtime: {
      env: RuntimeEnv;
    };
  }
}
