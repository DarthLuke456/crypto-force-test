-- =====================================================
-- NEXT QUERIES TO RUN - Check your specific user data
-- =====================================================

-- 1. Check the structure of the users table
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'users' 
ORDER BY ordinal_position;

-- 2. Get all users (basic info)
SELECT 
    id,
    email,
    nickname,
    user_level,
    created_at
FROM public.users 
ORDER BY created_at DESC;

-- 3. Check for your specific user
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

-- 4. Check user levels distribution
SELECT 
    user_level,
    COUNT(*) as user_count
FROM public.users 
GROUP BY user_level 
ORDER BY user_level;

-- 5. Check for users with level 6 (Maestro) or level 0 (Fundador)
SELECT 
    email,
    nickname,
    user_level,
    created_at
FROM public.users 
WHERE user_level IN (0, 6)
ORDER BY user_level DESC, created_at DESC;
