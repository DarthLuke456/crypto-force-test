# 🏛️ TRIBUNAL IMPERIAL - Sistema de Aprobación de Contenido

## 🎯 **Descripción General**

El **TRIBUNAL IMPERIAL** es un sistema de democracia educativa que permite a Darths y Maestros crear contenido educativo personalizado, mientras que solo los Maestros pueden aprobar o rechazar este contenido a través de un sistema de votación unánime.

## 🚀 **Características Principales**

### **✅ Sistema de Votación Unánime**
- **Aprobación Requerida**: TODOS los Maestros deben aprobar para que el contenido se publique
- **Transparencia Total**: Todos ven los votos y comentarios de todos
- **Comentarios Obligatorios**: Si rechazas, debes explicar por qué
- **Revisión Continua**: Las propuestas rechazadas pueden ser modificadas y reenviadas

### **🎨 Generación Automática de Carrousels**
- **Patrón de Iniciado**: Respeta la estructura "2 módulos → 1 checkpoint"
- **Adaptación Automática**: Colores, insignias y estilos se aplican según el nivel
- **Sin Código Manual**: No más ediciones de arrays o archivos
- **Escalabilidad Total**: Puedes tener 100 cursos sin tocar código

### **🔐 Sistema de Permisos Robusto**
- **Niveles de Acceso**: Diferentes permisos según el nivel del usuario
- **Seguridad**: Solo usuarios autorizados pueden realizar acciones específicas
- **Auditoría**: Registro completo de todas las acciones

## 🏗️ **Arquitectura del Sistema**

### **📁 Estructura de Archivos**
```
lib/tribunal/
├── types.ts              # Tipos TypeScript del sistema
├── permissions.ts        # Sistema de permisos y roles
├── voting-system.ts      # Lógica de votación unánime
└── content-engine.ts     # Motor de generación de carrousels

components/tribunal/
└── ProposalCard.tsx      # Componente de tarjeta de propuesta

app/dashboard/tribunal-imperial/
├── page.tsx              # Página principal del tribunal
├── propuestas/           # Propuestas pendientes
├── votacion/             # Sistema de votación
├── aprobados/            # Contenido aprobado
└── rechazados/           # Contenido rechazado
```

### **🔧 Componentes Principales**

#### **1. Sistema de Tipos (`types.ts`)**
- **ContentBlock**: Bloques de contenido (texto, imagen, video, etc.)
- **CustomModule**: Módulos personalizados creados por usuarios
- **TribunalProposal**: Propuestas enviadas al tribunal
- **TribunalVote**: Votos individuales de cada Maestro
- **TribunalMember**: Miembros del tribunal (Maestros)

#### **2. Sistema de Permisos (`permissions.ts`)**
- **Nivel 1-4 (Iniciado, Acólito, Warrior, Lord)**: Solo pueden ver contenido aprobado
- **Nivel 5 (Darth)**: Puede crear propuestas, ver estadísticas
- **Nivel 6 (Maestro)**: Puede crear, votar, aprobar, rechazar y gestionar

#### **3. Sistema de Votación (`voting-system.ts`)**
- **Votación Unánime**: Todos los Maestros deben aprobar
- **Comentarios Obligatorios**: Explicación requerida para rechazos
- **Expiración Automática**: Propuestas expiran después de 7 días
- **Estadísticas Detalladas**: Métricas de participación y decisiones

#### **4. Motor de Contenido (`content-engine.ts`)**
- **Generación Automática**: Crea carrousels basados en el patrón de Iniciado
- **Adaptación de Niveles**: Aplica colores y estilos automáticamente
- **Validación de Patrones**: Verifica que se cumpla la estructura correcta
- **Multi-Nivel**: Genera carrousels para múltiples dashboards

## 🎨 **Sistema de Diseño Automático**

### **🎨 Colores por Nivel de Dashboard**
```typescript
DASHBOARD_COLORS = {
  1: { primary: '#ec4d58' },    // Iniciado - Rojo
  2: { primary: '#FFD447' },    // Acólito - Amarillo
  3: { primary: '#3B82F6' },    // Warrior - Azul
  4: { primary: '#10B981' },    // Lord - Verde
  5: { primary: '#8B5CF6' },    // Darth - Púrpura
  6: { primary: '#FFD700' }     // Maestro - Dorado
}
```

