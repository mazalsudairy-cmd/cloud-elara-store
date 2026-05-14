import React, { useRef } from 'react';
import { useLanguage } from '@/lib/i18n';
import { X, Printer } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

export default function OrderInvoice({ order, onClose }) {
  const { isRTL } = useLanguage();
  const printRef = useRef();

  const handlePrint = () => {
    const content = printRef.current.innerHTML;
    const win = window.open('', '_blank');
    win.document.write(`
      <html>
        <head>
          <title>Invoice ${order.order_number}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Arial', sans-serif; background: #fff; color: #111; padding: 40px; direction: ${isRTL ? 'rtl' : 'ltr'}; }
            .header { border-bottom: 2px solid #c9a84c; padding-bottom: 20px; margin-bottom: 24px; display: flex; justify-content: space-between; align-items: flex-start; }
            .brand { font-size: 24px; font-weight: 900; letter-spacing: 4px; color: #111; }
            .brand-sub { font-size: 11px; color: #c9a84c; letter-spacing: 2px; margin-top: 4px; }
            .invoice-num { text-align: ${isRTL ? 'left' : 'right'}; }
            .invoice-num h2 { font-size: 16px; color: #333; }
            .invoice-num p { font-size: 12px; color: #666; margin-top: 4px; }
            .meta { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 24px; }
            .meta-block h3 { font-size: 10px; text-transform: uppercase; letter-spacing: 2px; color: #c9a84c; margin-bottom: 8px; }
            .meta-block p { font-size: 13px; color: #333; margin-bottom: 3px; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
            thead th { background: #f5f5f5; padding: 10px 12px; text-align: ${isRTL ? 'right' : 'left'}; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #666; }
            tbody td { padding: 10px 12px; border-bottom: 1px solid #eee; font-size: 13px; }
            .totals { display: flex; flex-direction: column; align-items: flex-end; gap: 6px; }
            .totals .row { display: flex; gap: 40px; }
            .totals .label { font-size: 12px; color: #666; }
            .totals .val { font-size: 13px; font-weight: 600; min-width: 80px; text-align: ${isRTL ? 'left' : 'right'}; }
            .totals .grand { font-size: 16px; font-weight: 900; color: #c9a84c; border-top: 2px solid #c9a84c; padding-top: 8px; margin-top: 4px; }
            .footer { margin-top: 40px; text-align: center; font-size: 11px; color: #999; border-top: 1px solid #eee; padding-top: 20px; }
            .status-badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; background: #f0f0f0; }
          </style>
        </head>
        <body>${content}</body>
      </html>
    `);
    win.document.close();
    win.print();
    win.close();
  };

  const STATUS_AR = { pending: 'معلق', confirmed: 'مؤكد', processing: 'قيد التنفيذ', completed: 'مكتمل', cancelled: 'ملغي' };
  const PAY_AR = { unpaid: 'غير مدفوع', paid: 'مدفوع', refunded: 'مسترد' };
  const PAY_METHOD_AR = { bank_transfer: 'تحويل بنكي', stc_pay: 'STC Pay', other: 'أخرى' };

  const date = new Date(order.created_date).toLocaleDateString(isRTL ? 'ar-SA' : 'en-US', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
      >
        {/* Modal Controls */}
        <div className="flex items-center justify-between p-4 border-b border-gray-100">
          <div className="flex gap-2">
            <Button onClick={handlePrint} size="sm" className="bg-gray-900 hover:bg-black text-white gap-1.5">
              <Printer className="w-3.5 h-3.5" />
              {isRTL ? 'طباعة' : 'Print'}
            </Button>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Invoice Content */}
        <div ref={printRef} className="p-8" dir={isRTL ? 'rtl' : 'ltr'} style={{ fontFamily: 'Arial, sans-serif', color: '#111' }}>
          {/* Header */}
          <div className="header" style={{ borderBottom: '2px solid #c9a84c', paddingBottom: '20px', marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div className="brand" style={{ fontSize: '22px', fontWeight: '900', letterSpacing: '4px', color: '#111' }}>
                {isRTL ? 'كلاود إلارا' : 'CLOUD ELARA'}
              </div>
              <div className="brand-sub" style={{ fontSize: '10px', color: '#c9a84c', letterSpacing: '2px', marginTop: '4px' }}>
                PREMIUM DIGITAL PRODUCTS
              </div>
            </div>
            <div style={{ textAlign: isRTL ? 'left' : 'right' }}>
              <h2 style={{ fontSize: '16px', color: '#333' }}>{isRTL ? 'فاتورة' : 'INVOICE'}</h2>
              <p style={{ fontSize: '13px', color: '#c9a84c', fontWeight: '700', marginTop: '4px' }}>{order.order_number}</p>
              <p style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>{date}</p>
            </div>
          </div>

          {/* Meta */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
            <div>
              <h3 style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '2px', color: '#c9a84c', marginBottom: '8px' }}>
                {isRTL ? 'معلومات العميل' : 'Customer Info'}
              </h3>
              <p style={{ fontSize: '14px', fontWeight: '600', color: '#111', marginBottom: '3px' }}>{order.customer_name}</p>
              <p style={{ fontSize: '12px', color: '#555', marginBottom: '2px' }}>{order.customer_email}</p>
              {order.customer_phone && <p style={{ fontSize: '12px', color: '#555' }}>{order.customer_phone}</p>}
            </div>
            <div style={{ textAlign: isRTL ? 'left' : 'right' }}>
              <h3 style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '2px', color: '#c9a84c', marginBottom: '8px' }}>
                {isRTL ? 'تفاصيل الطلب' : 'Order Details'}
              </h3>
              <p style={{ fontSize: '12px', color: '#555', marginBottom: '3px' }}>
                {isRTL ? 'طريقة الدفع: ' : 'Payment: '}
                <strong>{isRTL ? PAY_METHOD_AR[order.payment_method] || order.payment_method : order.payment_method}</strong>
              </p>
              <p style={{ fontSize: '12px', color: '#555', marginBottom: '3px' }}>
                {isRTL ? 'حالة الدفع: ' : 'Payment Status: '}
                <strong>{isRTL ? PAY_AR[order.payment_status] : order.payment_status}</strong>
              </p>
              <p style={{ fontSize: '12px', color: '#555' }}>
                {isRTL ? 'حالة الطلب: ' : 'Status: '}
                <strong>{isRTL ? STATUS_AR[order.status] : order.status}</strong>
              </p>
            </div>
          </div>

          {/* Items Table */}
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '24px' }}>
            <thead>
              <tr style={{ background: '#f9f9f9' }}>
                {[
                  isRTL ? 'المنتج' : 'Product',
                  isRTL ? 'السعر' : 'Price',
                  isRTL ? 'الكمية' : 'Qty',
                  isRTL ? 'الإجمالي' : 'Total',
                ].map((h, i) => (
                  <th key={i} style={{ padding: '10px 12px', textAlign: isRTL ? 'right' : 'left', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: '#888', borderBottom: '2px solid #eee' }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {(order.items || []).map((item, i) => (
                <tr key={i} style={{ borderBottom: '1px solid #f0f0f0' }}>
                  <td style={{ padding: '10px 12px', fontSize: '13px', color: '#333' }}>
                    {isRTL ? (item.product_name_ar || item.product_name_en) : (item.product_name_en || item.product_name_ar)}
                  </td>
                  <td style={{ padding: '10px 12px', fontSize: '13px', color: '#555' }}>{item.price} SAR</td>
                  <td style={{ padding: '10px 12px', fontSize: '13px', color: '#555' }}>{item.quantity}</td>
                  <td style={{ padding: '10px 12px', fontSize: '13px', fontWeight: '600', color: '#111' }}>
                    {(item.price * item.quantity).toFixed(0)} SAR
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Total */}
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <div style={{ minWidth: '200px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderTop: '2px solid #c9a84c', marginTop: '4px' }}>
                <span style={{ fontSize: '14px', fontWeight: '700', color: '#111' }}>{isRTL ? 'الإجمالي' : 'TOTAL'}</span>
                <span style={{ fontSize: '16px', fontWeight: '900', color: '#c9a84c' }}>{order.total?.toFixed(0)} SAR</span>
              </div>
            </div>
          </div>

          {order.notes && (
            <div style={{ marginTop: '24px', background: '#f9f9f9', borderRadius: '8px', padding: '12px 16px' }}>
              <p style={{ fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1px', color: '#c9a84c', marginBottom: '6px' }}>
                {isRTL ? 'ملاحظات' : 'Notes'}
              </p>
              <p style={{ fontSize: '12px', color: '#555' }}>{order.notes}</p>
            </div>
          )}

          <div style={{ marginTop: '40px', textAlign: 'center', fontSize: '10px', color: '#bbb', borderTop: '1px solid #eee', paddingTop: '20px' }}>
            {isRTL ? 'شكراً لتعاملك مع كلاود إلارا ✦' : 'Thank you for shopping with Cloud Elara ✦'}
          </div>
        </div>
      </motion.div>
    </div>
  );
}
