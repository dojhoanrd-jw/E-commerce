CREATE TABLE public.product (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    stock INTEGER NOT NULL DEFAULT 0 CHECK (stock >= 0),
    price NUMERIC(10,2) NOT NULL CHECK (price >= 0),
    imageurl TEXT
);