-- =====================================================
-- CRYPTO FORCE - SISTEMA DE REFERIDOS COMPLETO Y SEGURO
-- =====================================================
-- Este script configura todo el sistema de referidos desde cero
-- Solo 2 usuarios pueden tener nivel 0: coeurdeluke.js@gmail.com e infocryptoforce@gmail.com

-- =====================================================
-- PASO 1: VERIFICAR Y PREPARAR TABLA USUARIOS
-- =====================================================

-- Agregar columnas necesarias para el sistema de referidos
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

    -- Agregar columna user_level para tracking de niveles
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'user_level'
    ) THEN
        ALTER TABLE users ADD COLUMN user_level INTEGER DEFAULT 1;
        RAISE NOTICE '✅ Columna user_level agregada';
    END IF;

    -- Agregar columna total_referrals para cache de conteo
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'total_referrals'
    ) THEN
        ALTER TABLE users ADD COLUMN total_referrals INTEGER DEFAULT 0;
        RAISE NOTICE '✅ Columna total_referrals agregada';
    END IF;

    -- Agregar columna total_earnings para recompensas
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
-- PASO 3: FUNCIÓN PARA GENERAR CÓDIGOS DE REFERIDO
-- =====================================================

CREATE OR REPLACE FUNCTION generate_referral_code(user_nickname TEXT)
RETURNS TEXT AS $$
DECLARE
    clean_nickname TEXT;
    base_code TEXT;
    final_code TEXT;
    counter INTEGER := 1;
    max_attempts INTEGER := 100;
BEGIN
    -- Limpiar nickname: solo letras y números, convertir a mayúsculas
    clean_nickname := UPPER(REGEXP_REPLACE(user_nickname, '[^a-zA-Z0-9]', '', 'g'));
    
    -- Crear código base: CRYPTOFORCE + NICKNAME completo
    base_code := 'CRYPTOFORCE_' || clean_nickname;
    final_code := base_code;
    
    -- Verificar unicidad y agregar sufijo numérico si es necesario
    WHILE EXISTS(SELECT 1 FROM users WHERE referral_code = final_code) AND counter <= max_attempts LOOP
        final_code := base_code || counter::text;
        counter := counter + 1;
    END LOOP;
    
    -- Si después de intentos sigue existiendo, agregar timestamp
    IF EXISTS(SELECT 1 FROM users WHERE referral_code = final_code) THEN
        final_code := base_code || EXTRACT(EPOCH FROM NOW())::INTEGER::TEXT;
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
CREATE OR REPLACE FUNCTION setup_founders()
RETURNS VOID AS $$
DECLARE
    founder1_email TEXT := 'coeurdeluke.js@gmail.com';
    founder1_nickname TEXT := 'Luke';
    founder1_code TEXT := 'CRYPTOFORCE_LUKE';
    
    founder2_email TEXT := 'infocryptoforce@gmail.com';
    founder2_nickname TEXT := 'INFOCRYPTOFORCE';
    founder2_code TEXT := 'CRYPTOFORCE_INFOCRYPTOFORCE';
BEGIN
    -- Resetear todos los usuarios a nivel 1 (por seguridad)
    UPDATE users 
    SET user_level = 1 
    WHERE user_level = 0;
    
    RAISE NOTICE '🔒 Todos los usuarios reseteados a nivel 1 por seguridad';
    
    -- Configurar primer fundador (Luke)
    IF EXISTS(SELECT 1 FROM users WHERE email = founder1_email) THEN
        UPDATE users 
        SET 
            nickname = founder1_nickname,
            referral_code = founder1_code,
            user_level = 0,  -- Nivel 0 = Fundador
            total_referrals = COALESCE(total_referrals, 0),
            total_earnings = COALESCE(total_earnings, 0.00),
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
            'Luke', 'Crypto', founder1_nickname, founder1_email,
            founder1_code, 0, 0, 0.00,
            now(), now()
        );
        
        RAISE NOTICE '✅ Usuario fundador % creado con código: %', founder1_email, founder1_code;
    END IF;
    
    -- Configurar segundo fundador (Info Crypto Force)
    IF EXISTS(SELECT 1 FROM users WHERE email = founder2_email) THEN
        UPDATE users 
        SET 
            nickname = founder2_nickname,
            referral_code = founder2_code,
            user_level = 0,  -- Nivel 0 = Fundador
            total_referrals = COALESCE(total_referrals, 0),
            total_earnings = COALESCE(total_earnings, 0.00),
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
SELECT setup_founders();

-- =====================================================
-- PASO 6: TRIGGER PARA AUTO-GENERAR Y ACTUALIZAR CÓDIGOS
-- =====================================================

