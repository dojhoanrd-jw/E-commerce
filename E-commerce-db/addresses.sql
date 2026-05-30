-- Saved shipping addresses per user (address book).

CREATE TABLE public.addresses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
    label VARCHAR(60),
    recipient VARCHAR(255) NOT NULL,
    line1 VARCHAR(255) NOT NULL,
    city VARCHAR(120) NOT NULL,
    state VARCHAR(120),
    zip VARCHAR(30),
    country VARCHAR(80) NOT NULL,
    phone VARCHAR(40)
);
