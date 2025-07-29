"use client";
import { createContext, useEffect, useState, ReactNode } from "react";

// 1. Define a proper type for the context
type ThemeContextType = {
  theme: string;
  setTheme: (theme: string) => void;
};

// 2. Create context with default value matching the type
export const themecontext = createContext<ThemeContextType>({
  theme: "light",
  setTheme: () => {},
});

// 3. Create the ThemeProvider component
export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useState("light");

  // 4. Access localStorage only on client (after mount)
  useEffect(() => {
    const storedTheme = localStorage.getItem("theme");
    if (storedTheme) setTheme(storedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <themecontext.Provider value={{ theme, setTheme }}>
      {children}
    </themecontext.Provider>
  );
};
