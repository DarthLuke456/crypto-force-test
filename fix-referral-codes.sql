-- ============================================
-- FIX REFERRAL CODES FORMAT
-- ============================================

-- 1. Check current referral codes
SELECT 
    'CURRENT REFERRAL CODES' as status,
    email,
    nickname,
    referral_code
FROM users 
ORDER BY email;

-- 2. Update referral codes to correct format: CRYPTOFORCE_NICKNAME
UPDATE users 
SET referral_code = 'CRYPTOFORCE_' || UPPER(REPLACE(nickname, ' ', '_'))
WHERE email IN (
    'coeurdeluke.js@gmail.com',
    'infocryptoforce@gmail.com', 
    'coeurdeluke@gmail.com',
    'josefranciscocastrosias@gmail.com'
);

-- 3. Verify the updated referral codes
SELECT 
    'UPDATED REFERRAL CODES' as status,
    email,
    nickname,
    referral_code
FROM users 
ORDER BY email;