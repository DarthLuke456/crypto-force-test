-- Verificar estructura de la tabla users
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default,
    character_maximum_length
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

-- Verificar si existe la tabla users
SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'users'
) as table_exists;

-- Verificar datos en la tabla users
SELECT COUNT(*) as total_users FROM users;

-- Verificar si hay conflictos de datos
SELECT uid, email, COUNT(*) as count
FROM users 
GROUP BY uid, email 
HAVING COUNT(*) > 1;

-- Verificar tipos de datos en uid
SELECT 
    uid,
    pg_typeof(uid) as uid_type,
    email
FROM users 
LIMIT 5;