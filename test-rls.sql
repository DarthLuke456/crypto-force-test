-- Test para verificar que las políticas RLS estén funcionando
-- Ejecutar en Supabase SQL Editor

-- 1. Verificar estado de RLS
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'users';

-- 2. Verificar políticas existentes
SELECT 
    policyname,
    cmd,
    roles,
    with_check,
    qual
FROM pg_policies 
WHERE tablename = 'users';

-- 3. Verificar permisos del rol anon
SELECT 
    grantee,
    table_name,
    privilege_type,
    is_grantable
FROM information_schema.table_privileges 
WHERE table_name = 'users' 
AND grantee = 'anon';

-- 4. Test de inserción (esto debería funcionar si las políticas están bien)
-- INSERT INTO public.users (nombre, apellido, nickname, email, movil, exchange, uid) 
-- VALUES ('Test', 'User', 'testuser', 'test@example.com', '+1234567890', 'TestExchange', 'test123');
