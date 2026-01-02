-- ===================================================
-- QUICK FIX: Create hero_slides table
-- ===================================================
-- Copy this entire script and run it in your Vercel Postgres dashboard
-- Location: Vercel Dashboard > Your Project > Storage > Database > Query Tab

-- Step 1: Create the table
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

-- Step 2: Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_hero_slides_order ON hero_slides(order_index);
CREATE INDEX IF NOT EXISTS idx_hero_slides_active ON hero_slides(is_active);

-- Step 3: Insert a sample slide (optional - remove if you don't want sample data)
INSERT INTO hero_slides (title, subtitle, image_url, button_text, button_link, order_index, is_active)
VALUES (
    'Welcome to Noosh Tuft',
    'Handcrafted Tufted & Embroidered Art',
    'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&h=900&fit=crop',
    'Shop Now',
    '/products',
    0,
    true
)
ON CONFLICT DO NOTHING;

-- Step 4: Verify the table was created
SELECT 
    table_name, 
    column_name, 
    data_type 
FROM information_schema.columns 
WHERE table_name = 'hero_slides'
ORDER BY ordinal_position;

-- Step 5: Check if the sample slide was inserted
SELECT * FROM hero_slides;

-- ===================================================
-- Expected Output:
-- - Table created successfully
-- - 2 indexes created
-- - 1 sample row inserted (if you kept step 3)
-- ===================================================
