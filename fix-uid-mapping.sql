-- Script para corregir el mapeo de UID entre auth.users y public.users
-- Ejecutar en Supabase SQL Editor

-- 1. Verificar los usuarios en auth.users
SELECT id, email, created_at 
FROM auth.users 
WHERE email IN ('coeurdeluke.js@gmail.com', 'infocryptoforce@gmail.com')
ORDER BY email;

-- 2. Verificar los usuarios en public.users
SELECT id, email, uid, created_at 
FROM public.users 
WHERE email IN ('coeurdeluke.js@gmail.com', 'infocryptoforce@gmail.com')
ORDER BY email;

-- 3. Actualizar el UID en public.users para que coincida con auth.users
UPDATE public.users 
SET uid = auth_users.id
FROM auth.users AS auth_users
WHERE public.users.email = auth_users.email
AND public.users.email IN ('coeurdeluke.js@gmail.com', 'infocryptoforce@gmail.com');

-- 4. Verificar que el mapeo se corrigió correctamente
SELECT 
    p.id as public_id,
    p.email,
    p.uid as public_uid,
    a.id as auth_id,
    CASE 
        WHEN p.uid = a.id THEN '✅ CORRECTO'
        ELSE '❌ INCORRECTO'
    END as status
FROM public.users p
JOIN auth.users a ON p.email = a.email
WHERE p.email IN ('coeurdeluke.js@gmail.com', 'infocryptoforce@gmail.com')
ORDER BY p.email;

-- 5. Verificar que las políticas RLS funcionan correctamente
-- Esto debería mostrar los datos del usuario autenticado
SELECT * FROM public.users WHERE uid = auth.uid();
