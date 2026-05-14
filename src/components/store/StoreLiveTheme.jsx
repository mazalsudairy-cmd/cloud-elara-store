import { useEffect } from 'react';
import { applyStoreThemeVars, sanitizeSiteCss } from '@/lib/storeTheme';

const STYLE_ID = 'elara-store-custom-css';

export default function StoreLiveTheme({ settings }) {
  useEffect(() => {
    applyStoreThemeVars(settings || {});
  }, [settings]);

  useEffect(() => {
    const css = sanitizeSiteCss(settings?.custom_site_css || '');
    let el = document.getElementById(STYLE_ID);
    if (!css) {
      if (el?.parentNode) el.parentNode.removeChild(el);
      return;
    }
    if (!el) {
      el = document.createElement('style');
      el.id = STYLE_ID;
      document.head.appendChild(el);
    }
    el.textContent = css;
    return () => {
      /** keep style on dependency change — next effect replaces text */
    };
  }, [settings?.custom_site_css]);

  return null;
}
