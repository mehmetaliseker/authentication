-- Migration: 009_create_search_history_table.sql
-- Description: Arama geçmişi tablosunu oluşturur

CREATE TABLE IF NOT EXISTS public.search_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    query_text VARCHAR(500) NOT NULL,
    results_count INTEGER DEFAULT 0,
    search_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


