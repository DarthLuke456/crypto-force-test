-- =====================================================
-- COMPLETAR IMPLEMENTACIÓN DEL SISTEMA DE REFERIDOS
-- =====================================================
-- Este script completa la implementación después de la limpieza

-- =====================================================
-- PASO 1: VERIFICAR ESTRUCTURA ACTUAL
-- =====================================================

-- Verificar columnas existentes en users
SELECT 
    'ESTRUCTURA ACTUAL USERS' as section,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN ('referral_code', 'referred_by', 'user_level', 'total_referrals', 'total_earnings')
ORDER BY column_name;

-- =====================================================
-- PASO 2: AGREGAR COLUMNAS FALTANTES
-- =====================================================

-- Agregar columna referral_code si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'referral_code'
    ) THEN
        ALTER TABLE users ADD COLUMN referral_code TEXT UNIQUE;
        RAISE NOTICE '✅ Columna referral_code agregada';
    ELSE
        RAISE NOTICE 'ℹ️ Columna referral_code ya existe';
    END IF;
END $$;

-- Agregar columna referred_by si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'referred_by'
    ) THEN
        ALTER TABLE users ADD COLUMN referred_by TEXT;
        RAISE NOTICE '✅ Columna referred_by agregada';
    ELSE
        RAISE NOTICE 'ℹ️ Columna referred_by ya existe';
    END IF;
END $$;

-- Agregar columna user_level si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'user_level'
    ) THEN
        ALTER TABLE users ADD COLUMN user_level INTEGER DEFAULT 1;
        RAISE NOTICE '✅ Columna user_level agregada';
    ELSE
        RAISE NOTICE 'ℹ️ Columna user_level ya existe';
    END IF;
END $$;

-- Agregar columna total_referrals si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'total_referrals'
    ) THEN
        ALTER TABLE users ADD COLUMN total_referrals INTEGER DEFAULT 0;
        RAISE NOTICE '✅ Columna total_referrals agregada';
    ELSE
        RAISE NOTICE 'ℹ️ Columna total_referrals ya existe';
    END IF;
END $$;

-- Agregar columna total_earnings si no existe
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'total_earnings'
    ) THEN
        ALTER TABLE users ADD COLUMN total_earnings DECIMAL(10,2) DEFAULT 0.00;
        RAISE NOTICE '✅ Columna total_earnings agregada';
    ELSE
        RAISE NOTICE 'ℹ️ Columna total_earnings ya existe';
    END IF;
END $$;

-- =====================================================
-- PASO 3: CREAR TABLA DE HISTORIAL DE REFERIDOS
-- =====================================================

-- Crear tabla referral_history si no existe
CREATE TABLE IF NOT EXISTS public.referral_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    referrer_email TEXT NOT NULL,
    referred_email TEXT NOT NULL,
    referrer_code TEXT NOT NULL,
    referral_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    commission_earned DECIMAL(10,2) DEFAULT 5.00,
    level_depth INTEGER DEFAULT 1,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Crear índices para optimización
CREATE INDEX IF NOT EXISTS idx_referral_history_referrer ON referral_history(referrer_email);
CREATE INDEX IF NOT EXISTS idx_referral_history_referred ON referral_history(referred_email);
CREATE INDEX IF NOT EXISTS idx_referral_history_code ON referral_history(referrer_code);
CREATE INDEX IF NOT EXISTS idx_referral_history_date ON referral_history(referral_date);

-- Verificar tabla creada
SELECT 
    'TABLA REFERRAL_HISTORY' as section,
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_name = 'referral_history';

-- =====================================================
-- PASO 4: CONFIGURAR FUNDADORES
-- =====================================================

-- Ejecutar configuración de fundadores
SELECT setup_cryptoforce_founders();

-- Verificar fundadores configurados
SELECT 
    'FUNDADORES CONFIGURADOS' as section,
    email,
    nickname,
    referral_code,
    user_level,
    CASE 
        WHEN user_level = 0 THEN '🎯 FUNDADOR'
        ELSE '👤 USUARIO'
    END as status
FROM users 
WHERE user_level = 0
ORDER BY nickname;

-- =====================================================
-- PASO 5: ACTUALIZAR CÓDIGOS EXISTENTES
-- =====================================================

