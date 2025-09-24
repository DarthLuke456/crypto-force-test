-- SQL Queries to Debug Profile Data Persistence Issues
-- Execute these queries in Supabase SQL Editor to investigate the problem

-- 1. Check current user data in the database
SELECT 
    id,
    email,
    nombre,
    apellido,
    nickname,
    movil,
    exchange,
    avatar,
    user_level,
    referral_code,
    created_at,
    updated_at
FROM public.users 
WHERE email IN ('coeurdeluke.js@gmail.com', 'infocryptoforce@gmail.com')
ORDER BY updated_at DESC;

-- 2. Check if there are any recent updates to profile data
SELECT 
    email,
    nombre,
    apellido,
    nickname,
    updated_at,
    CASE 
        WHEN updated_at > NOW() - INTERVAL '1 hour' THEN 'Recent (last hour)'
        WHEN updated_at > NOW() - INTERVAL '1 day' THEN 'Recent (last day)'
        ELSE 'Old'
    END as update_status
FROM public.users 
WHERE email IN ('coeurdeluke.js@gmail.com', 'infocryptoforce@gmail.com')
ORDER BY updated_at DESC;

-- 3. Check the structure of the users table
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 4. Check for any constraints or triggers on the users table
SELECT 
    constraint_name,
    constraint_type,
    table_name
FROM information_schema.table_constraints 
WHERE table_name = 'users' 
AND table_schema = 'public';

-- 5. Check if there are any RLS (Row Level Security) policies affecting the users table
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

-- 6. Test inserting/updating a user record (be careful with this one)
-- This will help us see if there are any permission issues
SELECT 
    'Testing update permissions' as test_type,
    COUNT(*) as total_users,
    MAX(updated_at) as last_update
FROM public.users 
WHERE email IN ('coeurdeluke.js@gmail.com', 'infocryptoforce@gmail.com');

-- 7. Check if the API endpoints are working by looking at recent activity
-- (This query might not work depending on your logging setup)
SELECT 
    'Check API logs in Supabase Dashboard > Logs' as note,
    'Look for /api/profile/update-offline requests' as instruction;
