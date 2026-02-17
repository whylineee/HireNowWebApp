"use client";

import { createContext, useContext, useEffect, useMemo, useSyncExternalStore } from "react";
import type { PaletteMode } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";

export type AppLanguage = "en" | "uk";
export type ThemePreference = PaletteMode | "system";

type AppSettingsValue = {
  language: AppLanguage;
  themeMode: PaletteMode;
  themePreference: ThemePreference;
  setLanguage: (language: AppLanguage) => void;
  setThemePreference: (preference: ThemePreference) => void;
  setThemeMode: (mode: PaletteMode) => void;
  toggleTheme: () => void;
};

const STORAGE_KEY = "hire_now_app_settings_v1";
const SETTINGS_CHANGE_EVENT = "hire_now_settings_change";

const AppSettingsContext = createContext<AppSettingsValue | null>(null);

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) {
    return fallback;
  }

  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

type AppSettingsProviderProps = {
  children: React.ReactNode;
};

type PersistedSettings = {
  language: AppLanguage;
  themePreference: ThemePreference;
};

const DEFAULT_SETTINGS: PersistedSettings = {
  language: "en",
  themePreference: "light",
};
let memorySettings = DEFAULT_SETTINGS;
let lastSerializedSettings: string | null = null;

function isLanguage(value: unknown): value is AppLanguage {
  return value === "en" || value === "uk";
}

function isThemePreference(value: unknown): value is ThemePreference {
  return value === "light" || value === "dark" || value === "system";
}

function normalizeSettings(settings: Partial<PersistedSettings>): PersistedSettings {
  return {
    language: isLanguage(settings.language) ? settings.language : DEFAULT_SETTINGS.language,
    themePreference: isThemePreference(settings.themePreference)
      ? settings.themePreference
      : DEFAULT_SETTINGS.themePreference,
  };
}

function areSettingsEqual(a: PersistedSettings, b: PersistedSettings) {
  return a.language === b.language && a.themePreference === b.themePreference;
}

function readSettingsFromStorage(): PersistedSettings {
  if (typeof window === "undefined") {
    return DEFAULT_SETTINGS;
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return memorySettings;
    }

    if (raw === lastSerializedSettings) {
      return memorySettings;
    }

    const parsed = safeParse<Partial<PersistedSettings>>(raw, memorySettings);
    const normalized = normalizeSettings(parsed);
    lastSerializedSettings = raw;

    if (!areSettingsEqual(memorySettings, normalized)) {
      memorySettings = normalized;
    }

    return memorySettings;
  } catch {
    return memorySettings;
  }
}

function subscribeToSettings(onStoreChange: () => void) {
  if (typeof window === "undefined") {
    return () => undefined;
  }

  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      onStoreChange();
    }
  };

  window.addEventListener("storage", onStorage);
  window.addEventListener(SETTINGS_CHANGE_EVENT, onStoreChange);

  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(SETTINGS_CHANGE_EVENT, onStoreChange);
  };
}

function writeSettingsToStorage(settings: PersistedSettings) {
  const normalized = normalizeSettings(settings);
  if (areSettingsEqual(memorySettings, normalized)) {
    return;
  }

  memorySettings = normalized;

  if (typeof window === "undefined") {
    return;
  }

  try {
    const serialized = JSON.stringify(normalized);
    lastSerializedSettings = serialized;
    window.localStorage.setItem(STORAGE_KEY, serialized);
  } catch {
    // Ignore storage write errors (quota/private mode).
  }

  window.dispatchEvent(new Event(SETTINGS_CHANGE_EVENT));
}

export function AppSettingsProvider({ children }: AppSettingsProviderProps) {
  const settings = useSyncExternalStore(
    subscribeToSettings,
    readSettingsFromStorage,
    () => DEFAULT_SETTINGS,
  );
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)", {
    noSsr: true,
  });

  const language = settings.language;
  const themePreference = settings.themePreference;

  const themeMode: PaletteMode =
    themePreference === "system"
      ? prefersDarkMode
        ? "dark"
        : "light"
      : themePreference;

  useEffect(() => {
    document.documentElement.lang = language;
  }, [language]);

  const value = useMemo<AppSettingsValue>(
    () => ({
      language,
      themeMode,
      themePreference,
      setLanguage: (nextLanguage: AppLanguage) =>
        writeSettingsToStorage({ language: nextLanguage, themePreference }),
      setThemePreference: (nextPreference: ThemePreference) =>
        writeSettingsToStorage({ language, themePreference: nextPreference }),
      setThemeMode: (mode: PaletteMode) =>
        writeSettingsToStorage({ language, themePreference: mode }),
      toggleTheme: () =>
        writeSettingsToStorage({
          language,
          themePreference: themePreference === "dark" ? "light" : "dark",
        }),
    }),
    [language, themeMode, themePreference],
  );

  return (
    <AppSettingsContext.Provider value={value}>
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings() {
  const context = useContext(AppSettingsContext);
  if (!context) {
    throw new Error("useAppSettings must be used inside AppSettingsProvider.");
  }
  return context;
}
