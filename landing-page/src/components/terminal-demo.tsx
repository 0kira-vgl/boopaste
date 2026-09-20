"use client";

// Demo minimalista do fluxo real do boopaste: copiar uma imagem, apertar Cmd+V
// dentro do Ghostty, e ver o path do PNG aparecer no prompt — reflete
// exatamente o que src/daemon.rs + src/eventtap.rs fazem no dia a dia.
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { useLocale } from "@/components/locale-provider";

export function GhosttyDemo() {
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

  const filePath = "/tmp/boopaste/2026-09-19-142301.png";

  return (
    <div
      ref={ref}
      className="flex flex-col border border-foreground/20 bg-background/90 backdrop-blur-sm shadow-xs dark:shadow-none"
    >
      <TerminalChrome title="ghostty" status="online" statusLabel={t.terminals.ghostty.status} />
      <div className="flex h-40 flex-col gap-1.5 p-4 font-mono text-xs leading-relaxed text-foreground/90 overflow-hidden select-none">
        {/* Phase 0: Prompt inicial limpo */}
        {phase === 0 && (
          <div>
            <span className="text-foreground/40 select-none">$ </span>
            <span className="animate-pulse text-emerald-600 dark:text-emerald-400">▮</span>
          </div>
        )}

        {/* Phase 1: ⌘V pressionado */}
        {phase === 1 && (
          <div>
            <span className="text-foreground/40 select-none">$ </span>
            <span className="rounded border border-foreground/30 bg-foreground/10 px-1 py-0.5 text-[11px] text-foreground font-mono">
              ⌘V
            </span>
            <span className="animate-pulse text-emerald-600 dark:text-emerald-400 ml-1">▮</span>
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
          <>
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
          </>
        )}
      </div>
    </div>
  );
}

export function NativeTerminalCard() {
  const { t } = useLocale();

  return (
    <div className="flex flex-col border border-foreground/20 bg-background/90 backdrop-blur-sm shadow-xs dark:shadow-none opacity-70">
      <TerminalChrome title="terminal" status="soon" statusLabel={t.terminals.native.status} />
      <div className="flex h-40 flex-col items-start gap-2 p-4 font-mono text-xs text-foreground/60">
        <span>
          <span className="text-foreground/40 select-none">$ </span>
          {t.terminals.native.line1}
        </span>
        <span className="text-foreground/40">{t.terminals.native.line2}</span>
      </div>
    </div>
  );
}

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
    <div className="flex items-center justify-between border-b border-foreground/15 bg-foreground/[0.03] px-3.5 py-2">
      <div className="flex gap-1.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
      </div>
      <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/50">
        {title}
      </span>
      <span
        className={cn(
          "font-mono text-[10px] uppercase tracking-widest flex items-center gap-1.5",
          status === "online" ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-foreground/40"
        )}
      >
        <span className={cn("h-1.5 w-1.5 rounded-full", status === "online" ? "bg-emerald-500 animate-pulse" : "bg-foreground/30")} />
        {statusLabel}
      </span>
    </div>
  );
}
