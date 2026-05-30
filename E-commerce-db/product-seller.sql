-- Adds product ownership: each product belongs to the seller (user) who created it.
-- Existing seed products keep seller_id NULL (managed by admins).

ALTER TABLE public.product
    ADD COLUMN IF NOT EXISTS seller_id INTEGER REFERENCES public.users(id);
