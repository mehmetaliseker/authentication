import { useState, useEffect, useCallback } from 'react';

const API_BASE_URL = 'http://localhost:3001';

export function useLoginStats(userId, period = 'monthly') {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLoginStats = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch(
        `${API_BASE_URL}/auth/login-stats/${userId}?period=${period}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('accessToken')}`
          }
        }
      );
      
      if (response.ok) {
        const data = await response.json();
        setStats(data);
        return data;
      } else {
        throw new Error('İstatistik verileri alınamadı');
      }
    } catch (err) {
      setError(err.message);
      console.error('İstatistik yükleme hatası:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [userId, period]);

  useEffect(() => {
    if (userId) {
      fetchLoginStats();
    }
  }, [userId, period, fetchLoginStats]);

  return { stats, loading, error, refetch: fetchLoginStats };
}
