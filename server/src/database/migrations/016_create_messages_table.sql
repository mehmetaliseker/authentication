-- Migration: 016_create_messages_table.sql
-- Description: Kullanıcılar arası mesajlaşma için tablo oluşturur

CREATE TABLE IF NOT EXISTS messages (
    id SERIAL PRIMARY KEY,
    sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    receiver_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_sender_receiver CHECK (sender_id != receiver_id)
);

-- Index'ler oluştur
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON messages(is_read);
CREATE INDEX IF NOT EXISTS idx_messages_sender_receiver ON messages(sender_id, receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_created ON messages(receiver_id, created_at DESC);

-- Kolon yorumları ekle
COMMENT ON TABLE messages IS 'Kullanıcılar arası mesajlaşma tablosu';
COMMENT ON COLUMN messages.sender_id IS 'Mesajı gönderen kullanıcı ID';
COMMENT ON COLUMN messages.receiver_id IS 'Mesajı alan kullanıcı ID';
COMMENT ON COLUMN messages.content IS 'Mesaj içeriği';
COMMENT ON COLUMN messages.is_read IS 'Mesaj okundu mu?';

