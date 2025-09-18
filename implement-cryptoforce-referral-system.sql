-- =====================================================
-- SISTEMA DE REFERIDOS CRYPTOFORCE - IMPLEMENTACIÓN COMPLETA
-- =====================================================
-- Este script implementa el sistema de códigos de referido con formato:
-- CRYPTOFORCE_NICKNAME (ej: CRYPTOFORCE_DARTH_NIHILUS)
-- 
-- Características:
-- 1. Formato: CRYPTOFORCE + _ + NICKNAME completo en mayúsculas
-- 2. Actualización automática cuando cambia el nickname
-- 3. Generación de enlaces de registro con código pre-llenado
-- 4. Solo 2 fundadores autorizados (nivel 0)

-- =====================================================
-- PASO 1: VERIFICAR Y PREPARAR ESTRUCTURA DE BASE DE DATOS
-- =====================================================

-- Verificar estructura actual de la tabla users
DO $$ 
BEGIN
    -- Agregar columna referral_code si no existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'referral_code'
    ) THEN
        ALTER TABLE users ADD COLUMN referral_code TEXT UNIQUE;
        RAISE NOTICE '✅ Columna referral_code agregada';
    END IF;

    -- Agregar columna referred_by si no existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'referred_by'
    ) THEN
        ALTER TABLE users ADD COLUMN referred_by TEXT;
        RAISE NOTICE '✅ Columna referred_by agregada';
    END IF;

    -- Agregar columna user_level si no existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'user_level'
    ) THEN
        ALTER TABLE users ADD COLUMN user_level INTEGER DEFAULT 1;
        RAISE NOTICE '✅ Columna user_level agregada';
    END IF;

    -- Agregar columna total_referrals si no existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'total_referrals'
    ) THEN
        ALTER TABLE users ADD COLUMN total_referrals INTEGER DEFAULT 0;
        RAISE NOTICE '✅ Columna total_referrals agregada';
    END IF;

    -- Agregar columna total_earnings si no existe
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'total_earnings'
    ) THEN
        ALTER TABLE users ADD COLUMN total_earnings DECIMAL(10,2) DEFAULT 0.00;
        RAISE NOTICE '✅ Columna total_earnings agregada';
    END IF;
END $$;

-- =====================================================
-- PASO 2: CREAR TABLA DE HISTORIAL DE REFERIDOS
-- =====================================================

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

-- Índices para optimización
CREATE INDEX IF NOT EXISTS idx_referral_history_referrer ON referral_history(referrer_email);
CREATE INDEX IF NOT EXISTS idx_referral_history_referred ON referral_history(referred_email);
CREATE INDEX IF NOT EXISTS idx_referral_history_code ON referral_history(referrer_code);
CREATE INDEX IF NOT EXISTS idx_referral_history_date ON referral_history(referral_date);

-- =====================================================
-- PASO 3: FUNCIÓN PRINCIPAL PARA GENERAR CÓDIGOS CRYPTOFORCE
-- =====================================================

CREATE OR REPLACE FUNCTION generate_cryptoforce_referral_code(user_nickname TEXT)
RETURNS TEXT AS $$
DECLARE
    clean_nickname TEXT;
    base_code TEXT;
    final_code TEXT;
    counter INTEGER := 1;
    max_attempts INTEGER := 100;
BEGIN
    -- Validar que el nickname no esté vacío
    IF user_nickname IS NULL OR TRIM(user_nickname) = '' THEN
        RETURN NULL;
    END IF;
    
    -- Limpiar nickname: solo letras, números y guiones bajos, convertir a mayúsculas
    -- Mantener guiones bajos para casos como "Darth_Nihilus"
    clean_nickname := UPPER(REGEXP_REPLACE(user_nickname, '[^a-zA-Z0-9_]', '', 'g'));
    
    -- Crear código base: CRYPTOFORCE + _ + NICKNAME completo
    base_code := 'CRYPTOFORCE_' || clean_nickname;
    final_code := base_code;
    
    -- Verificar unicidad y agregar sufijo numérico si es necesario
    WHILE EXISTS(SELECT 1 FROM users WHERE referral_code = final_code) AND counter <= max_attempts LOOP
        final_code := base_code || counter::text;
        counter := counter + 1;
    END LOOP;
    
    -- Si después de intentos sigue existiendo, agregar timestamp
    IF EXISTS(SELECT 1 FROM users WHERE referral_code = final_code) THEN
        final_code := base_code || '_' || EXTRACT(EPOCH FROM NOW())::INTEGER::TEXT;
    END IF;
    
    RETURN final_code;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- PASO 4: FUNCIÓN PARA PROCESAR NUEVOS REFERIDOS
