# 🏛️ TRIBUNAL IMPERIAL - Diagrama del Sistema Completo

## 📋 **RESUMEN EJECUTIVO**

El **TRIBUNAL IMPERIAL** es un sistema de gestión de contenido educativo que permite a Darths y Maestros crear, proponer y gestionar contenido educativo de forma autónoma, implementando un sistema de votación unánime para la aprobación de contenido.

---

## 🏗️ **ARQUITECTURA DEL SISTEMA**

### **1. ESTRUCTURA DE ARCHIVOS**
```
app/dashboard/tribunal-imperial/
├── layout.tsx              # Layout principal con sidebar
├── page.tsx                # Página principal del sistema
└── components/
    └── ContentEditor.tsx   # Editor visual de contenido

lib/tribunal/
├── types.ts                # Interfaces y tipos TypeScript
├── permissions.ts          # Sistema de permisos por nivel
├── voting-system.ts        # Lógica de votación unánime
└── content-engine.ts       # Generación automática de carrousels

components/tribunal/
├── ProposalCard.tsx        # Tarjeta de propuesta
└── ContentEditor.tsx       # Editor de contenido
```

---

## 🔐 **SISTEMA DE ACCESO Y PERMISOS**

### **Niveles de Usuario y Acceso**
```
┌─────────────────┬─────────────────┬─────────────────────────────┐
│   Nivel Usuario │     Rol         │     Acceso Tribunal         │
├─────────────────┼─────────────────┼─────────────────────────────┤
│       1         │   Iniciado      │           ❌ NO             │
│       2         │   Acólito       │           ❌ NO             │
│       3         │   Warrior       │           ❌ NO             │
│       4         │   Lord          │           ❌ NO             │
│       5         │   Darth         │    ✅ CREAR + VER            │
│       6         │   Maestro       │ ✅ CREAR + VER + VOTAR      │
└─────────────────┴─────────────────┴─────────────────────────────┘
```

### **Permisos Detallados**
- **Darths (Nivel 5)**: Crear propuestas, ver estado, editar propias
- **Maestros (Nivel 6)**: Todo lo de Darths + Votar + Aprobar/Rechazar

---

## 🎯 **FLUJO DE TRABAJO PRINCIPAL**

### **1. CREACIÓN DE CONTENIDO**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Darth/Maestro │───▶│  ContentEditor  │───▶│  Propuesta      │
│   Accede        │    │  (Drag & Drop)  │    │  Creada         │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Botón         │    │   Bloques de    │    │   Envío al      │
│ "Crear Contenido"│    │   Contenido     │    │   Tribunal     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **2. SISTEMA DE VOTACIÓN UNÁNIME**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Propuesta     │───▶│   Notificación  │───▶│   Votación      │
│   Enviada       │    │   a TODOS los   │    │   Individual    │
└─────────────────┘    │   Maestros      │    │   de Maestros   │
                       └─────────────────┘    └─────────────────┘
                                │                       │
                                ▼                       ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   Espera        │    │   Resultado     │
                       │   Respuesta     │    │   Unánime       │
                       └─────────────────┘    └─────────────────┘
                                │                       │
                                ▼                       ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   Si TODOS      │    │   Si NO         │
                       │   Aproban       │    │   Unánime       │
                       └─────────────────┘    └─────────────────┘
                                │                       │
                                ▼                       ▼
                       ┌─────────────────┐    ┌─────────────────┐
                       │   Contenido     │    │   Rechazo +     │
                       │   Aprobado      │    │   Mensaje       │
                       └─────────────────┘    └─────────────────┘
