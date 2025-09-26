-- Script para diagnosticar exactamente qué protección existe

-- 1. Verificar TODAS las funciones relacionadas con protección
SELECT 'TODAS las funciones de protección' as check_type;
SELECT 
    routine_name,
    routine_type,
    specific_name,
    routine_definition
FROM information_schema.routines 
WHERE routine_name LIKE '%founder%' 
   OR routine_name LIKE '%protection%'
   OR routine_definition LIKE '%PROTECCIÓN FUNDADOR%';

-- 2. Verificar TODOS los triggers en la tabla users
SELECT 'TODOS los triggers en tabla users' as check_type;
SELECT 
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'users';

-- 3. Verificar si hay funciones en el esquema public
SELECT 'Funciones en esquema public' as check_type;
SELECT 
    proname as function_name,
    proargnames as argument_names,
    proargtypes as argument_types
FROM pg_proc 
WHERE proname LIKE '%founder%' 
   OR proname LIKE '%protection%';

-- 4. Verificar si hay triggers en pg_trigger
SELECT 'Triggers en pg_trigger' as check_type;
SELECT 
    tgname as trigger_name,
    tgrelid::regclass as table_name,
    tgenabled as enabled
FROM pg_trigger 
WHERE tgrelid = 'public.users'::regclass;

-- 5. Intentar encontrar la función exacta
SELECT 'Buscando función check_founder_protection' as check_type;
SELECT 
    proname,
    proargnames,
    proargtypes,
    prosrc
FROM pg_proc 
WHERE proname = 'check_founder_protection';
