"use client";

import { useSyncExternalStore } from "react";
import { products } from "@/data/products";
import type { Cart, CartItem } from "@/types/cart";
import type { ProductSize } from "@/types/product";

type CartStore = {
  items: CartItem[];
};

type AddItemInput = Omit<CartItem, "quantity"> & {
  quantity?: number;
};

const sampleItems: CartItem[] = products.slice(0, 2).map((product, index) => ({
  productId: product.id,
  slug: product.slug,
  name: product.title,
  price: product.pricing.price,
  currency: product.pricing.currency,
  quantity: index === 0 ? 1 : 2,
  size: product.attributes.sizes[1] ?? "M",
  color: product.attributes.colors[0] ?? "Default",
  image: product.images[0]?.url ?? "",
}));

let cartState: CartStore = { items: sampleItems };
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function getSnapshot() {
  return cartState;
}

function getServerSnapshot() {
  return cartState;
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

  const cart: Cart = {
    items: state.items,
    subtotal,
    currency: state.items[0]?.currency ?? "BDT",
  };

  function addItem(input: AddItemInput) {
    const quantity = input.quantity ?? 1;
    const existing = cartState.items.find(
      (item) =>
        item.productId === input.productId &&
        item.size === input.size &&
        item.color === input.color,
    );

    if (existing) {
      cartState = {
        items: cartState.items.map((item) =>
          item === existing
            ? { ...item, quantity: item.quantity + quantity }
            : item,
        ),
      };
    } else {
      cartState = {
        items: [...cartState.items, { ...input, quantity }],
      };
    }

    emit();
  }

  function removeItem(productId: string, size: ProductSize, color: string) {
    cartState = {
      items: cartState.items.filter(
        (item) => itemKey(item.productId, item.size, item.color) !== itemKey(productId, size, color),
      ),
    };
    emit();
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

    cartState = {
      items: cartState.items.map((item) =>
        itemKey(item.productId, item.size, item.color) === itemKey(productId, size, color)
          ? { ...item, quantity }
          : item,
      ),
    };
    emit();
  }

  function clearCart() {
    cartState = { items: [] };
    emit();
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
