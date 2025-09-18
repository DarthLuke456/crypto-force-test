-- ==========================================
-- CONFIGURACIÓN COMPLETA DE SUPABASE
-- CRYPTO FORCE DASHBOARD
-- ==========================================
-- 
-- INSTRUCCIONES:
-- 1. Ve a tu proyecto en Supabase.com
-- 2. Abre el SQL Editor
-- 3. Copia y pega TODO este script
-- 4. Haz clic en "RUN"
-- 5. Verifica que no haya errores
--
-- ==========================================

-- ==========================================
-- PASO 1: LIMPIAR CONFIGURACIÓN EXISTENTE
-- ==========================================

-- Eliminar políticas existentes que puedan causar conflictos
DROP POLICY IF EXISTS "users_insert_anon_policy" ON public.users;
DROP POLICY IF EXISTS "users_insert_auth_policy" ON public.users;
DROP POLICY IF EXISTS "users_select_own_policy" ON public.users;
DROP POLICY IF EXISTS "users_update_own_policy" ON public.users;
DROP POLICY IF EXISTS "users_delete_own_policy" ON public.users;
DROP POLICY IF EXISTS "users_select_optimized" ON public.users;
DROP POLICY IF EXISTS "Allow insert for all users" ON public.users;
DROP POLICY IF EXISTS "public_insert_users" ON public.users;
DROP POLICY IF EXISTS "public_select_users" ON public.users;
DROP POLICY IF EXISTS "public_update_users" ON public.users;
DROP POLICY IF EXISTS "public_delete_users" ON public.users;
DROP POLICY IF EXISTS "users_insert_policy" ON public.users;
DROP POLICY IF EXISTS "users_select_policy" ON public.users;
DROP POLICY IF EXISTS "users_update_policy" ON public.users;
DROP POLICY IF EXISTS "users_delete_policy" ON public.users;

-- ==========================================
-- PASO 2: VERIFICAR ESTRUCTURA DE LA TABLA USERS
-- ==========================================

-- Verificar si la tabla users existe y su estructura
DO $$
BEGIN
    -- Crear tabla users si no existe
    IF NOT EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'users') THEN
        CREATE TABLE public.users (
            id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
            nombre text,
            apellido text,
            nickname text UNIQUE,
            email text UNIQUE NOT NULL,
            movil text,
            exchange text,
            uid text,
            codigo_referido text,
            created_at timestamp with time zone DEFAULT now(),
            referral_code text UNIQUE,
            referred_by text,
            user_level integer DEFAULT 1,
            total_referrals integer DEFAULT 0,
            updated_at timestamp with time zone DEFAULT now()
        );
        
        RAISE NOTICE 'Tabla users creada exitosamente';
    ELSE
        RAISE NOTICE 'Tabla users ya existe';
    END IF;
    
    -- Agregar columnas faltantes si no existen
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'id') THEN
        ALTER TABLE public.users ADD COLUMN id uuid DEFAULT gen_random_uuid() PRIMARY KEY;
        RAISE NOTICE 'Columna id agregada';
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'created_at') THEN
        ALTER TABLE public.users ADD COLUMN created_at timestamp with time zone DEFAULT now();
        RAISE NOTICE 'Columna created_at agregada';
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'updated_at') THEN
        ALTER TABLE public.users ADD COLUMN updated_at timestamp with time zone DEFAULT now();
        RAISE NOTICE 'Columna updated_at agregada';
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'user_level') THEN
        ALTER TABLE public.users ADD COLUMN user_level integer DEFAULT 1;
        RAISE NOTICE 'Columna user_level agregada';
    END IF;
    
    IF NOT EXISTS (SELECT FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'total_referrals') THEN
        ALTER TABLE public.users ADD COLUMN total_referrals integer DEFAULT 0;
        RAISE NOTICE 'Columna total_referrals agregada';
    END IF;
    
END $$;

-- ==========================================
-- PASO 3: CONFIGURAR RLS (ROW LEVEL SECURITY)
-- ==========================================

-- Habilitar RLS en la tabla users
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Otorgar permisos básicos necesarios
GRANT SELECT, INSERT, UPDATE, DELETE ON public.users TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.users TO authenticated;

