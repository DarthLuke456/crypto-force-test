-- Agregar columnas faltantes a la tabla feedback si no existen
-- Ejecutar en Supabase SQL Editor

-- Verificar y agregar columna response
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'feedback' AND column_name = 'response') THEN
        ALTER TABLE feedback ADD COLUMN response TEXT;
    END IF;
END $$;

-- Verificar y agregar columna response_by
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'feedback' AND column_name = 'response_by') THEN
        ALTER TABLE feedback ADD COLUMN response_by UUID;
    END IF;
END $$;

-- Verificar y agregar columna response_at
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'feedback' AND column_name = 'response_at') THEN
        ALTER TABLE feedback ADD COLUMN response_at TIMESTAMPTZ;
    END IF;
END $$;

-- Verificar y agregar columna status
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'feedback' AND column_name = 'status') THEN
        ALTER TABLE feedback ADD COLUMN status TEXT DEFAULT 'pending';
    END IF;
END $$;

-- Verificar y agregar columna updated_at
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'feedback' AND column_name = 'updated_at') THEN
        ALTER TABLE feedback ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();
    END IF;
END $$;

-- Verificar estructura final
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'feedback' 
ORDER BY ordinal_position;
