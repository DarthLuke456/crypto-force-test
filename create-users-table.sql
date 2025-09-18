-- Script para crear la tabla users si no existe
-- Ejecutar este script en Supabase SQL Editor

-- Crear la tabla users si no existe
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

-- Crear índices para mejorar el rendimiento
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_user_level ON public.users(user_level);
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON public.users(referral_code);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Crear políticas de seguridad
-- Usuarios pueden ver solo sus propios datos
CREATE POLICY IF NOT EXISTS "Users can view own data" ON public.users
  FOR SELECT USING (auth.uid()::text = uid::text);

-- Usuarios pueden actualizar solo sus propios datos
CREATE POLICY IF NOT EXISTS "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid()::text = uid::text);

-- Usuarios pueden insertar sus propios datos
CREATE POLICY IF NOT EXISTS "Users can insert own data" ON public.users
  FOR INSERT WITH CHECK (auth.uid()::text = uid::text);

-- Verificar la estructura de la tabla
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'users'
ORDER BY ordinal_position;
