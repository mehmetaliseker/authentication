import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../auth/hooks/useAuth';
import { useFriendships } from '../../hooks/useFriendships';
import { useFloating, useInteractions, useHover, FloatingPortal } from '@floating-ui/react';
import addFriendIcon from '../../assets/addfriend_icon.svg';

export default function FriendshipModal({ isOpen, onClose }) {
  const { user } = useAuth();
  const { users, loading, error, message, setMessage, loadUsers, sendFriendRequest, acceptFriendRequest, rejectFriendRequest, cancelFriendRequest } = useFriendships();
  const [confirmingAction, setConfirmingAction] = useState(null);
  const [actionUser, setActionUser] = useState(null);

  useEffect(() => {
    if (isOpen && user?.id) {
      loadUsers(user.id).catch(err => console.error('Kullanıcı yükleme hatası:', err));
    }
  }, [isOpen, user?.id, loadUsers]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage('');
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, setMessage]);

  const handleClose = () => {
    setConfirmingAction(null);
    setActionUser(null);
    setMessage('');
    onClose();
  };

  const handleAction = (actionType, userId, friendshipId) => {
    setConfirmingAction(actionType);
    setActionUser({ id: userId, friendshipId });
  };

  const confirmAction = async () => {
    if (!confirmingAction || !actionUser || !user?.id) return;

    let success = false;
    try {
      switch (confirmingAction) {
        case 'send':
          success = await sendFriendRequest(user.id, actionUser.id);
          break;
        case 'accept':
          success = await acceptFriendRequest(actionUser.friendshipId, user.id);
          break;
        case 'reject':
          success = await rejectFriendRequest(actionUser.friendshipId, user.id);
          break;
        case 'cancel':
          success = await cancelFriendRequest(actionUser.friendshipId, user.id);
          break;
        default:
          break;
      }

      if (success) {
        // Kullanıcı listesini yeniden yükle
        await loadUsers(user.id);
      }
    } catch (err) {
      console.error('İşlem hatası:', err);
    } finally {
      setConfirmingAction(null);
      setActionUser(null);
    }
  };

  const cancelAction = () => {
    setConfirmingAction(null);
    setActionUser(null);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
          />
          <motion.div
            className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50 bg-slate-800/90 backdrop-blur-lg rounded-2xl shadow-2xl border border-slate-600/30 overflow-hidden"
            style={{ width: '600px', maxWidth: '90vw', maxHeight: '75vh' }}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="p-4 border-b border-slate-600/30 bg-slate-700/50">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={addFriendIcon} alt="Arkadaş Ekle" className="w-6 h-6" />
                  <h2 className="text-xl font-bold text-white">İstekler</h2>
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

            {/* Content */}
            <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(75vh - 120px)' }}>
              {!user?.id ? (
                <div className="text-center py-8">
                  <p className="text-red-400">Giriş yapmanız gerekiyor</p>
                </div>
              ) : loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-purple-500 border-t-transparent mx-auto"></div>
                  <p className="text-slate-400 mt-2">Yükleniyor...</p>
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-slate-400">Henüz kullanıcı bulunamadı</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {users.map((userItem) => (
                    <UserItem
                      key={userItem.id}
                      user={userItem}
                      currentUserId={user.id}
                      onAction={handleAction}
                      confirmingAction={confirmingAction}
                      actionUser={actionUser}
                      onConfirm={confirmAction}
                      onCancel={cancelAction}
                    />
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function UserItem({ user, currentUserId, onAction, confirmingAction, actionUser, onConfirm, onCancel }) {
  const status = user.friendship_status || 'none';
  const isConfirming = confirmingAction && actionUser?.id === user.id;

  const renderActionButtons = () => {
    switch (status) {
      case 'none':
        return (
          <ActionButton
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            }
            tooltip="Arkadaş Ekle"
            onClick={() => onAction('send', user.id)}
          />
        );

      case 'pending_sent':
        return (
          <ActionButton
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            }
            tooltip="İsteği Geri Çek"
            onClick={() => onAction('cancel', user.id, user.friendship_id)}
          />
        );

      case 'pending_received':
        return (
          <div className="flex items-center gap-2">
            <ActionButton
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              }
              tooltip="Kabul Et"
              onClick={() => onAction('accept', user.id, user.friendship_id)}
              className="text-green-400 hover:text-green-300"
            />
            <ActionButton
              icon={
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              }
              tooltip="Reddet"
              onClick={() => onAction('reject', user.id, user.friendship_id)}
              className="text-red-400 hover:text-red-300"
            />
          </div>
        );

      case 'accepted':
        return (
          <span className="text-sm text-green-400 font-medium">Arkadaş</span>
        );

      case 'rejected':
      case 'cancelled':
      default:
        return (
          <ActionButton
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            }
            tooltip="Arkadaş Ekle"
            onClick={() => onAction('send', user.id)}
          />
        );
    }
  };

  return (
    <motion.div
      className="flex items-center justify-between p-4 rounded-lg border bg-slate-700/50 border-slate-600/50 hover:bg-slate-600/50 transition-colors"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">
            {user.first_name?.charAt(0)}{user.last_name?.charAt(0)}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white font-semibold truncate">
            {user.first_name} {user.last_name}
          </p>
          <p className="text-slate-400 text-sm truncate">{user.email}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-shrink-0">
        {isConfirming ? (
          <ConfirmDialog
            actionType={confirmingAction}
            onConfirm={onConfirm}
            onCancel={onCancel}
          />
        ) : (
          renderActionButtons()
        )}
      </div>
    </motion.div>
  );
}

