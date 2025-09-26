-- Script FINAL para eliminar la función de protección
-- Basado en el diagnóstico: función sin argumentos

-- 1. Verificar la función antes de eliminar
SELECT 'Función antes de eliminar' as check_type;
SELECT 
    proname,
    proargnames,
    proargtypes,
    prosrc
FROM pg_proc 
WHERE proname = 'check_founder_protection';

-- 2. Eliminar la función SIN argumentos
DROP FUNCTION IF EXISTS check_founder_protection();

-- 3. Verificar que la función fue eliminada
SELECT 'Función después de eliminar' as check_type;
SELECT 
    proname,
    proargnames,
    proargtypes
FROM pg_proc 
WHERE proname = 'check_founder_protection';

-- 4. Eliminar TODOS los triggers
DROP TRIGGER IF EXISTS founder_protection_trigger ON public.users CASCADE;

-- 5. Verificar que no hay triggers
SELECT 'Triggers después de eliminar' as check_type;
SELECT trigger_name FROM information_schema.triggers 
WHERE event_object_table = 'users';

-- 6. Probar actualización de nivel (debería funcionar)
SELECT 'Probando actualización de nivel' as test_type;
BEGIN;
UPDATE public.users 
SET user_level = 1 
WHERE email = 'infocryptoforce@gmail.com';
SELECT 'Nivel actualizado exitosamente' as result;
ROLLBACK;

-- 7. Probar actualización de código de referido (debería funcionar)
SELECT 'Probando actualización de código' as test_type;
BEGIN;
UPDATE public.users 
SET referral_code = 'TEST_CODE_FINAL' 
WHERE email = 'infocryptoforce@gmail.com';
SELECT 'Código actualizado exitosamente' as result;
ROLLBACK;

-- 8. Probar actualización de nickname (debería funcionar)
SELECT 'Probando actualización de nickname' as test_type;
BEGIN;
UPDATE public.users 
SET nickname = 'TestNickname' 
WHERE email = 'infocryptoforce@gmail.com';
SELECT 'Nickname actualizado exitosamente' as result;
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
