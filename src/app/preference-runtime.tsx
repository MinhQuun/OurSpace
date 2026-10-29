"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  defaultPreferences,
  normalizePreferences,
  type StoredPreferences,
} from "../modules/m10/profile/preferences";
import {
  formatDate as formatDateValue,
  formatDateTime as formatDateTimeValue,
} from "../modules/m10/profile/format";

type PreferenceContextValue = {
  preferences: StoredPreferences;
  applyPreferences: (value: StoredPreferences) => void;
  formatDate: (value: string | number | Date) => string;
  formatDateTime: (value: string | number | Date) => string;
};

const PreferenceContext = createContext<PreferenceContextValue | null>(null);

export function usePreferences() {
  const value = useContext(PreferenceContext);
  if (!value) throw new Error("usePreferences requires PreferenceRuntime");
  return value;
}

export const sessionChangedEvent = "ourspace:session-changed";

export default function PreferenceRuntime({
  children,
}: Readonly<{ children: ReactNode }>) {
  const [preferences, setPreferences] =
    useState<StoredPreferences>(defaultPreferences);
  const applyPreferences = useCallback(
    (value: StoredPreferences) => setPreferences(normalizePreferences(value)),
    [],
  );

  const reload = useCallback(async () => {
    try {
      const response = await fetch("/api/profile/preferences", {
        cache: "no-store",
      });
      if (response.status === 401) {
        setPreferences(defaultPreferences);
        return;
      }
      if (!response.ok) return;
      const data = (await response.json()) as { preferences?: unknown };
      if (data.preferences) setPreferences(normalizePreferences(data.preferences));
    } catch {
      // Unauthenticated or offline pages keep the accessible defaults.
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(reload);
    const listener = () => void reload();
    window.addEventListener(sessionChangedEvent, listener);
    return () => window.removeEventListener(sessionChangedEvent, listener);
  }, [reload]);

  useEffect(() => {
    const root = document.documentElement;
    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const resolve = () =>
      (root.dataset.theme =
        preferences.theme === "system"
          ? media.matches
            ? "dark"
            : "light"
          : preferences.theme);
    root.dataset.themePreference = preferences.theme;
    resolve();
    if (preferences.theme !== "system") return;
    media.addEventListener("change", resolve);
    return () => media.removeEventListener("change", resolve);
  }, [preferences.theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.dataset.reducedMotion =
      preferences.reduced_motion === "reduce" ? "reduce" : "system";
    root.style.setProperty("--font-scale", preferences.font_scale);
    root.lang = preferences.language;
  }, [
    preferences.reduced_motion,
    preferences.font_scale,
    preferences.language,
  ]);

  const value = useMemo(
    () => ({
      preferences,
      applyPreferences,
      formatDate: (input: string | number | Date) =>
        formatDateValue(input, preferences),
      formatDateTime: (input: string | number | Date) =>
        formatDateTimeValue(input, preferences),
    }),
    [applyPreferences, preferences],
  );

  return (
    <PreferenceContext.Provider value={value}>
      {children}
    </PreferenceContext.Provider>
  );
}
