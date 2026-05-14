import React from 'react';
import { Outlet } from 'react-router-dom';
import { useLanguage } from '@/lib/i18n';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api/client';
import Navbar from './Navbar';
import Footer from './Footer';
import CartDrawer from './CartDrawer';


export default function StoreLayout() {
  const { isRTL, localized } = useLanguage();

  const { data: settingsList } = useQuery({
    queryKey: ['storeSettings'],
    queryFn: () => api.entities.StoreSettings.list(),
    initialData: [],
  });

  const settings = settingsList?.[0] || {};
  const storeName = localized(settings, 'store_name') || (isRTL ? 'كلاود إلارا' : 'Cloud Elara');

  return (
    <div className={`min-h-screen flex flex-col stars-bg ${isRTL ? 'font-arabic' : 'font-english'}`} dir={isRTL ? 'rtl' : 'ltr'}>
      <Navbar storeName={storeName} />
      <main className="flex-1">
        <Outlet context={{ settings, storeName }} />
      </main>
      <Footer storeName={storeName} />
      <CartDrawer />
    </div>
  );
}