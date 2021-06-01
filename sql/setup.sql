DROP TABLE IF EXISTS images;

DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR NOT NULL CHECK (username <> ''),
    password VARCHAR NOT NULL CHECK (password <> '')
);

CREATE TABLE images(
    id SERIAL PRIMARY KEY,
    title VARCHAR NOT NULL,
    description TEXT,
    path VARCHAR NOT NULL,
    category VARCHAR NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);