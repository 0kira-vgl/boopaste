"use client";

import { SectionLabel } from "@/components/sections/problem";
import { TerminalDemo } from "@/components/terminal-demo";
import { useLocale } from "@/components/locale-provider";
import { DistortText } from "@/components/distort-text";

export function Terminals() {
  const { t } = useLocale();

  return (
    <section id="terminals" className="mx-auto flex max-w-2xl flex-col gap-10 px-6 py-24 scroll-mt-20">
      <SectionLabel n="03" title={t.terminals.label} />
      <div className="w-full">
        <TerminalDemo />
      </div>
      <p className="text-sm leading-relaxed text-foreground/50">
        <DistortText>{t.terminals.closingPre}</DistortText>{" "}
        <code className="rounded border border-foreground/15 bg-foreground/5 px-1.5 py-0.5 font-mono text-xs text-foreground/80">
          frontmost.rs
        </code>{" "}
        <DistortText>{t.terminals.closingPost}</DistortText>
      </p>
    </section>
  );
}
