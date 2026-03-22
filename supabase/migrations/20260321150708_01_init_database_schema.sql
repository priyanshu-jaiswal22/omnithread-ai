/*
  # OmniThread AI - Initial Database Schema

  1. New Tables
    - `users` - User profile and credit management
    - `generations` - Content generation history
    - `feedback` - User feedback on generated content
    - `waitlist` - Pro plan waitlist entries
    - `platform_preferences` - User platform customization

  2. Security
    - Enable RLS on all tables
    - Add restrictive access policies
    - Users can only access their own data
    - Waitlist is insert-only for users

  3. Indexes
    - Added for frequent query columns
    - Improves performance on generation lookups
*/

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  full_name text,
  avatar_url text,
  creator_type text,
  plan text DEFAULT 'free',
  credits_used integer DEFAULT 0,
  credits_limit integer DEFAULT 3,
  brand_voice text,
  default_platforms text[] DEFAULT '{}'::text[],
  onboarding_completed boolean DEFAULT false,
  billing_reset_date timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  TO authenticated
  USING (id = auth.uid());

CREATE POLICY "Users can update own data"
  ON users FOR UPDATE
  TO authenticated
  USING (id = auth.uid())
  WITH CHECK (id = auth.uid());

CREATE POLICY "Users can insert own data"
  ON users FOR INSERT
  TO authenticated
  WITH CHECK (id = auth.uid());

-- Create generations table
CREATE TABLE IF NOT EXISTS generations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  input_content text NOT NULL,
  input_type text NOT NULL,
  input_url text,
  platforms_selected text[] NOT NULL,
  outputs jsonb NOT NULL,
  credits_used integer DEFAULT 1,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE generations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own generations"
  ON generations FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own generations"
  ON generations FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own generations"
  ON generations FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own generations"
  ON generations FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

CREATE INDEX idx_generations_user_id ON generations(user_id);
CREATE INDEX idx_generations_created_at ON generations(created_at DESC);

-- Create feedback table
CREATE TABLE IF NOT EXISTS feedback (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  generation_id uuid NOT NULL REFERENCES generations(id) ON DELETE CASCADE,
  rating text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own feedback"
  ON feedback FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert feedback"
  ON feedback FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own feedback"
  ON feedback FOR DELETE
  TO authenticated
  USING (user_id = auth.uid());

CREATE INDEX idx_feedback_generation_id ON feedback(generation_id);

-- Create waitlist table
CREATE TABLE IF NOT EXISTS waitlist (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE waitlist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can join waitlist"
  ON waitlist FOR INSERT
  TO anon
  WITH CHECK (true);

-- Create platform_preferences table
CREATE TABLE IF NOT EXISTS platform_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  platform_name text NOT NULL,
  custom_prompt text,
  is_enabled boolean DEFAULT true,
  sort_order integer,
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, platform_name)
);

ALTER TABLE platform_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own preferences"
  ON platform_preferences FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own preferences"
  ON platform_preferences FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own preferences"
  ON platform_preferences FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE INDEX idx_platform_preferences_user_id ON platform_preferences(user_id);
