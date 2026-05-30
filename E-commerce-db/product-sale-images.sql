-- Adds optional sale price and an image gallery (array of URLs) to products.

ALTER TABLE public.product
    ADD COLUMN IF NOT EXISTS sale_price NUMERIC(10,2),
    ADD COLUMN IF NOT EXISTS images TEXT[] NOT NULL DEFAULT '{}';
