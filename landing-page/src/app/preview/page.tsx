"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Check, Download, Eye, Play, Pause, RotateCcw, Sparkles, ArrowLeft, Terminal } from "lucide-react";

interface LogoOption {
  id: string;
  title: string;
  style: string;
  description: string;
  src: string;
  tags: string[];
  palette: string[];
}

interface VideoOption {
  id: string;
  title: string;
  style: string;
  description: string;
  src: string;
  duration: string;
  curve: string;
}

const LOGOS: LogoOption[] = [
  {
    id: "logo-1-pixel-green",
    title: "1. Neon Ghost Arcade",
    style: "16-bit Pixel Art Phosphor",
    description: "Fantasma fofo e stealthy segurando um clipboard retrô com cursor verde de terminal e raios pixelados.",
    src: "/previews/logos/logo-1-pixel-green.jpg",
    tags: ["Pixel Art", "Phosphor Green", "GameBoy / Arcade", "Ghost Mascot"],
    palette: ["#000000", "#00FF66", "#00F0FF", "#FFFFFF"],
  },
  {
    id: "logo-2-ascii-bbs",
    title: "2. BBS ANSI Hacker Terminal",
    style: "Monochrome ASCII Puro",
    description: "Estética autêntica de BBS dos anos 80/90, composta estritamente de glifos monospace ASCII formando a silhueta do fantasma e o banner boopaste.",
    src: "/previews/logos/logo-2-ascii-bbs.jpg",
    tags: ["ASCII Art", "Monochrome", "BBS / ANSI", "Figlet Font"],
    palette: ["#000000", "#FFFFFF", "#888888"],
  },
  {
    id: "logo-3-mac-8bit",
    title: "3. Macintosh 1-bit Ghost",
    style: "Mac OS Classic 1-bit Bitmap",
    description: "Fantasma emergindo diretamente de uma janela clássica de terminal macOS com atalho de clipboard ⌘V acima.",
    src: "/previews/logos/logo-3-mac-8bit.jpg",
    tags: ["1-bit Mac", "Terminal Window", "Cmd+V Shortcut", "Developer"],
    palette: ["#000000", "#FFFFFF"],
  },
  {
    id: "logo-4-amber-crt",
    title: "4. Vintage Amber CRT",
    style: "Fósforo Âmbar Monocromático",
    description: "Monitor CRT clássico com brilho fósforo âmbar (#FFB000), fantasma hacker de fones e óculos segurando um arquivo .png.",
    src: "/previews/logos/logo-4-amber-crt.jpg",
    tags: ["Amber CRT", "Retro Hardware", "BBS Scene", "Warm Glow"],
    palette: ["#000000", "#FFB000", "#FF7700"],
  },
  {
    id: "logo-5-cyber-pixel",
    title: "5. Cyber Mint Minimalist",
    style: "Modern Isometric Pixel Tech",
    description: "Fantasma pixel minimalista em gradiente sutil ciano/menta com prancheta de imagem e cursor de terminal piscante.",
    src: "/previews/logos/logo-5-cyber-pixel.jpg",
    tags: ["Dark Tech", "Cyan / Mint", "Minimalist", "Agency Grade"],
    palette: ["#000000", "#00F0FF", "#00FF88", "#FFFFFF"],
  },
];

