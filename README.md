# NearBeat

NearBeat is a beginner-friendly social music presence prototype. The first phase is intentionally simple: a polished Next.js web UI with mock nearby listeners and no backend.

## What is included in Phase 1

- A cyberpunk-inspired landing page
- A nearby feed page
- Animated glassmorphism cards
- Mock users, songs, album-cover gradients, notes, and distances
- Local-only data from `data/mockUsers.js`

## Not included yet

- No PocketBase backend
- No authentication
- No realtime updates
- No database
- No location tracking

Those features belong in later phases after the prototype feels good.

## Tech stack

- Next.js
- React
- TailwindCSS
- Framer Motion
- Lucide React icons

## Project structure

```txt
components/   Reusable UI pieces like cards, navigation, and page shell
data/         Mock JSON-style data for nearby listeners
hooks/        Small React hooks used by the UI
pages/        Next.js pages for the landing page and feed
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

## Beginner notes

Start by editing the mock data in `data/mockUsers.js`. That file controls the people, songs, distances, notes, moods, and colors shown in the feed. After that, explore `components/FeedCard.js`, which turns one mock listener into a visual card.
