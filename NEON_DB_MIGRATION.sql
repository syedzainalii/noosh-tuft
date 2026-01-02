/*
Hero Banner Table Migration for Noosh Tuft E-commerce
Run this in your Neon SQL Editor to create the hero_banners table
*/

-- Create the hero_banners table
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

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS ix_hero_banners_id ON hero_banners(id);

-- Create index for active banners (used frequently)
CREATE INDEX IF NOT EXISTS ix_hero_banners_active ON hero_banners(is_active);

-- Verify the table was created successfully
SELECT 
    table_name,
    column_name,
    data_type,
    character_maximum_length,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'hero_banners'
ORDER BY ordinal_position;

-- Check if table exists and show count
SELECT 
    'hero_banners' AS table_name,
    COUNT(*) AS record_count,
    EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'hero_banners'
    ) AS table_exists
FROM hero_banners;

-- Show all tables in your database
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
