# Sistema de Tracking de Actividad de Usuarios - Crypto Force

## Resumen del Sistema

Este sistema implementa un tracking en tiempo real de usuarios activos y registros diarios para el dashboard de Analytics de Crypto Force.

## Características Principales

### 1. **Usuarios Activos en Tiempo Real**
- **Heartbeat automático**: Los usuarios envían un "latido" cada 30 segundos
- **Tracking de sesiones**: Se rastrea cuándo los usuarios están realmente activos
- **Actualización automática**: Los datos se actualizan cada 30 segundos en el dashboard
- **Estado online/offline**: Los usuarios se marcan como offline después de 15 minutos de inactividad

### 2. **Registros por Día Precisos**
- **Registros Hoy**: Cuenta exacta de usuarios registrados hoy
- **Registros Ayer**: Cuenta exacta de usuarios registrados ayer
- **Cálculo preciso**: Usa rangos de fecha exactos (00:00:00 - 23:59:59)

### 3. **Dashboard en Tiempo Real**
- **Actualización automática**: Los datos se refrescan cada 30 segundos
- **Botón de refresh manual**: Permite actualizar datos inmediatamente
- **Indicador de estado**: Muestra cuándo se están actualizando los datos
- **Timestamp de última actualización**: Muestra cuándo se actualizaron los datos por última vez

## Implementación Técnica

### 1. **Base de Datos (Supabase)**

#### Script SQL (`add-activity-tracking.sql`)
```sql
-- Agregar columnas para tracking
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS last_activity TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS is_online BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS session_start TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_users_last_activity ON users(last_activity);
CREATE INDEX IF NOT EXISTS idx_users_is_online ON users(is_online);
```

#### Funciones y Triggers
- **Trigger automático**: Actualiza `last_activity` en cada UPDATE
- **Función de limpieza**: Marca usuarios como offline después de 15 min de inactividad

### 2. **API Endpoints**

#### `/api/user/heartbeat` (POST)
- **Propósito**: Recibe latidos de actividad del usuario
- **Frecuencia**: Cada 30 segundos
- **Acción**: Actualiza `last_activity` e `is_online` en la tabla users

#### `/api/user/logout` (POST)
- **Propósito**: Marca usuario como offline al cerrar sesión
- **Acción**: Actualiza `is_online = false` y `last_activity`

#### `/api/maestro/real-stats` (GET)
- **Propósito**: Proporciona métricas en tiempo real
- **Datos**: Usuarios activos, registros por día, estadísticas de referidos
- **Frecuencia**: Se actualiza cada 30 segundos

### 3. **Frontend (React/Next.js)**

#### Hook Personalizado (`useHeartbeat`)
```typescript
export const useHeartbeat = () => {
  // Envía heartbeat cada 30 segundos
  // Actualiza estado online del usuario
};
```

#### Página de Analytics
- **Estado en tiempo real**: Muestra datos actualizados cada 30 segundos
- **Refresh manual**: Botón para actualizar datos inmediatamente
- **Indicadores visuales**: Muestra estado de actualización y timestamp

## Flujo de Funcionamiento

### 1. **Usuario Abre Dashboard**
1. Se ejecuta `useHeartbeat()`
2. Se envía primer heartbeat inmediatamente
3. Se configura intervalo de 30 segundos

### 2. **Heartbeat Automático**
1. Cada 30 segundos se envía POST a `/api/user/heartbeat`
2. Se actualiza `last_activity` en la base de datos
3. Se marca `is_online = true`

### 3. **Dashboard Analytics**
1. Se obtienen datos de `/api/maestro/real-stats`
2. Se actualiza estado local cada 30 segundos
3. Se muestran métricas en tiempo real

### 4. **Usuario Cierra Sesión**
1. Se ejecuta POST a `/api/user/logout`
2. Se marca `is_online = false`
3. Se actualiza `last_activity`
4. Se cierra sesión de Supabase

### 5. **Limpieza Automática**
1. Función `mark_inactive_users_offline()` se ejecuta cada 5 minutos
2. Marca como offline usuarios con más de 15 min de inactividad

## Configuración Requerida

### 1. **Ejecutar Script SQL**
```bash
# En Supabase SQL Editor, ejecutar:
# add-activity-tracking.sql
```

### 2. **Verificar Variables de Entorno**
```env
NEXT_PUBLIC_SUPABASE_URL=tu_url_supabase
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
```

### 3. **Habilitar pg_cron (Opcional)**
```sql
-- Para limpieza automática cada 5 minutos
SELECT cron.schedule('mark-inactive-users', '*/5 * * * *', 'SELECT mark_inactive_users_offline();');
```

## Métricas Disponibles

### **Tarjetas Principales**
1. **Total Usuarios**: Número total de usuarios registrados
2. **Usuarios Activos**: Usuarios con actividad en los últimos 15 minutos
3. **Registros Hoy**: Usuarios registrados hoy (00:00:00 - 23:59:59)
4. **Registros Ayer**: Usuarios registrados ayer
5. **Con Referidos**: Usuarios que han referido a otros

### **Estadísticas de Referidos**
- Total Referidos
- Usuarios Referidos
- Tasa de Conversión

### **Estado del Sistema**
- Estado del sistema
- Última actualización

## Ventajas del Sistema

### 1. **Precisión**
- **Tiempo real**: Los datos se actualizan cada 30 segundos
- **Cálculo exacto**: Fechas precisas para registros diarios
- **Estado real**: Usuarios realmente activos, no estimaciones

### 2. **Performance**
- **Índices optimizados**: Consultas rápidas a la base de datos
- **Actualización incremental**: Solo se actualizan datos necesarios
- **Caché inteligente**: Evita consultas innecesarias

### 3. **Escalabilidad**
- **Arquitectura distribuida**: Cada usuario maneja su propio heartbeat
- **Limpieza automática**: Sistema se mantiene limpio automáticamente
- **Fallbacks robustos**: Múltiples niveles de fallback para datos

## Monitoreo y Debugging

### 1. **Logs del Sistema**
```typescript
// En cada endpoint
console.log('Heartbeat recibido:', user.email);
console.log('Usuarios activos:', activeUsers);
```

### 2. **Métricas de Performance**
- Tiempo de respuesta de heartbeat
- Número de usuarios activos
- Frecuencia de actualizaciones

### 3. **Alertas (Futuro)**
- Usuarios offline inesperados
- Errores en heartbeat
- Problemas de conectividad

## Próximas Mejoras

### 1. **Sistema de Notificaciones**
- Alertas cuando usuarios se desconectan
- Notificaciones de actividad anómala

### 2. **Analytics Avanzados**
- Gráficos de actividad por hora
- Patrones de uso de usuarios
- Predicciones de carga

### 3. **Integración con WebSockets**
- Actualizaciones en tiempo real sin polling
- Notificaciones push para eventos importantes

## Troubleshooting

### **Problema**: Usuarios no aparecen como activos
**Solución**: Verificar que el script SQL se ejecutó correctamente

### **Problema**: Heartbeat no funciona
**Solución**: Verificar que el endpoint `/api/user/heartbeat` esté accesible

### **Problema**: Datos no se actualizan
**Solución**: Verificar que `useHeartbeat` esté importado en la página

### **Problema**: Performance lenta
**Solución**: Verificar que los índices de la base de datos estén creados

## Conclusión

Este sistema proporciona un tracking preciso y en tiempo real de la actividad de usuarios, permitiendo que el dashboard de Analytics muestre información real y actualizada constantemente. La implementación es robusta, escalable y fácil de mantener.
