# echoe.co

Landing page for **echoe** - a unified commerce platform for next-generation businesses.

## Tech Stack

- **Framework**: Astro 5 + React 19
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion + Lenis (smooth scroll)
- **Email**: Resend + React Email
- **Analytics**: PostHog
- **Deployment**: Cloudflare Workers

## Prerequisites

- [Bun](https://bun.sh) (v1.0+)
- Node.js 18+ (for tooling compatibility)

## Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/echohq/echoe.co.git
   cd echoe.co
   ```

2. Install dependencies:
   ```bash
   bun install
   ```

3. Create environment file:
   ```bash
   cp .env.example .env
   ```

4. Configure environment variables in `.env`:
   - `PUBLIC_POSTHOG_KEY` - PostHog project API key (optional)
   - `PUBLIC_POSTHOG_HOST` - PostHog host URL (optional)

## Development

```bash
bun run dev
```

Opens at [http://localhost:4321](http://localhost:4321)

## Build

```bash
bun run build
```

Output in `dist/` directory.

## Preview Production Build

```bash
bun run preview
```

## Project Structure

```
src/
├── components/          # React components (Header, Hero, Features, etc.)
├── layouts/             # Astro layouts (BaseLayout, LegalLayout)
├── pages/               # Astro pages and API routes
│   └── api/             # Server-side API endpoints
├── services/            # Services (analytics, AI)
├── styles/              # Global CSS
└── types/               # TypeScript definitions
public/                  # Static assets
```

## Deployment

Deployed automatically to Cloudflare Workers on push to `main`.

### Runtime Secrets (set via wrangler CLI)
```bash
bunx wrangler secret put GEMINI_API_KEY   # Google Gemini AI for chat
bunx wrangler secret put RESEND_API_KEY   # Resend for waitlist emails
```

### Build-time Variables (set in GitHub repository variables)
- `PUBLIC_POSTHOG_KEY` - PostHog project API key
- `PUBLIC_POSTHOG_HOST` - PostHog host URL

## License

Copyright (c) 2024-2025 ECHO HQ CO., LTD. All Rights Reserved.

See [LICENSE](LICENSE) for details.
