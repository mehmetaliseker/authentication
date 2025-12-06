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
      
      // Duplicate kontrolü: Aynı ID'ye sahip mesajları filtrele ve sırala
      const uniqueMessages = messagesArray.reduce((acc, msg) => {
        // Aynı ID'ye sahip mesaj varsa ekleme
        if (!acc.some((m) => m.id === msg.id)) {
          acc.push(msg);
        }
        return acc;
      }, []);
      
      // Tarihe göre sırala
      uniqueMessages.sort((a, b) => {
        const dateA = new Date(a.created_at);
        const dateB = new Date(b.created_at);
        return dateA - dateB;
      });
      
      setMessages(uniqueMessages);
      return uniqueMessages;
    } catch (err) {
      const errorMessage = err.message || 'Beklenmeyen bir hata oluştu';
      setError(errorMessage);
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
        // Backend'den gelen gerçek mesajları al - tüm olası yapıları kontrol et
        let realUserMessage = null;
        let assistantMessage = null;
        
        // Yapı 1: { message: string, data: { userMessage, assistantMessage } }
        if (data.data && typeof data.data === 'object') {
          realUserMessage = data.data.userMessage || data.data.user_message;
          assistantMessage = data.data.assistantMessage || data.data.assistant_message;
        }
        
        // Yapı 2: Direkt { userMessage, assistantMessage }
        if (!realUserMessage && !assistantMessage) {
          realUserMessage = data.userMessage || data.user_message;
          assistantMessage = data.assistantMessage || data.assistant_message;
        }
        
        // Yapı 3: Array olarak geliyorsa
        if (Array.isArray(data)) {
          realUserMessage = data.find(m => m.message_type === 'user');
          assistantMessage = data.find(m => m.message_type === 'assistant');
        }
        
        setMessages((prev) => {
          // Temp mesajı bul (gönderilen mesajla eşleşen)
          const tempMessage = prev.find((m) => 
            String(m.id).startsWith('temp-') && 
            m.content === content.trim() && 
            m.message_type === 'user'
          );
          
          // Temp mesajı kaldır
          let updatedMessages = prev.filter((m) => m !== tempMessage);
          
          // Gerçek user mesajını ekle (duplicate kontrolü ile)
          if (realUserMessage && realUserMessage.id) {
            const userExists = updatedMessages.some((m) => m.id === realUserMessage.id);
            if (!userExists) {
              updatedMessages = [...updatedMessages, realUserMessage];
            }
          } else if (tempMessage) {
            // Eğer backend'den user mesajı gelmediyse, temp mesajı olduğu gibi bırak
            updatedMessages = [...updatedMessages, tempMessage];
          }
          
          // Assistant mesajını ekle (duplicate kontrolü ile)
          if (assistantMessage) {
            // ID kontrolü yap, yoksa oluştur
            const assistantId = assistantMessage.id || `assistant-${Date.now()}`;
            const assistantWithId = { 
              ...assistantMessage, 
              id: assistantId,
              message_type: assistantMessage.message_type || 'assistant'
            };
            
            const assistantExists = updatedMessages.some((m) => m.id === assistantId);
            if (!assistantExists) {
              updatedMessages = [...updatedMessages, assistantWithId];
            }
          }
          
          // Tarihe göre sırala
          return updatedMessages.sort((a, b) => {
            const dateA = new Date(a.created_at);
            const dateB = new Date(b.created_at);
            return dateA - dateB;
          });
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

