-- Verificar feedbacks por email específico
SELECT 
    id,
    email,
    nickname,
    subject,
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

-- Verificar todos los emails únicos en la tabla feedback
SELECT DISTINCT email, COUNT(*) as total_feedbacks
FROM feedback 
GROUP BY email
ORDER BY total_feedbacks DESC;

-- Verificar si hay feedbacks con user_id null
SELECT 
    id,
    email,
    user_id,
    nickname,
    subject,
    message,
    response,
    response_by,
    response_at,
    status,
    created_at
FROM feedback 
WHERE user_id IS NULL
ORDER BY created_at DESC;
