-- Script para desactivar COMPLETAMENTE toda la protección de fundadores
-- Esto eliminará todos los triggers y funciones de protección

-- 1. Desactivar todos los triggers relacionados con fundadores
DROP TRIGGER IF EXISTS founder_protection_trigger ON public.users;
DROP TRIGGER IF EXISTS founder_protection_trigger ON users;

-- 2. Eliminar todas las funciones de protección
DROP FUNCTION IF EXISTS check_founder_protection();
DROP FUNCTION IF EXISTS check_founder_protection() CASCADE;

-- 3. Verificar que no hay triggers activos
SELECT 'Verificando que no hay triggers activos' as check_type;
SELECT 
    trigger_name,
    event_manipulation,
    action_timing
FROM information_schema.triggers 
WHERE table_name = 'users';

-- 4. Verificar que no hay funciones de protección
SELECT 'Verificando que no hay funciones de protección' as check_type;
SELECT 
    routine_name,
    routine_type
FROM information_schema.routines 
WHERE routine_name LIKE '%founder%';

-- 5. Probar actualización para confirmar que funciona
SELECT 'Probando actualización después de desactivar toda la protección' as test_type;
BEGIN;
UPDATE public.users 
SET nombre = 'Test Complete Disable' 
WHERE email = 'infocryptoforce@gmail.com';
SELECT 'Actualización exitosa - Toda la protección desactivada' as result;
ROLLBACK;

-- 6. Probar actualización de nivel (debería funcionar ahora)
SELECT 'Probando actualización de nivel de usuario' as test_type;
BEGIN;
UPDATE public.users 
SET user_level = 1 
WHERE email = 'infocryptoforce@gmail.com';
SELECT 'Actualización de nivel exitosa - Protección completamente desactivada' as result;
ROLLBACK;

-- 7. Mostrar estado final
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
