"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type CartUIContextValue = {
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  toggleCart: () => void;
};

const CartUIContext = createContext<CartUIContextValue | null>(null);

export function CartUIProvider({ children }: { children: ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);

  const openCart = useCallback(() => setIsCartOpen(true), []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => setIsCartOpen((open) => !open), []);

  const value = useMemo(
    () => ({ isCartOpen, openCart, closeCart, toggleCart }),
    [isCartOpen, openCart, closeCart, toggleCart],
  );

  return <CartUIContext.Provider value={value}>{children}</CartUIContext.Provider>;
}

export function useCartUI() {
  const context = useContext(CartUIContext);
  if (!context) {
    throw new Error("useCartUI must be used within CartUIProvider");
  }
  return context;
}
