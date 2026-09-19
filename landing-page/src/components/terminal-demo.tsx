"use client";

// Demo animada do fluxo real do boopaste: copiar uma imagem, apertar Cmd+V
// dentro do Ghostty, e ver o path do PNG aparecer no prompt — reflete
// exatamente o que src/daemon.rs + src/eventtap.rs fazem no dia a dia.
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/cn";
import { useLocale } from "@/components/locale-provider";

const STEPS = [
  { text: "", delay: 0 },
  { text: "⌘V", delay: 700 },
  { text: "⌘V\n/tmp/boopaste/2026-09-13-142301.png", delay: 900 },
];

function useTypingLoop(active: boolean) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    if (!active) return;
    const timers = STEPS.map((step, i) =>
      setTimeout(() => setFrame(i), step.delay + i * 1200)
    );
    const reset = setTimeout(
      () => setFrame(0),
      STEPS.reduce((a, s) => a + s.delay, 0) + 3200
    );
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(reset);
    };
  }, [active, frame === 0]);

  return STEPS[frame].text;
}

export function GhosttyDemo() {
  const { t } = useLocale();
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      threshold: 0.4,
    });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const output = useTypingLoop(visible);

  return (
    <div
      ref={ref}
      className="flex flex-col border border-foreground/20 bg-background/90 backdrop-blur-sm shadow-xs dark:shadow-none"
    >
      <TerminalChrome title="ghostty" status="online" statusLabel={t.terminals.ghostty.status} />
      <div className="h-40 whitespace-pre-wrap p-4 font-mono text-xs text-foreground/90">
        <span className="text-foreground/40 select-none">$ </span>
        {output}
        <span className="animate-pulse text-emerald-600 dark:text-emerald-400">▮</span>
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
        <span><span className="text-foreground/40 select-none">$ </span>{t.terminals.native.line1}</span>
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
        <span className="h-2.5 w-2.5 rounded-full bg-foreground/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-foreground/20" />
        <span className="h-2.5 w-2.5 rounded-full bg-foreground/20" />
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
