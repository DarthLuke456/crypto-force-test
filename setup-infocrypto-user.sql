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
  nickname,
  user_level,
  referral_code,
  total_referrals,
  created_at,
  updated_at
) VALUES (
  'infocryptoforce@gmail.com',
  'INFOCRYPTOFORCE',
  0, -- Master level (same as coeurdeluke)
  'CRYPTOFORCE_INFOCRYPTOFORCE',
  0,
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;

-- Update existing user if they exist but have wrong referral code
UPDATE users 
SET 
  referral_code = 'CRYPTOFORCE_INFOCRYPTOFORCE',
  user_level = 0,
  updated_at = NOW()
WHERE email = 'infocryptoforce@gmail.com' 
  AND (referral_code != 'CRYPTOFORCE_INFOCRYPTOFORCE' OR user_level != 0);

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
