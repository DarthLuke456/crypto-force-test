-- =====================================================
-- SCRIPT DE MIGRACIÓN: ACTUALIZAR CÓDIGOS DE REFERIDO
-- =====================================================
-- Este script migra los códigos existentes del formato CF+NICKNAME 
-- al nuevo formato CRYPTOFORCE_NICKNAME

-- =====================================================
-- PASO 1: VERIFICAR ESTADO ACTUAL
-- =====================================================

-- Mostrar códigos actuales
SELECT 
    'ESTADO ACTUAL DE CÓDIGOS' as section,
    email,
    nickname,
    referral_code,
    user_level,
    CASE 
        WHEN referral_code LIKE 'CF%' THEN 'Formato Antiguo'
        WHEN referral_code LIKE 'CRYPTOFORCE_%' THEN 'Formato Nuevo'
        WHEN referral_code IS NULL THEN 'Sin Código'
        ELSE 'Otro Formato'
    END as formato_actual
FROM users 
ORDER BY created_at;

-- =====================================================
-- PASO 2: FUNCIÓN PARA MIGRAR CÓDIGOS
-- =====================================================

CREATE OR REPLACE FUNCTION migrate_referral_codes()
RETURNS VOID AS $$
DECLARE
    user_record RECORD;
    new_code TEXT;
    migrated_count INTEGER := 0;
    error_count INTEGER := 0;
BEGIN
    RAISE NOTICE '🔄 Iniciando migración de códigos de referido...';
    
    -- Procesar usuarios con formato antiguo (CF+NICKNAME)
    FOR user_record IN 
        SELECT id, email, nickname, referral_code, user_level 
        FROM users 
        WHERE referral_code LIKE 'CF%'
        AND user_level != 0  -- No migrar fundadores
        AND nickname IS NOT NULL 
        AND nickname != ''
    LOOP
        BEGIN
            -- Generar nuevo código
            new_code := 'CRYPTOFORCE_' || UPPER(REGEXP_REPLACE(user_record.nickname, '[^a-zA-Z0-9]', '', 'g'));
            
            -- Verificar que el nuevo código no exista
            IF EXISTS(SELECT 1 FROM users WHERE referral_code = new_code AND id != user_record.id) THEN
                -- Agregar sufijo numérico si hay conflicto
                new_code := new_code || EXTRACT(EPOCH FROM NOW())::INTEGER::TEXT;
            END IF;
            
            -- Actualizar usuario
            UPDATE users 
            SET 
                referral_code = new_code,
                updated_at = now()
            WHERE id = user_record.id;
            
            migrated_count := migrated_count + 1;
            RAISE NOTICE '✅ Migrado: % -> % (Usuario: %)', user_record.referral_code, new_code, user_record.email;
            
        EXCEPTION WHEN OTHERS THEN
            error_count := error_count + 1;
            RAISE NOTICE '❌ Error migrando usuario %: %', user_record.email, SQLERRM;
        END;
    END LOOP;
    
    -- Procesar usuarios sin código
    FOR user_record IN 
        SELECT id, email, nickname, referral_code, user_level 
        FROM users 
        WHERE (referral_code IS NULL OR referral_code = '')
        AND user_level != 0  -- No procesar fundadores
        AND nickname IS NOT NULL 
        AND nickname != ''
    LOOP
        BEGIN
            -- Generar nuevo código
            new_code := 'CRYPTOFORCE_' || UPPER(REGEXP_REPLACE(user_record.nickname, '[^a-zA-Z0-9]', '', 'g'));
            
            -- Verificar que el nuevo código no exista
            IF EXISTS(SELECT 1 FROM users WHERE referral_code = new_code AND id != user_record.id) THEN
                -- Agregar sufijo numérico si hay conflicto
                new_code := new_code || EXTRACT(EPOCH FROM NOW())::INTEGER::TEXT;
            END IF;
            
            -- Actualizar usuario
            UPDATE users 
            SET 
                referral_code = new_code,
                updated_at = now()
            WHERE id = user_record.id;
            
            migrated_count := migrated_count + 1;
            RAISE NOTICE '✅ Generado: % (Usuario: %)', new_code, user_record.email;
            
        EXCEPTION WHEN OTHERS THEN
            error_count := error_count + 1;
            RAISE NOTICE '❌ Error generando código para usuario %: %', user_record.email, SQLERRM;
        END;
    END LOOP;
    
    RAISE NOTICE '🎯 Migración completada: % códigos migrados, % errores', migrated_count, error_count;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- PASO 3: EJECUTAR MIGRACIÓN
-- =====================================================

-- Ejecutar migración
SELECT migrate_referral_codes();

-- =====================================================
-- PASO 4: VERIFICAR RESULTADO
-- =====================================================

-- Mostrar estado después de la migración
SELECT 
    'ESTADO DESPUÉS DE MIGRACIÓN' as section,
    email,
    nickname,
    referral_code,
    user_level,
    CASE 
        WHEN referral_code LIKE 'CF%' THEN 'Formato Antiguo'
        WHEN referral_code LIKE 'CRYPTOFORCE_%' THEN 'Formato Nuevo'
        WHEN referral_code IS NULL THEN 'Sin Código'
        ELSE 'Otro Formato'
    END as formato_actual
FROM users 
ORDER BY created_at;

-- Estadísticas de migración
SELECT 
    'ESTADÍSTICAS DE MIGRACIÓN' as section,
    COUNT(*) as total_usuarios,
    COUNT(CASE WHEN referral_code LIKE 'CRYPTOFORCE_%' THEN 1 END) as formato_nuevo,
    COUNT(CASE WHEN referral_code LIKE 'CF%' THEN 1 END) as formato_antiguo,
    COUNT(CASE WHEN referral_code IS NULL OR referral_code = '' THEN 1 END) as sin_codigo
FROM users;

-- Verificar fundadores
SELECT 
    'VERIFICACIÓN DE FUNDADORES' as section,
    email,
    nickname,
    referral_code,
    user_level
FROM users 
WHERE user_level = 0
ORDER BY created_at;

-- =====================================================
-- PASO 5: LIMPIEZA Y OPTIMIZACIÓN
-- =====================================================

-- Eliminar función de migración (ya no necesaria)
DROP FUNCTION IF EXISTS migrate_referral_codes();

-- Verificar índices
SELECT 
    'VERIFICACIÓN DE ÍNDICES' as section,
    indexname,
    tablename,
    indexdef
FROM pg_indexes 
WHERE tablename = 'users' 
AND indexname LIKE '%referral%';

-- =====================================================
-- PASO 6: VERIFICACIÓN FINAL
-- =====================================================

-- Verificar que todos los usuarios tengan códigos válidos
DO $$
DECLARE
    invalid_users INTEGER;
BEGIN
    SELECT COUNT(*) INTO invalid_users
    FROM users 
    WHERE user_level != 0  -- Excluir fundadores
    AND (referral_code IS NULL OR referral_code = '' OR referral_code NOT LIKE 'CRYPTOFORCE_%');
    
    IF invalid_users > 0 THEN
        RAISE NOTICE '⚠️ ADVERTENCIA: % usuarios sin códigos válidos', invalid_users;
    ELSE
        RAISE NOTICE '✅ Todos los usuarios tienen códigos válidos';
    END IF;
END $$;

SELECT '🚀 Migración de códigos de referido completada exitosamente!' as final_message;
