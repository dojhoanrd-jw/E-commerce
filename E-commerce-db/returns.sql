-- Adds the return / refund workflow to orders.
ALTER TABLE public.orders
    ADD COLUMN IF NOT EXISTS return_status VARCHAR(20) NOT NULL DEFAULT 'None',
    ADD COLUMN IF NOT EXISTS return_reason TEXT,
    ADD COLUMN IF NOT EXISTS return_requested_at TIMESTAMPTZ;
