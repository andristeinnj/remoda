"use client";

import * as React from "react";
import type { CartItem } from "@/components/cart/cart-provider";

export type WishItem = CartItem;

const STORAGE_KEY = "remoda.wishlist.v1";
const EMPTY: WishItem[] = [];

let items: WishItem[] = EMPTY;
let initialized = false;
let listeners: Array<() => void> = [];

function read(): WishItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as WishItem[]) : EMPTY;
  } catch {
    return EMPTY;
  }
}
function persist() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* ignore */
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

const store = {
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
  toggle(item: WishItem) {
    ensureInit();
    items = items.some((i) => i.id === item.id)
      ? items.filter((i) => i.id !== item.id)
      : [item, ...items];
    persist();
    emit();
  },
  remove(id: string) {
    ensureInit();
    items = items.filter((i) => i.id !== id);
    persist();
    emit();
  },
};

export function useWishlist() {
  const current = React.useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot
  );
  return {
    items: current,
    count: current.length,
    has: (id: string) => current.some((i) => i.id === id),
    toggle: store.toggle,
    remove: store.remove,
  };
}
