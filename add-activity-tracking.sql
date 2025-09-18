-- Script para agregar tracking de actividad a la tabla users
-- Ejecutar en Supabase SQL Editor

-- Agregar columnas para tracking de actividad
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS is_online BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS session_start TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Crear índice para mejorar performance de consultas de usuarios activos
CREATE INDEX IF NOT EXISTS idx_users_last_activity ON users(last_activity);
CREATE INDEX IF NOT EXISTS idx_users_is_online ON users(is_online);

-- Crear función para actualizar actividad del usuario
CREATE OR REPLACE FUNCTION update_user_activity()
RETURNS TRIGGER AS $$
BEGIN
  NEW.last_activity = NOW();
  NEW.is_online = true;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Crear trigger para actualizar automáticamente la actividad
DROP TRIGGER IF EXISTS trigger_update_user_activity ON users;
CREATE TRIGGER trigger_update_user_activity
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_user_activity();

-- Función para marcar usuarios como offline después de 15 minutos de inactividad
CREATE OR REPLACE FUNCTION mark_inactive_users_offline()
RETURNS void AS $$
BEGIN
  UPDATE users 
  SET is_online = false 
  WHERE last_activity < NOW() - INTERVAL '15 minutes';
END;
$$ LANGUAGE plpgsql;

-- Crear job para ejecutar la función cada 5 minutos (requiere pg_cron)
-- Nota: pg_cron debe estar habilitado en Supabase
-- SELECT cron.schedule('mark-inactive-users', '*/5 * * * *', 'SELECT mark_inactive_users_offline();');

-- Actualizar usuarios existentes
UPDATE users 
SET last_activity = created_at, 
    is_online = true 
WHERE last_activity IS NULL;

-- Comentarios sobre el sistema:
-- 1. last_activity: Se actualiza cada vez que el usuario envía un heartbeat
-- 2. is_online: Se marca como true cuando hay actividad, false después de 15 min de inactividad
-- 3. session_start: Marca cuando comenzó la sesión actual
-- 4. El trigger actualiza automáticamente last_activity en cada UPDATE
-- 5. La función mark_inactive_users_offline() se puede ejecutar manualmente o con pg_cron
