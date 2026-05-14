import React from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/client';
import HeroSection from '@/components/store/HeroSection';
import ProductCard from '@/components/store/ProductCard';
import HomeTrustSection from '@/components/store/HomeTrustSection';
import HomeServicesSection from '@/components/store/HomeServicesSection';
import HomeFaqSection from '@/components/store/HomeFaqSection';
import HomeCtaSection from '@/components/store/HomeCtaSection';
import CategoryCard from '@/components/store/CategoryCard';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function Home() {
  const { settings } = useOutletContext();
  const { t, isRTL } = useLanguage();

  const { data: products } = useQuery({
    queryKey: ['products-featured'],
    queryFn: () => api.entities.Product.filter({ status: 'active' }, '-created_date', 8),
    initialData: [],
  });

  const { data: categories } = useQuery({
    queryKey: ['categories-home'],
    queryFn: () => api.entities.Category.filter({ status: 'active' }, 'sort_order', 6),
    initialData: [],
  });

  const featuredProducts = products.filter(p => p.featured);
  const recentProducts = products.slice(0, 8);

  return (
    <div>
      <HeroSection settings={settings} />
      <div id="browse" className="scroll-mt-24" aria-hidden="true" />

      {/* Categories */}
      {categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <SectionHeader title={t('categories')} isRTL={isRTL} />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-8">
            {categories.map((cat, i) => (
              <CategoryCard key={cat.id} category={cat} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Featured Products */}
      {featuredProducts.length > 0 && (
        <section className="mx-auto max-w-7xl bg-navy-mid/[0.12] px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
          <div className="flex items-end justify-between mb-8">
            <SectionHeader title={t('featured')} isRTL={isRTL} noMargin />
            <Link
              to="/products"
              className={`flex items-center gap-1.5 text-xs text-gold/60 hover:text-gold transition-colors ${isRTL ? 'font-arabic' : 'font-english'}`}
            >
              <span>{t('browseAll')}</span>
              {isRTL ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* New Arrivals */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8 lg:py-24">
        <div className="flex items-end justify-between mb-8">
          <SectionHeader title={t('newArrivals')} isRTL={isRTL} noMargin />
          <Link
            to="/products"
            className={`flex items-center gap-1.5 text-xs text-gold/60 hover:text-gold transition-colors ${isRTL ? 'font-arabic' : 'font-english'}`}
          >
            <span>{t('allProducts')}</span>
            {isRTL ? <ArrowLeft className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
          </Link>
        </div>
        {recentProducts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {recentProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        ) : (
          <div className="text-center py-24">
            <p className={`text-foreground/25 text-sm ${isRTL ? 'font-arabic' : 'font-english'}`}>{t('noProducts')}</p>
          </div>
        )}
      </section>

      <HomeTrustSection />
      <HomeServicesSection />
      <HomeFaqSection />
      <HomeCtaSection />
    </div>
  );
}

function SectionHeader({ title, isRTL, noMargin = false }) {
  return (
    <div className={noMargin ? '' : 'mb-10'}>
      <h2 className={`text-2xl font-semibold tracking-tight text-foreground/95 md:text-3xl ${isRTL ? 'font-arabic' : 'font-display'}`}>
        {title}
      </h2>
      <div className={`mt-3 h-px w-14 ${isRTL ? 'ml-auto bg-gradient-to-l from-gold/60 to-transparent' : 'bg-gradient-to-r from-gold/60 to-transparent'}`} />
    </div>
  );
}