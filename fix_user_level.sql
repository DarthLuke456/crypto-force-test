-- =====================================================
-- FIX USER LEVEL FOR FOUNDER ACCOUNTS
-- =====================================================

-- Update your user level to match the offline context
UPDATE public.users 
SET user_level = 0 
WHERE email = 'coeurdeluke.js@gmail.com';

-- Update the other founder account as well
UPDATE public.users 
SET user_level = 0 
WHERE email = 'infocryptoforce@gmail.com';

-- Verify the changes
SELECT 
    email,
    nickname,
    user_level,
    updated_at
FROM public.users 
WHERE email IN ('coeurdeluke.js@gmail.com', 'infocryptoforce@gmail.com')
ORDER BY email;
