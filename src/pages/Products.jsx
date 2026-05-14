import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/lib/i18n';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/client';
import ProductCard from '@/components/store/ProductCard';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';

export default function Products() {
  const { t, isRTL, localized } = useLanguage();
  const urlParams = new URLSearchParams(window.location.search);
  const categoryFilter = urlParams.get('category');

  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(categoryFilter || 'all');

  const { data: products } = useQuery({
    queryKey: ['products-all'],
    queryFn: () => api.entities.Product.filter({ status: 'active' }, '-created_date', 100),
    initialData: [],
  });

  const { data: categories } = useQuery({
    queryKey: ['categories-all'],
    queryFn: () => api.entities.Category.filter({ status: 'active' }, 'sort_order'),
    initialData: [],
  });

  const filtered = useMemo(() => {
    return products.filter(p => {
      const matchCategory = selectedCategory === 'all' || p.category_id === selectedCategory;
      const matchSearch = !search || 
        p.name_ar?.toLowerCase().includes(search.toLowerCase()) ||
        p.name_en?.toLowerCase().includes(search.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [products, selectedCategory, search]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <h1 className={`text-3xl md:text-4xl font-bold mb-2 text-gold-gradient ${isRTL ? 'font-arabic' : 'font-display'}`}>
        {t('allProducts')}
      </h1>
      <div className="gold-divider mb-8 mt-4" />

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-10">
        <div className="relative flex-1 max-w-md">
          <Search className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-gold/40 ${isRTL ? 'right-3' : 'left-3'}`} />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('search')}
            className={`${isRTL ? 'pr-10 font-arabic' : 'pl-10 font-english'} rounded-xl bg-navy-mid border-gold/15 h-11 focus:border-gold/40 text-foreground placeholder:text-muted-foreground`}
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-gold text-navy font-bold shadow-lg shadow-gold/20'
                : 'bg-navy-mid border border-gold/15 text-foreground/60 hover:border-gold/40 hover:text-gold'
            } ${isRTL ? 'font-arabic' : 'font-english'}`}
          >
            {t('all')}
          </button>
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                selectedCategory === cat.id
                  ? 'bg-gold text-navy font-bold shadow-lg shadow-gold/20'
                  : 'bg-navy-mid border border-gold/15 text-foreground/60 hover:border-gold/40 hover:text-gold'
              } ${isRTL ? 'font-arabic' : 'font-english'}`}
            >
              {localized(cat, 'name')}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filtered.map(p => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className={`text-center text-gold/30 py-20 text-lg ${isRTL ? 'font-arabic' : 'font-english'}`}>
          {t('noProducts')}
        </p>
      )}
    </div>
  );
}