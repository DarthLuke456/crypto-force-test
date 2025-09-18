-- Script para aplicar correcciones de códigos de referido inmediatamente
-- Ejecutar en Supabase SQL Editor

-- 1. Actualizar códigos de referido existentes al formato correcto
UPDATE users 
SET referral_code = 'CRYPTOFORCE_' || UPPER(nickname)
WHERE nickname IS NOT NULL 
  AND nickname != '' 
  AND (referral_code != 'CRYPTOFORCE_' || UPPER(nickname) OR referral_code IS NULL);

-- 2. Verificar los cambios aplicados
SELECT 
  id,
  nickname,
  referral_code,
  referred_by,
  created_at
FROM users 
ORDER BY created_at;

-- 3. Mostrar estadísticas actualizadas
SELECT 
  COUNT(*) as total_users,
  COUNT(CASE WHEN referral_code IS NOT NULL AND referral_code != '' END) as users_with_referral_codes,
  COUNT(CASE WHEN referred_by IS NOT NULL AND referred_by != '' END) as users_referred_by_others
FROM users;

-- 4. Verificar que el formato sea correcto
SELECT 
  nickname,
  referral_code,
  CASE 
    WHEN referral_code LIKE 'CRYPTOFORCE_%' THEN '✅ Formato correcto'
    ELSE '❌ Formato incorrecto'
  END as status
FROM users
WHERE referral_code IS NOT NULL AND referral_code != '';
