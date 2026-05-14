const now = () => new Date().toISOString();

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
    ...p,
  };
}

export function getInitialDb() {
  const cDigital = 'cat-digital';
  const cServices = 'cat-services';

  const categories = [
    cat(cDigital, 'منتجات رقمية', 'Digital Products', 0),
    cat(cServices, 'خدمات', 'Services', 1),
  ];

  const products = [
    product({
      id: 'prod-1',
      name_ar: 'قالب متجر احترافي',
      name_en: 'Pro Store Template',
      description_ar: 'قالب جاهز للتخصيص.',
      description_en: 'Ready-to-customize storefront template.',
      price: 199,
      category_id: cDigital,
      status: 'active',
      featured: true,
      stock: 50,
      sort_order: 0,
      images: ['https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=800&q=80'],
    }),
    product({
      id: 'prod-2',
      name_ar: 'باقة هوية بصرية',
      name_en: 'Brand Identity Pack',
      description_ar: 'شعار وألوان وإرشادات استخدام.',
      description_en: 'Logo, colors, and usage guidelines.',
      price: 899,
      category_id: cServices,
      status: 'active',
      featured: true,
      stock: 10,
      sort_order: 1,
      images: ['https://images.unsplash.com/photo-1626785774573-4b799314346d?w=800&q=80'],
    }),
    product({
      id: 'prod-3',
      name_ar: 'استشارة تقنية',
      name_en: 'Technical Consultation',
      description_ar: 'جلسة واحدة لمراجعة البنية والأداء.',
      description_en: 'One session to review architecture and performance.',
      price: 350,
      category_id: cServices,
      status: 'active',
      featured: false,
      stock: 99,
      sort_order: 2,
      images: [],
    }),
  ];

  const storeSettings = [
    {
      id: 'settings-1',
      store_name_ar: 'كلاود إلارا',
      store_name_en: 'Cloud Elara',
      hero_title_ar: 'تجربة تسوق راقية',
      hero_title_en: 'A Refined Shopping Experience',
      hero_subtitle_ar: 'منتجات رقمية وخدمات مختارة بعناية',
      hero_subtitle_en: 'Curated digital products and services',
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
    Product: products,
    Category: categories,
    Order: [],
    StoreSettings: storeSettings,
    PaymentSettings: paymentSettings,
  };
}
