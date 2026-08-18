// useLocalStorage.js — a tiny custom hook that persists a visitor's
// choices (terminal vs minimal, dark vs light) through page reloads.
//
// Usage:  const [theme, setTheme] = useLocalStorage("theme", "dark");

import { useState, useEffect } from "react";

export function useLocalStorage(key, initialValue) {
  
  //useState with lazy initializer to check if localStorage has a key, value pair already
    //fall back to default if not available
  const [value, setValue] = useState(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved !== null ? saved : initialValue;
    } catch {
      // localStorage can throw in private browsing / strict settings.
      // If that happens, behavior returns to normal useState.
      return initialValue;
    }
  });

  // useEffect runs after every render where `value` changed. then reSets item in local storage.
  useEffect(() => {
    try {
      localStorage.setItem(key, value);
    } catch {
      // Saving failed (private browsing, strict mode, etc.), will try again next render
    }
  }, [key, value]);

  // Return [value, Setter] to work just as a normal useState would
  return [value, setValue];
}
