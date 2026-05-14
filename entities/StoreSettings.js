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
      default: 3,
    },
    layout_style: {
      type: "string",
      enum: ["grid", "masonry"],
      default: "grid",
    },
  },
  required: [],
};
