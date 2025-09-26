-- Script para verificar el estado actual de la protección

-- 1. Verificar si el trigger está activo
SELECT 'Estado del trigger de protección' as check_type;
SELECT 
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'founder_protection_trigger';

-- 2. Verificar el estado de los usuarios fundadores
SELECT 'Estado de usuarios fundadores' as check_type;
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

-- 3. Probar una actualización simple para ver si funciona
SELECT 'Probando actualización simple' as test_type;
BEGIN;
UPDATE public.users 
SET nombre = 'Test Update' 
WHERE email = 'infocryptoforce@gmail.com';
SELECT 'Actualización exitosa' as result;
ROLLBACK;
