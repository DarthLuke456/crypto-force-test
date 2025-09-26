-- Script para desactivar completamente la protección de fundadores
-- Esto permitirá que los fundadores editen la información de cada uno sin restricciones

-- 1. Desactivar el trigger de protección
DROP TRIGGER IF EXISTS founder_protection_trigger ON public.users;

-- 2. Eliminar la función de protección (opcional)
DROP FUNCTION IF EXISTS check_founder_protection();

-- 3. Verificar que no hay triggers activos
SELECT 'Verificando triggers activos' as check_type;
SELECT 
    trigger_name,
    event_manipulation,
    action_timing
FROM information_schema.triggers 
WHERE trigger_name = 'founder_protection_trigger';

-- 4. Mostrar estado de los usuarios
SELECT 'Estado de usuarios fundadores' as check_type;
SELECT 
    email,
    nombre,
    apellido,
    nickname,
    user_level,
    referral_code,
    total_referrals
FROM public.users 
WHERE email IN ('coeurdeluke.js@gmail.com', 'infocryptoforce@gmail.com')
ORDER BY email;

-- 5. Probar actualización para confirmar que funciona
SELECT 'Probando actualización después de desactivar protección' as test_type;
BEGIN;
UPDATE public.users 
SET nombre = 'Test Update Success' 
WHERE email = 'infocryptoforce@gmail.com';
SELECT 'Actualización exitosa - Protección desactivada' as result;
ROLLBACK;
