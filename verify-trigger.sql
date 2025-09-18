-- Script simple para verificar el estado del trigger
-- Ejecutar en el SQL Editor de Supabase

-- 1. Verificar que el trigger existe
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- 2. Verificar que la función existe
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user';

-- 3. Verificar que la función generate_referral_code existe
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines 
WHERE routine_name = 'generate_referral_code';

-- 4. Verificar si hay usuarios en auth.users
SELECT 
  id,
  email,
  created_at
FROM auth.users 
ORDER BY created_at DESC
LIMIT 5;

-- 5. Verificar si hay usuarios en public.users
SELECT 
  id,
  email,
  nickname,
  user_level,
  created_at
FROM public.users 
ORDER BY created_at DESC
LIMIT 5;

-- 6. Probar la función generate_referral_code
SELECT generate_referral_code('test_user');
