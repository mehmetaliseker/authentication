-- Test Migration: test-migrations.sql
-- Description: Migration'ları test etmek için örnek veriler ve test sorguları

-- Test kullanıcısı ekle
INSERT INTO public.users (first_name, last_name, email, password_hash, is_verified) 
VALUES ('Test', 'User', 'test@example.com', '$2b$10$test.hash.that.is.longer.than.60.characters.for.validation', true);

-- Test kullanıcısı ID'sini al
DO $$
DECLARE
    test_user_id INT;
BEGIN
    SELECT id INTO test_user_id FROM public.users WHERE email = 'test@example.com';
    
    -- Test password reset token ekle
    INSERT INTO public.password_resets (user_id, reset_token, expires_at) 
    VALUES (test_user_id, 'test-reset-token-that-is-longer-than-32-characters', NOW() + INTERVAL '1 hour');
    
    RAISE NOTICE 'Test verileri eklendi. User ID: %, Password Reset ID: %', 
        test_user_id, 
        (SELECT id FROM public.password_resets WHERE user_id = test_user_id LIMIT 1);
END $$;

-- Test sorguları
-- 1. Users tablosu yapısını kontrol et
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

-- 2. Index'leri kontrol et
SELECT 
    indexname, 
    indexdef 
FROM pg_indexes 
WHERE tablename = 'users';

-- 3. Constraint'leri kontrol et
SELECT 
    conname, 
    contype, 
    pg_get_constraintdef(oid) as constraint_definition
FROM pg_constraint 
WHERE conrelid = 'public.users'::regclass;

-- 4. Trigger'ları kontrol et
SELECT 
    trigger_name, 
    event_manipulation, 
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'users';

-- 5. Password resets tablosu yapısını kontrol et
SELECT 
    column_name, 
    data_type, 
    is_nullable, 
    column_default
FROM information_schema.columns 
WHERE table_name = 'password_resets' 
ORDER BY ordinal_position;

-- 6. Foreign key ilişkisini kontrol et
SELECT 
    tc.constraint_name, 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
    AND tc.table_name='password_resets';

-- 7. Test verilerini kontrol et
SELECT 
    u.id,
    u.first_name,
    u.last_name,
    u.email,
    u.is_verified,
    u.last_login,
    u.failed_attempts,
    u.account_locked,
    COUNT(pr.id) as password_reset_count
FROM public.users u
LEFT JOIN public.password_resets pr ON u.id = pr.user_id
WHERE u.email = 'test@example.com'
GROUP BY u.id, u.first_name, u.last_name, u.email, u.is_verified, u.last_login, u.failed_attempts, u.account_locked;

-- 8. Migration tablosunu kontrol et
SELECT * FROM public.migrations ORDER BY id;

-- Test verilerini temizle (opsiyonel)
-- DELETE FROM public.password_resets WHERE user_id = (SELECT id FROM public.users WHERE email = 'test@example.com');
-- DELETE FROM public.users WHERE email = 'test@example.com';
