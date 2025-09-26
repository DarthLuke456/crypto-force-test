-- Verificar el estado actual de Francisco en la base de datos
-- Este script nos ayudará a entender por qué no se está actualizando

-- 1. Verificar todos los usuarios con email infocryptoforce@gmail.com
SELECT 
    'TODOS LOS USUARIOS CON EMAIL infocryptoforce@gmail.com' as tipo,
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
WHERE email = 'infocryptoforce@gmail.com'
ORDER BY updated_at DESC;

-- 2. Verificar si hay usuarios duplicados
SELECT 
    'USUARIOS DUPLICADOS' as tipo,
    email,
    COUNT(*) as total_registros,
    STRING_AGG(id::text, ', ') as ids,
    STRING_AGG(user_level::text, ', ') as niveles,
    STRING_AGG(nickname, ', ') as nicknames
FROM public.users 
WHERE email = 'infocryptoforce@gmail.com'
GROUP BY email;

-- 3. Verificar el usuario específico que aparece en la interfaz
-- (basado en el ID que vemos en los logs: e008315b-c159-4543-85e7-f8915f109e08)
SELECT 
    'USUARIO ESPECÍFICO (ID: e008315b-c159-4543-85e7-f8915f109e08)' as tipo,
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
WHERE id = 'e008315b-c159-4543-85e7-f8915f109e08';

-- 4. Verificar todos los usuarios para ver el panorama completo
SELECT 
    'TODOS LOS USUARIOS' as tipo,
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
ORDER BY updated_at DESC;
