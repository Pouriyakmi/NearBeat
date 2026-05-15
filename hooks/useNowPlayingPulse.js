import { useEffect, useState } from 'react';

export function useNowPlayingPulse() {
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setPulse((currentPulse) => (currentPulse + 1) % 4);
    }, 900);

    return () => window.clearInterval(timer);
  }, []);

  return pulse;
}
