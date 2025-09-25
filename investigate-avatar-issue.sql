-- ============================================
-- INVESTIGATE AVATAR ISSUE
-- ============================================

-- 1. Check current users and their avatar data
SELECT 
    'CURRENT USERS' as check_type,
    email,
    user_level,
    nickname,
    created_at,
    updated_at
FROM users 
ORDER BY email;

-- 2. Check if there are any avatar-related fields in users table
-- (This will show us the structure of the users table)
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'users' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- 3. Check for any avatar-related tables
SELECT 
    'AVATAR TABLES' as check_type,
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND (table_name LIKE '%avatar%' OR table_name LIKE '%image%' OR table_name LIKE '%profile%')
ORDER BY table_name;

-- 4. Check for any shared avatar storage
-- (Look for any tables that might store avatars globally)
SELECT 
    'POTENTIAL AVATAR STORAGE' as check_type,
    table_name
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('avatars', 'user_avatars', 'profile_images', 'images')
ORDER BY table_name;

-- 5. Check if there are any foreign key relationships that might affect avatars
SELECT 
    'FOREIGN KEY RELATIONSHIPS' as check_type,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc 
JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
  AND tc.table_schema = 'public'
  AND (tc.table_name = 'users' OR ccu.table_name = 'users')
ORDER BY tc.table_name, kcu.column_name;
