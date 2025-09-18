-- Función para crear usuario en public.users después del signup
-- Ejecutar en el SQL Editor de Supabase

-- 1. Eliminar función existente si existe
DROP FUNCTION IF EXISTS generate_referral_code(TEXT);

-- 2. Crear función para generar código de referido único
CREATE OR REPLACE FUNCTION generate_referral_code(nickname TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN UPPER(nickname) || '_' || 
         EXTRACT(EPOCH FROM NOW())::TEXT || '_' || 
         SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6);
END;
$$ LANGUAGE plpgsql;

-- 2. Crear función para insertar usuario después del signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insertar en public.users
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
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nombre', 'Usuario'),
    COALESCE(NEW.raw_user_meta_data->>'apellido', 'Nuevo'),
    COALESCE(NEW.raw_user_meta_data->>'nickname', 'usuario' || SUBSTRING(NEW.id FROM 1 FOR 8)),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'movil', ''),
    COALESCE(NEW.raw_user_meta_data->>'exchange', ''),
    NEW.id,
    'NUEVO',
    NOW(),
    generate_referral_code(COALESCE(NEW.raw_user_meta_data->>'nickname', 'usuario')),
    NULL,
    1, -- Nivel Iniciado por defecto
    0
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Crear trigger para ejecutar la función después del signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 4. Verificar que se creó el trigger
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';
