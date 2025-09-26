-- Diagnóstico completo del problema de visualización de Francisco
-- Verificar estado actual en la base de datos

-- 1. Verificar estado actual de Francisco
SELECT 
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

-- 2. Verificar todos los usuarios y sus niveles
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
ORDER BY user_level ASC, email ASC;

-- 3. Verificar si hay usuarios duplicados
SELECT 
    email,
    COUNT(*) as count,
    STRING_AGG(id::text, ', ') as ids,
    STRING_AGG(user_level::text, ', ') as levels
FROM public.users 
GROUP BY email 
HAVING COUNT(*) > 1;

-- 4. Verificar referencias de Francisco
SELECT 
    u.email as user_email,
    u.nickname as user_nickname,
    u.user_level as user_level,
    u.referred_by,
    r.email as referrer_email,
    r.nickname as referrer_nickname,
    r.user_level as referrer_level
FROM public.users u
LEFT JOIN public.users r ON u.referred_by = r.id
WHERE u.email = 'infocryptoforce@gmail.com' OR r.email = 'infocryptoforce@gmail.com';

-- 5. Verificar si Francisco tiene referidos
SELECT 
    referrer.email as referrer_email,
    referrer.nickname as referrer_nickname,
    referrer.user_level as referrer_level,
    COUNT(referred.id) as total_referidos
FROM public.users referrer
LEFT JOIN public.users referred ON referrer.id = referred.referred_by
WHERE referrer.email = 'infocryptoforce@gmail.com'
GROUP BY referrer.id, referrer.email, referrer.nickname, referrer.user_level;
