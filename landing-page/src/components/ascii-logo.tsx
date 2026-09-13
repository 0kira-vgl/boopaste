"use client";

// Placeholder da logo em ASCII/pixel art. Assim que
// public/logo-ascii.png (gerado a partir do prompt em gemini-assets/PROMPTS.md)
// existir, troque o bloco <pre> abaixo por <Image src="/logo-ascii.png" .../>.

const BANNER = String.raw`
 _                                _
| |                              | |
| |__   ___   ___  _ __  __ _ ___| |_ ___
| '_ \ / _ \ / _ \| '_ \/ _\` / __| __/ _ \
| |_) | (_) | (_) | |_) | (_| \__ \ ||  __/
|_.__/ \___/ \___/| .__/ \__,_|___/\__\___|
                   | |
                   |_|
`.trim();

export function AsciiLogo({ className }: { className?: string }) {
  return (
    <pre
      className={`select-none whitespace-pre font-mono text-[0.4rem] leading-[0.5rem] text-foreground sm:text-[0.55rem] sm:leading-[0.7rem] md:text-[0.7rem] md:leading-[0.85rem] ${className ?? ""}`}
      aria-label="boopaste"
    >
      {BANNER}
    </pre>
  );
}
