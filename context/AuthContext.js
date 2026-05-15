import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import { getUserProfile, setActivity, upsertUserProfile } from '../services/firestore';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!auth) {
      throw new Error('Firebase Auth is not configured. Add NEXT_PUBLIC_FIREBASE_* env variables.');
    }

    return onAuthStateChanged(auth, async (nextUser) => {
      setUser(nextUser);
      if (!nextUser) {
        setProfile(null);
        setReady(true);
        return;
      }
      const existing = await getUserProfile(nextUser.uid);
      setProfile(existing);
      setReady(true);
    });
  }, []);

  const createProfileIfNeeded = async (firebaseUser) => {
    const username = (firebaseUser.email || firebaseUser.displayName || `user-${firebaseUser.uid.slice(0, 8)}`)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, '.');

    const payload = {
      uid: firebaseUser.uid,
      displayName: firebaseUser.displayName || username,
      username,
      email: firebaseUser.email || '',
      bio: 'New listener on NearBeat',
      avatar: (firebaseUser.displayName || 'NB').slice(0, 2).toUpperCase(),
    };

    await upsertUserProfile(firebaseUser.uid, payload);
    await setActivity({ uid: firebaseUser.uid, type: 'auth', action: 'login' });
    const saved = await getUserProfile(firebaseUser.uid);
    setProfile(saved);
  };

  const loginWithEmail = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    await createProfileIfNeeded(cred.user);
  };

  const signupWithEmail = async (email, password) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await createProfileIfNeeded(cred.user);
  };

  const loginWithGoogle = async () => {
    const cred = await signInWithPopup(auth, new GoogleAuthProvider());
    await createProfileIfNeeded(cred.user);
  };

  const logout = async () => {
    await signOut(auth);
    setProfile(null);
  };

  const value = useMemo(
    () => ({
      user,
      profile,
      ready,
      isAuthed: Boolean(user),
      loginWithEmail,
      signupWithEmail,
      loginWithGoogle,
      logout,
    }),
    [user, profile, ready],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
