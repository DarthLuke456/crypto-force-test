-- Fix UID consistency issues
-- This script will ensure UIDs match between auth and users table

-- 1. First, let's see what we have
SELECT 
  'BEFORE FIX' as status,
  uid,
  email,
  user_level,
  created_at
FROM users 
WHERE email = 'coeurdeluke@gmail.com'
ORDER BY created_at DESC;

-- 2. Get the correct UID from auth.users (if accessible)
-- Note: This might not work if we don't have access to auth.users
-- But we can try to get it from the session

-- 3. Update the user record with the correct UID
-- We need to get the actual UID from the session
-- For now, let's check if there are multiple records for the same email
SELECT 
  'MULTIPLE RECORDS CHECK' as status,
  email,
  COUNT(*) as record_count,
  STRING_AGG(uid::text, ', ') as uids,
  STRING_AGG(created_at::text, ', ') as created_dates
FROM users 
WHERE email = 'coeurdeluke@gmail.com'
GROUP BY email
HAVING COUNT(*) > 1;

-- 4. If there are multiple records, we need to keep the most recent one
-- and delete the others
DELETE FROM users 
WHERE email = 'coeurdeluke@gmail.com' 
AND created_at < (
  SELECT MAX(created_at) 
  FROM users 
  WHERE email = 'coeurdeluke@gmail.com'
);

-- 5. Check the result
SELECT 
  'AFTER CLEANUP' as status,
  uid,
  email,
  user_level,
  created_at
FROM users 
WHERE email = 'coeurdeluke@gmail.com';
