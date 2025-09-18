-- Tabla para tracking de usuarios activos en tiempo real
CREATE TABLE IF NOT EXISTS user_activity (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  nickname TEXT NOT NULL,
  user_level INTEGER NOT NULL DEFAULT 1,
  last_activity TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_online BOOLEAN NOT NULL DEFAULT true,
  current_page TEXT,
  session_id TEXT,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Índices para optimizar consultas
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_last_activity ON user_activity(last_activity);
CREATE INDEX IF NOT EXISTS idx_user_activity_is_online ON user_activity(is_online);
CREATE INDEX IF NOT EXISTS idx_user_activity_user_level ON user_activity(user_level);
CREATE INDEX IF NOT EXISTS idx_user_activity_session_id ON user_activity(session_id);

-- Índice compuesto para consultas de usuarios activos
CREATE INDEX IF NOT EXISTS idx_user_activity_active_users 
ON user_activity(is_online, last_activity, user_level) 
WHERE is_online = true;

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_user_activity_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar updated_at
CREATE TRIGGER trigger_update_user_activity_updated_at
  BEFORE UPDATE ON user_activity
  FOR EACH ROW
  EXECUTE FUNCTION update_user_activity_updated_at();

-- Función para limpiar usuarios inactivos (ejecutar periódicamente)
CREATE OR REPLACE FUNCTION cleanup_inactive_users()
RETURNS INTEGER AS $$
DECLARE
  cutoff_time TIMESTAMPTZ;
  updated_count INTEGER;
BEGIN
  -- Marcar como offline usuarios inactivos por más de 5 minutos
  cutoff_time := NOW() - INTERVAL '5 minutes';
  
  UPDATE user_activity 
  SET is_online = false, updated_at = NOW()
  WHERE is_online = true 
    AND last_activity < cutoff_time;
  
  GET DIAGNOSTICS updated_count = ROW_COUNT;
  
  -- Eliminar registros muy antiguos (más de 24 horas)
  DELETE FROM user_activity 
  WHERE last_activity < NOW() - INTERVAL '24 hours';
  
  RETURN updated_count;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener estadísticas de usuarios activos
CREATE OR REPLACE FUNCTION get_active_users_stats()
RETURNS TABLE (
  total_active INTEGER,
  maestros_active INTEGER,
  darths_active INTEGER,
  others_active INTEGER,
  last_update TIMESTAMPTZ
) AS $$
DECLARE
  cutoff_time TIMESTAMPTZ;
BEGIN
  cutoff_time := NOW() - INTERVAL '5 minutes';
  
  RETURN QUERY
  SELECT 
    COUNT(*)::INTEGER as total_active,
    COUNT(*) FILTER (WHERE user_level >= 6)::INTEGER as maestros_active,
    COUNT(*) FILTER (WHERE user_level = 5)::INTEGER as darths_active,
    COUNT(*) FILTER (WHERE user_level < 5)::INTEGER as others_active,
    NOW() as last_update
  FROM user_activity
  WHERE is_online = true 
    AND last_activity >= cutoff_time;
END;
$$ LANGUAGE plpgsql;

-- Función para obtener usuarios activos con detalles
CREATE OR REPLACE FUNCTION get_active_users_details()
RETURNS TABLE (
  user_id UUID,
  nickname TEXT,
  user_level INTEGER,
  last_seen TIMESTAMPTZ,
  current_page TEXT,
  is_online BOOLEAN
) AS $$
DECLARE
  cutoff_time TIMESTAMPTZ;
BEGIN
  cutoff_time := NOW() - INTERVAL '5 minutes';
  
  RETURN QUERY
  SELECT 
    ua.user_id,
    ua.nickname,
    ua.user_level,
    ua.last_activity as last_seen,
    ua.current_page,
    ua.is_online
  FROM user_activity ua
  WHERE ua.is_online = true 
    AND ua.last_activity >= cutoff_time
  ORDER BY ua.last_activity DESC;
END;
$$ LANGUAGE plpgsql;

-- RLS (Row Level Security) para proteger los datos
ALTER TABLE user_activity ENABLE ROW LEVEL SECURITY;

-- Política: Los usuarios solo pueden ver su propia actividad
CREATE POLICY "Users can view their own activity" ON user_activity
  FOR SELECT USING (auth.uid() = user_id);

-- Política: Los usuarios pueden insertar/actualizar su propia actividad
CREATE POLICY "Users can manage their own activity" ON user_activity
  FOR ALL USING (auth.uid() = user_id);

-- Política: Los maestros (nivel 6) pueden ver toda la actividad
CREATE POLICY "Masters can view all activity" ON user_activity
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_activity ua 
      WHERE ua.user_id = auth.uid() 
        AND ua.user_level >= 6 
        AND ua.is_online = true
    )
  );

-- Comentarios para documentación
COMMENT ON TABLE user_activity IS 'Tabla para tracking de usuarios activos en tiempo real';
COMMENT ON COLUMN user_activity.user_id IS 'ID del usuario autenticado';
COMMENT ON COLUMN user_activity.nickname IS 'Nickname del usuario para mostrar';
COMMENT ON COLUMN user_activity.user_level IS 'Nivel del usuario (1-6)';
COMMENT ON COLUMN user_activity.last_activity IS 'Última actividad registrada';
COMMENT ON COLUMN user_activity.is_online IS 'Si el usuario está actualmente online';
COMMENT ON COLUMN user_activity.current_page IS 'Página actual del usuario';
COMMENT ON COLUMN user_activity.session_id IS 'ID único de la sesión';
COMMENT ON COLUMN user_activity.ip_address IS 'Dirección IP del usuario';
COMMENT ON COLUMN user_activity.user_agent IS 'User Agent del navegador';
