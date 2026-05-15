import { useEffect, useState } from 'react';
import { subscribeFeed } from '../services/firestore';

export function useFeed() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const unsub = subscribeFeed((posts) => { setItems(posts); setLoading(false); }, (err) => { setError(err.message); setLoading(false); });
    return () => unsub();
  }, []);

  return { items, loading, error };
}
