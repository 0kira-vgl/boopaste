"use client";

import { SectionLabel } from "@/components/sections/problem";
import { GhosttyDemo, NativeTerminalCard } from "@/components/terminal-demo";
import { useLocale } from "@/components/locale-provider";

export function Terminals() {
  const { t } = useLocale();

  return (
    <section id="terminals" className="mx-auto flex max-w-2xl flex-col gap-10 px-6 py-24">
      <SectionLabel n="03" title={t.terminals.label} />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <GhosttyDemo />
        <NativeTerminalCard />
      </div>
      <p className="text-sm leading-relaxed text-foreground/50">
        {t.terminals.closingPre} <code className="font-mono text-xs">frontmost.rs</code>{" "}
        {t.terminals.closingPost}
      </p>
    </section>
  );
}
