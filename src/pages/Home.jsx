import React from 'react';
import { useOutletContext, Link } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/client';
import HeroSection from '@/components/store/HeroSection';
import ProductCard from '@/components/store/ProductCard';
import HomeTrustSection from '@/components/store/HomeTrustSection';
import HomeFaqSection from '@/components/store/HomeFaqSection';
import HomeCtaSection from '@/components/store/HomeCtaSection';
import HomeTestimonials from '@/components/store/HomeTestimonials';
import CategoryCard from '@/components/store/CategoryCard';
import { parseJsonArray, parseSectionVisibility } from '@/lib/storeTheme';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export default function Home() {
  const { settings, brandNameEn, navLabels } = useOutletContext();
  const { t, isRTL } = useLanguage();

  const { data: products } = useQuery({
    queryKey: ['products-featured'],
    queryFn: () => api.entities.Product.filter({ status: 'active' }, '-created_date', 12),
    initialData: [],
  });

  const { data: categories } = useQuery({
    queryKey: ['categories-home'],
    queryFn: () => api.entities.Category.filter({ status: 'active' }, 'sort_order', 8),
    initialData: [],
  });

  const sections = parseSectionVisibility(settings?.section_visibility_json);
  const testimonials = parseJsonArray(settings?.testimonials_json);

  const featuredProducts = products.filter((p) => p.featured).slice(0, 8);
  const bestSellers = [...products].sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0)).slice(0, 8);
  const recentProducts = products.slice(0, 8);

  return (
    <div>
      <HeroSection settings={settings} brandName={brandNameEn} navLabels={navLabels} />

      {sections.categories && categories.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <SectionHeader eyebrow={isRTL ? 'تصفّح' : 'Browse'} title={t('categories')} isRTL={isRTL} />
          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
            {categories.map((cat, i) => (
              <CategoryCard key={cat.id} category={cat} index={i} />
            ))}
          </div>
        </section>
      )}

      {sections.featured && featuredProducts.length > 0 && (
        <ProductSection
          eyebrow={isRTL ? 'مختارة' : 'Picked'}
          title={t('featured')}
          products={featuredProducts}
          isRTL={isRTL}
          linkLabel={t('browseAll')}
        />
      )}

      {sections.bestSellers && bestSellers.length > 0 && (
        <ProductSection
          eyebrow={isRTL ? 'رائج' : 'Popular'}
          title={t('bestSellers')}
          products={bestSellers}
          isRTL={isRTL}
          linkLabel={t('browseAll')}
        />
      )}

      {sections.newArrivals && (
        <ProductSection
          eyebrow={isRTL ? 'جديد' : 'New'}
          title={t('newArrivals')}
          products={recentProducts}
          isRTL={isRTL}
          linkLabel={t('allProducts')}
          emptyText={t('noProducts')}
        />
      )}

      {sections.trust && <HomeTrustSection brandName={brandNameEn} />}
      {sections.testimonials && <HomeTestimonials testimonials={testimonials} />}
      {sections.faq && <HomeFaqSection />}
      {sections.cta && <HomeCtaSection brandName={brandNameEn} />}
    </div>
  );
}

function ProductSection({ eyebrow, title, products, isRTL, linkLabel, emptyText }) {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between gap-4">
        <SectionHeader eyebrow={eyebrow} title={title} isRTL={isRTL} noMargin />
        <Link
          to="/products"
          className={`flex shrink-0 items-center gap-1.5 text-xs text-gold/70 transition-colors hover:text-gold ${isRTL ? 'font-arabic' : 'font-english'}`}
        >
          <span>{linkLabel}</span>
          {isRTL ? <ArrowLeft className="h-3.5 w-3.5" /> : <ArrowRight className="h-3.5 w-3.5" />}
        </Link>
      </div>
      {products.length > 0 ? (
        <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4">
          {products.map((p) => <ProductCard key={p.id} product={p} />)}
        </div>
      ) : (
        <div className="py-20 text-center">
          <p className={`text-sm text-foreground/30 ${isRTL ? 'font-arabic' : 'font-english'}`}>{emptyText}</p>
        </div>
      )}
    </section>
  );
}

function SectionHeader({ eyebrow, title, isRTL, noMargin = false }) {
  return (
    <div className={noMargin ? '' : ''}>
      {eyebrow ? <span className="section-eyebrow mb-2">{eyebrow}</span> : null}
      <h2 className={`text-2xl font-bold text-foreground/90 md:text-3xl ${isRTL ? 'font-arabic' : 'font-display'}`}>
        {title}
      </h2>
      <div className={`mt-3 h-1 w-12 rounded-full bg-gold/60 ${isRTL ? 'mr-0' : ''}`} />
    </div>
  );
}
