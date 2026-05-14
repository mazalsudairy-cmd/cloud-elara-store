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
4. إعدادات البناء: **Framework Preset = Vite**، الأمر `npm run build`، المخرجات **`dist`** (لا تغيّرها إلى `public`).
5. إن ظهرت **شاشة بيضاء** أو `index.html` بحجم صفر في لوحة Vercel: من المشروع → **Deployments** → آخر نشر → **⋯** → **Redeploy** مع تفعيل **Clear build cache**.
6. في Vercel → **Settings → Environment Variables** أضف على الأقل `VITE_ADMIN_PASSWORD` (وأي متغيرات من الجدول أعلاه).
7. **Custom Domain**: من المشروع في Vercel → **Domains** وأضف الدومين، ثم عدّل DNS عند مسجّل الدومين كما تطلبك Vercel.

بعد `vite build` يشغّل المشروع سكربت **`scripts/verify-dist.mjs`** للتأكد أن `dist/index.html` يحتوي روابط `/assets/` وأن هناك ملفات JS في `dist/assets/` — إن فشل، يفشل البناء على Vercel ويظهر الخطأ في السجل بدل نشر موقع فارغ.

**ملاحظة SPA:** تمت إزالة `vercel.json` لتفادي تعارض مع إخراج Vite الافتراضي على Vercel. تحديث الصفحة على مسار مثل `/admin` قد يعيد 404؛ إن احتجت دعم تحديث مباشر لجميع المسارات، أضف في Vercel من **Project → Settings → Redirects/Rewrites** أو أعد إضافة قاعدة rewrite آمنة بعد التأكد أن البناء يملأ `dist` بشكل صحيح.

## ما الذي استُبدل عن Base44؟

- إزالة `@base44/sdk` و `@base44/vite-plugin`.
- واجهة موحّدة `src/api/client.js` (`api.entities`, `api.auth`, `api.integrations`) مع تخزين محلي.
- مصادقة الإدارة: صفحة `/admin/login` + `localStorage` (`elara_user`).

لربط باكند حقيقي لاحقاً: استبدل تنفيذ `src/api/localEntityStore.js` بطلبات `fetch` إلى REST API مع الحفاظ على نفس أسماء الدوال المستخدمة في الصفحات.
