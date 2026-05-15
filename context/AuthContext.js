import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { GoogleAuthProvider, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { createActivity, ensureUserProfile, getUserProfile } from '../services/firestore';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [ready, setReady] = useState(false);

  const syncProfile = async (firebaseUser) => {
    await ensureUserProfile(firebaseUser);
    const p = await getUserProfile(firebaseUser.uid);
    setProfile(p);
  };

  useEffect(() => onAuthStateChanged(auth, async (nextUser) => {
    setUser(nextUser);
    if (!nextUser) {
      setProfile(null);
      setReady(true);
      return;
    }
    await syncProfile(nextUser);
    setReady(true);
  }), []);

  const loginWithEmail = async (email, password) => {
    const cred = await signInWithEmailAndPassword(auth, email, password);
    await syncProfile(cred.user);
    await createActivity({ uid: cred.user.uid, type: 'auth', action: 'login_email' });
  };
  const signupWithEmail = async (email, password) => {
    const cred = await createUserWithEmailAndPassword(auth, email, password);
    await syncProfile(cred.user);
    await createActivity({ uid: cred.user.uid, type: 'auth', action: 'signup_email' });
  };
  const loginWithGoogle = async () => {
    const cred = await signInWithPopup(auth, new GoogleAuthProvider());
    await syncProfile(cred.user);
    await createActivity({ uid: cred.user.uid, type: 'auth', action: 'login_google' });
  };

  const value = useMemo(() => ({ user, profile, ready, isAuthed: !!user, loginWithEmail, signupWithEmail, loginWithGoogle, logout: () => signOut(auth) }), [user, profile, ready]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
