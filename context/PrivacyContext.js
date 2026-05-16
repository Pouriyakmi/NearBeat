import { createContext, useContext, useMemo, useState } from 'react';

const PrivacyContext = createContext(null);
const GEO_TIMEOUT_MS = 6000;

export function PrivacyProvider({ children }) {
  const [privacy, setPrivacy] = useState({ hideDistance: false, visibleTo: 'nearby', approximateLocation: 'Unavailable', locationMeta: null, lastUpdatedAt: null });
  const updatePrivacy = (patch) => setPrivacy((prev) => ({ ...prev, ...patch }));

  const refreshLocation = () => {
    if (!navigator.geolocation) {
      updatePrivacy({ approximateLocation: 'Geolocation unavailable' });
      return Promise.resolve(null);
    }
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition((pos) => {
        const lat = Number(pos.coords.latitude.toFixed(2));
        const lng = Number(pos.coords.longitude.toFixed(2));
        updatePrivacy({ approximateLocation: `${lat}, ${lng}`, locationMeta: { lat, lng, accuracy: pos.coords.accuracy }, lastUpdatedAt: new Date().toISOString() });
        resolve({ lat, lng, accuracy: pos.coords.accuracy });
      }, () => {
        updatePrivacy({ approximateLocation: 'Location denied', locationMeta: null, lastUpdatedAt: new Date().toISOString() });
        resolve(null);
      }, { enableHighAccuracy: false, timeout: GEO_TIMEOUT_MS, maximumAge: 120000 });
    });
  };

  const value = useMemo(() => ({ privacy, updatePrivacy, refreshLocation }), [privacy]);
  return <PrivacyContext.Provider value={value}>{children}</PrivacyContext.Provider>;
}

export const usePrivacy = () => useContext(PrivacyContext);
