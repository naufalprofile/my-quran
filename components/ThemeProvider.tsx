"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

export const THEMES = [
    { name: "Hijau", primary: "#008D63", primaryDark: "#06403D", primaryLight: "#E6F3EF", accent: "#1ED760" },
];

interface ThemeContextType {
    themeIndex: number;
    setThemeIndex: (i: number) => void;
    mode: "light" | "dark";
    setMode: (m: "light" | "dark") => void;
    theme: typeof THEMES[0];
}

const ThemeContext = createContext<ThemeContextType>({
    themeIndex: 0,
    setThemeIndex: () => { },
    mode: "light",
    setMode: () => { },
    theme: THEMES[0],
});

export function useTheme() {
    return useContext(ThemeContext);
}

/** Reusable hook — returns all dark/light color tokens. Use this instead of duplicating color strings. */
export function useThemeColors() {
    const { mode } = useTheme();
    const isDark = mode === "dark";
    return {
        isDark,
        bgPage: isDark ? "#0F1419" : "#F7F9FB",
        bgCard: isDark ? "#1A1F25" : "#FFFFFF",
        textMain: isDark ? "#E8ECEF" : "#1A1F25",
        textMuted: isDark ? "#9CA3AF" : "#6C7278",
        borderColor: isDark ? "#2D3748" : "#E8ECEF",
        subtleBg: isDark ? "#2D3748" : "#F0F2F5",
    };
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
    const [themeIndex, setThemeIndexState] = useState(0);
    const [mode, setModeState] = useState<"light" | "dark">("light");
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const savedTheme = localStorage.getItem("app_theme_index");
        if (savedTheme) setThemeIndexState(parseInt(savedTheme));
        const savedMode = localStorage.getItem("app_mode");
        if (savedMode === "dark") setModeState("dark");
        setMounted(true);
    }, []);

    const applyTheme = useCallback((index: number, m: "light" | "dark") => {
        const t = THEMES[index] || THEMES[0];
        const root = document.documentElement;

        root.style.setProperty("--color-primary", t.primary);
        root.style.setProperty("--color-primary-dark", t.primaryDark);
        root.style.setProperty("--color-primary-light", t.primaryLight);
        root.style.setProperty("--color-accent", t.accent);

        if (m === "dark") {
            root.style.setProperty("--color-bg", "#0F1419");
            root.style.setProperty("--color-surface", "#1A1F25");
            root.style.setProperty("--color-text", "#E8ECEF");
            root.style.setProperty("--color-text-muted", "#9CA3AF");
            root.style.setProperty("--color-border", "#2D3748");
            root.style.setProperty("--color-card-bg", "#1A1F25");
        } else {
            root.style.setProperty("--color-bg", "#F7F9FB");
            root.style.setProperty("--color-surface", "#FFFFFF");
            root.style.setProperty("--color-text", "#1A1F25");
            root.style.setProperty("--color-text-muted", "#6C7278");
            root.style.setProperty("--color-border", "#E8ECEF");
            root.style.setProperty("--color-card-bg", "#FFFFFF");
        }
    }, []);

    useEffect(() => {
        if (mounted) applyTheme(themeIndex, mode);
    }, [themeIndex, mode, mounted, applyTheme]);

    const setThemeIndex = (i: number) => {
        setThemeIndexState(i);
        localStorage.setItem("app_theme_index", i.toString());
    };

    const setMode = (m: "light" | "dark") => {
        setModeState(m);
        localStorage.setItem("app_mode", m);
    };

    const theme = THEMES[themeIndex] || THEMES[0];

    return (
        <ThemeContext.Provider value={{ themeIndex, setThemeIndex, mode, setMode, theme }}>
            {children}
        </ThemeContext.Provider>
    );
}
