-- Script para insertar usuarios existentes de Supabase Auth en la tabla users
-- Ejecutar este script en Supabase SQL Editor

-- Primero, verificar qué usuarios existen en auth.users pero no en public.users
SELECT 
  au.id,
  au.email,
  au.raw_user_meta_data,
  au.created_at
FROM auth.users au
LEFT JOIN public.users pu ON au.email = pu.email
WHERE pu.email IS NULL
ORDER BY au.created_at;

-- Insertar usuarios existentes en la tabla public.users
INSERT INTO public.users (
  id,
  email,
  nombre,
  apellido,
  nickname,
  movil,
  exchange,
  user_level,
  referral_code,
  uid,
  codigo_referido,
  referred_by,
  total_referrals,
  created_at,
  updated_at
)
SELECT 
  au.id,
  au.email,
  COALESCE(au.raw_user_meta_data->>'nombre', 'Usuario') as nombre,
  COALESCE(au.raw_user_meta_data->>'apellido', '') as apellido,
  COALESCE(au.raw_user_meta_data->>'nickname', 'Usuario') as nickname,
  COALESCE(au.raw_user_meta_data->>'movil', '') as movil,
  COALESCE(au.raw_user_meta_data->>'exchange', '') as exchange,
  CASE 
    WHEN au.email IN ('infocryptoforce@gmail.com', 'coeurdeluke.js@gmail.com') THEN 6
    ELSE 1
  END as user_level,
  'REF' || EXTRACT(EPOCH FROM au.created_at)::bigint as referral_code,
  au.id as uid,
  NULL as codigo_referido,
  NULL as referred_by,
  0 as total_referrals,
  au.created_at,
  NOW() as updated_at
FROM auth.users au
LEFT JOIN public.users pu ON au.email = pu.email
WHERE pu.email IS NULL
ON CONFLICT (email) DO NOTHING;

-- Verificar que los usuarios se insertaron correctamente
SELECT 
  id,
  email,
  nickname,
  user_level,
  created_at
FROM public.users
ORDER BY created_at;
