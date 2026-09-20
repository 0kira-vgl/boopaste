"use client";

// Demo minimalista do fluxo real do boopaste: copiar uma imagem, apertar Cmd+V
// dentro do Ghostty ou do macOS Terminal, e ver o path do PNG aparecer no prompt — reflete
// exatamente o que src/daemon.rs + src/eventtap.rs fazem no dia a dia.
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { useLocale } from "@/components/locale-provider";

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
      timer = setTimeout(() => setPhase(1), 1200);
    } else if (phase === 1) {
      timer = setTimeout(() => setPhase(2), 700);
    } else if (phase === 2) {
      timer = setTimeout(() => setPhase(3), 1200);
    } else if (phase === 3) {
      timer = setTimeout(() => setPhase(0), 3400);
    }

    return () => clearTimeout(timer);
  }, [visible, phase]);

  const filePath = "/tmp/boopaste/clip_1789926581766.png";

  return (
    <div
      ref={ref}
      className="w-full flex flex-col rounded-lg border border-foreground/20 bg-background/90 backdrop-blur-md shadow-md shadow-black/5 dark:shadow-none transition-all duration-300 hover:border-foreground/30 overflow-hidden"
    >
      <TerminalChrome title={t.terminals.title} status="online" statusLabel={t.terminals.status} />
      <div className="flex min-h-[190px] sm:min-h-[210px] flex-col justify-start gap-2.5 p-5 sm:p-6 font-mono text-xs sm:text-sm leading-relaxed text-foreground/90 select-none">
        {/* Phase 0: Prompt inicial limpo */}
        {phase === 0 && (
          <div className="flex items-center gap-2">
            <span className="text-foreground/40 select-none">$</span>
            <span className="animate-pulse text-emerald-600 dark:text-emerald-400">▮</span>
          </div>
        )}

        {/* Phase 1: ⌘V pressionado */}
        {phase === 1 && (
          <div className="flex items-center gap-2">
            <span className="text-foreground/40 select-none">$</span>
            <span className="rounded border border-foreground/30 bg-foreground/10 px-1.5 py-0.5 text-xs text-foreground font-mono font-medium shadow-xs">
              ⌘V
            </span>
            <span className="animate-pulse text-emerald-600 dark:text-emerald-400">▮</span>
          </div>
        )}

        {/* Phase 2: Caminho colado no prompt */}
        {phase === 2 && (
          <div className="break-all">
            <span className="text-foreground/40 select-none">$ </span>
            <span className="text-foreground/95 font-medium">{filePath}</span>
            <span className="animate-pulse text-emerald-600 dark:text-emerald-400 ml-1">▮</span>
          </div>
        )}

        {/* Phase 3: Confirmação do daemon e novo prompt pronto */}
        {phase === 3 && (
          <div className="flex flex-col gap-2">
            <div className="break-all text-foreground/95 font-medium">
              <span className="text-foreground/40 select-none">$ </span>
              <span>{filePath}</span>
            </div>
            <div className="text-[11px] sm:text-xs text-foreground/60 flex items-center gap-1.5 pl-3 border-l-2 border-emerald-500/40 py-0.5">
              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">[boopaste]</span>
              <span>image/png → file path (142 KB)</span>
            </div>
            <div className="flex items-center gap-2 pt-1">
              <span className="text-foreground/40 select-none">$</span>
              <span className="animate-pulse text-emerald-600 dark:text-emerald-400">▮</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Alias for compatibility
export const GhosttyDemo = TerminalDemo;

function TerminalChrome({
  title,
  status,
  statusLabel,
}: {
  title: string;
  status: "online" | "soon";
  statusLabel: string;
}) {
  return (
    <div className="flex items-center justify-between border-b border-foreground/15 bg-foreground/[0.04] px-4 py-2.5">
      <div className="flex gap-2">
        <span className="h-3 w-3 rounded-full bg-[#ff5f56]/90 transition-opacity hover:opacity-100" />
        <span className="h-3 w-3 rounded-full bg-[#ffbd2e]/90 transition-opacity hover:opacity-100" />
        <span className="h-3 w-3 rounded-full bg-[#27c93f]/90 transition-opacity hover:opacity-100" />
      </div>
      <span className="font-mono text-xs uppercase tracking-widest text-foreground/60 font-medium">
        {title}
      </span>
      <span
        className={cn(
          "font-mono text-[11px] uppercase tracking-wider flex items-center gap-1.5",
          status === "online" ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-foreground/40"
        )}
      >
        <span className={cn("h-2 w-2 rounded-full", status === "online" ? "bg-emerald-500 animate-pulse" : "bg-foreground/30")} />
        {statusLabel}
      </span>
    </div>
  );
}
