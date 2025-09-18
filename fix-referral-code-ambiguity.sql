-- =====================================================
-- CORRECCIÓN DE AMBIGÜEDAD EN FUNCIÓN generate_registration_link
-- =====================================================
-- Este script corrige el error de ambigüedad de nombres

-- Corregir la función generate_registration_link
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

-- Verificar que la función se corrigió
SELECT generate_registration_link('CRYPTOFORCE_LUKE') as test_link;

-- Mostrar todas las funciones relacionadas con referidos
SELECT 
    routine_name,
    routine_type,
    data_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name LIKE '%referral%'
ORDER BY routine_name;