const VIDEOS: VideoOption[] = [
  {
    id: "video-1-matrix-rain",
    title: "1. Chuva Digital Matrix (Matrix Rain Stream)",
    style: "Cascata de Código Monospace",
    description: "Chuva de caracteres do boopaste e terminal (0, 1, hex, [⌘V], Ghostty) caindo em colunas verticais com aceleração e caudas de fósforo.",
    src: "/previews/videos/video-1-matrix-rain.mp4",
    duration: "12s",
    curve: "0s calmo/esparso → 6s fluxo acelerado → 12s tempestade torrencial de código",
  },
  {
    id: "video-2-donut-torus",
    title: "2. Donut 3D Wireframe (Andy Sloane ASCII Torus)",
    style: "3D Mathematical ASCII Raymarching",
    description: "O clássico donut.c renderizado em ASCII onde a iluminação e rotação giroscópica em 2 eixos respondem diretamente ao scroll.",
    src: "/previews/videos/video-2-donut-torus.mp4",
    duration: "12s",
    curve: "0s nuvem de pontos sutil → 6s malha aramada sólida → 12s iluminação plena e anéis orbitais",
  },
  {
    id: "video-3-topographic-wave",
    title: "3. Onda Topográfica ASCII (Fluid Landscape Wave)",
    style: "Simulação de Fluidos & Topografia",
    description: "Grade tridimensional ondulante onde vales são representados por pontos (. :) e picos por glifos pesados (* # % @).",
    src: "/previews/videos/video-3-topographic-wave.mp4",
    duration: "12s",
    curve: "0s brisa quase plana no horizonte → 6s ondulações harmônicas → 12s turbulência fluida oceânica",
  },
  {
    id: "video-4-cyber-tunnel",
    title: "4. Túnel Cyberpunk (Hyperspace ASCII Tunnel)",
    style: "Túnel de Perspectiva 3D",
    description: "Anéis concêntricos e raios de código ASCII que criam a sensação de avançar em velocidade pelo túnel do terminal.",
    src: "/previews/videos/video-4-cyber-tunnel.mp4",
    duration: "12s",
    curve: "0s anéis distantes e calmos → 6s aproximação das paredes de código → 12s aceleração de dobra espacial",
  },
  {
    id: "video-5-ghost-swarm",
    title: "5. Enxame Ectoplasmático (Ghost Swarm & Particles)",
    style: "Partículas Espectrais & Mascotes ASCII",
    description: "Pequenos fantasmas ASCII (o_o), [⌘V] e partículas de poeira ectoplasmática flutuando e reagindo dinamicamente.",
    src: "/previews/videos/video-5-ghost-swarm.mp4",
    duration: "12s",
    curve: "0s fantasma solitário flutuando no vazio → 6s enxame orbital com caudas → 12s dança espectral de alta energia",
  },
];

