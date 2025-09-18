-- Script para arreglar el trigger y crear uno más simple
-- Ejecutar en el SQL Editor de Supabase

-- 1. Eliminar trigger y funciones existentes
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();
DROP FUNCTION IF EXISTS generate_referral_code(TEXT);

-- 2. Crear función simple para generar código de referido
CREATE OR REPLACE FUNCTION generate_referral_code(nickname TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN UPPER(nickname) || '_' || 
         EXTRACT(EPOCH FROM NOW())::TEXT || '_' || 
         SUBSTRING(MD5(RANDOM()::TEXT) FROM 1 FOR 6);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Crear función simple para insertar usuario
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_nickname TEXT;
  user_referral_code TEXT;
BEGIN
  -- Obtener nickname del metadata
  user_nickname := COALESCE(NEW.raw_user_meta_data->>'nickname', 'usuario' || SUBSTRING(NEW.id FROM 1 FOR 8));
  
  -- Generar código de referido
  user_referral_code := generate_referral_code(user_nickname);
  
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
    user_nickname,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'movil', ''),
    COALESCE(NEW.raw_user_meta_data->>'exchange', ''),
    NEW.id,
    'NUEVO',
    NOW(),
    user_referral_code,
    NULL,
    1, -- Nivel Iniciado por defecto
    0
  );
  
  RAISE NOTICE 'Usuario % creado exitosamente con nickname % y referral_code %', NEW.email, user_nickname, user_referral_code;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error al crear usuario: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Crear trigger
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- 5. Verificar que se creó
SELECT 
  trigger_name,
  event_manipulation,
  event_object_table,
  action_statement
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- 6. Probar la función generate_referral_code
SELECT generate_referral_code('test_user');
