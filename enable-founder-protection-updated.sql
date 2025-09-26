-- Script para reactivar la protección de fundadores con la nueva lógica
-- Permite edición entre fundadores pero protege campos críticos

-- 1. Crear función de protección actualizada
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
        
        -- Verificar si se está intentando cambiar el total_referrals (no editable)
        IF OLD.total_referrals != NEW.total_referrals THEN
            RAISE EXCEPTION 'PROTECCIÓN FUNDADOR: No se puede modificar el total de referidos del usuario % (campo calculado automáticamente)', OLD.email;
        END IF;
    END IF;
    
    -- Verificar que no se pueda asignar nivel 0 (Fundador) a usuarios no autorizados
    IF NEW.user_level = 0 AND NEW.email NOT IN ('coeurdeluke.js@gmail.com', 'infocryptoforce@gmail.com') THEN
        RAISE EXCEPTION 'PROTECCIÓN FUNDADOR: No se puede asignar nivel Fundador a usuarios no autorizados. Solo coeurdeluke.js@gmail.com e infocryptoforce@gmail.com pueden ser fundadores';
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Crear trigger con la nueva lógica
CREATE TRIGGER founder_protection_trigger
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION check_founder_protection();

-- 3. Verificar que la protección esté activa
SELECT 'Protección reactivada con nueva lógica' as status;
SELECT 
    trigger_name,
    event_manipulation,
    action_timing
FROM information_schema.triggers 
WHERE trigger_name = 'founder_protection_trigger';

-- 4. Mostrar el estado de los usuarios fundadores
SELECT 'Estado de usuarios fundadores' as check_type;
SELECT 
    email,
    nickname,
    user_level,
    referral_code,
    total_referrals,
    'PROTEGIDO - Campos críticos inmutables' as protection_status
FROM public.users 
WHERE email IN ('coeurdeluke.js@gmail.com', 'infocryptoforce@gmail.com')
ORDER BY email;
