-- Script para configurar correctamente el perfil del usuario
-- Ejecutar en Supabase SQL Editor

-- 1. Actualizar metadatos del usuario con nickname y WhatsApp reales
UPDATE auth.users 
SET raw_user_meta_data = COALESCE(raw_user_meta_data, '{}'::jsonb) || 
    '{"nickname": "Darth Luke", "whatsapp": "+1234567890"}'::jsonb
WHERE email = 'coeurdeluke.js@gmail.com';

-- 2. Actualizar feedbacks existentes con el nickname correcto
UPDATE feedback 
SET nickname = 'Darth Luke', whatsapp = '+1234567890'
WHERE email = 'coeurdeluke.js@gmail.com';

-- 3. Verificar que todo se actualizó correctamente
SELECT 
  'User metadata' as source,
  id, 
  email, 
  raw_user_meta_data->>'nickname' as nickname,
  raw_user_meta_data->>'whatsapp' as whatsapp
FROM auth.users 
WHERE email = 'coeurdeluke.js@gmail.com'

UNION ALL

SELECT 
  'Feedback data' as source,
  id, 
  email, 
  nickname,
  whatsapp
FROM feedback 
WHERE email = 'coeurdeluke.js@gmail.com';
