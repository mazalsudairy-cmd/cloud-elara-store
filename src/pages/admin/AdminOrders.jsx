import React, { useState } from 'react';
import { useLanguage } from '@/lib/i18n';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/client';
import { FileText, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import OrderInvoice from '@/components/admin/OrderInvoice';

const STATUS_COLORS = {
  pending:    'bg-yellow-500/15 text-yellow-400 border-yellow-500/20',
  confirmed:  'bg-blue-500/15 text-blue-400 border-blue-500/20',
  processing: 'bg-purple-500/15 text-purple-400 border-purple-500/20',
  completed:  'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  cancelled:  'bg-red-500/15 text-red-400 border-red-500/20',
};

const PAYMENT_COLORS = {
  unpaid:   'bg-red-500/10 text-red-400',
  paid:     'bg-emerald-500/10 text-emerald-400',
  refunded: 'bg-gray-500/10 text-gray-400',
};

const STATUS_AR = { pending: 'معلق', confirmed: 'مؤكد', processing: 'قيد التنفيذ', completed: 'مكتمل', cancelled: 'ملغي' };
const STATUS_EN = { pending: 'Pending', confirmed: 'Confirmed', processing: 'Processing', completed: 'Completed', cancelled: 'Cancelled' };
const PAY_AR = { unpaid: 'غير مدفوع', paid: 'مدفوع', refunded: 'مسترد' };
const PAY_EN = { unpaid: 'Unpaid', paid: 'Paid', refunded: 'Refunded' };

export default function AdminOrders() {
  const { t, isRTL } = useLanguage();
  const queryClient = useQueryClient();
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showInvoice, setShowInvoice] = useState(false);

  const { data: orders } = useQuery({
    queryKey: ['admin-orders'],
    queryFn: () => api.entities.Order.list('-created_date', 100),
    initialData: [],
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => api.entities.Order.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-orders'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => api.entities.Order.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-orders'] }),
  });

  const handleStatusChange = (order, field, value) => {
    updateMutation.mutate({ id: order.id, data: { [field]: value } });
  };

  const stats = {
    total: orders.length,
    pending: orders.filter(o => o.status === 'pending').length,
    completed: orders.filter(o => o.status === 'completed').length,
    revenue: orders.filter(o => o.payment_status === 'paid').reduce((s, o) => s + (o.total || 0), 0),
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className={`text-2xl font-bold ${isRTL ? 'font-arabic' : 'font-english'}`}>
          {isRTL ? 'إدارة الطلبات' : 'Orders'}
        </h1>
        <p className="text-xs text-gold/40 font-display tracking-widest mt-1">ORDERS MANAGEMENT</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: isRTL ? 'إجمالي الطلبات' : 'Total Orders', val: stats.total, color: 'text-gold' },
          { label: isRTL ? 'معلق' : 'Pending', val: stats.pending, color: 'text-yellow-400' },
          { label: isRTL ? 'مكتمل' : 'Completed', val: stats.completed, color: 'text-emerald-400' },
          { label: isRTL ? 'إجمالي الإيرادات' : 'Revenue (paid)', val: `${stats.revenue.toFixed(0)} SAR`, color: 'text-gold' },
        ].map((s, i) => (
          <div key={i} className="bg-navy-mid rounded-xl p-4 border border-gold/10">
            <p className={`text-xl font-bold ${s.color} font-english`}>{s.val}</p>
            <p className={`text-xs text-foreground/40 mt-1 ${isRTL ? 'font-arabic' : 'font-english'}`}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Orders Table */}
      <div className="rounded-xl border border-gold/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-navy-mid border-b border-gold/10">
                {[
                  isRTL ? 'رقم الطلب' : 'Order #',
                  isRTL ? 'العميل' : 'Customer',
                  isRTL ? 'المبلغ' : 'Total',
                  isRTL ? 'الدفع' : 'Payment',
                  isRTL ? 'الحالة' : 'Status',
                  isRTL ? 'التاريخ' : 'Date',
                  isRTL ? 'إجراءات' : 'Actions',
                ].map((h, i) => (
                  <th key={i} className={`px-4 py-3 text-xs font-medium text-foreground/40 ${isRTL ? 'text-right font-arabic' : 'text-left font-english'}`}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order, i) => (
                <motion.tr
                  key={order.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: i * 0.03 }}
                  className="border-b border-gold/5 hover:bg-gold/3 transition-colors"
                >
                  <td className="px-4 py-3 font-english text-xs text-gold font-medium">{order.order_number}</td>
                  <td className="px-4 py-3">
                    <p className={`text-xs text-foreground/80 ${isRTL ? 'font-arabic' : 'font-english'}`}>{order.customer_name}</p>
                    <p className="text-xs text-foreground/35 font-english">{order.customer_email}</p>
                  </td>
                  <td className="px-4 py-3 text-xs font-bold text-foreground/80 font-english">{order.total?.toFixed(0)} SAR</td>
                  <td className="px-4 py-3">
                    <select
                      value={order.payment_status}
                      onChange={e => handleStatusChange(order, 'payment_status', e.target.value)}
                      className={`text-xs px-2 py-1 rounded-full border font-english cursor-pointer bg-transparent ${PAYMENT_COLORS[order.payment_status]} border-current`}
                    >
                      {['unpaid', 'paid', 'refunded'].map(s => (
                        <option key={s} value={s} className="bg-navy text-foreground">{isRTL ? PAY_AR[s] : PAY_EN[s]}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={order.status}
                      onChange={e => handleStatusChange(order, 'status', e.target.value)}
                      className={`text-xs px-2 py-1 rounded-full border font-english cursor-pointer bg-transparent ${STATUS_COLORS[order.status]} border-current`}
                    >
                      {['pending', 'confirmed', 'processing', 'completed', 'cancelled'].map(s => (
                        <option key={s} value={s} className="bg-navy text-foreground">{isRTL ? STATUS_AR[s] : STATUS_EN[s]}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-xs text-foreground/35 font-english">
                    {new Date(order.created_date).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {order.payment_status === 'paid' && (
                        <button
                          onClick={() => { setSelectedOrder(order); setShowInvoice(true); }}
                          className="flex items-center gap-1 text-xs text-gold/60 hover:text-gold transition-colors"
                        >
                          <FileText className="w-3.5 h-3.5" />
                          <span className={isRTL ? 'font-arabic' : 'font-english'}>{isRTL ? 'فاتورة' : 'Invoice'}</span>
                        </button>
                      )}
                      <button
                        onClick={() => { if (window.confirm(isRTL ? 'حذف هذا الطلب؟' : 'Delete this order?')) deleteMutation.mutate(order.id); }}
                        className="flex items-center gap-1 text-xs text-red-400/50 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <div className="text-center py-16">
              <p className={`text-foreground/25 text-sm ${isRTL ? 'font-arabic' : 'font-english'}`}>
                {isRTL ? 'لا توجد طلبات بعد' : 'No orders yet'}
              </p>
            </div>
          )}
        </div>
      </div>

      {showInvoice && selectedOrder && (
        <OrderInvoice order={selectedOrder} onClose={() => setShowInvoice(false)} />
      )}
    </div>
  );
}