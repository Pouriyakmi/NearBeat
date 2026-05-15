# Firebase Deployment Guide for NearBeat

## 🚀 خودکار دیپلوی کردن روی Firebase Hosting

این پروژه از **GitHub Actions** استفاده می‌کند تا به‌صورت خودکار هر بار که کد به شاخه `main` push شود، آن را روی Firebase Hosting دیپلوی کند.

### 📋 نیازمندی‌ها:

1. **Firebase Project**: `nearbeat-c4506` ✅
2. **GitHub Secrets**: باید تنظیم شوند
3. **Firebase Token**: برای GitHub Actions

---

## 🔐 تنظیم GitHub Secrets:

برای اینکه GitHub Actions بتواند روی Firebase دیپلوی کند، باید Secrets زیر را اضافه کنید:

### مراحل:
1. به مخزن GitHub بروید: [NearBeat Settings](https://github.com/pouriyakmi/NearBeat/settings/secrets/actions)
2. روی **New repository secret** کلیک کنید
3. هر secret را به ترتیب زیر اضافه کنید:

### ✅ Secrets که باید اضافه شوند:

```
FIREBASE_API_KEY
Value: AIzaSyA2yoQkYBeUQoN8pOqGwrq3D0FkyGnkCqg

FIREBASE_AUTH_DOMAIN
Value: nearbeat-c4506.firebaseapp.com

FIREBASE_PROJECT_ID
Value: nearbeat-c4506

FIREBASE_STORAGE_BUCKET
Value: nearbeat-c4506.firebasestorage.app

FIREBASE_MESSAGING_SENDER_ID
Value: 821895577441

FIREBASE_APP_ID
Value: 1:821895577441:web:06d4afbe7b8c92f4c74f20

FIREBASE_MEASUREMENT_ID
Value: G-DBQBMFX7JS

FIREBASE_TOKEN
Value: [دستور زیر را اجرا کنید]
```

### 🔑 دریافت Firebase Token:

در ترمینال اجرا کنید:

```bash
firebase login:ci
```

یا:

```bash
firebase login --interactive
firebase projects:list
```

سپس:

```bash
firebase deploy --token "YOUR_TOKEN"
```

---

## ✅ پس از تنظیم Secrets:

حالا هر بار که یک commit را به شاخه `main` push کنید:

1. ✅ GitHub Actions workflow شروع می‌شود
2. ✅ Dependencies نصب می‌شوند
3. ✅ Next.js build انجام می‌شود
4. ✅ پروژه روی Firebase Hosting دیپلوی می‌شود
5. ✅ به `nearbeat-c4506.web.app` و `nearbeat-c4506.firebaseapp.com` live می‌شود

---

## 📊 پیگیری Deployments:

- **GitHub Actions**: https://github.com/pouriyakmi/NearBeat/actions
- **Firebase Hosting**: https://console.firebase.google.com/project/nearbeat-c4506/hosting

---

## 🆘 عیب‌یابی:

اگر workflow ناموفق بود:

1. Logs را بررسی کنید: Actions tab > آخرین workflow
2. مطمئن شوید Secrets صحیح تنظیم شده‌اند
3. مطمئن شوید `firebase.json` صحیح است
4. مطمئن شوید Node version compatible است

---

## 📝 Manual Deploy (اختیاری):

اگر می‌خواهید دستی دیپلوی کنید:

```bash
npm install -g firebase-tools
firebase login
npm install
npm run build
firebase deploy --only hosting
```

---

✅ **All set!** اکنون هر push خودکار روی Firebase دیپلوی می‌شود! 🚀
