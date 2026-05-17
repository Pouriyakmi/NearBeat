import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  startAt,
  endAt,
  where,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

function ensureDb() {
  if (!db) throw new Error('Firestore is not configured. Missing NEXT_PUBLIC_FIREBASE_* variables.');
  return db;
}

function stripUndefinedFields(payload) {
  return Object.fromEntries(Object.entries(payload).filter(([, value]) => value !== undefined));
}

export function buildSystemId(uid) {
  return `NB-${uid.slice(0, 6).toUpperCase()}`;
}

export async function ensureUserProfile(firebaseUser, extras = {}) {
  const ref = doc(ensureDb(), 'users', firebaseUser.uid);
  const existing = await getDoc(ref);
  const baseName = firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'listener';
  const username = baseName.toLowerCase().replace(/[^a-z0-9_]/g, '').slice(0, 18) || `user${firebaseUser.uid.slice(0, 5)}`;
  const payload = {
    uid: firebaseUser.uid,
    systemId: buildSystemId(firebaseUser.uid),
    displayName: firebaseUser.displayName || baseName,
    username,
    email: firebaseUser.email || '',
    photoURL: firebaseUser.photoURL || '',
    bio: existing.exists() ? existing.data().bio || '' : '',
    location: existing.exists() ? existing.data().location || '' : '',
    locationMeta: existing.exists() ? existing.data().locationMeta || null : null,
    distancePreferenceKm: existing.exists() ? existing.data().distancePreferenceKm || 25 : 25,
    createdAt: existing.exists() ? existing.data().createdAt || serverTimestamp() : serverTimestamp(),
    updatedAt: serverTimestamp(),
    ...extras,
  };
  await setDoc(ref, payload, { merge: true });
}

export async function getUserProfile(uid) { const s = await getDoc(doc(ensureDb(), 'users', uid)); return s.exists() ? { id: s.id, ...s.data() } : null; }
export function subscribeFeed(callback, onError) {
  return onSnapshot(query(collection(ensureDb(), 'posts'), orderBy('createdAt', 'desc'), limit(40)), (snap) => callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }))), onError);
}

export async function createMusicPost(payload) {
  return addDoc(collection(ensureDb(), 'posts'), stripUndefinedFields({ ...payload, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }));
}

export async function listUsers() { const s = await getDocs(query(collection(ensureDb(), 'users'), limit(40))); return s.docs.map((d) => ({ id: d.id, ...d.data() })); }
export async function listPlaylists() { const s = await getDocs(query(collection(ensureDb(), 'playlists'), orderBy('createdAt', 'desc'), limit(30))); return s.docs.map((d) => ({ id: d.id, ...d.data() })); }
export async function createActivity(payload) { return addDoc(collection(ensureDb(), 'activity'), { ...payload, createdAt: serverTimestamp() }); }
export async function updateUserProfile(uid, patch) { return setDoc(doc(ensureDb(), 'users', uid), { ...patch, updatedAt: serverTimestamp() }, { merge: true }); }

export async function searchUsers(term) {
  const t = term.trim().toLowerCase();
  if (!t) return [];
  const usersRef = collection(ensureDb(), 'users');
  const queries = [
    query(usersRef, orderBy('username'), startAt(t), endAt(`${t}\uf8ff`), limit(10)),
    query(usersRef, orderBy('displayName'), startAt(t), endAt(`${t}\uf8ff`), limit(10)),
    query(usersRef, where('systemId', '==', t.toUpperCase()), limit(5)),
  ];
  const snaps = await Promise.all(queries.map((q) => getDocs(q)));
  const map = new Map();
  snaps.forEach((s) => s.docs.forEach((d) => map.set(d.id, { id: d.id, ...d.data() })));
  return Array.from(map.values());
}

export async function setFavoriteTrack(uid, trackId, trackData) {
  return setDoc(doc(ensureDb(), 'users', uid, 'favorites', trackId), { ...trackData, pinnedAt: serverTimestamp() }, { merge: true });
}

export async function listFavoriteTracks(uid) {
  const snap = await getDocs(query(collection(ensureDb(), 'users', uid, 'favorites'), limit(30)));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function createPlaylist(uid, payload) {
  return addDoc(collection(ensureDb(), 'playlists'), { ...payload, ownerUid: uid, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
}
