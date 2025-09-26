-- Script para FORZAR la eliminación completa de toda la protección
-- Este script elimina TODO sin importar el estado actual

-- 1. Eliminar TODOS los triggers posibles
DROP TRIGGER IF EXISTS founder_protection_trigger ON public.users;
DROP TRIGGER IF EXISTS founder_protection_trigger ON users;
DROP TRIGGER IF EXISTS founder_protection_trigger ON public.users CASCADE;

-- 2. Eliminar TODAS las funciones de protección
DROP FUNCTION IF EXISTS check_founder_protection() CASCADE;
DROP FUNCTION IF EXISTS check_founder_protection();
DROP FUNCTION IF EXISTS check_founder_protection_status() CASCADE;
DROP FUNCTION IF EXISTS check_founder_protection_status();

-- 3. Verificar que NO hay triggers
SELECT 'Verificando triggers' as check_type;
SELECT trigger_name FROM information_schema.triggers 
WHERE event_object_table = 'users';

-- 4. Verificar que NO hay funciones
SELECT 'Verificando funciones' as check_type;
SELECT routine_name FROM information_schema.routines 
WHERE routine_name LIKE '%founder%' OR routine_name LIKE '%protection%';

-- 5. Probar actualización de nivel (debería funcionar)
SELECT 'Probando actualización de nivel' as test_type;
BEGIN;
UPDATE public.users 
SET user_level = 1 
WHERE email = 'infocryptoforce@gmail.com';
SELECT 'Nivel actualizado exitosamente' as result;
ROLLBACK;

-- 6. Probar actualización de código de referido
SELECT 'Probando actualización de código' as test_type;
BEGIN;
UPDATE public.users 
SET referral_code = 'TEST_CODE' 
WHERE email = 'infocryptoforce@gmail.com';
SELECT 'Código actualizado exitosamente' as result;
ROLLBACK;
