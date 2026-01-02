-- Simple Hero Banner Table for Noosh Tuft E-commerce
-- Just image upload with optional title and subtitle
-- Copy and paste this into your Neon SQL Editor

-- Create simplified hero_banners table
CREATE TABLE IF NOT EXISTS hero_banners (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500),
    subtitle VARCHAR(500),
    image_url VARCHAR(2000) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS ix_hero_banners_id ON hero_banners(id);
CREATE INDEX IF NOT EXISTS ix_hero_banners_active ON hero_banners(is_active);

-- Verify table was created
SELECT 
    'SUCCESS: Simplified hero_banners table created' AS status,
    COUNT(*) AS total_records
FROM hero_banners;

-- Show table structure
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'hero_banners'
ORDER BY ordinal_position;
