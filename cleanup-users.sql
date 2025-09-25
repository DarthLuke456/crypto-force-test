-- ============================================
-- CLEANUP USERS TABLE - CRYPTO FORCE
-- ============================================

-- WARNING: This will delete ALL users except the authorized ones
-- Make sure to backup your data before running this!

-- 1. First, let's see what we're about to delete
SELECT 
    'USERS TO BE DELETED' as action,
    email,
    user_level,
    created_at
FROM users 
WHERE email NOT IN (
    'infocryptoforce@gmail.com',
    'coeurdeluke.js@gmail.com', 
    'josefranciscocastrosias@gmail.com'
)
ORDER BY created_at DESC;

-- 2. Delete all users except the authorized ones
DELETE FROM users 
WHERE email NOT IN (
    'infocryptoforce@gmail.com',
    'coeurdeluke.js@gmail.com', 
    'josefranciscocastrosias@gmail.com'
);

-- 3. Verify the cleanup
SELECT 
    'REMAINING USERS' as status,
    email,
    user_level,
    created_at
FROM users 
ORDER BY email;

-- 4. Check if we need to reset any sequences or constraints
SELECT COUNT(*) as remaining_users FROM users;
