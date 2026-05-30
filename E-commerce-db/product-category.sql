-- Adds a category to products and tags the seed products as Electrónica.

ALTER TABLE public.product
    ADD COLUMN IF NOT EXISTS category VARCHAR(50) NOT NULL DEFAULT 'Otros';

UPDATE public.product
SET category = 'Electrónica'
WHERE category = 'Otros';
