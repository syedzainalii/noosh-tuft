-- Noosh Tuft E-commerce - Hero Banner Table
-- Copy and paste this entire code into your Neon SQL Editor

-- Step 1: Create hero_banners table
CREATE TABLE IF NOT EXISTS hero_banners (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500),
    subtitle VARCHAR(500),
    image_url VARCHAR(2000) NOT NULL,
    button1_text VARCHAR(100),
    button1_url VARCHAR(500),
    button2_text VARCHAR(100),
    button2_url VARCHAR(500),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Step 2: Create indexes
CREATE INDEX IF NOT EXISTS ix_hero_banners_id ON hero_banners(id);
CREATE INDEX IF NOT EXISTS ix_hero_banners_active ON hero_banners(is_active);

-- Step 3: Verify table was created
SELECT 
    'SUCCESS: hero_banners table created' AS status,
    COUNT(*) AS total_records
FROM hero_banners;

-- Step 4: Show all your tables
SELECT 
    schemaname,
    tablename
FROM pg_catalog.pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;
