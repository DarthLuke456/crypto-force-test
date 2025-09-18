-- Script SIMPLE para arreglar el perfil del usuario
-- Ejecutar en Supabase SQL Editor

-- 1. Actualizar metadatos del usuario
UPDATE auth.users 
SET raw_user_meta_data = '{"nickname": "Darth Luke", "whatsapp": "+1234567890"}'::jsonb
WHERE email = 'coeurdeluke.js@gmail.com';

-- 2. Actualizar feedbacks existentes
UPDATE feedback 
SET nickname = 'Darth Luke', whatsapp = '+1234567890'
WHERE email = 'coeurdeluke.js@gmail.com';

-- 3. Verificar
SELECT 
  'User' as tipo,
  email, 
  raw_user_meta_data->>'nickname' as nickname,
  raw_user_meta_data->>'whatsapp' as whatsapp
FROM auth.users 
WHERE email = 'coeurdeluke.js@gmail.com'

UNION ALL

SELECT 
  'Feedback' as tipo,
  email, 
  nickname,
  whatsapp
FROM feedback 
WHERE email = 'coeurdeluke.js@gmail.com';
