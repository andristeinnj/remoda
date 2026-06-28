"use client";

import * as React from "react";

export type CartItem = {
  id: string;
  slug: string;
  title: string;
  priceISK: number;
  image: string | null;
  size: string | null;
  brand: string | null;
};

const STORAGE_KEY = "remoda.cart.v1";
const EMPTY: CartItem[] = [];

// ---------------------------------------------------------------------------
// Module-level store backed by localStorage, consumed via useSyncExternalStore.
// This keeps the cart in sync across tabs and avoids setState-in-effect.
// ---------------------------------------------------------------------------
let items: CartItem[] = EMPTY;
let initialized = false;
let listeners: Array<() => void> = [];

function read(): CartItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as CartItem[]) : EMPTY;
  } catch {
    return EMPTY;
  }
}

function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* ignore quota / privacy errors */
  }
}

function ensureInit() {
  if (!initialized && typeof window !== "undefined") {
    items = read();
    initialized = true;
  }
}

function emit() {
  for (const l of listeners) l();
}

const cartStore = {
  subscribe(listener: () => void) {
    ensureInit();
    listeners.push(listener);
    const onStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        items = read();
        emit();
      }
    };
    window.addEventListener("storage", onStorage);
    return () => {
      listeners = listeners.filter((l) => l !== listener);
      window.removeEventListener("storage", onStorage);
    };
  },
  getSnapshot() {
    ensureInit();
    return items;
  },
  getServerSnapshot() {
    return EMPTY;
  },
  add(item: CartItem) {
    ensureInit();
    if (items.some((i) => i.id === item.id)) return;
    items = [...items, item];
    persist();
    emit();
  },
  remove(id: string) {
    ensureInit();
    items = items.filter((i) => i.id !== id);
    persist();
    emit();
  },
  clear() {
    items = EMPTY;
    persist();
    emit();
  },
};

type CartContextValue = {
  items: CartItem[];
  count: number;
  subtotalISK: number;
  has: (id: string) => boolean;
  add: (item: CartItem) => void;
  remove: (id: string) => void;
  clear: () => void;
  isOpen: boolean;
  setOpen: (open: boolean) => void;
};

const CartContext = React.createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const current = React.useSyncExternalStore(
    cartStore.subscribe,
    cartStore.getSnapshot,
    cartStore.getServerSnapshot
  );
  const [isOpen, setOpen] = React.useState(false);

  const value = React.useMemo<CartContextValue>(
    () => ({
      items: current,
      count: current.length,
      subtotalISK: current.reduce((sum, i) => sum + i.priceISK, 0),
      has: (id: string) => current.some((i) => i.id === id),
      add: cartStore.add,
      remove: cartStore.remove,
      clear: cartStore.clear,
      isOpen,
      setOpen,
    }),
    [current, isOpen]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = React.useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
