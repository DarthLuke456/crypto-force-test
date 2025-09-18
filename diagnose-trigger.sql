-- Script para diagnosticar por qué el trigger no funciona
-- Ejecutar en el SQL Editor de Supabase

-- 1. Verificar que el trigger existe
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement,
  action_timing
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- 2. Verificar que la función existe
SELECT 
  routine_name,
  routine_type,
  data_type
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user';

-- 3. Verificar que la función generate_referral_code existe
SELECT 
  routine_name,
  routine_type,
  data_type
FROM information_schema.routines 
WHERE routine_name = 'generate_referral_code';

-- 4. Verificar la estructura de la tabla public.users
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 5. Verificar si hay datos en auth.users
SELECT 
  id,
  email,
  raw_user_meta_data,
  created_at
FROM auth.users 
WHERE email = 'coeurdeluke.js@gmail.com'
ORDER BY created_at DESC;

-- 6. Verificar si hay datos en public.users
SELECT 
  id,
  email,
  nickname,
  user_level,
  referral_code,
  created_at
FROM public.users 
WHERE email = 'coeurdeluke.js@gmail.com'
ORDER BY created_at DESC;

-- 7. Verificar las políticas RLS
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'users' 
AND schemaname = 'public'
ORDER BY policyname;

-- 8. Probar la función generate_referral_code manualmente
SELECT generate_referral_code('test_user');

-- 9. Verificar logs del trigger (últimos 100 logs)
SELECT 
  log_time,
  message
FROM pg_stat_activity 
WHERE message LIKE '%Usuario%creado%' 
   OR message LIKE '%Error al crear usuario%'
ORDER BY log_time DESC
LIMIT 100;
