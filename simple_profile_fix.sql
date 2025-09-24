-- Simple Profile Persistence Fix
-- Execute this in Supabase SQL Editor

-- 1. First, let's see what columns actually exist in the users table
SELECT column_name, data_type, is_nullable
FROM information_schema.columns 
WHERE table_name = 'users' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Check current user data
SELECT 
    id,
    email,
    nombre,
    apellido,
    nickname,
    movil,
    exchange,
    user_level,
    referral_code,
    created_at,
    updated_at
FROM public.users 
WHERE email IN ('coeurdeluke.js@gmail.com', 'infocryptoforce@gmail.com');

-- 3. Check if RLS is enabled and what policies exist
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'users' AND schemaname = 'public';

-- 4. Check existing RLS policies
SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'users' AND schemaname = 'public';

-- 5. Test a simple update to see if it works
UPDATE public.users 
SET 
    nombre = 'Usuario Test',
    updated_at = NOW()
WHERE email = 'coeurdeluke.js@gmail.com'
RETURNING email, nombre, updated_at;

-- 6. Verify the update worked
SELECT 
    email,
    nombre,
    updated_at
FROM public.users 
WHERE email = 'coeurdeluke.js@gmail.com';

-- 7. Reset the test data
UPDATE public.users 
SET 
    nombre = 'Usuario',
    updated_at = NOW()
WHERE email = 'coeurdeluke.js@gmail.com';

-- 8. Final check
SELECT 
    email,
    nombre,
    updated_at
FROM public.users 
WHERE email = 'coeurdeluke.js@gmail.com';
