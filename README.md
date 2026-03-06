# Uncommon.co.uk — Website rebuild

Next.js (App Router) + Payload CMS v3 + PostgreSQL. Recreates [uncommon.co.uk](https://www.uncommon.co.uk) (coworking & flexible office space in London).

## Stack

- **Frontend**: Next.js 15 (App Router)
- **CMS**: Payload CMS v3 (TypeScript)
- **Database**: PostgreSQL
- **Hosting**: Vercel (frontend), Railway (CMS + DB) — see [HOSTING.md](./HOSTING.md)

## Quick start (local)

1. **Prerequisites**: Node.js v20+, Git, PostgreSQL (local or Docker).

2. **Clone and install** (if not already created):
   ```bash
   cd uncommon-web
   npm install
   ```

3. **Environment**:
   ```bash
   cp .env.example .env
   ```
   Edit `.env`:
   - `DATABASE_URI=postgresql://localhost:5432/uncommon_dev` (or your Postgres URL)
   - `PAYLOAD_SECRET=` any long random string

4. **Run**:
   ```bash
   npm run dev
   ```
   - Site: [http://localhost:3000](http://localhost:3000)
   - Admin: [http://localhost:3000/admin](http://localhost:3000/admin) — create your first user here.

5. **Migrations** (after schema changes):
   ```bash
   npm run payload migrate
   npm run generate:types
   ```

## Project structure

- `src/app/(frontend)/` — Public pages (home, locations, membership, journal, meeting rooms, event spaces)
- `src/app/(payload)/` — Payload admin and API
- `src/collections/` — Payload collections (Locations, Memberships, Journal, etc.)
- `src/globals/` — Payload globals (Navigation, Homepage, Footer, SEO)
- `src/lib/payload.ts` — `getPayloadClient()` for server components and scripts
- `scripts/migrate-from-wp.ts` — Optional WordPress content migration

## Git (Option B — separate repo)

```bash
git init
git add .
git commit -m "initial scaffold"
# Create a new repo on GitHub, then:
git remote add origin https://github.com/YOUR_USERNAME/uncommon-web.git
git push -u origin main

git checkout -b dev
git push -u origin dev
```

Use `main` for production and `dev` for the development environment (see [HOSTING.md](./HOSTING.md)).

## Commands

| Command | Purpose |
|--------|---------|
| `npm run dev` | Local Next.js + Payload |
| `npm run build` | Production build (no DB required) |
| `npm run payload migrate` | Run DB migrations |
| `npm run payload generate:types` | Regenerate Payload types |

## Content migration from WordPress

See [scripts/migrate-from-wp.ts](./scripts/migrate-from-wp.ts) for an example script. Export from the WordPress REST API, then run the script against dev first.
