-- Script para limpiar usuarios existentes en Supabase
-- Ejecutar en el SQL Editor de Supabase

-- 1. Eliminar usuarios existentes
DELETE FROM public.users WHERE email IN ('infocryptoforce@gmail.com', 'coeurdeluke.js@gmail.com');

-- 2. Verificar que se eliminaron
SELECT * FROM public.users;

-- 3. Verificar que la tabla esté limpia
SELECT COUNT(*) as total_usuarios FROM public.users;
