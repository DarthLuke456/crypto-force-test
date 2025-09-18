-- Script para arreglar las políticas RLS de la tabla users
-- Ejecutar en el SQL Editor de Supabase

-- 1. Verificar que RLS esté habilitado
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- 2. Eliminar políticas existentes
DROP POLICY IF EXISTS "Users can view own data" ON public.users;
DROP POLICY IF EXISTS "Users can update own data" ON public.users;
DROP POLICY IF EXISTS "Users can insert own data" ON public.users;
DROP POLICY IF EXISTS "Maestros can view all users" ON public.users;
DROP POLICY IF EXISTS "Maestros can update all users" ON public.users;

-- 3. Política para que los usuarios puedan ver sus propios datos
CREATE POLICY "Users can view own data" ON public.users
  FOR SELECT USING (auth.uid() = uid);

-- 4. Política para que los usuarios puedan actualizar sus propios datos
CREATE POLICY "Users can update own data" ON public.users
  FOR UPDATE USING (auth.uid() = uid);

-- 5. Política para que los usuarios puedan insertar sus propios datos
CREATE POLICY "Users can insert own data" ON public.users
  FOR INSERT WITH CHECK (auth.uid() = uid);

-- 6. Política para que los Maestros (nivel 6) puedan ver todos los usuarios
CREATE POLICY "Maestros can view all users" ON public.users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE uid = auth.uid() AND user_level = 6
    )
  );

-- 7. Política para que los Maestros (nivel 6) puedan actualizar todos los usuarios
CREATE POLICY "Maestros can update all users" ON public.users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE uid = auth.uid() AND user_level = 6
    )
  );

-- 8. Política para que los Maestros (nivel 6) puedan insertar usuarios
CREATE POLICY "Maestros can insert users" ON public.users
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users 
      WHERE uid = auth.uid() AND user_level = 6
    )
  );

-- 9. Política especial para el trigger (permite inserción desde funciones)
CREATE POLICY "Allow trigger insertions" ON public.users
  FOR INSERT WITH CHECK (true);

-- 10. Verificar las políticas creadas
SELECT 
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies 
WHERE tablename = 'users' 
AND schemaname = 'public'
ORDER BY policyname;

-- 11. Verificar que RLS esté habilitado
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables 
WHERE tablename = 'users' 
AND schemaname = 'public';