function ActionButton({ icon, tooltip, onClick, className = '' }) {
  const [isHovered, setIsHovered] = useState(false);
  const { refs, floatingStyles, context } = useFloating({
    open: isHovered,
    onOpenChange: setIsHovered,
  });
  const { getReferenceProps, getFloatingProps } = useInteractions([
    useHover(context),
  ]);

  return (
    <>
      <motion.button
        ref={refs.setReference}
        {...getReferenceProps()}
        onClick={onClick}
        className={`${className || 'text-blue-400 hover:text-blue-300'} transition-colors p-2 rounded-lg hover:bg-slate-600/50`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        {icon}
      </motion.button>
      {isHovered && (
        <FloatingPortal>
          <motion.div
            ref={refs.setFloating}
            style={floatingStyles}
            {...getFloatingProps()}
            className="bg-slate-800 text-white px-3 py-2 rounded-lg shadow-lg border border-slate-600 text-sm z-50"
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
          >
            {tooltip}
          </motion.div>
        </FloatingPortal>
      )}
    </>
  );
}

function ConfirmDialog({ actionType, onConfirm, onCancel }) {
  const getMessage = () => {
    switch (actionType) {
      case 'send':
        return 'Arkadaş isteği göndermek istediğinize emin misiniz?';
      case 'accept':
        return 'Arkadaş isteğini kabul etmek istediğinize emin misiniz?';
      case 'reject':
        return 'Arkadaş isteğini reddetmek istediğinize emin misiniz?';
      case 'cancel':
        return 'Arkadaş isteğini geri çekmek istediğinize emin misiniz?';
      default:
        return 'Bu işlemi yapmak istediğinize emin misiniz?';
    }
  };

  return (
    <motion.div
      className="flex items-center gap-2"
      initial={{ opacity: 0, x: 10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
    >
      <span className="text-xs text-slate-300 whitespace-nowrap">{getMessage()}</span>
      <button
        onClick={onConfirm}
        className="text-green-400 hover:text-green-300 transition-colors p-1"
        title="Evet"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </button>
      <button
        onClick={onCancel}
        className="text-slate-400 hover:text-slate-300 transition-colors p-1"
        title="Hayır"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </motion.div>
  );
}

