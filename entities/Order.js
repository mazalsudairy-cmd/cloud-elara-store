export default {
  name: "Order",
  type: "object",
  properties: {
    order_number: {
      type: "string",
      description: "Unique order number",
    },
    customer_name: {
      type: "string",
    },
    customer_email: {
      type: "string",
    },
    customer_phone: {
      type: "string",
    },
    items: {
      type: "array",
      items: {
        type: "object",
        properties: {
          product_id: {
            type: "string",
          },
          product_name_ar: {
            type: "string",
          },
          product_name_en: {
            type: "string",
          },
          price: {
            type: "number",
          },
          quantity: {
            type: "number",
          },
        },
      },
    },
    subtotal: {
      type: "number",
    },
    total: {
      type: "number",
    },
    currency: {
      type: "string",
      default: "SAR",
    },
    status: {
      type: "string",
      enum: ["pending", "confirmed", "processing", "completed", "cancelled"],
      default: "pending",
    },
    payment_method: {
      type: "string",
      enum: ["paypal", "applepay", "other"],
      default: "paypal",
    },
    payment_status: {
      type: "string",
      enum: ["unpaid", "paid", "refunded"],
      default: "unpaid",
    },
    notes: {
      type: "string",
    },
  },
  required: ["customer_name", "customer_email", "items", "total"],
};
