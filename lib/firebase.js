import { getApps, initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

function resolveStorageBucket() {
  const configuredBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '';
  const projectId = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '';

  if (configuredBucket.endsWith('.firebasestorage.app') && projectId) {
    if (typeof window !== 'undefined') {
      console.warn('[firebase] NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET uses .firebasestorage.app. Falling back to appspot bucket for SDK uploads:', `${projectId}.appspot.com`);
    }
    return `${projectId}.appspot.com`;
  }

  return configuredBucket;
}

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: resolveStorageBucket(),
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const requiredKeys = ['apiKey', 'authDomain', 'projectId', 'storageBucket', 'messagingSenderId', 'appId'];
const missingKeys = requiredKeys.filter((key) => !firebaseConfig[key]);
const hasFirebaseConfig = missingKeys.length === 0;
if (!hasFirebaseConfig && typeof window !== 'undefined') {
  throw new Error(`Missing Firebase config keys: ${missingKeys.join(', ')}. Configure NEXT_PUBLIC_FIREBASE_* env vars.`);
}

const app = hasFirebaseConfig ? (getApps().length ? getApps()[0] : initializeApp(firebaseConfig)) : null;
export const auth = app ? getAuth(app) : null;
export const db = app ? getFirestore(app) : null;
export default app;
