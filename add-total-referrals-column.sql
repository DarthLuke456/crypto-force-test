-- Script para agregar la columna total_referrals a la tabla users
-- Ejecutar en Supabase SQL Editor

-- 1. Agregar la columna total_referrals (si no existe)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS total_referrals INTEGER DEFAULT 0;

-- 2. Crear un índice para mejorar el rendimiento de consultas
CREATE INDEX IF NOT EXISTS idx_users_total_referrals ON users(total_referrals);

-- 3. Actualizar los valores existentes basándose en la tabla referral_history
-- Usando la estructura real: referral_history.referrer_email = users.email
UPDATE users 
SET total_referrals = (
  SELECT COUNT(*) 
  FROM referral_history 
  WHERE referrer_email = users.email
)
WHERE EXISTS (
  SELECT 1 
  FROM referral_history 
  WHERE referrer_email = users.email
);

-- 4. Verificar que la columna se agregó correctamente
SELECT 
  column_name, 
  data_type, 
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name = 'total_referrals';

-- 5. Verificar los valores actualizados
SELECT 
  id,
  nickname,
  email,
  total_referrals,
  referral_code
FROM users 
ORDER BY total_referrals DESC;
