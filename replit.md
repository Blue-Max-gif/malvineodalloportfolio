# Workspace

## Overview

pnpm workspace monorepo using TypeScript. A complete portfolio system for **Ochieng Malvine Odallo** — a Kenyan student leader, BSc Forensic Science student at Kirinyaga University, CEO of Uplift Society, and Organizing Secretary of NUSA.

## Artifacts

| Artifact | Path | Description |
|---|---|---|
| `artifacts/portfolio` | `/` | Public-facing portfolio website (dark theme, electric blue accents) |
| `artifacts/admin` | `/admin/` | Admin dashboard for managing all portfolio content |
| `artifacts/api-server` | `/api/` | Express API server with full CRUD + file storage |

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec in `lib/api-spec/openapi.yaml`)
- **Build**: esbuild
- **Frontend**: React + Vite + Tailwind CSS + shadcn/ui + framer-motion
- **Admin routing**: wouter (base: `import.meta.env.BASE_URL`)
- **Forms**: react-hook-form + zod validation
- **Object storage**: Replit Object Storage (presigned URL upload flow)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

## Database Schema (lib/db/src/schema/index.ts)

Tables: `profile`, `skills`, `experience`, `education`, `interests`, `goals`, `contact`

- **profile** — singleton row: name, title, tagline, aboutText, profilePhotoPath, cvPath, updatedAt
- **skills** — name, icon, sortOrder
- **experience** — role, organization, bullets (newline-separated), sortOrder
- **education** — institution, degree, year, grade, sortOrder
- **interests** — name, icon, sortOrder
- **goals** — content, sortOrder
- **contact** — singleton row: phone, email, facebook, instagram, twitter, whatsapp

## API Routes (artifacts/api-server/src/routes/)

- `GET/PUT /api/profile` — profile singleton
- `GET/POST /api/skills`, `PUT/DELETE /api/skills/:id`
- `GET/POST /api/experience`, `PUT/DELETE /api/experience/:id`
- `GET/POST /api/education`, `PUT/DELETE /api/education/:id`
- `GET/POST /api/interests`, `PUT/DELETE /api/interests/:id`
- `GET/POST /api/goals`, `PUT/DELETE /api/goals/:id`
- `GET/PUT /api/contact`
- `GET /api/dashboard/stats`
- `POST /api/storage/uploads/request-url` — presigned URL for object storage
- `GET /api/storage/objects/:path` — serve stored objects

## Portfolio Pages (artifacts/portfolio/src/pages/)

All pages are **dynamic** — fetching from API:
- `Home.tsx` — profile photo, name, title, tagline, CV download link
- `About.tsx` — aboutText
- `Skills.tsx` — skills list
- `Experience.tsx` — experience list with bullet points
- `Education.tsx` — education entries
- `Interests.tsx` — interests list
- `Goals.tsx` — future goals
- `Contact.tsx` — phone, email, social links

## Admin Pages (artifacts/admin/src/pages/)

Full CRUD for every section:
- `Home.tsx` — dashboard overview with stats
- `Profile.tsx` — edit basic info + upload photo/CV via presigned URL
- `Skills.tsx`, `Experience.tsx`, `Education.tsx`, `Interests.tsx`, `Goals.tsx`, `Contact.tsx`

## Codegen Notes

- After running `codegen`, manually verify `lib/api-zod/src/index.ts` only exports `export * from "./generated/api"` (orval may overwrite this file with extra exports that cause TS errors).
- The `schemas` option was removed from the zod config to prevent duplicate TypeScript type exports.

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
