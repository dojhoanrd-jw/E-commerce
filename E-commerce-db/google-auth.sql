-- Allow accounts created through an external provider (e.g. Google sign-in)
-- to have no local password hash.
ALTER TABLE public.users ALTER COLUMN password_hash DROP NOT NULL;
