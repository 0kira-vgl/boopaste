"use client";

// Fundo em vídeo ASCII controlado pelo scroll: em vez de dar play, setamos
// video.currentTime proporcionalmente à posição de scroll da página — então
// scrollar pra baixo "avança" a animação e scrollar pra cima "rebobina".
// Enquanto o asset gerado pelo Gemini (public/ascii-bg.mp4) não existir, o
// <video> falha silenciosamente e o AsciiFallback (grade estática em CSS)
// segue visível — basta soltar o arquivo no caminho certo pra ativar.

import { useEffect, useRef, useState } from "react";
import { AsciiCanvas } from "@/components/ascii-canvas";

const DEFAULT_VIDEO_SRC = "/ascii-bg.mp4";

export function ScrollVideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [videoSrc, setVideoSrc] = useState(DEFAULT_VIDEO_SRC);

  useEffect(() => {
    const saved = localStorage.getItem("boopaste-active-bg");
    if (saved) {
      setVideoSrc(saved);
    }
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let rafId = 0;
    const scrub = () => {
      rafId = 0;
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      const progress = max > 0 ? window.scrollY / max : 0;
      if (video.duration) {
        video.currentTime = progress * video.duration;
      }
    };
    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(scrub);
    };

    video.addEventListener("loadedmetadata", scrub);
    window.addEventListener("scroll", onScroll, { passive: true });
    scrub();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [videoReady]);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-background">
      {/* Renderizador ASCII nativo em tempo real (Canvas 60fps com Donut 3D + Chuva Digital) */}
      <AsciiCanvas />

      {/* Se o arquivo de vídeo gerado por IA existir ou for selecionado no preview, ele roda com blend */}
      <video
        ref={videoRef}
        className="h-full w-full object-cover opacity-35 mix-blend-screen dark:opacity-45"
        src={videoSrc}
        muted
        playsInline
        preload="auto"
        onCanPlay={() => setVideoReady(true)}
        onError={() => setVideoReady(false)}
        style={{ display: videoReady ? "block" : "none" }}
      />
    </div>
  );
}
