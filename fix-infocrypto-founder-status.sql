-- Script para corregir infocryptoforce@gmail.com como usuario fundador
-- y arreglar su código de referido

-- 1. Actualizar infocryptoforce@gmail.com para que sea usuario fundador (nivel 0)
UPDATE public.users 
SET 
    user_level = 0,  -- Fundador (mismo nivel que coeurdeluke.js@gmail.com)
    referral_code = 'CRYPTOFORCE_CRYPTOFORCE',  -- Formato correcto con guión bajo
    nickname = 'CryptoForce',  -- Nickname consistente
    nombre = 'Franc',
    apellido = 'CryptoForce',
    updated_at = NOW()
WHERE email = 'infocryptoforce@gmail.com';

-- 2. Verificar que no tenga referidor (los fundadores no tienen referidor)
UPDATE public.users 
SET 
    referred_by = NULL,
    updated_at = NOW()
WHERE email = 'infocryptoforce@gmail.com';

-- 3. Verificar el resultado
SELECT 
    email,
    nombre,
    apellido,
    nickname,
    user_level,
    referral_code,
    total_referrals,
    referred_by,
    updated_at
FROM public.users 
WHERE email = 'infocryptoforce@gmail.com';

-- 4. Verificar que ambos fundadores tengan el mismo nivel
SELECT 
    email,
    nickname,
    user_level,
    referral_code,
    CASE 
        WHEN user_level = 0 THEN 'Fundador'
        WHEN user_level = 1 THEN 'Iniciado'
        WHEN user_level = 2 THEN 'Acólito'
        WHEN user_level = 3 THEN 'Warrior'
        WHEN user_level = 4 THEN 'Lord'
        WHEN user_level = 5 THEN 'Darth'
        WHEN user_level = 6 THEN 'Maestro'
        ELSE 'Desconocido'
    END as nivel_display
FROM public.users 
WHERE email IN ('coeurdeluke.js@gmail.com', 'infocryptoforce@gmail.com')
ORDER BY user_level, email;
