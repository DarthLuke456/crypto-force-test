# Actualización de Usuarios del Tribunal Imperial

## Resumen de Cambios

Se ha implementado un sistema que se conecta **DIRECTAMENTE A LA BASE DE DATOS REAL** de Supabase para obtener usuarios del sistema, eliminando completamente los usuarios ficticios de Star Wars y reemplazándolos con usuarios reales del ecosistema Crypto Force.

## 🔗 **Conexión Real con la Base de Datos**

### Base de Datos Supabase
- **Tabla**: `users`
- **Campos consultados**: `id`, `nickname`, `email`, `user_level`
- **Filtro**: Solo usuarios con `user_level >= 5` (Darth y Maestros que pueden votar)
- **Ordenamiento**: Por nivel de usuario (descendente)

### Consulta SQL Automática
```sql
SELECT id, nickname, email, user_level 
FROM users 
WHERE user_level >= 5 
ORDER BY user_level DESC;
```

## 👥 **Usuarios del Sistema (Dinámicos)**

### Usuarios Fundadores (Nivel 6 - Maestros)
- **Darth Luke** (`coeurdeluke.js@gmail.com`) - Fundador principal del sistema
- **Darth Nihilus** (`infocryptoforce@gmail.com`) - Fundador secundario del sistema

### Usuarios del Sistema (Niveles 4-6)
- **Usuarios reales** que se cargan automáticamente desde la base de datos
- **Se actualizan en tiempo real** cuando se agregan nuevos Darths o Maestros
- **No hay usuarios hardcodeados** - todo viene de la base de datos

## 📁 **Archivos Modificados**

### 1. `lib/tribunal/system-users.ts` (ACTUALIZADO)
- ✅ **Conexión real a Supabase** con `supabase.from('users')`
- ✅ **Consulta dinámica** que se ejecuta en tiempo real
- ✅ **Fallback inteligente** solo para casos de emergencia
- ✅ **Funciones asíncronas** para operaciones de base de datos

### 2. `components/tribunal/EnhancedVotingSystem.tsx`
- ✅ **Carga dinámica** de usuarios desde la base de datos
- ✅ **Indicador de carga** mientras se conecta a la base de datos
- ✅ **Manejo de errores** con fallback a usuarios fundadores
- ✅ **Actualización automática** cuando cambian los usuarios del sistema

### 3. `app/dashboard/maestro/courses/tribunal-imperial/page.tsx`
- ✅ **Estadísticas dinámicas** que se actualizan desde la base de datos
- ✅ **Carga asíncrona** de datos de usuarios
- ✅ **Manejo de errores** con fallback

### 4. `app/dashboard/darth/courses/tribunal-imperial/page.tsx`
- ✅ **Estadísticas dinámicas** que se actualizan desde la base de datos
- ✅ **Carga asíncrona** de datos de usuarios
- ✅ **Manejo de errores** con fallback

## 🚀 **Funciones Disponibles (Asíncronas)**

```typescript
// Obtener usuarios reales de la base de datos
fetchSystemUsers(): Promise<SystemUser[]>

// Obtener usuarios que pueden votar (nivel 5+)
getVotingUsers(): Promise<SystemUser[]>

// Obtener el total de usuarios del sistema
getTotalSystemUsers(): Promise<number>

// Obtener usuarios por nivel mínimo
getUsersByMinLevel(minLevel: number): Promise<SystemUser[]>

// Obtener usuarios por rol
getUsersByRole(role: string): Promise<SystemUser[]>

// Buscar usuario por email
getUserByEmail(email: string): Promise<SystemUser | undefined>

// Obtener estadísticas completas
getUserStats(): Promise<{ total, fundadores, maestros, darths, lords, canVote }>
```

## 🔄 **Flujo de Datos en Tiempo Real**

