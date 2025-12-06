-- Migration: 020_add_read_at_to_messages.sql
-- Description: Mesajlara read_at timestamp kolonu ekler (görüldü zamanı için)

ALTER TABLE messages 
ADD COLUMN IF NOT EXISTS read_at TIMESTAMP NULL;

-- Mevcut okunmuş mesajlar için read_at değerini updated_at'e eşitle
UPDATE messages 
SET read_at = updated_at 
WHERE is_read = true AND read_at IS NULL;

-- Index oluştur
CREATE INDEX IF NOT EXISTS idx_messages_read_at ON messages(read_at);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_read_at ON messages(receiver_id, read_at);

-- Kolon yorumu ekle
COMMENT ON COLUMN messages.read_at IS 'Mesajın görüldü zamanı (timestamp)';

