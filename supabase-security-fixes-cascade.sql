-- =====================================================
-- CORRECCIONES DE SEGURIDAD PARA SUPABASE - VERSIÓN CASCADE
-- =====================================================
-- Este archivo contiene las correcciones necesarias para resolver
-- los problemas de seguridad detectados por el linter de Supabase

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
DROP TRIGGER IF EXISTS validate_founder_protection_trigger ON public.users;
DROP TRIGGER IF EXISTS update_referral_code_on_nickname_change_trigger ON public.users;
DROP TRIGGER IF EXISTS auto_generate_cryptoforce_referral_code_trigger ON public.users;
DROP TRIGGER IF EXISTS update_total_referrals_trigger ON public.referral_history;
DROP TRIGGER IF EXISTS handle_new_user_trigger ON auth.users;

-- Eliminar funciones existentes con CASCADE para eliminar dependencias
DROP FUNCTION IF EXISTS public.generate_registration_link(text) CASCADE;
DROP FUNCTION IF EXISTS public.can_edit_user(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.get_user_level(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.set_updated_at() CASCADE;
DROP FUNCTION IF EXISTS public.setup_cryptoforce_founders() CASCADE;
DROP FUNCTION IF EXISTS public.check_founder_status(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.generate_referral_code(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.is_maestro() CASCADE;
DROP FUNCTION IF EXISTS public.validate_referral_code(text) CASCADE;
DROP FUNCTION IF EXISTS public.generate_standard_referral_code() CASCADE;
DROP FUNCTION IF EXISTS public.get_user_referral_stats(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.ensure_founder_level() CASCADE;
DROP FUNCTION IF EXISTS public.protect_maestro_level() CASCADE;
DROP FUNCTION IF EXISTS public.auto_generate_referral_code() CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at_column() CASCADE;
DROP FUNCTION IF EXISTS public.process_new_referral(text) CASCADE;
DROP FUNCTION IF EXISTS public.recalculate_all_total_referrals() CASCADE;
DROP FUNCTION IF EXISTS public.update_user_to_maestro(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.auto_assign_maestro_level() CASCADE;
DROP FUNCTION IF EXISTS public.log_access(UUID, text) CASCADE;
DROP FUNCTION IF EXISTS public.update_referral_code_on_nickname_change() CASCADE;
DROP FUNCTION IF EXISTS public.auto_generate_cryptoforce_referral_code() CASCADE;
DROP FUNCTION IF EXISTS public.can_access_user_data(UUID) CASCADE;
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.update_updated_at() CASCADE;
DROP FUNCTION IF EXISTS public.update_all_cryptoforce_referral_codes() CASCADE;
DROP FUNCTION IF EXISTS public.validate_founder_protection() CASCADE;
DROP FUNCTION IF EXISTS public.protect_founder_maestro_level() CASCADE;
DROP FUNCTION IF EXISTS public.update_total_referrals() CASCADE;
DROP FUNCTION IF EXISTS public.generate_cryptoforce_referral_code(UUID) CASCADE;

-- =====================================================
-- 2. HABILITAR RLS EN TABLA REFERRAL_HISTORY
-- =====================================================
-- Error: RLS Disabled in Public
-- Tabla: public.referral_history
-- Estructura: Solo referrer_code

-- Habilitar RLS en la tabla
ALTER TABLE public.referral_history ENABLE ROW LEVEL SECURITY;

-- Eliminar políticas existentes si las hay
DROP POLICY IF EXISTS "Users can view their own referral history" ON public.referral_history;
DROP POLICY IF EXISTS "Users can insert their own referral history" ON public.referral_history;
DROP POLICY IF EXISTS "Users can update their own referral history" ON public.referral_history;
DROP POLICY IF EXISTS "Users can delete their own referral history" ON public.referral_history;

-- Crear políticas RLS para referral_history
-- Política para que los usuarios solo vean su propio historial
CREATE POLICY "Users can view their own referral history" ON public.referral_history
    FOR SELECT USING (
        auth.uid() = (SELECT id FROM public.users WHERE referral_code = referrer_code)
    );

-- Política para que los usuarios solo puedan insertar en su propio historial
CREATE POLICY "Users can insert their own referral history" ON public.referral_history
    FOR INSERT WITH CHECK (
        auth.uid() = (SELECT id FROM public.users WHERE referral_code = referrer_code)
    );

-- Política para que los usuarios solo puedan actualizar su propio historial
CREATE POLICY "Users can update their own referral history" ON public.referral_history
    FOR UPDATE USING (
        auth.uid() = (SELECT id FROM public.users WHERE referral_code = referrer_code)
    );

-- Política para que los usuarios solo puedan eliminar su propio historial
CREATE POLICY "Users can delete their own referral history" ON public.referral_history
    FOR DELETE USING (
        auth.uid() = (SELECT id FROM public.users WHERE referral_code = referrer_code)
    );

-- =====================================================
-- 3. CONFIGURAR SEARCH_PATH INMUTABLE EN FUNCIONES
-- =====================================================
-- Warning: Function Search Path Mutable
-- Todas las funciones necesitan tener search_path configurado

-- Función: can_edit_user
CREATE OR REPLACE FUNCTION public.can_edit_user(target_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
    -- Verificar si el usuario actual puede editar el usuario objetivo
    RETURN (
        -- El usuario puede editarse a sí mismo
        auth.uid() = target_user_id
        OR
        -- Los maestros pueden editar usuarios de nivel inferior
        (is_maestro() AND get_user_level(target_user_id) < 6)
    );
END;
$$;

-- Función: get_user_level
CREATE OR REPLACE FUNCTION public.get_user_level(user_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
    user_level INTEGER;
BEGIN
    SELECT COALESCE(level, 1) INTO user_level
    FROM public.users
    WHERE id = user_id;
    
    RETURN COALESCE(user_level, 1);
END;
$$;

-- Función: set_updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Función: setup_cryptoforce_founders
CREATE OR REPLACE FUNCTION public.setup_cryptoforce_founders()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
    -- Configurar fundadores de Crypto Force
    INSERT INTO public.users (id, email, user_level, is_founder, created_at, updated_at)
    VALUES 
        ('00000000-0000-0000-0000-000000000001', 'darth@cryptoforce.com', 6, true, NOW(), NOW()),
        ('00000000-0000-0000-0000-000000000002', 'maestro@cryptoforce.com', 6, true, NOW(), NOW())
    ON CONFLICT (id) DO UPDATE SET
        user_level = EXCLUDED.user_level,
        is_founder = EXCLUDED.is_founder,
        updated_at = NOW();
END;
$$;

-- Función: generate_registration_link
CREATE OR REPLACE FUNCTION public.generate_registration_link(referral_code TEXT)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
    base_url TEXT;
    registration_link TEXT;
BEGIN
    -- Obtener la URL base de la aplicación
    base_url := COALESCE(current_setting('app.settings.base_url', true), 'https://cryptoforce.com');
    
    -- Generar enlace de registro
    registration_link := base_url || '/auth/register?ref=' || referral_code;
    
    RETURN registration_link;
END;
$$;

-- Función: check_founder_status
CREATE OR REPLACE FUNCTION public.check_founder_status(user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
    is_founder BOOLEAN;
BEGIN
    SELECT COALESCE(is_founder, false) INTO is_founder
    FROM public.users
    WHERE id = user_id;
    
    RETURN COALESCE(is_founder, false);
END;
$$;

-- Función: generate_referral_code
CREATE OR REPLACE FUNCTION public.generate_referral_code(user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
    user_nickname TEXT;
    referral_code TEXT;
    counter INTEGER := 1;
    final_code TEXT;
BEGIN
    -- Obtener nickname del usuario
    SELECT nickname INTO user_nickname
    FROM public.users
    WHERE id = user_id;
    
    -- Generar código base
    referral_code := LOWER(REPLACE(user_nickname, ' ', ''));
    
    -- Asegurar unicidad
    LOOP
        final_code := referral_code || counter::TEXT;
        
        -- Verificar si el código ya existe
        IF NOT EXISTS (SELECT 1 FROM public.users WHERE referral_code = final_code) THEN
            EXIT;
        END IF;
        
        counter := counter + 1;
    END LOOP;
    
    RETURN final_code;
END;
$$;

-- Función: is_maestro
CREATE OR REPLACE FUNCTION public.is_maestro()
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
    user_level INTEGER;
BEGIN
    SELECT get_user_level(auth.uid()) INTO user_level;
    RETURN user_level >= 6;
END;
$$;

-- Función: validate_referral_code
CREATE OR REPLACE FUNCTION public.validate_referral_code(code TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.users 
        WHERE referral_code = code 
        AND is_active = true
    );
END;
$$;

-- Función: generate_standard_referral_code
CREATE OR REPLACE FUNCTION public.generate_standard_referral_code()
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
    code TEXT;
    counter INTEGER := 1;
    final_code TEXT;
BEGIN
    -- Generar código base
    code := 'CF' || EXTRACT(EPOCH FROM NOW())::TEXT;
    
    -- Asegurar unicidad
    LOOP
        final_code := code || counter::TEXT;
        
        -- Verificar si el código ya existe
        IF NOT EXISTS (SELECT 1 FROM public.users WHERE referral_code = final_code) THEN
            EXIT;
        END IF;
        
        counter := counter + 1;
    END LOOP;
    
    RETURN final_code;
END;
$$;

-- Función: get_user_referral_stats
CREATE OR REPLACE FUNCTION public.get_user_referral_stats(user_id UUID)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
    stats JSON;
BEGIN
    SELECT json_build_object(
        'total_referrals', COALESCE(total_referrals, 0),
        'active_referrals', COALESCE(active_referrals, 0),
        'referral_code', referral_code,
        'created_at', created_at
    ) INTO stats
    FROM public.users
    WHERE id = user_id;
    
    RETURN COALESCE(stats, '{}'::JSON);
END;
$$;

-- Función: ensure_founder_level
CREATE OR REPLACE FUNCTION public.ensure_founder_level()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
    -- Asegurar que los fundadores mantengan nivel 6
    IF NEW.is_founder = true THEN
        NEW.user_level := 6;
    END IF;
    
    RETURN NEW;
END;
$$;

-- Función: protect_maestro_level
CREATE OR REPLACE FUNCTION public.protect_maestro_level()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
    -- Prevenir que se reduzca el nivel de maestros
    IF OLD.user_level = 6 AND NEW.user_level < 6 THEN
        RAISE EXCEPTION 'No se puede reducir el nivel de un maestro';
    END IF;
    
    RETURN NEW;
END;
$$;

-- Función: auto_generate_referral_code
CREATE OR REPLACE FUNCTION public.auto_generate_referral_code()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
    -- Generar código de referencia automáticamente
    IF NEW.referral_code IS NULL OR NEW.referral_code = '' THEN
        NEW.referral_code := generate_referral_code(NEW.id);
    END IF;
    
    RETURN NEW;
END;
$$;

-- Función: update_updated_at_column
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Función: process_new_referral
CREATE OR REPLACE FUNCTION public.process_new_referral(referrer_code TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
    referrer_id UUID;
BEGIN
    -- Obtener ID del referrer
    SELECT id INTO referrer_id FROM public.users WHERE referral_code = referrer_code;
    
    -- Procesar nueva referencia
    INSERT INTO public.referral_history (referrer_code, created_at)
    VALUES (referrer_code, NOW());
    
    -- Actualizar contadores
    UPDATE public.users 
    SET total_referrals = total_referrals + 1,
        updated_at = NOW()
    WHERE id = referrer_id;
END;
$$;

-- Función: recalculate_all_total_referrals
CREATE OR REPLACE FUNCTION public.recalculate_all_total_referrals()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
    -- Recalcular total de referencias para todos los usuarios
    UPDATE public.users 
    SET total_referrals = (
        SELECT COUNT(*) 
        FROM public.referral_history 
        WHERE referrer_code = users.referral_code
    ),
    updated_at = NOW();
END;
$$;

-- Función: update_user_to_maestro
CREATE OR REPLACE FUNCTION public.update_user_to_maestro(user_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
    -- Actualizar usuario a maestro
    UPDATE public.users 
    SET user_level = 6,
        updated_at = NOW()
    WHERE id = user_id;
END;
$$;

-- Función: auto_assign_maestro_level
CREATE OR REPLACE FUNCTION public.auto_assign_maestro_level()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
    -- Asignar nivel de maestro automáticamente si cumple criterios
    IF NEW.total_referrals >= 10 AND NEW.user_level < 6 THEN
        NEW.user_level := 6;
    END IF;
    
    RETURN NEW;
END;
$$;

-- Función: log_access
CREATE OR REPLACE FUNCTION public.log_access(user_id UUID, action TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
    -- Registrar acceso del usuario
    INSERT INTO public.access_logs (user_id, action, created_at)
    VALUES (user_id, action, NOW());
END;
$$;

-- Función: update_referral_code_on_nickname_change
CREATE OR REPLACE FUNCTION public.update_referral_code_on_nickname_change()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
    -- Actualizar código de referencia cuando cambia el nickname
    IF OLD.nickname != NEW.nickname THEN
        NEW.referral_code := generate_referral_code(NEW.id);
    END IF;
    
    RETURN NEW;
END;
$$;

-- Función: auto_generate_cryptoforce_referral_code
CREATE OR REPLACE FUNCTION public.auto_generate_cryptoforce_referral_code()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
    -- Generar código de referencia Crypto Force
    IF NEW.referral_code IS NULL OR NEW.referral_code = '' THEN
        NEW.referral_code := 'CF' || EXTRACT(EPOCH FROM NOW())::TEXT;
    END IF;
    
    RETURN NEW;
END;
$$;

-- Función: can_access_user_data
CREATE OR REPLACE FUNCTION public.can_access_user_data(target_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
    -- Verificar si el usuario actual puede acceder a los datos del usuario objetivo
    RETURN (
        -- El usuario puede acceder a sus propios datos
        auth.uid() = target_user_id
        OR
        -- Los maestros pueden acceder a datos de usuarios de nivel inferior
        (is_maestro() AND get_user_level(target_user_id) < 6)
    );
END;
$$;

-- Función: handle_new_user
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
    -- Manejar nuevo usuario
    INSERT INTO public.users (id, email, user_level, is_founder, created_at, updated_at)
    VALUES (NEW.id, NEW.email, 1, false, NOW(), NOW());
    
    RETURN NEW;
END;
$$;

-- Función: update_updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Función: update_all_cryptoforce_referral_codes
CREATE OR REPLACE FUNCTION public.update_all_cryptoforce_referral_codes()
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
    -- Actualizar todos los códigos de referencia de Crypto Force
    UPDATE public.users 
    SET referral_code = 'CF' || EXTRACT(EPOCH FROM NOW())::TEXT || id::TEXT,
        updated_at = NOW()
    WHERE referral_code IS NULL OR referral_code = '';
END;
$$;

-- Función: validate_founder_protection
CREATE OR REPLACE FUNCTION public.validate_founder_protection()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
    -- Validar protección de fundadores
    IF OLD.is_founder = true AND NEW.is_founder = false THEN
        RAISE EXCEPTION 'No se puede cambiar el estado de fundador';
    END IF;
    
    RETURN NEW;
END;
$$;

-- Función: protect_founder_maestro_level
CREATE OR REPLACE FUNCTION public.protect_founder_maestro_level()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
BEGIN
    -- Proteger nivel de maestros fundadores
    IF OLD.is_founder = true AND OLD.user_level = 6 AND NEW.user_level < 6 THEN
        RAISE EXCEPTION 'No se puede reducir el nivel de un maestro fundador';
    END IF;
    
    RETURN NEW;
END;
$$;

-- Función: update_total_referrals
CREATE OR REPLACE FUNCTION public.update_total_referrals()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
    referrer_id UUID;
BEGIN
    -- Obtener ID del referrer
    SELECT id INTO referrer_id FROM public.users WHERE referral_code = NEW.referrer_code;
    
    -- Actualizar total de referencias
    UPDATE public.users 
    SET total_referrals = (
        SELECT COUNT(*) 
        FROM public.referral_history 
        WHERE referrer_code = NEW.referrer_code
    ),
    updated_at = NOW()
    WHERE id = referrer_id;
    
    RETURN NEW;
END;
$$;

-- Función: generate_cryptoforce_referral_code
CREATE OR REPLACE FUNCTION public.generate_cryptoforce_referral_code(user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth
AS $$
DECLARE
    code TEXT;
    counter INTEGER := 1;
    final_code TEXT;
BEGIN
    -- Generar código de referencia Crypto Force
    code := 'CF' || EXTRACT(EPOCH FROM NOW())::TEXT;
    
    -- Asegurar unicidad
    LOOP
        final_code := code || counter::TEXT;
        
        -- Verificar si el código ya existe
        IF NOT EXISTS (SELECT 1 FROM public.users WHERE referral_code = final_code) THEN
            EXIT;
        END IF;
        
        counter := counter + 1;
    END LOOP;
    
    RETURN final_code;
END;
$$;

-- =====================================================
-- 4. RECREAR TRIGGERS NECESARIOS
-- =====================================================

-- Trigger para actualizar updated_at en users
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger para actualizar updated_at en referral_history
CREATE TRIGGER update_referral_history_updated_at
    BEFORE UPDATE ON public.referral_history
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- =====================================================
-- 5. MOVER EXTENSIÓN CITEXT DEL SCHEMA PUBLIC
-- =====================================================
-- Warning: Extension in Public
-- Extensión: citext

-- Crear schema para extensiones
CREATE SCHEMA IF NOT EXISTS extensions;

-- Mover extensión citext al schema extensions
ALTER EXTENSION citext SET SCHEMA extensions;

-- =====================================================
-- 6. CONFIGURAR OTP EXPIRY (MENOS DE 1 HORA)
-- =====================================================
-- Warning: Auth OTP long expiry
-- Esto se debe configurar en el dashboard de Supabase:
-- Authentication > Settings > Email > OTP Expiry
-- Configurar a 3600 segundos (1 hora) o menos

-- =====================================================
-- 7. HABILITAR PROTECCIÓN CONTRA CONTRASEÑAS COMPROMETIDAS
-- =====================================================
-- Warning: Leaked Password Protection Disabled
-- Esto se debe configurar en el dashboard de Supabase:
-- Authentication > Settings > Password > Leaked Password Protection
-- Habilitar la opción

-- =====================================================
-- COMENTARIOS FINALES
-- =====================================================
-- 1. Ejecutar este script en el SQL Editor de Supabase
-- 2. Verificar que todas las funciones se crearon correctamente
-- 3. Configurar manualmente en el dashboard:
--    - OTP Expiry: 3600 segundos o menos
--    - Leaked Password Protection: Habilitado
-- 4. Verificar que el linter ya no reporte estos errores



