-- Verificar el estado actual de la biografía y códigos de referido
SELECT 
    email,
    nombre,
    apellido,
    nickname,
    bio,
    referral_code,
    user_level,
    updated_at
FROM users 
WHERE email IN ('coeurdeluke.js@gmail.com', 'infocryptoforce@gmail.com')
ORDER BY email;