export default function PreviewPage() {
  const [activeTab, setActiveTab] = useState<"logos" | "videos">("logos");
  const [activeLogo, setActiveLogo] = useState<string | null>(null);
  const [activeBg, setActiveBg] = useState<string | null>(null);
  const [previewBgColor, setPreviewBgColor] = useState<"black" | "crt" | "light">("black");

  useEffect(() => {
    const savedLogo = localStorage.getItem("boopaste-active-logo");
    if (savedLogo) setActiveLogo(savedLogo);

    const savedBg = localStorage.getItem("boopaste-active-bg");
    if (savedBg) setActiveBg(savedBg);
  }, []);

  function handleSelectLogo(logoSrc: string) {
    if (activeLogo === logoSrc) {
      localStorage.removeItem("boopaste-active-logo");
      setActiveLogo(null);
    } else {
      localStorage.setItem("boopaste-active-logo", logoSrc);
      setActiveLogo(logoSrc);
    }
  }

  function handleSelectBg(videoSrc: string) {
    if (activeBg === videoSrc) {
      localStorage.removeItem("boopaste-active-bg");
      setActiveBg(null);
    } else {
      localStorage.setItem("boopaste-active-bg", videoSrc);
      setActiveBg(videoSrc);
    }
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#ededed] font-sans selection:bg-[#00FF66] selection:text-black">
      {/* Header Fixo */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0a0a0a]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 rounded border border-white/15 px-3 py-1.5 font-mono text-xs text-white/70 hover:border-white/40 hover:text-white transition-colors"
            >
              <ArrowLeft size={14} />
              <span>voltar para o site</span>
            </Link>
            <div className="h-4 w-px bg-white/10" />
            <h1 className="font-mono text-sm font-semibold tracking-tight text-white flex items-center gap-2">
              <Terminal size={16} className="text-[#00FF66]" />
              boopaste_ / asset preview & selection
            </h1>
          </div>

          {/* Abas */}
          <div className="flex items-center gap-2 rounded-lg border border-white/15 bg-white/5 p-1 font-mono text-xs">
            <button
              onClick={() => setActiveTab("logos")}
              className={`flex items-center gap-2 rounded px-3 py-1.5 transition-all ${
                activeTab === "logos"
                  ? "bg-[#00FF66] text-black font-semibold shadow"
                  : "text-white/70 hover:text-white"
              }`}
            >
              <span>Logos (5 opções)</span>
              {activeLogo && <span className="h-1.5 w-1.5 rounded-full bg-black" />}
            </button>
            <button
              onClick={() => setActiveTab("videos")}
              className={`flex items-center gap-2 rounded px-3 py-1.5 transition-all ${
                activeTab === "videos"
                  ? "bg-[#00FF66] text-black font-semibold shadow"
                  : "text-white/70 hover:text-white"
              }`}
            >
              <span>Vídeos & Fundos ASCII (5 opções)</span>
              {activeBg && <span className="h-1.5 w-1.5 rounded-full bg-black" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-10">
        {/* Banner de status */}
        <div className="mb-10 rounded-xl border border-white/10 bg-white/[0.02] p-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#00FF66]">
                <Sparkles size={14} />
                <span>Escolha seus assets para a landing page</span>
              </div>
              <p className="mt-1 text-sm text-white/70">
                Selecione sua logo e seu vídeo de fundo favoritos. O que você escolher aqui será ativado imediatamente na página inicial!
              </p>
            </div>
            <div className="flex items-center gap-3 font-mono text-xs">
              <div className="flex items-center gap-2 rounded border border-white/10 bg-black px-3 py-1.5">
                <span className="text-white/40">Logo ativa:</span>
                <span className="text-[#00FF66] font-semibold">
                  {activeLogo ? LOGOS.find(l => l.src === activeLogo)?.title || "Custom" : "Padrão (ASCII Banner)"}
                </span>
              </div>
              <div className="flex items-center gap-2 rounded border border-white/10 bg-black px-3 py-1.5">
                <span className="text-white/40">Fundo ativo:</span>
                <span className="text-[#00FF66] font-semibold">
                  {activeBg ? VIDEOS.find(v => v.src === activeBg)?.title.split("(")[0] || "Custom" : "Padrão (Canvas 3D)"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* TAB 1: LOGOS */}
        {activeTab === "logos" && (
          <div className="flex flex-col gap-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div>
                <h2 className="font-mono text-xl font-bold text-white">5 Variações de Logos</h2>
                <p className="font-mono text-xs text-white/50">Estilos ASCII Art, 8-bit, 16-bit Pixel e Vintage CRT</p>
              </div>

              {/* Seletor de fundo para testar contraste */}
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="text-white/50">Testar fundo:</span>
                <button
                  onClick={() => setPreviewBgColor("black")}
                  className={`rounded border px-2.5 py-1 ${previewBgColor === "black" ? "border-[#00FF66] bg-[#00FF66]/20 text-[#00FF66]" : "border-white/15 text-white/60"}`}
                >
                  Preto Puro
                </button>
                <button
                  onClick={() => setPreviewBgColor("crt")}
                  className={`rounded border px-2.5 py-1 ${previewBgColor === "crt" ? "border-[#00FF66] bg-[#00FF66]/20 text-[#00FF66]" : "border-white/15 text-white/60"}`}
                >
                  Terminal Verde
                </button>
                <button
                  onClick={() => setPreviewBgColor("light")}
                  className={`rounded border px-2.5 py-1 ${previewBgColor === "light" ? "border-[#00FF66] bg-[#00FF66]/20 text-[#00FF66]" : "border-white/15 text-white/60"}`}
                >
                  Fundo Claro
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {LOGOS.map((logo) => {
                const isSelected = activeLogo === logo.src;
                return (
                  <div
                    key={logo.id}
                    className={`group relative flex flex-col rounded-xl border transition-all overflow-hidden bg-black ${
                      isSelected
                        ? "border-[#00FF66] ring-2 ring-[#00FF66]/30 shadow-lg shadow-[#00FF66]/10"
                        : "border-white/10 hover:border-white/30"
                    }`}
                  >
                    {/* Badge Selecionado */}
                    {isSelected && (
                      <div className="absolute top-3 right-3 z-10 flex items-center gap-1 rounded bg-[#00FF66] px-2 py-0.5 font-mono text-[11px] font-bold text-black">
                        <Check size={12} strokeWidth={3} />
                        ATIVA NO SITE
                      </div>
                    )}

                    {/* Imagem do Logo com Fundo Variável */}
                    <div
                      className={`relative aspect-square w-full flex items-center justify-center p-6 border-b border-white/10 transition-colors ${
                        previewBgColor === "black"
                          ? "bg-black"
                          : previewBgColor === "crt"
                          ? "bg-[#06140a]"
                          : "bg-zinc-100"
                      }`}
                    >
                      <div className="relative h-full w-full">
                        <Image
                          src={logo.src}
                          alt={logo.title}
                          fill
                          className="object-contain transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                    </div>

                    {/* Informações */}
                    <div className="flex flex-1 flex-col justify-between p-5 gap-4">
                      <div className="flex flex-col gap-2">
                        <div className="flex items-center justify-between">
                          <h3 className="font-mono text-base font-bold text-white group-hover:text-[#00FF66] transition-colors">
                            {logo.title}
                          </h3>
                          <span className="font-mono text-[10px] text-white/40 uppercase tracking-widest">
                            {logo.style}
                          </span>
                        </div>
                        <p className="text-xs leading-relaxed text-white/70">{logo.description}</p>
                      </div>

                      {/* Tags & Cores */}
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-wrap gap-1.5">
                          {logo.tags.map((t) => (
                            <span
                              key={t}
                              className="rounded border border-white/10 bg-white/5 px-2 py-0.5 font-mono text-[10px] text-white/60"
                            >
                              {t}
                            </span>
                          ))}
                        </div>

                        {/* Paleta */}
                        <div className="flex items-center gap-1.5">
                          <span className="font-mono text-[10px] text-white/40">Paleta:</span>
                          <div className="flex items-center gap-1">
                            {logo.palette.map((color) => (
                              <span
                                key={color}
                                className="h-3 w-3 rounded-full border border-white/20"
                                style={{ backgroundColor: color }}
                                title={color}
                              />
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Botões de Ação */}
                      <div className="flex items-center gap-2 pt-2 border-t border-white/10">
                        <button
                          onClick={() => handleSelectLogo(logo.src)}
                          className={`flex flex-1 items-center justify-center gap-2 rounded py-2 font-mono text-xs font-semibold transition-all ${
                            isSelected
                              ? "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
                              : "bg-[#00FF66] text-black hover:bg-[#00FF66]/90 shadow-sm"
                          }`}
                        >
                          {isSelected ? (
                            <>
                              <RotateCcw size={14} />
                              Desativar
                            </>
                          ) : (
                            <>
                              <Check size={14} />
                              Usar no site
                            </>
                          )}
                        </button>
                        <a
                          href={logo.src}
                          download
                          className="flex items-center justify-center rounded border border-white/20 p-2 text-white/70 hover:border-white/60 hover:text-white transition-colors"
                          title="Baixar imagem"
                        >
                          <Download size={14} />
                        </a>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 2: VÍDEOS & FUNDOS ASCII */}
        {activeTab === "videos" && (
          <div className="flex flex-col gap-8">
            <div className="border-b border-white/10 pb-4">
              <h2 className="font-mono text-xl font-bold text-white">5 Vídeos de Fundo ASCII (Scroll-Driven)</h2>
              <p className="font-mono text-xs text-white/50">
                Todos com loop de 12 segundos e progressão monotônica de intensidade (0s = calmo/Hero → 12s = tempestade no rodapé).
              </p>
            </div>

            <div className="flex flex-col gap-8">
              {VIDEOS.map((video) => (
                <VideoCard
                  key={video.id}
                  video={video}
                  isSelected={activeBg === video.src}
                  onSelect={() => handleSelectBg(video.src)}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function VideoCard({
  video,
  isSelected,
  onSelect,
}: {
  video: VideoOption;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [scrubPercent, setScrubPercent] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  function togglePlay() {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.play();
      setIsPlaying(true);
    } else {
      v.pause();
      setIsPlaying(false);
    }
  }

  function handleScrub(e: React.ChangeEvent<HTMLInputElement>) {
    const v = videoRef.current;
    const val = parseFloat(e.target.value);
    setScrubPercent(val);
    if (v && v.duration) {
      v.currentTime = (val / 100) * v.duration;
      setCurrentTime(v.currentTime);
      if (!v.paused) {
        v.pause();
        setIsPlaying(false);
      }
    }
  }

  function handleTimeUpdate() {
    const v = videoRef.current;
    if (!v || !v.duration) return;
    setCurrentTime(v.currentTime);
    setScrubPercent((v.currentTime / v.duration) * 100);
  }

  return (
    <div
      className={`flex flex-col lg:flex-row gap-6 rounded-xl border bg-black p-6 transition-all ${
        isSelected
          ? "border-[#00FF66] ring-2 ring-[#00FF66]/30 shadow-xl shadow-[#00FF66]/10"
          : "border-white/10 hover:border-white/25"
      }`}
    >
      {/* Player de Vídeo */}
      <div className="relative w-full lg:w-3/5 rounded-lg overflow-hidden border border-white/15 bg-black">
        <video
          ref={videoRef}
          src={video.src}
          loop
          muted
          playsInline
          onTimeUpdate={handleTimeUpdate}
          className="h-full w-full object-cover aspect-video"
        />

        {/* Overlay com Controles do Player */}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent p-4 flex flex-col gap-3">
          {/* Barra de Scroll Scrub Virtual */}
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between font-mono text-[11px] text-white/70">
              <span className="flex items-center gap-1.5 text-[#00FF66]">
                <Eye size={12} />
                Simulador de Scroll da Página:
              </span>
              <span>
                {Math.round(scrubPercent)}% ({(currentTime).toFixed(1)}s / {video.duration})
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="0.1"
              value={scrubPercent}
              onChange={handleScrub}
              className="w-full accent-[#00FF66] cursor-pointer h-1.5 bg-white/20 rounded appearance-none"
            />
            <div className="flex justify-between font-mono text-[9px] text-white/40 pt-1">
              <span>0% (Hero calmo)</span>
              <span>50% (Features/How-it-works)</span>
              <span>100% (Rodapé / Clímax)</span>
            </div>
          </div>
        </div>

        {/* Botão Play/Pause Flutuante */}
        <button
          onClick={togglePlay}
          className="absolute top-4 left-4 rounded-full bg-black/70 border border-white/20 p-2 text-white hover:bg-[#00FF66] hover:text-black transition-colors"
          title={isPlaying ? "Pausar loop" : "Tocar loop contínuo"}
        >
          {isPlaying ? <Pause size={14} /> : <Play size={14} />}
        </button>

        {isSelected && (
          <div className="absolute top-4 right-4 flex items-center gap-1 rounded bg-[#00FF66] px-2.5 py-1 font-mono text-xs font-bold text-black">
            <Check size={12} strokeWidth={3} />
            FUNDO ATIVO NO SITE
          </div>
        )}
      </div>

      {/* Descrição & Ações */}
      <div className="flex w-full lg:w-2/5 flex-col justify-between gap-4">
        <div className="flex flex-col gap-3">
          <div>
            <div className="font-mono text-[10px] text-[#00FF66] uppercase tracking-widest">{video.style}</div>
            <h3 className="font-mono text-lg font-bold text-white mt-0.5">{video.title}</h3>
          </div>

          <p className="text-sm leading-relaxed text-white/70">{video.description}</p>

          {/* Curva de Intensidade */}
          <div className="rounded border border-white/10 bg-white/[0.03] p-3">
            <div className="font-mono text-[10px] uppercase tracking-wider text-white/40 mb-1">
              Progressão Monotônica:
            </div>
            <div className="font-mono text-xs text-white/80">{video.curve}</div>
          </div>
        </div>

        {/* Ações */}
        <div className="flex items-center gap-3 pt-4 border-t border-white/10">
          <button
            onClick={onSelect}
            className={`flex flex-1 items-center justify-center gap-2 rounded py-2.5 font-mono text-xs font-semibold transition-all ${
              isSelected
                ? "bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30"
                : "bg-[#00FF66] text-black hover:bg-[#00FF66]/90 shadow-sm"
            }`}
          >
            {isSelected ? (
              <>
                <RotateCcw size={14} />
                Remover e voltar ao Canvas
              </>
            ) : (
              <>
                <Check size={14} />
                Definir como Fundo da Landing
              </>
            )}
          </button>
          <a
            href={video.src}
            download
            className="flex items-center gap-1.5 rounded border border-white/20 px-3 py-2.5 font-mono text-xs text-white/70 hover:border-white/60 hover:text-white transition-colors"
            title="Baixar vídeo MP4"
          >
            <Download size={14} />
            <span>MP4</span>
          </a>
        </div>
      </div>
    </div>
  );
}
