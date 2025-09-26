-- Script simplificado para crear protección inmutable para usuarios fundadores
-- Versión corregida sin problemas de tipos de datos

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
        
        -- Verificar si se está intentando cambiar el nickname
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

-- 3. Verificar que los usuarios fundadores existen y están protegidos
SELECT 
    'Estado de usuarios fundadores' as check_type,
    email,
    nickname,
    user_level,
    referral_code,
    'PROTEGIDO - Inmutable' as protection_status
FROM public.users 
WHERE email IN ('coeurdeluke.js@gmail.com', 'infocryptoforce@gmail.com')
ORDER BY email;

-- 4. Crear función para desactivar temporalmente la protección (solo para administradores)
CREATE OR REPLACE FUNCTION disable_founder_protection()
RETURNS TEXT AS $$
BEGIN
    DROP TRIGGER IF EXISTS founder_protection_trigger ON public.users;
    RETURN 'Protección de fundadores desactivada temporalmente';
END;
$$ LANGUAGE plpgsql;

-- 5. Crear función para reactivar la protección
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

-- 6. Verificar que los triggers estén activos
SELECT 
    'Triggers activos' as check_type,
    trigger_name,
    event_manipulation,
    action_timing
FROM information_schema.triggers 
WHERE trigger_name = 'founder_protection_trigger';
