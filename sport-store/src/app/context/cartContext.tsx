"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { generateUniqueId } from "@/utils/generateUniqueId";

interface CartItem {
  cartItemId: string;
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  quantity: number;
  size?: string;
  color?: string;
  image?: string;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: CartItem) => void;
  updateQuantity: (id: string, size: string | undefined, color: string | undefined, quantity: number) => void;
  removeFromCart: (id: string, size: string | undefined, color: string | undefined) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Load cart items from localStorage when component mounts
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        // Ensure each item has a unique cartItemId
        const validatedCart = parsedCart.map((item: CartItem) => ({
          ...item,
          cartItemId: item.cartItemId || generateUniqueId()
        }));
        setCartItems(validatedCart);
      } catch (error) {
        console.error('Error loading cart from localStorage:', error);
        localStorage.removeItem('cart'); // Clear invalid cart data
      }
    }
  }, []);

  // Save cart items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cartItems));
  }, [cartItems]);

  // Thêm sản phẩm vào giỏ
  const addToCart = (item: CartItem) => {
    if (!item.id) {
      console.error("Invalid cart item (missing id):", item);
      throw new Error("Giá trị id của sản phẩm không hợp lệ");
    }

    setCartItems((prev) => {
      const existingItem = prev.find(
        (cartItem) =>
          cartItem.id === item.id &&
          cartItem.size === item.size &&
          cartItem.color === item.color
      );

      if (existingItem) {
        return prev.map((cartItem) =>
          cartItem.id === item.id &&
          cartItem.size === item.size &&
          cartItem.color === item.color
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
      }

      const newItem = {
        ...item,
        cartItemId: generateUniqueId()
      };
      return [...prev, newItem];
    });
  };

  // Cập nhật số lượng
  const updateQuantity = (
    id: string,
    size: string | undefined,
    color: string | undefined,
    quantity: number
  ) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id && item.size === size && item.color === color
          ? { ...item, quantity }
          : item
      )
    );
  };

  // Xóa sản phẩm
  const removeFromCart = (id: string, size: string | undefined, color: string | undefined) => {
    setCartItems((prev) =>
      prev.filter(
        (item) =>
          !(item.id === id && item.size === size && item.color === color)
      )
    );
  };

  // Xóa toàn bộ giỏ hàng
  const clearCart = () => {
    setCartItems([]);
    localStorage.removeItem('cart'); // Clear cart from localStorage
  };

  return (
    <CartContext.Provider
      value={{ cartItems, addToCart, updateQuantity, removeFromCart, clearCart }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}