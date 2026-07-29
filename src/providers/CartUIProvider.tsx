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
  isWishlistOpen: boolean;
  openWishlist: () => void;
  closeWishlist: () => void;
  toggleWishlistDrawer: () => void;
};

const CartUIContext = createContext<CartUIContextValue | null>(null);

export function CartUIProvider({ children }: { children: ReactNode }) {
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);

  const openCart = useCallback(() => {
    setIsWishlistOpen(false);
    setIsCartOpen(true);
  }, []);
  const closeCart = useCallback(() => setIsCartOpen(false), []);
  const toggleCart = useCallback(() => {
    setIsWishlistOpen(false);
    setIsCartOpen((open) => !open);
  }, []);

  const openWishlist = useCallback(() => {
    setIsCartOpen(false);
    setIsWishlistOpen(true);
  }, []);
  const closeWishlist = useCallback(() => setIsWishlistOpen(false), []);
  const toggleWishlistDrawer = useCallback(() => {
    setIsCartOpen(false);
    setIsWishlistOpen((open) => !open);
  }, []);

  const value = useMemo(
    () => ({
      isCartOpen,
      openCart,
      closeCart,
      toggleCart,
      isWishlistOpen,
      openWishlist,
      closeWishlist,
      toggleWishlistDrawer,
    }),
    [
      isCartOpen,
      openCart,
      closeCart,
      toggleCart,
      isWishlistOpen,
      openWishlist,
      closeWishlist,
      toggleWishlistDrawer,
    ],
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
