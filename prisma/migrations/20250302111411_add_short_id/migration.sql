-- Enable pgcrypto in NeonDB (required for random byte generation)
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create function to generate 6-character Base62 ID
CREATE OR REPLACE FUNCTION generate_short_id()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := '';
  i INT;
  char_index INT;
BEGIN
  FOR i IN 1..6 LOOP
    char_index := FLOOR(random() * length(chars)) + 1;
    result := result || substr(chars, char_index, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Modify the User table to use the function for ID generation
-- ALTER TABLE "User" ALTER COLUMN "id" SET DEFAULT generate_short_id();