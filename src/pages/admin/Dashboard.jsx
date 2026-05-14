import React from 'react';
import { useLanguage } from '@/lib/i18n';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/client';
import { Package, FolderOpen, TrendingUp, ShoppingCart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { isMonthlyProduct } from '@/lib/productPricing';
  const { t, isRTL } = useLanguage();

  const { data: products } = useQuery({
    queryKey: ['admin-products'],
    queryFn: () => api.entities.Product.list(),
    initialData: [],
  });

  const { data: categories } = useQuery({
    queryKey: ['admin-categories'],
    queryFn: () => api.entities.Category.list(),
    initialData: [],
  });

  const { data: orders } = useQuery({
    queryKey: ['admin-orders-dash'],
    queryFn: () => api.entities.Order.list('-created_date', 50),
    initialData: [],
  });

  const activeProducts = products.filter(p => p.status === 'active').length;
  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const revenue = orders.filter(o => o.payment_status === 'paid').reduce((s, o) => s + (o.total || 0), 0);

  const stats = [
    { key: 'totalProducts', value: products.length, icon: Package, color: 'bg-gold/15 text-gold border border-gold/20' },
    { key: 'totalCategories', value: categories.length, icon: FolderOpen, color: 'bg-blue-500/10 text-blue-400 border border-blue-500/20' },
    { key: 'pendingOrders', labelAr: 'الطلبات المعلقة', labelEn: 'Pending Orders', value: pendingOrders, icon: ShoppingCart, color: 'bg-yellow-500/10 text-yellow-400 border border-yellow-500/20' },
    { key: 'revenue', labelAr: 'الإيرادات', labelEn: 'Revenue', value: `${revenue.toFixed(0)}`, icon: TrendingUp, color: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' },
  ];

  return (
    <div>
      <div className="mb-8">
        <h1 className={`text-2xl md:text-3xl font-bold ${isRTL ? 'font-arabic' : 'font-english'}`}>
          {t('overview')}
        </h1>
        <p className="text-muted-foreground text-sm mt-1 font-display tracking-widest text-gold/40">ELARA ADMIN</p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.key}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="overflow-hidden border-gold/10 bg-navy">
              <CardContent className="p-6">
                <div className={`inline-flex p-3 rounded-xl mb-4 ${stat.color}`}>
                  <stat.icon className="w-5 h-5" />
                </div>
                <p className="text-3xl font-bold text-foreground font-english">{stat.value}</p>
                <p className={`text-sm text-muted-foreground mt-1 ${isRTL ? 'font-arabic' : 'font-english'}`}>
                  {stat.labelAr ? (isRTL ? stat.labelAr : stat.labelEn) : t(stat.key)}
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders */}
      {orders.length > 0 && (
        <div className="mt-10">
          <h2 className={`text-lg font-bold mb-4 ${isRTL ? 'font-arabic' : 'font-english'}`}>
            {isRTL ? 'آخر الطلبات' : 'Recent Orders'}
          </h2>
          <div className="space-y-2 mb-8">
            {orders.slice(0, 5).map(o => (
              <div key={o.id} className="flex items-center gap-4 p-3 bg-card border border-border rounded-xl">
                <div className="flex-1 min-w-0">
                  <p className={`font-medium text-sm ${isRTL ? 'font-arabic' : 'font-english'}`}>{o.customer_name}</p>
                  <p className="text-xs text-muted-foreground font-english">{o.order_number}</p>
                </div>
                <span className="text-gold text-sm font-bold font-english">{o.total?.toFixed(0)} SAR</span>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  o.status === 'completed' ? 'bg-emerald-500/15 text-emerald-400' :
                  o.status === 'pending' ? 'bg-yellow-500/15 text-yellow-400' :
                  'bg-gray-500/15 text-gray-400'
                } font-english`}>{o.status}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Products */}
      <div className="mt-4">
        <h2 className={`text-xl font-bold mb-4 ${isRTL ? 'font-arabic' : 'font-english'}`}>
          {t('newArrivals')}
        </h2>
        <div className="space-y-2">
          {products.slice(0, 5).map(p => (
            <div key={p.id} className="flex items-center gap-4 p-3 bg-card border border-border rounded-xl">
              {p.images?.[0] && (
                <img src={p.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover" />
              )}
              <div className="flex-1 min-w-0">
                <p className={`font-medium truncate ${isRTL ? 'font-arabic' : 'font-english'}`}>
                  {isRTL ? p.name_ar : (p.name_en || p.name_ar)}
                </p>
                <p className="text-sm text-muted-foreground">
                  {p.price} {t('sar')}
                  {isMonthlyProduct(p) ? ` ${t('perMonthSuffix')}` : ''}
                </p>
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${
                p.status === 'active' ? 'bg-green-100 text-green-700' :
                p.status === 'draft' ? 'bg-yellow-100 text-yellow-700' :
                'bg-gray-100 text-gray-700'
              }`}>
                {t(p.status)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}