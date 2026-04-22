-- Этот скрипт добавляет необходимые колонки для парсера Telegram
-- Выполните его в разделе SQL Editor в вашей панели Supabase

ALTER TABLE cars 
ADD COLUMN IF NOT EXISTS telegram_id text UNIQUE,
ADD COLUMN IF NOT EXISTS telegram_url text;

-- Добавим индекс для быстрого поиска дубликатов по telegram_id
CREATE INDEX IF NOT EXISTS idx_cars_telegram_id ON cars (telegram_id);
