# 🚀 Crypto Force

Crypto Force es una plataforma educativa galáctica para aprender sobre criptomonedas, finanzas y mentalidad de élite. A través de una narrativa inmersiva, estructura jerárquica de roles y contenido gamificado, el usuario progresa desde los primeros pasos hasta el dominio absoluto del conocimiento financiero.

---

## 🌌 Características

- 📚 Curso premium con acceso progresivo
- 🔐 Sistema de login con Supabase
- 🧙‍♂️ Dashboards por rol jerárquico (Iniciado → Maestro)
- 🧠 Bitácora y Progresión personal
- 🧩 Misiones temáticas y comunidad DAO
- 💬 Mentoría y contenido exclusivo
- 🎨 Interfaz oscura y responsive (Next.js + TailwindCSS)

---

## 🛠️ Tecnologías

- **Next.js**
- **Supabase**
- **TailwindCSS**
- **FontAwesome (íconos)**
- **Vercel** (para despliegue opcional)

---

## 🚨 Solución de Problemas Comunes

### Error de RLS (Row Level Security)
Si ves este error al registrar usuarios:
```
Error de permisos: La tabla users tiene restricciones de seguridad
```

**Solución rápida:**
1. Ve a tu panel de Supabase → SQL Editor
2. Ejecuta el archivo `fix-rls-complete.sql`
3. Esto configurará las políticas RLS correctamente

📖 **Guía completa:** Ver [SUPABASE_RLS_FIX.md](./SUPABASE_RLS_FIX.md)

---

## 📦 Instalación local

1. Clona el repositorio:
   ```bash
   git clone https://github.com/Coeurdeluke-js/crypto-force-next.js.git
