import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import AsyncStorage from "@react-native-async-storage/async-storage";

/* =========================================================
   STORAGE
========================================================= */

const THEME_STORAGE_KEY = "@tuporderup_theme";

/* =========================================================
   TYPES
========================================================= */

type ThemeContextType = {
  darkMode: boolean;
  toggleDarkMode: (value: boolean) => Promise<void>;
};

/* =========================================================
   CONTEXT
========================================================= */

const ThemeContext =
  createContext<ThemeContextType | undefined>(
    undefined
  );

/* =========================================================
   PROVIDER
========================================================= */

export function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [darkMode, setDarkMode] =
    useState(false);

  const [loaded, setLoaded] =
    useState(false);

  /* =======================================================
     LOAD SAVED THEME
  ======================================================= */

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const savedTheme =
          await AsyncStorage.getItem(
            THEME_STORAGE_KEY
          );

        if (savedTheme === "dark") {
          setDarkMode(true);
        } else {
          setDarkMode(false);
        }
      } catch (error) {
        console.error(
          "Failed to load theme:",
          error
        );
      } finally {
        setLoaded(true);
      }
    };

    loadTheme();
  }, []);

  /* =======================================================
     CHANGE THEME
  ======================================================= */

  const toggleDarkMode = async (
    value: boolean
  ) => {
    try {
      setDarkMode(value);

      await AsyncStorage.setItem(
        THEME_STORAGE_KEY,
        value ? "dark" : "light"
      );
    } catch (error) {
      console.error(
        "Failed to save theme:",
        error
      );
    }
  };

  /* =======================================================
     CONTEXT VALUE
  ======================================================= */

  const contextValue = useMemo(
    () => ({
      darkMode,
      toggleDarkMode,
    }),
    [darkMode]
  );

  /*
    Prevent screens from briefly showing
    light mode before AsyncStorage finishes.
  */

  if (!loaded) {
    return null;
  }

  return (
    <ThemeContext.Provider
      value={contextValue}
    >
      {children}
    </ThemeContext.Provider>
  );
}

/* =========================================================
   HOOK
========================================================= */

export function useTheme() {
  const context =
    useContext(ThemeContext);

  if (!context) {
    throw new Error(
      "useTheme must be used inside ThemeProvider"
    );
  }

  return context;
}