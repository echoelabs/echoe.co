/// <reference types="astro/client" />

interface ImportMetaEnv {
  readonly POSTHOG_KEY: string;
  readonly POSTHOG_HOST: string;
  readonly GEMINI_API_KEY: string;
  readonly RESEND_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
