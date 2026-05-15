import { useEffect, useState } from 'react';
import { collection, query, orderBy, startAt, endAt, onSnapshot, limit, where } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function useRealTimeSearch(searchTerm) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setResults([]);
      return;
    }

    if (!db) {
      setError('Firestore is not configured');
      return;
    }

    setLoading(true);
    const t = searchTerm.trim().toLowerCase();

    const usersRef = collection(db, 'users');
    const queries = [
      query(
        usersRef,
        orderBy('username'),
        startAt(t),
        endAt(`${t}\uf8ff`),
        limit(10)
      ),
      query(
        usersRef,
        orderBy('displayName'),
        startAt(t),
        endAt(`${t}\uf8ff`),
        limit(10)
      ),
      query(usersRef, where('systemId', '==', t.toUpperCase()), limit(5)),
    ];

    const unsubscribes = queries.map((q) =>
      onSnapshot(
        q,
        (snap) => {
          try {
            const map = new Map();
            snap.docs.forEach((doc) =>
              map.set(doc.id, { id: doc.id, ...doc.data() })
            );
            setResults((prev) => {
              const allResults = new Map(prev.map((u) => [u.id, u]));
              map.forEach((v, k) => allResults.set(k, v));
              return Array.from(allResults.values());
            });
            setLoading(false);
          } catch (err) {
            setError(err.message);
            setLoading(false);
          }
        },
        (err) => {
          setError(err.message);
          setLoading(false);
        }
      )
    );

    return () => unsubscribes.forEach((unsub) => unsub());
  }, [searchTerm]);

  return { results, loading, error };
}