-- =====================================================

CREATE OR REPLACE FUNCTION process_new_referral(
    new_user_email TEXT,
    referrer_code TEXT
) RETURNS JSONB AS $$
DECLARE
    referrer_record RECORD;
    result JSONB := '{}';
    commission_amount DECIMAL(10,2) := 5.00;
    new_level INTEGER;
BEGIN
    -- Buscar al usuario que refiere
    SELECT email, nickname, user_level, total_referrals, total_earnings 
    INTO referrer_record
    FROM users 
    WHERE referral_code = referrer_code;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Código de referido no válido');
    END IF;
    
    -- Calcular nivel del nuevo usuario
    new_level := referrer_record.user_level + 1;
    
    -- Insertar en historial de referidos
    INSERT INTO referral_history (
        referrer_email, 
        referred_email, 
        referrer_code, 
        commission_earned,
        level_depth
    ) VALUES (
        referrer_record.email, 
        new_user_email, 
        referrer_code,
        commission_amount,
        new_level
    );
    
    -- Actualizar contadores del referidor
    UPDATE users 
    SET 
        total_referrals = total_referrals + 1,
        total_earnings = total_earnings + commission_amount,
        updated_at = now()
    WHERE email = referrer_record.email;
    
    -- Preparar respuesta
    result := jsonb_build_object(
        'success', true,
        'referrer_email', referrer_record.email,
        'referrer_nickname', referrer_record.nickname,
        'new_user_level', new_level,
        'commission_earned', commission_amount
    );
    
    RETURN result;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- PASO 5: CONFIGURAR SOLO 2 USUARIOS FUNDADORES (NIVEL 0)
-- =====================================================

-- Función para configurar usuarios fundadores de forma segura
CREATE OR REPLACE FUNCTION setup_cryptoforce_founders()
RETURNS VOID AS $$
DECLARE
    founder1_email TEXT := 'coeurdeluke.js@gmail.com';
    founder1_nickname TEXT := 'Luke';
    founder1_code TEXT := 'CRYPTOFORCE_LUKE';
    
    founder2_email TEXT := 'infocryptoforce@gmail.com';
    founder2_nickname TEXT := 'Darth_Nihilus';
    founder2_code TEXT := 'CRYPTOFORCE_DARTH_NIHILUS';
BEGIN
    -- Resetear todos los usuarios a nivel 1 (por seguridad)
    UPDATE users SET user_level = 1 WHERE user_level = 0;
    RAISE NOTICE '🔄 Todos los usuarios reseteados a nivel 1';
    
    -- Configurar primer fundador (Luke)
    IF EXISTS(SELECT 1 FROM users WHERE email = founder1_email) THEN
        UPDATE users 
        SET 
            user_level = 0,
            referral_code = founder1_code,
            updated_at = now()
        WHERE email = founder1_email;
        RAISE NOTICE '✅ Usuario % configurado como fundador con código: %', founder1_email, founder1_code;
    ELSE
        -- Crear usuario fundador si no existe
        INSERT INTO users (
            nombre, apellido, nickname, email, 
            referral_code, user_level, total_referrals, total_earnings,
            created_at, updated_at
        ) VALUES (
            'Luke', 'Gonzalez', founder1_nickname, founder1_email,
            founder1_code, 0, 0, 0.00,
            now(), now()
        );
        RAISE NOTICE '✅ Usuario fundador % creado con código: %', founder1_email, founder1_code;
    END IF;
    
    -- Configurar segundo fundador (Darth_Nihilus)
    IF EXISTS(SELECT 1 FROM users WHERE email = founder2_email) THEN
        UPDATE users 
        SET 
            user_level = 0,
            referral_code = founder2_code,
            updated_at = now()
        WHERE email = founder2_email;
        RAISE NOTICE '✅ Usuario % configurado como fundador con código: %', founder2_email, founder2_code;
    ELSE
        -- Crear usuario fundador si no existe
        INSERT INTO users (
            nombre, apellido, nickname, email, 
            referral_code, user_level, total_referrals, total_earnings,
            created_at, updated_at
        ) VALUES (
            'Info', 'Crypto Force', founder2_nickname, founder2_email,
            founder2_code, 0, 0, 0.00,
            now(), now()
        );
        RAISE NOTICE '✅ Usuario fundador % creado con código: %', founder2_email, founder2_code;
    END IF;
    
    -- Verificar que solo estos 2 usuarios tengan nivel 0
    IF (SELECT COUNT(*) FROM users WHERE user_level = 0) != 2 THEN
        RAISE EXCEPTION '❌ ERROR: Solo deben existir 2 usuarios fundadores (nivel 0)';
    END IF;
    
    RAISE NOTICE '🎯 Sistema de fundadores configurado correctamente';
