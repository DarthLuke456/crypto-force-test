-- =====================================================
-- LIMPIEZA Y RECREACIÓN DE FUNCIONES DE REFERIDOS
-- =====================================================
-- Este script elimina las funciones existentes y las recrea correctamente

-- =====================================================
-- PASO 1: ELIMINAR FUNCIONES EXISTENTES
-- =====================================================

-- Eliminar funciones existentes para evitar conflictos
DROP FUNCTION IF EXISTS process_new_referral(text, text);
DROP FUNCTION IF EXISTS process_new_referral(text, text, text);
DROP FUNCTION IF EXISTS generate_registration_link(text);
DROP FUNCTION IF EXISTS get_user_referral_stats(text);
DROP FUNCTION IF EXISTS validate_referral_code(text);
DROP FUNCTION IF EXISTS generate_cryptoforce_referral_code(text);
DROP FUNCTION IF EXISTS update_all_cryptoforce_referral_codes();
DROP FUNCTION IF EXISTS setup_cryptoforce_founders();
DROP FUNCTION IF EXISTS auto_generate_cryptoforce_referral_code();

-- Eliminar triggers existentes
DROP TRIGGER IF EXISTS trigger_auto_cryptoforce_referral_code ON users;
DROP TRIGGER IF EXISTS trigger_auto_referral_code ON users;
DROP TRIGGER IF EXISTS trigger_referral_code_nickname_change ON users;

-- Verificar que se eliminaron
SELECT 
    'FUNCIONES ELIMINADAS' as status,
    routine_name,
    routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name LIKE '%referral%'
ORDER BY routine_name;

-- =====================================================
-- PASO 2: RECREAR FUNCIONES CORRECTAMENTE
-- =====================================================

-- Función para generar códigos CRYPTOFORCE
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

-- Función para procesar nuevos referidos
CREATE OR REPLACE FUNCTION process_new_referral(
    new_user_email TEXT,
    referrer_code_input TEXT
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
    WHERE referral_code = referrer_code_input;
    
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
        referrer_code_input,
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

-- Función para generar enlaces de registro
CREATE OR REPLACE FUNCTION generate_registration_link(input_code TEXT)
RETURNS TEXT AS $$
DECLARE
    base_url TEXT := 'https://cripto-force-dashboard.vercel.app/register';
    full_link TEXT;
BEGIN
    -- Validar que el código de referido existe
    -- Usar input_code para evitar ambigüedad con la columna
    IF NOT EXISTS(SELECT 1 FROM users WHERE referral_code = input_code) THEN
        RETURN NULL;
    END IF;
    
    -- Generar enlace completo con código de referido
    full_link := base_url || '?ref=' || input_code;
    
    RETURN full_link;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener estadísticas de referidos
CREATE OR REPLACE FUNCTION get_user_referral_stats(user_email_input TEXT)
RETURNS JSONB AS $$
DECLARE
    user_record RECORD;
    direct_referrals INTEGER;
    recent_referrals JSONB;
    registration_link TEXT;
    result JSONB;
BEGIN
    -- Obtener datos del usuario
    SELECT referral_code, total_referrals, total_earnings, user_level
    INTO user_record
    FROM users 
    WHERE email = user_email_input;
    
    IF NOT FOUND THEN
        RETURN jsonb_build_object('success', false, 'error', 'Usuario no encontrado');
    END IF;
    
    -- Generar enlace de registro
    registration_link := generate_registration_link(user_record.referral_code);
    
    -- Contar referidos directos
    SELECT COUNT(*) INTO direct_referrals
    FROM referral_history 
    WHERE referrer_email = user_email_input AND status = 'active';
    
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

-- Función para validar código de referido
CREATE OR REPLACE FUNCTION validate_referral_code(input_code TEXT)
RETURNS JSONB AS $$
DECLARE
    referrer_record RECORD;
BEGIN
    SELECT nickname, email, user_level INTO referrer_record
    FROM users 
    WHERE referral_code = input_code;
    
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

-- Función para configurar fundadores
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

-- Función para actualizar códigos existentes
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

-- Función para el trigger
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

-- =====================================================
-- PASO 3: VERIFICAR FUNCIONES CREADAS
-- =====================================================

-- Mostrar funciones creadas
SELECT 
    'FUNCIONES RECREADAS' as status,
    routine_name,
    routine_type,
    data_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name LIKE '%referral%'
ORDER BY routine_name;

-- =====================================================
-- PASO 4: CREAR TRIGGER
-- =====================================================

-- Crear trigger
CREATE TRIGGER trigger_auto_cryptoforce_referral_code
    BEFORE INSERT OR UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION auto_generate_cryptoforce_referral_code();

-- Verificar trigger creado
SELECT 
    'TRIGGER CREADO' as status,
    trigger_name,
    event_manipulation,
    action_statement
FROM information_schema.triggers
WHERE event_object_table = 'users'
AND trigger_name = 'trigger_auto_cryptoforce_referral_code';

-- =====================================================
-- RESUMEN
-- =====================================================
/*
✅ FUNCIONES RECREADAS EXITOSAMENTE:

1. generate_cryptoforce_referral_code(nickname)
2. process_new_referral(email, code)
3. generate_registration_link(code)
4. get_user_referral_stats(email)
5. validate_referral_code(code)
6. setup_cryptoforce_founders()
7. update_all_cryptoforce_referral_codes()
8. auto_generate_cryptoforce_referral_code()

✅ TRIGGER CREADO:
- trigger_auto_cryptoforce_referral_code

Ahora puedes continuar con el script principal o ejecutar las funciones individualmente.
*/
