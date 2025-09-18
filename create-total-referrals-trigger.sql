-- Script para crear un trigger que mantenga actualizada la columna total_referrals
-- Ejecutar en Supabase SQL Editor

-- 1. Función para actualizar total_referrals
CREATE OR REPLACE FUNCTION update_total_referrals()
RETURNS TRIGGER AS $$
BEGIN
  -- Si es una inserción, incrementar el contador del referidor
  IF TG_OP = 'INSERT' THEN
    UPDATE users 
    SET total_referrals = total_referrals + 1
    WHERE email = NEW.referrer_email;
    
  -- Si es una eliminación, decrementar el contador del referidor
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE users 
    SET total_referrals = GREATEST(total_referrals - 1, 0)
    WHERE email = OLD.referrer_email;
    
  -- Si es una actualización, recalcular ambos contadores
  ELSIF TG_OP = 'UPDATE' THEN
    -- Decrementar el contador del referidor anterior
    IF OLD.referrer_email IS NOT NULL AND OLD.referrer_email != NEW.referrer_email THEN
      UPDATE users 
      SET total_referrals = GREATEST(total_referrals - 1, 0)
      WHERE email = OLD.referrer_email;
    END IF;
    
    -- Incrementar el contador del nuevo referidor
    IF NEW.referrer_email IS NOT NULL AND (OLD.referrer_email IS NULL OR OLD.referrer_email != NEW.referrer_email) THEN
      UPDATE users 
      SET total_referrals = total_referrals + 1
      WHERE email = NEW.referrer_email;
    END IF;
  END IF;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- 2. Crear el trigger en la tabla referral_history
DROP TRIGGER IF EXISTS trigger_update_total_referrals ON referral_history;

CREATE TRIGGER trigger_update_total_referrals
  AFTER INSERT OR UPDATE OR DELETE ON referral_history
  FOR EACH ROW
  EXECUTE FUNCTION update_total_referrals();

-- 3. Verificar que el trigger se creó correctamente
SELECT 
  trigger_name,
  event_manipulation,
  action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'trigger_update_total_referrals';

-- 4. Función para recalcular todos los total_referrals
CREATE OR REPLACE FUNCTION recalculate_all_total_referrals()
RETURNS void AS $$
BEGIN
  UPDATE users 
  SET total_referrals = (
    SELECT COUNT(*) 
    FROM referral_history 
    WHERE referrer_email = users.email
  );
END;
$$ LANGUAGE plpgsql;

-- 5. Ejecutar la recalculación inicial
SELECT recalculate_all_total_referrals();

-- 6. Verificar los resultados
SELECT 
  id,
  nickname,
  email,
  total_referrals,
  referral_code
FROM users 
ORDER BY total_referrals DESC;
