-- Script to ensure infocryptoforce@gmail.com exists with proper referral code
-- This user will be the default referrer for all new users

-- First, check if infocryptoforce@gmail.com already exists
SELECT 
  id, 
  email, 
  nickname, 
  referral_code, 
  user_level,
  total_referrals,
  created_at
FROM users 
WHERE email = 'infocryptoforce@gmail.com';

-- If the user doesn't exist, create them
-- Note: This will only work if the user doesn't exist yet
INSERT INTO users (
  email,
  nombre,
  apellido,
  nickname,
  movil,
  exchange,
  user_level,
  referral_code,
  uid,
  codigo_referido,
  referred_by,
  total_referrals,
  created_at,
  updated_at,
  avatar,
  birthdate,
  country,
  bio
) VALUES (
  'infocryptoforce@gmail.com',
  'Franc',
  'CryptoForce',
  'INFOCRYPTOFORCE',
  '',
  '',
  0, -- Master level (same as coeurdeluke)
  'CRYPTOFORCE_INFOCRYPTOFORCE',
  gen_random_uuid(), -- Generate a UUID for the UID field
  null,
  null, -- No referrer for the master
  0,
  NOW(),
  NOW(),
  '/images/default-avatar.png',
  '',
  '',
  'Co-founder of Crypto Force'
) ON CONFLICT (email) DO NOTHING;

-- Update existing user if they exist but have wrong referral code or missing required fields
UPDATE users 
SET 
  nombre = COALESCE(nombre, 'Franc'),
  apellido = COALESCE(apellido, 'CryptoForce'),
  nickname = COALESCE(nickname, 'INFOCRYPTOFORCE'),
  movil = COALESCE(movil, ''),
  exchange = COALESCE(exchange, ''),
  referral_code = 'CRYPTOFORCE_INFOCRYPTOFORCE',
  user_level = 0,
  avatar = COALESCE(avatar, '/images/default-avatar.png'),
  birthdate = COALESCE(birthdate, ''),
  country = COALESCE(country, ''),
  bio = COALESCE(bio, 'Co-founder of Crypto Force'),
  updated_at = NOW()
WHERE email = 'infocryptoforce@gmail.com' 
  AND (referral_code != 'CRYPTOFORCE_INFOCRYPTOFORCE' 
       OR user_level != 0 
       OR nombre IS NULL 
       OR apellido IS NULL);

-- Verify the user exists with correct data
SELECT 
  id, 
  email, 
  nickname, 
  referral_code, 
  user_level,
  total_referrals,
  created_at
FROM users 
WHERE email = 'infocryptoforce@gmail.com';

-- Show all users with CRYPTOFORCE referral codes for verification
SELECT 
  email,
  nickname,
  referral_code,
  user_level,
  total_referrals
FROM users 
WHERE referral_code LIKE 'CRYPTOFORCE_%'
ORDER BY created_at;
