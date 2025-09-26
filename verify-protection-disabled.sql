-- Script para verificar que la protección está completamente desactivada

-- 1. Verificar triggers
SELECT 'Triggers en tabla users' as check_type;
SELECT 
    trigger_name,
    event_manipulation,
    action_timing
FROM information_schema.triggers 
WHERE event_object_table = 'users';

-- 2. Verificar funciones
SELECT 'Funciones de protección' as check_type;
SELECT 
    routine_name,
    routine_type
FROM information_schema.routines 
WHERE routine_name LIKE '%founder%';

-- 3. Probar actualización de campo básico
SELECT 'Probando actualización de campo básico' as test_type;
BEGIN;
UPDATE public.users 
SET nombre = 'Verification Test' 
WHERE email = 'infocryptoforce@gmail.com';
SELECT 'Campo básico actualizado exitosamente' as result;
ROLLBACK;

-- 4. Probar actualización de nivel
SELECT 'Probando actualización de nivel' as test_type;
BEGIN;
UPDATE public.users 
SET user_level = 1 
WHERE email = 'infocryptoforce@gmail.com';
SELECT 'Nivel actualizado exitosamente' as result;
ROLLBACK;

-- 5. Probar actualización de código de referido
SELECT 'Probando actualización de código de referido' as test_type;
BEGIN;
UPDATE public.users 
SET referral_code = 'TEST_CODE' 
WHERE email = 'infocryptoforce@gmail.com';
SELECT 'Código de referido actualizado exitosamente' as result;
ROLLBACK;

-- 6. Mostrar estado final
SELECT 'Estado final de usuarios' as check_type;
SELECT 
    email,
    nombre,
    apellido,
    nickname,
    user_level,
    referral_code,
    total_referrals
FROM public.users 
WHERE email IN ('coeurdeluke.js@gmail.com', 'infocryptoforce@gmail.com')
ORDER BY email;
