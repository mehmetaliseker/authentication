-- Migration: 001_create_users_table.sql
-- Description: Users tablosunu oluşturur

CREATE TABLE IF NOT EXISTS public.users (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL CHECK (LENGTH(first_name) >= 2),
    last_name VARCHAR(100) NOT NULL CHECK (LENGTH(last_name) >= 2),
    email VARCHAR(255) UNIQUE NOT NULL CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'),
    password_hash VARCHAR(255) NOT NULL CHECK (LENGTH(password_hash) >= 60),
    is_verified BOOLEAN DEFAULT FALSE,
    verification_token VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index'ler oluştur
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_verification_token ON public.users(verification_token);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users(created_at);

-- Updated_at için trigger oluştur
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON public.users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Tablo yorumu ekle
COMMENT ON TABLE public.users IS 'Kullanıcı bilgilerini saklar';
COMMENT ON COLUMN public.users.email IS 'Benzersiz email adresi';
COMMENT ON COLUMN public.users.password_hash IS 'Şifrelenmiş parola hash''i (bcrypt)';
COMMENT ON COLUMN public.users.is_verified IS 'Email doğrulama durumu';
COMMENT ON COLUMN public.users.verification_token IS 'Email doğrulama token''ı';