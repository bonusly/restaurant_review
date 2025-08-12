-- Create the development and test databases
CREATE DATABASE restaurant_review_development;
CREATE DATABASE restaurant_review_test;

-- Grant all privileges to the postgres user (already the owner, but being explicit)
GRANT ALL PRIVILEGES ON DATABASE restaurant_review_development TO postgres;
GRANT ALL PRIVILEGES ON DATABASE restaurant_review_test TO postgres;
