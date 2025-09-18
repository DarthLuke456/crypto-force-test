-- Script para actualizar nicknames en todos los feedback existentes
-- Ejecutar en Supabase SQL Editor

-- Función para generar nickname basado en email
CREATE OR REPLACE FUNCTION generate_nickname_from_email(email TEXT)
RETURNS TEXT AS $$
BEGIN
  -- Casos especiales conocidos
  IF email = 'coeurdeluke.js@gmail.com' THEN
    RETURN 'Darth Luke';
  END IF;
  
  -- Extraer parte del email antes del @
  DECLARE
    email_part TEXT := split_part(email, '@', 1);
    clean_name TEXT;
    formatted_name TEXT;
  BEGIN
    -- Limpiar y formatear
    clean_name := regexp_replace(
      regexp_replace(email_part, '[._-]', ' ', 'g'), -- Reemplazar puntos, guiones y guiones bajos con espacios
      '[0-9]+', '', 'g' -- Remover números
    );
    
    -- Capitalizar primera letra de cada palabra
    formatted_name := initcap(trim(clean_name));
    
    RETURN COALESCE(NULLIF(formatted_name, ''), email_part);
  END;
END;
$$ LANGUAGE plpgsql;

-- Actualizar todos los feedbacks que no tienen nickname o tienen 'Usuario Maestro'
UPDATE feedback 
SET nickname = generate_nickname_from_email(email)
WHERE nickname IS NULL OR nickname = 'Usuario Maestro';

-- Verificar que se actualizó correctamente
SELECT 
  id, 
  email, 
  nickname, 
  whatsapp, 
  subject, 
  created_at 
FROM feedback 
ORDER BY created_at DESC;

-- Limpiar función temporal
DROP FUNCTION IF EXISTS generate_nickname_from_email(TEXT);
