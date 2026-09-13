import { AsciiLogo } from "@/components/ascii-logo";
import { PixelBar } from "@/components/pixel-bar";
import { SITE } from "@/lib/site";

export function Hero() {
  return (
    <section id="top" className="flex min-h-screen flex-col items-center justify-center gap-8 px-6 pt-24 text-center">
      <AsciiLogo />
      <p className="max-w-xl font-mono text-sm text-foreground/70 sm:text-base">
        {SITE.tagline}
      </p>
      <p className="max-w-lg text-xs text-foreground/50">
        Copy an image, hit <kbd className="border border-foreground/20 px-1 py-0.5">⌘V</kbd> in your
        terminal, get a real file path instead of garbage. No GUI, no menu bar app — just a
        background daemon that does one thing.
      </p>
      <div className="flex w-full max-w-xs flex-col gap-2">
        <PixelBar />
        <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/40">
          v0 · macOS only · MIT
        </span>
      </div>
    </section>
  );
}
