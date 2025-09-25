-- ============================================
-- DELETE COEURDELUKE@GMAIL.COM USER DATA
-- ============================================

-- 1. First, let's see what we're about to delete
SELECT 
    'USERS TO BE DELETED' as action,
    email,
    user_level,
    created_at
FROM users 
WHERE email = 'coeurdeluke@gmail.com';

-- 2. Check if there are any related records in other tables
-- (Check for any foreign key relationships)
SELECT 
    'CHECKING FOR RELATED DATA' as check_type,
    'users' as table_name,
    COUNT(*) as record_count
FROM users 
WHERE email = 'coeurdeluke@gmail.com';

-- 3. Delete the user from users table
DELETE FROM users 
WHERE email = 'coeurdeluke@gmail.com';

-- 4. Verify the deletion
SELECT 
    'REMAINING USERS' as status,
    email,
    user_level,
    created_at
FROM users 
ORDER BY email;

-- 5. Check final count
SELECT COUNT(*) as remaining_users FROM users;
