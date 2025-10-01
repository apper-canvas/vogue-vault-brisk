import { useState, useEffect } from "react";
import { cartStorage } from "@/utils/localStorage";

export const useCart = () => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const savedCart = cartStorage.get();
    setCart(savedCart);
  }, []);

  const addToCart = (product, size, color, quantity = 1) => {
    const existingItemIndex = cart.findIndex(
      (item) =>
        item.productId === product.Id &&
        item.size === size &&
        item.color === color
    );

    let newCart;
    if (existingItemIndex >= 0) {
      newCart = [...cart];
      newCart[existingItemIndex].quantity += quantity;
    } else {
      const newItem = {
        productId: product.Id,
        name: product.name,
        price: product.price,
        quantity,
        size,
        color,
        image: product.images[0]
      };
      newCart = [...cart, newItem];
    }

    setCart(newCart);
    cartStorage.set(newCart);
    return newCart;
  };

  const removeFromCart = (productId, size, color) => {
    const newCart = cart.filter(
      (item) =>
        !(
          item.productId === productId &&
          item.size === size &&
          item.color === color
        )
    );
    setCart(newCart);
    cartStorage.set(newCart);
  };

  const updateQuantity = (productId, size, color, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId, size, color);
      return;
    }

    const newCart = cart.map((item) =>
      item.productId === productId &&
      item.size === size &&
      item.color === color
        ? { ...item, quantity }
        : item
    );
    setCart(newCart);
    cartStorage.set(newCart);
  };

  const clearCart = () => {
setCart([]);
    cartStorage.clear();
  };

  const getCart = () => {
    return cart;
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getCartCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCart,
    getCartTotal,
    getCartCount
  };
};