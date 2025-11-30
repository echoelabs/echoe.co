# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.0.0] - 2025-11-30

### Added

- Landing page with Hero section featuring interactive grid ripple effect
- Header with responsive navigation and mobile menu
- Footer with company links and social icons
- Features section showcasing platform capabilities
- Interactive demo simulation window
- Waitlist signup form with email validation
- Cookie consent banner with preference management
- Legal pages (Terms, Privacy, Cookie Policy, Disclaimer, Refund)
- Pricing page with plan comparison
- 404 error page
- AI chat API endpoint using Gemini
- Waitlist API endpoint with Resend email integration
- Email templates for waitlist confirmation
- SEO optimization with meta tags and Open Graph
- Sitemap and robots.txt generation
- PostHog analytics integration
- Smooth scrolling with Lenis
- Framer Motion animations throughout

### Changed

- Migrated from Next.js to Astro framework for better performance
- Configured Cloudflare Workers deployment with custom domain

### Fixed

- Cloudflare Workers deployment with proper wrangler configuration
- Worker entry point and assets binding for static file serving
- Node.js compatibility with `nodejs_compat` flag
- Replaced @google/genai SDK with direct REST API for Workers compatibility

[Unreleased]: https://github.com/echohq/echoe.co/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/echohq/echoe.co/releases/tag/v1.0.0
