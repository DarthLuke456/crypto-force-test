-- Script to fix referral codes to match CRYPTOFORCE_NICKNAME format
-- This will update all existing users to have the correct referral code format

-- Update infocryptoforce@gmail.com to have the correct referral code
UPDATE users 
SET 
  referral_code = 'CRYPTOFORCE_CRYPTOFORCE',
  updated_at = NOW()
WHERE email = 'infocryptoforce@gmail.com';

-- Update coeurdeluke.js@gmail.com to have the correct referral code
UPDATE users 
SET 
  referral_code = 'CRYPTOFORCE_DARTHLUKE',
  updated_at = NOW()
WHERE email = 'coeurdeluke.js@gmail.com';

-- Update josefranciscocastrosias@gmail.com to have the correct referral code
UPDATE users 
SET 
  referral_code = 'CRYPTOFORCE_JOSEFRANCISCO',
  updated_at = NOW()
WHERE email = 'josefranciscocastrosias@gmail.com';

-- Update coeurdeluke@gmail.com to have the correct referral code (fix hyphen to underscore)
UPDATE users 
SET 
  referral_code = 'CRYPTOFORCE_PORED',
  updated_at = NOW()
WHERE email = 'coeurdeluke@gmail.com';

-- Update diablotress@gmail.com to have the correct referral code (fix spaces to underscores)
UPDATE users 
SET 
  referral_code = 'CRYPTOFORCE_CUENTA_PRUEBA_1',
  updated_at = NOW()
WHERE email = 'diablotress@gmail.com';

-- Verify all referral codes are now correct
SELECT 
  email,
  nickname,
  referral_code,
  user_level,
  total_referrals
FROM users 
WHERE referral_code LIKE 'CRYPTOFORCE_%'
ORDER BY created_at;