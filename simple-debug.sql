-- Simple debug script that should work without errors
-- This script will help diagnose the current state

-- 1. Check current user data
SELECT 
  'CURRENT USER DATA' as check_type,
  uid::text as uid_text,
  email,
  nombre,
  apellido,
  nickname,
  user_level,
  avatar,
  created_at,
  updated_at,
  EXTRACT(EPOCH FROM (NOW() - updated_at)) as seconds_since_update
FROM users 
WHERE email = 'coeurdeluke@gmail.com'
ORDER BY updated_at DESC;

-- 2. Check for any duplicate records
SELECT 
  'DUPLICATE CHECK' as check_type,
  email,
  COUNT(*) as record_count,
  STRING_AGG(uid::text, ', ') as uids,
  STRING_AGG(updated_at::text, ', ') as update_times
FROM users 
WHERE email = 'coeurdeluke@gmail.com'
GROUP BY email;

-- 3. Check for any NULL or invalid data
SELECT 
  'DATA VALIDATION' as check_type,
  COUNT(*) as total_records,
  COUNT(CASE WHEN uid IS NULL THEN 1 END) as null_uids,
  COUNT(CASE WHEN email IS NULL OR email = '' THEN 1 END) as invalid_emails,
  COUNT(CASE WHEN user_level IS NULL THEN 1 END) as null_levels,
  COUNT(CASE WHEN avatar IS NULL OR avatar = '' THEN 1 END) as null_avatars,
  COUNT(CASE WHEN created_at IS NULL THEN 1 END) as null_created,
  COUNT(CASE WHEN updated_at IS NULL THEN 1 END) as null_updated
FROM users 
WHERE email = 'coeurdeluke@gmail.com';

-- 4. Check recent update patterns
SELECT 
  'UPDATE PATTERNS' as check_type,
  email,
  COUNT(*) as update_count,
  MIN(updated_at) as first_update,
  MAX(updated_at) as last_update,
  EXTRACT(EPOCH FROM (MAX(updated_at) - MIN(updated_at))) as update_duration_seconds
FROM users 
WHERE email = 'coeurdeluke@gmail.com'
GROUP BY email;
