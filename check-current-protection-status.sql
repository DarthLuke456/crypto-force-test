-- Script para verificar el estado actual de la protección

-- 1. Verificar si hay triggers activos
SELECT 'Triggers activos en la tabla users' as check_type;
SELECT 
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'users';

-- 2. Verificar si la función existe
SELECT 'Funciones de protección existentes' as check_type;
SELECT 
    routine_name,
    routine_type,
    data_type
FROM information_schema.routines 
WHERE routine_name LIKE '%founder%';

-- 3. Verificar el estado de los usuarios fundadores
SELECT 'Estado actual de usuarios fundadores' as check_type;
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

-- 4. Probar una actualización simple
SELECT 'Probando actualización de campo básico' as test_type;
BEGIN;
UPDATE public.users 
SET nombre = 'Test Update Check' 
WHERE email = 'infocryptoforce@gmail.com';
SELECT 'Actualización de campo básico exitosa' as result;
ROLLBACK;
