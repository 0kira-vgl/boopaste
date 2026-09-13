"use client";

import { useLocale } from "@/components/locale-provider";

export function Problem() {
  const { t } = useLocale();

  return (
    <section className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-24">
      <SectionLabel n="01" title={t.problem.label} />
      <p className="text-lg leading-relaxed text-foreground/90">{t.problem.p1}</p>
      <p className="text-lg leading-relaxed text-foreground/70">{t.problem.p2}</p>
    </section>
  );
}

export function SectionLabel({ n, title }: { n: string; title: string }) {
  return (
    <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-foreground/40">
      <span>{n}</span>
      <span className="h-px flex-1 bg-foreground/15" />
      <span>{title}</span>
    </div>
  );
}
