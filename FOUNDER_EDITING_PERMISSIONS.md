# 🔧 Permisos de Edición entre Usuarios Fundadores

## 📋 **Nuevas Reglas de Permisos**

### **👥 Fundadores Pueden Editar Información de Otros Fundadores**

Los usuarios fundadores (`coeurdeluke.js@gmail.com` e `infocryptoforce@gmail.com`) ahora pueden editar la información de cada uno, con restricciones específicas.

## 🛡️ **Campos por Tipo de Edición**

### **✅ Campos Editables entre Fundadores:**
| Campo | Descripción | Editable por Otro Fundador |
|-------|-------------|---------------------------|
| **`nombre`** | Nombre del usuario | ✅ Sí |
| **`apellido`** | Apellido del usuario | ✅ Sí |
| **`movil`** | Teléfono móvil | ✅ Sí |
| **`exchange`** | Exchange preferido | ✅ Sí |

### **❌ Campos No Editables (Inmutables):**
| Campo | Descripción | Razón |
|-------|-------------|-------|
| **`user_level`** | Nivel del usuario | Mantener estatus de fundador |
| **`referral_code`** | Código de referido | Integridad del sistema |
| **`nickname`** | Nombre de usuario | Consistencia de identidad |
| **`total_referrals`** | Total de referidos | Calculado automáticamente |

## 🔒 **Restricciones Específicas**

### **1. Auto-Edición (Fundador editándose a sí mismo):**
- ❌ **No puede editar**: `user_level`, `referral_code`, `nickname`, `total_referrals`
- ✅ **Puede editar**: `nombre`, `apellido`, `movil`, `exchange`

### **2. Edición Cruzada (Fundador editando a otro fundador):**
- ❌ **No puede editar**: `user_level`, `referral_code`, `nickname`, `total_referrals`
- ✅ **Puede editar**: `nombre`, `apellido`, `movil`, `exchange`

### **3. Edición de Usuarios No Fundadores:**
- ✅ **Puede editar**: Todos los campos (como antes)

## 🎨 **Interfaz de Usuario**

### **Indicadores Visuales:**
- 🔒 **Campos Protegidos**: Aparecen deshabilitados con icono de candado
- 🟠 **Color Naranja**: Para indicar campos protegidos
- 📝 **Mensajes Claros**: Explican por qué un campo no es editable

### **Mensajes de Protección:**
- **Auto-edición**: "🔒 No puedes modificar tu propio nivel de usuario"
- **Edición cruzada**: "🔒 Campo protegido para usuarios fundadores"
- **Total Referidos**: "🔒 Este campo es calculado automáticamente por el sistema"

## 🔧 **Implementación Técnica**

### **Frontend:**
- **Función**: `canEditField(email, fieldName, currentUserEmail)`
- **Lógica**: Verifica si el usuario actual es fundador y si está editando a otro fundador
- **Componente**: `ProtectedUserFields.tsx` actualizado

### **Backend:**
- **Trigger**: `founder_protection_trigger` actualizado
- **Función**: `check_founder_protection()` con nuevas validaciones
- **Protección**: A nivel de base de datos para campos críticos

## 📊 **Ejemplos de Uso**

### **Escenario 1: coeurdeluke.js@gmail.com editando infocryptoforce@gmail.com**
- ✅ **Puede cambiar**: Nombre, apellido, teléfono, exchange
- ❌ **No puede cambiar**: Nivel, código de referido, nickname, total referidos

### **Escenario 2: infocryptoforce@gmail.com editándose a sí mismo**
- ✅ **Puede cambiar**: Nombre, apellido, teléfono, exchange
- ❌ **No puede cambiar**: Nivel, código de referido, nickname, total referidos

### **Escenario 3: coeurdeluke.js@gmail.com editando usuario normal**
- ✅ **Puede cambiar**: Todos los campos (como administrador)

## 🚀 **Instalación**

### **1. Ejecutar Script de Actualización:**
```sql
psql -d your_database -f update-founder-protection-permissions.sql
```

### **2. Verificar Funcionamiento:**
- Los fundadores pueden editar información básica de cada uno
- Los campos críticos siguen protegidos
- La interfaz muestra claramente qué se puede editar

## ✅ **Resultado Final**

Los usuarios fundadores ahora tienen:
- ✅ **Flexibilidad**: Pueden editar información básica de cada otro
- ✅ **Seguridad**: Campos críticos siguen protegidos
- ✅ **Claridad**: Interfaz clara sobre qué se puede editar
- ✅ **Integridad**: Sistema de referidos y niveles protegido

**¡Los fundadores pueden colaborar en la gestión de información mientras mantienen la integridad del sistema!** 🤝✨
