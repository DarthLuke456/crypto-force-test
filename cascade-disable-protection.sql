-- Script para eliminar la función de protección CON CASCADE
-- Esto eliminará la función Y el trigger que depende de ella

-- 1. Verificar la función y trigger antes de eliminar
SELECT 'Función y trigger antes de eliminar' as check_type;
SELECT 
    proname,
    proargnames,
    proargtypes
FROM pg_proc 
WHERE proname = 'check_founder_protection';

SELECT 'Trigger antes de eliminar' as check_type;
SELECT trigger_name FROM information_schema.triggers 
WHERE event_object_table = 'users';

-- 2. Eliminar la función CON CASCADE (esto eliminará el trigger también)
DROP FUNCTION IF EXISTS check_founder_protection() CASCADE;

-- 3. Verificar que la función fue eliminada
SELECT 'Función después de eliminar' as check_type;
SELECT 
    proname,
    proargnames,
    proargtypes
FROM pg_proc 
WHERE proname = 'check_founder_protection';

-- 4. Verificar que el trigger fue eliminado
SELECT 'Trigger después de eliminar' as check_type;
SELECT trigger_name FROM information_schema.triggers 
WHERE event_object_table = 'users';

-- 5. Probar actualización de nivel (debería funcionar)
SELECT 'Probando actualización de nivel' as test_type;
BEGIN;
UPDATE public.users 
SET user_level = 1 
WHERE email = 'infocryptoforce@gmail.com';
SELECT 'Nivel actualizado exitosamente' as result;
ROLLBACK;

-- 6. Probar actualización de código de referido (debería funcionar)
SELECT 'Probando actualización de código' as test_type;
BEGIN;
UPDATE public.users 
SET referral_code = 'TEST_CODE_CASCADE' 
WHERE email = 'infocryptoforce@gmail.com';
SELECT 'Código actualizado exitosamente' as result;
ROLLBACK;

-- 7. Probar actualización de nickname (debería funcionar)
SELECT 'Probando actualización de nickname' as test_type;
BEGIN;
UPDATE public.users 
SET nickname = 'TestNicknameCascade' 
WHERE email = 'infocryptoforce@gmail.com';
SELECT 'Nickname actualizado exitosamente' as result;
ROLLBACK;

-- 8. Probar actualización de total_referrals (debería funcionar)
SELECT 'Probando actualización de total_referrals' as test_type;
BEGIN;
UPDATE public.users 
SET total_referrals = 999 
WHERE email = 'infocryptoforce@gmail.com';
SELECT 'Total referidos actualizado exitosamente' as result;
ROLLBACK;

-- 9. Mostrar estado final
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
