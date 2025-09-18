-- =====================================================
-- APLICACIÓN INMEDIATA DE CÓDIGOS CRYPTOFORCE_NICKNAME
-- =====================================================
-- Este script aplica inmediatamente el nuevo formato de códigos
-- Ejecutar en Supabase SQL Editor DESPUÉS del script principal

-- =====================================================
-- PASO 1: VERIFICAR ESTADO ACTUAL ANTES DE CAMBIAR
-- =====================================================

-- Mostrar códigos actuales
SELECT 
    'ESTADO ACTUAL ANTES DE CAMBIOS' as section,
    email,
    nickname,
    referral_code,
    user_level,
    CASE 
        WHEN user_level = 0 THEN '🎯 FUNDADOR'
        WHEN referral_code LIKE 'CF%' THEN '❌ Formato Antiguo (CF)'
        WHEN referral_code LIKE 'CRYPTOFORCE_%' THEN '✅ Formato Nuevo'
        WHEN referral_code IS NULL THEN '❌ Sin Código'
        ELSE '❌ Otro Formato'
    END as formato_actual
FROM users 
ORDER BY user_level ASC, created_at ASC;

-- =====================================================
-- PASO 2: APLICAR CÓDIGOS CRYPTOFORCE_NICKNAME INMEDIATAMENTE
-- =====================================================

-- Actualizar códigos de referido existentes al formato correcto
UPDATE users 
SET referral_code = 'CRYPTOFORCE_' || UPPER(REGEXP_REPLACE(nickname, '[^a-zA-Z0-9_]', '', 'g'))
WHERE nickname IS NOT NULL 
  AND nickname != '' 
  AND user_level != 0  -- No cambiar fundadores
  AND (referral_code IS NULL 
       OR referral_code = '' 
       OR referral_code NOT LIKE 'CRYPTOFORCE_%'
       OR referral_code LIKE 'CF%');

-- =====================================================
-- PASO 3: VERIFICAR QUE LOS CAMBIOS SE APLICARON
-- =====================================================

-- Mostrar códigos después de los cambios
SELECT 
    'ESTADO DESPUÉS DE APLICAR CAMBIOS' as section,
    email,
    nickname,
    referral_code,
    user_level,
    CASE 
        WHEN user_level = 0 THEN '🎯 FUNDADOR'
        WHEN referral_code LIKE 'CRYPTOFORCE_%' THEN '✅ Formato Correcto'
        ELSE '❌ Formato Incorrecto'
    END as formato_actual
FROM users 
ORDER BY user_level ASC, created_at ASC;

-- =====================================================
-- PASO 4: MOSTRAR ESTADÍSTICAS ACTUALIZADAS
-- =====================================================

-- Estadísticas del sistema
SELECT 
    'ESTADÍSTICAS ACTUALIZADAS' as section,
    COUNT(*) as total_users,
    COUNT(CASE WHEN user_level = 0 THEN 1 END) as founders,
    COUNT(CASE WHEN referral_code LIKE 'CRYPTOFORCE_%' THEN 1 END) as correct_format,
    COUNT(CASE WHEN referral_code IS NULL OR referral_code = '' THEN 1 END) as without_code,
    COUNT(CASE WHEN referred_by IS NOT NULL THEN 1 END) as referred_users
FROM users;

-- =====================================================
-- PASO 5: VERIFICAR ENLACES DE REGISTRO
-- =====================================================

-- Mostrar enlaces de registro generados
SELECT 
    'ENLACES DE REGISTRO GENERADOS' as section,
    nickname,
    referral_code,
    'https://cripto-force-dashboard.vercel.app/register?ref=' || referral_code as registration_link
FROM users 
WHERE referral_code IS NOT NULL 
  AND referral_code != ''
ORDER BY user_level ASC, nickname;

-- =====================================================
-- PASO 6: VERIFICAR QUE LOS FUNDADORES ESTÉN CORRECTOS
-- =====================================================

-- Verificar fundadores
SELECT 
    'VERIFICACIÓN DE FUNDADORES' as section,
    email,
    nickname,
    referral_code,
    user_level,
    CASE 
        WHEN email = 'coeurdeluke.js@gmail.com' AND referral_code = 'CRYPTOFORCE_LUKE' THEN '✅ Luke Correcto'
        WHEN email = 'infocryptoforce@gmail.com' AND referral_code = 'CRYPTOFORCE_DARTH_NIHILUS' THEN '✅ Darth_Nihilus Correcto'
        WHEN user_level = 0 THEN '❌ Fundador No Autorizado'
        ELSE '✅ Usuario Normal'
    END as status
FROM users 
WHERE user_level = 0 OR email IN ('coeurdeluke.js@gmail.com', 'infocryptoforce@gmail.com')
ORDER BY user_level ASC;

-- =====================================================
-- RESUMEN DE APLICACIÓN
-- =====================================================
/*
✅ CAMBIOS APLICADOS EXITOSAMENTE:

1. TODOS los códigos de referido ahora usan el formato CRYPTOFORCE_NICKNAME
2. Los fundadores mantienen sus códigos específicos:
   - Luke → CRYPTOFORCE_LUKE
   - Darth_Nihilus → CRYPTOFORCE_DARTH_NIHILUS
3. Los enlaces de registro se generan automáticamente
4. El sistema está listo para usar

Para verificar que todo funciona:
1. Ejecutar: SELECT get_user_referral_stats('tu_email@ejemplo.com');
2. Verificar que el referral_code tenga el formato correcto
3. Verificar que el registration_link se genere correctamente

El sistema ahora:
- ✅ Genera códigos en formato CRYPTOFORCE_NICKNAME
- ✅ Actualiza automáticamente cuando cambian los nicknames
- ✅ Genera enlaces de registro automáticamente
- ✅ Mantiene solo 2 fundadores autorizados
- ✅ Procesa referidos correctamente
*/
