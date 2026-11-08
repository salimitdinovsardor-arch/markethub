import React, { createContext, useContext, useState, useEffect } from 'react';
import { STORAGE_KEYS } from '../utils/constants';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.CART);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // LocalStorage ga saqlab borish
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cartItems));
  }, [cartItems]);

  // 1. Mahsulot qo'shish
  const addToCart = (product, quantity = 1) => {
    setCartItems(prevItems => {
      const existing = prevItems.find(item => item.id === product.id);
      if (existing) {
        return prevItems.map(item =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevItems, { ...product, quantity }];
    });
  };

  // 2. Mahsulotni o'chirish
  const removeFromCart = (productId) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  // 3. Mahsulot sonini oshirish
  const increaseQuantity = (productId) => {
    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === productId ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  // 4. Mahsulot sonini kamaytirish
  const decreaseQuantity = (productId) => {
    setCartItems(prevItems =>
      prevItems
        .map(item =>
          item.id === productId ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter(item => item.quantity > 0)
    );
  };

  // 5. Savatchani tozalash
  const clearCart = () => {
    setCartItems([]);
  };

  // Umumiy miqdor va narx
  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItemsCount,
        totalPrice,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);

