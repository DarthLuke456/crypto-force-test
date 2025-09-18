-- =====================================================
-- AGREGAR COLUMNA TOTAL_EARNINGS FALTANTE
-- =====================================================
-- Este script agrega la columna total_earnings que falta en la tabla users
-- Ejecutar en Supabase SQL Editor

-- 1. Verificar si la columna ya existe
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

-- 2. Verificar la estructura actualizada de la tabla users
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

-- 3. Actualizar valores existentes si es necesario
UPDATE users 
SET total_earnings = 0.00 
WHERE total_earnings IS NULL;

-- 4. Verificar que la función get_user_referral_stats funcione
SELECT 
    'PRUEBA FUNCIÓN get_user_referral_stats' as section,
    get_user_referral_stats('coeurdeluke.js@gmail.com') as resultado;

-- 5. Mostrar estado final
SELECT 
    'ESTADO FINAL' as section,
    COUNT(*) as total_users,
    COUNT(CASE WHEN total_earnings IS NOT NULL THEN 1 END) as users_with_earnings,
    COUNT(CASE WHEN total_earnings > 0 THEN 1 END) as users_with_positive_earnings
FROM users;