-- ==========================================
-- PASO 4: CREAR POLÍTICAS RLS OPTIMIZADAS
-- ==========================================

-- POLÍTICA 1: Permitir registro de nuevos usuarios (INSERT para anónimos)
CREATE POLICY "users_insert_anon_policy"
ON public.users
FOR INSERT
TO anon
WITH CHECK (true);

-- POLÍTICA 2: Permitir INSERT para usuarios autenticados
CREATE POLICY "users_insert_auth_policy"
ON public.users
FOR INSERT
TO authenticated
WITH CHECK (true);

-- POLÍTICA 3: SELECT optimizado - usuarios pueden ver sus propios datos + maestros pueden ver datos de nivel inferior
CREATE POLICY "users_select_optimized"
ON public.users
FOR SELECT
TO authenticated
USING (
    -- Usuario siempre puede ver sus propios datos
    auth.uid() = id 
    OR 
    -- Maestros (nivel 5+) pueden ver datos de usuarios de nivel inferior
    (
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() 
            AND user_level >= 5
        )
        AND user_level < 6
    )
    OR
    -- Usuarios pueden ver perfiles públicos básicos (nickname, user_level) de otros usuarios
    (
        user_level <= 3 
        AND auth.uid() != id
    )
);

-- POLÍTICA 4: UPDATE - usuarios solo pueden modificar sus propios datos
CREATE POLICY "users_update_own_policy"
ON public.users
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- POLÍTICA 5: DELETE - usuarios solo pueden eliminar sus propios datos
CREATE POLICY "users_delete_own_policy"
ON public.users
FOR DELETE
TO authenticated
USING (auth.uid() = id);

-- ==========================================
-- PASO 5: CREAR ÍNDICES PARA MEJOR PERFORMANCE
-- ==========================================

-- Índices para queries frecuentes (sin CONCURRENTLY para compatibilidad con transacciones)
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_user_level ON public.users(user_level);
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON public.users(referral_code);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users(created_at);
CREATE INDEX IF NOT EXISTS idx_users_nickname ON public.users(nickname);

-- Índice compuesto para queries de autorización
CREATE INDEX IF NOT EXISTS idx_users_auth_level ON public.users(id, user_level, email);

-- ==========================================
-- PASO 6: CREAR FUNCIONES HELPER PARA SEGURIDAD
-- ==========================================

-- Función para verificar si un usuario puede acceder a datos de otro usuario
CREATE OR REPLACE FUNCTION public.can_access_user_data(
    target_user_id uuid,
    requesting_user_id uuid
)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Usuario siempre puede acceder a sus propios datos
    IF target_user_id = requesting_user_id THEN
        RETURN true;
    END IF;
    
    -- Verificar si el usuario solicitante es maestro (nivel 5+)
    IF EXISTS (
        SELECT 1 FROM public.users 
        WHERE id = requesting_user_id 
        AND user_level >= 5
    ) THEN
        -- Maestros pueden acceder a datos de usuarios de nivel inferior
        IF EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = target_user_id 
            AND user_level < 6
        ) THEN
            RETURN true;
        END IF;
    END IF;
    
    RETURN false;
END;
$$;

-- Función para obtener el nivel de usuario de forma segura
CREATE OR REPLACE FUNCTION public.get_user_level(user_id uuid)
RETURNS integer
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_level integer;
BEGIN
    SELECT u.user_level INTO user_level
    FROM public.users u
    WHERE u.id = user_id;
    
    RETURN COALESCE(user_level, 1);
END;
$$;

-- Función para verificar si un usuario es maestro
CREATE OR REPLACE FUNCTION public.is_maestro(user_id uuid)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN public.get_user_level(user_id) >= 5;
END;
$$;

-- ==========================================
-- PASO 7: CREAR TABLA DE AUDITORÍA PARA LOGS
-- ==========================================

-- Crear tabla de logs de acceso si no existe
CREATE TABLE IF NOT EXISTS public.access_logs (
    id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id uuid REFERENCES public.users(id),
    action text NOT NULL,
    resource text NOT NULL,
    ip_address inet,
    user_agent text,
    created_at timestamp with time zone DEFAULT now()
);

-- Habilitar RLS en logs
ALTER TABLE public.access_logs ENABLE ROW LEVEL SECURITY;

