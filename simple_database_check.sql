-- =====================================================
-- SIMPLE DATABASE CHECK QUERIES (Safe for any data types)
-- =====================================================

-- 1. Check what tables exist in the database
SELECT 
    table_schema,
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema IN ('public', 'auth')
ORDER BY table_schema, table_name;

-- 2. Check the structure of the users table
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'users' 
ORDER BY ordinal_position;

-- 3. Get all users from public.users (basic info only)
SELECT 
    id,
    email,
    nickname,
    user_level,
    created_at
FROM public.users 
ORDER BY created_at DESC
LIMIT 10;

-- 4. Check for your specific user
SELECT 
    id,
    email,
    nombre,
    apellido,
    nickname,
    user_level,
    created_at,
    updated_at
FROM public.users 
WHERE email = 'coeurdeluke.js@gmail.com';

-- 5. Check user levels distribution
SELECT 
    user_level,
    COUNT(*) as user_count
FROM public.users 
GROUP BY user_level 
ORDER BY user_level;

-- 6. Check for users with level 6 (Maestro) or level 0 (Fundador)
SELECT 
    email,
    nickname,
    user_level,
    created_at
FROM public.users 
WHERE user_level IN (0, 6)
ORDER BY user_level DESC, created_at DESC;

-- 7. Check if your user has the correct level for navigation
SELECT 
    CASE 
        WHEN email = 'coeurdeluke.js@gmail.com' THEN 'FOUNDER_EMAIL'
        WHEN user_level = 6 THEN 'MAESTRO_LEVEL'
        WHEN user_level = 0 THEN 'FOUNDER_LEVEL'
        ELSE 'REGULAR_USER'
    END as access_type,
    email,
    nickname,
    user_level,
    created_at
FROM public.users 
WHERE email = 'coeurdeluke.js@gmail.com';

-- 8. Check recent user activity
SELECT 
    nickname,
    email,
    user_level,
    updated_at
FROM public.users 
WHERE updated_at > NOW() - INTERVAL '7 days'
ORDER BY updated_at DESC;

-- 9. Check data types of referral columns
SELECT 
    column_name,
    data_type,
    character_maximum_length
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'users' 
  AND column_name IN ('referral_code', 'referred_by', 'codigo_referido')
ORDER BY column_name;

-- 10. Simple count of total users
SELECT COUNT(*) as total_users FROM public.users;
