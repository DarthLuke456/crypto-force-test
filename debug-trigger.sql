-- Script para debuggear por qué el trigger no funciona
-- Ejecutar en el SQL Editor de Supabase

-- 1. Verificar que el trigger existe y está activo
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement,
  action_timing,
  action_orientation
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- 2. Verificar que la función existe
SELECT 
  routine_name,
  routine_type,
  data_type,
  security_type
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user';

-- 3. Verificar que la función generate_referral_code existe
SELECT 
  routine_name,
  routine_type,
  data_type,
  security_type
FROM information_schema.routines 
WHERE routine_name = 'generate_referral_code';

-- 4. Verificar la estructura de auth.users
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'users' 
AND table_schema = 'auth'
AND column_name IN ('id', 'email', 'raw_user_meta_data')
ORDER BY ordinal_position;

-- 5. Verificar la estructura de public.users
SELECT 
  column_name,
  data_type,
  is_nullable
FROM information_schema.columns 
WHERE table_name = 'users' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 6. Verificar si hay usuarios en auth.users
SELECT 
  COUNT(*) as total_auth_users,
  COUNT(CASE WHEN email = 'coeurdeluke.js@gmail.com' THEN 1 END) as user_exists
FROM auth.users;

-- 7. Verificar si hay usuarios en public.users
SELECT 
  COUNT(*) as total_public_users
FROM public.users;

-- 8. Probar la función generate_referral_code manualmente
SELECT generate_referral_code('test_user');

-- 9. Verificar permisos del usuario actual
SELECT current_user, session_user;

-- 10. Verificar si hay errores en los logs del trigger (versión simplificada)
SELECT 
  pid,
  usename,
  application_name,
  client_addr,
  state,
  query_start,
  state_change,
  query
FROM pg_stat_activity 
WHERE query LIKE '%TRIGGER%' 
   OR query LIKE '%ERROR%'
   OR query LIKE '%Usuario%'
   OR query LIKE '%handle_new_user%'
ORDER BY query_start DESC
LIMIT 20;