### **🏆 Insignias Automáticas**
```typescript
DASHBOARD_INSIGNIAS = {
  1: '1-iniciados.png',
  2: '2-acolitos.png',
  3: '3-warriors.png',
  4: '4-lords.png',
  5: '5-darths.png',
  6: '6-maestros.png'
}
```

## 🔄 **Flujo de Trabajo del Sistema**

### **📝 1. Creación de Propuestas**
```
Darth/Maestro → Editor Visual → Define Contenido → 
Estructura de Módulos → Niveles Objetivo → Envía al Tribunal
```

### **⚖️ 2. Proceso de Votación**
```
Sistema Notifica → Todos los Maestros → Cada Uno Vota → 
Si TODOS Aprueban → Contenido Aprobado →
Si UNO Rechaza → Mensaje Explicativo → Propuesta Rechazada
```

### **🚀 3. Despliegue Automático**
```
Contenido Aprobado → Motor Genera Carrousels → 
Aplica Colores y Estilos → Se Despliega en Dashboards → 
Usuarios Ven el Contenido
```

## 🛠️ **Uso del Sistema**

### **👑 Para Maestros (Nivel 6)**

#### **Votar en Propuestas**
```typescript
import { TribunalVotingSystem } from '@/lib/tribunal/voting-system';

const result = TribunalVotingSystem.processVote(
  proposal,
  maestrosId,
  maestrosName,
  maestrosLevel,
  'approve' // o 'reject'
);
```

#### **Ver Estadísticas**
```typescript
import { TribunalVotingSystem } from '@/lib/tribunal/voting-system';

const summary = TribunalVotingSystem.getVotingSummary(proposals);
const progress = TribunalVotingSystem.getProposalVotingProgress(proposal);
```

### **⚔️ Para Darths (Nivel 5)**

#### **Crear Propuestas**
```typescript
import { ContentCarrouselEngine } from '@/lib/tribunal/content-engine';

// El motor genera automáticamente el carrousel
const carrousel = ContentCarrouselEngine.generateCarrousel(
  customModule,
  targetDashboardLevel
);
```

#### **Validar Patrones**
```typescript
const validation = ContentCarrouselEngine.validateCarrouselPattern(carrousel);

if (!validation.isValid) {
  console.log('Problemas:', validation.issues);
  console.log('Sugerencias:', validation.suggestions);
}
```

### **🔒 Verificar Permisos**
```typescript
import { 
  canUserCreateProposals, 
  canUserVote, 
  canUserAccessTribunal 
} from '@/lib/tribunal/permissions';

const canCreate = canUserCreateProposals(userLevel);
const canVote = canUserVote(userLevel);
const canAccess = canUserAccessTribunal(userLevel);
```

## 📊 **Estadísticas y Métricas**

### **📈 Métricas del Tribunal**
- **Propuestas Pendientes**: En espera de votación
- **Propuestas Aprobadas**: Contenido publicado
- **Propuestas Rechazadas**: Contenido no aprobado
- **Tiempo Promedio**: Días para aprobar/rechazar
- **Tasa de Aprobación**: Porcentaje de propuestas aprobadas

### **👥 Métricas por Maestro**
- **Total de Votos**: Votos emitidos
- **Votos Aprobados**: Decisiones de aprobación
- **Votos Rechazados**: Decisiones de rechazo
- **Tasa de Aprobación**: Porcentaje personal

## 🔧 **Configuración del Sistema**

### **⚙️ Configuración de Votación**
```typescript
export const VOTING_CONFIG = {
  REQUIRE_UNANIMOUS_APPROVAL: true,    // TODOS deben aprobar
  ALLOW_ABSTENTION: false,             // No se permiten abstenciones
  VOTING_TIMEOUT_DAYS: 7,             // 7 días para votar
  AUTO_EXPIRE_PROPOSALS: true,         // Expiración automática
  REQUIRE_COMMENT_ON_REJECTION: true,  // Comentario obligatorio
  ALLOW_MULTIPLE_REVISIONS: true,      // Reenvío permitido
  MAX_REVISION_ATTEMPTS: 3             // Máximo 3 intentos
};
```

