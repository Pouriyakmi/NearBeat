# 🚀 NearBeat Firebase Auto-Deploy راهنما

## ✅ راه‌اندازی دیپلوی خودکار

### مرحله 1: Firebase Token تولید کن

```bash
firebase login:ci
```

این دستور یک **token طولانی** می‌دهد. آن را کپی کن.

---

### مرحله 2: GitHub Secrets را تنظیم کن

به این آدرس برو:
```
https://github.com/pouriyakmi/NearBeat/settings/secrets/actions
```

**دکمه "New repository secret" کلیک کن** و این 7 secret را اضافه کن:

| نام Secret | مقدار |
|-----------|--------|
| `FIREBASE_TOKEN` | (token از مرحله 1) |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | `AIzaSyA2yoQkYBeUQoN8pOqGwrq3D0FkyGnkCqg` |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | `nearbeat-c4506.firebaseapp.com` |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | `nearbeat-c4506` |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | `nearbeat-c4506.appspot.com` |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | `821895577441` |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | `1:821895577441:web:06d4afbe7b8c92f4c74f20` |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | `G-DBQBMFX7JS` |

---

### مرحله 3: تایید دیپلوی

هر بار که به شاخه `main` **push** کنی:

به این آدرس برو و workflow را ببین:
```
https://github.com/pouriyakmi/NearBeat/actions
```

- اگر ✅ **سبز** شود = دیپلوی موفق!
- اگر 🔴 **قرمز** شود = مشکلی هست

---

## 📋 Workflow چه‌کار می‌کند؟

1. ✅ Dependencies نصب می‌کند (`npm install`)
2. ✅ پروژه Build می‌کند (`npm run build`)
3. ✅ Firebase Hosting به‌روزرسانی می‌شود
4. ✅ دیپلوی نهایی انجام می‌شود

---

## 🌐 دسترسی به پروژه

بعد از دیپلوی، پروژه در این آدرس‌ها فعال است:

- 🔗 `https://nearbeat-c4506.web.app`
- 🔗 `https://nearbeat-c4506.firebaseapp.com`

---

## 🆘 مشکلات رایج

### ❌ Upload روی Starting upload می‌ماند / خطای CORS در Console

اگر خطایی شبیه زیر دیدی:
- `blocked by CORS policy`
- `preflight request doesn't pass access control check`

باید CORS روی Firebase Storage bucket تنظیم شود.

1) فایل `cors.json` بساز:

```json
[
  {
    "origin": ["https://nearbeat-c4506.firebaseapp.com", "https://nearbeat-c4506.web.app", "http://localhost:3000"],
    "method": ["GET", "POST", "PUT", "HEAD", "DELETE", "OPTIONS"],
    "responseHeader": ["Content-Type", "Authorization", "x-goog-resumable"],
    "maxAgeSeconds": 3600
  }
]
```

2) CORS را روی bucket درست اعمال کن (برای Firebase SDK معمولاً `appspot.com`):

```bash
gsutil cors set cors.json gs://nearbeat-c4506.appspot.com
```

3) بعد از اعمال CORS حدود 1 تا 5 دقیقه صبر کن، سپس hard refresh بزن و دوباره تست کن.

### ❌ Build ناموفق
بررسی کن که `npm run build` به‌صورت محلی موفق است یا نه.

### ❌ Deploy ناموفق
بررسی کن که `FIREBASE_TOKEN` درست است.

### ❌ Environment Variables
مطمئن شو که تمام Secrets به‌درستی در GitHub اضافه شده‌اند.

---

## ✨ نکات مهم

- 🔐 **هرگز** FIREBASE_TOKEN را publicly share نکن!
- 📝 Secrets را فقط در GitHub Settings تنظیم کن
- 🔄 Workflow هر بار **خودکار** اجرا می‌شود

---

**سوالی دارید؟** 🤔 [مراجعه به Firebase Docs](https://firebase.google.com/docs/hosting/github-integration)
