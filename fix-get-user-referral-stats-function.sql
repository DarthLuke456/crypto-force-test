-- =====================================================
-- CORREGIR FUNCIÓN GET_USER_REFERRAL_STATS
-- =====================================================
-- Este script corrige la función get_user_referral_stats para manejar
-- la columna total_earnings de manera segura
-- Ejecutar en Supabase SQL Editor

-- 1. Eliminar la función existente si existe
DROP FUNCTION IF EXISTS get_user_referral_stats(text);

-- 2. Crear la función corregida
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
        -- Manejar la columna total_earnings de manera segura
        CASE 
            WHEN EXISTS (
                SELECT 1 FROM information_schema.columns 
                WHERE table_name = 'users' AND column_name = 'total_earnings'
            ) THEN total_earnings
            ELSE 0.00
        END as total_earnings
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

-- 3. Verificar que la función se creó correctamente
SELECT 
    'FUNCIÓN CREADA' as section,
    routine_name,
    routine_type,
    data_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name = 'get_user_referral_stats';

-- 4. Probar la función
SELECT 
    'PRUEBA FUNCIÓN' as section,
    get_user_referral_stats('coeurdeluke.js@gmail.com') as resultado;

-- 5. Verificar permisos
GRANT EXECUTE ON FUNCTION get_user_referral_stats(text) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_referral_stats(text) TO anon;
