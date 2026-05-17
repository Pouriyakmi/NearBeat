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

اگر خطای زیر را دیدی:
- `Upload endpoint returned HTML instead of JSON`

یعنی سایت روی Firebase Hosting به‌صورت **Static** دیپلوی شده و آدرس `/api/storage/upload` عملاً وجود ندارد (HTML برمی‌گردد).

راه‌حل:
1) یک backend واقعی برای آپلود بساز (Cloud Run / Firebase Functions / Next.js server).
2) متغیر محیطی زیر را در محیط build تنظیم کن تا فرانت‌اند به backend درست وصل شود:

```bash
NEXT_PUBLIC_UPLOAD_API_URL=https://YOUR-BACKEND-DOMAIN/api/storage/upload
```

3) دوباره build و deploy بگیر.

> نکته: فایل `firebase.json` فعلی همه مسیرها را به `index.html` rewrite می‌کند؛ بنابراین `/api/*` روی هاستینگ استاتیک اجرا نمی‌شود.

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

2) CORS را روی bucket اعمال کن:

```bash
gsutil cors set cors.json gs://nearbeat-c4506.firebasestorage.app
```

اگر bucket شما `appspot.com` است، همان نام را جایگزین کن.

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
