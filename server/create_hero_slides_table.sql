-- SQL script to create hero_slides table
-- Run this on your production database (Vercel Postgres)

CREATE TABLE IF NOT EXISTS hero_slides (
    id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    subtitle VARCHAR,
    image_url VARCHAR NOT NULL,
    button_text VARCHAR,
    button_link VARCHAR,
    order_index INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Create index for ordering
CREATE INDEX IF NOT EXISTS idx_hero_slides_order ON hero_slides(order_index);
CREATE INDEX IF NOT EXISTS idx_hero_slides_active ON hero_slides(is_active);
