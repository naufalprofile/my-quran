"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { getTranslations, Translations } from "@/lib/i18n";

interface LanguageContextType {
    lang: string;
    setLang: (code: string) => void;
    t: Translations;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export function useLanguage(): LanguageContextType {
    const ctx = useContext(LanguageContext);
    if (!ctx) {
        // Fallback for components not under provider
        return { lang: "id", setLang: () => { }, t: getTranslations("id") };
    }
    return ctx;
}

export default function LanguageProvider({ children }: { children: React.ReactNode }) {
    const [lang, setLangState] = useState("id");
    const [t, setT] = useState<Translations>(getTranslations("id"));

    useEffect(() => {
        const saved = localStorage.getItem("app_language");
        if (saved) {
            setLangState(saved);
            setT(getTranslations(saved));
        }
    }, []);

    const setLang = useCallback((code: string) => {
        setLangState(code);
        setT(getTranslations(code));
        localStorage.setItem("app_language", code);
    }, []);

    return (
        <LanguageContext.Provider value={{ lang, setLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
}
