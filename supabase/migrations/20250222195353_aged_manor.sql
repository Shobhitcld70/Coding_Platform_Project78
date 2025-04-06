/*
  # Update storage policies for avatars

  1. Changes
    - Update storage policies to check file name prefix instead of folder name
    - Simplify policy conditions for better reliability
  
  2. Security
    - Maintains security by ensuring users can only manage their own avatars
    - Keeps public read access for all avatars
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Authenticated users can read all avatars" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;

-- Create new simplified policies
CREATE POLICY "Authenticated users can read all avatars"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' 
  AND name LIKE auth.uid() || '-%'
);

CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND name LIKE auth.uid() || '-%'
);

CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND name LIKE auth.uid() || '-%'
);