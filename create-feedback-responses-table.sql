-- Crear tabla para respuestas de feedback (conversación)
CREATE TABLE IF NOT EXISTS feedback_responses (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    feedback_id UUID NOT NULL REFERENCES feedback(id) ON DELETE CASCADE,
    response_text TEXT NOT NULL,
    response_by VARCHAR(255) NOT NULL,
    response_by_email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_feedback_responses_feedback_id ON feedback_responses(feedback_id);
CREATE INDEX IF NOT EXISTS idx_feedback_responses_created_at ON feedback_responses(created_at);

-- Migrar respuestas existentes a la nueva tabla
INSERT INTO feedback_responses (feedback_id, response_text, response_by, response_by_email, created_at)
SELECT 
    id as feedback_id,
    response as response_text,
    response_by,
    response_by as response_by_email,
    response_at as created_at
FROM feedback 
WHERE response IS NOT NULL AND response != '';

-- Verificar la migración
SELECT 
    f.id as feedback_id,
    f.email,
    f.subject,
    f.message,
    fr.response_text,
    fr.response_by,
    fr.created_at as response_created_at
FROM feedback f
LEFT JOIN feedback_responses fr ON f.id = fr.feedback_id
WHERE f.email = 'keepcalmandgoahead.58@gmail.com'
ORDER BY f.created_at DESC, fr.created_at ASC;
