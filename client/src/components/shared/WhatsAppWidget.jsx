import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import whatsappIcon from '../../assets/whatsapp_icon.svg';

export default function WhatsAppWidget() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [message, setMessage] = useState('');
  const phoneNumber = '+905468303055';

  // Modal açma/kapama
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    if (!isModalOpen) {
      setMessage(''); // Modal açıldığında mesajı temizle
    }
  };

  // WhatsApp'a mesaj gönderme
  const sendMessage = () => {
    if (message.trim()) {
      const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${phoneNumber}&text=${encodedMessage}`;
      window.open(whatsappUrl, '_blank');
      setIsModalOpen(false);
      setMessage('');
    }
  };

  // Enter tuşu ile gönderme
  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* WhatsApp Floating Button */}
      <motion.button
        onClick={toggleModal}
        className="fixed bottom-10 right-10 z-50 bg-[#25D366] hover:bg-[#20BD5A] rounded-full p-4 shadow-2xl transition-all duration-300 hover:scale-110 group"
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        whileHover={{ y: -5 }}
        whileTap={{ scale: 0.95 }}
      >
        <img 
          src={whatsappIcon} 
          alt="WhatsApp" 
          className="w-8 h-8 filter brightness-0 invert"
        />
        
        {/* Pulse Effect */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-20"></span>
      </motion.button>

      {/* WhatsApp Chat Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed bottom-24 right-6 z-50 w-[360px] bg-white rounded-2xl shadow-2xl overflow-hidden"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            {/* Modal Header */}
            <div className="bg-[#075E54] text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                  <img 
                    src={whatsappIcon} 
                    alt="WhatsApp" 
                    className="w-7 h-7"
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Mehmet Ali ŞEKER</h3>
                  <p className="text-xs text-gray-200">Çevrim içi</p>
                </div>
              </div>
              <button
                onClick={toggleModal}
                className="text-white hover:bg-white/20 rounded-full p-1 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="bg-[#E5DDD5] p-4 min-h-[200px] max-h-[300px] overflow-y-auto">
              {/* Welcome Message Bubble */}
              <motion.div
                className="bg-white rounded-lg rounded-tl-none p-3 shadow-md mb-3 max-w-[80%]"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <p className="text-sm text-gray-800">
                  Merhaba! Size nasıl yardımcı olabilirim?
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
                </p>
              </motion.div>

              {/* User Message Preview */}
              {message && (
                <motion.div
                  className="bg-[#DCF8C6] rounded-lg rounded-tr-none p-3 shadow-md ml-auto max-w-[80%]"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                >
                  <p className="text-sm text-gray-800 whitespace-pre-wrap">{message}</p>
                </motion.div>
              )}
            </div>

            {/* Modal Footer - Message Input */}
            <div className="bg-[#F0F0F0] p-4">
              <div className="flex items-end gap-2">
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Mesajınızı yazın..."
                  className="flex-1 resize-none rounded-full px-4 py-3 border border-gray-300 focus:outline-none focus:border-[#25D366] focus:ring-2 focus:ring-[#25D366]/20 transition-all max-h-24"
                  rows="1"
                  style={{ 
                    minHeight: '48px',
                    maxHeight: '96px',
                    overflowY: message.split('\n').length > 2 ? 'auto' : 'hidden'
                  }}
                />
                <motion.button
                  onClick={sendMessage}
                  disabled={!message.trim()}
                  className={`rounded-full p-3 transition-all ${
                    message.trim() 
                      ? 'bg-[#25D366] hover:bg-[#20BD5A] cursor-pointer' 
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                  whileHover={message.trim() ? { scale: 1.05 } : {}}
                  whileTap={message.trim() ? { scale: 0.95 } : {}}
                >
                  <svg 
                    className="w-6 h-6 text-white" 
                    fill="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
                  </svg>
                </motion.button>
              </div>
              <p className="text-xs text-gray-500 mt-2 text-center">
                Enter ile gönder, Shift+Enter ile yeni satır
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

