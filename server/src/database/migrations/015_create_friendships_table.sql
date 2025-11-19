-- Migration: 015_create_friendships_table.sql
-- Description: Arkadaşlık istekleri ve ilişkileri için tablo oluşturur

CREATE TABLE IF NOT EXISTS friendships (
    id SERIAL PRIMARY KEY,
    requester_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    addressee_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(20) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'rejected', 'cancelled')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_friendship UNIQUE (requester_id, addressee_id),
    CONSTRAINT no_self_friendship CHECK (requester_id != addressee_id)
);

-- Index'ler oluştur
CREATE INDEX IF NOT EXISTS idx_friendships_requester_id ON friendships(requester_id);
CREATE INDEX IF NOT EXISTS idx_friendships_addressee_id ON friendships(addressee_id);
CREATE INDEX IF NOT EXISTS idx_friendships_status ON friendships(status);
CREATE INDEX IF NOT EXISTS idx_friendships_requester_status ON friendships(requester_id, status);
CREATE INDEX IF NOT EXISTS idx_friendships_addressee_status ON friendships(addressee_id, status);

-- Kolon yorumları ekle
COMMENT ON TABLE friendships IS 'Arkadaşlık istekleri ve ilişkileri tablosu';
COMMENT ON COLUMN friendships.requester_id IS 'İsteği gönderen kullanıcı ID';
COMMENT ON COLUMN friendships.addressee_id IS 'İsteği alan kullanıcı ID';
COMMENT ON COLUMN friendships.status IS 'İstek durumu: pending, accepted, rejected, cancelled';

