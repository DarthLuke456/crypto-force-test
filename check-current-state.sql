-- Script para verificar el estado actual de la protección
-- Después del intento de eliminación con CASCADE

-- 1. Verificar si la función existe
SELECT 'Verificando función check_founder_protection' as check_type;
SELECT 
    proname,
    proargnames,
    proargtypes,
    prosrc
FROM pg_proc 
WHERE proname = 'check_founder_protection';

-- 2. Verificar si el trigger existe
SELECT 'Verificando trigger founder_protection_trigger' as check_type;
SELECT 
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'users';

-- 3. Verificar en pg_trigger
SELECT 'Verificando en pg_trigger' as check_type;
SELECT 
    tgname as trigger_name,
    tgrelid::regclass as table_name,
    tgenabled as enabled
FROM pg_trigger 
WHERE tgrelid = 'public.users'::regclass;

-- 4. Verificar todas las funciones relacionadas
SELECT 'Todas las funciones de protección' as check_type;
SELECT 
    proname,
    proargnames,
    proargtypes
FROM pg_proc 
WHERE proname LIKE '%founder%' 
   OR proname LIKE '%protection%';

-- 5. Intentar eliminar la función de manera más agresiva
SELECT 'Intentando eliminar función de manera agresiva' as check_type;
DO $$
BEGIN
    -- Intentar eliminar con diferentes sintaxis
    BEGIN
        DROP FUNCTION IF EXISTS check_founder_protection() CASCADE;
        RAISE NOTICE 'Función eliminada con CASCADE';
    EXCEPTION
        WHEN OTHERS THEN
            RAISE NOTICE 'Error al eliminar con CASCADE: %', SQLERRM;
    END;
    
    BEGIN
        DROP FUNCTION IF EXISTS public.check_founder_protection() CASCADE;
        RAISE NOTICE 'Función eliminada con esquema público';
    EXCEPTION
        WHEN OTHERS THEN
            RAISE NOTICE 'Error al eliminar con esquema público: %', SQLERRM;
    END;
END $$;

-- 6. Verificar estado después del intento
SELECT 'Estado después del intento de eliminación' as check_type;
SELECT 
    proname,
    proargnames,
    proargtypes
FROM pg_proc 
WHERE proname = 'check_founder_protection';
