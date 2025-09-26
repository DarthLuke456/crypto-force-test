-- Script para reactivar la protección con nueva lógica
-- Permite edición entre fundadores pero protege campos críticos

-- 1. Crear función de protección actualizada
CREATE OR REPLACE FUNCTION check_founder_protection()
RETURNS TRIGGER AS $$
BEGIN
    -- Solo proteger campos críticos, permitir edición de campos básicos entre fundadores
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
        
        -- Verificar si se está intentando cambiar el total_referrals
        IF OLD.total_referrals != NEW.total_referrals THEN
            RAISE EXCEPTION 'PROTECCIÓN FUNDADOR: No se puede modificar el total de referidos del usuario % (campo calculado automáticamente)', OLD.email;
        END IF;
    END IF;
    
    -- Verificar que no se pueda asignar nivel 0 (Fundador) a usuarios no autorizados
    IF NEW.user_level = 0 AND NEW.email NOT IN ('coeurdeluke.js@gmail.com', 'infocryptoforce@gmail.com') THEN
        RAISE EXCEPTION 'PROTECCIÓN FUNDADOR: No se puede asignar nivel Fundador a usuarios no autorizados';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Crear trigger con la nueva lógica
CREATE TRIGGER founder_protection_trigger
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION check_founder_protection();

-- 3. Verificar que esté activo
SELECT 'Protección reactivada - Campos críticos protegidos, campos básicos editables entre fundadores' as status;
