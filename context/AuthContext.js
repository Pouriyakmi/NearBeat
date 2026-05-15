import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { setActivity, upsertUserProfile } from '../services/firestore';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => onAuthStateChanged(auth, (user) => {
    setSession(user ? { uid: user.uid, email: user.email, displayName: user.displayName || 'NearBeat User' } : null);
    setReady(true);
  }), []);

  const ensureProfile = async (user) => {
    const handle = (user.email || `user-${user.uid.slice(0, 6)}`).split('@')[0];
    await upsertUserProfile(user.uid, {
      uid: user.uid,
      email: user.email || null,
      displayName: user.displayName || handle,
      username: handle.toLowerCase(),
      avatar: (user.displayName || handle).slice(0, 2).toUpperCase(),
      bio: 'Listening around you on NearBeat',
      visibility: 'nearby',
      online: true,
    });
    await setActivity({ uid: user.uid, type: 'auth_login' });
  };

  const loginWithEmail = async ({ email, password }) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    await ensureProfile(result.user);
  };

  const registerWithEmail = async ({ email, password }) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await ensureProfile(result.user);
  };

  const loginWithGoogle = async () => {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(auth, provider);
    await ensureProfile(result.user);
  };

  const logout = async () => signOut(auth);

  const value = useMemo(() => ({ session, ready, isAuthed: !!session, loginWithEmail, registerWithEmail, loginWithGoogle, logout }), [session, ready]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() { return useContext(AuthContext); }
