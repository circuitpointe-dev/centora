-- Add access_json column to profiles table for storing user permissions
ALTER TABLE profiles ADD COLUMN access_json JSONB DEFAULT '{}'::jsonb;

-- Update the column to be NOT NULL with default
ALTER TABLE profiles ALTER COLUMN access_json SET NOT NULL;

-- Add an index for better performance on access_json queries
CREATE INDEX idx_profiles_access_json ON profiles USING GIN(access_json);

-- Drop the old RPC functions that are no longer needed
DROP FUNCTION IF EXISTS create_user_invitation(uuid, text, text, uuid, uuid[], jsonb, uuid, interval);
DROP FUNCTION IF EXISTS create_user_invitation(uuid, text, text, uuid, uuid[], jsonb, uuid);
DROP FUNCTION IF EXISTS accept_invitation(text, uuid);
DROP FUNCTION IF EXISTS accept_invitation(text);