-- Script para crear el usuario en Supabase
-- Ejecutar en el SQL Editor de Supabase

-- 1. Crear el usuario en auth.users (esto se hace automáticamente al hacer signup)
-- 2. Insertar datos en la tabla public.users

INSERT INTO public.users (
  id,
  nombre,
  apellido,
  nickname,
  email,
  movil,
  exchange,
  uid,
  codigo_referido,
  created_at,
  referral_code,
  referred_by,
  user_level,
  total_referrals
) VALUES (
  gen_random_uuid(), -- id
  'Luke', -- nombre
  'Coeur', -- apellido
  'coeurdeluke', -- nickname
  'coeurdeluke.js@gmail.com', -- email
  '+1234567890', -- movil (cambiar por el real)
  'Binance', -- exchange
  gen_random_uuid(), -- uid
  'FOUNDER001', -- codigo_referido
  NOW(), -- created_at
  'FOUNDER001', -- referral_code
  NULL, -- referred_by (es fundador)
  6, -- user_level (Maestro)
  0 -- total_referrals
) ON CONFLICT (email) DO NOTHING;

-- Verificar que se creó
SELECT * FROM public.users WHERE email = 'coeurdeluke.js@gmail.com';
