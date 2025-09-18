# Configuraciones Manuales en Supabase Dashboard

## 🔐 Configuraciones de Seguridad Requeridas

### 1. **OTP Expiry Configuration**
**Ubicación:** Authentication > Settings > Email > OTP Expiry
**Acción:** Configurar a **3600 segundos (1 hora)** o menos
**Razón:** Resolver warning "Auth OTP long expiry"

### 2. **Leaked Password Protection**
**Ubicación:** Authentication > Settings > Password > Leaked Password Protection
**Acción:** **Habilitar** la opción
**Razón:** Resolver warning "Leaked Password Protection Disabled"

## 📋 Pasos para Aplicar las Correcciones

### Paso 1: Ejecutar Script SQL
1. Ir a **SQL Editor** en Supabase Dashboard
2. Crear una nueva consulta
3. Copiar y pegar el contenido de `supabase-security-fixes.sql`
4. Ejecutar el script

### Paso 2: Verificar RLS
1. Ir a **Table Editor** > `referral_history`
2. Verificar que RLS esté habilitado
3. Revisar las políticas creadas

### Paso 3: Configurar Autenticación
1. Ir a **Authentication** > **Settings**
2. En la sección **Email**:
   - Configurar **OTP Expiry** a 3600 segundos
3. En la sección **Password**:
   - Habilitar **Leaked Password Protection**

### Paso 4: Verificar Extensiones
1. Ir a **Database** > **Extensions**
2. Verificar que `citext` esté en el schema `extensions`

## ✅ Verificación Final

Después de aplicar todas las correcciones, ejecutar el linter de Supabase para verificar que:
- ✅ No hay errores de RLS
- ✅ No hay warnings de search_path
- ✅ No hay warnings de extensiones en public
- ✅ No hay warnings de OTP expiry
- ✅ No hay warnings de leaked password protection

## 🚨 Notas Importantes

1. **Backup:** Hacer backup de la base de datos antes de ejecutar el script
2. **Testing:** Probar todas las funcionalidades después de aplicar las correcciones
3. **Monitoring:** Monitorear los logs para detectar posibles problemas
4. **Rollback:** Tener un plan de rollback en caso de problemas

## 📞 Soporte

Si encuentras algún problema durante la implementación:
1. Revisar los logs de Supabase
2. Verificar que todas las funciones se crearon correctamente
3. Comprobar que las políticas RLS funcionan como esperado
4. Contactar al equipo de desarrollo si es necesario



