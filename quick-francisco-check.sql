-- Verificación rápida del estado de Francisco
SELECT 
    email,
    nombre,
    apellido,
    nickname,
    user_level,
    referral_code,
    total_referrals,
    referred_by
FROM public.users 
WHERE email = 'infocryptoforce@gmail.com';
