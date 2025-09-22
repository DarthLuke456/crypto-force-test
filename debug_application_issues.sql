-- =============================================
-- QUERIES PARA DEBUGGEAR PROBLEMAS DE APLICACIÓN
-- =============================================

-- 1. VERIFICAR ESTRUCTURA COMPLETA DE LA TABLA USERS
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'users' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. VERIFICAR DATOS COMPLETOS DEL USUARIO
SELECT 
    uid,
    email,
    nickname,
    user_level,
    created_at,
    updated_at,
    referral_code,
    referred_by,
    -- Verificar si hay campos adicionales que puedan estar causando problemas
    CASE 
        WHEN user_level = 0 THEN 'FUNDADOR - DEBERÍA VER MAESTRO COMO ACTUAL'
        WHEN user_level = 6 THEN 'MAESTRO - DEBERÍA VER MAESTRO COMO ACTUAL'
        ELSE 'OTRO NIVEL - DEBERÍA VER SU NIVEL COMO ACTUAL'
    END as logica_esperada
FROM public.users 
WHERE email = 'coeurdeluke.js@gmail.com';

-- 3. VERIFICAR SI HAY DATOS CORRUPTOS O INCONSISTENTES
SELECT 
    email,
    nickname,
    user_level,
    created_at,
    updated_at,
    -- Verificar si hay caracteres extraños o espacios
    LENGTH(email) as email_length,
    LENGTH(nickname) as nickname_length,
    -- Verificar si user_level es realmente un número
    user_level::text as user_level_as_text,
    -- Verificar si hay espacios en blanco
    CASE 
        WHEN email != TRIM(email) THEN 'EMAIL TIENE ESPACIOS'
        WHEN nickname != TRIM(nickname) THEN 'NICKNAME TIENE ESPACIOS'
        ELSE 'SIN ESPACIOS'
    END as espacios_check
FROM public.users 
WHERE email = 'coeurdeluke.js@gmail.com';

-- 4. VERIFICAR POLÍTICAS RLS QUE PUEDAN ESTAR BLOQUEANDO
SELECT 
    policyname,
    cmd,
    qual,
    with_check,
    roles
FROM pg_policies 
WHERE tablename = 'users' 
AND schemaname = 'public'
ORDER BY policyname;

-- 5. VERIFICAR SI HAY TRIGGERS QUE MODIFIQUEN LOS DATOS
SELECT 
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers 
WHERE event_object_table = 'users'
AND event_object_schema = 'public';

-- 6. VERIFICAR PERMISOS ESPECÍFICOS DEL USUARIO ACTUAL
SELECT 
    current_user as usuario_actual,
    session_user as usuario_sesion,
    has_table_privilege('public.users', 'SELECT') as puede_leer,
    has_table_privilege('public.users', 'UPDATE') as puede_actualizar,
    has_table_privilege('public.users', 'INSERT') as puede_insertar;

-- 7. VERIFICAR SI HAY CONFLICTOS DE TIPOS DE DATOS
SELECT 
    column_name,
    data_type,
    udt_name,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
AND table_schema = 'public'
AND column_name IN ('user_level', 'email', 'nickname');

-- 8. QUERY DE PRUEBA - SIMULAR LO QUE HACE LA APLICACIÓN
SELECT 
    email,
    nickname,
    user_level,
    -- Simular la lógica de la aplicación
    CASE 
        WHEN user_level = 0 THEN 'MAESTRO debería ser actual'
        WHEN user_level = 6 THEN 'MAESTRO debería ser actual'
        ELSE 'Nivel ' || user_level || ' debería ser actual'
    END as nivel_actual_esperado,
    -- Verificar si es fundador por email
    CASE 
        WHEN email IN ('coeurdeluke.js@gmail.com', 'infocryptoforce@gmail.com') 
        THEN 'ES FUNDADOR POR EMAIL'
        ELSE 'NO ES FUNDADOR POR EMAIL'
    END as es_fundador_por_email
FROM public.users 
WHERE email = 'coeurdeluke.js@gmail.com';

-- =============================================
-- DIAGNÓSTICO:
-- =============================================
-- Si todas las queries muestran datos correctos,
-- el problema está en el código JavaScript/TypeScript
-- de la aplicación, no en la base de datos.
-- =============================================
