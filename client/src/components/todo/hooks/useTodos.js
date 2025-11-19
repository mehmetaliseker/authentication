import { useState, useCallback, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:3001/todos';
const TOKEN = () => localStorage.getItem('accessToken');

const handleAuthError = (setMessage) => {
  localStorage.removeItem('accessToken');
  localStorage.removeItem('refreshToken');
  localStorage.removeItem('user');
  setMessage('Oturum süreniz dolmuş. Lütfen tekrar giriş yapın.');
};

export function useTodos(filter = 'all') {
  const [todos, setTodos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  // Todo'ları yükle
  const loadTodos = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}?status=${filter}`, {
        headers: {
          'Authorization': `Bearer ${TOKEN()}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.status === 401) {
        handleAuthError(setMessage);
        return;
      }
      
      const data = await response.json();
      if (data.success) {
        setTodos(data.data);
      }
      return data.data;
    } catch (err) {
      setError(err.message);
      console.error('Todo yükleme hatası:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [filter]);

  // Todo ekle
  const addTodo = useCallback(async (title) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(API_BASE_URL, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${TOKEN()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: title.trim() }),
      });
      
      if (response.status === 401) {
        handleAuthError(setMessage);
        return null;
      }
      
      const data = await response.json();
      
      if (data.success) {
        const newTodo = { ...data.data, status: data.data?.status || 'pending' };
        setTodos((prev) => [newTodo, ...prev]);
        return newTodo;
      } else {
        setError(data.message);
        return null;
      }
    } catch (err) {
      setError(err.message);
      console.error('Todo ekleme hatası:', err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Todo durumunu değiştir
  const toggleTodo = useCallback(async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}/toggle`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${TOKEN()}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        handleAuthError(setMessage);
        return false;
      }

      const data = await response.json();
      if (response.ok && data.success) {
        setTodos((prev) => prev.map((t) => {
          if (t.id !== id) return t;
          const wasCompleted = t.status === 'completed';
          return {
            ...t,
            status: wasCompleted ? 'pending' : 'completed',
            completed_at: wasCompleted ? null : new Date().toISOString(),
            deleted_at: null
          };
        }));
        return true;
      } else {
        setError(data?.message || 'Görev güncellenemedi.');
        return false;
      }
    } catch (err) {
      setError('Beklenmeyen bir hata oluştu.');
      console.error('Todo güncelleme hatası:', err);
      throw err;
    }
  }, []);

  // Todo sil
  const deleteTodo = useCallback(async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${TOKEN()}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 401) {
        handleAuthError(setMessage);
        return false;
      }

      const data = await response.json();
      if (response.ok && data.success) {
        setTodos((prev) => prev.map((t) => (
          t.id === id
            ? { ...t, status: 'deleted', deleted_at: new Date().toISOString() }
            : t
        )));
        return true;
      } else {
        setError(data?.message || 'Görev silinemedi.');
        return false;
      }
    } catch (err) {
      setError('Beklenmeyen bir hata oluştu.');
      console.error('Todo silme hatası:', err);
      throw err;
    }
  }, []);

  // Todo düzenle
  const updateTodo = useCallback(async (id, title) => {
    if (!title.trim()) {
      setError('Todo başlığı boş olamaz.');
      return false;
    }

    try {
      const response = await fetch(`${API_BASE_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${TOKEN()}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: title.trim() }),
      });

      if (response.status === 401) {
        handleAuthError(setMessage);
        return false;
      }

      const data = await response.json();
      if (response.ok && data.success) {
        setTodos((prev) => prev.map((t) => (
          t.id === id ? { ...t, title: title.trim() } : t
        )));
        return true;
      } else {
        setError(data?.message || 'Görev güncellenemedi.');
        return false;
      }
    } catch (err) {
      setError('Beklenmeyen bir hata oluştu.');
      console.error('Todo düzenleme hatası:', err);
      throw err;
    }
  }, []);

  return {
    todos,
    loading,
    error,
    message,
    setMessage,
    loadTodos,
    addTodo,
    toggleTodo,
    deleteTodo,
    updateTodo
  };
}
