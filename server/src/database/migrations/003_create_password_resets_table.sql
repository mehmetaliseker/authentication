-- Migration: 003_create_password_resets_table.sql
-- Description: Password reset işlemleri için tablo oluşturur

CREATE TABLE public.password_resets (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    reset_token VARCHAR(255) NOT NULL UNIQUE,
    expires_at TIMESTAMP NOT NULL,
    used BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index'ler oluştur
CREATE INDEX idx_password_resets_user_id ON public.password_resets(user_id);
CREATE INDEX idx_password_resets_reset_token ON public.password_resets(reset_token);
CREATE INDEX idx_password_resets_expires_at ON public.password_resets(expires_at);
CREATE INDEX idx_password_resets_used ON public.password_resets(used);
CREATE INDEX idx_password_resets_created_at ON public.password_resets(created_at);

-- Constraint'ler ekle
ALTER TABLE public.password_resets 
    ADD CONSTRAINT chk_expires_at_future 
    CHECK (expires_at > created_at);

ALTER TABLE public.password_resets 
    ADD CONSTRAINT chk_reset_token_length 
    CHECK (LENGTH(reset_token) >= 32);

-- Tablo ve kolon yorumları ekle
COMMENT ON TABLE public.password_resets IS 'Şifre sıfırlama işlemlerini saklar';
COMMENT ON COLUMN public.password_resets.user_id IS 'Şifre sıfırlanacak kullanıcı ID''si';
COMMENT ON COLUMN public.password_resets.reset_token IS 'Benzersiz şifre sıfırlama token''ı';
COMMENT ON COLUMN public.password_resets.expires_at IS 'Token''ın geçerlilik süresi';
COMMENT ON COLUMN public.password_resets.used IS 'Token kullanıldı mı?';
COMMENT ON COLUMN public.password_resets.created_at IS 'Token oluşturulma zamanı';