END;
$$ LANGUAGE plpgsql;

-- Ejecutar configuración de fundadores
SELECT setup_cryptoforce_founders();

-- =====================================================
-- PASO 6: TRIGGER PARA AUTO-GENERAR Y ACTUALIZAR CÓDIGOS
-- =====================================================

CREATE OR REPLACE FUNCTION auto_generate_cryptoforce_referral_code()
RETURNS TRIGGER AS $$
BEGIN
    -- Solo generar código si no existe uno o si el nickname cambió
    IF NEW.referral_code IS NULL OR NEW.referral_code = '' THEN
        -- Generar código inicial
        NEW.referral_code := generate_cryptoforce_referral_code(NEW.nickname);
    ELSIF OLD.nickname IS DISTINCT FROM NEW.nickname THEN
        -- Actualizar código si cambió el nickname (excepto para fundadores)
        IF NEW.user_level != 0 THEN
            NEW.referral_code := generate_cryptoforce_referral_code(NEW.nickname);
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger
DROP TRIGGER IF EXISTS trigger_auto_cryptoforce_referral_code ON users;
CREATE TRIGGER trigger_auto_cryptoforce_referral_code
    BEFORE INSERT OR UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION auto_generate_cryptoforce_referral_code();

-- =====================================================
-- PASO 7: FUNCIÓN PARA ACTUALIZAR CÓDIGOS EXISTENTES
-- =====================================================

CREATE OR REPLACE FUNCTION update_all_cryptoforce_referral_codes()
RETURNS VOID AS $$
DECLARE
    user_record RECORD;
    new_code TEXT;
    updated_count INTEGER := 0;
BEGIN
    -- Actualizar códigos de todos los usuarios (excepto fundadores)
    FOR user_record IN 
        SELECT id, email, nickname, referral_code, user_level 
        FROM users 
        WHERE user_level != 0 
        AND nickname IS NOT NULL 
        AND nickname != ''
    LOOP
        -- Generar nuevo código
        new_code := generate_cryptoforce_referral_code(user_record.nickname);
        
        -- Actualizar si es diferente
        IF user_record.referral_code != new_code THEN
            UPDATE users 
            SET referral_code = new_code, updated_at = now()
            WHERE id = user_record.id;
            
            updated_count := updated_count + 1;
            RAISE NOTICE '🔄 Código actualizado para %: % -> %', user_record.email, user_record.referral_code, new_code;
        END IF;
    END LOOP;
    
    RAISE NOTICE '✅ Total de códigos actualizados: %', updated_count;
END;
$$ LANGUAGE plpgsql;

-- Ejecutar actualización de códigos existentes
SELECT update_all_cryptoforce_referral_codes();

-- =====================================================
-- PASO 8: FUNCIÓN PARA GENERAR ENLACES DE REGISTRO
-- =====================================================

CREATE OR REPLACE FUNCTION generate_registration_link(referral_code TEXT)
RETURNS TEXT AS $$
DECLARE
    base_url TEXT := 'https://cripto-force-dashboard.vercel.app/register';
    full_link TEXT;
BEGIN
    -- Validar que el código de referido existe
    IF NOT EXISTS(SELECT 1 FROM users WHERE referral_code = referral_code) THEN
        RETURN NULL;
    END IF;
    
    -- Generar enlace completo con código de referido
    full_link := base_url || '?ref=' || referral_code;
    
    RETURN full_link;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- PASO 9: FUNCIONES DE CONSULTA PARA EL FRONTEND
-- =====================================================

