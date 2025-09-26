-- Script SEGURO para corregir Francisco como Fundador
-- Este script actualiza en lugar de eliminar para evitar restricciones de clave foránea

-- 1. Verificar el estado actual de Francisco
SELECT 'Estado ANTES de la corrección' as check_type;
SELECT 
    id,
    email,
    nombre,
    apellido,
    nickname,
    user_level,
    referral_code,
    total_referrals,
    referred_by,
    created_at,
    updated_at
FROM public.users 
WHERE email = 'infocryptoforce@gmail.com';

-- 2. Verificar qué usuarios referencian a Francisco
SELECT 'Usuarios que referencian a Francisco' as check_type;
SELECT 
    id,
    email,
    nombre,
    apellido,
    nickname,
    referred_by,
    user_level
FROM public.users 
WHERE referred_by = 'e008315b-c159-4543-85e7-f8915f109e08';

-- 3. Actualizar Francisco como Fundador (SIN eliminar)
UPDATE public.users 
SET 
    user_level = 0, -- Fundador
    referral_code = 'CRYPTOFORCE_CRYPTOFORCE',
    nickname = 'CryptoForce',
    nombre = 'Franc',
    apellido = 'CryptoForce',
    referred_by = NULL, -- Fundadores no son referidos por nadie
    updated_at = NOW()
WHERE email = 'infocryptoforce@gmail.com';

-- 4. Verificar el estado después de la corrección
SELECT 'Estado DESPUÉS de la corrección' as check_type;
SELECT 
    id,
    email,
    nombre,
    apellido,
    nickname,
    user_level,
    referral_code,
    total_referrals,
    referred_by,
    created_at,
    updated_at
FROM public.users 
WHERE email = 'infocryptoforce@gmail.com';

-- 5. Verificar todos los usuarios fundadores
SELECT 'Todos los usuarios fundadores' as check_type;
SELECT 
    email,
    nombre,
    apellido,
    nickname,
    user_level,
    referral_code,
    total_referrals,
    referred_by
FROM public.users 
WHERE user_level = 0
ORDER BY email;

-- 6. Verificar que no hay duplicados
SELECT 'Verificación de duplicados' as check_type;
SELECT 
    email,
    COUNT(*) as count
FROM public.users 
GROUP BY email
HAVING COUNT(*) > 1;

-- 7. Verificar usuarios que referencian a Francisco después del cambio
SELECT 'Usuarios que referencian a Francisco después del cambio' as check_type;
SELECT 
    id,
    email,
    nombre,
    apellido,
    nickname,
    referred_by,
    user_level
FROM public.users 
WHERE referred_by = 'e008315b-c159-4543-85e7-f8915f109e08';
