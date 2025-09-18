-- Script para verificar y corregir el mapeo de UID entre auth.users y public.users
-- Ejecutar en Supabase SQL Editor

-- 1. Verificar los usuarios en auth.users
SELECT 'auth.users' as tabla, id, email, created_at 
FROM auth.users 
WHERE email IN ('coeurdeluke.js@gmail.com', 'infocryptoforce@gmail.com')
ORDER BY email;

-- 2. Verificar los usuarios en public.users
SELECT 'public.users' as tabla, id, email, uid, created_at 
FROM public.users 
WHERE email IN ('coeurdeluke.js@gmail.com', 'infocryptoforce@gmail.com')
ORDER BY email;

-- 3. Comparar los UIDs
SELECT 
    p.email,
    p.uid as public_uid,
    a.id as auth_id,
    CASE 
        WHEN p.uid = a.id THEN '✅ CORRECTO'
        ELSE '❌ INCORRECTO - Necesita corrección'
    END as status
FROM public.users p
JOIN auth.users a ON p.email = a.email
WHERE p.email IN ('coeurdeluke.js@gmail.com', 'infocryptoforce@gmail.com')
ORDER BY p.email;

-- 4. Si hay UIDs incorrectos, corregirlos
UPDATE public.users 
SET uid = auth_users.id
FROM auth.users AS auth_users
WHERE public.users.email = auth_users.email
AND public.users.email IN ('coeurdeluke.js@gmail.com', 'infocryptoforce@gmail.com')
AND public.users.uid != auth_users.id;

-- 5. Verificar el resultado final
SELECT 
    p.email,
    p.uid as public_uid,
    a.id as auth_id,
    CASE 
        WHEN p.uid = a.id THEN '✅ CORRECTO'
        ELSE '❌ INCORRECTO'
    END as status_final
FROM public.users p
JOIN auth.users a ON p.email = a.email
WHERE p.email IN ('coeurdeluke.js@gmail.com', 'infocryptoforce@gmail.com')
ORDER BY p.email;
