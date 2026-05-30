-- Product variants (size / color), each with its own stock.
-- Order items get a snapshot of the chosen variant.

CREATE TABLE public.product_variants (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES public.product(id) ON DELETE CASCADE,
    size VARCHAR(50),
    color VARCHAR(50),
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0)
);

ALTER TABLE public.order_items
    ADD COLUMN IF NOT EXISTS variant_id INTEGER,
    ADD COLUMN IF NOT EXISTS variant_label VARCHAR(120);
