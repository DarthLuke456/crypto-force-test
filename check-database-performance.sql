-- Check database performance and potential issues
-- This script will help identify any database problems causing page freezes

-- 1. Check for any database locks or long-running queries
SELECT 
  'DATABASE LOCKS' as check_type,
  COUNT(*) as lock_count
FROM pg_locks 
WHERE NOT granted;

-- 2. Check for any slow queries or connections
SELECT 
  'ACTIVE CONNECTIONS' as check_type,
  COUNT(*) as connection_count,
  MAX(now() - query_start) as longest_query_duration
FROM pg_stat_activity 
WHERE state = 'active' AND query NOT LIKE '%pg_stat_activity%';

-- 3. Check user table performance
SELECT 
  'USER TABLE STATS' as check_type,
  schemaname,
  tablename,
  n_tup_ins as inserts,
  n_tup_upd as updates,
  n_tup_del as deletes,
  n_live_tup as live_tuples,
  n_dead_tup as dead_tuples
FROM pg_stat_user_tables 
WHERE tablename = 'users';

-- 4. Check for any duplicate or problematic records
SELECT 
  'PROBLEMATIC RECORDS' as check_type,
  email,
  COUNT(*) as record_count,
  MIN(created_at) as first_created,
  MAX(created_at) as last_created,
  STRING_AGG(uid::text, ', ') as uids
FROM users 
GROUP BY email 
HAVING COUNT(*) > 1 OR MAX(created_at) - MIN(created_at) > INTERVAL '1 hour';

-- 5. Check for any NULL or invalid data
SELECT 
  'DATA VALIDATION' as check_type,
  COUNT(*) as total_records,
  COUNT(CASE WHEN uid IS NULL THEN 1 END) as null_uids,
  COUNT(CASE WHEN email IS NULL THEN 1 END) as null_emails,
  COUNT(CASE WHEN user_level IS NULL THEN 1 END) as null_levels,
  COUNT(CASE WHEN created_at IS NULL THEN 1 END) as null_created
FROM users;
