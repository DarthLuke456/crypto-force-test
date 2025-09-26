-- Script NUCLEAR para eliminar COMPLETAMENTE toda la protección
-- Este script usa métodos más agresivos para eliminar la función

-- 1. Verificar qué funciones existen
SELECT 'Funciones existentes antes de eliminar' as check_type;
SELECT 
    routine_name,
    routine_type,
    specific_name
FROM information_schema.routines 
WHERE routine_name LIKE '%founder%' OR routine_name LIKE '%protection%';

-- 2. Eliminar la función usando su nombre específico
-- Primero intentamos con el nombre específico
DO $$
BEGIN
    -- Intentar eliminar la función con diferentes variaciones
    BEGIN
        DROP FUNCTION IF EXISTS check_founder_protection() CASCADE;
    EXCEPTION
        WHEN OTHERS THEN
            RAISE NOTICE 'No se pudo eliminar check_founder_protection()';
    END;
    
    BEGIN
        DROP FUNCTION IF EXISTS public.check_founder_protection() CASCADE;
    EXCEPTION
        WHEN OTHERS THEN
            RAISE NOTICE 'No se pudo eliminar public.check_founder_protection()';
    END;
    
    BEGIN
        DROP FUNCTION IF EXISTS check_founder_protection(text, text, integer, text, integer) CASCADE;
    EXCEPTION
        WHEN OTHERS THEN
            RAISE NOTICE 'No se pudo eliminar check_founder_protection con parámetros';
    END;
END $$;

-- 3. Eliminar TODOS los triggers
DROP TRIGGER IF EXISTS founder_protection_trigger ON public.users CASCADE;
DROP TRIGGER IF EXISTS founder_protection_trigger ON users CASCADE;

-- 4. Verificar que no hay funciones
SELECT 'Funciones existentes después de eliminar' as check_type;
SELECT 
    routine_name,
    routine_type,
    specific_name
FROM information_schema.routines 
WHERE routine_name LIKE '%founder%' OR routine_name LIKE '%protection%';

-- 5. Verificar que no hay triggers
SELECT 'Triggers existentes' as check_type;
SELECT trigger_name FROM information_schema.triggers 
WHERE event_object_table = 'users';

-- 6. Probar actualización de código de referido
SELECT 'Probando actualización de código de referido' as test_type;
BEGIN;
UPDATE public.users 
SET referral_code = 'TEST_CODE_123' 
WHERE email = 'infocryptoforce@gmail.com';
SELECT 'Código de referido actualizado exitosamente' as result;
ROLLBACK;

-- 7. Probar actualización de nivel
SELECT 'Probando actualización de nivel' as test_type;
BEGIN;
UPDATE public.users 
SET user_level = 1 
WHERE email = 'infocryptoforce@gmail.com';
SELECT 'Nivel actualizado exitosamente' as result;
ROLLBACK;