```

---

## 🎨 **EDITOR DE CONTENIDO VISUAL**

### **Tipos de Bloques Disponibles**
```
┌─────────────────┬─────────────────┬─────────────────────────────┐
│   Tipo Bloque   │     Icono       │     Funcionalidad           │
├─────────────────┼─────────────────┼─────────────────────────────┤
│     Texto       │       📝        │   Editor de texto rico      │
│     Imagen      │       🖼️        │   URL + Alt text           │
│     Video       │       🎥        │   URL + Título             │
│     Enlace      │       🔗        │   URL + Texto descriptivo  │
│     Código      │       💻        │   Syntax highlighting      │
│     Cita        │       💬        │   Texto + Autor            │
│     Lista       │       ✅        │   Checklist interactivo     │
│   Separador     │       ➖        │   Divider visual            │
└─────────────────┴─────────────────┴─────────────────────────────┘
```

### **Características del Editor**
- **Drag & Drop**: Reordenar bloques
- **Configuración**: Título, descripción, categoría, dificultad
- **Niveles Objetivo**: Selección múltiple de niveles (1-6)
- **Vista Previa**: Antes de guardar
- **Validación**: Campos obligatorios

---

## 🗳️ **SISTEMA DE VOTACIÓN**

### **Configuración del Sistema**
```typescript
VOTING_CONFIG = {
  unanimousApproval: true,    // TODOS deben aprobar
  allowAbstention: false,     // No se permite abstención
  votingTimeout: 7,           // 7 días para votar
  requireComment: true,       // Comentario obligatorio en rechazo
  autoExpire: true            // Expiración automática
}
```

### **Estados de Propuesta**
```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  PENDIENTE  │───▶│  EN VOTACIÓN│───▶│  APROBADA   │
└─────────────┘    └─────────────┘    └─────────────┘
       │                   │                   │
       ▼                   ▼                   ▼
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│  RECHAZADA  │    │  EXPIRADA   │    │  IMPLEMENTADA│
└─────────────┘    └─────────────┘    └─────────────┘
```

---

## 🚀 **GENERACIÓN AUTOMÁTICA DE CARROUSELS**

### **Motor de Contenido**
```typescript
ContentCarrouselEngine = {
  generateCarrousel(),           // Genera carrousel principal
  applyIniciadoPattern(),        // Patrón: 2 módulos → 1 checkpoint
  adaptToDashboardLevel(),       // Colores e insignias por nivel
  calculateDuration(),           // Duración estimada
  validatePattern()              // Validación de estructura
}
```

### **Adaptación por Dashboard**
```
┌─────────────────┬─────────────────┬─────────────────────────────┐
│   Dashboard     │     Color       │     Insignia                │
├─────────────────┼─────────────────┼─────────────────────────────┤
│   Iniciado      │   🔴 #ec4d58    │   1-iniciados.png          │
│   Acólito       │   🟡 #FFD447    │   2-acolitos.png           │
│   Warrior       │   🟣 #8B5CF6    │   3-warriors.png           │
│   Lord          │   🟡 #F59E0B    │   4-lords.png              │
│   Darth         │   🔴 #DC2626    │   5-darths.png             │
│   Maestro       │   ⚫ #6B7280    │   6-maestros.png           │
└─────────────────┴─────────────────┴─────────────────────────────┘
```

---

## 📊 **ESTADÍSTICAS Y REPORTES**

### **Métricas del Tribunal**
- **Propuestas Pendientes**: En espera de votación
- **Propuestas Aprobadas**: Contenido validado
- **Propuestas Rechazadas**: Contenido no aprobado
- **Maestros Activos**: Participando en votaciones
- **Tiempo Promedio**: Desde propuesta hasta aprobación
- **Tasa de Aprobación**: Porcentaje de éxito

---

## 🔄 **INTEGRACIÓN CON DASHBOARDS**

### **Flujo de Implementación**
```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Contenido     │───▶│   Motor de      │───▶│   Carrousel     │
│   Aprobado      │    │   Generación    │    │   Generado      │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Base de       │    │   Aplicación    │    │   Despliegue    │
│   Datos         │    │   de Patrones   │    │   Automático    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### **Dashboards Integrados**
- **Iniciado**: Carrousel teórico + práctico + checkpoints
- **Acólito**: Adaptación con colores amarillos
- **Warrior**: Contenido intermedio
- **Lord**: Contenido avanzado
- **Darth**: Contenido especializado
- **Maestro**: Vista administrativa completa

---

## 🛡️ **SEGURIDAD Y VALIDACIÓN**

### **Validaciones del Sistema**
- **Autenticación**: Verificación de nivel de usuario
- **Autorización**: Permisos específicos por acción
- **Validación de Contenido**: Campos obligatorios
- **Sanitización**: Prevención de XSS
- **Rate Limiting**: Límite de propuestas por usuario
- **Auditoría**: Log de todas las acciones

---

## 📱 **INTERFAZ DE USUARIO**

