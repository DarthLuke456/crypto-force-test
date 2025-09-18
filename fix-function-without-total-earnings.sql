-- =====================================================
-- CORREGIR FUNCIÓN SIN COLUMNA TOTAL_EARNINGS
-- =====================================================
-- Este script corrige la función get_user_referral_stats para que funcione
-- SIN la columna total_earnings que no debe existir
-- Ejecutar en Supabase SQL Editor

-- 1. Eliminar la función existente que está causando el error
DROP FUNCTION IF EXISTS get_user_referral_stats(text);

-- 2. Crear la función corregida SIN total_earnings
CREATE OR REPLACE FUNCTION get_user_referral_stats(user_email_input TEXT)
RETURNS JSONB AS $$
DECLARE
    user_record RECORD;
    direct_referrals INTEGER;
    recent_referrals JSONB;
    registration_link TEXT;
    result JSONB;
BEGIN
    -- Obtener datos básicos del usuario (SIN total_earnings)
    SELECT 
        referral_code, 
        total_referrals, 
        user_level
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
    
    -- Construir respuesta (SIN total_earnings)
    result := jsonb_build_object(
        'success', true,
        'referral_code', user_record.referral_code,
        'registration_link', registration_link,
        'total_referrals', COALESCE(direct_referrals, 0),
        'total_earnings', 0.00, -- Valor fijo ya que no existe la columna
        'user_level', user_record.user_level,
        'recent_referrals', COALESCE(recent_referrals, '[]'::jsonb)
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- 3. Verificar que la función se creó correctamente
SELECT 
    'FUNCIÓN CREADA SIN TOTAL_EARNINGS' as section,
    routine_name,
    routine_type,
    data_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name = 'get_user_referral_stats';

-- 4. Probar la función
SELECT 
    'PRUEBA FUNCIÓN CORREGIDA' as section,
    get_user_referral_stats('coeurdeluke.js@gmail.com') as resultado;

-- 5. Verificar permisos
GRANT EXECUTE ON FUNCTION get_user_referral_stats(text) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_referral_stats(text) TO anon;

-- 6. Verificar estructura actual de la tabla users
SELECT 
    'ESTRUCTURA ACTUAL TABLA USERS' as section,
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN ('referral_code', 'referred_by', 'user_level', 'total_referrals')
ORDER BY column_name;
