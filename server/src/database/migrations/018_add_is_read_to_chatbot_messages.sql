-- Migration: 018_add_is_read_to_chatbot_messages.sql
-- Description: Chatbot mesajlarına is_read kolonu ekler

ALTER TABLE chatbot_messages 
ADD COLUMN IF NOT EXISTS is_read BOOLEAN DEFAULT FALSE;

-- Mevcut assistant mesajlarını okunmamış olarak işaretle (varsayılan zaten false)
-- Mevcut user mesajlarını okunmuş olarak işaretle (kullanıcı kendi mesajını görmüştür)
UPDATE chatbot_messages 
SET is_read = true 
WHERE message_type = 'user';

-- Index oluştur
CREATE INDEX IF NOT EXISTS idx_chatbot_messages_is_read ON chatbot_messages(is_read);
CREATE INDEX IF NOT EXISTS idx_chatbot_messages_user_is_read ON chatbot_messages(user_id, is_read);

-- Kolon yorumu ekle
COMMENT ON COLUMN chatbot_messages.is_read IS 'Mesaj okundu mu? (sadece assistant mesajları için kullanılır)';


