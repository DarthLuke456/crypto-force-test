-- Script para probar los permisos de edición entre fundadores
-- Verifica que los fundadores puedan editar información básica de cada uno

-- 1. Verificar el estado actual de los usuarios fundadores
SELECT 'Estado actual de usuarios fundadores' as test_type;
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

-- 2. Probar edición de campo no crítico (nombre) - debería funcionar
SELECT 'Probando edición de campo no crítico (nombre)' as test_type;
BEGIN;
UPDATE public.users 
SET nombre = 'Luke Test' 
WHERE email = 'infocryptoforce@gmail.com';
-- Esto debería funcionar
SELECT 'Campo no crítico modificado exitosamente' as result;
ROLLBACK;

-- 3. Probar edición de campo crítico (user_level) - debería fallar
SELECT 'Probando edición de campo crítico (user_level)' as test_type;
BEGIN;
UPDATE public.users 
SET user_level = 1 
WHERE email = 'infocryptoforce@gmail.com';
-- Esto debería fallar
ROLLBACK;

-- 4. Probar edición de campo crítico (referral_code) - debería fallar
SELECT 'Probando edición de campo crítico (referral_code)' as test_type;
BEGIN;
UPDATE public.users 
SET referral_code = 'TEST_CODE' 
WHERE email = 'infocryptoforce@gmail.com';
-- Esto debería fallar
ROLLBACK;

-- 5. Probar edición de campo crítico (nickname) - debería fallar
SELECT 'Probando edición de campo crítico (nickname)' as test_type;
BEGIN;
UPDATE public.users 
SET nickname = 'TestNickname' 
WHERE email = 'infocryptoforce@gmail.com';
-- Esto debería fallar
ROLLBACK;

-- 6. Probar edición de campo crítico (total_referrals) - debería fallar
SELECT 'Probando edición de campo crítico (total_referrals)' as test_type;
BEGIN;
UPDATE public.users 
SET total_referrals = 999 
WHERE email = 'infocryptoforce@gmail.com';
-- Esto debería fallar
ROLLBACK;

-- 7. Probar asignación de nivel Fundador a usuario no autorizado - debería fallar
SELECT 'Probando asignación de nivel Fundador a usuario no autorizado' as test_type;
BEGIN;
UPDATE public.users 
SET user_level = 0 
WHERE email = 'josefranciscocastrosias@gmail.com';
-- Esto debería fallar
ROLLBACK;

-- 8. Verificar que la protección sigue activa después de las pruebas
SELECT 'Verificando que la protección sigue activa' as test_type;
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
