# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

RMGP is a monorepo containing:

-  **Frontend**: Portfolio website built with Astro.js
-  **Backend**: Content management system built with Payload CMS v3 + Next.js

## Common Development Commands

### Monorepo Commands (run from root)

```bash
npm run dev:all          # Run both frontend and backend concurrently with MongoDB
npm run install:all      # Install dependencies for both projects
npm run build:all        # Build both projects
npm run test:all         # Run tests for both projects
npm run mongo:start      # Start MongoDB via Docker
npm run mongo:stop       # Stop MongoDB container
```

### Frontend Commands (run from frontend/)

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build
npm run format           # Format code with Prettier
npm run lint:eslint      # Lint code with ESLint
```

### Backend Commands (run from backend/)

```bash
pnpm dev                 # Start development server
pnpm build               # Build for production
pnpm test                # Run all tests
pnpm test:int            # Run integration tests only
pnpm test:e2e            # Run E2E tests only
pnpm generate:types      # Generate TypeScript types for Payload
pnpm generate:importmap  # Generate import map
pnpm payload             # Run Payload CLI commands
pnpm seed                # Create admin user (first time setup)
```

## Architecture

### Frontend Structure

```
frontend/
├── src/
│   ├── pages/           # Astro page routes
│   ├── components/      # UI components (React + Astro)
│   ├── content/         # MDX content for blog/projects
│   ├── layouts/         # Page layouts
│   ├── assets/          # Styles and images
│   └── utils/           # Utility functions
├── public/              # Static assets (videos, images)
└── netlify/             # Edge functions (Spotify, GitHub integrations)
```

Key frontend patterns:

-  Pages use Astro's file-based routing
-  Components can be `.astro` (static) or `.jsx`/`.tsx` (interactive)
-  Content is managed via Payload CMS blocks
-  Tailwind CSS for styling with custom configuration
-  GSAP and Lenis for animations and smooth scrolling
-  WorksGrid displays all works from Payload CMS
-  WorksItem renders individual work cards with Payload image support

### Backend Structure

```
backend/
├── src/
│   ├── app/             # Next.js app directory
│   │   ├── (frontend)/  # Frontend routes
│   │   └── (payload)/   # Admin panel and API routes
│   ├── collections/     # Payload collections
│   │   ├── Media.ts     # Media uploads collection
│   │   └── Users.ts     # Auth-enabled users collection
│   └── payload.config.ts # Main Payload configuration
└── tests/               # Integration and E2E tests
```

Key backend patterns:

-  Payload CMS provides the admin UI at `/admin`
-  Collections define data models with TypeScript
-  Next.js app router handles routing
-  MongoDB for data persistence
-  Sharp for automatic image optimization

## Development Setup

### Backend Requirements

-  Node.js: ^18.20.2 || >=20.9.0
-  pnpm package manager (required)
-  MongoDB instance running
-  Environment variables in `backend/.env`:
   ```
   DATABASE_URI=mongodb://127.0.0.1:27017/RMGP-Database
   PAYLOAD_SECRET=YOUR_SECRET_HERE
   ADMIN_EMAIL=your-admin@email.com
   ADMIN_PASSWORD=your-secure-password
   ```

### Authentication & Access Control

The backend uses role-based access control:
- **Public access**: Read-only access to published works and media
- **Authenticated users**: Can create, read, update works and media
- **Admin users**: Full access including user management
- Run `pnpm seed` to create the first admin user

### Frontend Requirements

-  Node.js: 20.10.0
-  Environment configuration in `frontend/src/config.mjs`

## Testing

Backend testing:

-  Integration tests: `pnpm test:int` (Vitest + React Testing Library)
-  E2E tests: `pnpm test:e2e` (Playwright)
-  Test files located in `backend/tests/`

## Deployment

-  Frontend: Deployed to Netlify (configuration in `frontend/netlify.toml`)
-  Backend: Can be deployed to Payload Cloud or any Node.js hosting
-  Frontend URL: https://stupendous-capybara-079a5c.netlify.app/ (WIP)
