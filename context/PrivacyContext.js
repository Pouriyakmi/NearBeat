import { createContext, useContext, useEffect, useMemo, useState } from 'react';

const PrivacyContext = createContext(null);
const STORAGE_KEY = 'nearbeat_privacy_v1';

const defaults = {
  hideDistance: false,
  visibleTo: 'nearby',
  online: true,
  approximateLocation: 'Nearby',
  lastUpdatedAt: null,
};

export function PrivacyProvider({ children }) {
  const [privacy, setPrivacy] = useState(defaults);

  useEffect(() => {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) setPrivacy({ ...defaults, ...JSON.parse(saved) });
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(privacy));
  }, [privacy]);

  const updatePrivacy = (patch) => setPrivacy((prev) => ({ ...prev, ...patch }));
  const refreshLocation = () => {
    const fakeLocations = ['Nearby', '120m away', '430m away', '1.8km away'];
    const next = fakeLocations[Math.floor(Math.random() * fakeLocations.length)];
    updatePrivacy({ approximateLocation: next, lastUpdatedAt: new Date().toISOString() });
  };

  const value = useMemo(() => ({ privacy, updatePrivacy, refreshLocation }), [privacy]);
  return <PrivacyContext.Provider value={value}>{children}</PrivacyContext.Provider>;
}

export function usePrivacy() {
  return useContext(PrivacyContext);
}
