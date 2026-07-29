"use client";

import { useSyncExternalStore } from "react";
import type { Cart, CartItem } from "@/types/cart";
import type { ProductSize } from "@/types/product";

type CartStore = {
  items: CartItem[];
};

type AddItemInput = Omit<CartItem, "quantity"> & {
  quantity?: number;
};

const CART_STORAGE_KEY = "hidden-urban-cart";
const emptyStore: CartStore = { items: [] };

let cartState: CartStore = emptyStore;
let hydrated = false;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function persist(items: CartItem[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* ignore quota errors */
  }
}

function readStoredItems(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (item): item is CartItem =>
        Boolean(item && typeof item === "object" && "productId" in item && "quantity" in item),
    );
  } catch {
    return [];
  }
}

function ensureHydrated() {
  if (hydrated || typeof window === "undefined") return;
  hydrated = true;
  cartState = { items: readStoredItems() };
}

function setItems(items: CartItem[]) {
  cartState = { items };
  persist(items);
  emit();
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  ensureHydrated();
  return cartState;
}

function getServerSnapshot() {
  return emptyStore;
}

function itemKey(productId: string, size: ProductSize, color: string) {
  return `${productId}:${size}:${color}`;
}

export function useCart() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const subtotal = state.items.reduce(
    (total, item) => total + item.price * item.quantity,
    0,
  );

  const savings = state.items.reduce((total, item) => {
    const compare = item.compareAtPrice;
    if (compare == null || compare <= item.price) return total;
    return total + (compare - item.price) * item.quantity;
  }, 0);

  const cart: Cart = {
    items: state.items,
    subtotal,
    savings,
    currency: state.items[0]?.currency ?? "BDT",
  };

  function addItem(input: AddItemInput) {
    ensureHydrated();
    const quantity = input.quantity ?? 1;
    const existing = cartState.items.find(
      (item) =>
        item.productId === input.productId &&
        item.size === input.size &&
        item.color === input.color,
    );

    if (existing) {
      setItems(
        cartState.items.map((item) =>
          item === existing ? { ...item, quantity: item.quantity + quantity } : item,
        ),
      );
    } else {
      setItems([...cartState.items, { ...input, quantity }]);
    }
  }

  function removeItem(productId: string, size: ProductSize, color: string) {
    ensureHydrated();
    setItems(
      cartState.items.filter(
        (item) =>
          itemKey(item.productId, item.size, item.color) !== itemKey(productId, size, color),
      ),
    );
  }

  function updateQuantity(
    productId: string,
    size: ProductSize,
    color: string,
    quantity: number,
  ) {
    if (quantity <= 0) {
      removeItem(productId, size, color);
      return;
    }

    ensureHydrated();
    setItems(
      cartState.items.map((item) =>
        itemKey(item.productId, item.size, item.color) === itemKey(productId, size, color)
          ? { ...item, quantity }
          : item,
      ),
    );
  }

  function clearCart() {
    setItems([]);
  }

  return {
    cart,
    itemCount: state.items.reduce((count, item) => count + item.quantity, 0),
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };
}
