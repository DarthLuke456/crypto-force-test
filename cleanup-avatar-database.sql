-- =====================================================
-- CLEANUP AVATAR DATABASE - OPTIMIZE STORAGE
-- =====================================================
-- This script cleans up old avatar data and optimizes storage

-- =====================================================
-- 1. CHECK CURRENT AVATAR STORAGE
-- =====================================================

-- Check current avatar storage statistics
SELECT 
    'AVATAR STORAGE ANALYSIS' as check_type,
    COUNT(*) as total_users,
    COUNT(avatar) as users_with_avatar,
    COUNT(CASE WHEN avatar IS NOT NULL AND length(avatar) > 50000 THEN 1 END) as large_avatars,
    COUNT(CASE WHEN avatar IS NOT NULL AND length(avatar) > 100000 THEN 1 END) as very_large_avatars,
    AVG(CASE WHEN avatar IS NOT NULL THEN length(avatar) ELSE 0 END) as avg_avatar_size,
    MAX(CASE WHEN avatar IS NOT NULL THEN length(avatar) ELSE 0 END) as max_avatar_size
FROM users;

-- =====================================================
-- 2. CLEAN UP LARGE AVATARS
-- =====================================================

-- Remove avatars that are too large (more than 50KB in base64)
-- This is approximately 37KB of actual image data
UPDATE users 
SET avatar = NULL 
WHERE avatar IS NOT NULL 
  AND length(avatar) > 50000;

-- Report how many were cleaned up
SELECT 
    'LARGE AVATARS CLEANED' as check_type,
    COUNT(*) as cleaned_count
FROM users 
WHERE avatar IS NULL 
  AND updated_at > NOW() - INTERVAL '1 minute';

-- =====================================================
-- 3. OPTIMIZE DATABASE STORAGE
-- =====================================================

-- Ensure avatar column is TEXT type for flexibility
ALTER TABLE users 
ALTER COLUMN avatar TYPE TEXT;

-- Remove any problematic indexes on avatar column
DROP INDEX IF EXISTS idx_users_avatar;
DROP INDEX IF EXISTS idx_users_avatar_partial;

-- Create a more efficient partial index for small avatars only
CREATE INDEX IF NOT EXISTS idx_users_avatar_optimized 
ON users (email) 
WHERE avatar IS NOT NULL 
  AND length(avatar) < 10000;

-- =====================================================
-- 4. ADD STORAGE OPTIMIZATION CONSTRAINTS
-- =====================================================

-- Add a check constraint to prevent extremely large avatars
ALTER TABLE users 
ADD CONSTRAINT check_avatar_size 
CHECK (avatar IS NULL OR length(avatar) <= 100000);

-- =====================================================
-- 5. VERIFY OPTIMIZATION RESULTS
-- =====================================================

-- Check final avatar storage statistics
SELECT 
    'FINAL AVATAR STORAGE' as check_type,
    COUNT(*) as total_users,
    COUNT(avatar) as users_with_avatar,
    COUNT(CASE WHEN avatar IS NOT NULL AND length(avatar) > 10000 THEN 1 END) as medium_avatars,
    COUNT(CASE WHEN avatar IS NOT NULL AND length(avatar) > 50000 THEN 1 END) as large_avatars,
    AVG(CASE WHEN avatar IS NOT NULL THEN length(avatar) ELSE 0 END) as avg_avatar_size,
    MAX(CASE WHEN avatar IS NOT NULL THEN length(avatar) ELSE 0 END) as max_avatar_size
FROM users;

-- Show sample of current avatars
SELECT 
    'SAMPLE AVATARS' as check_type,
    email,
    nickname,
    CASE 
        WHEN avatar IS NULL THEN 'No Avatar'
        WHEN length(avatar) < 1000 THEN 'Very Small'
        WHEN length(avatar) < 10000 THEN 'Small'
        WHEN length(avatar) < 50000 THEN 'Medium'
        ELSE 'Large'
    END as avatar_size_category,
    length(avatar) as avatar_size_bytes
FROM users 
WHERE avatar IS NOT NULL
ORDER BY length(avatar) DESC
LIMIT 10;

-- =====================================================
-- 6. PERFORMANCE ANALYSIS
-- =====================================================

-- Check table size and performance
SELECT 
    'TABLE PERFORMANCE' as check_type,
    pg_size_pretty(pg_total_relation_size('users')) as total_table_size,
    pg_size_pretty(pg_relation_size('users')) as table_size,
    pg_size_pretty(pg_indexes_size('users')) as indexes_size;

-- Check for any remaining large text fields
SELECT 
    'LARGE TEXT FIELDS' as check_type,
    column_name,
    data_type,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'users' 
  AND table_schema = 'public'
  AND data_type IN ('text', 'character varying')
  AND character_maximum_length IS NULL;
