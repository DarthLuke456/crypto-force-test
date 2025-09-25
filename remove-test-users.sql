-- ============================================
-- REMOVE TEST USERS - CRYPTO FORCE
-- ============================================

-- 1. First, let's see what we're about to delete
SELECT 
    'USERS TO BE DELETED' as action,
    email,
    user_level,
    created_at
FROM users 
WHERE email IN (
    'darthluke.ai@gmail.com',
    'kurobushi.fx@gmail.com'
);

-- 2. Delete the test users
DELETE FROM users 
WHERE email IN (
    'darthluke.ai@gmail.com',
    'kurobushi.fx@gmail.com'
);

-- 3. Verify the cleanup
SELECT 
    'REMAINING USERS' as status,
    email,
    user_level,
    created_at
FROM users 
ORDER BY email;

-- 4. Check final count
SELECT COUNT(*) as remaining_users FROM users;
