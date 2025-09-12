import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';

const TodoModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  // Todo'ları yükle
  const loadTodos = async () => {
    if (!user?.id) return;
    
    const token = localStorage.getItem('accessToken');
    console.log('Token kontrolü:', { token: token ? 'Mevcut' : 'Yok', userId: user?.id });
    
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3001/todos?status=${filter}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Todo yükleme yanıtı:', response.status, response.statusText);
      
      if (response.status === 401) {
        console.error('401 Unauthorized - Token geçersiz, login sayfasına yönlendiriliyor');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return;
      }
      
      const data = await response.json();
      if (data.success) {
        setTodos(data.data);
      }
    } catch (error) {
      console.error('Todo yükleme hatası:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Todo ekle
  const addTodo = async () => {
    if (!newTodo.trim() || !user?.id) return;

    const token = localStorage.getItem('accessToken');
    console.log('Todo ekleme - Token kontrolü:', { token: token ? 'Mevcut' : 'Yok', userId: user?.id });

    try {
      const response = await fetch('http://localhost:3001/todos', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title: newTodo.trim() }),
      });
      
      console.log('Todo ekleme yanıtı:', response.status, response.statusText);
      
      if (response.status === 401) {
        console.error('401 Unauthorized - Token geçersiz, login sayfasına yönlendiriliyor');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
        window.location.href = '/login';
        return;
      }
      
      const data = await response.json();
      
      if (data.success) {
        setNewTodo('');
        loadTodos();
      } else {
        console.error('Todo ekleme başarısız:', data.message);
      }
    } catch (error) {
      console.error('Todo ekleme hatası:', error);
    }
  };

  // Todo durumunu değiştir
  const toggleTodo = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/todos/${id}/toggle`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      if (data.success) {
        loadTodos();
      }
    } catch (error) {
      console.error('Todo güncelleme hatası:', error);
    }
  };

  // Todo sil
  const deleteTodo = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/todos/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('accessToken')}`,
          'Content-Type': 'application/json',
        },
      });
      
      const data = await response.json();
      if (data.success) {
        loadTodos();
      }
    } catch (error) {
      console.error('Todo silme hatası:', error);
    }
  };

  // Enter tuşu ile todo ekle
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTodo();
    }
  };

  // Filter değiştiğinde todo'ları yeniden yükle
  useEffect(() => {
    if (isOpen) {
      loadTodos();
    }
  }, [isOpen, filter]);

  // 12 saat sonra otomatik silme kontrolü
  useEffect(() => {
    const checkOldCompleted = () => {
      const now = new Date();
      const updatedTodos = todos.map(todo => {
        if (todo.status === 'completed' && todo.completed_at) {
          const completedTime = new Date(todo.completed_at);
          const hoursDiff = (now - completedTime) / (1000 * 60 * 60);
          
          if (hoursDiff >= 12) {
            return { ...todo, status: 'deleted' };
          }
        }
        return todo;
      });
      
      if (JSON.stringify(updatedTodos) !== JSON.stringify(todos)) {
        setTodos(updatedTodos);
      }
    };

    const interval = setInterval(checkOldCompleted, 60000); // Her dakika kontrol et
    return () => clearInterval(interval);
  }, [todos]);

  const filteredTodos = todos.filter(todo => {
    switch (filter) {
      case 'pending':
        return todo.status === 'pending';
      case 'completed':
        return todo.status === 'completed';
      case 'deleted':
        return todo.status === 'deleted';
      default:
        return true;
    }
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-40 flex items-center justify-center bg-black/90 backdrop-blur-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ top: '315px', left: 0, right: 0, bottom: '100px' }}
      >
        <motion.div
          className="bg-slate-800/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-slate-600/30 w-full max-w-2xl h-[70vh] overflow-hidden mx-4"
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-600/30 bg-slate-700/50">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-white">To-Do Listesi</h2>
              <button
                onClick={onClose}
                className="text-slate-300 hover:text-white transition-colors p-2 hover:bg-slate-600 rounded-lg border border-slate-500/50"
                title="Kapat"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 flex flex-col h-full">
            {/* Todo Ekleme */}
            <div className="flex gap-3">
              <textarea
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Yeni görev ekle..."
                className="flex-1 bg-slate-700/50 text-white placeholder-slate-400 p-3 rounded-lg border border-slate-600/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none min-h-[48px] max-h-32 overflow-y-auto"
                rows={1}
                style={{
                  height: 'auto',
                  minHeight: '48px',
                  maxHeight: '128px'
                }}
                onInput={(e) => {
                  e.target.style.height = 'auto';
                  e.target.style.height = Math.min(e.target.scrollHeight, 128) + 'px';
                }}
              />
              <button
                onClick={addTodo}
                disabled={!newTodo.trim()}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Ekle
              </button>
            </div>

            {/* Filter Butonları */}
            <div className="flex gap-2">
              {['all', 'pending', 'completed', 'deleted'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                    filter === status
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-700/50 text-slate-300 hover:bg-slate-600/50'
                  }`}
                >
                  {status === 'all' ? 'Tümü' : 
                   status === 'pending' ? 'Bekleyen' :
                   status === 'completed' ? 'Tamamlanan' : 'Silinen'}
                </button>
              ))}
            </div>

            {/* Todo Listesi */}
            <div className="flex-1 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-slate-600/50 scrollbar-track-transparent max-h-96">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent mx-auto"></div>
                  <p className="text-slate-400 mt-2">Yükleniyor...</p>
                </div>
              ) : filteredTodos.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-400">Henüz görev yok</p>
                </div>
              ) : (
                filteredTodos.map((todo) => (
                  <motion.div
                    key={todo.id}
                    className={`flex items-start gap-3 p-4 rounded-lg border transition-all w-full ${
                      todo.status === 'completed'
                        ? 'bg-green-500/20 border-green-500/30'
                        : todo.status === 'deleted'
                        ? 'bg-red-500/20 border-red-500/30'
                        : 'bg-slate-700/50 border-slate-600/50'
                    }`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <button
                      onClick={() => toggleTodo(todo.id)}
                      className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 mt-0.5 ${
                        todo.status === 'completed'
                          ? 'bg-green-500 border-green-500 text-white'
                          : 'border-slate-400 hover:border-slate-300'
                      }`}
                    >
                      {todo.status === 'completed' && (
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <p className={`text-slate-200 break-words ${
                        todo.status === 'completed' ? 'line-through opacity-60' : ''
                      }`}>
                        {todo.title}
                      </p>
                      {todo.completed_at && todo.status === 'completed' && (
                        <p className="text-xs text-slate-400 mt-1">
                          Tamamlandı: {new Date(todo.completed_at).toLocaleString('tr-TR')}
                        </p>
                      )}
                    </div>
                    
                    <button
                      onClick={() => deleteTodo(todo.id)}
                      className="text-red-400 hover:text-red-300 transition-colors p-1"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TodoModal;
