-- =====================================================
-- SQL QUERIES TO VERIFY DATABASE STRUCTURE AND USER DATA
-- =====================================================

-- 1. Check if the users table exists and its structure
SELECT 
    table_name,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_schema = 'public' 
  AND table_name = 'users' 
ORDER BY ordinal_position;

-- 2. Check if the users table exists in the database
SELECT 
    table_schema,
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_name = 'users' 
  AND table_schema IN ('public', 'auth');

-- 3. Get all users from the public.users table
SELECT 
    id,
    email,
    nombre,
    apellido,
    nickname,
    user_level,
    referral_code,
    referred_by,
    total_referrals,
    created_at,
    updated_at
FROM public.users 
ORDER BY created_at DESC;

-- 4. Get all users from auth.users (Supabase auth table)
SELECT 
    id,
    email,
    created_at,
    updated_at,
    email_confirmed_at
FROM auth.users 
ORDER BY created_at DESC;

-- 5. Check for the specific user (coeurdeluke.js@gmail.com) in public.users
SELECT 
    id,
    email,
    nombre,
    apellido,
    nickname,
    user_level,
    referral_code,
    referred_by,
    total_referrals,
    created_at,
    updated_at
FROM public.users 
WHERE email = 'coeurdeluke.js@gmail.com';

-- 6. Check for the specific user in auth.users
SELECT 
    id,
    email,
    created_at,
    updated_at,
    email_confirmed_at
FROM auth.users 
WHERE email = 'coeurdeluke.js@gmail.com';

-- 7. Check user levels distribution in public.users
SELECT 
    user_level,
    COUNT(*) as user_count
FROM public.users 
GROUP BY user_level 
ORDER BY user_level;

-- 8. Check referral relationships in public.users
SELECT 
    u1.nickname as referrer,
    u1.referral_code,
    u2.nickname as referred_user,
    u2.email as referred_email,
    u2.created_at as referral_date
FROM public.users u1
LEFT JOIN public.users u2 ON u1.referral_code::text = u2.referred_by::text
WHERE u1.referral_code IS NOT NULL
ORDER BY u1.created_at DESC;

-- 9. Check for any users with level 6 (Maestro) or level 0 (Fundador)
SELECT 
    email,
    nickname,
    user_level,
    created_at
FROM public.users 
WHERE user_level IN (0, 6)
ORDER BY user_level DESC, created_at DESC;

-- 10. Check if there are any constraints or indexes on the users table
SELECT 
    tc.constraint_name,
    tc.constraint_type,
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
WHERE tc.table_name = 'users' 
  AND tc.table_schema = 'public';

-- 11. Check recent user updates
SELECT 
    nickname,
    email,
    user_level,
    updated_at,
    EXTRACT(EPOCH FROM (NOW() - updated_at)) as seconds_since_update
FROM public.users 
WHERE updated_at > NOW() - INTERVAL '7 days'
ORDER BY updated_at DESC;

-- 12. Verify the specific user's access level and permissions
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
WHERE email = 'coeurdeluke.js@gmail.com' 
   OR user_level IN (0, 6);

-- 13. Check for any missing user data
SELECT 
    au.id as auth_user_id,
    au.email as auth_email,
    au.created_at as auth_created_at,
    pu.id as public_user_id,
    CASE 
        WHEN pu.id IS NULL THEN 'MISSING_PUBLIC_USER'
        ELSE 'PUBLIC_USER_EXISTS'
    END as user_status
FROM auth.users au
LEFT JOIN public.users pu ON au.email = pu.email
WHERE au.email = 'coeurdeluke.js@gmail.com';

-- 14. Get all tables in the database
SELECT 
    table_schema,
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_schema IN ('public', 'auth')
ORDER BY table_schema, table_name;

-- 15. Check RLS (Row Level Security) policies on users table
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'users' 
  AND schemaname = 'public';
