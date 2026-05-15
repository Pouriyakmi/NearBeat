# NearBeat

NearBeat is a beginner-friendly social music presence prototype. The app now opens directly into the live feed, because the feed is the core product experience: your current music, nearby listeners, shared tracks, and social discovery.

## Current Phase 1 scope

Included now:

- Mobile-first Next.js web app
- Live feed as the default `/` route
- Spotify-like `Now Playing` panel for the current mock user
- Nearby listeners sorted by closest distance
- Social/music profile pages at `/profile/[id]`
- Music discovery/library page at `/music`
- Search page at `/search`
- Settings/privacy page at `/settings`
- Realistic mock data for users, tracks, upload status, playlists, and listening progress

Not included yet:

- No PocketBase backend
- No authentication
- No realtime updates
- No database
- No actual geolocation
- No file upload or streaming pipeline

Those systems are intentionally left for later phases so the project stays understandable while the product direction becomes clear.

## Product direction

NearBeat should feel like:

- Telegram simplicity for navigation and social UI
- Spotify atmosphere for listening, artwork, and playback state
- Discord/Zenly-style presence for live nearby activity

The design avoids a marketing-first landing page and focuses on a believable app experience.

## Project structure

```txt
components/   Reusable app shell, playback panels, listener rows, track rows, page headers
pages/        Next.js routes: /, /profile/[id], /music, /search, /settings
data/         Mock JSON-style product data for future backend replacement
styles/       Global Tailwind and app styles
```

## Run locally

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open the app in your browser:

```txt
http://localhost:3000
```

Build for production:

```bash
npm run build
```

Start the production build:

```bash
npm run start
```

## Beginner notes

Start by editing `data/mockUsers.js`. That file controls the current user, nearby listeners, tracks, upload/playable status, playlists, distances, and profile content. The UI is intentionally split into small components so backend, realtime, auth, geolocation, uploads, and playlists can be connected later without rewriting the whole app.
