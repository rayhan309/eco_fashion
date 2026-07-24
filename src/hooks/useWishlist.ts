"use client";

import { useSyncExternalStore } from "react";

type WishlistStore = {
  productIds: string[];
};

let wishlistState: WishlistStore = { productIds: [] };
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return wishlistState;
}

function getServerSnapshot() {
  return wishlistState;
}

export function useWishlist() {
  const state = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  function isWishlisted(productId: string) {
    return state.productIds.includes(productId);
  }

  function toggleWishlist(productId: string) {
    wishlistState = {
      productIds: isWishlisted(productId)
        ? state.productIds.filter((id) => id !== productId)
        : [...state.productIds, productId],
    };
    emit();
  }

  return {
    productIds: state.productIds,
    count: state.productIds.length,
    isWishlisted,
    toggleWishlist,
  };
}
