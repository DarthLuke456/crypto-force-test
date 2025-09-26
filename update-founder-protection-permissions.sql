-- Script para actualizar la protección de fundadores
-- Permite que los fundadores editen información de otros fundadores (excepto campos críticos)

-- 1. Actualizar la función de protección para permitir edición entre fundadores
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
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 2. Verificar que la protección esté activa
SELECT 'Estado de protección actualizado' as check_type;
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

-- 3. Verificar que los triggers estén activos
SELECT 'Triggers de protección activos' as check_type;
SELECT 
    trigger_name,
    event_manipulation,
    action_timing
FROM information_schema.triggers 
WHERE trigger_name = 'founder_protection_trigger';
