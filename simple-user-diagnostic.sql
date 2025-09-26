-- Simple diagnostic script for user data
-- This script avoids UUID casting issues

-- 1. Check current user data
SELECT 
  'CURRENT USER DATA' as check_type,
  uid::text as uid_text,
  email,
  user_level,
  created_at,
  updated_at
FROM users 
WHERE email = 'coeurdeluke@gmail.com'
ORDER BY created_at DESC;

-- 2. Check all users
SELECT 
  'ALL USERS' as check_type,
  uid::text as uid_text,
  email,
  user_level,
  created_at
FROM users 
ORDER BY created_at DESC;

-- 3. Check for duplicate emails
SELECT 
  'DUPLICATE EMAILS' as check_type,
  email,
  COUNT(*) as count,
  MIN(created_at) as first_created,
  MAX(created_at) as last_created
FROM users 
GROUP BY email 
HAVING COUNT(*) > 1;

-- 4. Check user data integrity
SELECT 
  'DATA INTEGRITY' as check_type,
  email,
  CASE 
    WHEN uid IS NULL THEN 'Missing UID'
    WHEN email IS NULL THEN 'Missing Email'
    WHEN user_level IS NULL THEN 'Missing Level'
    ELSE 'OK'
  END as status,
  created_at
FROM users 
WHERE email = 'coeurdeluke@gmail.com';
