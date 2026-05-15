import { useEffect, useState } from 'react';
import { listUsers } from '../services/firestore';

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    listUsers().then((rows) => {
      if (mounted) {
        setUsers(rows);
        setLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, []);

  return { users, loading };
}