### **🎨 Configuración de Colores**
```typescript
// Personalizar colores por nivel
export const DASHBOARD_COLORS = {
  1: { primary: '#tu-color-rojo' },
  2: { primary: '#tu-color-amarillo' },
  // ... más niveles
};
```

## 🚀 **Próximos Pasos de Desarrollo**

### **📋 Fase 1: Base del Sistema** ✅
- [x] Estructura de tipos y interfaces
- [x] Sistema de permisos
- [x] Lógica de votación unánime
- [x] Motor de generación de carrousels

### **🔧 Fase 2: Editor Visual** 🚧
- [ ] Editor drag & drop para contenido
- [ ] Bloques de contenido reutilizables
- [ ] Preview en tiempo real
- [ ] Plantillas predefinidas

### **🌐 Fase 3: Interfaz de Usuario** 🚧
- [ ] Dashboard completo del tribunal
- [ ] Sistema de notificaciones
- [ ] Historial de decisiones
- [ ] Reportes y analytics

### **🔗 Fase 4: Integración** 📋
- [ ] Conectar con dashboards existentes
- [ ] Sistema de versiones
- [ ] API para contenido externo
- [ ] Export/Import de contenido

## 💡 **Casos de Uso Ejemplo**

### **📚 Escenario 1: Nuevo Curso de Acólito**
1. **Maestro crea**: "Curso Avanzado de Trading"
2. **Define estructura**: 6 módulos + 3 checkpoints
3. **Sistema genera**: Carrousel con colores amarillos automáticamente
4. **Se despliega**: En dashboard de Acólito
5. **Resultado**: Sin tocar código, contenido disponible

### **🌍 Escenario 2: Curso Multi-Nivel**
1. **Darth crea**: "Blockchain para Todos"
2. **Define niveles**: [1,2,3,4] (Iniciado a Lord)
3. **Sistema genera**: Carrousels adaptados para cada dashboard
4. **Colores aplicados**: Rojo, amarillo, azul, verde automáticamente
5. **Resultado**: Contenido escalable y consistente

### **🔄 Escenario 3: Modificación de Contenido**
1. **Maestro modifica**: Orden de módulos en el CMS
2. **Sistema regenera**: Automáticamente todos los carrousels afectados
3. **Colores actualizados**: Se mantienen según el nivel
4. **Resultado**: Cambios reflejados en tiempo real

## 🎯 **Beneficios del Sistema**

### **✅ Para la Plataforma**
- **Calidad Garantizada**: Solo contenido aprobado por unanimidad
- **Escalabilidad Total**: Sin dependencia de programadores
- **Consistencia Visual**: Todos los carrousels mantienen identidad
- **Transparencia**: Proceso democrático visible

### **✅ Para los Maestros**
- **Control Total**: Deciden qué contenido se publica
- **Colaboración**: Trabajan juntos para mantener estándares
- **Responsabilidad**: Su reputación está en juego

### **✅ Para los Darths**
- **Autonomía**: Pueden crear contenido sin límites
- **Feedback Constructivo**: Comentarios detallados para mejorar
- **Reconocimiento**: Su contenido se valida por pares expertos

## 🔮 **Características Futuras**

- **Sistema de Reputación**: Maestros ganan puntos por buenas decisiones
- **Mentoría Automática**: Sistema sugiere mejoras basadas en rechazos
- **Colaboración**: Múltiples Darths pueden trabajar en una propuesta
- **Versionado**: Historial completo de cambios
- **Analytics Avanzados**: Métricas de engagement del contenido

## 📞 **Soporte y Contacto**

Para preguntas sobre el **TRIBUNAL IMPERIAL**:
- **Documentación**: Este archivo README
- **Código**: Archivos en `lib/tribunal/`
- **Componentes**: `components/tribunal/`
- **Páginas**: `app/dashboard/tribunal-imperial/`

---

**🏛️ TRIBUNAL IMPERIAL** - Donde la democracia educativa se encuentra con la autoridad Sith ⚖️👑
