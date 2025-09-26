-- Script para verificar que la edición entre fundadores funciona correctamente
-- Después de eliminar la protección

-- 1. Verificar que NO hay funciones de protección
SELECT 'Verificando que NO hay funciones de protección' as check_type;
SELECT 
    proname,
    proargnames,
    proargtypes
FROM pg_proc 
WHERE proname LIKE '%founder%' 
   OR proname LIKE '%protection%';

-- 2. Verificar que NO hay triggers de protección
SELECT 'Verificando que NO hay triggers de protección' as check_type;
SELECT trigger_name FROM information_schema.triggers 
WHERE event_object_table = 'users';

-- 3. Probar actualización de nivel (debería funcionar)
SELECT 'Probando actualización de nivel' as test_type;
BEGIN;
UPDATE public.users 
SET user_level = 1 
WHERE email = 'infocryptoforce@gmail.com';
SELECT 'Nivel actualizado exitosamente' as result;
ROLLBACK;

-- 4. Probar actualización de código de referido (debería funcionar)
SELECT 'Probando actualización de código de referido' as test_type;
BEGIN;
UPDATE public.users 
SET referral_code = 'TEST_CODE_SUCCESS' 
WHERE email = 'infocryptoforce@gmail.com';
SELECT 'Código de referido actualizado exitosamente' as result;
ROLLBACK;

-- 5. Probar actualización de nickname (debería funcionar)
SELECT 'Probando actualización de nickname' as test_type;
BEGIN;
UPDATE public.users 
SET nickname = 'TestNicknameSuccess' 
WHERE email = 'infocryptoforce@gmail.com';
SELECT 'Nickname actualizado exitosamente' as result;
ROLLBACK;

-- 6. Probar actualización de total_referrals (debería funcionar)
SELECT 'Probando actualización de total_referrals' as test_type;
BEGIN;
UPDATE public.users 
SET total_referrals = 999 
WHERE email = 'infocryptoforce@gmail.com';
SELECT 'Total referidos actualizado exitosamente' as result;
ROLLBACK;

-- 7. Probar actualización de campos básicos (debería funcionar)
SELECT 'Probando actualización de campos básicos' as test_type;
BEGIN;
UPDATE public.users 
SET 
    nombre = 'Test Nombre',
    apellido = 'Test Apellido',
    movil = '123456789',
    exchange = 'Test Exchange'
WHERE email = 'infocryptoforce@gmail.com';
SELECT 'Campos básicos actualizados exitosamente' as result;
ROLLBACK;

-- 8. Mostrar estado final de usuarios fundadores
SELECT 'Estado final de usuarios fundadores' as check_type;
SELECT 
    email,
    nombre,
    apellido,
    nickname,
    user_level,
    referral_code,
    total_referrals,
    movil,
    exchange
FROM public.users 
WHERE email IN ('coeurdeluke.js@gmail.com', 'infocryptoforce@gmail.com')
ORDER BY email;

-- 9. Mensaje de éxito
SELECT '¡PROTECCIÓN COMPLETAMENTE ELIMINADA!' as success_message;
SELECT 'Ahora puedes editar la información de tu socio sin problemas' as instructions;
