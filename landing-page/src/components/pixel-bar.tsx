"use client";

// Barra estilo 8-bit: segmentos em bloco, sem antialiasing, usada como
// divisor de seção e como indicador de progresso de scroll no FloatingNav.
import { useEffect, useState } from "react";

const SEGMENTS = 24;

export function PixelBar({ interactive = false }: { interactive?: boolean }) {
  const [filled, setFilled] = useState(0);

  useEffect(() => {
    if (!interactive) return;
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      setFilled(Math.round(progress * SEGMENTS));
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [interactive]);

  return (
    <div className="flex h-2 w-full gap-[2px]" aria-hidden>
      {Array.from({ length: SEGMENTS }).map((_, i) => (
        <span
          key={i}
          className={
            interactive
              ? i < filled
                ? "flex-1 bg-foreground"
                : "flex-1 bg-foreground/15"
              : "flex-1 bg-foreground/25 even:bg-foreground/10"
          }
        />
      ))}
    </div>
  );
}
