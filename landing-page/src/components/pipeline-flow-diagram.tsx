"use client";

import { useState } from "react";
import {
  Keyboard,
  Check,
  Copy,
  ArrowDown,
  ArrowRight,
  ShieldCheck,
  HardDrive,
  FileCode,
  Sparkles,
  Terminal as TerminalIcon,
  RefreshCw,
} from "lucide-react";
import { Kbd, KbdGroup } from "@/components/ui/kbd";
import { cn } from "@/lib/cn";
import { useLocale } from "@/components/locale-provider";

interface PipelineFlowDiagramProps {
  rawAscii: string;
}

export function PipelineFlowDiagram({ rawAscii }: PipelineFlowDiagramProps) {
  const { locale } = useLocale();
  const isPt = locale === "pt";
  const [viewMode, setViewMode] = useState<"visual" | "ascii">("visual");
  const [copied, setCopied] = useState(false);

  async function handleCopyAscii() {
    try {
      await navigator.clipboard.writeText(rawAscii);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  }

  const t = {
    title: isPt ? "Diagrama do Fluxo de Execução" : "Execution Pipeline Flow",
    subtitle: isPt
      ? "Interceptação de baixo nível via CGEventTap e NSWorkspace da Apple"
      : "Low-level OS interception via CGEventTap and Apple NSWorkspace",
    visualTab: isPt ? "Fluxograma Visual" : "Visual Pipeline",
    asciiTab: isPt ? "Blueprint ASCII" : "ASCII Blueprint",
    copy: isPt ? "Copiar" : "Copy",
    copied: isPt ? "Copiado!" : "Copied!",
    triggerTitle: isPt ? "Disparo do Usuário" : "User Trigger Event",
    pressPrompt: isPt ? "Usuário pressiona" : "User presses",
    passThroughTitle: isPt ? "Passa direto sem tocar" : "Pass through untouched",
    passThroughSubtitle: isPt
      ? "Zero latência: evento segue seu fluxo nativo no macOS sem interferência."
      : "Zero latency: event continues its native macOS path without interference.",
    gate1: {
      tag: "01",
      module: "eventtap.rs",
      title: isPt ? "Filtro de Interceptação de Tecla" : "Keystroke Interception Filter",
      check: isPt
        ? "A tecla pressionada é ⌘V (Command + keycode 0x09)?"
        : "Is KeyDown event Command flag + keycode 0x09 ('V')?",
      yes: isPt ? "⌘V detectado" : "⌘V detected",
      no: isPt ? "Outras teclas" : "Not ⌘V",
    },
    gate2: {
      tag: "02",
      module: "frontmost.rs",
      title: isPt ? "Validação do Aplicativo em Foco" : "Frontmost Application Check",
      check: isPt
        ? "A janela ativa pertence ao Ghostty ou Terminal.app?"
        : "Is the frontmost bundle Ghostty or macOS Terminal.app?",
      yes: isPt ? "Terminal suportado em foco" : "Supported terminal in focus",
      no: isPt ? "Outro app (Chrome, Slack, etc.)" : "Other app (Chrome, Slack...)",
    },
    gate3: {
      tag: "03",
      module: "clipboard.rs",
      title: isPt ? "Inspeção do Conteúdo do Clipboard" : "Clipboard Content Inspection",
      check: isPt
        ? "O pasteboard contém dados de imagem (PNG / TIFF)?"
        : "Does the system pasteboard contain image data (PNG / TIFF)?",
      yes: isPt ? "ImageData encontrada" : "ImageData found",
      no: isPt ? "Texto puro ou vazio" : "Text or empty",
    },
    actionBox: {
      tag: "04",
      module: "daemon.rs + clipboard.rs",
      title: isPt
        ? "Motor Atômico de Swap & Auto-Restauração"
        : "Atomic Swap & Auto-Restore Pipeline",
      subtitle: isPt
        ? "Execução síncrona invisível antes do terminal processar o paste"
        : "Synchronous transparent execution before terminal consumes paste",
      steps: [
        {
          num: "1",
          title: isPt ? "Grava imagem no disco" : "Save image to disk",
          code: "/tmp/boopaste/clip_<ts>.png",
          desc: isPt
            ? "Converte o buffer RGBA em arquivo PNG comprimido no diretório temporário."
            : "Encodes raw RGBA buffer into PNG on disk in temporary storage.",
          icon: HardDrive,
        },
        {
          num: "2",
          title: isPt ? "Substitui texto do clipboard" : "Set clipboard string to path",
          code: "clipboard::set_text(path)",
          desc: isPt
            ? "Troca o conteúdo da área de transferência pelo caminho absoluto do arquivo."
            : "Replaces pasteboard content synchronously with the absolute file path.",
          icon: FileCode,
        },
        {
          num: "3",
          title: isPt ? "Libera ⌘V para o terminal" : "Allow ⌘V event into terminal",
          code: "Ghostty / Terminal.app",
          desc: isPt
            ? "O terminal ativo recebe o atalho de colar e insere o caminho do arquivo PNG."
            : "Active terminal consumes the original paste event and receives the path string.",
          icon: TerminalIcon,
        },
        {
          num: "4",
          title: isPt ? "Restauração em background" : "Spawn background restore thread",
          code: "thread::spawn (200ms delay)",
          desc: isPt
            ? "Uma thread assíncrona aguarda 200ms e restaura os bytes da imagem original no clipboard."
            : "Asynchronous thread sleeps 200ms then restores original image bytes for other apps.",
          icon: RefreshCw,
        },
      ],
      finalBadge: isPt
        ? "Terminal recebe caminho válido · Imagem original preservada no histórico"
        : "Terminal receives valid path · Original image preserved in clipboard history",
    },
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Container Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-foreground/10 pb-3">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">
              {t.title}
            </span>
            <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 font-mono text-[10px] text-emerald-600 dark:text-emerald-400">
              CoreGraphics EventTap
            </span>
          </div>
          <span className="font-mono text-[11px] text-foreground/50">
            {t.subtitle}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex rounded-lg border border-foreground/15 bg-foreground/[0.02] p-0.5 text-xs font-mono">
            <button
              onClick={() => setViewMode("visual")}
              type="button"
              className={cn(
                "rounded-md px-2.5 py-1 transition-colors",
                viewMode === "visual"
                  ? "bg-foreground/10 text-foreground font-semibold shadow-xs"
                  : "text-foreground/50 hover:text-foreground"
              )}
            >
              {t.visualTab}
            </button>
            <button
              onClick={() => setViewMode("ascii")}
              type="button"
              className={cn(
                "rounded-md px-2.5 py-1 transition-colors",
                viewMode === "ascii"
                  ? "bg-foreground/10 text-foreground font-semibold shadow-xs"
                  : "text-foreground/50 hover:text-foreground"
              )}
            >
              {t.asciiTab}
            </button>
          </div>

          {viewMode === "ascii" && (
            <button
              onClick={handleCopyAscii}
              type="button"
              className="flex items-center gap-1.5 rounded-lg border border-foreground/15 bg-foreground/[0.02] px-2.5 py-1 font-mono text-xs text-foreground/60 transition-colors hover:bg-foreground/10 hover:text-foreground"
            >
              {copied ? <Check size={13} className="text-emerald-500" /> : <Copy size={13} />}
              <span>{copied ? t.copied : t.copy}</span>
            </button>
          )}
        </div>
      </div>

      {/* ASCII View */}
      {viewMode === "ascii" && (
        <pre className="overflow-x-auto rounded-xl border border-foreground/15 bg-foreground/[0.02] p-5 font-mono text-[11px] leading-relaxed text-foreground/80 sm:text-xs">
          {rawAscii}
        </pre>
      )}

      {/* Visual Pipeline View */}
      {viewMode === "visual" && (
        <div className="flex flex-col gap-6 rounded-2xl border border-foreground/15 bg-foreground/[0.01] p-5 sm:p-7">
          {/* Trigger Node (Top) */}
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-3 rounded-xl border border-foreground/20 bg-background px-4 py-2.5 shadow-sm">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-500">
                <Keyboard size={15} />
              </div>
              <div className="flex items-center gap-2 font-mono text-xs">
                <span className="text-foreground/60">{t.pressPrompt}</span>
                <KbdGroup>
                  <Kbd size="sm">⌘</Kbd>
                  <span className="text-foreground/40 font-mono text-[10px]">+</span>
                  <Kbd size="sm">V</Kbd>
                </KbdGroup>
              </div>
            </div>

            {/* Vertical Connector */}
            <div className="flex flex-col items-center my-1 text-foreground/30">
              <div className="h-6 w-px bg-foreground/20" />
              <ArrowDown size={14} className="-mt-1 text-foreground/40" />
            </div>
          </div>

          {/* Gate 1: eventtap.rs */}
          <GateSection
            tag={t.gate1.tag}
            module={t.gate1.module}
            title={t.gate1.title}
            check={t.gate1.check}
            yesLabel={t.gate1.yes}
            noLabel={t.gate1.no}
            passThroughTitle={t.passThroughTitle}
            passThroughSubtitle={t.passThroughSubtitle}
          />

          {/* Vertical Connector */}
          <div className="flex flex-col items-center -my-2 text-foreground/30">
            <div className="h-6 w-px bg-foreground/20" />
            <ArrowDown size={14} className="-mt-1 text-emerald-500" />
          </div>

          {/* Gate 2: frontmost.rs */}
          <GateSection
            tag={t.gate2.tag}
            module={t.gate2.module}
            title={t.gate2.title}
            check={t.gate2.check}
            yesLabel={t.gate2.yes}
            noLabel={t.gate2.no}
            passThroughTitle={t.passThroughTitle}
            passThroughSubtitle={t.passThroughSubtitle}
          />

          {/* Vertical Connector */}
          <div className="flex flex-col items-center -my-2 text-foreground/30">
            <div className="h-6 w-px bg-foreground/20" />
            <ArrowDown size={14} className="-mt-1 text-emerald-500" />
          </div>

          {/* Gate 3: clipboard.rs */}
          <GateSection
            tag={t.gate3.tag}
            module={t.gate3.module}
            title={t.gate3.title}
            check={t.gate3.check}
            yesLabel={t.gate3.yes}
            noLabel={t.gate3.no}
            passThroughTitle={t.passThroughTitle}
            passThroughSubtitle={t.passThroughSubtitle}
          />

          {/* Vertical Connector into Action Box */}
          <div className="flex flex-col items-center -my-2 text-foreground/30">
            <div className="h-6 w-px bg-emerald-500/50" />
            <ArrowDown size={14} className="-mt-1 text-emerald-500 animate-pulse" />
          </div>

          {/* Final Action Node: Atomic Swap & Auto-Restore Pipeline */}
          <div className="flex flex-col overflow-hidden rounded-xl border border-emerald-500/30 bg-emerald-500/[0.02] shadow-sm">
            {/* Box Header */}
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-500/20 bg-emerald-500/[0.04] px-5 py-3.5">
              <div className="flex items-center gap-2.5">
                <span className="flex h-5 w-5 items-center justify-center rounded bg-emerald-500/20 font-mono text-xs font-bold text-emerald-500">
                  {t.actionBox.tag}
                </span>
                <span className="font-mono text-xs font-bold tracking-tight text-foreground">
                  {t.actionBox.title}
                </span>
              </div>
              <span className="rounded bg-emerald-500/10 px-2 py-0.5 font-mono text-[10px] text-emerald-600 dark:text-emerald-400">
                {t.actionBox.module}
              </span>
            </div>

            {/* Micro Steps Grid */}
            <div className="grid grid-cols-1 divide-y divide-emerald-500/15 p-2 sm:grid-cols-2 sm:divide-x sm:divide-y-0 sm:gap-2">
              {t.actionBox.steps.map((step) => {
                const Icon = step.icon;
                return (
                  <div
                    key={step.num}
                    className="flex flex-col gap-2 rounded-lg bg-background/50 p-4 transition-colors hover:bg-background/80"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500/20 font-mono text-[10px] font-bold text-emerald-500">
                          {step.num}
                        </span>
                        <span className="font-mono text-xs font-semibold text-foreground">
                          {step.title}
                        </span>
                      </div>
                      <Icon size={14} className="text-emerald-500" />
                    </div>

                    <code className="rounded border border-emerald-500/20 bg-emerald-500/5 px-2 py-1 font-mono text-[11px] text-emerald-600 dark:text-emerald-400">
                      {step.code}
                    </code>

                    <p className="font-mono text-[11px] leading-relaxed text-foreground/70">
                      {step.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Bottom Status Banner */}
            <div className="flex items-center justify-center gap-2 border-t border-emerald-500/15 bg-emerald-500/[0.04] px-4 py-2.5 text-center font-mono text-xs text-emerald-600 dark:text-emerald-400">
              <Sparkles size={13} className="shrink-0" />
              <span>{t.actionBox.finalBadge}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface GateSectionProps {
  tag: string;
  module: string;
  title: string;
  check: string;
  yesLabel: string;
  noLabel: string;
  passThroughTitle: string;
  passThroughSubtitle: string;
}

function GateSection({
  tag,
  module,
  title,
  check,
  yesLabel,
  noLabel,
  passThroughTitle,
  passThroughSubtitle,
}: GateSectionProps) {
  return (
    <div className="grid grid-cols-1 gap-3 md:grid-cols-[1fr_auto_1fr] md:items-center">
      {/* Left / Center Main Gate Card */}
      <div className="flex flex-col gap-2 rounded-xl border border-foreground/15 bg-background p-4 shadow-sm transition-colors hover:border-foreground/30">
        <div className="flex items-center justify-between gap-2 border-b border-foreground/10 pb-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-foreground/40">{tag}</span>
            <span className="font-mono text-xs font-bold text-foreground">{title}</span>
          </div>
          <span className="rounded bg-foreground/5 px-1.5 py-0.5 font-mono text-[10px] text-foreground/60">
            {module}
          </span>
        </div>

        <p className="font-mono text-xs leading-relaxed text-foreground/80">{check}</p>

        <div className="mt-1 flex items-center gap-1.5 font-mono text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
          <Check size={13} />
          <span>{yesLabel}</span>
        </div>
      </div>

      {/* Horizontal Connector Arrow (Desktop) */}
      <div className="hidden md:flex items-center justify-center gap-1 px-1 text-foreground/40 font-mono text-[10px]">
        <div className="h-px w-6 bg-foreground/20" />
        <span className="rounded bg-foreground/5 px-1.5 py-0.5 text-foreground/60 whitespace-nowrap">
          {noLabel}
        </span>
        <ArrowRight size={13} className="text-foreground/40" />
      </div>

      {/* Pass-Through / Bypass Card */}
      <div className="flex items-start gap-3 rounded-xl border border-foreground/10 bg-foreground/[0.02] p-3.5 opacity-75 transition-opacity hover:opacity-100">
        <ShieldCheck size={16} className="shrink-0 text-foreground/40 mt-0.5" />
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-semibold text-foreground/80">
              {passThroughTitle}
            </span>
            {/* Mobile-only badge */}
            <span className="md:hidden rounded bg-foreground/5 px-1.5 py-0.5 font-mono text-[9px] text-foreground/50">
              {noLabel}
            </span>
          </div>
          <p className="font-mono text-[10px] leading-relaxed text-foreground/55">
            {passThroughSubtitle}
          </p>
        </div>
      </div>
    </div>
  );
}
