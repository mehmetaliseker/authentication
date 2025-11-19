import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../auth/hooks/useAuth';
import { useTodos } from './hooks/useTodos';

const TodoModal = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState('all');
  const [showFilterInput, setShowFilterInput] = useState(false);
  const [filterText, setFilterText] = useState('');
  const [editingTodoId, setEditingTodoId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [deletingTodoId, setDeletingTodoId] = useState(null);
  
  const { todos, loading: isLoading, error: todosError, message, setMessage, loadTodos, addTodo: addTodoToAPI, toggleTodo: toggleTodoAPI, deleteTodo: deleteTodoAPI, updateTodo } = useTodos(filter);

  // Message'ı temizle
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);


  // Todo silme onayı
  const confirmDelete = (id) => {
    setDeletingTodoId(id);
  };

  const cancelDelete = () => {
    setDeletingTodoId(null);
  };

  // Todo düzenle
  const startEditing = (todo) => {
    setEditingTodoId(todo.id);
    setEditingText(todo.title);
  };

  const cancelEditing = () => {
    setEditingTodoId(null);
    setEditingText('');
  };

  // Enter tuşu ile todo ekle
  const handleKeyPress = async (e) => {
    if (e.key === 'Enter') {
      await handleAddTodo();
    }
  };

  const handleAddTodo = async () => {
    if (!newTodo.trim() || !user?.id) return;
    await addTodoToAPI(newTodo);
    setNewTodo('');
  };

  const handleToggleTodo = async (id) => {
    await toggleTodoAPI(id);
  };

  const handleDeleteTodo = async (id) => {
    await deleteTodoAPI(id);
    setDeletingTodoId(null);
  };

  const handleSaveEdit = async (id) => {
    await updateTodo(id, editingText);
    cancelEditing();
  };

  // Filter değiştiğinde todo'ları yeniden yükle
  useEffect(() => {
    if (isOpen && user?.id) {
      loadTodos().catch(err => console.error('Todo yükleme hatası:', err));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, filter]);

  // 12 saat sonra otomatik silme kontrolü - backend'te yapılıyor, frontend sadece listeyi yeniler
  useEffect(() => {
    const checkAndReloadTodos = () => {
      // Backend otomatik olarak completed todo'ları 12 saat sonra deleted yapar
      // Frontend sadece listeyi yeniden yükler
      if (isOpen && user?.id) {
        loadTodos().catch(err => console.error('Todo yükleme hatası:', err));
      }
    };

    const interval = setInterval(checkAndReloadTodos, 300000); // Her 5 dakikada bir kontrol et
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  const filteredTodos = todos.filter(todo => {
    // Önce status filtresi uygula
    let statusMatch = true;
    switch (filter) {
      case 'pending':
        statusMatch = todo.status === 'pending';
        break;
      case 'completed':
        statusMatch = todo.status === 'completed';
        break;
      case 'deleted':
        statusMatch = todo.status === 'deleted';
        break;
      default:
        statusMatch = true;
    }

    // Sonra metin filtresi uygula
    const textMatch = filterText.trim() === '' || 
      todo.title.toLowerCase().includes(filterText.toLowerCase());

    return statusMatch && textMatch;
  });

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{ top: '120px', left: '50%', transform: 'translateX(-50%)' }}
      >
        <motion.div
          className="bg-slate-800/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-slate-600/30 h-[75vh] overflow-hidden mx-4"
          style={{ width: '900px', maxWidth: '40vw' }}
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
            {/* Message */}
            {message && (
              <div className="mt-3 p-3 bg-yellow-500/20 border border-yellow-500/30 rounded-lg">
                <p className="text-yellow-200 text-sm">{message}</p>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-6 space-y-6 flex flex-col h-full">
            {/* Authentication Check */}
            {!user?.id ? (
              <div className="text-center py-8">
                <div className="text-red-400 mb-4">
                  <svg className="w-16 h-16 mx-auto mb-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                  <p className="text-lg font-medium mb-2">Giriş Gerekli</p>
                  <p className="text-sm text-slate-300 mb-6">Todo listesini kullanmak için giriş yapmanız gerekiyor.</p>
                </div>
              </div>
            ) : (
              <>
                {/* Todo Ekleme */}
                <div className="flex gap-3">
                  <textarea
                    value={newTodo}
                    onChange={(e) => setNewTodo(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Yeni görev ekle..."
                    className="flex-1 bg-slate-700/50 text-white placeholder-slate-400 p-3 rounded-lg border border-slate-600/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none min-h-[48px] max-h-32"
                    rows={1}
                    style={{
                      height: 'auto',
                      minHeight: '48px',
                      maxHeight: '128px',
                      overflowY: 'hidden'
                    }}
                    onInput={(e) => {
                      e.target.style.height = 'auto';
                      const newHeight = Math.min(e.target.scrollHeight, 128);
                      e.target.style.height = newHeight + 'px';
                      // 3 satır = yaklaşık 96px (48px * 2 = 3. satır başlangıcı)
                      if (newHeight > 96) {
                        e.target.style.overflowY = 'auto';
                      } else {
                        e.target.style.overflowY = 'hidden';
                      }
                    }}
                  />
                  <button
                    onClick={handleAddTodo}
                    disabled={!newTodo.trim()}
                    className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors"
                  >
                    Ekle
                  </button>
                </div>

                {/* Filter Butonları */}
                <div className="flex gap-2 items-center">
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
                  
                  {/* Morph Arama Butonu */}
                  <AnimatePresence mode="wait">
                    {showFilterInput ? (
                      <motion.div
                        key="input"
                        className="relative"
                        initial={{ width: 40, opacity: 0 }}
                        animate={{ width: 200, opacity: 1 }}
                        exit={{ width: 40, opacity: 0 }}
                        transition={{ duration: 0.4, ease: 'easeInOut' }}
                      >
                        <input
                          type="text"
                          value={filterText}
                          onChange={(e) => setFilterText(e.target.value)}
                          placeholder="Todo başlığında ara..."
                          className="w-full bg-slate-700/50 text-white placeholder-slate-400 px-3 py-2 pr-10 rounded-lg border border-slate-600/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                          autoFocus
                        />
                        <motion.button
                          onClick={() => {
                            setFilterText('');
                            setShowFilterInput(false);
                          }}
                          className="absolute right-2 top-[20%] -translate-y-1/2 text-slate-400 hover:text-red-400 transition-colors p-1 rounded-full hover:bg-slate-600/50"
                          title="Temizle ve kapat"
                          initial={{ opacity: 0, scale: 0 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: 0.2, duration: 0.2 }}
                          whileHover={{ scale: 1.2, rotate: 90 }}
                          whileTap={{ scale: 0.8 }}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </motion.button>
                      </motion.div>
                    ) : (
                      <motion.button
                        key="button"
                        onClick={() => setShowFilterInput(true)}
                        className="bg-slate-700/50 hover:bg-slate-600/50 text-slate-300 hover:text-white p-2 rounded-lg transition-colors"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        transition={{ duration: 0.3 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        title="Ara"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>

                {/* Todo Listesi */}
                <div className="flex-1 overflow-y-auto space-y-3 scrollbar-thin scrollbar-thumb-slate-600/50 scrollbar-track-transparent max-h-96">
                  {/* Filtreleme Sonuçları */}
                  {filterText.trim() && (
                    <div className="bg-slate-700/30 p-3 rounded-lg border border-slate-600/30">
                      <p className="text-slate-300 text-sm">
                        "{filterText}" için {filteredTodos.length} sonuç bulundu
                      </p>
                    </div>
                  )}
                  
                  {isLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent mx-auto"></div>
                      <p className="text-slate-400 mt-2">Yükleniyor...</p>
                    </div>
                  ) : filteredTodos.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-slate-400">
                        {filterText.trim() ? 'Arama kriterlerine uygun görev bulunamadı' : 'Henüz görev yok'}
                      </p>
                      {filterText.trim() && (
                        <button
                          onClick={() => setFilterText('')}
                          className="mt-2 text-purple-400 hover:text-purple-300 text-sm"
                        >
                          Filtreyi temizle
                        </button>
                      )}
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
                          onClick={() => todo.status !== 'deleted' ? handleToggleTodo(todo.id) : null}
                          disabled={todo.status === 'deleted'}
                          className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors flex-shrink-0 mt-0.5 ${
                            todo.status === 'completed'
                              ? 'bg-green-500 border-green-500 text-white'
                              : todo.status === 'deleted'
                              ? 'border-red-500 bg-red-500/20 cursor-not-allowed'
                              : 'border-slate-400 hover:border-slate-300'
                          }`}
                        >
                          {todo.status === 'completed' && (
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                          {todo.status === 'deleted' && (
                            <svg className="w-4 h-4 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                          )}
                        </button>
                        
                        <div className="flex-1 min-w-0">
                          {editingTodoId === todo.id ? (
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={editingText}
                                onChange={(e) => setEditingText(e.target.value)}
                                onKeyPress={(e) => {
                                  if (e.key === 'Enter') handleSaveEdit(todo.id);
                                  if (e.key === 'Escape') cancelEditing();
                                }}
                                className="flex-1 bg-slate-600/50 text-white px-2 py-1 rounded border border-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                                autoFocus
                              />
                              <button
                                onClick={() => handleSaveEdit(todo.id)}
                                className="text-green-400 hover:text-green-300 transition-colors p-1"
                                title="Kaydet"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                              </button>
                              <button
                                onClick={cancelEditing}
                                className="text-slate-400 hover:text-slate-300 transition-colors p-1"
                                title="İptal"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          ) : (
                            <>
                              <p className={`text-slate-200 break-words ${
                                todo.status === 'completed' ? 'line-through opacity-60' : 
                                todo.status === 'deleted' ? 'line-through opacity-40 text-red-300' : ''
                              }`}>
                                {todo.title}
                              </p>
                              {todo.completed_at && todo.status === 'completed' && (
                                <p className="text-xs text-slate-400 mt-1">
                                  Tamamlandı: {new Date(todo.completed_at).toLocaleString('tr-TR')}
                                </p>
                              )}
                              {todo.deleted_at && todo.status === 'deleted' && (
                                <p className="text-xs text-slate-400 mt-1">
                                  Silindi: {new Date(todo.deleted_at).toLocaleString('tr-TR')}
                                </p>
                              )}
                            </>
                          )}
                        </div>
                        
                        {todo.status === 'pending' && editingTodoId !== todo.id && deletingTodoId !== todo.id && (
                          <button
                            onClick={() => startEditing(todo)}
                            className="text-blue-400 hover:text-blue-300 transition-colors p-1"
                            title="Düzenle"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </button>
                        )}
                        
                        {todo.status !== 'deleted' && editingTodoId !== todo.id && deletingTodoId !== todo.id && (
                          <button
                            onClick={() => confirmDelete(todo.id)}
                            className="text-red-400 hover:text-red-300 transition-colors p-1"
                            title="Sil"
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}
                        
                        {deletingTodoId === todo.id && (
                          <motion.div
                            className="flex items-center gap-2"
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 10 }}
                          >
                            <span className="text-xs text-slate-300 whitespace-nowrap">Emin misiniz?</span>
                            <button
                              onClick={() => handleDeleteTodo(todo.id)}
                              className="text-green-400 hover:text-green-300 transition-colors p-1"
                              title="Evet, sil"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </button>
                            <button
                              onClick={cancelDelete}
                              className="text-slate-400 hover:text-slate-300 transition-colors p-1"
                              title="İptal"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </motion.div>
                        )}
                      </motion.div>
                    ))
                  )}
                </div>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TodoModal;
