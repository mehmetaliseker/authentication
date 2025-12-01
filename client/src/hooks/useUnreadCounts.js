import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../components/auth/hooks/useAuth';

const API_BASE_URL = 'http://localhost:3001';
const TOKEN = () => localStorage.getItem('accessToken');

export function useUnreadCounts() {
  const { user } = useAuth();
  const [unreadMessageCount, setUnreadMessageCount] = useState(0);
  const [unreadChatbotCount, setUnreadChatbotCount] = useState(0);
  const [pendingRequestsCount, setPendingRequestsCount] = useState(0);
  const [loading, setLoading] = useState(false);

  const loadUnreadCounts = useCallback(async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      // Mesaj sayısı
      const messageResponse = await fetch(`${API_BASE_URL}/messages/unread-count/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${TOKEN()}`,
          'Content-Type': 'application/json',
        },
      });
      if (messageResponse.ok) {
        const messageData = await messageResponse.json();
        setUnreadMessageCount(messageData.count || 0);
      }

      // Chatbot mesaj sayısı
      const chatbotResponse = await fetch(`${API_BASE_URL}/chatbot/unread-count/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${TOKEN()}`,
          'Content-Type': 'application/json',
        },
      });
      if (chatbotResponse.ok) {
        const chatbotData = await chatbotResponse.json();
        setUnreadChatbotCount(chatbotData.count || 0);
      }

      // Gelen istek sayısı
      const requestsResponse = await fetch(`${API_BASE_URL}/friendships/pending-requests-count/${user.id}`, {
        headers: {
          'Authorization': `Bearer ${TOKEN()}`,
          'Content-Type': 'application/json',
        },
      });
      if (requestsResponse.ok) {
        const requestsData = await requestsResponse.json();
        setPendingRequestsCount(requestsData.count || 0);
      }
    } catch (err) {
      console.error('Okunmamış sayıları yükleme hatası:', err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    loadUnreadCounts();
    
    // Her 5 saniyede bir güncelle
    const interval = setInterval(loadUnreadCounts, 5000);
    
    return () => clearInterval(interval);
  }, [loadUnreadCounts]);

  return {
    unreadMessageCount,
    unreadChatbotCount,
    pendingRequestsCount,
    loading,
    refreshCounts: loadUnreadCounts,
  };
}


