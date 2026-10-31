# Forreira Website (standalone)

Public website + REST API + admin panel. Runs on its own, no link to the Forreira apps yet.

- **Backend:** NestJS, TypeORM, PostgreSQL (same stack as `forreira-backend`), JWT auth, validation, rate limiting, Helmet
- **Frontend:** HTML + ES modules + Tailwind (CDN), served by the backend from `frontend/public`

## Run with Docker (easiest)

```bash
docker compose up --build
```

- Website: http://localhost:3000
- Admin: http://localhost:3000/admin/  (`admin@forreira.com` / `ChangeMe123!`)
- Demo tracking code: `FOR12345678`

Change `JWT_SECRET` and `ADMIN_PASSWORD` in `docker-compose.yml` before putting it on a public server.

## Run without Docker

Needs Node 20+ and a local PostgreSQL.

```bash
cd backend
cp .env.example .env        # set DATABASE_URL, JWT_SECRET, ADMIN_PASSWORD
npm install
npm run start:dev           # creates tables (DB_SYNCHRONIZE=true)
npm run seed                # in a second terminal: admin user + demo shipment
```

## API

| Method | Path | Auth | Purpose |
|---|---|---|---|
| POST | `/api/shipments` | public | Create a quick-send request, returns `trackingCode` |
| GET | `/api/shipments/track/:code` | public | Status and timeline (no personal data) |
| POST | `/api/auth/login` | public | Admin login, returns `accessToken` |
| GET | `/api/admin/shipments?status=&page=` | admin | List shipments |
| PATCH | `/api/admin/shipments/:id/status` | admin | Update status, adds a timeline event |

## Before real production

- Set `DB_SYNCHRONIZE=false` and use TypeORM migrations
- Serve over HTTPS and set `FORCE_HTTPS=true`
- Build Tailwind with its CLI instead of the CDN
- Tracking codes look like `FOR12345678`

## Linking to the existing apps later

`backend/src/shipments` is a self-contained Nest module (TypeORM entities, services, controllers). To connect it to `forreira-backend`, point it at the real shipment entity or turn quick requests into leads.
# forreira-wepsitev2
