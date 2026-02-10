"use client";

import { useEffect } from "react";
import { useLocalStorage } from "./useLocalStorage";

export type Theme = "light" | "dark";

const STORAGE_KEY = "task-manager-theme";

/**
 * Applies the theme to document.documentElement so Tailwind's dark: variant works.
 */
function applyTheme(theme: Theme) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (theme === "dark") {
    root.classList.add("dark");
  } else {
    root.classList.remove("dark");
  }
}

/**
 * Hook that syncs theme with localStorage and applies the "dark" class to <html>.
 * Use the inline script in layout for the initial paint to avoid flash.
 */
export function useTheme(): [
  Theme,
  (theme: Theme | ((prev: Theme) => Theme)) => void,
] {
  const [theme, setTheme] = useLocalStorage<Theme>(STORAGE_KEY, "light");

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return [theme, setTheme];
}
