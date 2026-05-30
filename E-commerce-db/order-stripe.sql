-- Links an order to the Stripe Checkout session that paid for it (prevents duplicates).

ALTER TABLE public.orders
    ADD COLUMN IF NOT EXISTS stripe_session_id VARCHAR(255);
