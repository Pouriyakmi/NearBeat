# NearBeat

NearBeat is a Next.js social music app with Firebase Authentication + Firestore and local server storage for file uploads.

## Stack
- Next.js
- React
- Tailwind CSS
- Firebase Auth
- Firestore
- Next.js API Routes (local uploads)

## Local development
```bash
npm install
npm run dev
```
Open: `http://localhost:3000`

## Environment variables
Create `.env.local` and set:

- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

## Upload storage
- Music files are written to: `uploads/music`
- Cover/profile images are written to: `uploads/covers`
- Files are uploaded through: `POST /api/upload`
- Files are served through: `/api/files/:folder/:filename`
- File URLs are saved in Firestore as `audioUrl`/`storagePath` on `posts` documents.

## Deployment note
For persistent uploads in production, mount a persistent volume to the project `uploads/` directory.

## Build check
```bash
npm run build
npm start
```
