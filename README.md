# Comet

Smart metro access planner — finds best metro station by travel time, not just distance.

Phase 1 status: project scaffolding only. No location/routing/fare logic yet.

## Structure

```
comet/
├── mobile/     Expo (React Native + TypeScript)
└── backend/    Express + TypeScript, PostgreSQL/PostGIS
```

## Backend Setup

```
cd backend
cp .env.example .env
npm install
```

Start database (Docker):
```
docker compose up -d
```

Run migrations:
```
npm run migrate:up
```

Start dev server:
```
npm run dev
```

Verify:
```
curl http://localhost:4000/health
```

## Mobile Setup

```
cd mobile
cp .env.example .env
npm install
npx expo start
```

Open in Expo Go app or simulator.

## Notes

- Kochi metro station seed data: `backend/src/db/seeds/kochi_stations.json` (25 stations, Blue Line). Coordinates for stations 23 (Vadakkekotta) and 24 (SN Junction) are approximate — verify against KMRL/OSM before relying on them.
- Google Maps API keys not yet created — `GOOGLE_MAPS_API_KEY` left blank in both `.env.example` files.
- No auth, caching, or web app in this phase.
