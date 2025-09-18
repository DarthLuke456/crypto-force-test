-- ===============================================================
-- SCRIPT PARA CORREGIR CÓDIGOS DE REFERIDO AL FORMATO CORRECTO
-- ===============================================================

-- Actualizar todos los códigos de referido al nuevo formato CF+NICKNAME
UPDATE users 
SET referral_code = 'CF' || UPPER(REGEXP_REPLACE(nickname, '[^a-zA-Z0-9]', '', 'g'))
WHERE nickname IS NOT NULL 
  AND nickname != ''
  AND (referral_code IS NULL 
       OR referral_code = '' 
       OR referral_code NOT LIKE 'CF%');

-- Específicamente para el usuario Luke
UPDATE users 
SET referral_code = 'CFLUKE'
WHERE email = 'coeurdeluke.js@gmail.com'
  AND nickname = 'Luke';

-- Verificar que los códigos se generaron correctamente
SELECT 
    email, 
    nickname, 
    referral_code,
    CASE 
        WHEN referral_code = 'CF' || UPPER(REGEXP_REPLACE(nickname, '[^a-zA-Z0-9]', '', 'g')) 
        THEN '✅ Correcto' 
        ELSE '❌ Incorrecto' 
    END as status
FROM users 
WHERE nickname IS NOT NULL 
  AND nickname != ''
ORDER BY created_at;

-- Mostrar estadísticas
SELECT 
    COUNT(*) as total_usuarios,
    COUNT(CASE WHEN referral_code LIKE 'CF%' THEN 1 END) as con_codigo_correcto,
    COUNT(CASE WHEN referral_code IS NULL OR referral_code = '' THEN 1 END) as sin_codigo
FROM users;

