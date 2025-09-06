-- Migration: 002_add_login_tracking.sql
-- Description: Users tablosuna login tracking kolonları ekler

ALTER TABLE public.users
    ADD COLUMN last_login TIMESTAMP,
    ADD COLUMN failed_attempts INT DEFAULT 0 CHECK (failed_attempts >= 0),
    ADD COLUMN account_locked BOOLEAN DEFAULT FALSE,
    ADD COLUMN locked_until TIMESTAMP;

-- Index'ler oluştur
CREATE INDEX IF NOT EXISTS idx_users_last_login ON public.users(last_login);
CREATE INDEX IF NOT EXISTS idx_users_failed_attempts ON public.users(failed_attempts);
CREATE INDEX IF NOT EXISTS idx_users_account_locked ON public.users(account_locked);

-- Constraint'ler ekle
ALTER TABLE public.users 
ADD CONSTRAINT chk_failed_attempts_max 
CHECK (failed_attempts <= 10);

-- Kolon yorumları ekle
COMMENT ON COLUMN public.users.last_login IS 'Son başarılı login zamanı';
COMMENT ON COLUMN public.users.failed_attempts IS 'Başarısız login denemeleri sayısı';
COMMENT ON COLUMN public.users.account_locked IS 'Hesap kilitli mi?';
COMMENT ON COLUMN public.users.locked_until IS 'Hesabın ne zamana kadar kilitli olduğu';