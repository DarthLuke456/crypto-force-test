-- Script para crear protección inmutable para usuarios fundadores
-- Los usuarios fundadores no podrán modificar su nivel, incluso ellos mismos

-- 1. Crear función para validar cambios de nivel de usuarios fundadores
CREATE OR REPLACE FUNCTION check_founder_protection()
RETURNS TRIGGER AS $$
BEGIN
    -- Lista de emails de usuarios fundadores protegidos
    IF OLD.email IN ('coeurdeluke.js@gmail.com', 'infocryptoforce@gmail.com') THEN
        -- Verificar si se está intentando cambiar el user_level
        IF OLD.user_level != NEW.user_level THEN
            RAISE EXCEPTION 'PROTECCIÓN FUNDADOR: No se puede modificar el nivel del usuario fundador %', OLD.email;
        END IF;
        
        -- Verificar si se está intentando cambiar el referral_code
        IF OLD.referral_code != NEW.referral_code THEN
            RAISE EXCEPTION 'PROTECCIÓN FUNDADOR: No se puede modificar el código de referido del usuario fundador %', OLD.email;
        END IF;
        
        -- Verificar si se está intentando cambiar el nickname (opcional, pero recomendado)
        IF OLD.nickname != NEW.nickname THEN
            RAISE EXCEPTION 'PROTECCIÓN FUNDADOR: No se puede modificar el nickname del usuario fundador %', OLD.email;
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Crear trigger para aplicar la protección
DROP TRIGGER IF EXISTS founder_protection_trigger ON public.users;
CREATE TRIGGER founder_protection_trigger
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION check_founder_protection();

-- 3. Crear función para verificar el estado de protección
CREATE OR REPLACE FUNCTION check_founder_protection_status()
RETURNS TABLE(
    email VARCHAR(255),
    nickname VARCHAR(255),
    user_level INTEGER,
    referral_code VARCHAR(255),
    protection_status VARCHAR(255)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        u.email::VARCHAR(255),
        u.nickname::VARCHAR(255),
        u.user_level,
        u.referral_code::VARCHAR(255),
        CASE 
            WHEN u.email IN ('coeurdeluke.js@gmail.com', 'infocryptoforce@gmail.com') 
            THEN 'PROTEGIDO - Inmutable'::VARCHAR(255)
            ELSE 'NO PROTEGIDO'::VARCHAR(255)
        END as protection_status
    FROM public.users u
    WHERE u.email IN ('coeurdeluke.js@gmail.com', 'infocryptoforce@gmail.com')
    ORDER BY u.email;
END;
$$ LANGUAGE plpgsql;

-- 4. Verificar que la protección esté activa
SELECT * FROM check_founder_protection_status();

-- 5. Crear función para desactivar temporalmente la protección (solo para administradores)
CREATE OR REPLACE FUNCTION disable_founder_protection()
RETURNS TEXT AS $$
BEGIN
    DROP TRIGGER IF EXISTS founder_protection_trigger ON public.users;
    RETURN 'Protección de fundadores desactivada temporalmente';
END;
$$ LANGUAGE plpgsql;

-- 6. Crear función para reactivar la protección
CREATE OR REPLACE FUNCTION enable_founder_protection()
RETURNS TEXT AS $$
BEGIN
    DROP TRIGGER IF EXISTS founder_protection_trigger ON public.users;
    CREATE TRIGGER founder_protection_trigger
        BEFORE UPDATE ON public.users
        FOR EACH ROW
        EXECUTE FUNCTION check_founder_protection();
    RETURN 'Protección de fundadores reactivada';
END;
$$ LANGUAGE plpgsql;

-- 7. Verificar que los triggers estén activos
SELECT 
    trigger_name,
    event_manipulation,
    action_timing,
    action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'founder_protection_trigger';
