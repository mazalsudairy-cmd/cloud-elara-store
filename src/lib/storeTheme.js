/**
 * Storefront theme + safe custom CSS from StoreSettings.
 */

export function normalizeHex(hex) {
  if (hex == null || typeof hex !== 'string') return null;
  let h = hex.trim();
  if (!h) return null;
  if (!h.startsWith('#')) h = `#${h}`;
  const full = /^#([0-9A-Fa-f]{6})$/.exec(h);
  if (full) return h.toUpperCase();
  const short = /^#([0-9A-Fa-f]{3})$/.exec(h);
  if (!short) return null;
  const [, s] = short;
  return `#${s[0]}${s[0]}${s[1]}${s[1]}${s[2]}${s[2]}`.toUpperCase();
}

export function hexToCssHslSpace(hex) {
  const n = normalizeHex(hex);
  if (!n) return null;
  const r = Number.parseInt(n.slice(1, 3), 16) / 255;
  const g = Number.parseInt(n.slice(3, 5), 16) / 255;
  const b = Number.parseInt(n.slice(5, 7), 16) / 255;
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0;
  let s = 0;
  const l = (max + min) / 2;
  const d = max - min;
  if (d > 1e-6) {
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r:
        h = ((g - b) / d + (g < b ? 6 : 0)) / 6;
        break;
      case g:
        h = ((b - r) / d + 2) / 6;
        break;
      default:
        h = ((r - g) / d + 4) / 6;
        break;
    }
  }
  return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`;
}

const THEME_PAIR = [
  ['theme_background', '--background'],
  ['theme_navy', '--navy'],
  ['theme_navy_mid', '--navy-mid'],
  ['theme_navy_light', '--navy-light'],
  ['theme_gold', '--gold'],
  ['theme_gold_light', '--gold-light'],
  ['theme_foreground', '--foreground'],
  ['theme_card', '--card'],
  ['theme_card_foreground', '--card-foreground'],
  ['theme_muted', '--muted'],
  ['theme_muted_foreground', '--muted-foreground'],
  ['theme_border', '--border'],
  ['theme_input', '--input'],
  ['theme_accent', '--accent'],
  ['theme_primary', '--primary'],
  ['theme_ring', '--ring'],
  ['theme_sidebar_bg', '--sidebar-background'],
];

export function applyStoreThemeVars(settings) {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  for (const [key, cssVar] of THEME_PAIR) {
    const raw = settings?.[key];
    const hsl = typeof raw === 'string' && raw.trim() ? hexToCssHslSpace(raw.trim()) : null;
    if (hsl) root.style.setProperty(cssVar, hsl);
    else root.style.removeProperty(cssVar);
  }
}

export function sanitizeSiteCss(css) {
  if (!css || typeof css !== 'string') return '';
  let s = css.slice(0, 32000);
  s = s.replace(/@import\b/gi, '/*@import blocked*/');
  s = s.replace(/<\/?style/gi, '');
  s = s.replace(/<\/?script/gi, '');
  s = s.replace(/javascript\s*:/gi, '');
  s = s.replace(/expression\s*\(/gi, 'expr-blocked(');
  return s;
}

export function parseNavLabelsJson(raw) {
  try {
    const o = JSON.parse(raw || '{}');
    return o && typeof o === 'object' ? o : {};
  } catch {
    return {};
  }
}

export function uiLabel(navLabels, isRTL, key, tFallback) {
  const slot = navLabels?.[key];
  if (slot && (slot.ar || slot.en))
    return isRTL ? slot.ar || slot.en || tFallback(key) : slot.en || slot.ar || tFallback(key);
  return tFallback(key);
}
