-- Script para actualizar usuarios existentes a nivel de Maestro
-- Ejecutar este script en Supabase SQL Editor

-- Actualizar usuarios autorizados a nivel 6 (Maestro)
UPDATE public.users 
SET 
  user_level = 6,
  updated_at = NOW()
WHERE email IN ('infocryptoforce@gmail.com', 'coeurdeluke.js@gmail.com')
  AND user_level != 6;

-- Verificar los cambios
SELECT 
  id,
  email,
  nickname,
  user_level,
  updated_at
FROM public.users
WHERE email IN ('infocryptoforce@gmail.com', 'coeurdeluke.js@gmail.com')
ORDER BY email;

-- Mostrar todos los usuarios con nivel 6
SELECT 
  id,
  email,
  nickname,
  user_level,
  created_at,
  updated_at
FROM public.users
WHERE user_level = 6
ORDER BY email;
