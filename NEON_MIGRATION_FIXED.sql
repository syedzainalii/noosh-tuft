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

CREATE INDEX IF NOT EXISTS ix_hero_banners_id ON hero_banners(id);

CREATE INDEX IF NOT EXISTS ix_hero_banners_active ON hero_banners(is_active);

SELECT * FROM hero_banners;
