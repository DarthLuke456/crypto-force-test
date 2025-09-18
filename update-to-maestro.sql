-- Función para actualizar usuarios específicos a nivel Maestro
-- Ejecutar en el SQL Editor de Supabase

-- 1. Eliminar función existente si existe
DROP FUNCTION IF EXISTS update_user_to_maestro(TEXT);

-- 2. Función para actualizar usuario a Maestro
CREATE OR REPLACE FUNCTION update_user_to_maestro(user_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Actualizar usuario existente
  UPDATE public.users 
  SET 
    user_level = 6,
    codigo_referido = 'MAESTRO',
    updated_at = NOW()
  WHERE email = user_email;
  
  -- Verificar que se actualizó
  IF FOUND THEN
    RAISE NOTICE 'Usuario % actualizado a nivel Maestro', user_email;
    RETURN TRUE;
  ELSE
    RAISE NOTICE 'Usuario % no encontrado', user_email;
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Actualizar usuarios específicos a Maestro
SELECT update_user_to_maestro('coeurdeluke.js@gmail.com');
SELECT update_user_to_maestro('infocryptoforce@gmail.com');

-- 3. Verificar que se actualizaron
SELECT 
  email, 
  nickname, 
  user_level,
  CASE user_level
    WHEN 1 THEN 'Iniciado'
    WHEN 2 THEN 'Acólito'
    WHEN 3 THEN 'Warrior'
    WHEN 4 THEN 'Lord'
    WHEN 5 THEN 'Darth'
    WHEN 6 THEN 'Maestro'
    ELSE 'Desconocido'
  END as nivel_nombre,
  referral_code
FROM public.users 
WHERE email IN ('coeurdeluke.js@gmail.com', 'infocryptoforce@gmail.com')
ORDER BY user_level DESC;
