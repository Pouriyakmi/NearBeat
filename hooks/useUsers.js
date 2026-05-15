import { useEffect, useState } from 'react';
import { listUsers } from '../services/firestore';

export function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => {
    listUsers().then(setUsers).catch((e) => setError(e.message)).finally(() => setLoading(false));
  }, []);
  return { users, loading, error };
}
