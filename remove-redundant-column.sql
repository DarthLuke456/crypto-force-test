-- Script para eliminar la columna redundante 'codigo_referido'
-- Esta columna es redundante con 'referral_code' y puede causar conflictos

-- Verificar la estructura actual
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND table_schema = 'public'
AND column_name IN ('codigo_referido', 'referral_code');

-- Eliminar la columna redundante
ALTER TABLE public.users DROP COLUMN IF EXISTS codigo_referido;

-- Verificar que se eliminó correctamente
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND table_schema = 'public'
AND column_name IN ('codigo_referido', 'referral_code');

-- Verificar que referral_code tiene los datos correctos
SELECT nickname, referral_code, user_level 
FROM public.users 
ORDER BY user_level, created_at;
