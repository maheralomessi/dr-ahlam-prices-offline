# Dr. Ahlam Prices (PWA Offline + APK via GitHub Actions)

هذا المشروع يعمل كتطبيق ويب (PWA) يدعم:
- واجهة ترحيبية + سلايدر صور (محلي داخل المشروع)
- لائحة أسعار تفاعلية + حساب إجمالي + مشاركة واتساب
- يعمل **أوفلاين بالكامل** (الصور والملفات مخزنة داخل الـ Cache)

## 1) تشغيل محلي
افتح الملف `index.html` مباشرة في المتصفح (يفضل Chrome).

> ملاحظة: Service Worker قد يحتاج تشغيل عبر سيرفر محلي أو HTTPS ليعمل بشكل كامل.
أفضل طريقة: GitHub Pages.

## 2) تفعيل GitHub Pages
1. ارفع الملفات إلى Repo جديد على GitHub
2. Settings → Pages
3. Source: Deploy from a branch
4. Branch: main / root
5. ستحصل على رابط:
   https://YOUR_USERNAME.github.io/YOUR_REPO/

افتح الرابط مرة واحدة على الأقل ليتم تثبيت الملفات داخل الكاش.
بعدها سيعمل أوفلاين.

## 3) بناء APK تلقائياً عبر GitHub Actions (TWA)
### A) أنشئ Keystore (مرة واحدة)
على Termux:
```bash
pkg update -y
pkg install -y openjdk-17
keytool -genkeypair -v -keystore release.keystore -alias clinic -keyalg RSA -keysize 2048 -validity 10000
base64 -w 0 release.keystore > keystore.b64
```

### B) ضع Secrets في GitHub
Repo → Settings → Secrets and variables → Actions → New repository secret

- ANDROID_KEYSTORE_B64  (محتوى keystore.b64)
- ANDROID_KEYSTORE_PASSWORD
- ANDROID_KEY_PASSWORD
- ANDROID_KEY_ALIAS   (مثال: clinic)

### C) عدّل رابط موقعك في ملف workflow
افتح:
`.github/workflows/build-apk.yml`
وغيّر:
`SITE_URL: "https://YOUR_USERNAME.github.io/YOUR_REPO/"`

### D) شغّل Workflow
Actions → Build APK (TWA) → Run workflow

بعد اكتمال البناء:
Actions → آخر Run → Artifacts → حمّل `clinic-apk`

## ملاحظة مهمة (الأوفلاين داخل APK)
الـ APK يعرض نفس موقع GitHub Pages (TWA)، لكنه بعد أول فتح سيخزن كل شيء في الكاش ويعمل أوفلاين.
