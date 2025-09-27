-- ========================================
-- AGREGAR COLUMNA BIO A LA TABLA USERS
-- ========================================

-- 1. Verificar estructura actual de la tabla users
SELECT column_name, data_type, character_maximum_length, is_nullable
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;

-- 2. Agregar columna bio a la tabla users
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS bio TEXT;

-- 3. Agregar comentario a la columna
COMMENT ON COLUMN users.bio IS 'Descripción corta del usuario (biografía)';

-- 4. Verificar que la columna se agregó correctamente
SELECT column_name, data_type, character_maximum_length, is_nullable
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name = 'bio';

-- 5. Agregar algunos ejemplos de bio para usuarios existentes
UPDATE users 
SET bio = 'Fundador y CEO de CryptoForce. Experto en blockchain y criptomonedas.'
WHERE email = 'coeurdeluke.js@gmail.com';

UPDATE users 
SET bio = 'Co-fundador de CryptoForce. Especialista en tecnología y desarrollo.'
WHERE email = 'infocryptoforce@gmail.com';

-- 6. Verificar los datos actualizados
SELECT email, nickname, bio 
FROM users 
WHERE email IN ('coeurdeluke.js@gmail.com', 'infocryptoforce@gmail.com');

-- 7. Mostrar estructura final de la tabla
SELECT column_name, data_type, character_maximum_length, is_nullable
FROM information_schema.columns 
WHERE table_name = 'users' 
ORDER BY ordinal_position;
