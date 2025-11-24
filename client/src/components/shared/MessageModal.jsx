import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../auth/hooks/useAuth';
import { useMessages } from '../../hooks/useMessages';
import { useChatbot } from '../../hooks/useChatbot';
import messageIcon from '../../assets/message_icon.svg';

export default function MessageModal({ isOpen, onClose, friend }) {
  const { user } = useAuth();
  const isChatbot = friend?.isChatbot || friend?.id === 'chatbot';
  const regularMessages = useMessages();
  const chatbotMessages = useChatbot();
  
  const { messages, loading, error, message, setMessage, loadConversation, sendMessage } = isChatbot ? chatbotMessages : regularMessages;
  const [messageText, setMessageText] = useState('');
  const messagesEndRef = useRef(null);
  const [deletingMessageId, setDeletingMessageId] = useState(null);

  useEffect(() => {
    if (isOpen && friend && user?.id) {
      if (isChatbot) {
        loadConversation(user.id).catch(err => console.error('Chatbot mesaj yükleme hatası:', err));
      } else {
        const otherUserId = friend.id;
        loadConversation(user.id, otherUserId, user.id).catch(err => console.error('Mesaj yükleme hatası:', err));
      }
    }
  }, [isOpen, friend, user?.id, loadConversation, isChatbot]);

  useEffect(() => {
    // Mesajlar güncellendiğinde en alta scroll yap
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, setMessage]);

  const handleClose = () => {
    setMessageText('');
    setMessage('');
    setDeletingMessageId(null);
    onClose();
  };

  const handleSendMessage = async () => {
    if (!messageText.trim() || !friend || !user?.id) return;

    if (isChatbot) {
      const success = await sendMessage(user.id, messageText);
      if (success) {
        setMessageText('');
      }
    } else {
      const success = await sendMessage(user.id, friend.id, messageText);
      if (success) {
        setMessageText('');
        // Socket.io ile mesaj otomatik olarak eklenecek, tekrar yüklemeye gerek yok
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleDeleteMessage = async (messageId) => {
    if (!user?.id || isChatbot) return; // Chatbot mesajları silinemez
    
    const success = await regularMessages.deleteMessage(messageId, user.id);
    if (success) {
      setDeletingMessageId(null);
      // Socket.io ile mesaj otomatik olarak silinecek, tekrar yüklemeye gerek yok
    }
  };

  if (!isOpen || !friend) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed z-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleClose}
        style={{ top: '120px', left: '50%', transform: 'translateX(-50%)' }}
      >
        <motion.div
          className="bg-slate-800/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-slate-600/30 h-[70vh] overflow-hidden mx-4 flex flex-col"
          style={{ width: '600px', maxWidth: '95vw' }}
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-4 border-b border-slate-600/30 bg-slate-700/50 flex-shrink-0">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={messageIcon} alt="Mesaj" className="w-6 h-6" />
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {isChatbot ? 'Chatbot ile Sohbet' : `${friend.first_name} ${friend.last_name}`}
                  </h2>
                  <p className="text-sm text-slate-400">{isChatbot ? 'Yapay Zeka Asistanı' : friend.email}</p>
                </div>
              </div>
              <button
                onClick={handleClose}
                className="text-slate-300 hover:text-white transition-colors p-2 hover:bg-slate-600 rounded-lg"
                title="Kapat"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {message && (
              <div className="mt-3 p-3 bg-blue-500/20 border border-blue-500/30 rounded-lg">
                <p className="text-blue-200 text-sm">{message}</p>
              </div>
            )}
            {error && (
              <div className="mt-3 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                <p className="text-red-200 text-sm">{error}</p>
              </div>
            )}
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-900/50">
            {loading && messages.length === 0 ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent mx-auto"></div>
                <p className="text-slate-400 mt-2">Yükleniyor...</p>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-400">Henüz mesaj yok. İlk mesajı siz gönderin!</p>
              </div>
            ) : (
              messages.map((msg) => {
                if (isChatbot) {
                  const isUserMessage = msg.message_type === 'user';
                  return (
                    <motion.div
                      key={msg.id}
                      className={`flex ${isUserMessage ? 'justify-end' : 'justify-start'}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className={`flex items-start gap-2 max-w-[75%] ${isUserMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div
                          className={`rounded-lg px-4 py-2 ${
                            isUserMessage
                              ? 'bg-purple-600 text-white'
                              : 'bg-slate-700 text-slate-200'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                          <p className={`text-xs mt-1 ${isUserMessage ? 'text-purple-200' : 'text-slate-400'}`}>
                            {new Date(msg.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  );
                } else {
                  const isOwnMessage = msg.sender_id === user?.id;
                  return (
                    <motion.div
                      key={msg.id}
                      className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <div className={`flex items-start gap-2 max-w-[75%] ${isOwnMessage ? 'flex-row-reverse' : 'flex-row'}`}>
                        <div
                          className={`rounded-lg px-4 py-2 ${
                            isOwnMessage
                              ? 'bg-purple-600 text-white'
                              : 'bg-slate-700 text-slate-200'
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                          <p className={`text-xs mt-1 ${isOwnMessage ? 'text-purple-200' : 'text-slate-400'}`}>
                            {new Date(msg.created_at).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        </div>
                        {isOwnMessage && (
                          <div className="flex items-center">
                            {deletingMessageId === msg.id ? (
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-300">Sil?</span>
                                <button
                                  onClick={() => handleDeleteMessage(msg.id)}
                                  className="text-green-400 hover:text-green-300 p-1"
                                  title="Evet"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => setDeletingMessageId(null)}
                                  className="text-slate-400 hover:text-slate-300 p-1"
                                  title="Hayır"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                  </svg>
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeletingMessageId(msg.id)}
                                className="text-slate-400 hover:text-red-400 p-1"
                                title="Sil"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                }
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-600/30 bg-slate-700/50 flex-shrink-0">
            <div className="flex gap-2">
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Mesaj yazın..."
                className="flex-1 bg-slate-800 text-white placeholder-slate-400 p-3 rounded-lg border border-slate-600/50 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                rows={2}
                disabled={loading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!messageText.trim() || loading}
                className="bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium transition-colors"
              >
                Gönder
              </button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

