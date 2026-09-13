"use client";

import { GithubIcon } from "@/components/icons";
import { SectionLabel } from "@/components/sections/problem";
import { useLocale } from "@/components/locale-provider";
import { SITE } from "@/lib/site";

export function OpenSource() {
  const { t } = useLocale();

  return (
    <section className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-24">
      <SectionLabel n="05" title={t.openSource.label} />
      <p className="text-lg leading-relaxed text-foreground/90">{t.openSource.p1}</p>
      <p className="text-lg leading-relaxed text-foreground/70">{t.openSource.p2}</p>
      <a
        href={SITE.githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 flex w-fit items-center gap-2 border border-foreground/30 px-4 py-2 font-mono text-sm text-foreground transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
      >
        <GithubIcon size={16} />
        {t.openSource.cta}
      </a>
    </section>
  );
}
