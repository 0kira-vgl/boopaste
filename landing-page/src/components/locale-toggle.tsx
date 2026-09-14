"use client";

import { useLocale } from "@/components/locale-provider";
import { cn } from "@/lib/cn";

const OPTIONS = [
  { value: "en", label: "en" },
  { value: "pt", label: "pt-br" },
] as const;

export function LocaleToggle() {
  const { locale, setLocale } = useLocale();

  return (
    <div
      role="radiogroup"
      aria-label="Switch language / trocar idioma"
      className="relative flex h-8 w-[104px] items-center rounded-full border border-foreground/20 bg-foreground/5 p-0.5 font-mono text-[10px] uppercase tracking-widest"
    >
      <span
        aria-hidden
        className={cn(
          "absolute inset-y-0.5 left-0.5 w-[calc(50%-2px)] rounded-full bg-[#00FF66] shadow-[0_0_10px_rgba(0,255,102,0.5)] transition-transform duration-300 ease-out",
          locale === "pt" && "translate-x-full"
        )}
      />
      {OPTIONS.map((opt) => (
        <button
          key={opt.value}
          role="radio"
          aria-checked={locale === opt.value}
          onClick={() => setLocale(opt.value)}
          className={cn(
            "relative z-10 flex h-full flex-1 items-center justify-center rounded-full transition-colors duration-300",
            locale === opt.value ? "text-background" : "text-foreground/60 hover:text-foreground"
          )}
        >
          {opt.label}
        </button>
      ))}
    </div>
  );
}
