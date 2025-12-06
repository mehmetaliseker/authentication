import { useState, useCallback, useEffect } from 'react';
import { useSocket } from '../contexts/SocketContext';

const API_BASE_URL = 'http://localhost:3001/messages';
const TOKEN = () => localStorage.getItem('accessToken');

const handleAuthError = (setMessage) => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  setMessage('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
};

export function useMessages() {
  const { socket, isConnected } = useSocket();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  // Socket event'lerini dinle 
  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleNewMessage = (data) => {
      if (data.message) {
        setMessages((prev) => {
          // Mesaj zaten varsa ekleme
          if (prev.some((m) => m.id === data.message.id)) {
            return prev;
          }
          return [...prev, data.message];
        });
      }
    };

    const handleMessageDeleted = (data) => {
      if (data.message_id) {
        setMessages((prev) => prev.filter((m) => m.id !== data.message_id));
      }
    };

    const handleReadReceipt = (data) => {
      if (data.message_id) {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === data.message_id
              ? { ...m, is_read: true, read_at: data.read_at }
              : m
          )
        );
      }
    };

    const handleConversationRead = (data) => {
      // Tüm mesajları okundu olarak işaretle
      setMessages((prev) =>
        prev.map((m) =>
          m.sender_id === data.receiver_id && !m.is_read
            ? { ...m, is_read: true, read_at: new Date().toISOString() }
            : m
        )
      );
    };

    socket.on('message:new', handleNewMessage);
    socket.on('message:deleted', handleMessageDeleted);
    socket.on('message:read-receipt', handleReadReceipt);
    socket.on('message:conversation-read', handleConversationRead);

    return () => {
      socket.off('message:new', handleNewMessage);
      socket.off('message:deleted', handleMessageDeleted);
      socket.off('message:read-receipt', handleReadReceipt);
      socket.off('message:conversation-read', handleConversationRead);
    };
  }, [socket, isConnected]);

  // Konuşma mesajlarını yükle
  const loadConversation = useCallback(async (userId1, userId2, currentUserId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/conversation/${userId1}/${userId2}/${currentUserId}`, {
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
  const sendMessage = useCallback(async (senderId, receiverId, content) => {
    setLoading(true);
    setError(null);
    
    try {
      // Socket.io kullanarak gönder - gerçek zamanlı
      if (socket && isConnected) {
        return new Promise((resolve) => {
          socket.emit('message:send', {
            sender_id: senderId,
            receiver_id: receiverId,
            content: content.trim(),
          }, (response) => {
            setLoading(false);
            if (response.error) {
              setError(response.error);
              resolve(false);
              return;
            }

            if (response.success && response.data) {
              const data = response.data;
              const newMessage = data.data || data;
              // Mesaj socket event'i ile otomatik eklenecek, burada sadece state'i güncelle
              setMessages((prev) => {
                if (prev.some((m) => m.id === newMessage?.id)) {
                  return prev;
                }
                return [...prev, newMessage];
              });
              setMessage(data.message || 'Mesaj gönderildi');
              resolve(true);
            } else {
              setError('Mesaj gönderilemedi');
              resolve(false);
            }
          });
        });
      }

      // Fallback: HTTP API kullan
      const response = await fetch(`${API_BASE_URL}/send`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${TOKEN()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sender_id: senderId,
          receiver_id: receiverId,
          content: content.trim(),
        }),
      });

      if (response.status === 401) {
        handleAuthError(setMessage);
        return false;
      }

      const data = await response.json();
      if (response.ok) {
        const newMessage = data.data || data;
        setMessages((prev) => {
          // Mesaj zaten varsa ekleme
          if (prev.some((m) => m.id === newMessage?.id)) {
            return prev;
          }
          return [...prev, newMessage];
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
  }, [socket, isConnected]);

  // Mesajı sil
  const deleteMessage = useCallback(async (messageId, userId) => {
    setLoading(true);
    setError(null);
    
    try {
      // Socket.io kullanarak sil - gerçek zamanlı
      if (socket && isConnected) {
        return new Promise((resolve) => {
          socket.emit('message:delete', {
            message_id: messageId,
            user_id: userId,
          }, (response) => {
            setLoading(false);
            if (response.error) {
              setError(response.error);
              resolve(false);
              return;
            }

            if (response.success && response.data) {
              const data = response.data;
              // Mesaj socket event'i ile otomatik silinecek, burada sadece state'i güncelle
              setMessages((prev) => prev.filter((m) => m.id !== messageId));
              setMessage(data.message || 'Mesaj silindi');
              resolve(true);
            } else {
              setError('Mesaj silinemedi');
              resolve(false);
            }
          });
        });
      }

      // Fallback: HTTP API kullan
      const response = await fetch(`${API_BASE_URL}/${messageId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${TOKEN()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ user_id: userId }),
      });

      if (response.status === 401) {
        handleAuthError(setMessage);
        return false;
      }

      const data = await response.json();
      if (response.ok) {
        setMessages((prev) => prev.filter((m) => m.id !== messageId));
        setMessage(data.message || 'Mesaj silindi');
        return true;
      } else {
        setError(data.message || 'Mesaj silinemedi');
        return false;
      }
    } catch (err) {
      setError('Beklenmeyen bir hata oluştu.');
      console.error('Mesaj silme hatası:', err);
      setLoading(false);
      return false;
    }
  }, [socket, isConnected]);

  // Mesajı okundu olarak işaretle
  const markAsRead = useCallback(async (messageId, userId) => {
    if (!socket || !isConnected) {
      // Fallback: HTTP API kullan
      try {
        const response = await fetch(`${API_BASE_URL}/${messageId}/read`, {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${TOKEN()}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ user_id: userId }),
        });

        if (response.ok) {
          const data = await response.json();
          setMessages((prev) =>
            prev.map((m) =>
              m.id === messageId ? { ...m, is_read: true, read_at: new Date().toISOString() } : m
            )
          );
          return true;
        }
        return false;
      } catch (err) {
        console.error('Mesaj okundu işaretleme hatası:', err);
        return false;
      }
    }

    return new Promise((resolve) => {
      socket.emit('message:read', {
        message_id: messageId,
        user_id: userId,
      }, (response) => {
        if (response.success && response.data) {
          const updatedMessage = response.data.message;
          setMessages((prev) =>
            prev.map((m) =>
              m.id === messageId
                ? { ...m, is_read: true, read_at: updatedMessage.read_at }
                : m
            )
          );
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }, [socket, isConnected]);

  // Konuşmayı okundu olarak işaretle
  const markConversationAsRead = useCallback(async (senderId, receiverId) => {
    if (!socket || !isConnected) {
      return false;
    }

    return new Promise((resolve) => {
      socket.emit('message:read-conversation', {
        sender_id: senderId,
        receiver_id: receiverId,
      }, (response) => {
        if (response.success) {
          setMessages((prev) =>
            prev.map((m) =>
              m.sender_id === senderId && m.receiver_id === receiverId && !m.is_read
                ? { ...m, is_read: true, read_at: new Date().toISOString() }
                : m
            )
          );
          resolve(true);
        } else {
          resolve(false);
        }
      });
    });
  }, [socket, isConnected]);

  return {
    messages,
    setMessages,
    loading,
    error,
    message,
    setMessage,
    loadConversation,
    sendMessage,
    deleteMessage,
    markAsRead,
    markConversationAsRead,
  };
}

