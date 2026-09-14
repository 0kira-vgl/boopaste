"use client";

import Link from "next/link";
import { ArrowLeft, Check, Sparkles, Terminal, Copy } from "lucide-react";
import { useState } from "react";
import { BoopasteSymbol, OFFICIAL_LOGO } from "@/components/brand/boopaste-brand";

export default function PreviewPage() {
  const [copied, setCopied] = useState(false);
  const [previewBgColor, setPreviewBgColor] = useState<"black" | "dark" | "light">("black");

  const svgCode = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" width="48" height="48" fill="none">
  <path
    fill-rule="evenodd"
    clip-rule="evenodd"
    d="M24 11C18.4772 11 14 15.4772 14 21V34C14 36.5 16 36 17.5 34.5C19 33 21 34 22.5 35.5C23.5 36.5 24.5 36.5 25.5 35.5C27 34 29 33 30.5 34.5C32 36 34 36.5 34 34V21C34 15.4772 29.5228 11 24 11ZM19.5 21a1.8 1.8 0 1 0 3.6 0a1.8 1.8 0 1 0 -3.6 0ZM26 21a1.8 1.8 0 1 0 3.6 0a1.8 1.8 0 1 0 -3.6 0Z"
    fill="#00FF66"
  />
  <path
    d="M36 10C36 12.5 37.5 14 40 14C37.5 14 36 15.5 36 18C36 15.5 34.5 14 32 14C34.5 14 36 12.5 36 10Z"
    fill="#ffffff"
  />
</svg>`;

  function handleCopy() {
    navigator.clipboard.writeText(svgCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#ededed] font-sans selection:bg-[#00FF66] selection:text-black">
      {/* Header Fixo */}
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#0a0a0a]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="flex items-center gap-2 rounded border border-white/15 px-3 py-1.5 font-mono text-xs text-white/70 hover:border-white/40 hover:text-white transition-colors"
            >
              <ArrowLeft size={14} />
              <span>voltar para a landing</span>
            </Link>
            <div className="h-4 w-px bg-white/10" />
            <h1 className="font-mono text-sm font-semibold tracking-tight text-white flex items-center gap-2">
              <Terminal size={16} className="text-[#00FF66]" />
              boopaste_ / identidade visual oficial
            </h1>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-[#00FF66]/30 bg-[#00FF66]/10 px-3 py-1 font-mono text-xs text-[#00FF66]">
            <Check size={13} strokeWidth={3} />
            <span>Logo Oficial Definida</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-5xl px-6 py-12 flex flex-col gap-10">
        {/* Banner de destaque */}
        <div className="rounded-2xl border border-[#00FF66]/30 bg-[#00FF66]/[0.03] p-8 relative overflow-hidden">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#00FF66]/10 blur-3xl" />
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 relative z-10">
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[#00FF66]">
                <Sparkles size={14} />
                <span>Identidade Visual Oficial</span>
              </div>
              <h2 className="font-mono text-3xl font-bold text-white tracking-tight">
                {OFFICIAL_LOGO.name}
              </h2>
              <p className="max-w-xl text-sm leading-relaxed text-white/70">
                {OFFICIAL_LOGO.description}
              </p>
            </div>

            <button
              onClick={handleCopy}
              className="flex items-center gap-2 rounded-lg bg-[#00FF66] px-4 py-2.5 font-mono text-xs font-bold text-black hover:bg-[#00FF66]/90 transition-all shadow-lg shadow-[#00FF66]/20"
            >
              {copied ? <Check size={15} /> : <Copy size={15} />}
              <span>{copied ? "SVG Copiado!" : "Copiar SVG"}</span>
            </button>
          </div>
        </div>

        {/* Card de Visualização do Símbolo */}
        <div className="flex flex-col rounded-2xl border border-white/10 overflow-hidden bg-black">
          <div className="flex items-center justify-between border-b border-white/10 px-6 py-4 bg-white/[0.02]">
            <div className="font-mono text-xs text-white/60">
              Contraste de fundo para visualização:
            </div>
            <div className="flex items-center gap-2 font-mono text-xs">
              <button
                onClick={() => setPreviewBgColor("black")}
                className={`rounded border px-2.5 py-1 transition-all ${previewBgColor === "black" ? "border-[#00FF66] bg-[#00FF66]/20 text-[#00FF66]" : "border-white/15 text-white/60"}`}
              >
                Preto #0a0a0a
              </button>
              <button
                onClick={() => setPreviewBgColor("dark")}
                className={`rounded border px-2.5 py-1 transition-all ${previewBgColor === "dark" ? "border-[#00FF66] bg-[#00FF66]/20 text-[#00FF66]" : "border-white/15 text-white/60"}`}
              >
                Terminal #0b1610
              </button>
              <button
                onClick={() => setPreviewBgColor("light")}
                className={`rounded border px-2.5 py-1 transition-all ${previewBgColor === "light" ? "border-[#00FF66] bg-[#00FF66]/20 text-[#00FF66]" : "border-white/15 text-white/60"}`}
              >
                Claro #F7F7F7
              </button>
            </div>
          </div>

          <div
            className={`flex flex-col items-center justify-center p-16 transition-colors ${
              previewBgColor === "black"
                ? "bg-[#0a0a0a]"
                : previewBgColor === "dark"
                ? "bg-[#0b1610]"
                : "bg-zinc-100"
            }`}
          >
            {/* Símbolo em Tamanho Grande com Glow */}
            <div className="group relative flex items-center justify-center p-6 transition-transform duration-300 hover:scale-110">
              <div className="absolute -inset-4 rounded-3xl bg-[#00FF66]/20 blur-2xl opacity-75 group-hover:opacity-100 transition-opacity" />
              <div className="relative">
                <BoopasteSymbol size={110} />
              </div>
            </div>

            <div className="mt-8 font-mono text-2xl font-bold tracking-tight text-white flex items-center gap-2">
              <span className={previewBgColor === "light" ? "text-black" : "text-white"}>boopaste</span>
              <span className="h-5 w-2 bg-[#00FF66] animate-pulse inline-block" />
            </div>

            {/* Escalas Reais de Uso */}
            <div className="mt-10 flex flex-wrap items-center justify-center gap-6 rounded-xl border border-white/10 bg-black/60 px-6 py-3">
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-white/40">Hero (72px):</span>
                <BoopasteSymbol size={48} />
              </div>
              <div className="h-4 w-px bg-white/10" />
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-white/40">Header (20px):</span>
                <BoopasteSymbol size={20} />
              </div>
              <div className="h-4 w-px bg-white/10" />
              <div className="flex items-center gap-2">
                <span className="font-mono text-[11px] text-white/40">Favicon (14px):</span>
                <BoopasteSymbol size={14} />
              </div>
            </div>
          </div>
        </div>

        {/* Fundo Selecionado: Trilha Céu Vivo 3D */}
        <div className="flex flex-col gap-4 rounded-xl border border-white/10 bg-white/[0.02] p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="font-mono text-xs text-[#00FF66] uppercase tracking-wider">Fundo Ativo na Landing</div>
              <h3 className="font-mono text-lg font-bold text-white mt-1">Céu Vivo 3D + Enxame de Fantasmas Infinito</h3>
            </div>
            <Link
              href="/"
              className="rounded-lg border border-white/20 px-3.5 py-1.5 font-mono text-xs text-white/80 hover:border-white/50 hover:text-white transition-colors"
            >
              Ver na Home →
            </Link>
          </div>
          <p className="text-xs text-white/60 leading-relaxed">
            Renderizado via Three.js e shaders GPU com taxa estável de 60-120 FPS. Todos os vídeos de demonstração alternativos foram removidos conforme solicitado.
          </p>
        </div>
      </main>
    </div>
  );
}
