-- Probar la consulta exacta que usa la API
-- Primero verificar si la tabla feedback_responses existe
SELECT table_name 
FROM information_schema.tables 
WHERE table_name = 'feedback_responses';

-- Probar la consulta con JOIN a feedback_responses
SELECT 
    f.id,
    f.message,
    f.response,
    f.response_by,
    f.response_at,
    f.status,
    f.created_at,
    f.updated_at,
    fr.id as response_id,
    fr.response_text,
    fr.response_by as fr_response_by,
    fr.response_by_email,
    fr.created_at as fr_created_at
FROM feedback f
LEFT JOIN feedback_responses fr ON f.id = fr.feedback_id
WHERE f.email = 'keepcalmandgoahead.58@gmail.com'
ORDER BY f.created_at DESC;

-- Probar la consulta simple sin JOIN (como estaba antes)
SELECT 
    id,
    message,
    response,
    response_by,
    response_at,
    status,
    created_at,
    updated_at
FROM feedback 
WHERE email = 'keepcalmandgoahead.58@gmail.com'
ORDER BY created_at DESC;
