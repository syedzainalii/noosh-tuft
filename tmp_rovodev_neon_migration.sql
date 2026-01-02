-- Migration: Add hero_banners table to Neon PostgreSQL database
-- Run this in your Neon SQL Editor or psql client

-- Create the hero_banners table
CREATE TABLE IF NOT EXISTS hero_banners (
    id SERIAL PRIMARY KEY,
    title VARCHAR,
    subtitle VARCHAR,
    image_url VARCHAR NOT NULL,
    button1_text VARCHAR,
    button1_url VARCHAR,
    button2_text VARCHAR,
    button2_url VARCHAR,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Create index on id (for faster lookups)
CREATE INDEX IF NOT EXISTS ix_hero_banners_id ON hero_banners(id);

-- Verify the table was created
SELECT table_name, column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'hero_banners'
ORDER BY ordinal_position;

-- Check if table exists
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_name = 'hero_banners'
) AS table_exists;
