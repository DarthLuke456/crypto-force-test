-- Comprehensive debug script to identify potential issues
-- This script will help diagnose database and performance problems

-- 1. Check current user data and recent updates
SELECT 
  'CURRENT USER STATUS' as check_type,
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

-- 2. Check for any database locks or active connections
SELECT 
  'DATABASE LOCKS' as check_type,
  COUNT(*) as total_locks,
  COUNT(CASE WHEN NOT granted THEN 1 END) as waiting_locks
FROM pg_locks;

-- 3. Check for long-running queries
SELECT 
  'ACTIVE QUERIES' as check_type,
  COUNT(*) as active_queries,
  MAX(EXTRACT(EPOCH FROM (NOW() - query_start))) as longest_query_seconds
FROM pg_stat_activity 
WHERE state = 'active' 
  AND query NOT LIKE '%pg_stat_activity%'
  AND query_start IS NOT NULL;

-- 4. Check user table statistics
SELECT 
  'TABLE STATS' as check_type,
  schemaname,
  tablename,
  n_tup_ins as total_inserts,
  n_tup_upd as total_updates,
  n_tup_del as total_deletes,
  n_live_tup as live_tuples,
  n_dead_tup as dead_tuples,
  last_vacuum,
  last_autovacuum,
  last_analyze,
  last_autoanalyze
FROM pg_stat_user_tables 
WHERE tablename = 'users';

-- 5. Check for any problematic patterns
SELECT 
  'PROBLEMATIC PATTERNS' as check_type,
  email,
  COUNT(*) as update_count,
  MIN(updated_at) as first_update,
  MAX(updated_at) as last_update,
  EXTRACT(EPOCH FROM (MAX(updated_at) - MIN(updated_at))) as update_duration_seconds
FROM users 
WHERE email = 'coeurdeluke@gmail.com'
GROUP BY email;

-- 6. Check for any NULL or invalid data that might cause issues
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

-- 7. Check for any duplicate or conflicting records
SELECT 
  'DUPLICATE CHECK' as check_type,
  email,
  COUNT(*) as record_count,
  STRING_AGG(uid::text, ', ') as uids,
  STRING_AGG(updated_at::text, ', ') as update_times
FROM users 
WHERE email = 'coeurdeluke@gmail.com'
GROUP BY email;
