import { useState, useCallback } from 'react';

const API_BASE_URL = 'http://localhost:3001/friendships';
const TOKEN = () => localStorage.getItem('accessToken');

const handleAuthError = (setMessage) => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  setMessage('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
};

export function useFriendships() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  // Tüm kullanıcıları arkadaşlık durumlarıyla birlikte yükle
  const loadUsers = useCallback(async (userId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${TOKEN()}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.status === 401) {
        handleAuthError(setMessage);
        return;
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
        setUsers([]);
        console.error('API hatası:', response.status, errorMessage);
        return [];
      }
      
      const data = await response.json();
      console.log('API Response:', data);
      
      if (Array.isArray(data)) {
        setUsers(data);
        return data;
      } else if (data && Array.isArray(data.data)) {
        // Eğer veri bir obje içinde geliyorsa
        setUsers(data.data);
        return data.data;
      } else if (data && data.users && Array.isArray(data.users)) {
        // Alternatif format
        setUsers(data.users);
        return data.users;
      } else {
        console.error('Geçersiz veri formatı:', data);
        setError('Geçersiz veri formatı - Array bekleniyordu');
        setUsers([]);
        return [];
      }
    } catch (err) {
      const errorMessage = err.message || 'Beklenmeyen bir hata oluştu';
      setError(errorMessage);
      console.error('Kullanıcı yükleme hatası:', err);
      setUsers([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  // Arkadaş isteği gönder
  const sendFriendRequest = useCallback(async (requesterId, addresseeId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/send-request`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${TOKEN()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          requester_id: requesterId,
          addressee_id: addresseeId,
        }),
      });

      if (response.status === 401) {
        handleAuthError(setMessage);
        return false;
      }

      const data = await response.json();
      if (response.ok) {
        // Kullanıcı listesini güncelle
        setUsers((prev) => prev.map((user) => {
          if (user.id === addresseeId) {
            return {
              ...user,
              friendship_status: 'pending_sent',
              friendship_id: data.friendship?.id,
              requester_id: requesterId,
            };
          }
          return user;
        }));
        setMessage(data.message || 'Arkadaş isteği gönderildi');
        return true;
      } else {
        setError(data.message || 'Arkadaş isteği gönderilemedi');
        return false;
      }
    } catch (err) {
      setError('Beklenmeyen bir hata oluştu.');
      console.error('Arkadaş isteği gönderme hatası:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Arkadaş isteğini kabul et
  const acceptFriendRequest = useCallback(async (friendshipId, userId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/${friendshipId}/accept`, {
        method: 'PUT',
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
        // Kullanıcı listesini güncelle
        setUsers((prev) => prev.map((u) => {
          if (u.friendship_id === friendshipId) {
            return {
              ...u,
              friendship_status: 'accepted',
            };
          }
          return u;
        }));
        setMessage(data.message || 'Arkadaş isteği kabul edildi');
        return true;
      } else {
        setError(data.message || 'Arkadaş isteği kabul edilemedi');
        return false;
      }
    } catch (err) {
      setError('Beklenmeyen bir hata oluştu.');
      console.error('Arkadaş isteği kabul hatası:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Arkadaş isteğini reddet
  const rejectFriendRequest = useCallback(async (friendshipId, userId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/${friendshipId}/reject`, {
        method: 'PUT',
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
        // Kullanıcı listesini güncelle
        setUsers((prev) => prev.map((user) => {
          if (user.friendship_id === friendshipId) {
            return {
              ...user,
              friendship_status: 'rejected',
            };
          }
          return user;
        }));
        setMessage(data.message || 'Arkadaş isteği reddedildi');
        return true;
      } else {
        setError(data.message || 'Arkadaş isteği reddedilemedi');
        return false;
      }
    } catch (err) {
      setError('Beklenmeyen bir hata oluştu.');
      console.error('Arkadaş isteği reddetme hatası:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Arkadaş isteğini iptal et
  const cancelFriendRequest = useCallback(async (friendshipId, userId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/${friendshipId}/cancel`, {
        method: 'PUT',
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
        // Kullanıcı listesini güncelle - iptal edildikten sonra 'none' durumuna döndür
        setUsers((prev) => prev.map((user) => {
          if (user.friendship_id === friendshipId) {
            return {
              ...user,
              friendship_status: 'none',
              friendship_id: null,
              requester_id: null,
            };
          }
          return user;
        }));
        setMessage(data.message || 'Arkadaş isteği iptal edildi');
        return true;
      } else {
        setError(data.message || 'Arkadaş isteği iptal edilemedi');
        return false;
      }
    } catch (err) {
      setError('Beklenmeyen bir hata oluştu.');
      console.error('Arkadaş isteği iptal hatası:', err);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  // Arkadaşları getir
  const getFriends = useCallback(async (userId) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/friends/${userId}`, {
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
        setUsers([]);
        return [];
      }
      
      const data = await response.json();
      const friendsArray = Array.isArray(data) ? data : (data.data || data.friends || []);
      setUsers(friendsArray);
      return friendsArray;
    } catch (err) {
      const errorMessage = err.message || 'Beklenmeyen bir hata oluştu';
      setError(errorMessage);
      console.error('Arkadaşlar yükleme hatası:', err);
      setUsers([]);
      return [];
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    users,
    loading,
    error,
    message,
    setMessage,
    loadUsers,
    getFriends,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    cancelFriendRequest,
  };
}

