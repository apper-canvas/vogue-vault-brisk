import { useState, useEffect } from "react";
import { wishlistStorage } from "@/utils/localStorage";

export const useWishlist = () => {
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    const savedWishlist = wishlistStorage.get();
    setWishlist(savedWishlist);
  }, []);

  const addToWishlist = (productId) => {
    if (wishlist.includes(productId)) {
      return;
    }
    const newWishlist = [...wishlist, productId];
    setWishlist(newWishlist);
    wishlistStorage.set(newWishlist);
  };

  const removeFromWishlist = (productId) => {
    const newWishlist = wishlist.filter((id) => id !== productId);
    setWishlist(newWishlist);
    wishlistStorage.set(newWishlist);
  };

  const isInWishlist = (productId) => {
    return wishlist.includes(productId);
  };

  const toggleWishlist = (productId) => {
    if (isInWishlist(productId)) {
      removeFromWishlist(productId);
    } else {
      addToWishlist(productId);
    }
  };

  return {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    toggleWishlist
  };
};