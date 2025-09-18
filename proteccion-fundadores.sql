-- =====================================================
-- PROTECCIÓN DE FUNDADORES EN LA BASE DE DATOS
-- =====================================================
-- Este script implementa protección adicional para que los fundadores
-- no puedan ser modificados por otros usuarios
-- Ejecutar en Supabase SQL Editor

-- =====================================================
-- PASO 1: CREAR FUNCIÓN DE VALIDACIÓN
-- =====================================================

CREATE OR REPLACE FUNCTION validate_founder_protection()
RETURNS TRIGGER AS $$
DECLARE
    current_user_email TEXT;
    target_user_level INTEGER;
BEGIN
    -- Obtener el email del usuario que está haciendo la modificación
    current_user_email := current_setting('request.jwt.claims', true)::json->>'email';
    
    -- Si no hay usuario autenticado, permitir (para operaciones del sistema)
    IF current_user_email IS NULL THEN
        RETURN NEW;
    END IF;
    
    -- Obtener el nivel del usuario que se está modificando
    target_user_level := NEW.user_level;
    
    -- PROTECCIÓN: Si se está intentando cambiar a nivel 0 (Fundador)
    IF target_user_level = 0 THEN
        -- Verificar que solo Darth Luke y Darth Nihilus puedan ser fundadores
        IF NEW.email NOT IN ('coeurdeluke.js@gmail.com', 'infocryptoforce@gmail.com') THEN
            RAISE EXCEPTION '❌ ACCESO DENEGADO: Solo Darth Luke y Darth Nihilus pueden ser fundadores';
        END IF;
        
        -- Verificar que el usuario que hace el cambio sea el mismo fundador
        IF current_user_email != NEW.email THEN
            RAISE EXCEPTION '❌ ACCESO DENEGADO: Los fundadores no pueden modificar datos de otros fundadores';
        END IF;
    END IF;
    
    -- PROTECCIÓN: Si se está intentando cambiar el nivel de un fundador existente
    IF OLD.user_level = 0 AND NEW.user_level != 0 THEN
        RAISE EXCEPTION '❌ ACCESO DENEGADO: El nivel de Fundador no puede ser degradado';
    END IF;
    
    -- PROTECCIÓN: Si se está intentando cambiar el email de un fundador
    IF OLD.user_level = 0 AND OLD.email != NEW.email THEN
        RAISE EXCEPTION '❌ ACCESO DENEGADO: El email de un fundador no puede ser modificado';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- PASO 2: CREAR TRIGGER PARA PROTECCIÓN
-- =====================================================

-- Eliminar trigger existente si existe
DROP TRIGGER IF EXISTS trigger_protect_founders ON users;

-- Crear trigger para proteger fundadores
CREATE TRIGGER trigger_protect_founders
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION validate_founder_protection();

-- =====================================================
-- PASO 3: CREAR FUNCIÓN PARA VERIFICAR PERMISOS
-- =====================================================

CREATE OR REPLACE FUNCTION can_edit_user(target_user_email TEXT)
RETURNS BOOLEAN AS $$
DECLARE
    current_user_email TEXT;
    current_user_level INTEGER;
    target_user_level INTEGER;
BEGIN
    -- Obtener el email del usuario autenticado
    current_user_email := current_setting('request.jwt.claims', true)::json->>'email';
    
    -- Si no hay usuario autenticado, denegar
    IF current_user_email IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Obtener el nivel del usuario autenticado
    SELECT user_level INTO current_user_level
    FROM users 
    WHERE email = current_user_email;
    
    -- Si no se encuentra el usuario autenticado, denegar
    IF current_user_level IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Obtener el nivel del usuario objetivo
    SELECT user_level INTO target_user_level
    FROM users 
    WHERE email = target_user_email;
    
    -- Si no se encuentra el usuario objetivo, denegar
    IF target_user_level IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- REGLAS DE PERMISO:
    
    -- 1. Los fundadores solo pueden editar sus propios datos
    IF current_user_level = 0 THEN
        RETURN current_user_email = target_user_email;
    END IF;
    
    -- 2. Los maestros pueden editar usuarios de nivel inferior
    IF current_user_level = 6 THEN
        RETURN target_user_level < 6;
    END IF;
    
    -- 3. Otros niveles no pueden editar usuarios
    RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- PASO 4: VERIFICAR IMPLEMENTACIÓN
-- =====================================================

-- Verificar que la función existe
SELECT 
    'FUNCIÓN DE VALIDACIÓN' as section,
    proname as nombre_funcion,
    prosrc as codigo
FROM pg_proc 
WHERE proname = 'validate_founder_protection';

-- Verificar que el trigger existe
SELECT 
    'TRIGGER DE PROTECCIÓN' as section,
    tgname as nombre_trigger,
    tgrelid::regclass as tabla,
    tgfoid::regproc as funcion
FROM pg_trigger 
WHERE tgname = 'trigger_protect_founders';

-- Verificar función de permisos
SELECT 
    'FUNCIÓN DE PERMISOS' as section,
    proname as nombre_funcion,
    prosrc as codigo
FROM pg_proc 
WHERE proname = 'can_edit_user';

-- =====================================================
-- PASO 5: PRUEBAS DE PROTECCIÓN
-- =====================================================

-- NOTA: Estas pruebas deben ejecutarse con diferentes usuarios autenticados
-- para verificar que la protección funciona correctamente

-- Ejemplo de uso de la función de permisos:
-- SELECT can_edit_user('coeurdeluke.js@gmail.com');

-- =====================================================
-- RESUMEN DE PROTECCIÓN IMPLEMENTADA
-- =====================================================
/*
✅ PROTECCIÓN COMPLETA DE FUNDADORES:

1. TRIGGER DE BASE DE DATOS:
   - ✅ Previene cambios de nivel a Fundador por usuarios no autorizados
   - ✅ Previene degradación de fundadores existentes
   - ✅ Previene cambio de email de fundadores

2. FUNCIÓN DE VALIDACIÓN:
   - ✅ Solo Darth Luke y Darth Nihilus pueden ser fundadores
   - ✅ Los fundadores solo pueden modificar sus propios datos
   - ✅ No se puede cambiar el nivel de fundador a otro nivel

3. FUNCIÓN DE PERMISOS:
   - ✅ Verifica si un usuario puede editar a otro
   - ✅ Los fundadores solo pueden editar sus propios datos
   - ✅ Los maestros pueden editar usuarios de nivel inferior

4. PROTECCIÓN EN FRONTEND:
   - ✅ Dropdown deshabilitado para fundadores
   - ✅ Mensaje de advertencia para fundadores
   - ✅ Prevención de edición entre fundadores

RESULTADO:
- ❌ Darth Luke NO puede editar Darth Nihilus
- ❌ Darth Nihilus NO puede editar Darth Luke
- ✅ Darth Luke puede editar solo sus propios datos
- ✅ Darth Nihilus puede editar solo sus propios datos
- ✅ Los maestros pueden editar usuarios de nivel inferior
*/
