import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const AuthContext = createContext(null);
const STORAGE_KEY = 'nearbeat_session_v1';

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = typeof window !== 'undefined' ? window.localStorage.getItem(STORAGE_KEY) : null;
    if (saved) setSession(JSON.parse(saved));
    setReady(true);
  }, []);

  const login = ({ identifier, method }) => {
    const next = { identifier, method, loggedInAt: new Date().toISOString() };
    setSession(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const logout = () => {
    setSession(null);
    window.localStorage.removeItem(STORAGE_KEY);
  };

  const value = useMemo(() => ({ session, ready, login, logout, isAuthed: Boolean(session) }), [session, ready]);
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
