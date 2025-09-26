-- Script para desactivar temporalmente la protección de fundadores
-- Esto permite que los fundadores editen la información de cada uno

-- 1. Desactivar el trigger de protección temporalmente
DROP TRIGGER IF EXISTS founder_protection_trigger ON public.users;

-- 2. Verificar que el trigger esté desactivado
SELECT 'Trigger desactivado temporalmente' as status;
SELECT 
    trigger_name,
    event_manipulation,
    action_timing
FROM information_schema.triggers 
WHERE trigger_name = 'founder_protection_trigger';

-- 3. Mostrar el estado actual de los usuarios fundadores
SELECT 'Estado actual de usuarios fundadores' as check_type;
SELECT 
    email,
    nickname,
    user_level,
    referral_code,
    total_referrals,
    'PROTECCIÓN TEMPORALMENTE DESACTIVADA' as protection_status
FROM public.users 
WHERE email IN ('coeurdeluke.js@gmail.com', 'infocryptoforce@gmail.com')
ORDER BY email;

-- 4. Instrucciones para reactivar la protección
SELECT 'Para reactivar la protección, ejecutar:' as instruction;
SELECT 'SELECT enable_founder_protection();' as command;
