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
    setLoading(true);
    setError(null);
    
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
        return false;
      }

      const data = await response.json();
      if (response.ok) {
        // Kullanıcı mesajını ekle
        const userMessage = {
          id: Date.now(),
          user_id: userId,
          message_type: 'user',
          content: content.trim(),
          created_at: new Date().toISOString(),
        };
        
        // Chatbot yanıtını ekle
        const assistantMessage = data.data || data;
        
        setMessages((prev) => {
          const newMessages = [...prev, userMessage, assistantMessage];
          return newMessages;
        });
        
        setMessage(data.message || 'Mesaj gönderildi');
        return true;
      } else {
        setError(data.message || 'Mesaj gönderilemedi');
        return false;
      }
    } catch (err) {
      setError('Beklenmeyen bir hata oluştu.');
      console.error('Mesaj gönderme hatası:', err);
      setLoading(false);
      return false;
    }
  }, []);

  return {
    messages,
    loading,
    error,
    message,
    setMessage,
    loadConversation,
    sendMessage,
  };
}

