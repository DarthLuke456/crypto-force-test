-- Script para probar la protección de usuarios fundadores
-- Este script intenta modificar campos protegidos para verificar que la protección funciona

-- 1. Verificar el estado actual de los usuarios fundadores
SELECT 'Estado actual de usuarios fundadores' as test_type;
SELECT * FROM check_founder_protection_status();

-- 2. Intentar modificar el nivel de coeurdeluke.js@gmail.com (debería fallar)
SELECT 'Intentando modificar nivel de coeurdeluke.js@gmail.com' as test_type;
BEGIN;
UPDATE public.users 
SET user_level = 1 
WHERE email = 'coeurdeluke.js@gmail.com';
-- Si llegamos aquí, la protección no funciona
ROLLBACK;

-- 3. Intentar modificar el código de referido de infocryptoforce@gmail.com (debería fallar)
SELECT 'Intentando modificar código de referido de infocryptoforce@gmail.com' as test_type;
BEGIN;
UPDATE public.users 
SET referral_code = 'TEST_CODE' 
WHERE email = 'infocryptoforce@gmail.com';
-- Si llegamos aquí, la protección no funciona
ROLLBACK;

-- 4. Intentar modificar el nickname de coeurdeluke.js@gmail.com (debería fallar)
SELECT 'Intentando modificar nickname de coeurdeluke.js@gmail.com' as test_type;
BEGIN;
UPDATE public.users 
SET nickname = 'TestNickname' 
WHERE email = 'coeurdeluke.js@gmail.com';
-- Si llegamos aquí, la protección no funciona
ROLLBACK;

-- 5. Verificar que los campos no protegidos sí se pueden modificar
SELECT 'Probando modificación de campos no protegidos' as test_type;
BEGIN;
UPDATE public.users 
SET nombre = 'Test Name' 
WHERE email = 'coeurdeluke.js@gmail.com';
-- Esto debería funcionar
SELECT 'Campo no protegido modificado exitosamente' as result;
ROLLBACK;

-- 6. Verificar que la protección sigue activa después de las pruebas
SELECT 'Verificando que la protección sigue activa' as test_type;
SELECT * FROM check_founder_protection_status();

-- 7. Mostrar información sobre los triggers activos
SELECT 'Triggers de protección activos' as test_type;
SELECT 
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'founder_protection_trigger';
