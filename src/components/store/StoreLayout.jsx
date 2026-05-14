import React, { useMemo } from 'react';
import { Outlet } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/client';
import { parseNavLabelsJson } from '@/lib/storeTheme';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from './CartDrawer';
import StoreLiveTheme from './StoreLiveTheme';

export default function StoreLayout() {
  const { isRTL } = useLanguage();

  const { data: settingsList } = useQuery({
    queryKey: ['storeSettings'],
    queryFn: () => api.entities.StoreSettings.list(),
    initialData: [],
  });

  const settings = settingsList?.[0] || {};
  const brandNameEn = (settings.store_name_en || '').trim() || 'Cloud Elara';
  const navLabels = useMemo(() => parseNavLabelsJson(settings.ui_nav_labels_json), [settings.ui_nav_labels_json]);

  return (
    <>
      <StoreLiveTheme settings={settings} />
      <div
        id="elara-store-root"
        className={`min-h-screen flex flex-col stars-bg ${isRTL ? 'font-arabic' : 'font-english'}`}
        dir={isRTL ? 'rtl' : 'ltr'}
      >
        <Navbar brandName={brandNameEn} navLabels={navLabels} />
        <main className="flex-1">
          <Outlet context={{ settings, brandNameEn, navLabels }} />
        </main>
        <Footer brandName={brandNameEn} settings={settings} />
        <CartDrawer />
      </div>
    </>
  );
}
