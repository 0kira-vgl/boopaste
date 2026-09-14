"use client";

import { AsciiLogo } from "@/components/ascii-logo";
import { PixelBar } from "@/components/pixel-bar";
import { DistortText } from "@/components/distort-text";
import { InstallCommand } from "@/components/install-command";
import { useLocale } from "@/components/locale-provider";

export function Hero() {
  const { t } = useLocale();

  return (
    <section id="top" className="relative flex min-h-screen flex-col items-center justify-center gap-7 px-6 pt-24 pb-12 text-center">
      <AsciiLogo />

      <DistortText radius={90} strength={20} className="max-w-xl font-mono text-sm text-foreground/80 sm:text-base leading-relaxed">
        {t.hero.tagline}
      </DistortText>
      <DistortText radius={90} strength={20} className="max-w-lg text-xs text-foreground/50 leading-normal">
        {t.hero.description}
      </DistortText>

      <InstallCommand compact />

      <div className="flex w-full max-w-xs flex-col gap-2">
        <PixelBar />
        <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/40">
          {t.hero.badge}
        </span>
      </div>
    </section>
  );
}