### **Componentes Principales**
1. **Header del Tribunal**: Logo + Título + Usuario actual
2. **Navegación por Tabs**: Vista General, Propuestas, Crear, Votación
3. **Sidebar Especializada**: Navegación rápida + Volver al Dashboard
4. **Editor Visual**: Interfaz tipo Notion para creación de contenido
5. **Sistema de Votación**: Interfaz clara para Maestros
6. **Estadísticas**: Métricas en tiempo real

---

## 🚀 **ROADMAP DE DESARROLLO**

### **Fase 1: Core System ✅**
- [x] Estructura básica del TRIBUNAL IMPERIAL
- [x] Sistema de permisos y acceso
- [x] Editor de contenido visual
- [x] Layout y navegación

### **Fase 2: Voting System 🔄**
- [ ] Sistema de votación unánime
- [ ] Notificaciones a Maestros
- [ ] Gestión de propuestas
- [ ] Historial de decisiones

### **Fase 3: Content Engine 📚**
- [ ] Motor de generación de carrousels
- [ ] Integración con dashboards
- [ ] Sistema de checkpoints automático
- [ ] Adaptación de estilos por nivel

### **Fase 4: Advanced Features 🎯**
- [ ] Sistema de plantillas
- [ ] Analytics avanzados
- [ ] Notificaciones push
- [ ] API para integraciones externas

---

## 💡 **CASOS DE USO**

### **Escenario 1: Darth Crea Contenido**
1. Darth accede a `/dashboard/darth/courses`
2. Hace clic en "Crear Contenido"
3. Es redirigido al TRIBUNAL IMPERIAL
4. Usa el editor visual para crear módulo
5. Guarda la propuesta
6. Sistema notifica a TODOS los Maestros

### **Escenario 2: Maestro Vota**
1. Maestro recibe notificación
2. Accede al TRIBUNAL IMPERIAL
3. Revisa la propuesta
4. Emite voto (Aprobar/Rechazar)
5. Si rechaza, debe explicar motivo
6. Sistema calcula resultado

### **Escenario 3: Contenido Aprobado**
1. TODOS los Maestros aprueban
2. Sistema marca como "Aprobado"
3. Motor de contenido genera carrousel
4. Se despliega en todas las dashboards objetivo
5. Usuarios ven nuevo contenido automáticamente

---

## 🎯 **BENEFICIOS DEL SISTEMA**

### **Para Creadores de Contenido**
- **Autonomía Total**: No dependen de programadores
- **Editor Visual**: Interfaz intuitiva tipo Notion
- **Flexibilidad**: Múltiples tipos de contenido
- **Feedback Inmediato**: Comentarios de Maestros

### **Para la Plataforma**
- **Escalabilidad**: Contenido se genera automáticamente
- **Calidad**: Votación unánime garantiza estándares
- **Consistencia**: Patrones automáticos de diseño
- **Mantenimiento**: Menos intervención manual

### **Para los Usuarios**
- **Contenido Fresco**: Nuevos módulos regularmente
- **Experiencia Unificada**: Mismo patrón en todas las dashboards
- **Progresión Clara**: Checkpoints automáticos
- **Adaptación**: Contenido adaptado a su nivel

---

## 🔮 **FUTURAS MEJORAS**

### **Funcionalidades Avanzadas**
- **IA para Sugerencias**: Recomendaciones de contenido
- **Sistema de Versiones**: Control de versiones de módulos
- **Colaboración en Tiempo Real**: Múltiples editores
- **Analytics de Usuario**: Métricas de engagement
- **Integración con LMS**: Sistemas externos de aprendizaje
- **Mobile App**: Aplicación móvil para votaciones

---

## 📞 **CONTACTO Y SOPORTE**

### **Desarrollo del Sistema**
- **Arquitecto**: Sistema TRIBUNAL IMPERIAL
- **Estado**: Fase 1 completada, Fase 2 en desarrollo
- **Tecnologías**: Next.js, TypeScript, Tailwind CSS
- **Base de Datos**: Supabase (PostgreSQL)

---

*Este documento describe el sistema TRIBUNAL IMPERIAL en su estado actual y su roadmap de desarrollo. El sistema está diseñado para proporcionar autonomía total a los creadores de contenido mientras mantiene la calidad y consistencia a través de un sistema de votación unánime.*
