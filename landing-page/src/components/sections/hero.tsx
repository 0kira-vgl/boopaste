"use client";

import { AsciiLogo } from "@/components/ascii-logo";
import { PixelBar } from "@/components/pixel-bar";
import { useLocale } from "@/components/locale-provider";

export function Hero() {
  const { t } = useLocale();

  return (
    <section id="top" className="relative flex min-h-screen flex-col items-center justify-center gap-7 px-6 pt-24 pb-12 text-center">
      {/* Live Daemon Status Badge com Ping Ativo */}
      <div className="inline-flex items-center gap-2 rounded-full border border-[#00FF66]/30 bg-[#00FF66]/10 px-3.5 py-1 font-mono text-[11px] text-[#00FF66] shadow-[0_0_20px_rgba(0,255,102,0.15)]">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#00FF66] opacity-75" />
          <span className="relative inline-flex h-2 w-2 rounded-full bg-[#00FF66]" />
        </span>
        <span className="tracking-widest uppercase font-semibold">ghost daemon · macos ready</span>
      </div>

      {/* Logo com Aura Fosforescente Pulsante */}
      <div className="relative">
        <div className="pointer-events-none absolute -inset-10 rounded-full bg-[#00FF66]/15 blur-3xl animate-pulse" />
        <AsciiLogo />
      </div>

      <p className="max-w-xl font-mono text-sm text-foreground/80 sm:text-base leading-relaxed">
        {t.hero.tagline}
      </p>
      <p className="max-w-lg text-xs text-foreground/50 leading-normal">{t.hero.description}</p>
      
      <div className="flex w-full max-w-xs flex-col gap-2">
        <PixelBar />
        <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/40">
          {t.hero.badge}
        </span>
      </div>

      {/* Indicador de rolagem inspirado no Yucatan */}
      <div className="mt-4 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.2em] text-foreground/40">
        <span className="h-6 w-px animate-pulse bg-[#00FF66]" />
        <span>role para explorar o daemon</span>
      </div>
    </section>
  );
}
