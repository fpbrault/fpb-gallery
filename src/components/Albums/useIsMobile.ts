"use client";

import { useSyncExternalStore } from "react";

const mobileQuery = "(max-width: 768px)";

export function useIsMobile() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}

function subscribe(callback: () => void) {
  const media = window.matchMedia(mobileQuery);
  media.addEventListener("change", callback);
  return () => media.removeEventListener("change", callback);
}

function getSnapshot() {
  return window.matchMedia(mobileQuery).matches;
}
