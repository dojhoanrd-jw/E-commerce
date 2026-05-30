-- Product reviews: one review per user per product (enforced by the unique constraint).

CREATE TABLE public.reviews (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL REFERENCES public.product(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES public.users(id),
    user_name VARCHAR(255) NOT NULL,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    UNIQUE (product_id, user_id)
);
