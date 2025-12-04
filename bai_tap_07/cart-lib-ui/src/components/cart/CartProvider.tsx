import React, { createContext, useCallback, useContext, useEffect, useState } from "react";
import { CartContextType, CartItem, CartProviderProps, CartState } from "../../types";

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<CartProviderProps> = ({ children, initialItems = [], onCartChange }) => {
  const [items, setItems] = useState<CartItem[]>(initialItems);

  const calculateTotals = useCallback((cartItems: CartItem[]): Pick<CartState, "totalItems" | "totalPrice"> => {
    return cartItems.reduce(
      (acc, item) => ({
        totalItems: acc.totalItems + item.quantity,
        totalPrice: acc.totalPrice + item.price * item.quantity,
      }),
      { totalItems: 0, totalPrice: 0 }
    );
  }, []);

  const { totalItems, totalPrice } = calculateTotals(items);

  useEffect(() => {
    if (onCartChange) {
      onCartChange({ items, totalItems, totalPrice });
    }
  }, [items, totalItems, totalPrice, onCartChange]);

  const addItem = useCallback((newItem: Omit<CartItem, "quantity"> & { quantity?: number }) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === newItem.id);

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === newItem.id ? { ...item, quantity: item.quantity + (newItem.quantity || 1) } : item
        );
      }

      return [...prevItems, { ...newItem, quantity: newItem.quantity || 1 }];
    });
  }, []);

  const removeItem = useCallback((id: string | number) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  }, []);

  const updateQuantity = useCallback(
    (id: string | number, quantity: number) => {
      if (quantity <= 0) {
        removeItem(id);
        return;
      }

      setItems((prevItems) => prevItems.map((item) => (item.id === id ? { ...item, quantity } : item)));
    },
    [removeItem]
  );

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getItem = useCallback(
    (id: string | number) => {
      return items.find((item) => item.id === id);
    },
    [items]
  );

  const value: CartContextType = {
    items,
    totalItems,
    totalPrice,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItem,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
