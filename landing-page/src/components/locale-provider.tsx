"use client";

// Idioma padrão é EN. Na montagem, se não houver preferência salva, detecta
// o idioma do navegador — se começar com "pt", troca pra PT-BR. Como isso
// roda depois da primeira renderização (SSR sempre manda EN), há um flash
// rápido de EN pra PT em navegadores em português, aceitável numa landing page.

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { dictionaries, type Locale } from "@/lib/i18n";

const STORAGE_KEY = "boopaste-locale";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (typeof dictionaries)["en"];
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === "en" || stored === "pt") {
      setLocaleState(stored);
      return;
    }
    if (navigator.language.toLowerCase().startsWith("pt")) {
      setLocaleState("pt");
    }
  }, []);

  function setLocale(next: Locale) {
    setLocaleState(next);
    localStorage.setItem(STORAGE_KEY, next);
  }

  return (
    <LocaleContext.Provider value={{ locale, setLocale, t: dictionaries[locale] }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale precisa estar dentro de um LocaleProvider");
  return ctx;
}
