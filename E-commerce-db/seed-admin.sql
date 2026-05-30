-- Seeds the initial Admin account.
-- Admin users cannot be self-registered through /api/auth/register, so the first
-- administrator must be inserted manually with this script.
--
--   Email:    admin@ecommerce.com
--   Password: Admin123!   <-- change it after the first login
--
-- The password_hash below is a BCrypt hash of the password above.
-- Idempotent: running it twice does nothing thanks to ON CONFLICT.

INSERT INTO public.users (name, email, password_hash, role)
VALUES (
    'Administrator',
    'admin@ecommerce.com',
    '$2a$11$G3p9zv2FNX8Z8p7W5eDHH.fU9KWw0Gtl8DdgpsqFVLpK9ikD2lfTW',
    'Admin'
)
ON CONFLICT (email) DO NOTHING;