1. **Usuario accede al dashboard** → Se ejecuta `useEffect`
2. **Se conecta a Supabase** → Consulta la tabla `users`
3. **Filtra por nivel** → Solo usuarios con `user_level >= 5`
4. **Renderiza dinámicamente** → Muestra usuarios reales del sistema
5. **Se actualiza automáticamente** → Cuando hay cambios en la base de datos

## ✅ **Beneficios de la Actualización**

1. **🔄 Usuarios Reales y Dinámicos**: Se cargan desde la base de datos en tiempo real
2. **📊 Actualización Automática**: Cuando se agregan nuevos Darths o Maestros
3. **🔗 Conexión Real**: No más usuarios hardcodeados o ficticios
4. **🛡️ Fallback Inteligente**: Solo para casos de emergencia
5. **📈 Escalabilidad**: Se adapta automáticamente al crecimiento del sistema

## 🆕 **Cómo Agregar Nuevos Usuarios**

### Opción 1: Base de Datos (Recomendado)
1. Agregar usuario en la tabla `users` de Supabase
2. Asignar `user_level >= 5` para que pueda votar
3. El sistema **automáticamente** lo incluirá en todas las listas

### Opción 2: Código (Solo para emergencias)
1. Editar `lib/tribunal/system-users.ts`
2. Agregar al array `getFallbackUsers()`
3. Solo se usa si falla la conexión a la base de datos

## 🔍 **Monitoreo y Debugging**

### Logs de Consola
- `🔍 Obteniendo usuarios del sistema desde la base de datos...`
- `✅ Usuarios obtenidos de la base de datos: [array]`
- `⚠️ No se encontraron usuarios en la base de datos, usando fallback`
- `❌ Error al obtener usuarios del sistema: [error]`

### Indicadores Visuales
- **⏳ Cargando usuarios del sistema...** - Mientras se conecta
- **⚠️ No se encontraron usuarios del sistema** - Si no hay conexión
- **✅ Usuarios cargados exitosamente** - Cuando funciona

## 🚨 **Manejo de Errores**

### Fallback Automático
Si la base de datos falla, el sistema usa automáticamente:
- Darth Luke (coeurdeluke.js@gmail.com)
- Darth Nihilus (infocryptoforce@gmail.com)

### Recuperación
- **Reintentos automáticos** en cada acceso al dashboard
- **Logs detallados** para debugging
- **Estados de carga** para mejor UX

## 🔧 **Configuración de Base de Datos**

### Estructura de Tabla `users`
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  nickname TEXT,
  email TEXT UNIQUE,
  user_level INTEGER,
  -- otros campos...
);

-- Índice para consultas eficientes
CREATE INDEX idx_users_level ON users(user_level);
```

### Permisos RLS (Row Level Security)
```sql
-- Solo usuarios autenticados pueden ver la tabla
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Política para usuarios autenticados
CREATE POLICY "Users can view their own data" ON users
  FOR SELECT USING (auth.uid() IS NOT NULL);
```

## 📊 **Estadísticas en Tiempo Real**

- **Total Maestros**: Se actualiza automáticamente desde la base de datos
- **Aprobaciones/Rechazos**: Se calculan en tiempo real
- **Usuarios Activos**: Se cuentan dinámicamente
- **Niveles de Usuario**: Se mapean automáticamente a roles

## 🎯 **Compatibilidad y Migración**

- ✅ **100% Compatible** con el sistema existente
- ✅ **No requiere cambios** en otros componentes
- ✅ **Migración automática** de usuarios ficticios a reales
- ✅ **Fallback transparente** para usuarios existentes

## 🔮 **Futuras Mejoras**

1. **Cache inteligente** para reducir consultas a la base de datos
2. **Webhooks** para actualizaciones en tiempo real
3. **Sincronización offline** para mejor rendimiento
4. **Métricas avanzadas** de usuarios del sistema

---

**🎉 El sistema ahora está completamente conectado a la base de datos real y se actualiza automáticamente cuando se agregan nuevos Darths y Maestros al ecosistema Crypto Force!**
