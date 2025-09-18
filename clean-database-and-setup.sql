-- =====================================================
-- LIMPIEZA COMPLETA Y CONFIGURACIÓN DESDE CERO
-- =====================================================
-- Este script limpia la base de datos y permite registro desde cero

-- =====================================================
-- PASO 1: LIMPIEZA COMPLETA DE DATOS
-- =====================================================

-- Eliminar TODOS los usuarios existentes
DELETE FROM users;
RAISE NOTICE '🗑️ Todos los usuarios eliminados';

-- Eliminar tabla referral_history si existe
DROP TABLE IF EXISTS referral_history CASCADE;
RAISE NOTICE '🗑️ Tabla referral_history eliminada';

-- =====================================================
-- PASO 2: ELIMINAR COLUMNAS INCORRECTAS
-- =====================================================

-- Eliminar columna total_earnings (NUNCA debe existir)
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'total_earnings'
    ) THEN
        ALTER TABLE users DROP COLUMN total_earnings;
        RAISE NOTICE '🗑️ Columna total_earnings eliminada (NUNCA debe existir)';
    ELSE
        RAISE NOTICE 'ℹ️ Columna total_earnings no existe';
    END IF;
END $$;

-- Eliminar columna total_referrals (no necesaria para registro básico)
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'total_referrals'
    ) THEN
        ALTER TABLE users DROP COLUMN total_referrals;
        RAISE NOTICE '🗑️ Columna total_referrals eliminada';
    ELSE
        RAISE NOTICE 'ℹ️ Columna total_referrals no existe';
    END IF;
END $$;

-- =====================================================
-- PASO 3: VERIFICAR ESTRUCTURA CORRECTA
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
ORDER BY column_name;

-- =====================================================
-- PASO 4: AGREGAR SOLO COLUMNAS NECESARIAS
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

-- =====================================================
-- PASO 5: CREAR TABLA DE HISTORIAL SIMPLIFICADA
-- =====================================================

-- Crear tabla referral_history simplificada
CREATE TABLE IF NOT EXISTS public.referral_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    referrer_email TEXT NOT NULL,
    referred_email TEXT NOT NULL,
    referrer_code TEXT NOT NULL,
    referral_date TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Crear índices básicos
CREATE INDEX IF NOT EXISTS idx_referral_history_referrer ON referral_history(referrer_email);
CREATE INDEX IF NOT EXISTS idx_referral_history_referred ON referral_history(referred_email);

-- Verificar tabla creada
SELECT 
    'TABLA REFERRAL_HISTORY CREADA' as section,
    table_name,
    table_type
FROM information_schema.tables 
WHERE table_name = 'referral_history';

-- =====================================================
-- PASO 6: VERIFICAR FUNCIONES EXISTENTES
-- =====================================================

-- Verificar funciones disponibles
SELECT 
    'FUNCIONES DISPONIBLES' as section,
    routine_name,
    routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name LIKE '%referral%'
ORDER BY routine_name;

-- =====================================================
-- PASO 7: VERIFICAR TRIGGERS
-- =====================================================

-- Verificar triggers activos
SELECT 
    'TRIGGERS ACTIVOS' as section,
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers
WHERE event_object_table = 'users'
AND trigger_name LIKE '%referral%';

-- =====================================================
-- PASO 8: ESTADO FINAL DE LA BASE DE DATOS
-- =====================================================

-- Verificar que la base de datos esté limpia
SELECT 
    'BASE DE DATOS LIMPIA' as section,
    COUNT(*) as total_users,
    '0' as expected_users
FROM users;

-- Verificar estructura final
SELECT 
    'ESTRUCTURA FINAL' as section,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN ('referral_code', 'referred_by', 'user_level')
ORDER BY column_name;

-- =====================================================
-- RESUMEN DE LIMPIEZA
-- =====================================================
/*
✅ BASE DE DATOS COMPLETAMENTE LIMPIA:

1. 🗑️ TODOS los usuarios eliminados
2. 🗑️ Tabla referral_history recreada (simplificada)
3. 🗑️ Columna total_earnings ELIMINADA (NUNCA debe existir)
4. 🗑️ Columna total_referrals eliminada
5. ✅ Solo columnas esenciales mantenidas:
   - referral_code (código único)
   - referred_by (quién refirió)
   - user_level (nivel del usuario)

🎯 AHORA PUEDES:

1. **Registrar desde cero** a ambos fundadores:
   - coeurdeluke.js@gmail.com → Darth Luke
   - infocryptoforce@gmail.com → Darth Nihilus

2. **El trigger automático** generará:
   - Códigos: CRYPTOFORCE_DARTH_LUKE, CRYPTOFORCE_DARTH_NIHILUS
   - Enlaces de registro automáticamente

3. **Sistema limpio** sin datos residuales

🚀 PRÓXIMO PASO:
Registrar a los fundadores usando el formulario normal de la aplicación.
El sistema generará automáticamente los códigos CRYPTOFORCE_NICKNAME.
*/
