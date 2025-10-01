const CART_KEY = "vogue_vault_cart";
const WISHLIST_KEY = "vogue_vault_wishlist";
const USER_KEY = "vogue_vault_user_session";
const ORDERS_KEY = "vogue_vault_orders";

export const cartStorage = {
  get: () => {
    try {
      const cart = localStorage.getItem(CART_KEY);
      return cart ? JSON.parse(cart) : [];
    } catch (error) {
      console.error("Error reading cart from localStorage:", error);
      return [];
    }
  },

  set: (cart) => {
    try {
      localStorage.setItem(CART_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error("Error saving cart to localStorage:", error);
    }
  },

  clear: () => {
    try {
      localStorage.removeItem(CART_KEY);
    } catch (error) {
      console.error("Error clearing cart from localStorage:", error);
    }
  }
};

export const wishlistStorage = {
  get: () => {
    try {
      const wishlist = localStorage.getItem(WISHLIST_KEY);
      return wishlist ? JSON.parse(wishlist) : [];
    } catch (error) {
      console.error("Error reading wishlist from localStorage:", error);
      return [];
    }
  },

  set: (wishlist) => {
    try {
      localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
    } catch (error) {
      console.error("Error saving wishlist to localStorage:", error);
    }
  },

clear: () => {
    try {
      localStorage.removeItem(WISHLIST_KEY);
    } catch (error) {
      console.error("Error clearing wishlist from localStorage:", error);
    }
  }
};

export const userStorage = {
  get: () => {
    try {
      const user = localStorage.getItem(USER_KEY);
      return user ? JSON.parse(user) : null;
    } catch (error) {
      console.error("Error reading user from localStorage:", error);
      return null;
    }
  },

  set: (user) => {
    try {
      localStorage.setItem(USER_KEY, JSON.stringify(user));
    } catch (error) {
      console.error("Error saving user to localStorage:", error);
    }
  },

  clear: () => {
    try {
      localStorage.removeItem(USER_KEY);
    } catch (error) {
      console.error("Error clearing user from localStorage:", error);
    }
  }
};

export const orderStorage = {
  get: () => {
    try {
      const orders = localStorage.getItem(ORDERS_KEY);
      return orders ? JSON.parse(orders) : [];
    } catch (error) {
      console.error("Error reading orders from localStorage:", error);
      return [];
    }
  },

  set: (orders) => {
    try {
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
    } catch (error) {
      console.error("Error saving orders to localStorage:", error);
    }
  },

  clear: () => {
    try {
      localStorage.removeItem(ORDERS_KEY);
    } catch (error) {
      console.error("Error clearing orders from localStorage:", error);
    }
  }
};