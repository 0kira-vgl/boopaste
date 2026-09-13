"use client";

import { useLocale } from "@/components/locale-provider";

export function LocaleToggle() {
  const { locale, setLocale } = useLocale();
  const next = locale === "en" ? "pt" : "en";

  return (
    <button
      onClick={() => setLocale(next)}
      aria-label="Switch language / trocar idioma"
      className="flex h-8 items-center justify-center border border-foreground/20 px-2 font-mono text-[10px] uppercase tracking-widest text-foreground transition-colors hover:border-foreground/60"
    >
      {next === "pt" ? "pt-br" : "en"}
    </button>
  );
}
