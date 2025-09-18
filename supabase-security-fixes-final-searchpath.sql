-- =====================================================
-- CORRECCIONES DE SEGURIDAD PARA SUPABASE - VERSIÓN FINAL CON SEARCH_PATH EXPLÍCITO
-- =====================================================
-- Este archivo contiene las correcciones necesarias para resolver
-- los problemas de seguridad detectados por el linter de Supabase,
-- incluyendo la configuración explícita del search_path para todas las funciones.

-- =====================================================
-- 1. ELIMINAR TRIGGERS Y FUNCIONES EXISTENTES CON CASCADE
-- =====================================================

-- Eliminar triggers que dependen de las funciones
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
DROP TRIGGER IF EXISTS update_referral_history_updated_at ON public.referral_history;
DROP TRIGGER IF EXISTS auto_generate_referral_code_trigger ON public.users;
DROP TRIGGER IF EXISTS auto_assign_maestro_level_trigger ON public.users;
DROP TRIGGER IF EXISTS ensure_founder_level_trigger ON public.users;
DROP TRIGGER IF EXISTS protect_maestro_level_trigger ON public.users;
DROP TRIGGER IF EXISTS protect_founder_maestro_level_trigger ON public.users;
DROP TRIGGER IF EXISTS update_referral_code_on_nickname_change_trigger ON public.users;
DROP TRIGGER IF EXISTS process_new_referral_trigger ON public.referral_history;
DROP TRIGGER IF EXISTS update_total_referrals_trigger ON public.referral_history;
-- DROP TRIGGER IF EXISTS log_access_trigger ON public.user_access_logs; -- Comentado porque la tabla no existe

