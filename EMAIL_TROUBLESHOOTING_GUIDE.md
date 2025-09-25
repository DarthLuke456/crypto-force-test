# 🔧 Email Confirmation Troubleshooting Guide

## 📋 **Step 1: Analyze Current Data**

Run these SQL queries in your Supabase SQL Editor to understand the current state:

### 1.1 Check Users Table
```sql
-- See all current users
SELECT email, user_level, created_at FROM users ORDER BY created_at DESC;
```

### 1.2 Check for Duplicates
```sql
-- Check for duplicate emails
SELECT email, COUNT(*) as count FROM users GROUP BY email HAVING COUNT(*) > 1;
```

### 1.3 Check Auth Users (if accessible)
```sql
-- Check auth.users table
SELECT email, email_confirmed_at, created_at FROM auth.users 
WHERE email IN ('infocryptoforce@gmail.com', 'coeurdeluke.js@gmail.com', 'josefranciscocastrosias@gmail.com');
```

## 🧹 **Step 2: Clean Up Data**

### 2.1 Delete All Users Except Authorized Ones
```sql
-- WARNING: This deletes all users except the 3 authorized ones
DELETE FROM users 
WHERE email NOT IN (
    'infocryptoforce@gmail.com',
    'coeurdeluke.js@gmail.com', 
    'josefranciscocastrosias@gmail.com'
);
```

### 2.2 Clean Auth Users (if needed)
```sql
-- Delete from auth.users if they exist
DELETE FROM auth.users 
WHERE email NOT IN (
    'infocryptoforce@gmail.com',
    'coeurdeluke.js@gmail.com', 
    'josefranciscocastrosias@gmail.com'
);
```

## 🔧 **Step 3: Check Supabase Settings**

### 3.1 Authentication Settings
1. Go to **Supabase Dashboard** → **Authentication** → **Settings**
2. Check these settings:
   - ✅ **Enable email confirmations**: ON
   - ✅ **Enable email change confirmations**: ON
   - ✅ **Enable phone confirmations**: OFF (unless needed)

### 3.2 Email Templates
1. Go to **Authentication** → **Email Templates**
2. Check **Confirm signup** template:
   - ✅ Template is enabled
   - ✅ Subject line is set
   - ✅ Body contains `{{ .ConfirmationURL }}`

### 3.3 SMTP Configuration
1. Go to **Authentication** → **SMTP Settings**
2. Verify:
   - ✅ **Enable custom SMTP**: ON
   - ✅ **SMTP Host**: Your email provider (Gmail, Resend, etc.)
   - ✅ **SMTP Port**: 587 or 465
   - ✅ **SMTP User**: Your email
   - ✅ **SMTP Password**: App password (not regular password)

### 3.4 Redirect URLs
1. Go to **Authentication** → **URL Configuration**
2. Set:
   - **Site URL**: `https://crypto-force-test.vercel.app`
   - **Redirect URLs**:
     - `https://crypto-force-test.vercel.app/auth/confirm`
     - `https://crypto-force-test.vercel.app/auth/callback`
     - `https://crypto-force-test.vercel.app/login/dashboard-selection`

## 🧪 **Step 4: Test Email Confirmation**

### 4.1 Create Test Account
1. Go to your signup page
2. Use a **new email address** (not one of the authorized ones)
3. Fill out the form and submit
4. Check if confirmation email arrives

### 4.2 Check Email Delivery
- Check **spam/junk folder**
- Check **promotions tab** (Gmail)
- Wait 2-3 minutes for delivery
- Try different email providers (Gmail, Outlook, etc.)

### 4.3 Debug Email Issues
If emails don't arrive:
1. Check **Supabase Dashboard** → **Logs** → **Auth**
2. Look for error messages
3. Check **SMTP logs** if using custom SMTP
4. Try **Supabase's default email** (disable custom SMTP temporarily)

## 🔍 **Step 5: Common Issues & Solutions**

### Issue 1: Emails Not Arriving
**Causes:**
- SMTP not configured properly
- Email confirmations disabled
- Wrong redirect URLs
- Email provider blocking

**Solutions:**
- Verify SMTP settings
- Enable email confirmations
- Check redirect URLs
- Try different email provider

### Issue 2: "Token not found" Error
**Causes:**
- Wrong redirect URL format
- Token expired
- URL encoding issues

**Solutions:**
- Check redirect URLs in Supabase
- Ensure URLs use HTTPS
- Check URL encoding

### Issue 3: Users Can Login Without Verification
**Causes:**
- Email confirmations disabled
- Users created before verification was enabled

**Solutions:**
- Enable email confirmations
- Delete unverified users
- Test with new accounts

## 📞 **Step 6: Get Help**

If issues persist:
1. Check **Supabase Status Page**
2. Review **Supabase Documentation**
3. Check **Supabase Community Forum**
4. Contact **Supabase Support**

## ✅ **Success Indicators**

You'll know it's working when:
- ✅ New signup sends confirmation email
- ✅ Clicking email link redirects to your site
- ✅ User gets verified and can access dashboard
- ✅ Unverified users cannot login
