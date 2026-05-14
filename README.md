# Cloud Elara — متجر ولوحة تحكم (مستقل عن Base44)

## التشغيل السريع

```bash
npm install
npm run dev
```

## المتغيرات البيئية (`.env.local`)

| المتغير | الغرض |
|---------|--------|
| `VITE_ADMIN_PASSWORD` | كلمة مرور صفحة `/admin/login` (إلزامي في الإنتاج) |
| `VITE_ORDER_NOTIFICATION_EMAIL` | بريد استلام إشعار الطلب (اختياري) |
| `VITE_ORDER_NOTIFY_WEBHOOK` | رابط POST لإرسال JSON عند الطلب (اختياري، بديل البريد) |
| `VITE_APP_ID` | معرف تطبيق اختياري (يُخزَّن مع باراميترات URL القديمة) |
| `VITE_API_BASE_URL` | إن أضفت لاحقاً باكند REST خاص بك |
| `VITE_LOGIN_PATH` | مسار تسجيل الدخول الافتراضي `/admin/login` |

في وضع التطوير، إذا لم تُعرَّف `VITE_ADMIN_PASSWORD`، يمكن استخدام كلمة المرور **`admin`** مرة واحدة للتجربة فقط.

## البيانات محلياً

المنتجات والتصنيفات والطلبات والإعدادات تُحفظ في المتصفح تحت المفتاح `elara_local_db_v1`. لإعادة التهيئة: احذف ذلك المفتاح من تخزين الموقع أو استخدم أدوات المطوّر.

## البناء

```bash
npm run build
npm run preview
```

## GitHub + Vercel

1. أنشئ مستودعاً جديداً على [GitHub](https://github.com/new) (بدون README إن كان المشروع محلياً جاهزاً).
2. من مجلد المشروع على جهازك:

```bash
git init
git add .
git commit -m "Initial commit: Cloud Elara store"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git push -u origin main
```

3. في [Vercel](https://vercel.com): **Add New Project** → استورد نفس المستودع من GitHub.
4. إعدادات البناء (مهم جداً):
   - **Root Directory**: اتركه **`.`** (جذر المستودع) ما لم يكن المشروع داخل مجلد فرعي.
   - **Framework Preset**: **Vite**
   - **Build Command**: `npm run build`
   - **Output Directory**: **`dist`** فقط — لا تستخدم `public` (إلا إذا كان المشروع فعلاً يبني إلى هناك؛ هذا المشروع يبني إلى `dist`).
5. إن ظهرت **شاشة بيضاء** أو في ملخص النشر يظهر `index.html` بحجم صفر وبدون مجلد `assets`: غالباً **Output Directory** خاطئ أو الكاش؛ من **Deployments** → **⋯** → **Redeploy** مع **Clear build cache**، ثم راجع الخطوة 4.
6. في Vercel → **Settings → Environment Variables** أضف على الأقل `VITE_ADMIN_PASSWORD` (وأي متغيرات من الجدول أعلاه).
7. **Custom Domain**: من المشروع في Vercel → **Domains** وأضف الدومين، ثم عدّل DNS عند مسجّل الدومين كما تطلبك Vercel.

للتحقق الاختياري بعد البناء (مثلاً قبل نشر يدوي): `npm run build:verify` — يشغّل **`scripts/verify-dist.mjs`** بعد `vite build`.

**SPA على Vercel:** يوجد في الجذر `vercel.json` بقاعدة rewrite الرسمية من [توثيق Vite على Vercel](https://vercel.com/docs/frameworks/frontend/vite) حتى يعمل تحديث الصفحة على مسارات مثل `/admin`. الملفات الثابتة (مثل `/assets/*` و`/manifest.json`) تُخدم قبل إعادة التوجيه.

## ما الذي استُبدل عن Base44؟

- إزالة `@base44/sdk` و `@base44/vite-plugin`.
- واجهة موحّدة `src/api/client.js` (`api.entities`, `api.auth`, `api.integrations`) مع تخزين محلي.
- مصادقة الإدارة: صفحة `/admin/login` + `localStorage` (`elara_user`).

لربط باكند حقيقي لاحقاً: استبدل تنفيذ `src/api/localEntityStore.js` بطلبات `fetch` إلى REST API مع الحفاظ على نفس أسماء الدوال المستخدمة في الصفحات.
