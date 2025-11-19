import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../auth/hooks/useAuth';
import { useFriendships } from '../../hooks/useFriendships';
import MessageModal from '../shared/MessageModal';
import messageIcon from '../../assets/message_icon.svg';

export default function FriendsList() {
  const { user } = useAuth();
  const { getFriends, cancelFriendRequest, loading: friendsLoading } = useFriendships();
  const [friends, setFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);
  const [removingFriendId, setRemovingFriendId] = useState(null);

  useEffect(() => {
    if (user?.id) {
      loadFriends();
    }
  }, [user?.id]);

  const loadFriends = async () => {
    if (!user?.id) return;
    
    try {
      const friendsList = await getFriends(user.id);
      setFriends(friendsList || []);
    } catch (err) {
      console.error('Arkadaşlar yüklenemedi:', err);
      setFriends([]);
    }
  };

  const handleMessageClick = (friend) => {
    setSelectedFriend(friend);
    setIsMessageModalOpen(true);
  };

  const handleRemoveFriend = async (friendId, friendshipId) => {
    if (!user?.id || !confirm('Bu arkadaşlığı sonlandırmak istediğinize emin misiniz?')) {
      return;
    }

    setRemovingFriendId(friendId);
    try {
      // Arkadaşlık isteğini iptal et 
      const success = await cancelFriendRequest(friendshipId, user.id);
      if (success) {
        // Arkadaş listesini yeniden yükle
        await loadFriends();
      }
    } catch (err) {
      console.error('Arkadaşlıktan çıkarma hatası:', err);
    } finally {
      setRemovingFriendId(null);
    }
  };

  return (
    <motion.div
      className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-6 h-full flex flex-col"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6 flex-shrink-0">
        <h3 className="text-xl font-bold text-white">Arkadaşlarım</h3>
        <span className="text-sm text-white/70 bg-white/10 px-3 py-1 rounded-full">
          {friends.length}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto space-y-3">
        {friendsLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent mx-auto"></div>
            <p className="text-slate-400 mt-2">Yükleniyor...</p>
          </div>
        ) : friends.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-slate-400">Henüz arkadaşınız yok</p>
          </div>
        ) : (
          friends.map((friend) => (
            <motion.div
              key={friend.id}
              className="flex items-center justify-between p-4 rounded-lg border bg-slate-800/50 border-slate-600/50 hover:bg-slate-700/50 transition-colors"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white font-bold text-sm">
                    {friend.first_name?.charAt(0)}{friend.last_name?.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold truncate">
                    {friend.first_name} {friend.last_name}
                  </p>
                  <p className="text-slate-400 text-sm truncate">{friend.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <motion.button
                  onClick={() => handleMessageClick(friend)}
                  className="text-blue-400 hover:text-blue-300 transition-colors p-2 rounded-lg hover:bg-slate-600/50"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Mesaj Gönder"
                >
                  <img src={messageIcon} alt="Mesaj" className="w-5 h-5" />
                </motion.button>
                <motion.button
                  onClick={() => handleRemoveFriend(friend.id, friend.friendship_id)}
                  disabled={removingFriendId === friend.id}
                  className="text-red-400 hover:text-red-300 transition-colors p-2 rounded-lg hover:bg-slate-600/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  title="Arkadaşlıktan Çıkar"
                >
                  {removingFriendId === friend.id ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-red-400 border-t-transparent"></div>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </motion.button>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* Message Modal */}
      <MessageModal
        isOpen={isMessageModalOpen}
        onClose={() => {
          setIsMessageModalOpen(false);
          setSelectedFriend(null);
        }}
        friend={selectedFriend}
      />
    </motion.div>
  );
}

