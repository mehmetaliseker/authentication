-- Migration: 014_create_user_login_logs_table.sql
-- Description: Kullanıcı giriş logları için basit tablo oluşturur

CREATE TABLE user_login_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    login_method VARCHAR(50) DEFAULT 'email',
    success BOOLEAN DEFAULT TRUE
);

-- Index'ler oluştur
CREATE INDEX IF NOT EXISTS idx_user_login_logs_user_id ON user_login_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_login_logs_login_time ON user_login_logs(login_time);
CREATE INDEX IF NOT EXISTS idx_user_login_logs_success ON user_login_logs(success);

-- Composite index for efficient querying
CREATE INDEX IF NOT EXISTS idx_user_login_logs_user_time ON user_login_logs(user_id, login_time);

-- Kolon yorumları ekle
COMMENT ON TABLE user_login_logs IS 'Kullanıcı giriş logları tablosu';
COMMENT ON COLUMN user_login_logs.user_id IS 'Kullanıcı ID';
COMMENT ON COLUMN user_login_logs.login_time IS 'Giriş zamanı';
COMMENT ON COLUMN user_login_logs.login_method IS 'Giriş yöntemi';
COMMENT ON COLUMN user_login_logs.success IS 'Giriş başarılı mı?';