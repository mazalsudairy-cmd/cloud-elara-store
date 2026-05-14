export default {
  name: "CartItem",
  type: "object",
  properties: {
    product_id: {
      type: "string",
    },
    quantity: {
      type: "number",
      default: 1,
    },
    session_id: {
      type: "string",
      description: "User session identifier",
    },
  },
  required: ["product_id", "quantity"],
};
