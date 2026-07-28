# Coolify Deployment

This repository is a monorepo with three deployable services:

1. Main website: React/Vite app in the repository root.
2. Dashboard: React/Vite app in `apps/dashboard`.
3. API: Express/MongoDB app in `apps/api`.

Repository:

- `https://github.com/AbdelrahmanYosry2022/fortune-construction.git`

Primary domain:

- `www.fortuneconstruction.net`

Recommended service domains:

- Website: `www.fortuneconstruction.net`
- Dashboard: `admin.fortuneconstruction.net`
- API: `api.fortuneconstruction.net`

## Recommended Coolify Setup

Create one MongoDB resource and three applications from the same GitHub repository in Coolify.

## DNS

Point these records to the Contabo server IP `144.91.86.207`:

1. `A www.fortuneconstruction.net -> 144.91.86.207`
2. `A admin.fortuneconstruction.net -> 144.91.86.207`
3. `A api.fortuneconstruction.net -> 144.91.86.207`
4. Optional: `A fortuneconstruction.net -> 144.91.86.207`

If Cloudflare is used, start with DNS only mode until everything is working.

## Coolify Resource 1: MongoDB

Create a MongoDB database service inside Coolify.

Suggested values:

- Resource name: `fortune-mongodb`
- Database name: `fortune_construction`
- Username: `fortune_user`
- Password: generate a strong password in Coolify

Then use the internal connection string from Coolify as `MONGODB_URI` for the API.

## Coolify App 1: Main website

- Source: GitHub repository
- Repository: `AbdelrahmanYosry2022/fortune-construction`
- Branch: your production branch
- Build pack: Dockerfile
- Dockerfile location: `Dockerfile.website`
- Port: `80`
- Domain: `www.fortuneconstruction.net`
- Optional extra domain: `fortuneconstruction.net`

Required build argument:

- `VITE_API_URL=https://api.fortuneconstruction.net`

## Coolify App 2: Dashboard

- Source: GitHub repository
- Repository: `AbdelrahmanYosry2022/fortune-construction`
- Branch: your production branch
- Build pack: Dockerfile
- Dockerfile location: `Dockerfile.dashboard`
- Port: `80`
- Domain: `admin.fortuneconstruction.net`

Required build argument:

- `VITE_API_URL=https://api.fortuneconstruction.net`

## Coolify App 3: API

- Source: GitHub repository
- Repository: `AbdelrahmanYosry2022/fortune-construction`
- Branch: your production branch
- Build pack: Dockerfile
- Dockerfile location: `Dockerfile.api`
- Port: `3001`
- Domain: `api.fortuneconstruction.net`

Required environment variables for the API:

- `MONGODB_URI=` value from the Coolify MongoDB service
- `JWT_SECRET=` a long random secret
- `JWT_EXPIRES_IN=24h`
- `PORT=3001`

Recommended persistent storage for the API:

- Mount a persistent volume to `/app/apps/api/uploads`

## Notes

- Both frontend builds use `VITE_API_URL` at build time.
- The website and dashboard are SPAs and use `nginx.spa.conf` for route fallback.
- The API exposes a health endpoint at `/health`.
- Uploads are served from the API domain, so the uploads volume should be persistent.

## Quick Verification After Deploy

1. Open `https://www.fortuneconstruction.net` and verify page refresh works on nested routes.
2. Open `https://admin.fortuneconstruction.net` and verify login loads without a 404 on refresh.
3. Open `https://api.fortuneconstruction.net/health` and confirm it returns a JSON status.
4. Verify image and CV uploads still exist after restarting the API container.