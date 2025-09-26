-- Script de prueba simplificado para verificar permisos

-- 1. Verificar estado actual
SELECT 'Estado actual de fundadores' as test_type;
SELECT 
    email,
    nombre,
    apellido,
    nickname,
    user_level
FROM public.users 
WHERE email IN ('coeurdeluke.js@gmail.com', 'infocryptoforce@gmail.com')
ORDER BY email;

-- 2. Probar edición de campo básico (debería funcionar)
SELECT 'Probando edición de campo básico (nombre)' as test_type;
BEGIN;
UPDATE public.users 
SET nombre = 'Test Name' 
WHERE email = 'infocryptoforce@gmail.com';
SELECT 'Campo básico modificado exitosamente' as result;
ROLLBACK;

-- 3. Probar edición de campo crítico (debería fallar)
SELECT 'Probando edición de campo crítico (user_level)' as test_type;
BEGIN;
UPDATE public.users 
SET user_level = 1 
WHERE email = 'infocryptoforce@gmail.com';
ROLLBACK;
