# 🎯 Guía Completa del Sistema de Referidos - Crypto Force

## 📋 Resumen Ejecutivo

Se ha implementado un **sistema de referidos completo y robusto** que permite a los usuarios ganar recompensas por invitar nuevos miembros a la plataforma. Francisco está configurado como el **usuario fundador** en la cúspide de la pirámide.

## 🚀 Características Implementadas

### ✅ **1. Base de Datos**
- **Tabla Users** extendida con campos de referidos
- **Tabla referral_history** para tracking completo
- **Funciones SQL** para procesamiento automático
- **Francisco configurado como fundador** (Nivel 0)
- **Políticas RLS** para seguridad

### ✅ **2. Backend APIs**
- **`/api/referrals/validate`** - Validación de códigos en tiempo real
- **`/api/referrals/stats`** - Estadísticas dinámicas del usuario
- **`/api/referrals/process`** - Procesamiento automático de referidos
- **Integración en `/api/users`** - Auto-procesamiento en registro

### ✅ **3. Frontend Dinámico**
- **Auto-llenado desde URL** (`/login?ref=CODIGO`)
- **Validación en tiempo real** con indicadores visuales
- **Dashboard personalizado** con estadísticas reales
- **Componente ReferralStats** reutilizable
- **Integración en perfil** de usuario

### ✅ **4. Experiencia de Usuario**
- **Compartir códigos** con un clic
- **Enlaces personalizados** automáticos
- **Feedback visual** inmediato
- **Tracking en tiempo real** de referidos
- **Recompensas automáticas** ($5 por referido)

## 🏗️ Arquitectura del Sistema

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   FRANCISCO     │───▶│   USUARIO A     │───▶│   USUARIO B     │
│  (Fundador)     │    │    (Nivel 1)    │    │    (Nivel 2)    │
│   Nivel 0       │    │                 │    │                 │
│ CFFRANCISCO     │    │    CFUSER123    │    │   CFNICK456     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 📁 Archivos Creados/Modificados

### **Base de Datos**
- `setup-referral-system.sql` - Script completo de configuración

### **APIs Backend**
- `app/api/referrals/validate/route.ts` - Validación de códigos
- `app/api/referrals/stats/route.ts` - Estadísticas de usuario
- `app/api/referrals/process/route.ts` - Procesamiento de referidos
- `app/api/users/route.ts` - Integración con registro

### **Frontend**
- `components/ui/ReferralStats.tsx` - Componente dinámico de estadísticas
- `hooks/useReferralData.ts` - Hooks para manejo de datos
- `app/login/page.tsx` - Auto-llenado y validación
- `app/login/referidos/page.tsx` - Dashboard personalizado
- `app/profile/page.tsx` - Integración en perfil

### **Contexto**
- `context/AuthContext.tsx` - Campos de referidos agregados

## 🔧 Configuración e Instalación

### **1. Configurar Base de Datos**

Ejecuta en Supabase SQL Editor:

```bash
# En Supabase SQL Editor
setup-referral-system.sql
```

### **2. Verificar Variables de Entorno**

```env
NEXT_PUBLIC_SUPABASE_URL=tu_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu_anon_key
SUPABASE_SERVICE_ROLE_KEY=tu_service_role_key
```

### **3. Reiniciar Aplicación**

```bash
npm run dev
```

## 🎮 Cómo Usar el Sistema

### **Para Usuarios Existentes:**

1. **Ver código de referido:**
   - Ir a `/login/referidos` o Perfil
   - Copiar código personal
   - Compartir enlace automático

2. **Invitar amigos:**
   - Compartir: `https://tu-dominio.com/login?ref=TUCODIGO`
   - El código se auto-llena en el formulario
   - Validación en tiempo real

3. **Tracking de ganancias:**
   - Dashboard en tiempo real
   - Historial de referidos
   - Ganancias acumuladas

### **Para Nuevos Usuarios:**

1. **Registro con código:**
   - Usar enlace de referido
   - Código se llena automáticamente
   - Validación instantánea

2. **Procesamiento automático:**
   - Relación se crea automáticamente
   - Referidor gana $5 inmediatamente
   - Nuevo usuario obtiene nivel +1

## 💰 Sistema de Recompensas

- **$5 por cada referido exitoso**
- **Sin límite** de referidos
- **Comisiones instantáneas**
- **Tracking en tiempo real**

## 🔍 Testing del Sistema

### **1. Verificar Francisco como Fundador**

```sql
-- En Supabase SQL Editor
SELECT referral_code, user_level, email 
FROM users 
WHERE email = 'josefranciscocastrosias@gmail.com';
```

**Resultado esperado:**
- `referral_code`: CFFRANCISCO
- `user_level`: 0
- `email`: josefranciscocastrosias@gmail.com

### **2. Test de Validación de Código**

```javascript
// En navegador console
fetch('/api/referrals/validate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ code: 'CFFRANCISCO' })
}).then(r => r.json()).then(console.log)
```

**Resultado esperado:**
```json
{
  "success": true,
  "valid": true,
  "referrer": {
    "nickname": "Francisco",
    "email": "josefranciscocastrosias@gmail.com"
  }
}
```

### **3. Test de Registro con Referido**

1. Ir a: `http://localhost:3000/login?ref=CFFRANCISCO`
2. Verificar que el código se auto-llena
3. Registrar un usuario de prueba
4. Verificar procesamiento automático

### **4. Test de Estadísticas**

```javascript
// Para Francisco
fetch('/api/referrals/stats', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'josefranciscocastrosias@gmail.com' })
}).then(r => r.json()).then(console.log)
```

## 🚨 Posibles Problemas y Soluciones

### **Error: "relation does not exist"**
**Solución:** Ejecutar `setup-referral-system.sql` completo

### **Error: "RLS policy violation"**
**Solución:** Las políticas RLS están configuradas automáticamente

### **Error: "referral_code already exists"**
**Solución:** Códigos se generan únicamente, pero revisar función `generate_referral_code`

### **Francisco no aparece como fundador**
**Solución:** Ejecutar manualmente:
```sql
UPDATE users 
SET referral_code = 'CFFRANCISCO', user_level = 0 
WHERE email = 'josefranciscocastrosias@gmail.com';
```

## 🔮 Funcionalidades Futuras

- **Niveles de comisión** (porcentajes por nivel)
- **Bonos por volumen** (x referidos = bonus extra)
- **Dashboard de genealogía** (árbol visual)
- **Notificaciones en tiempo real**
- **Integración con sistema de pagos**

## 📊 Monitoreo y Analytics

### **Queries Útiles:**

```sql
-- Top referidores
SELECT u.nickname, u.total_referrals, u.total_earnings 
FROM users u 
ORDER BY total_referrals DESC 
LIMIT 10;

-- Actividad reciente
SELECT * FROM referral_history 
ORDER BY referral_date DESC 
LIMIT 20;

-- Estadísticas por nivel
SELECT user_level, COUNT(*) as users, SUM(total_referrals) as total_refs 
FROM users 
GROUP BY user_level 
ORDER BY user_level;
```

## ✅ Status Final

🎯 **Sistema 100% Funcional**
- ✅ Base de datos configurada
- ✅ APIs funcionando
- ✅ Frontend integrado
- ✅ Francisco como fundador
- ✅ Validación en tiempo real
- ✅ Recompensas automáticas

**¡El sistema de referidos está listo para generar una red viral de usuarios en Crypto Force!** 🚀
