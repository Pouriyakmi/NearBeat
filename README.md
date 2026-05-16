# NearBeat

NearBeat is a Next.js social music app with Firebase Authentication + Firestore and **Supabase Storage** for file uploads.

## Stack
- Next.js
- React
- Tailwind CSS
- Firebase Auth
- Firestore
- Supabase Storage

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
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server-side only; never expose in client)

A template is available in `.env.example`.

## Supabase Storage setup
1. Open your Supabase project and run SQL from `supabase/storage-policies.sql`.
2. This migration creates bucket `tracks` (public) if missing.
3. Policies on `storage.objects` enforce:
   - Public `SELECT` only for `tracks` bucket.
   - Authenticated `INSERT` only into `tracks/{auth.uid()}/...` paths.
   - `UPDATE`/`DELETE` only by object owner.

These policies are required so browser uploads with the anon key remain safe.

## Upload path format
Uploaded objects are stored as:

`tracks/{userId}/{timestamp}-{filename}`

## Public URL retrieval
Client code uses:

`supabase.storage.from('tracks').getPublicUrl(path)`

for rendering download links in the UI.

## Build check
```bash
npm run build
```
