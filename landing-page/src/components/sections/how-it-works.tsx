"use client";

import { SectionLabel } from "@/components/sections/problem";
import { useLocale } from "@/components/locale-provider";
import { DistortText } from "@/components/distort-text";

export function HowItWorks() {
  const { t } = useLocale();

  return (
    <section id="how-it-works" className="mx-auto flex max-w-2xl flex-col gap-10 px-6 py-24">
      <SectionLabel n="02" title={t.howItWorks.label} />
      <ol className="flex flex-col gap-8">
        {t.howItWorks.steps.map((step, i) => (
          <li key={step.title} className="flex gap-4">
            <span className="font-mono text-sm text-foreground/30">{i + 1}</span>
            <div className="flex flex-col gap-1">
              <h3 className="font-mono text-sm font-semibold text-foreground">
                <DistortText>{step.title}</DistortText>
              </h3>
              <DistortText className="text-sm leading-relaxed text-foreground/60">{step.body}</DistortText>
            </div>
          </li>
        ))}
      </ol>
      <DistortText className="text-sm leading-relaxed text-foreground/50">{t.howItWorks.closing}</DistortText>
    </section>
  );
}
