import React, { createContext, useContext, useState, useCallback } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [items, setItems] = useState(() => {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : [];
  });
  const [isOpen, setIsOpen] = useState(false);

  const save = (newItems) => {
    setItems(newItems);
    localStorage.setItem('cart', JSON.stringify(newItems));
  };

  const addItem = useCallback((product, qty = 1) => {
    setItems(prev => {
      const existing = prev.find(i => i.product.id === product.id);
      let next;
      if (existing) {
        next = prev.map(i => i.product.id === product.id ? { ...i, quantity: i.quantity + qty } : i);
      } else {
        next = [...prev, { product, quantity: qty }];
      }
      localStorage.setItem('cart', JSON.stringify(next));
      return next;
    });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((productId) => {
    setItems(prev => {
      const next = prev.filter(i => i.product.id !== productId);
      localStorage.setItem('cart', JSON.stringify(next));
      return next;
    });
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems(prev => {
      const next = prev.map(i => i.product.id === productId ? { ...i, quantity } : i);
      localStorage.setItem('cart', JSON.stringify(next));
      return next;
    });
  }, [removeItem]);

  const clearCart = useCallback(() => {
    save([]);
  }, []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = items.reduce((sum, i) => sum + (i.product.price * i.quantity), 0);

  return (
    <CartContext.Provider value={{ items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice, isOpen, setIsOpen }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
