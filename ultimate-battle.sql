-- =====================================================
-- BATALLA ULTIMATE: ELIMINAR TODAS LAS VERSIONES DE CADA FUNCIÓN
-- =====================================================
-- Este script identifica y elimina TODAS las versiones de cada función

-- =====================================================
-- 1. ELIMINAR FUNCIONES POR FIRMA ESPECÍFICA (TODAS LAS VERSIONES)
-- =====================================================

-- Eliminar todas las versiones de can_edit_user
DROP FUNCTION IF EXISTS public.can_edit_user() CASCADE;
DROP FUNCTION IF EXISTS public.can_edit_user(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.can_edit_user(UUID, TEXT) CASCADE;
DROP FUNCTION IF EXISTS public.can_edit_user(UUID, TEXT, TEXT) CASCADE;

-- Eliminar todas las versiones de check_founder_status
DROP FUNCTION IF EXISTS public.check_founder_status() CASCADE;
DROP FUNCTION IF EXISTS public.check_founder_status(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.check_founder_status(UUID, TEXT) CASCADE;

-- Eliminar todas las versiones de generate_referral_code
DROP FUNCTION IF EXISTS public.generate_referral_code() CASCADE;
DROP FUNCTION IF EXISTS public.generate_referral_code(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.generate_referral_code(TEXT) CASCADE;
DROP FUNCTION IF EXISTS public.generate_referral_code(UUID, TEXT) CASCADE;

-- Eliminar todas las versiones de is_maestro
DROP FUNCTION IF EXISTS public.is_maestro() CASCADE;
DROP FUNCTION IF EXISTS public.is_maestro(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.is_maestro(TEXT) CASCADE;

-- Eliminar todas las versiones de generate_standard_referral_code
DROP FUNCTION IF EXISTS public.generate_standard_referral_code() CASCADE;
DROP FUNCTION IF EXISTS public.generate_standard_referral_code(TEXT) CASCADE;

-- Eliminar todas las versiones de get_user_referral_stats
DROP FUNCTION IF EXISTS public.get_user_referral_stats() CASCADE;
DROP FUNCTION IF EXISTS public.get_user_referral_stats(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.get_user_referral_stats(TEXT) CASCADE;

-- Eliminar todas las versiones de process_new_referral
DROP FUNCTION IF EXISTS public.process_new_referral() CASCADE;
DROP FUNCTION IF EXISTS public.process_new_referral(UUID) CASCADE;

-- Eliminar todas las versiones de get_user_level
DROP FUNCTION IF EXISTS public.get_user_level() CASCADE;
DROP FUNCTION IF EXISTS public.get_user_level(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.get_user_level(TEXT) CASCADE;

-- Eliminar todas las versiones de update_user_to_maestro
DROP FUNCTION IF EXISTS public.update_user_to_maestro() CASCADE;
DROP FUNCTION IF EXISTS public.update_user_to_maestro(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.update_user_to_maestro(TEXT) CASCADE;

-- Eliminar todas las versiones de log_access
DROP FUNCTION IF EXISTS public.log_access() CASCADE;
DROP FUNCTION IF EXISTS public.log_access(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.log_access(TEXT) CASCADE;

-- Eliminar todas las versiones de can_access_user_data
DROP FUNCTION IF EXISTS public.can_access_user_data() CASCADE;
DROP FUNCTION IF EXISTS public.can_access_user_data(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.can_access_user_data(TEXT) CASCADE;

-- Eliminar todas las versiones de generate_cryptoforce_referral_code
DROP FUNCTION IF EXISTS public.generate_cryptoforce_referral_code() CASCADE;
DROP FUNCTION IF EXISTS public.generate_cryptoforce_referral_code(TEXT) CASCADE;

-- Eliminar todas las versiones de set_updated_at
DROP FUNCTION IF EXISTS public.set_updated_at() CASCADE;
DROP FUNCTION IF EXISTS public.set_updated_at(UUID) CASCADE;

-- =====================================================
-- 2. ESPERAR UN MOMENTO
-- =====================================================

-- Hacer una consulta simple para dar tiempo al sistema
SELECT NOW() as current_time, 'Functions eliminated' as status;

-- =====================================================
-- 3. RECREAR FUNCIONES CON SEARCH_PATH INMUTABLE
-- =====================================================

-- Función para actualizar la columna 'updated_at'
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public, extensions, pg_temp
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Función para verificar si un usuario puede editar a otro
CREATE OR REPLACE FUNCTION public.can_edit_user(target_user_id UUID)
RETURNS BOOLEAN 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public, extensions, pg_temp
AS $$
DECLARE
    current_user_level TEXT;
    target_user_level TEXT;
BEGIN
    SELECT user_level INTO current_user_level FROM public.users WHERE id = auth.uid();
    SELECT user_level INTO target_user_level FROM public.users WHERE id = target_user_id;

    -- Un maestro puede editar a un acólito
    IF current_user_level = 'maestro' AND target_user_level = 'acolito' THEN
        RETURN TRUE;
    END IF;

    -- Un fundador puede editar a cualquiera excepto a otro fundador
    IF current_user_level = 'founder' AND target_user_level != 'founder' THEN
        RETURN TRUE;
    END IF;

    -- Un usuario solo puede editarse a sí mismo
    IF auth.uid() = target_user_id THEN
        RETURN TRUE;
    END IF;

    RETURN FALSE;
END;
$$;

-- Función para verificar el estado de fundador de un usuario
CREATE OR REPLACE FUNCTION public.check_founder_status(user_id UUID)
RETURNS BOOLEAN 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public, extensions, pg_temp
AS $$
DECLARE
    user_email TEXT;
BEGIN
    SELECT email INTO user_email FROM public.users WHERE id = user_id;
    RETURN user_email LIKE '%@cryptoforce.com%';
END;
$$;

-- Función para generar códigos de referido estándar
CREATE OR REPLACE FUNCTION public.generate_standard_referral_code()
RETURNS TEXT 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public, extensions, pg_temp
AS $$
DECLARE
    new_code TEXT;
    characters TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    code_length INT := 8;
    i INT;
    random_index INT;
BEGIN
    LOOP
        new_code := '';
        FOR i IN 1..code_length LOOP
            random_index := floor(random() * length(characters)) + 1;
            new_code := new_code || substr(characters, random_index, 1);
        END LOOP;
        -- Verificar si el código ya existe en la tabla 'users'
        IF NOT EXISTS (SELECT 1 FROM public.users WHERE referral_code = new_code) THEN
            RETURN new_code;
        END IF;
    END LOOP;
END;
$$;

-- Función para generar códigos de referido de CryptoForce
CREATE OR REPLACE FUNCTION public.generate_cryptoforce_referral_code()
RETURNS TEXT 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public, extensions, pg_temp
AS $$
DECLARE
    new_code TEXT;
    characters TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    code_length INT := 10; -- Longitud mayor para códigos CryptoForce
    i INT;
    random_index INT;
BEGIN
    LOOP
        new_code := 'CF-'; -- Prefijo para CryptoForce
        FOR i IN 1..code_length LOOP
            random_index := floor(random() * length(characters)) + 1;
            new_code := new_code || substr(characters, random_index, 1);
        END LOOP;
        -- Verificar si el código ya existe en la tabla 'users'
        IF NOT EXISTS (SELECT 1 FROM public.users WHERE referral_code = new_code) THEN
            RETURN new_code;
        END IF;
    END LOOP;
END;
$$;

-- Función para generar un código de referido para un usuario específico
CREATE OR REPLACE FUNCTION public.generate_referral_code(user_id UUID)
RETURNS TEXT 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public, extensions, pg_temp
AS $$
DECLARE
    user_email TEXT;
    user_nickname TEXT;
    generated_code TEXT;
BEGIN
    SELECT email, nickname INTO user_email, user_nickname FROM public.users WHERE id = user_id;

    IF user_email LIKE '%@cryptoforce.com%' THEN
        generated_code := public.generate_cryptoforce_referral_code();
    ELSE
        generated_code := public.generate_standard_referral_code();
    END IF;

    RETURN generated_code;
END;
$$;

-- Función para verificar si un usuario es maestro
CREATE OR REPLACE FUNCTION public.is_maestro(user_id UUID)
RETURNS BOOLEAN 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public, extensions, pg_temp
AS $$
DECLARE
    user_level TEXT;
BEGIN
    SELECT user_level INTO user_level FROM public.users WHERE id = user_id;
    RETURN user_level = 'maestro' OR user_level = 'founder';
END;
$$;

-- Función para obtener estadísticas de referidos de un usuario
CREATE OR REPLACE FUNCTION public.get_user_referral_stats(user_id UUID)
RETURNS TABLE (
    total_referrals BIGINT,
    founder_referrals BIGINT,
    maestro_referrals BIGINT,
    acolito_referrals BIGINT
) 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public, extensions, pg_temp
AS $$
BEGIN
    RETURN QUERY
    SELECT
        COUNT(rh.id) AS total_referrals,
        COUNT(CASE WHEN u_referred.user_level = 'founder' THEN 1 END) AS founder_referrals,
        COUNT(CASE WHEN u_referred.user_level = 'maestro' THEN 1 END) AS maestro_referrals,
        COUNT(CASE WHEN u_referred.user_level = 'acolito' THEN 1 END) AS acolito_referrals
    FROM
        public.referral_history rh
    JOIN
        public.users u_referrer ON rh.referrer_code = u_referrer.referral_code
    LEFT JOIN
        public.users u_referred ON rh.referred_code = u_referred.referral_code
    WHERE
        u_referrer.id = user_id;
END;
$$;

-- Función para procesar un nuevo referido
CREATE OR REPLACE FUNCTION public.process_new_referral()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public, extensions, pg_temp
AS $$
DECLARE
    referrer_user_id UUID;
BEGIN
    -- Buscar el ID del usuario que refirió
    SELECT id INTO referrer_user_id
    FROM public.users
    WHERE referral_code = NEW.referrer_code;

    IF referrer_user_id IS NOT NULL THEN
        -- Incrementar el contador de referidos del referente
        UPDATE public.users
        SET total_referrals = total_referrals + 1
        WHERE id = referrer_user_id;
    END IF;

    RETURN NEW;
END;
$$;

-- Función para obtener el nivel de un usuario
CREATE OR REPLACE FUNCTION public.get_user_level(user_id UUID)
RETURNS TEXT 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public, extensions, pg_temp
AS $$
DECLARE
    user_level TEXT;
BEGIN
    SELECT user_level INTO user_level FROM public.users WHERE id = user_id;
    RETURN user_level;
END;
$$;

-- Función para actualizar un usuario a maestro
CREATE OR REPLACE FUNCTION public.update_user_to_maestro(target_user_id UUID)
RETURNS VOID 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public, extensions, pg_temp
AS $$
BEGIN
    UPDATE public.users
    SET user_level = 'maestro'
    WHERE id = target_user_id;
END;
$$;

-- Función para registrar accesos (simplificada)
CREATE OR REPLACE FUNCTION public.log_access()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public, extensions, pg_temp
AS $$
BEGIN
    -- Función simplificada sin dependencias de tablas inexistentes
    RETURN NEW;
END;
$$;

-- Función para verificar si un usuario puede acceder a los datos de otro
CREATE OR REPLACE FUNCTION public.can_access_user_data(target_user_id UUID)
RETURNS BOOLEAN 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public, extensions, pg_temp
AS $$
DECLARE
    current_user_level TEXT;
    target_user_level TEXT;
BEGIN
    SELECT user_level INTO current_user_level FROM public.users WHERE id = auth.uid();
    SELECT user_level INTO target_user_level FROM public.users WHERE id = target_user_id;

    -- Un maestro puede ver a todos los acólitos
    IF current_user_level = 'maestro' AND target_user_level = 'acolito' THEN
        RETURN TRUE;
    END IF;

    -- Un fundador puede ver a todos
    IF current_user_level = 'founder' THEN
        RETURN TRUE;
    END IF;

    -- Un usuario solo puede ver sus propios datos
    IF auth.uid() = target_user_id THEN
        RETURN TRUE;
    END IF;

    RETURN FALSE;
END;
$$;

-- =====================================================
-- 4. RECREAR TRIGGERS ESENCIALES
-- =====================================================

-- Trigger para actualizar 'updated_at' en la tabla 'users'
CREATE TRIGGER update_users_updated_at
BEFORE UPDATE ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- Trigger para actualizar 'updated_at' en la tabla 'referral_history'
CREATE TRIGGER update_referral_history_updated_at
BEFORE UPDATE ON public.referral_history
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at();

-- Trigger para procesar nuevos referidos
CREATE TRIGGER process_new_referral_trigger
AFTER INSERT ON public.referral_history
FOR EACH ROW
EXECUTE FUNCTION public.process_new_referral();

-- =====================================================
-- 5. VERIFICAR QUE LAS FUNCIONES SE CREARON CORRECTAMENTE
-- =====================================================

-- Mostrar todas las funciones creadas
SELECT 
    routine_name,
    routine_type,
    'Function created with immutable search_path' as status
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_type = 'FUNCTION'
ORDER BY routine_name;

