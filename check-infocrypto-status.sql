-- Verificar el estado actual de infocryptoforce@gmail.com
SELECT 
    id,
    email,
    nombre,
    apellido,
    nickname,
    user_level,
    referral_code,
    total_referrals,
    referred_by,
    created_at,
    updated_at
FROM public.users 
WHERE email = 'infocryptoforce@gmail.com';

-- Verificar también coeurdeluke.js@gmail.com para comparar
SELECT 
    id,
    email,
    nombre,
    apellido,
    nickname,
    user_level,
    referral_code,
    total_referrals,
    referred_by,
    created_at,
    updated_at
FROM public.users 
WHERE email = 'coeurdeluke.js@gmail.com';
