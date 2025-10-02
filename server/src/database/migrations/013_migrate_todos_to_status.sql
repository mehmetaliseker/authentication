-- todos tablosunu is_completed'dan status'a geçir
-- Önce status sütununu ekle
ALTER TABLE todos ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'pending';

-- Mevcut is_completed verisini status'a aktar
UPDATE todos 
SET status = CASE 
  WHEN is_completed = true THEN 'completed'
  ELSE 'pending'
END
WHERE status = 'pending';

-- is_completed sütununu kaldır
ALTER TABLE todos DROP COLUMN IF EXISTS is_completed;

-- status constraint ekle
ALTER TABLE todos DROP CONSTRAINT IF EXISTS todos_status_check;
ALTER TABLE todos ADD CONSTRAINT todos_status_check CHECK (status IN ('pending', 'completed', 'deleted'));

-- completed_at sütunu yoksa ekle
ALTER TABLE todos ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP NULL;

