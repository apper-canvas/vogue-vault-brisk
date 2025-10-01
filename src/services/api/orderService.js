import authService from "./authService";

const getApperClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

const getOrderFields = () => [
  { field: { Name: "Id" } },
  { field: { Name: "order_number_c" } },
  { field: { Name: "items_c" } },
  { field: { Name: "subtotal_c" } },
  { field: { Name: "shipping_c" } },
  { field: { Name: "tax_c" } },
  { field: { Name: "total_c" } },
  { field: { Name: "shipping_address_c" } },
  { field: { Name: "status_c" } },
  { field: { Name: "created_at_c" } },
  { field: { Name: "payment_method_c" } },
  { field: { Name: "transaction_id_c" } },
  { field: { Name: "user_id_c" } }
];

const transformOrder = (data) => {
  return {
    Id: data.Id,
    userId: data.user_id_c?.Id || data.user_id_c,
    orderNumber: data.order_number_c,
    items: data.items_c ? JSON.parse(data.items_c) : [],
    subtotal: data.subtotal_c,
    shipping: data.shipping_c,
    tax: data.tax_c,
    total: data.total_c,
    shippingAddress: data.shipping_address_c ? JSON.parse(data.shipping_address_c) : {},
    paymentMethod: data.payment_method_c,
    transactionId: data.transaction_id_c,
    status: data.status_c,
    createdAt: data.created_at_c
  };
};

const orderService = {
  createOrder: async (orderData) => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      throw new Error("User not authenticated");
    }

    const apperClient = getApperClient();

    const orderRecord = {
      order_number_c: `VO${Date.now().toString().slice(-8)}`,
      items_c: JSON.stringify(orderData.items),
      subtotal_c: orderData.subtotal,
      shipping_c: orderData.shipping,
      tax_c: orderData.tax,
      total_c: orderData.total,
      shipping_address_c: JSON.stringify(orderData.shippingAddress),
      status_c: "Processing",
      created_at_c: new Date().toISOString(),
      payment_method_c: orderData.paymentMethod || "Credit Card",
      transaction_id_c: orderData.transactionId || null,
      user_id_c: currentUser.Id
    };

    const params = {
      records: [orderRecord]
    };

    const response = await apperClient.createRecord("order_c", params);

    if (!response.success) {
      throw new Error(response.message || "Failed to create order");
    }

    if (response.results) {
      const failed = response.results.filter(r => !r.success);
      if (failed.length > 0) {
        const errorMsg = failed[0].message || "Failed to create order";
        throw new Error(errorMsg);
      }

      return transformOrder(response.results[0].data);
    }

    throw new Error("Order creation failed");
  },

  getUserOrders: async () => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      throw new Error("User not authenticated");
    }

    const apperClient = getApperClient();

    const params = {
      fields: getOrderFields(),
      where: [
        {
          FieldName: "user_id_c",
          Operator: "EqualTo",
          Values: [currentUser.Id],
          Include: true
        }
      ],
      orderBy: [
        {
          fieldName: "created_at_c",
          sorttype: "DESC"
        }
      ],
      pagingInfo: { limit: 100, offset: 0 }
    };

    const response = await apperClient.fetchRecords("order_c", params);

    if (!response.success) {
      throw new Error(response.message || "Failed to fetch orders");
    }

    return (response.data || []).map(transformOrder);
  },

  getOrderById: async (orderId) => {
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      throw new Error("User not authenticated");
    }

    const apperClient = getApperClient();

    const params = {
      fields: getOrderFields()
    };

    const response = await apperClient.getRecordById("order_c", parseInt(orderId), params);

    if (!response.success) {
      throw new Error(response.message || "Failed to fetch order");
    }

    if (!response.data) {
      throw new Error("Order not found");
    }

    const order = transformOrder(response.data);

    if (order.userId !== currentUser.Id) {
      throw new Error("Order not found");
    }

    return order;
  }
};
export default orderService;