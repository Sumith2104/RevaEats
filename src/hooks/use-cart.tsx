"use client";

import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import type { CartItem, MenuItem } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: number) => void;
  updateQuantity: (itemId: number, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const { toast } = useToast();

  const addToCart = useCallback((itemToAdd: MenuItem) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(cartItem => cartItem.item.id === itemToAdd.id);
      if (existingItem) {
        return prevItems.map(cartItem =>
          cartItem.item.id === itemToAdd.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem
        );
      }
      return [...prevItems, { item: itemToAdd, quantity: 1 }];
    });
    toast({
      title: `${itemToAdd.name} added to cart!`,
    });
  }, [toast]);

  const removeFromCart = useCallback((itemId: number) => {
    setCartItems(prevItems => prevItems.filter(cartItem => cartItem.item.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
    } else {
      setCartItems(prevItems =>
        prevItems.map(cartItem =>
          cartItem.item.id === itemId ? { ...cartItem, quantity } : cartItem
        )
      );
    }
  }, [removeFromCart]);
  
  const clearCart = useCallback(() => {
    setCartItems([]);
  }, []);

  const cartCount = useMemo(() => {
    return cartItems.reduce((count, cartItem) => count + cartItem.quantity, 0);
  }, [cartItems]);
  
  const cartTotal = useMemo(() => {
    return cartItems.reduce((total, cartItem) => total + cartItem.item.price * cartItem.quantity, 0);
  }, [cartItems]);

  const value = useMemo(() => ({
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartTotal
  }), [cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal]);

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
