export default {
  name: "Product",
  type: "object",
  properties: {
    name_ar: {
      type: "string",
      description: "Product name in Arabic",
    },
    name_en: {
      type: "string",
      description: "Product name in English",
    },
    description_ar: {
      type: "string",
      description: "Product description in Arabic",
    },
    description_en: {
      type: "string",
      description: "Product description in English",
    },
    price: {
      type: "number",
      description: "Product price",
    },
    compare_price: {
      type: "number",
      description: "Original price before discount",
    },
    currency: {
      type: "string",
      default: "SAR",
    },
    images: {
      type: "array",
      items: {
        type: "string",
      },
      description: "Product image URLs",
    },
    category_id: {
      type: "string",
      description: "Category ID",
    },
    status: {
      type: "string",
      enum: ["active", "draft", "archived"],
      default: "active",
    },
    featured: {
      type: "boolean",
      default: false,
    },
    stock: {
      type: "number",
      default: 0,
    },
    sort_order: {
      type: "number",
      default: 0,
    },
  },
  required: ["name_ar", "price"],
};
