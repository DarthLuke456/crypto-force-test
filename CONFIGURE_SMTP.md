# 📧 CONFIGURACIÓN DE SMTP PARA SUPABASE

## 🎯 Problema
Los emails de reset de contraseña no llegan porque Supabase necesita configuración SMTP personalizada.

## ⚙️ Solución: Configurar SMTP en Supabase

### **Paso 1: Ir al Panel de Supabase**
1. Ve a [supabase.com](https://supabase.com) y abre tu proyecto
2. Ve a **Settings** → **Authentication** → **SMTP Settings**

### **Paso 2: Configurar SMTP (Opciones recomendadas)**

#### **Opción A: Gmail (Gratis)**
```
SMTP Host: smtp.gmail.com
SMTP Port: 587
SMTP Username: tu-email@gmail.com
SMTP Password: [App Password - NO tu contraseña normal]
Sender Name: Crypto Force
Sender Email: tu-email@gmail.com
```

**⚠️ Para Gmail necesitas:**
1. Ir a Google Account → Security → 2-Step Verification
2. Generar "App Password" específica para Supabase
3. Usar esa App Password (no tu contraseña de Gmail)

#### **Opción B: SendGrid (Recomendado para producción)**
```
SMTP Host: smtp.sendgrid.net
SMTP Port: 587
SMTP Username: apikey
SMTP Password: [Tu SendGrid API Key]
Sender Name: Crypto Force
Sender Email: no-reply@thecryptoforce.com
```

#### **Opción C: Resend (Moderno y fácil)**
```
SMTP Host: smtp.resend.com
SMTP Port: 587
SMTP Username: resend
SMTP Password: [Tu Resend API Key]
Sender Name: Crypto Force
Sender Email: no-reply@thecryptoforce.com
```

### **Paso 3: Personalizar Templates de Email**

En **Settings** → **Authentication** → **Email Templates**:

#### **Reset Password Template:**
```html
<h2>Restablecer Contraseña - Crypto Force</h2>
<p>Hola,</p>
<p>Recibimos una solicitud para restablecer la contraseña de tu cuenta en Crypto Force.</p>
<p>
  <a href="{{ .ConfirmationURL }}" 
     style="background-color: #ec4d58; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
    Restablecer Contraseña
  </a>
</p>
<p>Si no solicitaste este cambio, puedes ignorar este email.</p>
<p>Este enlace expira en 1 hora.</p>
<br>
<p>Equipo de Crypto Force</p>
```

#### **Confirmation Email Template:**
```html
<h2>Confirma tu cuenta - Crypto Force</h2>
<p>¡Bienvenido a Crypto Force!</p>
<p>Haz clic en el enlace para confirmar tu cuenta:</p>
<p>
  <a href="{{ .ConfirmationURL }}" 
     style="background-color: #ec4d58; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px;">
    Confirmar Cuenta
  </a>
</p>
<p>¡Gracias por unirte a nosotros!</p>
<br>
<p>Equipo de Crypto Force</p>
```

### **Paso 4: Configurar Redirects**

En **Settings** → **Authentication** → **URL Configuration**:
```
Site URL: https://tu-dominio.com (o http://localhost:3000 para desarrollo)
Redirect URLs: 
- https://tu-dominio.com/login/reset-password
- http://localhost:3000/login/reset-password
```

## 🧪 **Probar la Configuración**

1. Ve a tu app → "¿Olvidaste tu contraseña?"
2. Ingresa un email registrado
3. Revisa bandeja de entrada (y spam)
4. El email debería llegar en 1-2 minutos

## 🔧 **Troubleshooting**

- **Gmail blocks?** → Usar App Password, no contraseña normal
- **SendGrid issues?** → Verificar que el dominio esté verificado
- **Emails en spam?** → Configurar SPF/DKIM records para tu dominio
- **No llegan emails?** → Revisar logs en Supabase Dashboard → Logs

## ⚡ **Alternativa Rápida: Email Service**

Si tienes problemas con SMTP, puedes usar servicios como:
- **Resend** (más fácil)
- **SendGrid** (más robusto)  
- **Mailgun** (alternativa)

¡Una vez configurado, todos los emails de reset funcionarán perfectamente! 📧✅
