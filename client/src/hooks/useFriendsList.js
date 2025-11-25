import { useState, useEffect, useCallback } from 'react';
import { useFriendships } from './useFriendships';

export function useFriendsList(userId) {
  const { getFriends, loading: friendsLoading } = useFriendships();
  const [friends, setFriends] = useState([]);

  const loadFriends = useCallback(async () => {
    if (!userId) return;
    
    try {
      const friendsList = await getFriends(userId);
      setFriends(friendsList || []);
    } catch (err) {
      console.error('Arkadaşlar yüklenemedi:', err);
      setFriends([]);
    }
  }, [userId, getFriends]);

  useEffect(() => {
    if (userId) {
      loadFriends();
    }
  }, [userId, loadFriends]);

  return {
    friends,
    setFriends,
    loadFriends,
    loading: friendsLoading,
  };
}

