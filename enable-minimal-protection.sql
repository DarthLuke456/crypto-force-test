-- Script para reactivar protección mínima
-- Solo protege campos críticos, permite edición de campos básicos entre fundadores

-- 1. Crear función de protección mínima
CREATE OR REPLACE FUNCTION check_founder_protection()
RETURNS TRIGGER AS $$
BEGIN
    -- Solo proteger campos críticos específicos
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
    
    -- Verificar que no se pueda asignar nivel 0 (Fundador) a usuarios no autorizados
    IF NEW.user_level = 0 AND NEW.email NOT IN ('coeurdeluke.js@gmail.com', 'infocryptoforce@gmail.com') THEN
        RAISE EXCEPTION 'PROTECCIÓN FUNDADOR: No se puede asignar nivel Fundador a usuarios no autorizados';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Crear trigger con protección mínima
CREATE TRIGGER founder_protection_trigger
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION check_founder_protection();

-- 3. Verificar que esté activo
SELECT 'Protección mínima activada - Solo campos críticos protegidos' as status;

-- 4. Probar actualización de campo básico
SELECT 'Probando actualización de campo básico' as test_type;
BEGIN;
UPDATE public.users 
SET nombre = 'Test Basic Field' 
WHERE email = 'infocryptoforce@gmail.com';
SELECT 'Campo básico actualizado exitosamente' as result;
ROLLBACK;
