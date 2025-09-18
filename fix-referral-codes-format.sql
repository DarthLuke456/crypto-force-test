-- Script para corregir formato de códigos de referido y implementar actualización automática
-- Ejecutar en Supabase SQL Editor

-- 1. Crear función para generar código de referido en formato CRYPTOFORCE_NICKNAME
CREATE OR REPLACE FUNCTION generate_correct_referral_code(nickname TEXT)
RETURNS TEXT AS $$
BEGIN
  -- Validar que el nickname no esté vacío
  IF nickname IS NULL OR TRIM(nickname) = '' THEN
    RETURN NULL;
  END IF;
  
  -- Generar código en formato CRYPTOFORCE_NICKNAME
  RETURN 'CRYPTOFORCE_' || UPPER(TRIM(nickname));
END;
$$ LANGUAGE plpgsql;

-- 2. Función para actualizar código de referido de un usuario específico
CREATE OR REPLACE FUNCTION update_user_referral_code(user_id UUID)
RETURNS TEXT AS $$
DECLARE
  user_nickname TEXT;
  new_referral_code TEXT;
BEGIN
  -- Obtener el nickname del usuario
  SELECT nickname INTO user_nickname
  FROM users
  WHERE id = user_id;
  
  -- Generar nuevo código de referido
  new_referral_code := generate_correct_referral_code(user_nickname);
  
  -- Actualizar el código de referido del usuario
  UPDATE users
  SET referral_code = new_referral_code
  WHERE id = user_id;
  
  -- Actualizar todos los usuarios que fueron referidos por este código
  UPDATE users
  SET referred_by = new_referral_code
  WHERE referred_by = (SELECT referral_code FROM users WHERE id = user_id AND id != user_id);
  
  RETURN new_referral_code;
END;
$$ LANGUAGE plpgsql;

-- 3. Función para actualizar TODOS los códigos de referido
CREATE OR REPLACE FUNCTION update_all_referral_codes()
RETURNS TABLE(user_id UUID, old_code TEXT, new_code TEXT) AS $$
DECLARE
  user_record RECORD;
  old_code TEXT;
  new_code TEXT;
BEGIN
  -- Iterar sobre todos los usuarios
  FOR user_record IN SELECT id, nickname, referral_code FROM users LOOP
    old_code := user_record.referral_code;
    new_code := generate_correct_referral_code(user_record.nickname);
    
    -- Solo actualizar si el código es diferente
    IF old_code != new_code THEN
      -- Actualizar el código de referido del usuario
      UPDATE users
      SET referral_code = new_code
      WHERE id = user_record.id;
      
      -- Actualizar todos los usuarios que fueron referidos por el código anterior
      UPDATE users
      SET referred_by = new_code
      WHERE referred_by = old_code;
      
      -- Retornar el cambio
      user_id := user_record.id;
      old_code := old_code;
      new_code := new_code;
      RETURN NEXT;
    END IF;
  END LOOP;
  
  RETURN;
END;
$$ LANGUAGE plpgsql;

-- 4. Trigger para actualizar automáticamente el código de referido cuando cambie el nickname
CREATE OR REPLACE FUNCTION trigger_update_referral_code_on_nickname_change()
RETURNS TRIGGER AS $$
BEGIN
  -- Si el nickname cambió, actualizar el código de referido
  IF OLD.nickname != NEW.nickname THEN
    NEW.referral_code := generate_correct_referral_code(NEW.nickname);
    
    -- También actualizar referred_by en otros usuarios si es necesario
    -- (esto se maneja en la función update_user_referral_code)
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 5. Crear el trigger
DROP TRIGGER IF EXISTS trigger_referral_code_nickname_change ON users;
CREATE TRIGGER trigger_referral_code_nickname_change
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION trigger_update_referral_code_on_nickname_change();

-- 6. Corregir códigos existentes
-- Primero, mostrar qué se va a cambiar
SELECT 
  id,
  nickname,
  referral_code as old_code,
  generate_correct_referral_code(nickname) as new_code
FROM users
WHERE referral_code != generate_correct_referral_code(nickname)
   OR referral_code IS NULL;

-- 7. Aplicar las correcciones
-- Ejecutar esto para aplicar los cambios:
-- SELECT update_all_referral_codes();

-- 8. Verificar que los cambios se aplicaron correctamente
-- SELECT id, nickname, referral_code, referred_by FROM users ORDER BY created_at;

-- 9. Función para obtener estadísticas de referidos actualizadas
CREATE OR REPLACE FUNCTION get_referral_stats()
RETURNS TABLE(
  total_users INTEGER,
  users_with_referrals INTEGER,
  total_referrals INTEGER,
  referred_users INTEGER,
  conversion_rate NUMERIC
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    COUNT(*)::INTEGER as total_users,
    COUNT(CASE WHEN referral_code IS NOT NULL AND referral_code != '' END)::INTEGER as users_with_referrals,
    COUNT(CASE WHEN referred_by IS NOT NULL AND referred_by != '' END)::INTEGER as total_referrals,
    COUNT(DISTINCT referred_by)::INTEGER as referred_users,
    CASE 
      WHEN COUNT(*) > 0 THEN 
        ROUND((COUNT(CASE WHEN referred_by IS NOT NULL AND referred_by != '' END)::NUMERIC / COUNT(*)::NUMERIC) * 100, 2)
      ELSE 0 
    END as conversion_rate
  FROM users;
END;
$$ LANGUAGE plpgsql;

-- Comentarios sobre el sistema:
-- 1. generate_correct_referral_code(): Genera códigos en formato CRYPTOFORCE_NICKNAME
-- 2. update_user_referral_code(): Actualiza código de un usuario específico
-- 3. update_all_referral_codes(): Actualiza TODOS los códigos de referido
-- 4. trigger_update_referral_code_on_nickname_change(): Actualiza automáticamente cuando cambia el nickname
-- 5. get_referral_stats(): Obtiene estadísticas actualizadas de referidos

-- Para aplicar los cambios inmediatamente, ejecutar:
-- SELECT update_all_referral_codes();
