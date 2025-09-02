-- Logout logs tablosu oluştur
CREATE TABLE IF NOT EXISTS logout_logs (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    logout_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address INET,
    user_agent TEXT,
    session_duration INTERVAL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index ekle
CREATE INDEX IF NOT EXISTS idx_logout_logs_user_id ON logout_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_logout_logs_logout_time ON logout_logs(logout_time);
