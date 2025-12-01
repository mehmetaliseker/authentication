-- Migration: 019_add_last_active_to_users.sql
-- Description: Users tablosuna last_active kolonu ekler

-- last_active kolonu ekle
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS last_active TIMESTAMP DEFAULT CURRENT_TIMESTAMP;

-- Index oluştur
CREATE INDEX IF NOT EXISTS idx_users_last_active ON public.users(last_active);

-- Mevcut kullanıcılar için last_active'i last_login veya created_at olarak ayarla
UPDATE public.users 
SET last_active = COALESCE(last_login, created_at)
WHERE last_active IS NULL;

-- Kolon yorumu ekle
COMMENT ON COLUMN public.users.last_active IS 'Kullanıcının son aktif olduğu zaman (mesaj gönderme, mesaj okuma, vb.)';

