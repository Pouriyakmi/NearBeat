import { useEffect, useState } from 'react';
import { listPlaylists } from '../services/firestore';

export function usePlaylists() {
  const [playlists, setPlaylists] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    listPlaylists()
      .then((rows) => {
        if (mounted) setPlaylists(rows);
      })
      .catch((error) => {
        console.error('Failed to load playlists', error);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return { playlists, loading };
}
