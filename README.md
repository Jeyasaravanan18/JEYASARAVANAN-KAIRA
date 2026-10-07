# ASSEMBLY Event Booking Platform

ASSEMBLY is a premium frontend-only international event booking platform. It includes event discovery, event detail pages, ticket and seat selection, checkout, booking confirmation, mock account flows, enterprise enquiry, help centre, multilingual UI, currency conversion, dark mode, and an automated assistant prototype.

The product is built to feel like an enterprise-grade booking experience while staying fully runnable without a backend.

## Tech Stack

- React 18 + TypeScript + Vite
- React Router v6 with lazy-loaded routes
- Tailwind CSS with custom design tokens
- i18next + react-i18next with locale JSON files
- Zustand for persisted UI, booking, auth, and chat state
- React Hook Form + Zod validation
- Intl API for dates, numbers, and currencies
- Framer Motion for subtle page and card animation
- lucide-react icons
- Vitest + React Testing Library

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:5173/`.

## Scripts

```bash
npm run dev      # start local development server
npm run build    # type-check and build production assets
npm test -- --run
```

## Features

- Premium image-led home page and event catalogue
- Event listing with filters, view toggle, loading, empty, and error states
- Event detail pages with agenda, ticket tiers, policies, venue placeholder, and related events
- Event booking page with ticket quantities, optional seat map, hold timer, and live order summary
- Multi-step checkout with attendee details, add-ons, payment options, discount code, and price breakdown
- Confirmation page with booking reference, QR code, print, share, and `.ics` calendar download
- My bookings page with mock cancel and transfer actions
- Mock sign in, account creation, and forgot password flow
- Corporate and group enquiry form
- Help centre with searchable-style FAQ and contact form
- Bottom-right automated assistant prototype
- Dark mode, currency selector, and language selector
- English, Hindi, Tamil, Spanish, French, Arabic RTL, and Japanese locale structure

## Architecture

The app follows the requested structure under `src/`: route-level pages in `routes`, reusable primitives in `components/ui`, product shells in `components/layout`, feature code in `features`, typed mock data and services in `lib`, state in `store`, locale JSON in `locales`, and focused tests in `tests`.

Routes are lazy-loaded through React Router v6. Event data is served by a small async mock service with artificial latency and occasional simulated failures. Booking, auth, UI preferences, and chat state are handled with Zustand; UI and booking are persisted, while chat uses session storage.

## Design System

Tailwind is configured around CSS design tokens for ink, paper, grayscale, status colors, and a premium palette using deep black, midnight indigo, emerald, champagne gold, violet, and soft blue surfaces. Shared classes such as `luxe-card`, `luxe-surface`, `premium-band`, and `accent-action` keep the interface consistent.

The UI uses Inter with Noto fallbacks for Devanagari, Tamil, Arabic, and Japanese.

## Internationalisation

Locale files live in `src/locales/{language}/common.json`. To add a language:

1. Add a locale folder and `common.json`.
2. Register it in `src/lib/i18n/config.ts`.
3. Add the native language name and `dir`.
4. Verify `<html lang>` and `dir` update from the header switcher.

The Arabic option sets RTL direction globally. Currency formatting uses `Intl.NumberFormat` and mock conversion rates in `src/lib/format/currency.ts`.

## Booking Flow

1. Browse events from the home page or `/events`.
2. Open an event detail page or select `Book` directly from an event card.
3. Choose ticket quantities and, for seated events, seats.
4. Review the booking summary and continue to checkout.
5. Complete attendee and payment details.
6. Receive a confirmation with QR code and calendar download.

## Mocked Areas

Payment, authentication, chatbot handoff, invoice/download behaviour, maps, event inventory, seat holds, and service errors are simulated in the browser. No backend or external API is required.

## Known Limitations

Translations need native review. Payment, auth, and chatbot behaviour are simulated. The map is a static placeholder, and the event API is an in-memory mock.
