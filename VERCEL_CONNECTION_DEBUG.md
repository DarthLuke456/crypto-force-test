# 🔍 DIAGNÓSTICO DE CONEXIÓN VERCEL-SUPABASE

## Problema Identificado:
**ERROR ESPECÍFICO**: `"infinite recursion detected in policy for relation users"`

Las variables de entorno están correctas, pero hay un **error de recursión infinita en las políticas RLS** de la tabla `users`. Este es un problema de configuración de las políticas de seguridad.

## 🔧 Solución Paso a Paso:

### Paso 1: Ejecutar Reset Completo de RLS
**EJECUTA ESTE SCRIPT INMEDIATAMENTE** en Supabase SQL Editor:

```sql
-- Copia y pega el contenido de: scripts/emergency-rls-reset.sql
```

Este script hace un reset completo de RLS eliminando todas las políticas problemáticas y recreándolas desde cero.

### Paso 2: Probar Endpoint de Debug
Después de ejecutar el script de corrección, prueba este endpoint en Vercel:

```
https://cripto-force-dashboard.vercel.app/api/debug/supabase
```

**Respuesta Esperada (después de la corrección):**
```json
{
  "success": true,
  "message": "Supabase configurado correctamente",
  "connection": "OK"
}
```

### Paso 3: Probar URLs de la Aplicación
Si el endpoint de debug muestra "connection": "OK", prueba estas URLs:

1. **Código de Referido**: `https://cripto-force-dashboard.vercel.app/dashboard/maestro/referral-code`
2. **Página de Usuarios**: `https://cripto-force-dashboard.vercel.app/dashboard/maestro/users`
3. **Dashboard Selection**: `https://cripto-force-dashboard.vercel.app/login/dashboard-selection`

## 📋 Checklist de Verificación:

- [ ] Script de corrección de recursión ejecutado
- [ ] Endpoint de debug muestra "connection": "OK"
- [ ] Código de referido muestra formato CRYPTOFORCE_NICKNAME
- [ ] Página de usuarios muestra datos reales
- [ ] Nombre de usuario aparece en dashboard-selection

## 🎯 URLs para Probar Después de las Correcciones:

1. **Debug**: `https://cripto-force-dashboard.vercel.app/api/debug/supabase`
2. **Referidos**: `https://cripto-force-dashboard.vercel.app/dashboard/maestro/referral-code`
3. **Usuarios**: `https://cripto-force-dashboard.vercel.app/dashboard/maestro/users`
4. **Dashboard**: `https://cripto-force-dashboard.vercel.app/login/dashboard-selection`

## 🚨 Si los Problemas Persisten:

1. **Revisar logs de Vercel** en tiempo real
2. **Verificar que las variables de entorno** se aplicaron correctamente
3. **Confirmar que el nuevo despliegue** se completó sin errores
4. **Probar en modo incógnito** para descartar problemas de cache

---

**⚠️ IMPORTANTE**: El problema más común es que las variables de entorno no se aplicaron correctamente en Vercel o que se necesita un nuevo despliegue.
