-- Script simplificado para desactivar la protección de fundadores
-- Versión corregida que funciona con PostgreSQL

-- 1. Desactivar el trigger de protección
DROP TRIGGER IF EXISTS founder_protection_trigger ON public.users;

-- 2. Eliminar la función de protección
DROP FUNCTION IF EXISTS check_founder_protection();

-- 3. Verificar que no hay triggers activos
SELECT 'Verificando triggers activos' as check_type;
SELECT 
    trigger_name,
    event_manipulation,
    action_timing
FROM information_schema.triggers 
WHERE event_object_table = 'users';

-- 4. Probar actualización de campo básico
SELECT 'Probando actualización de campo básico' as test_type;
BEGIN;
UPDATE public.users 
SET nombre = 'Test Simple Disable' 
WHERE email = 'infocryptoforce@gmail.com';
SELECT 'Campo básico actualizado exitosamente' as result;
ROLLBACK;

-- 5. Probar actualización de nivel
SELECT 'Probando actualización de nivel' as test_type;
BEGIN;
UPDATE public.users 
SET user_level = 1 
WHERE email = 'infocryptoforce@gmail.com';
SELECT 'Nivel actualizado exitosamente' as result;
ROLLBACK;

-- 6. Mostrar estado final
SELECT 'Estado final de usuarios fundadores' as check_type;
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
