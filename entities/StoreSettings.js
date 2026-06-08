export default {
  name: "StoreSettings",
  type: "object",
  properties: {
    store_name_ar: {
      type: "string",
      default: "متجري",
    },
    store_name_en: {
      type: "string",
      default: "My Store",
    },
    hero_title_ar: {
      type: "string",
    },
    hero_title_en: {
      type: "string",
    },
    hero_subtitle_ar: {
      type: "string",
    },
    hero_subtitle_en: {
      type: "string",
    },
    hero_image: {
      type: "string",
    },
    hero_overlay_opacity: {
      type: "number",
      default: 0.4,
    },
    logo_url: {
      type: "string",
    },
    currency: {
      type: "string",
      default: "SAR",
    },
    show_featured: {
      type: "boolean",
      default: true,
    },
    products_per_row: {
      type: "number",
      default: 4,
    },
    layout_style: {
      type: "string",
      enum: ["grid", "masonry"],
      default: "grid",
    },

    // Theme / customization
    theme_preset: {
      type: "string",
      default: "violet",
    },

    // Announcement / promo bar
    promo_bar_enabled: {
      type: "boolean",
      default: true,
    },
    promo_bar_text_ar: {
      type: "string",
    },
    promo_bar_text_en: {
      type: "string",
    },

    // Hero banner slides — JSON array of
    // { image, title_ar, title_en, subtitle_ar, subtitle_en, cta_ar, cta_en, link }
    banners_json: {
      type: "string",
    },

    // Customer reviews — JSON array of { name, text_ar, text_en, rating }
    testimonials_json: {
      type: "string",
    },

    // Floating contact
    whatsapp_enabled: {
      type: "boolean",
      default: false,
    },
    whatsapp_number: {
      type: "string",
    },

    // Per-section visibility — JSON object of booleans
    section_visibility_json: {
      type: "string",
    },

    // Footer / about
    footer_about_ar: {
      type: "string",
    },
    footer_about_en: {
      type: "string",
    },

    // Advanced
    ui_nav_labels_json: {
      type: "string",
    },
    custom_site_css: {
      type: "string",
    },

    // Theme color HEX overrides
    theme_background: { type: "string" },
    theme_navy: { type: "string" },
    theme_navy_mid: { type: "string" },
    theme_navy_light: { type: "string" },
    theme_gold: { type: "string" },
    theme_gold_light: { type: "string" },
    theme_foreground: { type: "string" },
    theme_card: { type: "string" },
    theme_card_foreground: { type: "string" },
    theme_muted: { type: "string" },
    theme_muted_foreground: { type: "string" },
    theme_border: { type: "string" },
    theme_input: { type: "string" },
    theme_accent: { type: "string" },
    theme_primary: { type: "string" },
    theme_ring: { type: "string" },
    theme_sidebar_bg: { type: "string" },
  },
  required: [],
};
