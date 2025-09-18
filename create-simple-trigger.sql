-- Script para crear un trigger muy simple que funcione
-- Ejecutar en el SQL Editor de Supabase

-- 1. Eliminar todo lo existente
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS handle_new_user();
DROP FUNCTION IF EXISTS generate_referral_code(TEXT);

-- 2. Crear función muy simple para generar código de referido
CREATE OR REPLACE FUNCTION generate_referral_code(nickname TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN UPPER(nickname) || '_' || EXTRACT(EPOCH FROM NOW())::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Crear función muy simple para insertar usuario
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insertar en public.users de forma muy simple
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
    NEW.id::TEXT,
    COALESCE(NEW.raw_user_meta_data->>'nombre', 'Usuario'),
    COALESCE(NEW.raw_user_meta_data->>'apellido', 'Nuevo'),
    COALESCE(NEW.raw_user_meta_data->>'nickname', 'usuario'),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'movil', ''),
    COALESCE(NEW.raw_user_meta_data->>'exchange', ''),
    NEW.id::TEXT,
    'NUEVO',
    NOW(),
    generate_referral_code(COALESCE(NEW.raw_user_meta_data->>'nickname', 'usuario')),
    NULL,
    1,
    0
  );
  
  RAISE NOTICE 'TRIGGER EJECUTADO: Usuario % insertado en public.users', NEW.email;
  
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'ERROR EN TRIGGER: %', SQLERRM;
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

-- 6. Probar la función
SELECT generate_referral_code('test_user');

-- 7. Verificar que la función existe
SELECT 
  routine_name,
  routine_type
FROM information_schema.routines 
WHERE routine_name = 'handle_new_user';
