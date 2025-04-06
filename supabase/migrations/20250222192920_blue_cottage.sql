/*
  # Fix users table RLS policy

  1. Changes
    - Add policy to allow users to insert their own profile data
    - This fixes the 403 error during signup

  2. Security
    - Users can only insert their own profile data
    - Maintains existing read/update policies
*/

-- Add policy for users to insert their own profile
CREATE POLICY "Users can insert their own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Add policy for users to insert their own profile during signup
CREATE POLICY "Users can insert their own profile during signup"
  ON users
  FOR INSERT
  TO anon
  WITH CHECK (auth.uid() = id);