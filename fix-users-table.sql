-- Script para verificar y corregir la tabla users
-- Ejecutar en Supabase SQL Editor

-- 1. Verificar la estructura actual de la tabla
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns 
WHERE table_name = 'users' AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. Verificar las políticas RLS
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'users';

-- 3. Si la tabla no existe o está mal configurada, recrearla
DROP TABLE IF EXISTS public.users CASCADE;

CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    nickname VARCHAR(100) NOT NULL,
    movil VARCHAR(20),
    exchange VARCHAR(50),
    user_level INTEGER DEFAULT 1,
    referral_code VARCHAR(50) UNIQUE NOT NULL,
    uid UUID UNIQUE NOT NULL,
    codigo_referido VARCHAR(50),
    referred_by UUID REFERENCES public.users(id),
    total_referrals INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Crear índices para mejor rendimiento
CREATE INDEX idx_users_email ON public.users(email);
CREATE INDEX idx_users_referral_code ON public.users(referral_code);
CREATE INDEX idx_users_uid ON public.users(uid);
CREATE INDEX idx_users_referred_by ON public.users(referred_by);

-- 5. Habilitar RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 6. Crear políticas RLS
-- Política para que los usuarios puedan leer sus propios datos
CREATE POLICY "Users can read own data" ON public.users
    FOR SELECT USING (auth.uid() = uid);

-- Política para que los usuarios puedan actualizar sus propios datos
CREATE POLICY "Users can update own data" ON public.users
    FOR UPDATE USING (auth.uid() = uid);

-- Política para permitir inserción de nuevos usuarios
CREATE POLICY "Allow user insertion" ON public.users
    FOR INSERT WITH CHECK (true);

-- Política para permitir verificar códigos de referido (lectura pública de referral_code)
CREATE POLICY "Allow referral code check" ON public.users
    FOR SELECT USING (true);

-- 7. Crear función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- 8. Crear trigger para updated_at
CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON public.users 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- 9. Insertar datos de prueba para los usuarios autorizados
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
) VALUES (
    gen_random_uuid(),
    'coeurdeluke.js@gmail.com',
    'Lucas',
    'Gonzalez',
    'Darth Luke',
    '+34 600 000 000',
    'Binance',
    6,
    'REFCOEUR2024',
    gen_random_uuid(),
    NULL,
    NULL,
    0,
    NOW(),
    NOW()
), (
    gen_random_uuid(),
    'infocryptoforce@gmail.com',
    'Crypto',
    'Force',
    'Crypto Force',
    '+34 600 000 001',
    'Binance',
    6,
    'REFCRYPTO2024',
    gen_random_uuid(),
    NULL,
    NULL,
    0,
    NOW(),
    NOW()
) ON CONFLICT (email) DO UPDATE SET
    nombre = EXCLUDED.nombre,
    apellido = EXCLUDED.apellido,
    nickname = EXCLUDED.nickname,
    movil = EXCLUDED.movil,
    exchange = EXCLUDED.exchange,
    user_level = EXCLUDED.user_level,
    updated_at = NOW();

-- 10. Verificar que los datos se insertaron correctamente
SELECT * FROM public.users ORDER BY created_at DESC;
