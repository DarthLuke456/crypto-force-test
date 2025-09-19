-- Script para arreglar políticas RLS que causan errores 406/409
-- Los errores 406/409 suelen ser causados por políticas RLS mal configuradas

-- 1. Deshabilitar RLS temporalmente para diagnosticar
ALTER TABLE users DISABLE ROW LEVEL SECURITY;

-- 2. Eliminar todas las políticas existentes de la tabla users
DROP POLICY IF EXISTS "Users can view own data" ON users;
DROP POLICY IF EXISTS "Users can update own data" ON users;
DROP POLICY IF EXISTS "Users can insert own data" ON users;
DROP POLICY IF EXISTS "Users can delete own data" ON users;
DROP POLICY IF EXISTS "Enable read access for all users" ON users;
DROP POLICY IF EXISTS "Enable insert for all users" ON users;
DROP POLICY IF EXISTS "Enable update for all users" ON users;
DROP POLICY IF EXISTS "Enable delete for all users" ON users;

-- 3. Crear políticas RLS simples y funcionales
-- Política para lectura: permitir a usuarios autenticados ver sus propios datos
CREATE POLICY "Users can view own data" ON users
    FOR SELECT
    USING (auth.uid()::text = uid::text);

-- Política para inserción: permitir a usuarios autenticados insertar sus propios datos
CREATE POLICY "Users can insert own data" ON users
    FOR INSERT
    WITH CHECK (auth.uid()::text = uid::text);

-- Política para actualización: permitir a usuarios autenticados actualizar sus propios datos
CREATE POLICY "Users can update own data" ON users
    FOR UPDATE
    USING (auth.uid()::text = uid::text)
    WITH CHECK (auth.uid()::text = uid::text);

-- Política para eliminación: permitir a usuarios autenticados eliminar sus propios datos
CREATE POLICY "Users can delete own data" ON users
    FOR DELETE
    USING (auth.uid()::text = uid::text);

-- 4. Habilitar RLS nuevamente
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- 5. Verificar que las políticas se crearon correctamente
SELECT 
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'users'
ORDER BY policyname;

-- 6. Verificar que RLS está habilitado
SELECT 
    schemaname,
    tablename,
    rowsecurity,
    forcerowsecurity
FROM pg_tables 
WHERE tablename = 'users';

-- 7. Crear función auxiliar para verificar acceso
CREATE OR REPLACE FUNCTION check_user_access(user_uid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    -- Verificar si el usuario está autenticado
    IF auth.uid() IS NULL THEN
        RETURN FALSE;
    END IF;
    
    -- Verificar si el UID coincide
    RETURN auth.uid()::text = user_uid::text;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. Otorgar permisos necesarios
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON users TO anon, authenticated;
GRANT USAGE, SELECT ON SEQUENCE users_id_seq TO anon, authenticated;

-- 9. Verificar permisos finales
SELECT 
    grantee,
    privilege_type,
    is_grantable
FROM information_schema.table_privileges 
WHERE table_name = 'users'
ORDER BY grantee, privilege_type;
