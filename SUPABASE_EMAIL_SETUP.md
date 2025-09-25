# 📧 SUPABASE EMAIL VERIFICATION SETUP

## 🎯 Current Issues
1. **No verification emails being sent** - Supabase needs SMTP configuration
2. **Users can login without email verification** - Email confirmation not enforced

## ⚙️ SOLUTION: Complete Email Setup

### **Step 1: Configure SMTP in Supabase Dashboard**

1. Go to [supabase.com](https://supabase.com) → Your Project
2. Navigate to **Settings** → **Authentication** → **SMTP Settings**
3. Enable **Custom SMTP** and configure:

#### **Option A: Gmail (Free & Easy)**
```
SMTP Host: smtp.gmail.com
SMTP Port: 587
SMTP Username: your-email@gmail.com
SMTP Password: [App Password - NOT your regular password]
Sender Name: Crypto Force
Sender Email: your-email@gmail.com
```

**⚠️ For Gmail you need:**
1. Go to Google Account → Security → 2-Step Verification
2. Generate "App Password" specifically for Supabase
3. Use that App Password (not your Gmail password)

#### **Option B: Resend (Recommended for Production)**
```
SMTP Host: smtp.resend.com
SMTP Port: 587
SMTP Username: resend
SMTP Password: [Your Resend API Key]
Sender Name: Crypto Force
Sender Email: no-reply@thecryptoforce.com
```

### **Step 2: Enable Email Confirmation**

1. Go to **Settings** → **Authentication** → **Providers** → **Email**
2. **Enable "Confirm email"** ✅
3. This will require users to verify their email before they can login

### **Step 3: Configure Email Templates**

Go to **Settings** → **Authentication** → **Email Templates**

#### **Confirmation Email Template:**
```html
<h2>🚀 Confirma tu cuenta - Crypto Force</h2>
<p>¡Bienvenido a Crypto Force!</p>
<p>Haz clic en el enlace para confirmar tu cuenta:</p>
<p>
  <a href="{{ .ConfirmationURL }}" 
     style="background-color: #ec4d58; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
    ✅ Confirmar Cuenta
  </a>
</p>
<p>¡Gracias por unirte a nosotros!</p>
<br>
<p>Equipo de Crypto Force</p>
```

### **Step 4: Configure Redirect URLs**

Go to **Settings** → **Authentication** → **URL Configuration**:

```
Site URL: https://crypto-force-test.vercel.app
Redirect URLs: 
- https://crypto-force-test.vercel.app/auth/confirm
- https://crypto-force-test.vercel.app/auth/callback
```

### **Step 5: Test the Setup**

1. Create a new test account
2. Check email inbox (and spam folder)
3. Click the verification link
4. Try to login - should work after verification

## 🔧 **Troubleshooting**

### **If emails still don't arrive:**
1. Check Supabase Dashboard → **Logs** → **Auth** for errors
2. Verify SMTP credentials are correct
3. Check spam folder
4. Try with a different email provider

### **If verification doesn't work:**
1. Check that redirect URLs are correct
2. Verify email templates are saved
3. Check browser console for errors

## 🚀 **Quick Test Commands**

After setup, test with these commands:

```bash
# Test email sending
curl -X POST "https://your-project.supabase.co/auth/v1/admin/users" \
  -H "Authorization: Bearer YOUR_SERVICE_ROLE_KEY" \
  -H "Content-Type: application/json" \
  -d '{"email": "test@example.com", "password": "testpass123"}'
```

## ✅ **Expected Behavior After Setup**

1. **User signs up** → Receives verification email
2. **User clicks link** → Email gets verified
3. **User tries to login** → Can only login if email is verified
4. **Unverified users** → Cannot login until verified

This will create a proper email verification flow! 📧✅
