"use client";

// Demo minimalista do fluxo real do boopaste: copiar uma imagem, apertar Cmd+V
// dentro do Ghostty ou do macOS Terminal, e ver o path do PNG aparecer no prompt.
import { useEffect, useRef, useState } from "react";
import { Image as ImageIcon } from "lucide-react";
import { useLocale } from "@/components/locale-provider";
import { Kbd } from "@/components/ui/kbd";

export function TerminalDemo() {
  const { t } = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [phase, setPhase] = useState<0 | 1 | 2 | 3>(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;

    let timer: NodeJS.Timeout;

    if (phase === 0) {
      timer = setTimeout(() => setPhase(1), 1400);
    } else if (phase === 1) {
      timer = setTimeout(() => setPhase(2), 1400);
    } else if (phase === 2) {
      timer = setTimeout(() => setPhase(3), 1500);
    } else if (phase === 3) {
      timer = setTimeout(() => setPhase(0), 3200);
    }

    return () => clearTimeout(timer);
  }, [visible, phase]);

  const filePath = "/tmp/boopaste/clip_1789926581766.png";

  return (
    <div
      ref={ref}
      className="w-full flex flex-col border border-foreground/20 bg-background/90 backdrop-blur-sm shadow-xs dark:shadow-none"
    >
      <TerminalChrome title={t.terminals.title} />
      <div className="flex h-44 sm:h-48 flex-col justify-start gap-2 p-4 sm:p-5 font-mono text-xs sm:text-sm leading-relaxed text-foreground/90 select-none overflow-hidden">
        {/* Phase 0: Prompt inicial limpo */}
        {phase === 0 && (
          <div>
            <span className="text-foreground/40 select-none">$ </span>
            <span className="animate-pulse text-emerald-600 dark:text-emerald-400">▮</span>
          </div>
        )}

        {/* Phase 1: ⌘V pressionado com imagem do clipboard */}
        {phase === 1 && (
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-foreground/40 select-none">$ </span>
            <Kbd size="sm">⌘V</Kbd>
            <span className="rounded border border-foreground/20 bg-foreground/5 px-1.5 py-0.5 text-[11px] text-foreground/80 font-mono inline-flex items-center gap-1.5">
              <ImageIcon className="h-3 w-3 text-emerald-600 dark:text-emerald-400 shrink-0" strokeWidth={2} />
              <span>image/png</span>
              <span className="text-foreground/30">·</span>
              <span className="opacity-60">142 KB</span>
            </span>
            <span className="animate-pulse text-emerald-600 dark:text-emerald-400">▮</span>
          </div>
        )}

        {/* Phase 2: Caminho colado no prompt */}
        {phase === 2 && (
          <div className="break-all">
            <span className="text-foreground/40 select-none">$ </span>
            <span className="text-foreground/90">{filePath}</span>
            <span className="animate-pulse text-emerald-600 dark:text-emerald-400 ml-0.5">▮</span>
          </div>
        )}

        {/* Phase 3: Confirmação do daemon e novo prompt pronto */}
        {phase === 3 && (
          <div className="flex flex-col gap-1.5">
            <div className="break-all text-foreground/90">
              <span className="text-foreground/40 select-none">$ </span>
              <span>{filePath}</span>
            </div>
            <div className="text-[11px] text-foreground/50">
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">[boopaste] </span>
              <span>image/png → file path (142 KB)</span>
            </div>
            <div className="pt-0.5">
              <span className="text-foreground/40 select-none">$ </span>
              <span className="animate-pulse text-emerald-600 dark:text-emerald-400">▮</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Alias para compatibilidade
export const GhosttyDemo = TerminalDemo;
export const NativeTerminalCard = TerminalDemo;

function TerminalChrome({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between border-b border-foreground/15 bg-foreground/[0.03] px-3.5 py-2">
      <div className="flex gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
      </div>
      <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/50">
        {title}
      </span>
      <div className="w-10" />
    </div>
  );
}
