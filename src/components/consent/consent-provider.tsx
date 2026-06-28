"use client";

import * as React from "react";

export type Consent = {
  necessary: true;
  analytics: boolean;
  marketing: boolean;
  preferences: boolean;
  set: boolean;
};

const COOKIE = "remoda.consent";
const MAX_AGE = 60 * 60 * 24 * 180; // 180 days
const OPEN_EVENT = "remoda:open-consent";
const CHANGE_EVENT = "remoda:consent-change";

const DEFAULT: Consent = {
  necessary: true,
  analytics: false,
  marketing: false,
  preferences: false,
  set: false,
};

let cache: Consent = DEFAULT;

function readCookie(): Consent {
  if (typeof document === "undefined") return DEFAULT;
  const match = document.cookie.split("; ").find((c) => c.startsWith(`${COOKIE}=`));
  if (!match) return DEFAULT;
  try {
    const v = JSON.parse(decodeURIComponent(match.split("=")[1]));
    return {
      necessary: true,
      analytics: !!v.analytics,
      marketing: !!v.marketing,
      preferences: !!v.preferences,
      set: !!v.set,
    };
  } catch {
    return DEFAULT;
  }
}

function applyConsentMode(c: Consent) {
  const w = window as unknown as { gtag?: (...args: unknown[]) => void };
  if (typeof w.gtag !== "function") return;
  w.gtag("consent", "update", {
    analytics_storage: c.analytics ? "granted" : "denied",
    ad_storage: c.marketing ? "granted" : "denied",
    ad_user_data: c.marketing ? "granted" : "denied",
    ad_personalization: c.marketing ? "granted" : "denied",
    personalization_storage: c.preferences ? "granted" : "denied",
  });
}

const store = {
  subscribe(listener: () => void) {
    cache = readCookie();
    const handler = () => {
      cache = readCookie();
      listener();
    };
    window.addEventListener(CHANGE_EVENT, handler);
    return () => window.removeEventListener(CHANGE_EVENT, handler);
  },
  getSnapshot() {
    return cache;
  },
  getServerSnapshot() {
    return DEFAULT;
  },
};

export function saveConsent(partial: Partial<Omit<Consent, "necessary" | "set">>) {
  const current = readCookie();
  const next: Consent = {
    necessary: true,
    analytics: partial.analytics ?? current.analytics,
    marketing: partial.marketing ?? current.marketing,
    preferences: partial.preferences ?? current.preferences,
    set: true,
  };
  document.cookie = `${COOKIE}=${encodeURIComponent(
    JSON.stringify(next)
  )}; path=/; max-age=${MAX_AGE}; samesite=lax`;
  cache = next;
  applyConsentMode(next);
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function openConsentSettings() {
  window.dispatchEvent(new Event(OPEN_EVENT));
}

export function onOpenConsentSettings(handler: () => void) {
  window.addEventListener(OPEN_EVENT, handler);
  return () => window.removeEventListener(OPEN_EVENT, handler);
}

export function useConsent(): Consent {
  return React.useSyncExternalStore(
    store.subscribe,
    store.getSnapshot,
    store.getServerSnapshot
  );
}
