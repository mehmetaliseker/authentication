-- Migration: 007_create_password_history_table.sql
-- Description: Şifre geçmişi tablosunu oluşturur

CREATE TABLE IF NOT EXISTS public.password_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index'ler oluştur
CREATE INDEX IF NOT EXISTS idx_password_history_user_id ON public.password_history(user_id);
CREATE INDEX IF NOT EXISTS idx_password_history_created_at ON public.password_history(created_at);

-- Tablo yorumu ekle
COMMENT ON TABLE public.password_history IS 'Kullanıcı şifre geçmişini saklar';
COMMENT ON COLUMN public.password_history.user_id IS 'Kullanıcı ID referansı';
COMMENT ON COLUMN public.password_history.password_hash IS 'Şifrelenmiş parola hash''i';
COMMENT ON COLUMN public.password_history.created_at IS 'Şifrenin oluşturulma tarihi';
