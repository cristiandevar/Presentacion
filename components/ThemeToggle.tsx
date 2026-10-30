"use client";

import { useEffect, useSyncExternalStore } from "react";
import styles from "./ThemeToggle.module.css";

type Theme = "light" | "dark";

const STORAGE_KEY = "portfolio-theme";

function getThemeSnapshot(): Theme {
  if (typeof window === "undefined") {
    return "light";
  }

  const savedTheme = window.localStorage.getItem(STORAGE_KEY);
  return savedTheme === "dark" ? "dark" : "light";
}

function subscribeToTheme(callback: () => void) {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handleThemeChange = () => callback();

  window.addEventListener("portfolio-theme-change", handleThemeChange);
  window.addEventListener("storage", handleThemeChange);

  return () => {
    window.removeEventListener("portfolio-theme-change", handleThemeChange);
    window.removeEventListener("storage", handleThemeChange);
  };
}

export function ThemeToggle() {
  const theme = useSyncExternalStore(subscribeToTheme, getThemeSnapshot, () => "light");

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
  }, [theme]);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";

    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, nextTheme);
      window.dispatchEvent(new Event("portfolio-theme-change"));
    }

    document.documentElement.dataset.theme = nextTheme;
  };

  const nextThemeLabel = theme === "light" ? "oscuro" : "claro";

  return (
    <button
      className={styles.toggle}
      type="button"
      onClick={toggleTheme}
      aria-label={`Cambiar a tema ${nextThemeLabel}`}
      title={`Cambiar a tema ${nextThemeLabel}`}
    >
      {theme === "light" ? (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M20.2 15.1A8.3 8.3 0 0 1 8.9 3.8 8.3 8.3 0 1 0 20.2 15.1Z" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42" />
        </svg>
      )}
    </button>
  );
}
