"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { CartItem } from "@/types/cart";

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper function to safely access localStorage
const getLocalStorage = (key: string) => {
  try {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key);
    }
    return null;
  } catch (error) {
    console.error('Error accessing localStorage:', error);
    return null;
  }
};

const setLocalStorage = (key: string, value: string) => {
  try {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value);
    }
  } catch (error) {
    console.error('Error setting localStorage:', error);
  }
};

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = getLocalStorage("cart");
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        if (Array.isArray(parsedCart)) {
          setItems(parsedCart);
        }
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      setItems([]);
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    try {
      setLocalStorage("cart", JSON.stringify(items));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  }, [items]);

  const addItem = (item: CartItem) => {
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => 
        i.product.sku === item.product.sku && 
        i.color === item.color && 
        i.size === item.size
      );
      if (existingItem) {
        return prevItems.map((i) =>
          i._id === existingItem._id
            ? { 
                ...i, 
                quantity: i.quantity + item.quantity,
                totalPrice: (i.quantity + item.quantity) * (i.product.salePrice || i.product.originalPrice)
              }
            : i
        );
      }
      return [...prevItems, item];
    });
  };

  const removeItem = (itemId: string) => {
    setItems((prevItems) => prevItems.filter((item) => item._id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item._id === itemId 
          ? { 
              ...item, 
              quantity,
              totalPrice: quantity * (item.product.salePrice || item.product.originalPrice)
            } 
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce(
    (total, item) => total + item.totalPrice,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}