-- Eliminar funciones existentes con CASCADE para eliminar dependencias
DROP FUNCTION IF EXISTS public.generate_registration_link(text) CASCADE;
DROP FUNCTION IF EXISTS public.can_edit_user(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.get_user_level(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.set_updated_at() CASCADE;
DROP FUNCTION IF EXISTS public.setup_cryptoforce_founders() CASCADE;
DROP FUNCTION IF EXISTS public.check_founder_status(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.generate_referral_code(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.is_maestro(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.validate_referral_code(text) CASCADE;
DROP FUNCTION IF EXISTS public.generate_standard_referral_code() CASCADE;
DROP FUNCTION IF EXISTS public.get_user_referral_stats(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.ensure_founder_level() CASCADE;
DROP FUNCTION IF EXISTS public.protect_maestro_level() CASCADE;
DROP FUNCTION IF EXISTS public.auto_generate_referral_code() CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS public.process_new_referral() CASCADE;
DROP FUNCTION IF EXISTS public.recalculate_all_total_referrals() CASCADE;
DROP FUNCTION IF EXISTS public.update_user_to_maestro(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.auto_assign_maestro_level() CASCADE;
-- DROP FUNCTION IF EXISTS public.log_access() CASCADE; -- Comentado porque la función no existe
DROP FUNCTION IF EXISTS public.update_referral_code_on_nickname_change() CASCADE;
DROP FUNCTION IF EXISTS public.auto_generate_cryptoforce_referral_code() CASCADE;
DROP FUNCTION IF EXISTS public.can_access_user_data(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at() CASCADE;
DROP FUNCTION IF EXISTS public.update_all_cryptoforce_referral_codes() CASCADE;
DROP FUNCTION IF EXISTS public.validate_founder_protection() CASCADE;
DROP FUNCTION IF EXISTS public.protect_founder_maestro_level() CASCADE;
DROP FUNCTION IF EXISTS public.update_total_referrals() CASCADE;
DROP FUNCTION IF EXISTS public.generate_cryptoforce_referral_code() CASCADE;

-- =====================================================
-- 2. CREAR EXTENSIONES EN UN SCHEMA SEPARADO
-- =====================================================

-- Crear schema 'extensions' si no existe
CREATE SCHEMA IF NOT EXISTS extensions;

-- Crear la extensión citext en el schema 'extensions'
CREATE EXTENSION IF NOT EXISTS citext WITH SCHEMA extensions;

-- =====================================================
-- 3. RECREAR FUNCIONES CON search_path INMUTABLE Y SECURITY DEFINER
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

-- Función para generar códigos de referido estándar
CREATE OR REPLACE FUNCTION public.generate_standard_referral_code()
RETURNS TEXT AS $$
    SET search_path = public, extensions, pg_temp;
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para generar códigos de referido de CryptoForce
CREATE OR REPLACE FUNCTION public.generate_cryptoforce_referral_code()
RETURNS TEXT AS $$
    SET search_path = public, extensions, pg_temp;
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para generar un código de referido para un usuario específico
CREATE OR REPLACE FUNCTION public.generate_referral_code(user_id UUID)
RETURNS TEXT AS $$
    SET search_path = public, extensions, pg_temp;
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para validar un código de referido
CREATE OR REPLACE FUNCTION public.validate_referral_code(input_code TEXT)
RETURNS BOOLEAN AS $$
    SET search_path = public, extensions, pg_temp;
BEGIN
    RETURN EXISTS (SELECT 1 FROM public.users WHERE referral_code = input_code);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para manejar nuevos usuarios (asignar código de referido, etc.)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
    SET search_path = public, extensions, pg_temp;
DECLARE
    referral_code_to_assign TEXT;
    is_founder BOOLEAN;
BEGIN
    -- Asignar un código de referido al nuevo usuario
    referral_code_to_assign := public.generate_referral_code(NEW.id);
    UPDATE public.users
    SET referral_code = referral_code_to_assign,
        total_referrals = 0,
        level = 'acolito' -- Nivel por defecto
    WHERE id = NEW.id;

    -- Verificar si el nuevo usuario es un fundador
    SELECT public.check_founder_status(NEW.id) INTO is_founder;

    IF is_founder THEN
        UPDATE public.users
        SET level = 'founder'
        WHERE id = NEW.id;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para actualizar el código de referido cuando cambia el nickname
CREATE OR REPLACE FUNCTION public.update_referral_code_on_nickname_change()
RETURNS TRIGGER AS $$
    SET search_path = public, extensions, pg_temp;
BEGIN
    IF OLD.nickname IS DISTINCT FROM NEW.nickname THEN
        NEW.referral_code = public.generate_referral_code(NEW.id);
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para procesar un nuevo referido
CREATE OR REPLACE FUNCTION public.process_new_referral()
RETURNS TRIGGER AS $$
    SET search_path = public, extensions, pg_temp;
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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para actualizar el total de referidos de un usuario
CREATE OR REPLACE FUNCTION public.update_total_referrals()
RETURNS TRIGGER AS $$
    SET search_path = public, extensions, pg_temp;
DECLARE
    referrer_user_id UUID;
BEGIN
    -- Si se inserta un nuevo registro de referido
    IF TG_OP = 'INSERT' THEN
        SELECT id INTO referrer_user_id FROM public.users WHERE referral_code = NEW.referrer_code;
        IF referrer_user_id IS NOT NULL THEN
            UPDATE public.users SET total_referrals = total_referrals + 1 WHERE id = referrer_user_id;
        END IF;
    -- Si se elimina un registro de referido
    ELSIF TG_OP = 'DELETE' THEN
        SELECT id INTO referrer_user_id FROM public.users WHERE referral_code = OLD.referrer_code;
        IF referrer_user_id IS NOT NULL THEN
            UPDATE public.users SET total_referrals = total_referrals - 1 WHERE id = referrer_user_id;
        END IF;
    END IF;
    RETURN NULL; -- Los triggers AFTER no necesitan retornar un registro
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para recalcular todos los totales de referidos (para mantenimiento)
CREATE OR REPLACE FUNCTION public.recalculate_all_total_referrals()
RETURNS VOID AS $$
    SET search_path = public, extensions, pg_temp;
BEGIN
    UPDATE public.users u
    SET total_referrals = (
        SELECT COUNT(*)
        FROM public.referral_history rh
        WHERE rh.referrer_code = u.referral_code
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener el nivel de un usuario
CREATE OR REPLACE FUNCTION public.get_user_level(user_id UUID)
RETURNS TEXT AS $$
    SET search_path = public, extensions, pg_temp;
DECLARE
    user_level TEXT;
BEGIN
    SELECT level INTO user_level FROM public.users WHERE id = user_id;
    RETURN user_level;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para verificar el estado de fundador de un usuario
CREATE OR REPLACE FUNCTION public.check_founder_status(user_id UUID)
RETURNS BOOLEAN AS $$
    SET search_path = public, extensions, pg_temp;
DECLARE
    user_email TEXT;
BEGIN
    SELECT email INTO user_email FROM public.users WHERE id = user_id;
    RETURN user_email LIKE '%@cryptoforce.com%';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para configurar fundadores de CryptoForce (ejecución única)
CREATE OR REPLACE FUNCTION public.setup_cryptoforce_founders()
RETURNS VOID AS $$
    SET search_path = public, extensions, pg_temp;
BEGIN
    UPDATE public.users
    SET level = 'founder'
    WHERE email LIKE '%@cryptoforce.com%' AND level != 'founder';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para asegurar el nivel de fundador
CREATE OR REPLACE FUNCTION public.ensure_founder_level()
RETURNS TRIGGER AS $$
    SET search_path = public, extensions, pg_temp;
BEGIN
    IF NEW.email LIKE '%@cryptoforce.com%' THEN
        NEW.level = 'founder';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para proteger el nivel de maestro
CREATE OR REPLACE FUNCTION public.protect_maestro_level()
RETURNS TRIGGER AS $$
    SET search_path = public, extensions, pg_temp;
BEGIN
    IF OLD.level = 'maestro' AND NEW.level != 'maestro' THEN
        RAISE EXCEPTION 'Cannot demote a maestro directly.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para proteger el nivel de fundador/maestro
CREATE OR REPLACE FUNCTION public.protect_founder_maestro_level()
RETURNS TRIGGER AS $$
    SET search_path = public, extensions, pg_temp;
BEGIN
    IF OLD.level IN ('founder', 'maestro') AND NEW.level NOT IN ('founder', 'maestro') THEN
        RAISE EXCEPTION 'Cannot demote a founder or maestro directly.';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para actualizar un usuario a maestro
CREATE OR REPLACE FUNCTION public.update_user_to_maestro(target_user_id UUID)
RETURNS VOID AS $$
    SET search_path = public, extensions, pg_temp;
BEGIN
    UPDATE public.users
    SET level = 'maestro'
    WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para asignar automáticamente el nivel de maestro
CREATE OR REPLACE FUNCTION public.auto_assign_maestro_level()
RETURNS TRIGGER AS $$
    SET search_path = public, extensions, pg_temp;
BEGIN
    IF NEW.total_referrals >= 10 AND NEW.level = 'acolito' THEN -- Ejemplo: 10 referidos para ser maestro
        NEW.level = 'maestro';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para registrar accesos (comentada porque la tabla no existe)
-- CREATE OR REPLACE FUNCTION public.log_access()
-- RETURNS TRIGGER AS $$
--     SET search_path = public, extensions, pg_temp;
-- BEGIN
--     INSERT INTO public.user_access_logs (user_id, accessed_at, ip_address)
--     VALUES (NEW.id, NOW(), '0.0.0.0'); -- Placeholder IP, idealmente se obtendría de la solicitud
--     RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para verificar si un usuario puede editar a otro
CREATE OR REPLACE FUNCTION public.can_edit_user(target_user_id UUID)
RETURNS BOOLEAN AS $$
    SET search_path = public, extensions, pg_temp;
DECLARE
    current_user_level TEXT;
    target_user_level TEXT;
BEGIN
    SELECT level INTO current_user_level FROM public.users WHERE id = auth.uid();
    SELECT level INTO target_user_level FROM public.users WHERE id = target_user_id;

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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para verificar si un usuario puede acceder a los datos de otro
CREATE OR REPLACE FUNCTION public.can_access_user_data(target_user_id UUID)
RETURNS BOOLEAN AS $$
    SET search_path = public, extensions, pg_temp;
DECLARE
    current_user_level TEXT;
    target_user_level TEXT;
BEGIN
    SELECT level INTO current_user_level FROM public.users WHERE id = auth.uid();
    SELECT level INTO target_user_level FROM public.users WHERE id = target_user_id;

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
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para generar un enlace de registro (ejemplo)
CREATE OR REPLACE FUNCTION public.generate_registration_link(input_code TEXT)
RETURNS TEXT AS $$
    SET search_path = public, extensions, pg_temp;
BEGIN
    RETURN 'https://cryptoforce.com/register?ref=' || input_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para actualizar todos los códigos de referido de CryptoForce (mantenimiento)
CREATE OR REPLACE FUNCTION public.update_all_cryptoforce_referral_codes()
RETURNS VOID AS $$
    SET search_path = public, extensions, pg_temp;
DECLARE
    user_record RECORD;
BEGIN
    FOR user_record IN SELECT id, email FROM public.users LOOP
        IF user_record.email LIKE '%@cryptoforce.com%' THEN
            UPDATE public.users
            SET referral_code = public.generate_cryptoforce_referral_code()
            WHERE id = user_record.id;
        END IF;
    END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para actualizar la columna updated_at (genérica)
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
    SET search_path = public, extensions, pg_temp;
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para obtener estadísticas de referidos de un usuario
CREATE OR REPLACE FUNCTION public.get_user_referral_stats(user_id UUID)
RETURNS TABLE (
    total_referrals BIGINT,
    founder_referrals BIGINT,
    maestro_referrals BIGINT,
    acolito_referrals BIGINT
) AS $$
    SET search_path = public, extensions, pg_temp;
BEGIN
    RETURN QUERY
    SELECT
        COUNT(rh.id) AS total_referrals,
        COUNT(CASE WHEN u_referred.level = 'founder' THEN 1 END) AS founder_referrals,
        COUNT(CASE WHEN u_referred.level = 'maestro' THEN 1 END) AS maestro_referrals,
        COUNT(CASE WHEN u_referred.level = 'acolito' THEN 1 END) AS acolito_referrals
    FROM
        public.referral_history rh
    JOIN
        public.users u_referrer ON rh.referrer_code = u_referrer.referral_code
    LEFT JOIN
        public.users u_referred ON rh.referred_code = u_referred.referral_code -- Asumiendo que referral_history tiene referred_code
    WHERE
        u_referrer.id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para verificar si un usuario es maestro
CREATE OR REPLACE FUNCTION public.is_maestro(user_id UUID)
RETURNS BOOLEAN AS $$
    SET search_path = public, extensions, pg_temp;
DECLARE
    user_level TEXT;
BEGIN
    SELECT level INTO user_level FROM public.users WHERE id = user_id;
    RETURN user_level = 'maestro' OR user_level = 'founder';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- =====================================================
-- 4. RECREAR TRIGGERS
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

-- Trigger para manejar nuevos usuarios (asignar código de referido, nivel, etc.)
CREATE TRIGGER auto_handle_new_user
AFTER INSERT ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.handle_new_user();

-- Trigger para actualizar el código de referido si cambia el nickname
CREATE TRIGGER update_referral_code_on_nickname_change_trigger
BEFORE UPDATE OF nickname ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.update_referral_code_on_nickname_change();

-- Trigger para procesar nuevos referidos
CREATE TRIGGER process_new_referral_trigger
AFTER INSERT ON public.referral_history
FOR EACH ROW
EXECUTE FUNCTION public.process_new_referral();

-- Trigger para proteger el nivel de maestro
CREATE TRIGGER protect_maestro_level_trigger
BEFORE UPDATE OF level ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.protect_maestro_level();

-- Trigger para proteger el nivel de fundador/maestro
CREATE TRIGGER protect_founder_maestro_level_trigger
BEFORE UPDATE OF level ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.protect_founder_maestro_level();

-- Trigger para asegurar el nivel de fundador
CREATE TRIGGER ensure_founder_level_trigger
BEFORE INSERT OR UPDATE OF email ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.ensure_founder_level();

-- Trigger para asignar automáticamente el nivel de maestro
CREATE TRIGGER auto_assign_maestro_level_trigger
BEFORE UPDATE OF total_referrals ON public.users
FOR EACH ROW
EXECUTE FUNCTION public.auto_assign_maestro_level();

-- Trigger para registrar accesos de usuarios (comentado porque la tabla no existe)
-- CREATE TRIGGER log_user_access_trigger
-- AFTER INSERT ON public.users
-- FOR EACH ROW
-- EXECUTE FUNCTION public.log_access();

-- =====================================================
-- 5. HABILITAR RLS EN TABLAS PÚBLICAS
-- =====================================================

-- Habilitar RLS en la tabla referral_history
ALTER TABLE public.referral_history ENABLE ROW LEVEL SECURITY;

-- Crear política para que los usuarios puedan ver su propio historial de referidos
CREATE POLICY "Users can view their own referral history" ON public.referral_history
    FOR SELECT USING (
        EXISTS (
            SELECT 1
            FROM public.users u
            WHERE u.id = auth.uid() AND u.referral_code = referral_history.referrer_code
        )
    );

-- Crear política para que los usuarios puedan insertar su propio historial de referidos
CREATE POLICY "Users can insert their own referral history" ON public.referral_history
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1
            FROM public.users u
            WHERE u.id = auth.uid() AND u.referral_code = referral_history.referrer_code
        )
    );

-- Crear política para que los usuarios puedan actualizar su propio historial de referidos
CREATE POLICY "Users can update their own referral history" ON public.referral_history
    FOR UPDATE USING (
        EXISTS (
            SELECT 1
            FROM public.users u
            WHERE u.id = auth.uid() AND u.referral_code = referral_history.referrer_code
        )
    ) WITH CHECK (
        EXISTS (
            SELECT 1
            FROM public.users u
            WHERE u.id = auth.uid() AND u.referral_code = referral_history.referrer_code
        )
    );

-- Crear política para que los usuarios puedan eliminar su propio historial de referidos
CREATE POLICY "Users can delete their own referral history" ON public.referral_history
    FOR DELETE USING (
        EXISTS (
            SELECT 1
            FROM public.users u
            WHERE u.id = auth.uid() AND u.referral_code = referral_history.referrer_code
        )
    );

-- RLS para la tabla 'users' (los usuarios pueden ver sus propios datos)
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own data" ON public.users
    FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update their own data" ON public.users
    FOR UPDATE USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- RLS para la tabla 'user_access_logs' (comentado porque la tabla no existe)
-- ALTER TABLE public.user_access_logs ENABLE ROW LEVEL SECURITY;
-- 
-- CREATE POLICY "Users can view their own access logs" ON public.user_access_logs
--     FOR SELECT USING (user_id = auth.uid());
