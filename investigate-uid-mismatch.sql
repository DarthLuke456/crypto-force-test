-- Investigate UID mismatch causing 406 errors
-- This script will help us understand the UID inconsistency

-- 1. Check current user data and UIDs
SELECT 
  'CURRENT USER DATA' as check_type,
  uid,
  email,
  user_level,
  created_at,
  updated_at
FROM users 
WHERE email = 'coeurdeluke@gmail.com'
ORDER BY created_at DESC;

-- 2. Check all users with their UIDs
SELECT 
  'ALL USERS' as check_type,
  uid,
  email,
  user_level,
  created_at
FROM users 
ORDER BY created_at DESC;

-- 3. Check for duplicate UIDs
SELECT 
  'DUPLICATE UIDS' as check_type,
  uid,
  COUNT(*) as count,
  STRING_AGG(email, ', ') as emails
FROM users 
GROUP BY uid 
HAVING COUNT(*) > 1;

-- 4. Check for invalid UID formats
SELECT 
  'INVALID UID FORMATS' as check_type,
  uid,
  email,
  LENGTH(uid::text) as uid_length,
  CASE 
    WHEN uid::text ~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' THEN 'Valid UUID'
    ELSE 'Invalid UUID'
  END as uid_status
FROM users 
WHERE uid IS NOT NULL;
