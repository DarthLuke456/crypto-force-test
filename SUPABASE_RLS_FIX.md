# Solución para Errores de RLS (Row Level Security) en Supabase

## 🚨 Problema
Si estás viendo este error:
```
Error de permisos: La tabla users tiene restricciones de seguridad. Contacta al administrador para configurar las políticas RLS.
```

Esto significa que la tabla `users` en Supabase tiene **Row Level Security (RLS)** habilitado, pero faltan las políticas necesarias para permitir el registro de nuevos usuarios.

## ✅ Solución Rápida

### Paso 1: Acceder a Supabase
1. Ve a [supabase.com](https://supabase.com)
2. Inicia sesión en tu cuenta
3. Selecciona tu proyecto
4. Ve a la sección **SQL Editor** en el menú lateral

### Paso 2: Ejecutar el Script de Corrección
1. En el SQL Editor, copia y pega todo el contenido del archivo `fix-rls-complete.sql`
2. Haz clic en **RUN** para ejecutar el script
3. Verifica que se ejecute sin errores

### Paso 3: Verificar la Corrección
Después de ejecutar el script, deberías ver:
- ✅ RLS habilitado en la tabla users
- ✅ Políticas creadas para INSERT, SELECT, UPDATE, DELETE
- ✅ Permisos otorgados a los roles `anon` y `authenticated`

## 🔍 ¿Qué hace el script?

El script `fix-rls-complete.sql` realiza las siguientes acciones:

1. **Limpia políticas existentes** que puedan estar causando conflictos
2. **Habilita RLS** en la tabla users
3. **Otorga permisos** necesarios a los roles anon y authenticated
4. **Crea políticas específicas**:
   - `users_insert_anon_policy`: Permite a usuarios anónimos registrarse
   - `users_select_own_policy`: Permite a usuarios autenticados ver solo sus datos
   - `users_update_own_policy`: Permite a usuarios actualizar solo sus datos
   - `users_delete_own_policy`: Permite a usuarios eliminar solo sus datos
5. **Agrega columnas adicionales** (id, created_at, updated_at) si no existen
6. **Verifica la configuración** final

## 🧪 Probar la Solución

Una vez ejecutado el script, intenta registrar un nuevo usuario desde la aplicación. El error debería desaparecer y el registro debería funcionar correctamente.

## 🔧 Configuración de Variables de Entorno

Asegúrate de que tu archivo `.env.local` tenga las variables correctas:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui
SUPABASE_SERVICE_ROLE_KEY=tu-service-role-key-aqui
NODE_ENV=development
```

## 📊 Entender RLS (Row Level Security)

**RLS** es una característica de seguridad de PostgreSQL que permite controlar qué filas puede ver/modificar cada usuario. En nuestro caso:

- **Sin RLS**: Cualquiera puede acceder a todos los datos
- **Con RLS + Políticas**: Solo usuarios autorizados pueden acceder a datos específicos
- **Con RLS sin políticas**: Nadie puede acceder a los datos (causa el error)

## 🆘 Solución de Problemas

### Error persiste después de ejecutar el script
1. Verifica que el script se ejecutó completamente sin errores
2. Revisa que las variables de entorno estén configuradas correctamente
3. Asegúrate de estar usando la URL y keys correctas de Supabase

### Error de "columna no encontrada"
El script automáticamente crea las columnas necesarias. Si hay problemas:
1. Verifica la estructura de tu tabla con: `SELECT * FROM information_schema.columns WHERE table_name = 'users';`
2. Ejecuta manualmente las secciones de creación de columnas del script

### Error de permisos en Supabase
Asegúrate de que tu usuario tiene permisos de administrador en el proyecto de Supabase.

## 🎯 Resultado Esperado

Después de aplicar la solución:
- ✅ Los usuarios pueden registrarse sin errores
- ✅ Los datos están seguros con RLS
- ✅ Cada usuario solo puede ver/editar sus propios datos
- ✅ La aplicación funciona correctamente

---

**¿Necesitas ayuda adicional?** 
Revisa los logs de la consola para errores específicos o contacta al equipo de desarrollo.
