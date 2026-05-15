import { useEffect, useState } from 'react';
import { listUsers } from '../services/firestore';

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    listUsers()
      .then((rows) => {
        if (mounted) setUsers(rows);
      })
      .catch((error) => {
        console.error('Failed to load users', error);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });
    return () => {
      mounted = false;
    };
  }, []);

  return { users, loading };
}
