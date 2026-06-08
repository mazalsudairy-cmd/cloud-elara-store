/**
 * Storefront theme presets, live theme variables, and safe custom CSS.
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

/** Convert an "H S% L%" token back to a #RRRRGG hex (for color inputs). */
export function hslSpaceToHex(hsl) {
  if (typeof hsl !== 'string') return null;
  const m = /^\s*([\d.]+)\s+([\d.]+)%\s+([\d.]+)%\s*$/.exec(hsl);
  if (!m) return null;
  const h = Number(m[1]) / 360;
  const s = Number(m[2]) / 100;
  const l = Number(m[3]) / 100;
  const hue = (p, q, t) => {
    let tt = t;
    if (tt < 0) tt += 1;
    if (tt > 1) tt -= 1;
    if (tt < 1 / 6) return p + (q - p) * 6 * tt;
    if (tt < 1 / 2) return q;
    if (tt < 2 / 3) return p + (q - p) * (2 / 3 - tt) * 6;
    return p;
  };
  let r;
  let g;
  let b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue(p, q, h + 1 / 3);
    g = hue(p, q, h);
    b = hue(p, q, h - 1 / 3);
  }
  const toHex = (x) => Math.round(x * 255).toString(16).padStart(2, '0');
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`.toUpperCase();
}

/* ── Theme presets — each maps CSS variables to "H S% L%" tokens ── */
export const THEME_PRESETS = {
  violet: {
    key: 'violet',
    label_ar: 'بنفسجي ليلي',
    label_en: 'Midnight Violet',
    swatch: '#7C5CFF',
    vars: {
      '--background': '230 40% 7%',
      '--navy': '230 40% 7%',
      '--navy-mid': '230 32% 12%',
      '--navy-light': '230 28% 17%',
      '--gold': '255 92% 68%',
      '--gold-light': '262 100% 78%',
      '--foreground': '230 25% 94%',
      '--card': '230 32% 11%',
      '--card-foreground': '230 25% 94%',
      '--muted': '230 26% 16%',
      '--muted-foreground': '230 14% 62%',
      '--border': '230 28% 19%',
      '--input': '230 28% 19%',
      '--accent': '255 92% 68%',
      '--primary': '255 92% 68%',
      '--ring': '255 92% 68%',
      '--sidebar-background': '230 36% 9%',
    },
  },
  cyan: {
    key: 'cyan',
    label_ar: 'سماوي كهربائي',
    label_en: 'Electric Cyan',
    swatch: '#22D3EE',
    vars: {
      '--background': '210 45% 6%',
      '--navy': '210 45% 6%',
      '--navy-mid': '208 38% 11%',
      '--navy-light': '206 32% 16%',
      '--gold': '190 95% 55%',
      '--gold-light': '185 100% 66%',
      '--foreground': '200 25% 94%',
      '--card': '208 38% 10%',
      '--card-foreground': '200 25% 94%',
      '--muted': '208 30% 15%',
      '--muted-foreground': '205 14% 60%',
      '--border': '208 30% 18%',
      '--input': '208 30% 18%',
      '--accent': '190 95% 55%',
      '--primary': '190 95% 55%',
      '--ring': '190 95% 55%',
      '--sidebar-background': '208 40% 8%',
    },
  },
  emerald: {
    key: 'emerald',
    label_ar: 'زمردي',
    label_en: 'Emerald',
    swatch: '#10B981',
    vars: {
      '--background': '200 30% 6%',
      '--navy': '200 30% 6%',
      '--navy-mid': '190 25% 10%',
      '--navy-light': '185 22% 15%',
      '--gold': '158 84% 48%',
      '--gold-light': '150 80% 58%',
      '--foreground': '160 18% 93%',
      '--card': '190 25% 9%',
      '--card-foreground': '160 18% 93%',
      '--muted': '190 20% 14%',
      '--muted-foreground': '175 12% 58%',
      '--border': '190 20% 17%',
      '--input': '190 20% 17%',
      '--accent': '158 84% 48%',
      '--primary': '158 84% 48%',
      '--ring': '158 84% 48%',
      '--sidebar-background': '190 26% 8%',
    },
  },
  crimson: {
    key: 'crimson',
    label_ar: 'قرمزي',
    label_en: 'Crimson',
    swatch: '#F43F5E',
    vars: {
      '--background': '230 25% 6%',
      '--navy': '230 25% 6%',
      '--navy-mid': '228 20% 11%',
      '--navy-light': '226 18% 16%',
      '--gold': '350 90% 62%',
      '--gold-light': '356 95% 71%',
      '--foreground': '20 20% 94%',
      '--card': '228 20% 10%',
      '--card-foreground': '20 20% 94%',
      '--muted': '228 16% 15%',
      '--muted-foreground': '350 10% 62%',
      '--border': '228 16% 18%',
      '--input': '228 16% 18%',
      '--accent': '350 90% 62%',
      '--primary': '350 90% 62%',
      '--ring': '350 90% 62%',
      '--sidebar-background': '228 22% 8%',
    },
  },
  gold: {
    key: 'gold',
    label_ar: 'ذهبي كلاسيكي',
    label_en: 'Classic Gold',
    swatch: '#D4AF5A',
    vars: {
      '--background': '220 60% 6%',
      '--navy': '220 60% 6%',
      '--navy-mid': '220 45% 10%',
      '--navy-light': '220 35% 14%',
      '--gold': '42 72% 56%',
      '--gold-light': '42 80% 70%',
      '--foreground': '42 30% 92%',
      '--card': '220 45% 10%',
      '--card-foreground': '42 30% 92%',
      '--muted': '220 30% 16%',
      '--muted-foreground': '220 15% 55%',
      '--border': '220 30% 18%',
      '--input': '220 30% 18%',
      '--accent': '42 72% 56%',
      '--primary': '42 72% 56%',
      '--ring': '42 72% 56%',
      '--sidebar-background': '220 45% 8%',
    },
  },
};

export const THEME_PRESET_LIST = Object.values(THEME_PRESETS);
export const DEFAULT_PRESET_KEY = 'violet';

/* HEX override fields → CSS variable */
export const THEME_PAIR = [
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

  // 1) Apply the selected preset as the base.
  const presetKey = settings?.theme_preset || DEFAULT_PRESET_KEY;
  const preset = THEME_PRESETS[presetKey] || THEME_PRESETS[DEFAULT_PRESET_KEY];
  for (const [cssVar, val] of Object.entries(preset.vars)) {
    root.style.setProperty(cssVar, val);
  }

  // 2) Apply per-field HEX overrides on top (blank = keep preset value).
  for (const [key, cssVar] of THEME_PAIR) {
    const raw = settings?.[key];
    const hsl = typeof raw === 'string' && raw.trim() ? hexToCssHslSpace(raw.trim()) : null;
    if (hsl) root.style.setProperty(cssVar, hsl);
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

/** Tolerant JSON array parser for banners / testimonials. */
export function parseJsonArray(raw) {
  if (Array.isArray(raw)) return raw;
  if (typeof raw !== 'string' || !raw.trim()) return [];
  try {
    const o = JSON.parse(raw);
    return Array.isArray(o) ? o : [];
  } catch {
    return [];
  }
}

export function parseSectionVisibility(raw) {
  const defaults = {
    categories: true,
    featured: true,
    bestSellers: true,
    newArrivals: true,
    trust: true,
    testimonials: true,
    faq: true,
    cta: true,
  };
  try {
    const o = typeof raw === 'string' ? JSON.parse(raw || '{}') : raw || {};
    return { ...defaults, ...(o && typeof o === 'object' ? o : {}) };
  } catch {
    return defaults;
  }
}

export function uiLabel(navLabels, isRTL, key, tFallback) {
  const slot = navLabels?.[key];
  if (slot && (slot.ar || slot.en))
    return isRTL ? slot.ar || slot.en || tFallback(key) : slot.en || slot.ar || tFallback(key);
  return tFallback(key);
}
