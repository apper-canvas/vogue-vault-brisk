import ordersData from "../mockData/orders.json";
import authService from "./authService";

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const ORDER_STORAGE_KEY = "vogue_vault_orders";

const getStoredOrders = () => {
  try {
    const stored = localStorage.getItem(ORDER_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [...ordersData];
  } catch (error) {
    console.error("Error reading orders from localStorage:", error);
    return [...ordersData];
  }
};

const saveOrders = (orders) => {
  try {
    localStorage.setItem(ORDER_STORAGE_KEY, JSON.stringify(orders));
  } catch (error) {
    console.error("Error saving orders to localStorage:", error);
  }
};

const orderService = {
createOrder: async (orderData) => {
    await delay(400);
    
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      throw new Error("User not authenticated");
    }
    
    const orders = getStoredOrders();
    
    const newOrder = {
      Id: Math.max(...orders.map((o) => o.Id), 0) + 1,
      userId: currentUser.Id,
      orderNumber: `VO${Date.now().toString().slice(-8)}`,
      items: orderData.items,
      subtotal: orderData.subtotal,
      shipping: orderData.shipping,
      tax: orderData.tax,
      total: orderData.total,
      shippingAddress: orderData.shippingAddress,
      paymentMethod: orderData.paymentMethod || "Credit Card",
      transactionId: orderData.transactionId || null,
      status: "Processing",
      createdAt: new Date().toISOString()
    };
    
    orders.push(newOrder);
    saveOrders(orders);
    
    return newOrder;
  },

  getUserOrders: async () => {
    await delay(300);
    
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      throw new Error("User not authenticated");
    }
    
    const orders = getStoredOrders();
    return orders
      .filter((order) => order.userId === currentUser.Id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  getOrderById: async (orderId) => {
    await delay(200);
    
    const currentUser = authService.getCurrentUser();
    if (!currentUser) {
      throw new Error("User not authenticated");
    }
    
    const orders = getStoredOrders();
    const order = orders.find(
      (o) => o.Id === parseInt(orderId) && o.userId === currentUser.Id
    );
    
    if (!order) {
      throw new Error("Order not found");
    }
    
    return order;
  }
};

export default orderService;