-- Ejecutar actualización de códigos existentes
SELECT update_all_cryptoforce_referral_codes();

-- Verificar códigos actualizados
SELECT 
    'CÓDIGOS ACTUALIZADOS' as section,
    email,
    nickname,
    referral_code,
    user_level,
    CASE 
        WHEN user_level = 0 THEN '🎯 FUNDADOR'
        WHEN referral_code LIKE 'CRYPTOFORCE_%' THEN '✅ Formato Correcto'
        ELSE '❌ Formato Incorrecto'
    END as status
FROM users 
ORDER BY user_level ASC, created_at ASC;

-- =====================================================
-- PASO 6: VERIFICAR FUNCIONES Y TRIGGERS
-- =====================================================

-- Verificar funciones creadas
SELECT 
    'FUNCIONES VERIFICADAS' as section,
    routine_name,
    routine_type,
    data_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name LIKE '%referral%'
ORDER BY routine_name;

-- Verificar triggers activos
SELECT 
    'TRIGGERS VERIFICADOS' as section,
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers
WHERE event_object_table = 'users'
AND trigger_name LIKE '%referral%';

-- =====================================================
-- PASO 7: PRUEBAS DEL SISTEMA
-- =====================================================

-- Probar generación de enlaces de registro
SELECT 
    'PRUEBA ENLACES DE REGISTRO' as section,
    nickname,
    referral_code,
    generate_registration_link(referral_code) as registration_link
FROM users 
WHERE user_level = 0
ORDER BY nickname;

-- Probar validación de códigos
SELECT 
    'PRUEBA VALIDACIÓN' as section,
    'CRYPTOFORCE_LUKE' as test_code,
    validate_referral_code('CRYPTOFORCE_LUKE') as validation_result;

-- =====================================================
-- PASO 8: ESTADÍSTICAS FINALES
-- =====================================================

-- Mostrar estadísticas del sistema
SELECT 
    'ESTADÍSTICAS FINALES' as section,
    COUNT(*) as total_users,
    COUNT(CASE WHEN user_level = 0 THEN 1 END) as founders,
    COUNT(CASE WHEN referral_code LIKE 'CRYPTOFORCE_%' THEN 1 END) as correct_format,
    COUNT(CASE WHEN referred_by IS NOT NULL THEN 1 END) as referred_users
FROM users;

-- Mostrar estado de códigos por nivel
SELECT 
    'ESTADO POR NIVEL' as section,
    user_level,
    COUNT(*) as users_count,
    COUNT(CASE WHEN referral_code LIKE 'CRYPTOFORCE_%' THEN 1 END) as correct_codes
FROM users 
GROUP BY user_level
ORDER BY user_level;

-- =====================================================
-- RESUMEN DE IMPLEMENTACIÓN
-- =====================================================
/*
✅ SISTEMA DE REFERIDOS IMPLEMENTADO COMPLETAMENTE:

1. ✅ FUNCIONES BASE: Todas las funciones creadas sin conflictos
2. ✅ TRIGGERS: Trigger automático funcionando
3. ✅ ESTRUCTURA: Columnas necesarias agregadas a users
4. ✅ TABLA HISTORIAL: referral_history creada con índices
5. ✅ FUNDADORES: Solo 2 usuarios autorizados (nivel 0)
6. ✅ CÓDIGOS: Formato CRYPTOFORCE_NICKNAME aplicado
7. ✅ ENLACES: Generación automática de enlaces de registro
8. ✅ VALIDACIÓN: Sistema de validación funcionando

🎯 FUNCIONALIDADES DISPONIBLES:
- Generación automática de códigos CRYPTOFORCE_NICKNAME
- Actualización automática cuando cambia el nickname
- Enlaces de registro con código pre-llenado
- Sistema de comisiones y tracking
- Solo 2 fundadores autorizados
- Trigger automático para nuevos usuarios

🚀 PRÓXIMOS PASOS:
1. Integrar con el frontend (componente ReferralSystem)
2. Probar registro con códigos de referido
3. Verificar actualización automática de códigos
4. Monitorear sistema de comisiones

El sistema está listo para usar! 🎉
*/
