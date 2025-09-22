-- =============================================
-- QUERIES PARA REPARAR PROBLEMAS DE BASE DE DATOS
-- =============================================

-- 1. VERIFICAR ESTRUCTURA DE LA TABLA USERS
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- 2. VERIFICAR DATOS DEL USUARIO FUNDADOR
SELECT 
    uid,
    email,
    nickname,
    user_level,
    created_at,
    updated_at
FROM public.users 
WHERE email = 'coeurdeluke.js@gmail.com';

-- 3. VERIFICAR TODOS LOS USUARIOS Y SUS NIVELES
SELECT 
    email,
    nickname,
    user_level,
    CASE 
        WHEN user_level = 0 THEN 'Fundador'
        WHEN user_level = 1 THEN 'Iniciado'
        WHEN user_level = 2 THEN 'Acólito'
        WHEN user_level = 3 THEN 'Warrior'
        WHEN user_level = 4 THEN 'Lord'
        WHEN user_level = 5 THEN 'Darth'
        WHEN user_level = 6 THEN 'Maestro'
        ELSE 'Desconocido'
    END as nivel_display,
    created_at
FROM public.users 
ORDER BY user_level DESC, created_at DESC;

-- 4. CORREGIR NIVEL DEL USUARIO FUNDADOR (SI ES NECESARIO)
UPDATE public.users 
SET user_level = 0,
    updated_at = NOW()
WHERE email = 'coeurdeluke.js@gmail.com'
AND user_level != 0;

-- 5. VERIFICAR POLÍTICAS RLS
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'users' 
AND schemaname = 'public';

-- 6. VERIFICAR SI HAY CONFLICTOS DE DATOS
SELECT 
    COUNT(*) as total_usuarios,
    COUNT(CASE WHEN user_level = 0 THEN 1 END) as fundadores,
    COUNT(CASE WHEN user_level = 6 THEN 1 END) as maestros,
    COUNT(CASE WHEN user_level IS NULL THEN 1 END) as sin_nivel
FROM public.users;

-- 7. VERIFICAR INTEGRIDAD DE REFERRALS
SELECT 
    u1.email as referrer_email,
    u1.nickname as referrer_nickname,
    u1.user_level as referrer_level,
    u2.email as referred_email,
    u2.nickname as referred_nickname,
    u2.user_level as referred_level
FROM public.users u1
LEFT JOIN public.users u2 ON u1.referral_code::text = u2.referred_by::text
WHERE u1.email = 'coeurdeluke.js@gmail.com'
OR u2.email = 'coeurdeluke.js@gmail.com';

-- 8. RESETEAR CONTADOR DE REDIRECCIONES (SI EXISTE)
-- Esta query es para limpiar cualquier contador de redirecciones en la base de datos
-- (Aunque probablemente esté en localStorage/sessionStorage)

-- 9. VERIFICAR PERMISOS DE ACCESO
SELECT 
    has_table_privilege('public.users', 'SELECT') as can_select,
    has_table_privilege('public.users', 'INSERT') as can_insert,
    has_table_privilege('public.users', 'UPDATE') as can_update,
    has_table_privilege('public.users', 'DELETE') as can_delete;

-- 10. QUERY DE EMERGENCIA - FORZAR CORRECCIÓN COMPLETA
-- ⚠️ CUIDADO: Esta query fuerza la corrección del usuario fundador
UPDATE public.users 
SET 
    user_level = 0,
    updated_at = NOW()
WHERE email IN ('coeurdeluke.js@gmail.com', 'infocryptoforce@gmail.com')
AND user_level != 0;

-- 11. VERIFICAR RESULTADO FINAL
SELECT 
    email,
    nickname,
    user_level,
    updated_at,
    CASE 
        WHEN user_level = 0 THEN '✅ FUNDADOR'
        WHEN user_level = 6 THEN '✅ MAESTRO'
        ELSE '❌ NIVEL INCORRECTO'
    END as status
FROM public.users 
WHERE email IN ('coeurdeluke.js@gmail.com', 'infocryptoforce@gmail.com');

-- =============================================
-- INSTRUCCIONES DE USO:
-- =============================================
-- 1. Ejecuta las queries 1-3 para verificar el estado actual
-- 2. Si el usuario no tiene user_level = 0, ejecuta la query 4
-- 3. Ejecuta la query 11 para verificar que todo esté correcto
-- 4. Si nada funciona, ejecuta la query 10 (EMERGENCIA)
-- =============================================
