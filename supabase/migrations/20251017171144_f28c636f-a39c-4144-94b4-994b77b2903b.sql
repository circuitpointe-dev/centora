-- Update the rating column to allow values from 0-100
ALTER TABLE vendors 
ALTER COLUMN rating TYPE numeric(5,2);