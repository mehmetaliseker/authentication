-- Migration: 010_add_firebase_uid_to_users.sql
-- Description: Users tablosuna firebase_uid kolonu ekler

-- Firebase UID kolonu ekle
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS firebase_uid VARCHAR(255) UNIQUE;

-- Index oluştur
CREATE INDEX IF NOT EXISTS idx_users_firebase_uid ON public.users(firebase_uid);

-- Yorum ekle
COMMENT ON COLUMN public.users.firebase_uid IS 'Firebase Authentication UID (Google ile giriş yapan kullanıcılar için)';

