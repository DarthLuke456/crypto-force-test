-- =============================================
-- QUERY DE EMERGENCIA - FIX COMPLETO
-- =============================================

-- ESTA QUERY CORRIGE TODO DE UNA VEZ
-- Ejecuta esta si nada más funciona

-- 1. FORZAR NIVEL 0 PARA USUARIOS FUNDADORES
UPDATE public.users 
SET 
    user_level = 0,
    updated_at = NOW()
WHERE email IN ('coeurdeluke.js@gmail.com', 'infocryptoforce@gmail.com');

-- 2. VERIFICAR QUE SE APLICÓ CORRECTAMENTE
SELECT 
    email,
    nickname,
    user_level,
    updated_at,
    'FUNDADOR' as tipo_usuario
FROM public.users 
WHERE email IN ('coeurdeluke.js@gmail.com', 'infocryptoforce@gmail.com');

-- 3. VERIFICAR QUE NO HAY CONFLICTOS
SELECT 
    COUNT(*) as total_usuarios_nivel_0
FROM public.users 
WHERE user_level = 0;

-- =============================================
-- DESPUÉS DE EJECUTAR ESTA QUERY:
-- =============================================
-- 1. Limpia el cache del navegador
-- 2. Borra localStorage y sessionStorage
-- 3. Recarga la página
-- 4. El usuario debería ver MAESTRO como nivel actual
-- =============================================
