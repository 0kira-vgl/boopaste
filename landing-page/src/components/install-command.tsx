"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { useLocale } from "@/components/locale-provider";
import { cn } from "@/lib/cn";

type Method = "brew" | "curl";

export function InstallCommand({ compact = false }: { compact?: boolean }) {
  const { t } = useLocale();
  const [method, setMethod] = useState<Method>("brew");
  const [copiedMethod, setCopiedMethod] = useState<Method | null>(null);

  const command = method === "brew" ? t.install.homebrewCmd : t.install.curlCmd;
  const copied = copiedMethod === method;

  function selectMethod(m: Method) {
    setMethod(m);
    setCopiedMethod(null);
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopiedMethod(method);
      setTimeout(() => setCopiedMethod((current) => (current === method ? null : current)), 1500);
    } catch {
      // clipboard indisponível (ex: http sem foco) — sem tratamento, não é crítico
    }
  }

  return (
    <div className={cn("flex flex-col gap-2", compact ? "w-full max-w-md" : "w-full")}>
      <div className="flex border border-foreground/20">
        <TabButton active={method === "brew"} onClick={() => selectMethod("brew")}>
          homebrew
        </TabButton>
        <TabButton active={method === "curl"} onClick={() => selectMethod("curl")}>
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
        <pre className={cn("whitespace-pre-wrap font-mono text-foreground/90", compact ? "p-3 text-[11px]" : "p-4 text-xs")}>
          {command.split("\n").map((line) => (
            <div key={line}>
              <span className="text-foreground/40">$ </span>
              {line}
            </div>
          ))}
        </pre>
      </div>
    </div>
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