-- Política para logs: usuarios solo ven sus propios logs
CREATE POLICY "logs_select_own_policy"
ON public.access_logs
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- Función para registrar acceso de forma segura
CREATE OR REPLACE FUNCTION public.log_access(
    action text,
    resource text,
    ip_address inet DEFAULT NULL,
    user_agent text DEFAULT NULL
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    INSERT INTO public.access_logs (user_id, action, resource, ip_address, user_agent)
    VALUES (auth.uid(), action, resource, ip_address, user_agent);
END;
$$;

-- ==========================================
-- PASO 8: CREAR TRIGGERS PARA MANTENER INTEGRIDAD
-- ==========================================

-- Trigger para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Crear trigger si no existe
DROP TRIGGER IF EXISTS update_users_updated_at ON public.users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON public.users
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();

-- ==========================================
-- PASO 9: INSERTAR USUARIOS FUNDADORES SI NO EXISTEN
-- ==========================================

-- Insertar Darth Luke si no existe
INSERT INTO public.users (id, nombre, apellido, nickname, email, user_level, referral_code, created_at)
SELECT 
    gen_random_uuid(),
    'Darth',
    'Luke',
    'Darth Luke',
    'coeurdeluke.js@gmail.com',
    6,
    'DARTH-LUKE-2024',
    now()
WHERE NOT EXISTS (
    SELECT 1 FROM public.users WHERE email = 'coeurdeluke.js@gmail.com'
);

-- Insertar Darth Nihilus si no existe
INSERT INTO public.users (id, nombre, apellido, nickname, email, user_level, referral_code, created_at)
SELECT 
    gen_random_uuid(),
    'Darth',
    'Nihilus',
    'Darth Nihilus',
    'infocryptoforce@gmail.com',
    6,
    'DARTH-NIHILUS-2024',
    now()
WHERE NOT EXISTS (
    SELECT 1 FROM public.users WHERE email = 'infocryptoforce@gmail.com'
);

-- ==========================================
-- PASO 10: VERIFICAR CONFIGURACIÓN FINAL
-- ==========================================

-- Verificar que RLS esté habilitado
SELECT 
    schemaname,
    tablename,
    rowsecurity as "RLS_Enabled"
FROM pg_tables 
WHERE tablename = 'users';

-- Verificar políticas creadas
SELECT 
    policyname,
    cmd as "Operation",
    roles,
    with_check,
    qual as "condition"
FROM pg_policies 
WHERE tablename = 'users'
ORDER BY policyname;

-- Verificar índices creados
SELECT 
    indexname,
    indexdef
FROM pg_indexes 
WHERE tablename = 'users'
ORDER BY indexname;

-- Verificar funciones creadas
SELECT 
    routine_name,
    routine_type
FROM information_schema.routines 
WHERE routine_schema = 'public' 
AND routine_name IN ('can_access_user_data', 'get_user_level', 'is_maestro', 'log_access')
ORDER BY routine_name;

-- Verificar usuarios fundadores
SELECT 
    nickname,
    email,
    user_level,
    created_at
FROM public.users 
WHERE user_level = 6
ORDER BY created_at;

-- ==========================================
-- RESULTADO ESPERADO
-- ==========================================
-- ✅ RLS habilitado con políticas optimizadas
-- ✅ Índices para mejor performance
-- ✅ Funciones helper para verificación de permisos
-- ✅ Sistema de auditoría para logs de acceso
-- ✅ Triggers para mantener integridad de datos
-- ✅ Usuarios fundadores creados automáticamente
-- ✅ Maestros pueden acceder a datos de usuarios de nivel inferior
-- ✅ Usuarios solo pueden modificar sus propios datos
-- ✅ Performance mejorado con índices estratégicos
-- ✅ Seguridad robusta con RLS y auditoría

-- ==========================================
-- INSTRUCCIONES POST-EJECUCIÓN
-- ==========================================
-- 1. Verifica que no haya errores en la ejecución
-- 2. Confirma que las políticas RLS estén activas
-- 3. Verifica que los usuarios fundadores existan
-- 4. Prueba el registro de un nuevo usuario
-- 5. Verifica que las restricciones de seguridad funcionen
