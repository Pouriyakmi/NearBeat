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
  updateDoc,
  where,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

export async function upsertUserProfile(uid, payload) {
  if (!db) return;
  const ref = doc(db, 'users', uid);
  await setDoc(ref, { ...payload, updatedAt: serverTimestamp() }, { merge: true });
}

export async function getUserProfile(uid) {
  if (!db) return null;
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export function subscribeFeed(callback) {
  if (!db) { callback([]); return () => {}; }
  const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(20));
  return onSnapshot(q, (snap) => callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
}

export async function createPost(payload) {
  if (!db) return;
  await addDoc(collection(db, 'posts'), { ...payload, createdAt: serverTimestamp() });
}

export async function listPlaylists() {
  if (!db) return [];
  const snap = await getDocs(query(collection(db, 'playlists'), orderBy('createdAt', 'desc'), limit(30)));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addPlaylist(payload) {
  if (!db) return;
  await addDoc(collection(db, 'playlists'), { ...payload, createdAt: serverTimestamp() });
}

export async function listUsers() {
  if (!db) return [];
  const snap = await getDocs(query(collection(db, 'users'), limit(30)));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function setActivity(payload) {
  if (!db) return;
  await addDoc(collection(db, 'activity'), { ...payload, createdAt: serverTimestamp() });
}

export async function updateUserLocation(uid, approximateLocation) {
  if (!db) return;
  await updateDoc(doc(db, 'users', uid), { approximateLocation, updatedAt: serverTimestamp() });
}
