"use client";

import { useState } from "react";
import {
  isThemeName,
  presentationConfig,
  resolveTheme,
  type ThemeName
} from "@/config/presentation";

const ThemeSelector = () => {
  const [theme, setTheme] = useState<ThemeName>(() => {
    if (typeof document === "undefined") return presentationConfig.themes.dark;
    const activeTheme = document.documentElement.dataset.theme;
    if (isThemeName(activeTheme)) return activeTheme;
    return resolveTheme(null, window.matchMedia("(prefers-color-scheme: dark)").matches);
  });

  const toggleTheme = () => {
    const newTheme =
      theme === presentationConfig.themes.dark
        ? presentationConfig.themes.light
        : presentationConfig.themes.dark;
    document.documentElement.setAttribute("data-theme", newTheme);
    setTheme(newTheme);
    localStorage.setItem(presentationConfig.themes.storageKey, newTheme);
  };

  return (
    <label className="grid cursor-pointer place-items-center">
      <input
        type="checkbox"
        aria-label="Toggle light and dark theme"
        checked={theme === presentationConfig.themes.dark}
        onChange={toggleTheme}
        className="col-span-2 col-start-1 row-start-1 toggle theme-controller bg-base-content"
      />
      <svg
        className="col-start-1 row-start-1 stroke-base-100 fill-base-100"
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="5" />
        <path d="M12 1v2M12 21v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M1 12h2M21 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4" />
      </svg>
      <svg
        className="col-start-2 row-start-1 stroke-base-100 fill-base-100"
        xmlns="http://www.w3.org/2000/svg"
        width="14"
        height="14"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    </label>
  );
};

export default ThemeSelector;
