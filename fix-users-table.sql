-- Script para arreglar la tabla users
-- Este script corrige problemas comunes que causan errores 406 y 409

-- 1. Verificar si la tabla existe
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users') THEN
        -- Crear la tabla users si no existe
        CREATE TABLE users (
            id SERIAL PRIMARY KEY,
            uid UUID UNIQUE NOT NULL,
            email VARCHAR(255) UNIQUE NOT NULL,
            nickname VARCHAR(100),
            user_level INTEGER DEFAULT 0,
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Crear índices
        CREATE INDEX idx_users_uid ON users(uid);
        CREATE INDEX idx_users_email ON users(email);
        
        RAISE NOTICE 'Tabla users creada exitosamente';
    ELSE
        RAISE NOTICE 'Tabla users ya existe';
    END IF;
END $$;

-- 2. Verificar y corregir tipos de datos
DO $$
BEGIN
    -- Verificar si uid es UUID
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'uid' 
        AND data_type != 'uuid'
    ) THEN
        -- Convertir uid a UUID si no lo es
        ALTER TABLE users ALTER COLUMN uid TYPE UUID USING uid::UUID;
        RAISE NOTICE 'Columna uid convertida a UUID';
    END IF;
    
    -- Verificar si email es VARCHAR
    IF EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' 
        AND column_name = 'email' 
        AND data_type != 'character varying'
    ) THEN
        ALTER TABLE users ALTER COLUMN email TYPE VARCHAR(255);
        RAISE NOTICE 'Columna email convertida a VARCHAR(255)';
    END IF;
END $$;

-- 3. Limpiar datos duplicados (usando id en lugar de MIN con UUID)
DELETE FROM users 
WHERE id NOT IN (
    SELECT MIN(id::text)::integer 
    FROM users 
    GROUP BY uid, email
);

-- 4. Verificar restricciones
DO $$
BEGIN
    -- Asegurar que uid sea único
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'users' 
        AND constraint_name = 'users_uid_key'
    ) THEN
        ALTER TABLE users ADD CONSTRAINT users_uid_key UNIQUE (uid);
        RAISE NOTICE 'Restricción única para uid agregada';
    END IF;
    
    -- Asegurar que email sea único
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.table_constraints 
        WHERE table_name = 'users' 
        AND constraint_name = 'users_email_key'
    ) THEN
        ALTER TABLE users ADD CONSTRAINT users_email_key UNIQUE (email);
        RAISE NOTICE 'Restricción única para email agregada';
    END IF;
END $$;

-- 5. Verificar datos finales
SELECT 
    'Estructura final de la tabla users:' as info,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

SELECT 
    'Total de usuarios:' as info,
    COUNT(*) as count
FROM users;

SELECT 
    'Usuarios únicos por uid:' as info,
    COUNT(DISTINCT uid) as unique_uids
FROM users;

SELECT 
    'Usuarios únicos por email:' as info,
    COUNT(DISTINCT email) as unique_emails
FROM users;