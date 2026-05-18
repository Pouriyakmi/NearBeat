# NearBeat

NearBeat is a Next.js social music app with Firebase Authentication + Firestore + Firebase Hosting deployment, and Arvan Object Storage for uploaded media files.

## Stack
- Next.js
- React
- Tailwind CSS
- Firebase Auth
- Firestore
- Arvan Object Storage (S3-compatible)
- Firebase Hosting

## Local development
```bash
npm install
npm run dev
```
Open: `http://localhost:3000`

## Environment variables
Create `.env.local` from `.env.local.example`:

```bash
cp .env.local.example .env.local
```

Fill with your Firebase Web config values:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID`

Fill with Arvan storage values:
- `ARVAN_STORAGE_BUCKET`
- `ARVAN_STORAGE_ENDPOINT`
- `ARVAN_STORAGE_PUBLIC_BASE_URL`
- `ARVAN_STORAGE_ACCESS_KEY`
- `ARVAN_STORAGE_SECRET_KEY`

> Security: Never expose `ARVAN_STORAGE_SECRET_KEY` to the frontend. Uploading is done through secure server-side API routes only.

## Storage architecture
- Firebase remains responsible for **Auth + Firestore**.
- Media uploads (music and cover images) go to Arvan Object Storage through `/.netlify/functions/create-upload-url` (signed URL) + direct client PUT upload.
- Returned payload format is preserved:
  - `storagePath`
  - `downloadURL`
  - `publicUrl`
- Public file URLs are served from `ARVAN_STORAGE_PUBLIC_BASE_URL`.

### Arvan CORS recommendation
Configure your bucket CORS to allow your app origins (e.g. localhost + Firebase hosting domain) and `GET,HEAD` for streaming plus `PUT,POST` if needed by future direct flows.

## Firebase project
- Project ID: `nearbeat-c4506`
- Hosting site: `nearbeat-c4506`

Configured files:
- `.firebaserc`
- `firebase.json`

## Build check
```bash
npm run build
```

## Deploy to Firebase Hosting
Install Firebase CLI if needed:
```bash
npm install -g firebase-tools
```

Login:
```bash
firebase login
```

Deploy:
```bash
firebase deploy
```

## Notes
- UI/routes remain unchanged.
- Auth + Firestore integrations are preserved.
- Deployment is Firebase Hosting compatible (framework-aware hosting config).
