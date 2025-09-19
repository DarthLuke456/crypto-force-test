-- =====================================================
-- CHECK: Estructura de la tabla users
-- =====================================================

-- Verificar estructura de la tabla users
SELECT 
    column_name,
    data_type,
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
  AND table_schema = 'public'
ORDER BY ordinal_position;

-- Verificar si existen las columnas problemáticas
SELECT 
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'movil'
    ) THEN '✅ movil existe' ELSE '❌ movil NO existe' END as movil_status,
    
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'exchange'
    ) THEN '✅ exchange existe' ELSE '❌ exchange NO existe' END as exchange_status,
    
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'uid'
    ) THEN '✅ uid existe' ELSE '❌ uid NO existe' END as uid_status,
    
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'codigo_referido'
    ) THEN '✅ codigo_referido existe' ELSE '❌ codigo_referido NO existe' END as codigo_referido_status,
    
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'referred_by'
    ) THEN '✅ referred_by existe' ELSE '❌ referred_by NO existe' END as referred_by_status,
    
    CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'users' AND column_name = 'total_referrals'
    ) THEN '✅ total_referrals existe' ELSE '❌ total_referrals NO existe' END as total_referrals_status;
