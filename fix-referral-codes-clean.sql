-- =====================================================
-- FIX: Limpiar códigos de referido con espacios y caracteres especiales
-- =====================================================

-- 1. Limpiar códigos que tienen espacios
UPDATE users 
SET referral_code = 'CRYPTOFORCE-' || UPPER(REGEXP_REPLACE(nickname, '[^a-zA-Z0-9]', '', 'g'))
WHERE referral_code LIKE 'CRYPTOFORCE-%' 
  AND referral_code ~ ' ';

-- 2. Limpiar códigos que tienen guiones bajos
UPDATE users 
SET referral_code = 'CRYPTOFORCE-' || UPPER(REGEXP_REPLACE(nickname, '[^a-zA-Z0-9]', '', 'g'))
WHERE referral_code LIKE 'CRYPTOFORCE-%' 
  AND referral_code ~ '_';

-- 3. Verificar que no hay duplicados después de la limpieza
-- Si hay duplicados, agregar sufijo numérico
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

-- 4. Verificar resultados
SELECT 
    email, 
    nickname, 
    referral_code,
    CASE 
        WHEN referral_code LIKE 'CRYPTOFORCE-%' AND referral_code !~ '[^A-Z0-9-]' THEN '✅ Formato correcto'
        WHEN referral_code LIKE 'CRYPTOFORCE-%' AND referral_code ~ '[^A-Z0-9-]' THEN '❌ Tiene caracteres inválidos'
        WHEN referral_code LIKE 'CRYPTOFORCE_%' THEN '❌ Formato antiguo'
        ELSE '⚠️ Formato desconocido'
    END as status
FROM users 
WHERE referral_code IS NOT NULL
ORDER BY created_at DESC
LIMIT 10;
