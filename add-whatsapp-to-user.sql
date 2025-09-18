-- Script para agregar WhatsApp al usuario
-- Ejecutar en Supabase SQL Editor

-- Actualizar metadatos del usuario para incluir WhatsApp
UPDATE auth.users 
SET user_metadata = COALESCE(user_metadata, '{}'::jsonb) || '{"whatsapp": "+1234567890"}'::jsonb
WHERE email = 'coeurdeluke.js@gmail.com';

-- Verificar que se actualizó
SELECT 
  id, 
  email, 
  user_metadata
FROM auth.users 
WHERE email = 'coeurdeluke.js@gmail.com';
