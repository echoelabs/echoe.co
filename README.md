# echoe.co

Landing page for **echoe** - a unified commerce platform for next-generation businesses.

## Tech Stack

- **Framework**: React 19 + Vite 7
- **Styling**: Tailwind CSS 4
- **Animations**: Framer Motion + Lenis (smooth scroll)
- **Email**: Resend + React Email
- **Analytics**: PostHog
- **Deployment**: Cloudflare Pages

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
   - `VITE_GEMINI_API_KEY` - Google Gemini AI (optional)
   - `VITE_POSTHOG_KEY` - PostHog analytics (optional)

## Development

```bash
bun run dev
```

Opens at [http://localhost:3000](http://localhost:3000)

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
├── components/          # React components
│   ├── layout/          # Header, Footer, Layout
│   ├── sections/        # Hero, Features, EarlyAccess
│   └── ui/              # BackToTop, CookieConsent
├── pages/               # Route pages
├── services/            # API services (analytics, email)
├── functions/           # Cloudflare Pages functions
├── emails/              # React Email templates
└── public/              # Static assets
```

## Deployment

Deployed automatically to Cloudflare Pages on push to `main`.

Server-side environment variables (set in Cloudflare dashboard):
- `RESEND_API_KEY` - Email service for waitlist

## License

Copyright (c) 2024-2025 ECHO HQ CO., LTD. All Rights Reserved.

See [LICENSE](LICENSE) for details.