-- Función para obtener estadísticas de referidos de un usuario
CREATE OR REPLACE FUNCTION get_user_referral_stats(user_email TEXT)
RETURNS JSONB AS $$
DECLARE
    user_record RECORD;
    direct_referrals INTEGER;
    total_network INTEGER;
    recent_referrals JSONB;
    registration_link TEXT;
    result JSONB;
BEGIN
    -- Obtener datos del usuario
    SELECT referral_code, total_referrals, total_earnings, user_level
    INTO user_record
    FROM users 
    WHERE email = user_email;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Usuario no encontrado');
    END IF;
    
    -- Generar enlace de registro
    registration_link := generate_registration_link(user_record.referral_code);
    
    -- Contar referidos directos
    SELECT COUNT(*) INTO direct_referrals
    FROM referral_history 
    WHERE referrer_email = user_email AND status = 'active';
    
    -- Obtener últimos 5 referidos
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
        WHERE referrer_email = user_email 
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

-- Función para validar código de referido
CREATE OR REPLACE FUNCTION validate_referral_code(code TEXT)
RETURNS JSONB AS $$
DECLARE
    referrer_record RECORD;
BEGIN
    SELECT nickname, email, user_level INTO referrer_record
    FROM users 
    WHERE referral_code = code;
    
    IF FOUND THEN
        RETURN jsonb_build_object(
            'valid', true,
            'referrer_nickname', referrer_record.nickname,
            'referrer_email', referrer_record.email,
            'referrer_level', referrer_record.user_level
        );
    ELSE
        RETURN jsonb_build_object('valid', false);
    END IF;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- PASO 10: VERIFICACIÓN FINAL Y ESTADÍSTICAS
-- =====================================================

-- Mostrar estado final de los códigos
SELECT 
    'ESTADO FINAL DE CÓDIGOS CRYPTOFORCE' as section,
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

-- Mostrar estadísticas del sistema
SELECT 
    'ESTADÍSTICAS DEL SISTEMA' as section,
    COUNT(*) as total_users,
    COUNT(CASE WHEN user_level = 0 THEN 1 END) as founders,
    COUNT(CASE WHEN referral_code LIKE 'CRYPTOFORCE_%' THEN 1 END) as correct_format,
    COUNT(CASE WHEN referred_by IS NOT NULL THEN 1 END) as referred_users
FROM users;

-- Mostrar enlaces de registro de fundadores
SELECT 
    'ENLACES DE REGISTRO FUNDADORES' as section,
    nickname,
    referral_code,
    generate_registration_link(referral_code) as registration_link
FROM users 
WHERE user_level = 0
ORDER BY nickname;

-- =====================================================
-- RESUMEN DE IMPLEMENTACIÓN
-- =====================================================
/*
✅ SISTEMA IMPLEMENTADO EXITOSAMENTE:

1. FORMATO DE CÓDIGOS: CRYPTOFORCE_NICKNAME
   - Ejemplo: CRYPTOFORCE_DARTH_NIHILUS
   - Se mantiene el nickname completo en mayúsculas
   - Solo se limpian caracteres especiales (excepto guiones bajos)

2. ACTUALIZACIÓN AUTOMÁTICA:
   - Trigger automático cuando cambia el nickname
   - Solo para usuarios no fundadores
   - Los fundadores mantienen sus códigos fijos

3. ENLACES DE REGISTRO:
   - Función generate_registration_link() genera enlaces automáticamente
   - Formato: https://cripto-force-dashboard.vercel.app/register?ref=CRYPTOFORCE_NICKNAME
   - Se incluye en las estadísticas del usuario

4. FUNDADORES AUTORIZADOS:
   - coeurdeluke.js@gmail.com → CRYPTOFORCE_LUKE
   - infocryptoforce@gmail.com → CRYPTOFORCE_DARTH_NIHILUS
   - Solo estos 2 pueden tener nivel 0

5. FUNCIONES DISPONIBLES:
   - generate_cryptoforce_referral_code(nickname)
   - process_new_referral(email, code)
   - get_user_referral_stats(email)
   - validate_referral_code(code)
   - generate_registration_link(code)

6. TRIGGERS ACTIVOS:
   - trigger_auto_cryptoforce_referral_code: Genera/actualiza códigos automáticamente

Para usar en el frontend:
- Llamar a get_user_referral_stats(email) para obtener código y enlace
- Usar generate_registration_link(code) para crear enlaces de invitación
- El sistema se actualiza automáticamente cuando cambian los nicknames
*/
