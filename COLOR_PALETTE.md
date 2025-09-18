# 🎨 Paleta de Colores del Sistema - Crypto Force

## **🎯 Color Base Principal: #121212**

Esta es la tonalidad predominante que **DEBE** usarse en todas las páginas del sistema para mantener consistencia visual.

---

## **🌈 Paleta de Colores Completa**

### **🎭 Fondos y Contenedores**
```css
/* Fondo principal de página */
bg-[#121212]                    /* Color base sólido */
bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#0f0f0f]  /* Gradiente oscuro */

/* Contenedores y tarjetas */
bg-[#1e1e1e]                   /* Contenedor principal */
bg-[#1e1e1e]/90                /* Con transparencia */
bg-[#2a2a2a]                   /* Contenedor secundario */
bg-[#2a2a2a]/50                /* Con transparencia */
```

### **🔲 Bordes y Separadores**
```css
/* Bordes de contenedores */
border-[#2a2a2a]               /* Borde principal */
border-[#3a3a3a]               /* Borde secundario */
border-[#4a4a4a]               /* Borde de focus */

/* Separadores y líneas */
border-t-[#3a3a3a]             /* Línea horizontal */
border-[#3a3a3a]               /* Línea general */
```

### **📝 Texto y Tipografía**
```css
/* Texto principal */
text-white                       /* Títulos y texto importante */
text-[#a0a0a0]                 /* Texto secundario */
text-[#8a8a8a]                 /* Texto terciario */
text-[#6a6a6a]                 /* Texto deshabilitado */

/* Estados especiales */
text-emerald-400                /* Éxito/Confirmación */
text-red-400                    /* Errores */
text-[#4a4a4a]                 /* Placeholders */
```

### **🎨 Estados y Interacciones**
```css
/* Estados de botones */
bg-[#4a4a4a]                   /* Botón normal */
bg-[#5a5a5a]                   /* Botón hover */
bg-[#3a3a3a]                   /* Botón deshabilitado */

/* Estados de inputs */
bg-[#2a2a2a]                   /* Input normal */
bg-[#3a3a3a]                   /* Input hover */
bg-[#4a4a4a]                   /* Input focus */

/* Estados de hover */
hover:bg-[#3a3a3a]             /* Hover general */
hover:text-[#a0a0a0]           /* Hover de texto */
hover:border-[#4a4a4a]         /* Hover de bordes */
```

### **✨ Elementos Decorativos**
```css
/* Elementos sutiles de fondo */
border-[#2a2a2a]               /* Elementos decorativos */
opacity-3                       /* Opacidad muy baja */
opacity-5                       /* Opacidad baja */
```

---

## **📱 Aplicación por Componentes**

### **🖥️ Páginas Principales**
```css
/* Fondo de página */
min-h-screen bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#0f0f0f]

/* Contenedor principal */
bg-[#1e1e1e]/90 backdrop-blur-sm border border-[#2a2a2a]
```

### **📋 Formularios**
```css
/* Labels */
text-[#a0a0a0] font-medium

/* Inputs */
bg-[#2a2a2a] border-[#3a3a3a] focus:ring-[#4a4a4a] focus:border-[#4a4a4a]

/* Botones */
bg-[#4a4a4a] hover:bg-[#5a5a5a] text-white
```

### **🎯 Sidebars y Navegación**
```css
/* Fondo de sidebar */
bg-[#1e1e1e] border-r border-[#2a2a2a]

/* Enlaces de navegación */
text-[#8a8a8a] hover:text-[#a0a0a0]

/* Enlace activo */
text-white bg-[#2a2a2a]/50
```

### **📊 Tablas y Listas**
```css
/* Fondo de tabla */
bg-[#1e1e1e] border border-[#2a2a2a]

/* Filas de tabla */
hover:bg-[#2a2a2a]/30

/* Bordes de celda */
border-[#3a3a3a]
```

---

## **🚫 Colores NO Permitidos**

### **❌ Evitar estos colores:**
- `slate-*` (cualquier variante de slate)
- `gray-*` (cualquier variante de gray)
- `blue-*`, `yellow-*`, `green-*` (colores llamativos)
- Cualquier color que no esté en la paleta #121212

### **✅ Solo usar:**
- La paleta basada en #121212
- `emerald-400` para estados de éxito
- `red-400` para errores
- `white` para texto importante

---

## **🔧 Implementación en Tailwind**

### **Configuración de colores personalizados:**
```javascript
// tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: {
        'crypto': {
          'base': '#121212',
          'dark': '#0f0f0f',
          'light': '#1a1a1a',
          'container': '#1e1e1e',
          'secondary': '#2a2a2a',
          'border': '#3a3a3a',
          'focus': '#4a4a4a',
          'hover': '#5a5a5a',
          'text-primary': '#a0a0a0',
          'text-secondary': '#8a8a8a',
          'text-muted': '#6a6a6a',
        }
      }
    }
  }
}
```

### **Uso con clases personalizadas:**
```css
/* En lugar de: */
bg-[#121212]

/* Puedes usar: */
bg-crypto-base
```

---

## **📋 Checklist de Implementación**

### **✅ Para cada página nueva:**
- [ ] Fondo principal: `bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#0f0f0f]`
- [ ] Contenedor principal: `bg-[#1e1e1e]/90 border-[#2a2a2a]`
- [ ] Texto principal: `text-white` para títulos
- [ ] Texto secundario: `text-[#a0a0a0]` para contenido
- [ ] Bordes: `border-[#2a2a2a]` o `border-[#3a3a3a]`
- [ ] Botones: `bg-[#4a4a4a] hover:bg-[#5a5a5a]`

### **✅ Para formularios:**
- [ ] Labels: `text-[#a0a0a0]`
- [ ] Inputs: `bg-[#2a2a2a] border-[#3a3a3a]`
- [ ] Focus: `focus:ring-[#4a4a4a] focus:border-[#4a4a4a]`
- [ ] Botones: `bg-[#4a4a4a] hover:bg-[#5a5a5a]`

---

## **🎯 Ejemplo de Implementación**

```jsx
// Página de ejemplo
<div className="min-h-screen bg-gradient-to-br from-[#121212] via-[#1a1a1a] to-[#0f0f0f]">
  <div className="bg-[#1e1e1e]/90 border border-[#2a2a2a] rounded-xl p-8">
    <h1 className="text-white text-3xl font-bold">Título Principal</h1>
    <p className="text-[#a0a0a0]">Texto secundario</p>
    
    <form className="space-y-4">
      <label className="text-[#a0a0a0]">Campo</label>
      <input className="bg-[#2a2a2a] border-[#3a3a3a] focus:ring-[#4a4a4a]" />
      <button className="bg-[#4a4a4a] hover:bg-[#5a5a5a] text-white">
        Enviar
      </button>
    </form>
  </div>
</div>
```

---

## **📞 Soporte**

Si tienes dudas sobre la implementación de esta paleta de colores:

1. **Revisa este documento** antes de implementar
2. **Usa el ejemplo** como plantilla base
3. **Mantén consistencia** con #121212 como base
4. **Evita colores llamativos** que no estén en la paleta

**🎨 Recuerda: #121212 es la tonalidad predominante en TODO el sistema.**

