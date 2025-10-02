-- Migration: 011_alter_password_hash_nullable.sql
-- Description: password_hash kolonunu nullable yap ve constraint'i güncelle (Firebase kullanıcıları için)

-- Eski constraint'i kaldır
ALTER TABLE public.users 
DROP CONSTRAINT IF EXISTS users_password_hash_check;

-- password_hash'i nullable yap
ALTER TABLE public.users 
ALTER COLUMN password_hash DROP NOT NULL;

-- Yeni constraint ekle: password_hash NULL olabilir veya en az 60 karakter olmalı
ALTER TABLE public.users 
ADD CONSTRAINT users_password_hash_check 
CHECK (password_hash IS NULL OR LENGTH(password_hash) >= 60);

-- Yorum ekle
COMMENT ON COLUMN public.users.password_hash IS 'Şifrelenmiş parola hash''i (bcrypt) - Firebase kullanıcıları için NULL olabilir';

