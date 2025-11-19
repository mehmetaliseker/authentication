import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../auth/hooks/useAuth';

const API_BASE_URL = 'http://localhost:3001';

export function useAllLoginStats() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    weekly: { data: [], total: 0 },
    monthly: { data: [], total: 0 },
    '6months': { data: [], total: 0 },
    yearly: { data: [], total: 0 }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const periods = [
    { value: 'weekly', label: 'Haftalık' },
    { value: 'monthly', label: 'Aylık' },
    { value: '6months', label: '6 Aylık' },
    { value: 'yearly', label: 'Yıllık' }
  ];

  const fetchAllStats = useCallback(async (userId) => {
    try {
      setLoading(true);
      setError(null);
      const newStats = {};

      for (const period of periods) {
        try {
          const response = await fetch(
            `${API_BASE_URL}/auth/login-stats/${userId}?period=${period.value}`
          );
          
          if (response.ok) {
            const data = await response.json();
            newStats[period.value] = {
              data: data.data || [],
              total: data.data ? data.data.reduce((sum, item) => sum + item.count, 0) : 0
            };
          } else {
            console.log(`${period.label} verisi alınamadı:`, response.status);
            newStats[period.value] = { data: [], total: 0 };
          }
        } catch (error) {
          console.error(`${period.label} verileri alınamadı:`, error);
          newStats[period.value] = { data: [], total: 0 };
        }
      }

      setStats(newStats);
    } catch (error) {
      setError(error.message);
      console.error('İstatistik verileri yüklenemedi:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (user?.id) {
      fetchAllStats(user.id);
    }
  }, [user?.id, fetchAllStats]);

  return { stats, loading, error, refetch: () => fetchAllStats(user?.id) };
}
