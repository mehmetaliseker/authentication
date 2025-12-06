import { useState, useCallback } from 'react';

export function useMessageModal() {
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

  const openMessageModal = useCallback((friend) => {
    setSelectedFriend(friend);
    setIsMessageModalOpen(true);
  }, []);

  const closeMessageModal = useCallback(() => {
    setIsMessageModalOpen(false);
    setSelectedFriend(null);
  }, []);

  const openChatbotModal = useCallback(() => {
    setSelectedFriend({
      id: 'chatbot',
      first_name: 'Chatbot',
      last_name: '',
      email: 'Yapay Zeka Asistanı',
      isChatbot: true,
    });
    setIsMessageModalOpen(true);
  }, []);

  return {
    selectedFriend,
    isMessageModalOpen,
    openMessageModal,
    closeMessageModal,
    openChatbotModal,
  };
}






