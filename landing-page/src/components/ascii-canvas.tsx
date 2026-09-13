"use client";

import { useEffect, useRef } from "react";

// Conjunto de caracteres ASCII ordenados por densidade visual (shading clássico estilo donut.c)
const SHADE_CHARS = " .,-~:;=!*#$@";
const STREAM_CHARS = "0123456789abcdefghijklmnopqrstuvwxyz<>[]{}/\\$#*+=:-._";

interface RainDrop {
  col: number;
  row: number;
  speed: number;
  char: string;
  length: number;
}

export function AsciiCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let animId = 0;
    let lastTime = performance.now();
    let scrollProgress = 0;
    let targetScroll = 0;

    // Buffer de dimensões da grade
    let cols = 0;
    let rows = 0;
    const charWidth = 10;
    const charHeight = 16;

    // Ângulos de rotação do torus 3D
    let angleA = 0;
    let angleB = 0;

    // Chuva digital ASCII (colunas de caracteres caindo)
    let drops: RainDrop[] = [];

    function resize() {
      if (!canvas) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = canvas.parentElement?.clientWidth || window.innerWidth;
      const h = canvas.parentElement?.clientHeight || window.innerHeight;

      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;

      cols = Math.floor(w / charWidth);
      rows = Math.floor(h / charHeight);

      // Inicializa chuva digital proporcional à largura
      const dropCount = Math.floor(cols * 0.35);
      drops = Array.from({ length: dropCount }, () => ({
        col: Math.floor(Math.random() * cols),
        row: Math.random() * rows,
        speed: 0.2 + Math.random() * 0.5,
        char: STREAM_CHARS[Math.floor(Math.random() * STREAM_CHARS.length)],
        length: 3 + Math.floor(Math.random() * 8),
      }));
    }

    function onScroll() {
      const doc = document.documentElement;
      const maxScroll = doc.scrollHeight - doc.clientHeight;
      targetScroll = maxScroll > 0 ? Math.min(Math.max(window.scrollY / maxScroll, 0), 1) : 0;
    }

    resize();
    onScroll();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("scroll", onScroll, { passive: true });

    // Buffers reutilizados por frame para zero-alloc
    let textBuffer: string[] = [];
    let zBuffer: Float32Array = new Float32Array(0);

    function render(now: number) {
      animId = requestAnimationFrame(render);

      // Limita taxa e calcula delta
      const dt = Math.min((now - lastTime) / 1000, 0.1);
      lastTime = now;

      // Interpolação suave do scroll (lerp para movimento fluido)
      scrollProgress += (targetScroll - scrollProgress) * 0.08;

      if (!canvas || !ctx || cols <= 0 || rows <= 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      ctx.save();
      ctx.scale(dpr, dpr);
      ctx.clearRect(0, 0, canvas.width / dpr, canvas.height / dpr);

      // Detecta dark mode
      const isDark = document.documentElement.classList.contains("dark");

      // Progressão monotônica de intensidade (0.0 no Hero -> 1.0 no Footer):
      // 1. Rotação do Torus reage diretamente à posição de rolagem
      angleA = scrollProgress * Math.PI * 3.5 + now * 0.0003;
      angleB = scrollProgress * Math.PI * 2.2 + now * 0.0002;

      // 2. Opacidade e densidade crescem monotonicamente com o scroll
      const baseAlpha = isDark
        ? 0.14 + scrollProgress * 0.22 // 0.14 no hero -> 0.36 no footer
        : 0.10 + scrollProgress * 0.16; // 0.10 no hero -> 0.26 no footer

      const bufferSize = cols * rows;
      if (zBuffer.length !== bufferSize) {
        zBuffer = new Float32Array(bufferSize);
      }
      zBuffer.fill(0);

      if (textBuffer.length !== rows) {
        textBuffer = new Array(rows);
      }
      // Inicializa grade vazia
      const grid: string[][] = Array.from({ length: rows }, () =>
        Array.from({ length: cols }, () => " ")
      );

      // --- 1. CHUVA DIGITAL ASCII (streaming columns) ---
      const streamVelocity = 1 + scrollProgress * 2.5;
      for (let i = 0; i < drops.length; i++) {
        const d = drops[i];
        d.row += d.speed * streamVelocity * dt * 30;
        if (d.row >= rows) {
          d.row = 0;
          d.col = Math.floor(Math.random() * cols);
          d.speed = 0.2 + Math.random() * 0.5;
          d.char = STREAM_CHARS[Math.floor(Math.random() * STREAM_CHARS.length)];
        }

        const r = Math.floor(d.row);
        if (r >= 0 && r < rows && d.col >= 0 && d.col < cols) {
          grid[r][d.col] = d.char;
          // Cauda da gota
          for (let k = 1; k < d.length; k++) {
            const tr = r - k;
            if (tr >= 0 && tr < rows && grid[tr][d.col] === " ") {
              grid[tr][d.col] = k === d.length - 1 ? "." : ":";
            }
          }
        }
      }

      // --- 2. RENDERIZADOR 3D ASCII TORUS (estilo donut.c) ---
      // Dimensões do torus escalam suavemente com o scroll
      const r1 = 0.8 + scrollProgress * 0.3; // raio do tubo
      const r2 = 1.8 + scrollProgress * 0.4; // raio do toroide
      const k2 = 5.0;
      const k1 = (Math.min(cols, rows) * k2 * (0.35 + scrollProgress * 0.12)) / 3;

      // Passos angulares (ficam mais densos conforme scroll aumenta)
      const thetaStep = Math.max(0.08 - scrollProgress * 0.04, 0.035);
      const phiStep = Math.max(0.04 - scrollProgress * 0.02, 0.018);

      const cosA = Math.cos(angleA);
      const sinA = Math.sin(angleA);
      const cosB = Math.cos(angleB);
      const sinB = Math.sin(angleB);

      const centerX = Math.floor(cols / 2);
      const centerY = Math.floor(rows / 2);

      for (let theta = 0; theta < Math.PI * 2; theta += thetaStep) {
        const cosTheta = Math.cos(theta);
        const sinTheta = Math.sin(theta);

        for (let phi = 0; phi < Math.PI * 2; phi += phiStep) {
          const cosPhi = Math.cos(phi);
          const sinPhi = Math.sin(phi);

          // Ponto na superfície do torus
          const circleX = r2 + r1 * cosTheta;
          const circleY = r1 * sinTheta;

          // Rotação 3D
          const x = circleX * (cosB * cosPhi + sinA * sinB * sinPhi) - circleY * cosA * sinB;
          const y = circleX * (sinB * cosPhi - sinA * cosB * sinPhi) + circleY * cosA * cosB;
          const z = k2 + cosA * circleX * sinPhi + circleY * sinA;
          const ooz = 1 / z; // one over z

          // Projeção em coordenadas de tela (coluna e linha)
          const xp = Math.floor(centerX + k1 * ooz * x * 1.8);
          const yp = Math.floor(centerY - k1 * ooz * y);

          // Iluminação normal da superfície (Luminance)
          const L =
            cosPhi * cosTheta * sinB -
            cosA * cosTheta * sinPhi -
            sinA * sinTheta +
            cosB * (cosA * sinTheta - cosTheta * sinA * sinPhi);

          if (L > 0) {
            if (xp >= 0 && xp < cols && yp >= 0 && yp < rows) {
              const bufIdx = yp * cols + xp;
              if (ooz > zBuffer[bufIdx]) {
                zBuffer[bufIdx] = ooz;
                const charIdx = Math.min(
                  Math.floor(L * 8),
                  SHADE_CHARS.length - 1
                );
                grid[yp][xp] = SHADE_CHARS[charIdx];
              }
            }
          }
        }
      }

      // --- 3. DESENHO NO CANVAS ---
      ctx.font = `${charHeight - 3}px 'Geist Mono', 'SF Mono', Menlo, Monaco, Consolas, monospace`;
      ctx.textBaseline = "top";

      // Cor principal baseada no tema
      const primaryColor = isDark
        ? `rgba(237, 237, 237, ${baseAlpha})`
        : `rgba(23, 23, 23, ${baseAlpha})`;

      ctx.fillStyle = primaryColor;

      for (let r = 0; r < rows; r++) {
        const line = grid[r].join("");
        ctx.fillText(line, 0, r * charHeight);
      }

      // Toque sutil de fósforo verde nas cabeças da chuva digital em dark mode
      if (isDark && scrollProgress > 0.05) {
        ctx.fillStyle = `rgba(0, 255, 102, ${0.15 + scrollProgress * 0.25})`;
        for (let i = 0; i < drops.length; i += 3) {
          const d = drops[i];
          const r = Math.floor(d.row);
          if (r >= 0 && r < rows && d.col >= 0 && d.col < cols) {
            ctx.fillText(d.char, d.col * charWidth, r * charHeight);
          }
        }
      }

      ctx.restore();
    }

    animId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 h-full w-full select-none"
      aria-hidden="true"
    />
  );
}
