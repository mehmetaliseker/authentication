import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../components/auth/hooks/useAuth';

const API_BASE_URL = 'http://localhost:3001/messages';
const TOKEN = () => localStorage.getItem('accessToken');

export function useUnreadMessageCount(senderId) {
  const { user } = useAuth();
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadCount = useCallback(async () => {
    if (!user?.id || !senderId) {
      setCount(0);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/unread-count/${user.id}/${senderId}`, {
        headers: {
          'Authorization': `Bearer ${TOKEN()}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setCount(data.count || 0);
      } else {
        setCount(0);
      }
    } catch (err) {
      console.error('Okunmamış mesaj sayısı yükleme hatası:', err);
      setCount(0);
    } finally {
      setLoading(false);
    }
  }, [user?.id, senderId]);

  useEffect(() => {
    loadCount();
    
    // Her 3 saniyede bir güncelle
    const interval = setInterval(loadCount, 3000);
    
    return () => clearInterval(interval);
  }, [loadCount]);

  return {
    count,
    loading,
    refresh: loadCount,
  };
}


