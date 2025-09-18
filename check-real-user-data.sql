-- Verificar datos reales en la tabla users
SELECT 
  id,
  email,
  nickname,
  movil,
  created_at
FROM users 
WHERE email = 'coeurdeluke.js@gmail.com';

-- También verificar todos los usuarios para ver la estructura
SELECT 
  id,
  email,
  nickname,
  movil,
  created_at
FROM users 
ORDER BY created_at DESC
LIMIT 10;
