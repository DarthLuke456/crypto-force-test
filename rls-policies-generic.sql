-- =====================================================
-- POLÍTICAS RLS GENÉRICAS PARA REFERRAL_HISTORY
-- =====================================================
-- Este script crea políticas RLS adaptables a diferentes estructuras de tabla

-- Primero, eliminar políticas existentes si las hay
DROP POLICY IF EXISTS "Users can view their own referral history" ON public.referral_history;
DROP POLICY IF EXISTS "Users can insert their own referral history" ON public.referral_history;
DROP POLICY IF EXISTS "Users can update their own referral history" ON public.referral_history;
DROP POLICY IF EXISTS "Users can delete their own referral history" ON public.referral_history;

-- Habilitar RLS en la tabla
ALTER TABLE public.referral_history ENABLE ROW LEVEL SECURITY;

-- OPCIÓN 1: Si la tabla tiene columnas referrer_id y referred_id
-- (Esta es la estructura más común para tablas de referencias)

-- Política para SELECT - usuarios pueden ver referencias donde son referrer o referred
CREATE POLICY "Users can view their own referral history" ON public.referral_history
    FOR SELECT USING (
        auth.uid() = referrer_id OR 
        auth.uid() = referred_id
    );

-- Política para INSERT - usuarios solo pueden crear referencias donde son el referrer
CREATE POLICY "Users can insert their own referral history" ON public.referral_history
    FOR INSERT WITH CHECK (auth.uid() = referrer_id);

-- Política para UPDATE - usuarios solo pueden actualizar referencias donde son el referrer
CREATE POLICY "Users can update their own referral history" ON public.referral_history
    FOR UPDATE USING (auth.uid() = referrer_id);

-- Política para DELETE - usuarios solo pueden eliminar referencias donde son el referrer
CREATE POLICY "Users can delete their own referral history" ON public.referral_history
    FOR DELETE USING (auth.uid() = referrer_id);

-- =====================================================
-- ALTERNATIVAS SEGÚN ESTRUCTURA DE TABLA
-- =====================================================

-- OPCIÓN 2: Si la tabla tiene una columna user_id
-- (Descomenta y usa esta opción si la tabla tiene user_id)

/*
-- Eliminar políticas anteriores
DROP POLICY IF EXISTS "Users can view their own referral history" ON public.referral_history;
DROP POLICY IF EXISTS "Users can insert their own referral history" ON public.referral_history;
DROP POLICY IF EXISTS "Users can update their own referral history" ON public.referral_history;
DROP POLICY IF EXISTS "Users can delete their own referral history" ON public.referral_history;

-- Políticas con user_id
CREATE POLICY "Users can view their own referral history" ON public.referral_history
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own referral history" ON public.referral_history
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own referral history" ON public.referral_history
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own referral history" ON public.referral_history
    FOR DELETE USING (auth.uid() = user_id);
*/

-- OPCIÓN 3: Si la tabla tiene una columna created_by
-- (Descomenta y usa esta opción si la tabla tiene created_by)

/*
-- Eliminar políticas anteriores
DROP POLICY IF EXISTS "Users can view their own referral history" ON public.referral_history;
DROP POLICY IF EXISTS "Users can insert their own referral history" ON public.referral_history;
DROP POLICY IF EXISTS "Users can update their own referral history" ON public.referral_history;
DROP POLICY IF EXISTS "Users can delete their own referral history" ON public.referral_history;

-- Políticas con created_by
CREATE POLICY "Users can view their own referral history" ON public.referral_history
    FOR SELECT USING (auth.uid() = created_by);

CREATE POLICY "Users can insert their own referral history" ON public.referral_history
    FOR INSERT WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update their own referral history" ON public.referral_history
    FOR UPDATE USING (auth.uid() = created_by);

CREATE POLICY "Users can delete their own referral history" ON public.referral_history
    FOR DELETE USING (auth.uid() = created_by);
*/

-- =====================================================
-- VERIFICACIÓN DE POLÍTICAS CREADAS
-- =====================================================

-- Verificar que las políticas se crearon correctamente
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'referral_history' 
  AND schemaname = 'public'
ORDER BY policyname;

-- Verificar que RLS está habilitado
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE tablename = 'referral_history' 
  AND schemaname = 'public';



