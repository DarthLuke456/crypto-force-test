-- VERIFICAR Y CORREGIR NIVEL DE DARTH_LUKE
-- Este script verifica si Darth_Luke tiene el nivel correcto de Maestro

-- PASO 1: VERIFICAR USUARIOS EXISTENTES
SELECT 
  id,
  email,
  nickname,
  user_level,
  referral_code,
  created_at
FROM users
ORDER BY created_at DESC;

-- PASO 2: VERIFICAR ESPECÍFICAMENTE DARTH_LUKE
SELECT 
  id,
  email,
  nickname,
  user_level,
  referral_code,
  created_at
FROM users
WHERE nickname = 'Darth_Luke' OR email LIKE '%darth%';

-- PASO 3: CORREGIR EL NIVEL DE DARTH_LUKE SI ES NECESARIO
UPDATE users 
SET user_level = 0 
WHERE nickname = 'Darth_Luke' OR email LIKE '%darth%';

-- PASO 4: VERIFICAR QUE SE APLICÓ EL CAMBIO
SELECT 
  id,
  email,
  nickname,
  user_level,
  referral_code,
  created_at
FROM users
WHERE nickname = 'Darth_Luke' OR email LIKE '%darth%';

-- PASO 5: VERIFICAR FUNCIONES Y TRIGGERS
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines
WHERE routine_schema = 'public'
AND routine_name LIKE '%referral%'
ORDER BY routine_name;
