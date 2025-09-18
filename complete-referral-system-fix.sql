-- =====================================================
-- REPARACIÓN COMPLETA DEL SISTEMA DE REFERIDOS
-- =====================================================
-- Este script repara todos los problemas identificados en el sistema de referidos
-- Ejecutar en Supabase SQL Editor

-- =====================================================
-- PASO 1: VERIFICAR ESTRUCTURA ACTUAL
-- =====================================================

SELECT 
    'ESTRUCTURA ACTUAL TABLA USERS' as section,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN ('referral_code', 'referred_by', 'user_level', 'total_referrals', 'total_earnings')
ORDER BY column_name;

-- =====================================================
-- PASO 2: AGREGAR COLUMNA TOTAL_EARNINGS SI NO EXISTE
-- =====================================================

DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'total_earnings'
    ) THEN
        -- Agregar la columna total_earnings
        ALTER TABLE users ADD COLUMN total_earnings DECIMAL(10,2) DEFAULT 0.00;
        RAISE NOTICE '✅ Columna total_earnings agregada exitosamente';
    ELSE
        RAISE NOTICE 'ℹ️ Columna total_earnings ya existe';
    END IF;
END $$;

-- =====================================================
-- PASO 3: VERIFICAR TABLA REFERRAL_HISTORY
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

-- Crear índices si no existen
CREATE INDEX IF NOT EXISTS idx_referral_history_referrer ON referral_history(referrer_email);
CREATE INDEX IF NOT EXISTS idx_referral_history_referred ON referral_history(referred_email);
CREATE INDEX IF NOT EXISTS idx_referral_history_code ON referral_history(referrer_code);
CREATE INDEX IF NOT EXISTS idx_referral_history_date ON referral_history(referral_date);

-- =====================================================
-- PASO 4: REPARAR FUNCIÓN GET_USER_REFERRAL_STATS
-- =====================================================

-- Eliminar la función existente si existe
DROP FUNCTION IF EXISTS get_user_referral_stats(text);

-- Crear la función corregida
CREATE OR REPLACE FUNCTION get_user_referral_stats(user_email_input TEXT)
RETURNS JSONB AS $$
DECLARE
    user_record RECORD;
    direct_referrals INTEGER;
    recent_referrals JSONB;
    registration_link TEXT;
    result JSONB;
BEGIN
    -- Obtener datos básicos del usuario
    SELECT 
        referral_code, 
        total_referrals, 
        user_level,
        total_earnings
    INTO user_record
    FROM users 
    WHERE email = user_email_input;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object(
            'success', false,
            'error', 'Usuario no encontrado'
        );
    END IF;
    
    -- Generar enlace de registro
    registration_link := 'https://cripto-force-dashboard.vercel.app/login/register?ref=' || user_record.referral_code;
    
    -- Contar referidos directos
    SELECT COUNT(*) INTO direct_referrals
    FROM users 
    WHERE referred_by = user_record.referral_code;
    
    -- Obtener referidos recientes
    SELECT jsonb_agg(
        jsonb_build_object(
            'email', referred_email,
            'date', referral_date,
            'commission', commission_earned
        )
    ) INTO recent_referrals
    FROM (
        SELECT referred_email, referral_date, commission_earned
        FROM referral_history 
        WHERE referrer_email = user_email_input 
        ORDER BY referral_date DESC 
        LIMIT 5
    ) recent;
    
    -- Construir respuesta
    result := jsonb_build_object(
        'success', true,
        'referral_code', user_record.referral_code,
        'registration_link', registration_link,
        'total_referrals', COALESCE(direct_referrals, 0),
        'total_earnings', COALESCE(user_record.total_earnings, 0),
        'user_level', user_record.user_level,
        'recent_referrals', COALESCE(recent_referrals, '[]'::jsonb)
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- PASO 5: CONFIGURAR PERMISOS
-- =====================================================

-- Otorgar permisos de ejecución
GRANT EXECUTE ON FUNCTION get_user_referral_stats(text) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_referral_stats(text) TO anon;

-- =====================================================
-- PASO 6: VERIFICAR REPARACIÓN
-- =====================================================

-- Verificar estructura actualizada
SELECT 
    'ESTRUCTURA ACTUALIZADA TABLA USERS' as section,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN ('referral_code', 'referred_by', 'user_level', 'total_referrals', 'total_earnings')
ORDER BY column_name;

-- Verificar función creada
SELECT 
    'FUNCIÓN REPARADA' as section,
    routine_name,
    routine_type,
    data_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name = 'get_user_referral_stats';

-- Probar función
SELECT 
    'PRUEBA FUNCIÓN' as section,
    get_user_referral_stats('coeurdeluke.js@gmail.com') as resultado;

-- =====================================================
-- PASO 7: ACTUALIZAR DATOS EXISTENTES
-- =====================================================

-- Actualizar valores NULL en total_earnings
UPDATE users 
SET total_earnings = 0.00 
WHERE total_earnings IS NULL;

-- Verificar estado final
SELECT 
    'ESTADO FINAL' as section,
    COUNT(*) as total_users,
    COUNT(CASE WHEN total_earnings IS NOT NULL THEN 1 END) as users_with_earnings,
    COUNT(CASE WHEN total_earnings > 0 THEN 1 END) as users_with_positive_earnings,
    COUNT(CASE WHEN referral_code IS NOT NULL THEN 1 END) as users_with_referral_code
FROM users;

-- =====================================================
-- RESUMEN DE REPARACIÓN
-- =====================================================
/*
✅ SISTEMA REPARADO EXITOSAMENTE:

1. COLUMNA TOTAL_EARNINGS: Agregada si no existía
2. FUNCIÓN GET_USER_REFERRAL_STATS: Reparada y funcionando
3. TABLA REFERRAL_HISTORY: Verificada y con índices
4. PERMISOS: Configurados correctamente
5. DATOS: Actualizados y consistentes

Para verificar que todo funciona:
1. La API /api/referrals/stats debería funcionar sin errores
2. La función SQL get_user_referral_stats debería ejecutarse correctamente
3. La página de referidos debería mostrar datos reales de Supabase

Si hay problemas, revisar los logs de la consola del navegador.
*/
