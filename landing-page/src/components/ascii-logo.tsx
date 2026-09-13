"use client";

// Placeholder da logo em ASCII/pixel art. Assim que
// public/logo-ascii.png (gerado a partir do prompt em gemini-assets/PROMPTS.md)
// existir, troque o bloco <pre> abaixo por <Image src="/logo-ascii.png" .../>.

import Image from "next/image";
import { useEffect, useState } from "react";

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
  const [customLogo, setCustomLogo] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("boopaste-active-logo");
    if (saved) setCustomLogo(saved);
  }, []);

  if (customLogo) {
    return (
      <div className={`relative mx-auto flex flex-col items-center gap-3 ${className ?? ""}`}>
        <div className="relative h-44 w-44 sm:h-52 sm:w-52 rounded-xl border border-foreground/20 bg-black/60 p-3 shadow-2xl backdrop-blur-sm transition-transform hover:scale-105">
          <Image
            src={customLogo}
            alt="boopaste logo"
            fill
            className="object-contain p-2"
            priority
          />
        </div>
      </div>
    );
  }

  return (
    <pre
      className={`select-none whitespace-pre font-mono text-[0.4rem] leading-[0.5rem] text-foreground sm:text-[0.55rem] sm:leading-[0.7rem] md:text-[0.7rem] md:leading-[0.85rem] ${className ?? ""}`}
      aria-label="boopaste"
    >
      {BANNER}
    </pre>
  );
}
