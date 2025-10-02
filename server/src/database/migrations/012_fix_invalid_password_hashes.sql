-- Migration: 012_fix_invalid_password_hashes.sql
-- Description: Geçersiz password_hash değerlerini temizle (boş string veya 60 karakterden kısa olanlar)

-- Boş string veya 60 karakterden kısa password_hash'leri NULL yap
-- Bunlar muhtemelen hatalı kayıtlar veya Firebase kullanıcıları
UPDATE public.users 
SET password_hash = NULL
WHERE password_hash IS NOT NULL 
  AND (password_hash = '' OR LENGTH(password_hash) < 60);

-- Yorum
COMMENT ON COLUMN public.users.password_hash IS 'Şifrelenmiş parola hash''i (bcrypt, 60 karakter) - Firebase kullanıcıları için NULL olabilir';

