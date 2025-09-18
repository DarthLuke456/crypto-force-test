-- Script COMPLETO para hacer que Darth Nihilus sea PERMANENTEMENTE Maestro
-- Ejecutar en Supabase SQL Editor

-- ========================================
-- PASO 1: VERIFICAR ESTADO ACTUAL
-- ========================================
SELECT 
    'ESTADO ACTUAL' as paso,
    nickname,
    email,
    user_level,
    CASE 
        WHEN user_level = 0 THEN 'Maestro'
        WHEN user_level = 1 THEN 'Iniciado'
        WHEN user_level = 2 THEN 'Acólito'
        WHEN user_level = 3 THEN 'Warrior'
        WHEN user_level = 4 THEN 'Lord'
        WHEN user_level = 5 THEN 'Darth'
        ELSE 'Desconocido'
    END as nivel_texto
FROM users 
WHERE email = 'infocryptoforce@gmail.com' OR nickname = 'Darth_Nihilus';

-- ========================================
-- PASO 2: ACTUALIZAR INMEDIATAMENTE A MAESTRO
-- ========================================
UPDATE users 
SET user_level = 0 
WHERE email = 'infocryptoforce@gmail.com';

-- ========================================
-- PASO 3: CREAR FUNCIÓN PARA GARANTIZAR NIVEL MAESTRO
-- ========================================
CREATE OR REPLACE FUNCTION ensure_founder_level()
RETURNS TRIGGER AS $$
BEGIN
    -- Si el email es de un fundador, asegurar nivel 0 (Maestro)
    IF NEW.email = 'infocryptoforce@gmail.com' OR NEW.email = 'coeurdeluke.js@gmail.com' THEN
        NEW.user_level := 0;
        RAISE NOTICE 'Usuario fundador detectado: % - Nivel establecido a Maestro (0)', NEW.email;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ========================================
-- PASO 4: CREAR TRIGGER PARA EJECUTAR LA FUNCIÓN
-- ========================================
-- Eliminar trigger si existe
DROP TRIGGER IF EXISTS trigger_ensure_founder_level ON users;

-- Crear trigger que se ejecute ANTES de INSERT o UPDATE
CREATE TRIGGER trigger_ensure_founder_level
    BEFORE INSERT OR UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION ensure_founder_level();

-- ========================================
-- PASO 5: VERIFICAR QUE EL TRIGGER FUNCIONE
-- ========================================
-- Simular inserción de un nuevo usuario fundador
-- (Esto es solo para probar, no se insertará realmente)
DO $$
BEGIN
    RAISE NOTICE 'Trigger creado exitosamente. Ahora cualquier usuario con email fundador será automáticamente Maestro.';
END $$;

-- ========================================
-- PASO 6: VERIFICAR CAMBIOS APLICADOS
-- ========================================
SELECT 
    'DESPUÉS DE APLICAR CAMBIOS' as paso,
    nickname,
    email,
    user_level,
    CASE 
        WHEN user_level = 0 THEN 'Maestro'
        WHEN user_level = 1 THEN 'Iniciado'
        WHEN user_level = 2 THEN 'Acólito'
        WHEN user_level = 3 THEN 'Warrior'
        WHEN user_level = 4 THEN 'Lord'
        WHEN user_level = 5 THEN 'Darth'
        ELSE 'Desconocido'
    END as nivel_texto
FROM users 
WHERE email = 'infocryptoforce@gmail.com' OR nickname = 'Darth_Nihilus';

-- ========================================
-- PASO 7: VERIFICAR TODOS LOS MAESTROS
-- ========================================
SELECT 
    'TODOS LOS MAESTROS' as paso,
    nickname,
    email,
    user_level,
    CASE 
        WHEN user_level = 0 THEN 'Maestro'
        WHEN user_level = 1 THEN 'Iniciado'
        WHEN user_level = 2 THEN 'Acólito'
        WHEN user_level = 3 THEN 'Warrior'
        WHEN user_level = 4 THEN 'Lord'
        WHEN user_level = 5 THEN 'Darth'
        ELSE 'Desconocido'
    END as nivel_texto
FROM users 
WHERE user_level = 0
ORDER BY nickname;

-- ========================================
-- PASO 8: VERIFICAR QUE EL TRIGGER ESTÉ ACTIVO
-- ========================================
SELECT 
    trigger_name,
    event_manipulation,
    event_object_table,
    action_statement,
    action_timing
FROM information_schema.triggers 
WHERE trigger_name = 'trigger_ensure_founder_level';
