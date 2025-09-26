-- Script simplificado para desactivar la protección de fundadores
-- Ejecutar este script para permitir edición entre fundadores

-- 1. Desactivar el trigger de protección
DROP TRIGGER IF EXISTS founder_protection_trigger ON public.users;

-- 2. Verificar que esté desactivado
SELECT 'Protección desactivada - Los fundadores pueden editar información de cada uno' as status;
