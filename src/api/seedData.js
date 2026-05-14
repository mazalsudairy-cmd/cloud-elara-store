const now = () => new Date().toISOString();

/** Bump when replacing default Product + Category catalogs (local DB migrates via localEntityStore). */
export const ELARA_CATALOG_VERSION = 3;

function cat(id, nameAr, nameEn, sort) {
  return {
    id,
    name_ar: nameAr,
    name_en: nameEn,
    description_ar: '',
    description_en: '',
    image: '',
    sort_order: sort,
    status: 'active',
    created_date: now(),
    updated_date: now(),
  };
}

function product(p) {
  return {
    created_date: now(),
    updated_date: now(),
    currency: 'SAR',
    images: [],
    compare_price: null,
    price_period: 'one_time',
    ...p,
  };
}

export function getInitialDb() {
  const cDiscord = 'cat-discord';
  const cPerformance = 'cat-performance';
  const cServices = 'cat-services';

  const categories = [
    cat(cDiscord, 'Discord وسيرفرات', 'Discord & servers', 0),
    cat(cPerformance, 'بث وأداء PC', 'Streaming & PC performance', 1),
    cat(cServices, 'خدمات واشتراك', 'Services & subscriptions', 2),
  ];

  const products = [
    product({
      id: 'prod-1',
      name_ar: 'قوالب Discord جاهزة',
      name_en: 'Ready-made Discord templates',
      description_ar:
        'سيرفرات جاهزة، تقسيم رومات، رولات، onboarding، رسائل ترحيب، FAQ.\n\n' +
        'هذا أسرع منتج للإطلاق لأنه قريب من إدارة البوتات والسيرفرات، ودعمه أخف من البرمجة المخصصة.\n\n' +
        'نطاق السعر: ٢٩–٩٩ ر.س (حسب حجم القالب ومستوى التخصيص).',
      description_en:
        'Ready server layouts, channels, roles, onboarding, welcome messages, FAQ.\n\n' +
        'Fast to ship: aligned with Discord server and bot workflows; lighter ongoing support than fully custom builds.\n\n' +
        'Pricing band: SAR 29–99 (by template scope and customization).',
      price: 29,
      category_id: cDiscord,
      status: 'active',
      featured: true,
      stock: 999,
      sort_order: 0,
      images: ['https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800&q=80'],
    }),
    product({
      id: 'prod-2',
      name_ar: 'باقات بوتات Discord جاهزة',
      name_en: 'Discord bot starter bundles',
      description_ar:
        'بوت تذاكر، بوت حماية، بوت لفل، بوت أوامر إدارية، مع ملفات إعداد وتوجيه أساسي.\n\n' +
        'منتج منطقي لمن لديه خلفية في تطوير واستضافة البوتات لتقديم قيمة أوضح من مجرد ملف عادي.\n\n' +
        'نطاق السعر: ٧٩–٢٩٩ ر.س.',
      description_en:
        'Ticket bot, moderation, leveling, admin commands—with config files and setup notes.\n\n' +
        'Built for builders who actually host bots: higher value than a bare config dump.\n\n' +
        'Pricing band: SAR 79–299.',
      price: 79,
      category_id: cDiscord,
      status: 'active',
      featured: true,
      stock: 999,
      sort_order: 1,
      images: ['https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&q=80'],
    }),
    product({
      id: 'prod-3',
      name_ar: 'حزم إعداد Gaming / Streaming',
      name_en: 'Gaming & streaming setup packs',
      description_ar:
        'ملفات إعداد OBS، قوائم إعدادات، checklists للأداء، حزم تنظيم البث.\n\n' +
        'يناسب من يهتم بالأداء العالي وتجهيزات اللعب وبث أكثر تنظيمًا.\n\n' +
        'نطاق السعر: ٣٩–١٤٩ ر.س.',
      description_en:
        'OBS profiles, setup checklists, performance notes, broadcast organization packs.\n\n' +
        'For creators who care about smooth, high‑quality gameplay and streams.\n\n' +
        'Pricing band: SAR 39–149.',
      price: 39,
      category_id: cPerformance,
      status: 'active',
      featured: true,
      stock: 999,
      sort_order: 2,
      images: ['https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=800&q=80'],
    }),
    product({
      id: 'prod-4',
      name_ar: 'أدلة وتحسينات PC شرعية',
      name_en: 'Legitimate PC optimization guides',
      description_ar:
        'دليل تحسين ويندوز، ترتيب تعريفات، إعدادات NVIDIA/AMD، تقليل تعارض وزمن الاستجابة بشكل منظم ومفهوم.\n\n' +
        'صُمم كنظام خطوات واضح وليس مجموعة نصائح متناثرة؛ ركّز على ما هو آمن ومتوافق مع التراخيص.\n\n' +
        'نطاق السعر: ٤٩–١٩٩ ر.س.',
      description_en:
        'Structured Windows tuning, driver hygiene, NVIDIA/AMD settings, latency-focused workflow—organized, safe, legal.\n\n' +
        'Step-by-step product, not scattered tips.\n\n' +
        'Pricing band: SAR 49–199.',
      price: 49,
      category_id: cPerformance,
      status: 'active',
      featured: false,
      stock: 999,
      sort_order: 3,
      images: ['https://images.unsplash.com/photo-1593640408182-31c70c8268f5?w=800&q=80'],
    }),
    product({
      id: 'prod-5',
      name_ar: 'خدمات تركيب وتهيئة',
      name_en: 'Installation & onboarding services',
      description_ar:
        'تركيب بوت، ضبط صلاحيات، ربط استضافة، إعداد متجر أو سيرفر Discord حسب المتفق عليه مع العميل.\n\n' +
        'خيار بعد المنتجات الجاهزة: عائد أعلى لكن يتطلب تواصلًا مباشرًا وزمن تنفيذ.\n\n' +
        'نطاق السعر: ١٤٩–٨٠٠ ر.س حسب النطاق.',
      description_en:
        'Hands-on bot install, permission hardening, hosting hookup, storefront or Discord onboarding—scoped per client.\n\n' +
        'Higher-touch after templates; requires clear communication.\n\n' +
        'Pricing band: SAR 149–800 by scope.',
      price: 149,
      category_id: cServices,
      status: 'active',
      featured: false,
      stock: 99,
      sort_order: 4,
      images: ['https://images.unsplash.com/photo-1517430816045-df4b676debaa?w=800&q=80'],
    }),
    product({
      id: 'prod-6',
      name_ar: 'اشتراك شهري تقني',
      name_en: 'Monthly technical subscription',
      description_ar:
        'صيانة بوت، تحديثات، استضافة (حسب الخطة)، دعم فني، تحسينات مستمرة.\n\n' +
        'مصمّم كدخل متكرر بعد جمع عملاء من القوالب والباقات الأساسية.\n\n' +
        'نسعّر الشهرة من ٤٩–٢٩٩ ر.س / شهر حسب مستوى الخدمة.',
      description_en:
        'Bot upkeep, updates, hosting (plan-dependent), support, iterative improvements.\n\n' +
        'Recurring revenue layer after starter products.\n\n' +
        'From SAR 49–299/mo depending on SLA.',
      price: 49,
      price_period: 'month',
      category_id: cServices,
      status: 'active',
      featured: true,
      stock: 999,
      sort_order: 5,
      images: ['https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80'],
    }),
  ];

  const storeSettings = [
    {
      id: 'settings-1',
      store_name_ar: 'كلاود إلارا',
      store_name_en: 'Cloud Elara',
      hero_title_ar: 'منتجات مميزة بأسعار تناسبك',
      hero_title_en: 'Featured picks at fair prices',
      hero_subtitle_ar: '',
      hero_subtitle_en: '',
      hero_image: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1600&q=80',
      logo_url: '',
      currency: 'SAR',
      show_featured: true,
      products_per_row: 3,
      layout_style: 'grid',
      created_date: now(),
      updated_date: now(),
    },
  ];

  const paymentSettings = [
    {
      id: 'pay-1',
      paypal_enabled: true,
      paypal_email: '',
      paypal_client_id: '',
      paypal_button_html: '',
      applepay_enabled: false,
      bank_transfer_enabled: false,
      bank_name: '',
      bank_iban: '',
      bank_account_name: '',
      stc_pay_enabled: false,
      stc_pay_number: '',
      checkout_notes_ar: '',
      checkout_notes_en: '',
      min_order_amount: 0,
      currency: 'SAR',
      created_date: now(),
      updated_date: now(),
    },
  ];

  return {
    _catalog_version: ELARA_CATALOG_VERSION,
    Product: products,
    Category: categories,
    Order: [],
    StoreSettings: storeSettings,
    PaymentSettings: paymentSettings,
  };
}
