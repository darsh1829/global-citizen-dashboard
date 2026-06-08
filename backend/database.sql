-- This command creates the 'users' table.
-- SERIAL is a special type for PostgreSQL that automatically creates an auto-incrementing integer for the id.
-- VARCHAR(255) is a standard choice for email addresses. UNIQUE ensures no two users can have the same email.
-- TEXT is used for the password hash, which can be long. NOT NULL means this field cannot be empty.
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255), -- Add this new line
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
);

-- This command creates the 'preferences' table.
-- The 'user_id' column is an integer that will store the id of the user who owns these preferences.
-- TEXT[] specifies that these columns will store an array of text strings.
-- The 'FOREIGN KEY (user_id) REFERENCES users(id)' constraint links this table to the 'users' table.
-- 'ON DELETE CASCADE' means that if a user is deleted, their corresponding preferences will be automatically deleted too.
CREATE TABLE preferences (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    tracked_countries TEXT[] DEFAULT '{}',
    tracked_cryptos TEXT[] DEFAULT '{}',
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
