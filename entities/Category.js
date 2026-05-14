export default {
  name: "Category",
  type: "object",
  properties: {
    name_ar: {
      type: "string",
      description: "Category name in Arabic",
    },
    name_en: {
      type: "string",
      description: "Category name in English",
    },
    description_ar: {
      type: "string",
    },
    description_en: {
      type: "string",
    },
    image: {
      type: "string",
    },
    sort_order: {
      type: "number",
      default: 0,
    },
    status: {
      type: "string",
      enum: ["active", "hidden"],
      default: "active",
    },
  },
  required: ["name_ar"],
};
