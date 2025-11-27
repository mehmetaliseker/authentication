import { useState, useCallback } from 'react';
import { useFriendships } from './useFriendships';

export function useRemoveFriend(userId, onSuccess) {
  const { cancelFriendRequest } = useFriendships();
  const [removingFriendId, setRemovingFriendId] = useState(null);

  const removeFriend = useCallback(async (friendId, friendshipId) => {
    if (!userId || !confirm('Bu arkadaşlığı sonlandırmak istediğinize emin misiniz?')) {
      return;
    }

    setRemovingFriendId(friendId);
    try {
      const success = await cancelFriendRequest(friendshipId, userId);
      if (success && onSuccess) {
        await onSuccess();
      }
      return success;
    } catch (err) {
      console.error('Arkadaşlıktan çıkarma hatası:', err);
      return false;
    } finally {
      setRemovingFriendId(null);
    }
  }, [userId, cancelFriendRequest, onSuccess]);

  return {
    removingFriendId,
    removeFriend,
  };
}


