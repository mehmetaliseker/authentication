-- Migration: 017_create_chatbot_messages_table.sql
-- Description: Kullanıcı ve chatbot arası mesajlaşma için tablo oluşturur

CREATE TABLE IF NOT EXISTS chatbot_messages (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    message_type VARCHAR(20) NOT NULL CHECK (message_type IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index'ler oluştur
CREATE INDEX IF NOT EXISTS idx_chatbot_messages_user_id ON chatbot_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_messages_created_at ON chatbot_messages(created_at);
CREATE INDEX IF NOT EXISTS idx_chatbot_messages_user_created ON chatbot_messages(user_id, created_at DESC);

-- Kolon yorumları ekle
COMMENT ON TABLE chatbot_messages IS 'Kullanıcı ve chatbot arası mesajlaşma tablosu';
COMMENT ON COLUMN chatbot_messages.user_id IS 'Mesajı gönderen kullanıcı ID';
COMMENT ON COLUMN chatbot_messages.message_type IS 'Mesaj tipi: user (kullanıcı), assistant (chatbot)';
COMMENT ON COLUMN chatbot_messages.content IS 'Mesaj içeriği';

