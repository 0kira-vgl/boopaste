"use client";

// Comandos de instalação ainda mockados: o tap `0kira-vgl/homebrew-boopaste`
// e o script `install.sh` não existem de verdade ainda (dependem de
// GitHub Releases/tags e do domínio boopaste.dev). Esse componente já fica
// pronto pra virar real — é só publicar o tap e o script no caminho certo.
import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { SectionLabel } from "@/components/sections/problem";
import { useLocale } from "@/components/locale-provider";
import { cn } from "@/lib/cn";

type Method = "brew" | "curl";

export function Install() {
  const { t } = useLocale();
  const [method, setMethod] = useState<Method>("brew");
  const [copied, setCopied] = useState(false);

  const command = method === "brew" ? t.install.homebrewCmd : t.install.curlCmd;

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // clipboard indisponível (ex: http sem foco) — sem tratamento, não é crítico
    }
  }

  return (
    <section id="install" className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-24">
      <SectionLabel n="04" title={t.install.label} />

      <div className="flex border border-foreground/20">
        <TabButton active={method === "brew"} onClick={() => setMethod("brew")}>
          homebrew
        </TabButton>
        <TabButton active={method === "curl"} onClick={() => setMethod("curl")}>
          curl
        </TabButton>
      </div>

      <div className="flex flex-col border border-foreground/20 bg-background">
        <div className="flex items-center justify-between border-b border-foreground/20 px-3 py-2">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-foreground/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-foreground/20" />
            <span className="h-2.5 w-2.5 rounded-full bg-foreground/20" />
          </div>
          <button
            onClick={copy}
            className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-foreground/50 hover:text-foreground"
          >
            {copied ? <Check size={12} /> : <Copy size={12} />}
            {copied ? t.install.copied : t.install.copy}
          </button>
        </div>
        <pre className="whitespace-pre-wrap p-4 font-mono text-xs text-foreground/90">
          {command.split("\n").map((line) => (
            <div key={line}>
              <span className="text-foreground/40">$ </span>
              {line}
            </div>
          ))}
        </pre>
      </div>

      <p className="font-mono text-[11px] text-foreground/40">{t.install.note}</p>
    </section>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex-1 px-4 py-2 font-mono text-xs uppercase tracking-widest transition-colors",
        active ? "bg-foreground text-background" : "text-foreground/50 hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}
