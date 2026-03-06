# Hosting setup (Phase 3)

This document describes how to deploy the Uncommon frontend to **Vercel** and the CMS + database to **Railway**, with separate dev and production environments.

## Railway — CMS + Database

1. **Create a Railway account** at [railway.app](https://railway.app) (sign up with GitHub).

2. **Create two Railway projects**: one for **dev**, one for **production**.

   In each project, add:
   - **PostgreSQL**: click *+ New* → *Database* → *PostgreSQL*.
   - **Service from GitHub**: *+ New* → *GitHub Repo* → select your `uncommon-web` repo.
     - In the **dev** project, set the branch to `dev`.
     - In the **production** project, set the branch to `main`.

3. **Environment variables** (per environment):

   Railway provides `DATABASE_URL` from the Postgres service. This project also reads `DATABASE_URI`; you can set both to the same value or use only `DATABASE_URI` and copy the connection string from the Postgres service.

   Add:
   - `PAYLOAD_SECRET` — generate a long random string (e.g. `openssl rand -base64 32`).
   - `NEXT_PUBLIC_SITE_URL` — e.g. `https://your-cms-dev.up.railway.app` (dev) or your production CMS URL.
   - **Production only**: `NODE_ENV=production`.

## Vercel — Frontend

1. **Create a Vercel account** at [vercel.com](https://vercel.com) (sign up with GitHub).

2. **Import your GitHub repository** and let Vercel detect Next.js.

3. **Environments**:
   - **Production**: deploy from `main` → connect custom domain `uncommon.co.uk` when ready.
   - **Preview**: deploy from `dev` → e.g. `dev.uncommon.co.uk` or the default Vercel preview URL.

4. **Environment variables** (in Vercel project settings):
   - **Production**: `NEXT_PUBLIC_PAYLOAD_URL=https://your-cms-prod.railway.app` (your production Railway app URL).
   - **Preview**: `NEXT_PUBLIC_PAYLOAD_URL=https://your-cms-dev.railway.app` (your dev Railway app URL).

## Summary

- **Dev**: `dev` branch → Vercel preview URL + Railway dev CMS + dev Postgres.
- **Production**: `main` branch → uncommon.co.uk + Railway prod CMS + prod Postgres.
- Every pull request gets a Vercel preview deployment automatically.

## Cost estimate (from guide)

| Service   | Dev   | Production   |
|----------|-------|--------------|
| Vercel   | Free  | ~£16/mo (Pro) |
| Railway  | ~£0   | ~£8–12/mo    |
| **Total**| ~£0   | ~£24–28/mo   |
