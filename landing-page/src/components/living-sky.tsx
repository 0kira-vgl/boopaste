"use client";

import { useEffect, useRef, useState } from "react";
import { ThreeGhostSwarm } from "@/components/three-ghost-swarm";

interface Star {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  duration: number;
  delay: number;
  glow: boolean;
}

export function LivingSky() {
  const [stars, setStars] = useState<Star[]>([]);
  const glowRef = useRef<HTMLDivElement>(null);
  const [isDark, setIsDark] = useState(true);

  // Sincroniza estado de tema no client
  useEffect(() => {
    const checkDark = () => {
      setIsDark(document.documentElement.classList.contains("dark"));
    };
    checkDark();

    const observer = new MutationObserver(checkDark);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    const starColors = ["#ffffff", "#00FF66", "#00F0FF", "#88ffaa"];
    const generated: Star[] = Array.from({ length: 140 }, (_, i) => {
      // Pseudorandom com seed previsível
      // Distribui estrelas no espaço sideral priorizando as margens laterais
      // para manter o corredor central de leitura (textos e badges) limpo e sem distrações
      const seed1 = (i * 9301 + 49297) % 233280;
      const rawX = (seed1 / 233280) * 100;
      let x = rawX;
      if (rawX > 25 && rawX < 75) {
        x = rawX < 50 ? rawX * 0.42 : 78 + (rawX - 50) * 0.44;
      }
      const seed2 = (i * 233280 + 9301) % 104729;
      const y = (seed2 / 104729) * 100;
      const size = i % 8 === 0 ? 3 : i % 3 === 0 ? 2 : 1.2;
      const color = i % 6 === 0 ? starColors[1] : i % 11 === 0 ? starColors[2] : starColors[0];
      const duration = 2.0 + ((i * 37) % 30) / 10;
      const delay = ((i * 53) % 40) / 10;
      const glow = i % 7 === 0;

      return { id: i, x, y, size, color, duration, delay, glow };
    });

    setStars(generated);

    // Efeito de Cursor Glow suave (inspirado no Yucatan CursorGlow)
    const glow = glowRef.current;
    if (!glow) return;

    let targetX = window.innerWidth / 2;
    let targetY = window.innerHeight * 0.4;
    let currentX = targetX;
    let currentY = targetY;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      targetX = e.clientX;
      targetY = e.clientY;
    };

    const updateGlow = () => {
      currentX += (targetX - currentX) * 0.05;
      currentY += (targetY - currentY) * 0.05;
      if (glow) {
        glow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      }
      raf = requestAnimationFrame(updateGlow);
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    raf = requestAnimationFrame(updateGlow);

    return () => {
      observer.disconnect();
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  const GRAIN_SVG =
    "data:image/svg+xml;utf8," +
    encodeURIComponent(
      `<svg xmlns='http://www.w3.org/2000/svg' width='120' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`,
    );

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden select-none bg-background transition-colors duration-300">
      {/* 1. Cena 3D Three.js (Enxame de Fantasmas 60 FPS com câmera de scroll) */}
      <ThreeGhostSwarm />

      {/* 2. Cursor Glow / Nebulosa Neon pulsante */}
      <div
        ref={glowRef}
        className="absolute -left-40 -top-40 h-80 w-80 rounded-full opacity-20 blur-[100px] transition-opacity duration-1000 dark:opacity-50"
        style={{
          background: "radial-gradient(circle, rgba(0, 255, 102, 0.28) 0%, rgba(0, 240, 255, 0.14) 45%, transparent 70%)",
          willChange: "transform",
        }}
      />

      {/* 3. Campo de Estrelas Cintilantes (Twinkling Starfield) */}
      <div className="absolute inset-0 z-0">
        {stars.map((s) => {
          const starBg = isDark ? s.color : s.color === "#ffffff" ? "#18181b" : s.color;
          return (
            <span
              key={s.id}
              className="absolute rounded-full animate-star-twinkle transition-opacity duration-500 opacity-25 dark:opacity-100"
              style={{
                left: `${s.x}%`,
                top: `${s.y}%`,
                width: `${s.size}px`,
                height: `${s.size}px`,
                backgroundColor: starBg,
                boxShadow: isDark
                  ? s.glow
                    ? `0 0 10px ${s.color}, 0 0 4px ${s.color}`
                    : `0 0 4px ${s.color}`
                  : "none",
                animationDuration: `${s.duration}s`,
                animationDelay: `${s.delay}s`,
              }}
            />
          );
        })}
      </div>

      {/* 4. Film Grain Overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-10 opacity-[0.03] mix-blend-multiply transition-opacity duration-300 dark:opacity-[0.07] dark:mix-blend-overlay"
        style={{ backgroundImage: `url("${GRAIN_SVG}")` }}
        aria-hidden
      />

      {/* 5. Vinheta CRT Retro sutil (apenas no modo escuro) */}
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-300 dark:opacity-45 mix-blend-multiply"
        style={{
          background: "radial-gradient(ellipse at center, transparent 35%, rgba(0, 0, 0, 0.8) 100%)",
        }}
      />
    </div>
  );
}
