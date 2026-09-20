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

      <div className="flex flex-col border border-foreground/20 bg-background/90 backdrop-blur-sm shadow-xs dark:shadow-none">
        <div className="flex items-center justify-between border-b border-foreground/15 bg-foreground/[0.03] px-3.5 py-2">
          <div className="flex gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f56]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#ffbd2e]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#27c93f]" />
          </div>
          <button
            onClick={copy}
            className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-foreground/50 hover:text-foreground transition-colors"
          >
            {copied ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
            <span className={copied ? "text-emerald-600 dark:text-emerald-400 font-medium" : ""}>
              {copied ? t.install.copied : t.install.copy}
            </span>
          </button>
        </div>
        <pre className={cn("whitespace-pre-wrap font-mono text-foreground/90", compact ? "p-3.5 text-[11px]" : "p-4 text-xs")}>
          {command.split("\n").map((line) => (
            <div key={line}>
              <span className="text-foreground/40 select-none">$ </span>
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
        active
          ? "bg-foreground text-background font-medium"
          : "text-foreground/50 hover:text-foreground hover:bg-foreground/[0.03]"
      )}
    >
      {children}
    </button>
  );
}
