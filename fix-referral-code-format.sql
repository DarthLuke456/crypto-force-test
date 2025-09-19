-- =====================================================
-- FIX: Cambiar formato de códigos de referido de _ a -
-- =====================================================

-- Actualizar función para generar códigos con guión medio
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
    
    -- Limpiar nickname: solo letras y números, convertir a mayúsculas
    clean_nickname := UPPER(REGEXP_REPLACE(user_nickname, '[^a-zA-Z0-9]', '', 'g'));
    
    -- Crear código base: CRYPTOFORCE + - + NICKNAME completo
    base_code := 'CRYPTOFORCE-' || clean_nickname;
    final_code := base_code;
    
    -- Verificar unicidad y agregar sufijo numérico si es necesario
    WHILE EXISTS(SELECT 1 FROM users WHERE referral_code = final_code) AND counter <= max_attempts LOOP
        final_code := base_code || counter::text;
        counter := counter + 1;
    END LOOP;
    
    -- Si después de intentos sigue existiendo, agregar timestamp
    IF EXISTS(SELECT 1 FROM users WHERE referral_code = final_code) THEN
        final_code := base_code || '-' || EXTRACT(EPOCH FROM NOW())::INTEGER::TEXT;
    END IF;
    
    RETURN final_code;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- ACTUALIZAR CÓDIGOS EXISTENTES
-- =====================================================

-- Actualizar códigos existentes que usan guión bajo por guión medio
UPDATE users 
SET referral_code = REPLACE(referral_code, 'CRYPTOFORCE_', 'CRYPTOFORCE-')
WHERE referral_code LIKE 'CRYPTOFORCE_%';

-- Verificar que se actualizaron correctamente
SELECT 
    email, 
    nickname, 
    referral_code,
    CASE 
        WHEN referral_code LIKE 'CRYPTOFORCE-%' THEN '✅ Formato correcto'
        WHEN referral_code LIKE 'CRYPTOFORCE_%' THEN '❌ Formato incorrecto'
        ELSE '⚠️ Formato desconocido'
    END as status
FROM users 
WHERE referral_code IS NOT NULL
ORDER BY created_at DESC
LIMIT 10;
