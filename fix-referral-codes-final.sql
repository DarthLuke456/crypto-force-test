-- =====================================================
-- FIX FINAL: Códigos de referido con formato correcto
-- =====================================================

-- 1. Limpiar TODOS los códigos de referido para usar formato correcto
UPDATE users 
SET referral_code = 'CRYPTOFORCE-' || UPPER(REGEXP_REPLACE(nickname, '[^a-zA-Z0-9]', '', 'g'))
WHERE referral_code IS NOT NULL;

-- 2. Manejar casos especiales específicos
UPDATE users 
SET referral_code = 'CRYPTOFORCE-LUKE'
WHERE email = 'coeurdeluke.js@gmail.com';

UPDATE users 
SET referral_code = 'CRYPTOFORCE-DARTHNIHILUS'
WHERE email = 'infocryptoforce@gmail.com';

-- 3. Verificar que no hay duplicados
WITH duplicates AS (
  SELECT referral_code, COUNT(*) as count
  FROM users 
  WHERE referral_code LIKE 'CRYPTOFORCE-%'
  GROUP BY referral_code
  HAVING COUNT(*) > 1
),
numbered AS (
  SELECT 
    u.id,
    u.referral_code,
    ROW_NUMBER() OVER (PARTITION BY u.referral_code ORDER BY u.created_at) as rn
  FROM users u
  INNER JOIN duplicates d ON u.referral_code = d.referral_code
)
UPDATE users 
SET referral_code = users.referral_code || (numbered.rn - 1)::text
FROM numbered
WHERE users.id = numbered.id 
  AND numbered.rn > 1;

-- 4. Verificar resultados finales
SELECT 
    email, 
    nickname, 
    referral_code,
    user_level,
    CASE 
        WHEN referral_code LIKE 'CRYPTOFORCE-%' AND referral_code !~ '[^A-Z0-9-]' THEN '✅ Formato correcto'
        WHEN referral_code LIKE 'CRYPTOFORCE-%' AND referral_code ~ '[^A-Z0-9-]' THEN '❌ Tiene caracteres inválidos'
        WHEN referral_code LIKE 'CRYPTOFORCE_%' THEN '❌ Formato antiguo'
        ELSE '⚠️ Formato desconocido'
    END as status
FROM users 
WHERE referral_code IS NOT NULL
ORDER BY created_at DESC;
