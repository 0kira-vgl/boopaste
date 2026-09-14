"use client";

// Comandos de instalação ainda mockados: o tap `0kira-vgl/homebrew-boopaste`
// e o script `install.sh` não existem de verdade ainda (dependem de
// GitHub Releases/tags e do domínio boopaste.dev). Esse componente já fica
// pronto pra virar real — é só publicar o tap e o script no caminho certo.
import { SectionLabel } from "@/components/sections/problem";
import { useLocale } from "@/components/locale-provider";
import { InstallCommand } from "@/components/install-command";
import { DistortText } from "@/components/distort-text";

export function Install() {
  const { t } = useLocale();

  return (
    <section id="install" className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-24">
      <SectionLabel n="04" title={t.install.label} />

      <InstallCommand />

      <DistortText className="font-mono text-[11px] text-foreground/40">{t.install.note}</DistortText>
    </section>
  );
}
