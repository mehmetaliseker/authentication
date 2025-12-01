import { useState, useCallback } from 'react';

const API_BASE_URL = 'http://localhost:3001/chatbot';
const TOKEN = () => localStorage.getItem('accessToken');

const handleAuthError = (setMessage) => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  setMessage('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
};

export function useChatbot() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  // Konuşma mesajlarını yükle
  const loadConversation = useCallback(async (userId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/conversation/${userId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${TOKEN()}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.status === 401) {
        handleAuthError(setMessage);
        return [];
      }
      
      if (!response.ok) {
        let errorMessage = `HTTP ${response.status} hatası`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (e) {
          // JSON parse hatası
        }
        setError(errorMessage);
        setMessages([]);
        return [];
      }
      
      const data = await response.json();
      const messagesArray = Array.isArray(data) ? data : (data.data || []);
      setMessages(messagesArray);
      return messagesArray;
    } catch (err) {
      const errorMessage = err.message || 'Beklenmeyen bir hata oluştu';
      setError(errorMessage);
      console.error('Konuşma yükleme hatası:', err);
      setMessages([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Mesaj gönder
  const sendMessage = useCallback(async (userId, content) => {
    if (!content.trim()) return false;
    
    setError(null);
    setIsSending(true);
    
    // Optimistic update: Kullanıcı mesajını hemen ekle
    const userMessage = {
      id: `temp-${Date.now()}`,
      user_id: userId,
      message_type: 'user',
      content: content.trim(),
      is_read: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    setMessages((prev) => {
      // Eğer aynı temp ID'ye sahip mesaj varsa ekleme
      if (prev.some((m) => m.id === userMessage.id)) {
        return prev;
      }
      return [...prev, userMessage];
    });
    
    // Arka planda mesajı gönder
    try {
      const response = await fetch(`${API_BASE_URL}/send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${TOKEN()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: content.trim(),
        }),
      });

      if (response.status === 401) {
        handleAuthError(setMessage);
        // Hata durumunda temp mesajı kaldır
        setMessages((prev) => prev.filter((m) => m.id !== userMessage.id));
        setIsSending(false);
        return false;
      }

      const data = await response.json();
      if (response.ok) {
        // Temp mesajı kaldır ve gerçek mesajları ekle
        const realUserMessage = {
          ...userMessage,
          id: data.data?.id || userMessage.id,
        };
        
        // Chatbot yanıtını ekle
        const assistantMessage = data.data || data;
        
        setMessages((prev) => {
          // Temp mesajı kaldır
          const withoutTemp = prev.filter((m) => m.id !== userMessage.id);
          // Gerçek mesajları ekle
          return [...withoutTemp, realUserMessage, assistantMessage];
        });
        
        // Chatbot için başarı mesajı gösterme
        setIsSending(false);
        return true;
      } else {
        setError(data.message || 'Mesaj gönderilemedi');
        // Hata durumunda temp mesajı kaldır
        setMessages((prev) => prev.filter((m) => m.id !== userMessage.id));
        setIsSending(false);
        return false;
      }
    } catch (err) {
      setError('Beklenmeyen bir hata oluştu.');
      console.error('Mesaj gönderme hatası:', err);
      // Hata durumunda temp mesajı kaldır
      setMessages((prev) => prev.filter((m) => m.id !== userMessage.id));
      setIsSending(false);
      return false;
    }
  }, []);

  return {
    messages,
    setMessages,
    loading,
    error,
    message,
    setMessage,
    isSending,
    loadConversation,
    sendMessage,
  };
}

