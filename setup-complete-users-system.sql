-- Script principal para configurar el sistema de usuarios completo
-- Ejecutar este script en Supabase SQL Editor en el orden especificado

-- ========================================
-- PASO 1: Crear la tabla users si no existe
-- ========================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  nombre VARCHAR(255),
  apellido VARCHAR(255),
  nickname VARCHAR(255),
  movil VARCHAR(50),
  exchange VARCHAR(255),
  user_level INTEGER DEFAULT 1,
  referral_code VARCHAR(255) UNIQUE,
  uid UUID,
  codigo_referido VARCHAR(255),
  referred_by VARCHAR(255),
  total_referrals INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_user_level ON public.users(user_level);
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON public.users(referral_code);

-- Habilitar RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Crear políticas de seguridad
DROP POLICY IF EXISTS "Users can view own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;
DROP POLICY IF EXISTS "Users can insert own data" ON public.users;

CREATE POLICY "Users can view own data" ON public.users
  FOR SELECT USING (auth.uid()::text = uid::text);

CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid()::text = uid::text);

CREATE POLICY "Users can insert own data" ON public.users
  FOR INSERT WITH CHECK (auth.uid()::text = uid::text);

-- ========================================
-- PASO 2: Insertar usuarios existentes de auth.users
-- ========================================
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

-- ========================================
-- PASO 3: Actualizar usuarios autorizados a nivel 6
-- ========================================
UPDATE public.users 
SET 
  user_level = 6,
  updated_at = NOW()
WHERE email IN ('infocryptoforce@gmail.com', 'coeurdeluke.js@gmail.com')
  AND user_level != 6;

-- ========================================
-- PASO 4: Verificar resultados
-- ========================================
-- Mostrar todos los usuarios
SELECT 
  id,
  email,
  nickname,
  user_level,
  created_at,
  updated_at
FROM public.users
ORDER BY created_at;

-- Mostrar usuarios con nivel 6 (Maestros)
SELECT 
  id,
  email,
  nickname,
  user_level,
  created_at,
  updated_at
FROM public.users
WHERE user_level = 6
ORDER BY email;

-- Mostrar estructura de la tabla
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'users'
ORDER BY ordinal_position;