CREATE OR REPLACE FUNCTION auto_generate_referral_code()
RETURNS TRIGGER AS $$
BEGIN
    -- Solo generar código si no existe uno o si el nickname cambió
    IF NEW.referral_code IS NULL OR NEW.referral_code = '' THEN
        -- Generar código inicial
        NEW.referral_code := generate_referral_code(NEW.nickname);
    ELSIF OLD.nickname IS DISTINCT FROM NEW.nickname THEN
        -- Actualizar código si cambió el nickname (excepto para fundadores)
        IF NEW.user_level != 0 THEN
            NEW.referral_code := generate_referral_code(NEW.nickname);
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger
DROP TRIGGER IF EXISTS trigger_auto_referral_code ON users;
CREATE TRIGGER trigger_auto_referral_code
    BEFORE INSERT OR UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION auto_generate_referral_code();

-- =====================================================
-- PASO 7: FUNCIÓN PARA ACTUALIZAR CÓDIGOS EXISTENTES
-- =====================================================

CREATE OR REPLACE FUNCTION update_all_referral_codes()
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
        new_code := generate_referral_code(user_record.nickname);
        
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
SELECT update_all_referral_codes();

-- =====================================================
-- PASO 8: FUNCIONES DE CONSULTA PARA EL FRONTEND
-- =====================================================

-- Función para obtener estadísticas de referidos de un usuario
CREATE OR REPLACE FUNCTION get_user_referral_stats(user_email TEXT)
RETURNS JSONB AS $$
DECLARE
    user_record RECORD;
    direct_referrals INTEGER;
    total_network INTEGER;
    recent_referrals JSONB;
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
    SELECT nickname, email INTO referrer_record
    FROM users 
    WHERE referral_code = code;
    
    IF FOUND THEN
        RETURN jsonb_build_object(
            'valid', true,
            'referrer_nickname', referrer_record.nickname,
            'referrer_email', referrer_record.email
        );
    ELSE
        RETURN jsonb_build_object('valid', false);
    END IF;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- PASO 9: POLÍTICAS RLS PARA SEGURIDAD ROBUSTA
-- =====================================================

-- Habilitar RLS en tabla de historial
ALTER TABLE public.referral_history ENABLE ROW LEVEL SECURITY;

-- Política para que usuarios vean solo sus referidos
CREATE POLICY "Users can view their own referral history" ON referral_history
    FOR SELECT USING (
        referrer_email = current_setting('app.current_user_email', true) OR
        referred_email = current_setting('app.current_user_email', true)
    );

-- Política para insertar nuevos referidos
CREATE POLICY "Allow inserting new referrals" ON referral_history
    FOR INSERT WITH CHECK (true);

-- Política para actualizar referidos (solo el propietario)
CREATE POLICY "Users can update their own referrals" ON referral_history
    FOR UPDATE USING (
        referrer_email = current_setting('app.current_user_email', true)
    );

-- Otorgar permisos
GRANT SELECT, INSERT, UPDATE ON referral_history TO anon, authenticated;

-- =====================================================
-- PASO 10: VERIFICACIÓN FINAL Y SEGURIDAD
-- =====================================================

-- Verificar que solo existen 2 fundadores
DO $$
DECLARE
    founder_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO founder_count
    FROM users 
    WHERE user_level = 0;
    
    IF founder_count != 2 THEN
        RAISE EXCEPTION '❌ ERROR DE SEGURIDAD: Deben existir exactamente 2 usuarios fundadores (nivel 0), actualmente hay %', founder_count;
    END IF;
    
    RAISE NOTICE '✅ Verificación de seguridad: % usuarios fundadores confirmados', founder_count;
END $$;

-- Mostrar estado del sistema
SELECT 
    '🎯 SISTEMA DE REFERIDOS CONFIGURADO Y SEGURO' as status,
    'Solo 2 usuarios fundadores autorizados (nivel 0)' as security_info;

-- Mostrar fundadores
SELECT 
    'FUNDADORES DEL SISTEMA' as section,
    email,
    nickname,
    referral_code,
    user_level
FROM users 
WHERE user_level = 0
ORDER BY created_at;

-- Mostrar estadísticas
SELECT 
    'ESTADÍSTICAS INICIALES' as section,
    COUNT(*) as total_users,
    COUNT(CASE WHEN referral_code IS NOT NULL THEN 1 END) as users_with_codes,
    COUNT(CASE WHEN user_level = 0 THEN 1 END) as founders,
    COUNT(CASE WHEN user_level = 1 THEN 1 END) as regular_users
FROM users;

-- Verificar formato de códigos
SELECT 
    'VERIFICACIÓN DE FORMATO DE CÓDIGOS' as section,
    COUNT(*) as total_users,
    COUNT(CASE WHEN referral_code LIKE 'CRYPTOFORCE_%' THEN 1 END) as correct_format,
    COUNT(CASE WHEN referral_code NOT LIKE 'CRYPTOFORCE_%' THEN 1 END) as incorrect_format
FROM users 
WHERE referral_code IS NOT NULL;

SELECT '🚀 Sistema de referidos seguro y configurado correctamente!' as final_message;
