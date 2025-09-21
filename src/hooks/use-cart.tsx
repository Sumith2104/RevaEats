
"use client";

import React, { createContext, useContext, useState, useMemo, useCallback, useEffect } from 'react';
import type { CartItem, MenuItem } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";
import { setCookie, deleteCookie, getCookie } from 'cookies-next';

interface User {
  phone: string | null;
}

interface CartContextType {
  cartItems: CartItem[];
  addToCart: (item: MenuItem) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  user: User;
  loginUser: (phone: string) => void;
  logoutUser: () => void;
  isLoadingUser: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User>({ phone: null });
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    setIsLoadingUser(true);
    // On initial load, try to get user from cookie
    const storedPhone = getCookie('userPhone');
    if (storedPhone) {
      setUser({ phone: storedPhone });
    }
    setIsLoadingUser(false);
  }, []);


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

  const removeFromCart = useCallback((itemId: string) => {
    setCartItems(prevItems => prevItems.filter(cartItem => cartItem.item.id !== itemId));
  }, []);

  const updateQuantity = useCallback((itemId: string, quantity: number) => {
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

  const loginUser = useCallback((phone: string) => {
    setUser({ phone });
    setCookie('userPhone', phone, { maxAge: 60 * 60 * 24 * 30 }); // Persist for 30 days
  }, []);

  const logoutUser = useCallback(() => {
    setUser({ phone: null });
    deleteCookie('userPhone');
    clearCart();
  }, [clearCart]);

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
    cartTotal,
    user,
    loginUser,
    logoutUser,
    isLoadingUser,
  }), [cartItems, addToCart, removeFromCart, updateQuantity, clearCart, cartCount, cartTotal, user, loginUser, logoutUser, isLoadingUser]);

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
