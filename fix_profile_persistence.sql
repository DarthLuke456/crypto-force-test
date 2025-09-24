-- SQL Script to Fix Profile Data Persistence Issues
-- Execute these queries in Supabase SQL Editor

-- 1. First, let's check the current state of the users table
SELECT 
    'Current user data:' as info,
    email,
    nombre,
    apellido,
    nickname,
    updated_at
FROM public.users 
WHERE email IN ('coeurdeluke.js@gmail.com', 'infocryptoforce@gmail.com');

-- 2. Ensure the users table has all necessary columns for profile data
-- Add missing columns if they don't exist
DO $$ 
BEGIN
    -- Add avatar column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'avatar' AND table_schema = 'public') THEN
        ALTER TABLE public.users ADD COLUMN avatar TEXT DEFAULT '/images/default-avatar.png';
    END IF;
    
    -- Add birthdate column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'birthdate' AND table_schema = 'public') THEN
        ALTER TABLE public.users ADD COLUMN birthdate TEXT DEFAULT '';
    END IF;
    
    -- Add country column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'country' AND table_schema = 'public') THEN
        ALTER TABLE public.users ADD COLUMN country TEXT DEFAULT '';
    END IF;
    
    -- Add bio column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'users' AND column_name = 'bio' AND table_schema = 'public') THEN
        ALTER TABLE public.users ADD COLUMN bio TEXT DEFAULT '';
    END IF;
END $$;

-- 3. Update the existing users with proper default values
UPDATE public.users 
SET 
    avatar = COALESCE(avatar, '/images/default-avatar.png'),
    birthdate = COALESCE(birthdate, ''),
    country = COALESCE(country, ''),
    bio = COALESCE(bio, ''),
    updated_at = NOW()
WHERE email IN ('coeurdeluke.js@gmail.com', 'infocryptoforce@gmail.com')
AND (avatar IS NULL OR birthdate IS NULL OR country IS NULL OR bio IS NULL);

-- 4. Ensure RLS (Row Level Security) is properly configured
-- First, let's see if RLS is enabled
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'users' AND schemaname = 'public';

-- 5. Create or update RLS policies to allow profile updates
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can update their own profile" ON public.users;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.users;

-- Create new policies (fixed type casting)
CREATE POLICY "Users can view their own profile" ON public.users
    FOR SELECT USING (auth.uid()::text = id::text OR auth.email() = email);

CREATE POLICY "Users can update their own profile" ON public.users
    FOR UPDATE USING (auth.uid()::text = id::text OR auth.email() = email);

-- 6. Grant necessary permissions
GRANT SELECT, UPDATE ON public.users TO authenticated;
GRANT SELECT, UPDATE ON public.users TO anon;

-- 7. Create a function to automatically update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 8. Create trigger to automatically update updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- 9. Test the update functionality
-- This will help us verify that updates work
UPDATE public.users 
SET 
    nombre = 'Usuario Test',
    apellido = 'Crypto Force Test',
    nickname = 'testuser',
    updated_at = NOW()
WHERE email = 'coeurdeluke.js@gmail.com'
RETURNING email, nombre, apellido, nickname, updated_at;

-- 10. Verify the update worked
SELECT 
    'After test update:' as info,
    email,
    nombre,
    apellido,
    nickname,
    updated_at
FROM public.users 
WHERE email = 'coeurdeluke.js@gmail.com';

-- 11. Reset the test data
UPDATE public.users 
SET 
    nombre = 'Usuario',
    apellido = 'Crypto Force',
    nickname = 'coeurdeluke.js',
    updated_at = NOW()
WHERE email = 'coeurdeluke.js@gmail.com';

-- 12. Final verification
SELECT 
    'Final state:' as info,
    email,
    nombre,
    apellido,
    nickname,
    avatar,
    updated_at
FROM public.users 
WHERE email IN ('coeurdeluke.js@gmail.com', 'infocryptoforce@gmail.com');
