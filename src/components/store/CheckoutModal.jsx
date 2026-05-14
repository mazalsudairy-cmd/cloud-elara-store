import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '@/lib/i18n';
import { useCart } from '@/lib/cartStore';
import { api } from '@/api/client';
import { X, CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

function generateOrderNumber() {
  return 'CE-' + Date.now().toString().slice(-6) + Math.floor(Math.random() * 100);
}

function sanitizePayPalHtml(html) {
  if (!html || typeof html !== 'string') return '';
  return html
    .replace(/<script\b[\s\S]*?<\/script>/gi, '')
    .replace(/\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '');
}

function normalizePaymentSettings(raw) {
  const ps = raw && typeof raw === 'object' ? raw : {};
  return {
    ...ps,
    paypal_enabled: !!ps.paypal_enabled,
    paypal_email: ps.paypal_email || '',
    paypal_client_id: ps.paypal_client_id || '',
    paypal_button_html: ps.paypal_button_html || '',
    applepay_enabled: !!ps.applepay_enabled,
    bank_transfer_enabled: false,
    stc_pay_enabled: false,
    checkout_notes_ar: ps.checkout_notes_ar || '',
    checkout_notes_en: ps.checkout_notes_en || '',
    currency: ps.currency || 'SAR',
  };
}

const PaymentIcon = ({ method, selected }) => {
  const base = `flex flex-col items-center justify-center gap-1.5 rounded-xl border-2 p-3 cursor-pointer transition-all duration-200 ${
    selected ? 'border-gold bg-gold/10' : 'border-white/10 bg-white/5 hover:border-white/20'
  }`;

  const icons = {
    applepay: (
      <div className={base}>
        <svg viewBox="0 0 40 24" className="w-10 h-6">
          <rect width="40" height="24" rx="4" fill={selected ? '#C9A84C33' : '#ffffff11'} />
          <path
            d="M13 16c-.3-.4-.5-.9-.5-1.5 0-1.5 1.2-2.7 2.7-2.7.4 0 .8.1 1.1.2-.3-.7-1-1.2-1.8-1.2-.8 0-1.5.4-1.9 1.1-.4-.3-.9-.5-1.4-.5-1.5 0-2.7 1.2-2.7 2.7 0 .9.4 1.7 1.1 2.2L13 16zm8-4.7c0 .5-.2 1-.5 1.3.3.1.6.2.9.2.9 0 1.6-.7 1.6-1.6 0-.8-.6-1.5-1.4-1.6.1.3.2.7.2 1-.5.1-.8.4-.8.7z"
            fill={selected ? '#C9A84C' : '#aaa'}
          />
          <text x="20" y="16" textAnchor="middle" fontSize="7" fill={selected ? '#C9A84C' : '#aaa'} fontFamily="Arial" fontWeight="bold">
            Apple Pay
          </text>
        </svg>
        <span className={`text-[10px] font-bold font-english ${selected ? 'text-gold' : 'text-white/40'}`}>Apple</span>
      </div>
    ),
    paypal: (
      <div className={base}>
        <svg viewBox="0 0 40 24" className="w-10 h-6">
          <rect width="40" height="24" rx="4" fill={selected ? '#C9A84C33' : '#ffffff11'} />
          <text x="20" y="15" textAnchor="middle" fontSize="8" fill={selected ? '#C9A84C' : '#aaa'} fontFamily="Arial" fontWeight="bold">
            PayPal
          </text>
        </svg>
        <span className={`text-[10px] font-bold font-english ${selected ? 'text-gold' : 'text-white/40'}`}>PayPal</span>
      </div>
    ),
  };
  return icons[method] || null;
};

function getEnabledMethods(ps) {
  if (!ps) return [];
  const methods = [];
  if (ps.paypal_enabled) {
    methods.push({ value: 'paypal', labelAr: 'PayPal', labelEn: 'PayPal' });
  }
  if (ps.applepay_enabled) {
    methods.push({ value: 'applepay', labelAr: 'Apple Pay', labelEn: 'Apple Pay' });
  }
  return methods;
}

export default function CheckoutModal({ onClose }) {
  const { t, isRTL, localized } = useLanguage();
  const { items, totalPrice, clearCart } = useCart();

  const [paymentSettings, setPaymentSettings] = useState(null);
  const [form, setForm] = useState({ name: '', email: '', phone: '', notes: '', payment_method: '' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [orderNum, setOrderNum] = useState('');
  const [errors, setErrors] = useState({});

  const paypalEmbedRef = useRef(null);

  useEffect(() => {
    api.entities.PaymentSettings.list().then((list) => {
      const ps = normalizePaymentSettings(list?.[0] || {});
      setPaymentSettings(ps);
      const methods = getEnabledMethods(ps);
      if (methods.length > 0) {
        setForm((f) => ({ ...f, payment_method: methods[0].value }));
      }
    });
  }, []);

  useEffect(() => {
    const ref = paypalEmbedRef.current;
    if (!ref) return;
    ref.innerHTML = '';
    if (form.payment_method !== 'paypal' || !paymentSettings?.paypal_button_html?.trim()) return;
    ref.innerHTML = sanitizePayPalHtml(paymentSettings.paypal_button_html);
    return () => {
      ref.innerHTML = '';
    };
  }, [form.payment_method, paymentSettings?.paypal_button_html]);

  useEffect(() => {
    if (form.payment_method !== 'paypal' || !paymentSettings) return;
    if (paymentSettings.paypal_button_html?.trim()) return;
    const clientId = paymentSettings.paypal_client_id?.trim();
    if (!clientId) return;

    const currency = paymentSettings.currency || 'SAR';
    const containerId = 'paypal-smart-buttons-host';
    let cancelled = false;

    const mount = () => {
      const el = document.getElementById(containerId);
      if (!el || cancelled) return;
      el.innerHTML = '';
      const paypal = window.paypal;
      if (!paypal?.Buttons) return;
      paypal
        .Buttons({
          style: { layout: 'vertical', shape: 'rect' },
          createOrder: (_, actions) =>
            actions.order.create({
              purchase_units: [
                {
                  amount: {
                    currency_code: currency,
                    value: Math.max(0.01, Number(totalPrice) || 0).toFixed(2),
                  },
                },
              ],
            }),
        })
        .render(`#${containerId}`);
    };

    const existingScript = document.getElementById('paypal-sdk-checkout');
    if (existingScript) {
      existingScript.remove();
    }
    const script = document.createElement('script');
    script.id = 'paypal-sdk-checkout';
    script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=${encodeURIComponent(currency)}`;
    script.async = true;
    script.onload = () => mount();
    document.body.appendChild(script);

    return () => {
      cancelled = true;
      const el = document.getElementById(containerId);
      if (el) el.innerHTML = '';
      const s = document.getElementById('paypal-sdk-checkout');
      if (s?.parentNode) s.parentNode.removeChild(s);
    };
  }, [form.payment_method, paymentSettings?.paypal_client_id, paymentSettings?.paypal_button_html, paymentSettings?.currency, totalPrice]);

  const enabledMethods = getEnabledMethods(paymentSettings);

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = true;
    if (!form.email.trim() || !form.email.includes('@')) e.email = true;
    if (!form.payment_method) e.payment_method = true;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    const num = generateOrderNumber();
    const orderItems = items.map((i) => ({
      product_id: i.product.id,
      product_name_ar: i.product.name_ar || '',
      product_name_en: i.product.name_en || '',
      price: i.product.price,
      quantity: i.quantity,
    }));

    await api.entities.Order.create({
      order_number: num,
      customer_name: form.name,
      customer_email: form.email,
      customer_phone: form.phone,
      notes: form.notes,
      items: orderItems,
      subtotal: totalPrice,
      total: totalPrice,
      currency: 'SAR',
      status: 'pending',
      payment_method: form.payment_method,
      payment_status: 'unpaid',
    });

    const notifyTo = import.meta.env.VITE_ORDER_NOTIFICATION_EMAIL;
    if (notifyTo) {
      await api.integrations.Core.SendEmail({
        to: notifyTo,
        subject: `🛒 طلب جديد ${num} - Cloud Elara`,
        body: `
<div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h2 style="color: #c9a84c; border-bottom: 2px solid #c9a84c; padding-bottom: 10px;">طلب جديد #${num}</h2>
  <p><strong>الاسم:</strong> ${form.name}</p>
  <p><strong>البريد:</strong> ${form.email}</p>
  <p><strong>طريقة الدفع:</strong> ${form.payment_method}</p>
  <h3 style="color: #c9a84c;">الإجمالي: ${totalPrice.toFixed(0)} SAR</h3>
</div>`,
      });
    } else {
      console.info('[Elara] Order placed; set VITE_ORDER_NOTIFICATION_EMAIL for email notifications.', num);
    }

    setOrderNum(num);
    clearCart();
    setDone(true);
    setLoading(false);
  };

  const getPaymentInfo = () => {
    if (!paymentSettings || !form.payment_method) return null;

    if (form.payment_method === 'applepay') {
      return (
        <div className="mt-3 rounded-lg border border-gold/15 bg-white/5 p-3 text-xs text-white/60">
          <p className={isRTL ? 'font-arabic' : 'font-english'}>
            {isRTL
              ? 'أكمل الدفع عبر Apple Pay من جهازك المتوافق. بعد تأكيد الطلب أدناه سيتم التواصل معك لاستكمال الدفع إن لزم.'
              : 'Complete Apple Pay on your compatible device. After placing the order below we may contact you to finalize payment if needed.'}
          </p>
        </div>
      );
    }

    if (form.payment_method === 'paypal') {
      const hasEmbed = !!paymentSettings.paypal_button_html?.trim();
      const hasClient = !!paymentSettings.paypal_client_id?.trim();
      if (!hasEmbed && !hasClient) {
        return (
          <div className="mt-3 flex gap-2 rounded-lg border border-amber-500/25 bg-amber-500/10 p-3 text-xs text-amber-100/90">
            <AlertCircle className="h-4 w-4 shrink-0 text-amber-400" />
            <p className={isRTL ? 'font-arabic' : 'font-english'}>
              {isRTL
                ? 'فعّل PayPal من لوحة الإدارة وأضف معرف العميل (Client ID) أو الصق كود أزرار PayPal.'
                : 'Enable PayPal in the admin panel and add your Client ID or paste your PayPal button HTML.'}
            </p>
          </div>
        );
      }
      return (
        <div className="mt-3 space-y-3">
          {hasEmbed && (
            <div>
              <p className={`mb-2 text-[10px] uppercase tracking-wider text-gold/50 ${isRTL ? 'font-arabic' : 'font-english'}`}>
                {isRTL ? 'الدفع عبر PayPal' : 'Pay with PayPal'}
              </p>
              <div ref={paypalEmbedRef} className="paypal-embed-host" dir="ltr" />
            </div>
          )}
          {hasClient && !hasEmbed && (
            <div>
              <p className={`mb-2 text-[10px] uppercase tracking-wider text-gold/50 ${isRTL ? 'font-arabic' : 'font-english'}`}>
                {isRTL ? 'الدفع الآمن عبر PayPal' : 'Secure checkout with PayPal'}
              </p>
              <div id="paypal-smart-buttons-host" className="paypal-smart-buttons flex min-h-[48px] justify-center" />
            </div>
          )}
          {paymentSettings.paypal_email && (
            <p className="font-english text-[11px] text-white/45">
              <span className="text-gold/50">PayPal: </span>
              {paymentSettings.paypal_email}
            </p>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/75 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto overflow-x-hidden rounded-2xl border border-white/10 bg-[#0d1526] shadow-2xl"
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <div className="flex items-center justify-between border-b border-white/8 px-6 py-4">
          <h2 className={`text-base font-semibold text-white/90 ${isRTL ? 'font-arabic' : 'font-display'}`}>
            {done ? (isRTL ? 'تم الطلب بنجاح ✓' : 'Order Placed ✓') : isRTL ? 'إتمام الطلب' : 'Checkout'}
          </h2>
          <button type="button" onClick={onClose} className="text-white/30 transition-colors hover:text-white/70">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {done ? (
            <div className="py-8 text-center">
              <CheckCircle className="mx-auto mb-4 h-14 w-14 text-gold" />
              <p className={`mb-2 text-xl font-bold text-white/90 ${isRTL ? 'font-arabic' : 'font-display'}`}>
                {isRTL ? 'شكراً لطلبك!' : 'Thank you!'}
              </p>
              <p className={`mb-4 text-sm text-white/40 ${isRTL ? 'font-arabic' : 'font-english'}`}>
                {isRTL ? 'رقم طلبك:' : 'Your order number:'}
              </p>
              <div className="mb-4 inline-block rounded-lg border border-gold/25 bg-gold/10 px-6 py-3">
                <span className="font-display text-lg font-bold tracking-widest text-gold">{orderNum}</span>
              </div>
              <p className={`mb-6 text-xs text-white/35 ${isRTL ? 'font-arabic' : 'font-english'}`}>
                {isRTL
                  ? 'سيتم التواصل معك قريباً لتأكيد الطلب وتفاصيل الدفع.'
                  : 'We will contact you shortly to confirm your order and payment details.'}
              </p>
              <Button onClick={onClose} className="bg-gold font-bold text-navy hover:bg-gold-light">
                {isRTL ? 'إغلاق' : 'Close'}
              </Button>
            </div>
          ) : (
            <div className="space-y-5">
              <div className="space-y-2 rounded-xl border border-white/8 bg-white/5 p-4">
                <p className={`mb-3 text-xs text-gold/60 ${isRTL ? 'font-arabic' : 'font-english'}`}>
                  {isRTL ? 'ملخص الطلب' : 'Order Summary'}
                </p>
                {items.map((item) => (
                  <div key={item.product.id} className="flex justify-between text-xs text-white/50">
                    <span className={isRTL ? 'font-arabic' : 'font-english'}>
                      {localized(item.product, 'name')} × {item.quantity}
                    </span>
                    <span className="font-english">{(item.product.price * item.quantity).toFixed(0)} SAR</span>
                  </div>
                ))}
                <div className="flex justify-between border-t border-white/8 pt-2">
                  <span className={`text-sm font-semibold text-white/80 ${isRTL ? 'font-arabic' : 'font-english'}`}>{t('total')}</span>
                  <span className="font-english font-bold text-gold">{totalPrice.toFixed(0)} SAR</span>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <label className={`mb-1.5 block text-xs text-white/40 ${isRTL ? 'font-arabic' : 'font-english'}`}>
                    {isRTL ? 'الاسم الكامل *' : 'Full Name *'}
                  </label>
                  <Input
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={`bg-white/5 text-white/80 focus:border-gold/40 ${errors.name ? 'border-red-500/50' : 'border-white/10'} ${isRTL ? 'font-arabic' : 'font-english'}`}
                  />
                </div>
                <div>
                  <label className={`mb-1.5 block text-xs text-white/40 ${isRTL ? 'font-arabic' : 'font-english'}`}>
                    {isRTL ? 'البريد الإلكتروني *' : 'Email *'}
                  </label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className={`bg-white/5 font-english text-white/80 focus:border-gold/40 ${errors.email ? 'border-red-500/50' : 'border-white/10'}`}
                    dir="ltr"
                  />
                </div>
                <div>
                  <label className={`mb-1.5 block text-xs text-white/40 ${isRTL ? 'font-arabic' : 'font-english'}`}>
                    {isRTL ? 'رقم الجوال' : 'Phone'}
                  </label>
                  <Input
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="border-white/10 bg-white/5 font-english text-white/80 focus:border-gold/40"
                    dir="ltr"
                  />
                </div>

                <div>
                  <label className={`mb-3 block text-xs text-white/40 ${isRTL ? 'font-arabic' : 'font-english'}`}>
                    {isRTL ? 'طريقة الدفع *' : 'Payment Method *'}
                  </label>
                  {enabledMethods.length === 0 ? (
                    <div className="flex gap-2 rounded-lg border border-white/10 bg-white/5 p-3 text-xs text-white/55">
                      <AlertCircle className="h-4 w-4 shrink-0 text-gold/70" />
                      <span className={isRTL ? 'font-arabic' : 'font-english'}>
                        {isRTL
                          ? 'لا توجد طرق دفع مفعّلة. فعّل PayPal أو Apple Pay من لوحة الإدارة ← الدفع.'
                          : 'No payment methods enabled. Turn on PayPal or Apple Pay under Admin → Payment.'}
                      </span>
                    </div>
                  ) : (
                    <div className={`grid gap-2 ${enabledMethods.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
                      {enabledMethods.map((pm) => (
                        <div key={pm.value} role="button" tabIndex={0} onClick={() => setForm({ ...form, payment_method: pm.value })} onKeyDown={(e) => e.key === 'Enter' && setForm({ ...form, payment_method: pm.value })}>
                          <PaymentIcon method={pm.value} selected={form.payment_method === pm.value} />
                        </div>
                      ))}
                    </div>
                  )}
                  {getPaymentInfo()}
                </div>

                {paymentSettings && (isRTL ? paymentSettings.checkout_notes_ar : paymentSettings.checkout_notes_en) && (
                  <div className="rounded-lg border border-gold/15 bg-gold/5 p-3">
                    <p className={`text-xs text-gold/70 ${isRTL ? 'font-arabic' : 'font-english'}`}>
                      {isRTL ? paymentSettings.checkout_notes_ar : paymentSettings.checkout_notes_en}
                    </p>
                  </div>
                )}

                <div>
                  <label className={`mb-1.5 block text-xs text-white/40 ${isRTL ? 'font-arabic' : 'font-english'}`}>
                    {isRTL ? 'ملاحظات إضافية' : 'Additional Notes'}
                  </label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm({ ...form, notes: e.target.value })}
                    rows={2}
                    className={`w-full resize-none rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-white/70 focus:border-gold/40 focus:outline-none ${isRTL ? 'font-arabic' : 'font-english'}`}
                  />
                </div>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={loading || !form.payment_method || enabledMethods.length === 0}
                className="h-12 w-full rounded-xl bg-gold text-base font-bold text-navy hover:bg-gold-light"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <span className={isRTL ? 'font-arabic' : 'font-english'}>{isRTL ? 'تأكيد الطلب' : 'Place Order'}</span>}
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
