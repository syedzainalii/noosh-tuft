-- About Page Table for Noosh Tuft E-commerce
-- Copy and paste this into your Neon SQL Editor

-- Create about_page table
CREATE TABLE IF NOT EXISTS about_page (
    id SERIAL PRIMARY KEY,
    title VARCHAR(500) NOT NULL DEFAULT 'About Us',
    subtitle VARCHAR(500),
    content TEXT NOT NULL,
    image_url VARCHAR(2000),
    mission TEXT,
    vision TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE
);

-- Create index
CREATE INDEX IF NOT EXISTS ix_about_page_id ON about_page(id);

-- Verify table was created
SELECT 
    'SUCCESS: about_page table created' AS status,
    COUNT(*) AS total_records
FROM about_page;

-- Show table structure
SELECT 
    column_name,
    data_type,
    character_maximum_length,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'about_page'
ORDER BY ordinal_position;
