# NearBeat

NearBeat is a Next.js social music app with Firebase Authentication + Firestore + Firebase Hosting deployment.

## Stack
- Next.js
- React
- Tailwind CSS
- Firebase Auth
- Firestore
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
