"use client";

// Comandos de instalação reais: o tap `0kira-vgl/homebrew-boopaste` e o
// `install.sh` (servido em `public/install.sh`, ver landing-page/public)
// dependem das GitHub Releases publicadas pelo workflow
// `.github/workflows/release.yml`. Sem domínio próprio ainda, o script é
// servido direto pela URL da Vercel.
import { SectionLabel } from "@/components/sections/problem";
import { useLocale } from "@/components/locale-provider";
import { InstallCommand } from "@/components/install-command";
import { DistortText } from "@/components/distort-text";

export function Install() {
  const { t } = useLocale();

  return (
    <section id="install" className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-24 scroll-mt-20">
      <SectionLabel n="04" title={t.install.label} />

      <InstallCommand />

      <DistortText className="font-mono text-[11px] text-foreground/40">{t.install.note}</DistortText>
    </section>
  );
}
