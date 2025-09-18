-- =====================================================
-- VERIFICACIÓN DE FUNCIONES DEL SISTEMA DE REFERIDOS
-- =====================================================
-- Ejecutar en Supabase SQL Editor para verificar el estado

-- 1. Verificar que las funciones existen
SELECT 
    'FUNCIONES DISPONIBLES' as section,
    routine_name,
    routine_type,
    data_type,
    routine_definition IS NOT NULL as has_definition
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name IN (
    'get_user_referral_stats',
    'generate_cryptoforce_referral_code',
    'process_new_referral',
    'validate_referral_code',
    'generate_registration_link'
)
ORDER BY routine_name;

-- 2. Verificar la estructura de la tabla users
SELECT 
    'ESTRUCTURA TABLA USERS' as section,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN ('referral_code', 'referred_by', 'user_level', 'total_referrals', 'total_earnings')
ORDER BY column_name;

-- 3. Verificar usuarios con códigos de referido
SELECT 
    'USUARIOS CON CÓDIGOS' as section,
    email,
    nickname,
    referral_code,
    user_level,
    total_referrals,
    CASE 
        WHEN user_level = 0 THEN '🎯 FUNDADOR'
        WHEN referral_code LIKE 'CRYPTOFORCE_%' THEN '✅ Formato Correcto'
        ELSE '❌ Formato Incorrecto'
    END as status
FROM users 
WHERE referral_code IS NOT NULL
ORDER BY user_level ASC, created_at ASC;

-- 4. Probar la función get_user_referral_stats con un usuario existente
-- (Reemplazar 'usuario@ejemplo.com' con un email real de la base de datos)
SELECT 
    'PRUEBA FUNCIÓN get_user_referral_stats' as section,
    get_user_referral_stats('coeurdeluke.js@gmail.com') as resultado;

-- 5. Verificar triggers activos
SELECT 
    'TRIGGERS ACTIVOS' as section,
    trigger_name,
    event_manipulation,
    action_statement,
    action_timing
FROM information_schema.triggers
WHERE event_object_table = 'users'
AND trigger_name LIKE '%referral%';

-- 6. Verificar permisos RLS
SELECT 
    'POLÍTICAS RLS' as section,
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies
WHERE tablename = 'users';

-- 7. Verificar índices en la tabla referral_history
SELECT 
    'ÍNDICES REFERRAL_HISTORY' as section,
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'referral_history';

-- 8. Verificar datos de ejemplo en referral_history
SELECT 
    'DATOS REFERRAL_HISTORY' as section,
    COUNT(*) as total_records,
    COUNT(DISTINCT referrer_email) as unique_referrers,
    COUNT(DISTINCT referred_email) as unique_referred
FROM referral_history;
