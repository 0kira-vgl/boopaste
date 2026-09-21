"use client";

import { useEffect, useMemo, useRef } from "react";
import { BoopasteSymbol } from "@/components/brand/boopaste-brand";

const LINES = [
  " _                                 _       ",
  "| |__   ___   ___   ___   __ _ ___| |_ ___ ",
  "| '_ \\ / _ \\ / _ \\| '_ \\ / _` / __| __/ _ \\",
  "| |_) | (_) | (_) | |_) | (_| \\__ \\ ||  __/",
  "|____/ \\___/ \\___/| |__/ \\__,_|___/\\__\\___|",
  "                  |_|                      ",
];

// Ruído determinístico (mesmo char sempre bagunça pro mesmo lado) — evita Math.random em cada render.
function pseudoRandom(seed: number) {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
}

// Raio pequeno: só os caracteres perto do cursor bagunçam, não o banner
// inteiro — mas grande o suficiente pra afetar um punhadinho de cada vez.
const RADIUS = 32;

export function AsciiLogo({ className }: { className?: string }) {
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const centers = useRef<{ x: number; y: number }[]>([]);

  const jitters = useMemo(() => {
    const result: { dx: number; dy: number; rotate: number }[] = [];
    let seed = 0;
    for (const line of LINES) {
      for (const char of line) {
        if (char === " ") continue;
        result.push({
          dx: (pseudoRandom(seed) - 0.5) * 14,
          dy: (pseudoRandom(seed + 1) - 0.5) * 14,
          rotate: (pseudoRandom(seed + 2) - 0.5) * 45,
        });
        seed += 3;
      }
    }
    return result;
  }, []);

  function measure() {
    centers.current = charRefs.current.map((el) => {
      if (!el) return { x: 0, y: 0 };
      const rect = el.getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    });
  }

  useEffect(() => {
    measure();
    let raf = 0;
    const scheduleMeasure = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    window.addEventListener("resize", scheduleMeasure);
    window.addEventListener("scroll", scheduleMeasure, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", scheduleMeasure);
      window.removeEventListener("scroll", scheduleMeasure);
    };
  }, []);

  function onMouseMove(e: React.MouseEvent<HTMLPreElement>) {
    const { clientX, clientY } = e;
    charRefs.current.forEach((el, i) => {
      if (!el) return;
      const c = centers.current[i];
      if (!c) return;
      const dist = Math.hypot(c.x - clientX, c.y - clientY);

      if (dist < RADIUS) {
        const t = 1 - dist / RADIUS;
        const { dx, dy, rotate } = jitters[i];
        el.style.transform = `translate(${(dx * t).toFixed(1)}px, ${(dy * t).toFixed(1)}px) rotate(${(rotate * t).toFixed(1)}deg)`;
      } else {
        el.style.transform = "";
      }
    });
  }

  function onMouseLeave() {
    charRefs.current.forEach((el) => {
      if (el) el.style.transform = "";
    });
  }

  let charIndex = 0;

  return (
    <div className={`relative mx-auto flex flex-col items-center gap-4 ${className ?? ""}`}>
      {/* Símbolo Oficial Boo Spark (✦) com glow suave */}
      <div className="group relative flex items-center justify-center p-3 transition-transform duration-300 hover:scale-110">
        <div className="absolute -inset-2 rounded-2xl bg-[#00FF66]/15 blur-xl opacity-75 group-hover:opacity-100 transition-opacity" />
        <div className="relative">
          <BoopasteSymbol size={56} />
        </div>
      </div>

      {/* Wordmark em ASCII (figlet) — só bagunça os traços bem perto do cursor */}
      <pre
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className="select-none whitespace-pre font-mono text-[0.45rem] leading-[0.6rem] text-foreground sm:text-[0.6rem] sm:leading-[0.75rem] md:text-[0.75rem] md:leading-[0.95rem]"
        aria-label="boopaste"
      >
        {LINES.map((line, li) => (
          <span key={li}>
            {line.split("").map((char, ci) => {
              if (char === " ") return <span key={ci}> </span>;

              const i = charIndex++;
              return (
                <span
                  key={ci}
                  ref={(el) => {
                    charRefs.current[i] = el;
                  }}
                  className="inline-block transition-transform duration-200 ease-out will-change-transform"
                >
                  {char}
                </span>
              );
            })}
            {li < LINES.length - 1 ? "\n" : ""}
          </span>
        ))}
      </pre>
    </div>
  );
}
