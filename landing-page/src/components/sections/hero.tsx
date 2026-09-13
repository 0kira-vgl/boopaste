"use client";

import { AsciiLogo } from "@/components/ascii-logo";
import { PixelBar } from "@/components/pixel-bar";
import { useLocale } from "@/components/locale-provider";

export function Hero() {
  const { t } = useLocale();

  return (
    <section id="top" className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 pt-24 text-center">
      <AsciiLogo />
      <p className="max-w-xl font-mono text-sm text-foreground/70 sm:text-base">
        {t.hero.tagline}
      </p>
      <p className="max-w-lg text-xs text-foreground/50">{t.hero.description}</p>
      <div className="flex w-full max-w-xs flex-col gap-2">
        <PixelBar />
        <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/40">
          {t.hero.badge}
        </span>
      </div>
    </section>
  );
}
