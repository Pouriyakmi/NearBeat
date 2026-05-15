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
  const ref = doc(db, 'users', uid);
  await setDoc(ref, { ...payload, updatedAt: serverTimestamp() }, { merge: true });
}

export async function getUserProfile(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export function subscribeFeed(callback) {
  const q = query(collection(db, 'posts'), orderBy('createdAt', 'desc'), limit(20));
  return onSnapshot(q, (snap) => callback(snap.docs.map((d) => ({ id: d.id, ...d.data() }))));
}

export async function createPost(payload) {
  await addDoc(collection(db, 'posts'), { ...payload, createdAt: serverTimestamp() });
}

export async function listPlaylists() {
  const snap = await getDocs(query(collection(db, 'playlists'), orderBy('createdAt', 'desc'), limit(30)));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function addPlaylist(payload) {
  await addDoc(collection(db, 'playlists'), { ...payload, createdAt: serverTimestamp() });
}

export async function listUsers() {
  const snap = await getDocs(query(collection(db, 'users'), limit(30)));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
}

export async function setActivity(payload) {
  await addDoc(collection(db, 'activity'), { ...payload, createdAt: serverTimestamp() });
}

export async function updateUserLocation(uid, approximateLocation) {
  await updateDoc(doc(db, 'users', uid), { approximateLocation, updatedAt: serverTimestamp() });
}
