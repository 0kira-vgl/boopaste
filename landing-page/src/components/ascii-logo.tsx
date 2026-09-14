import { BoopasteSymbol } from "@/components/brand/boopaste-brand";

export function AsciiLogo({ className }: { className?: string }) {
  return (
    <div className={`relative mx-auto flex flex-col items-center gap-4 ${className ?? ""}`}>
      {/* Símbolo Oficial Boo Spark (✦) com glow suave */}
      <div className="group relative flex items-center justify-center p-3 transition-transform duration-300 hover:scale-110">
        <div className="absolute -inset-2 rounded-2xl bg-[#00FF66]/15 blur-xl opacity-75 group-hover:opacity-100 transition-opacity" />
        <div className="relative">
          <BoopasteSymbol size={72} />
        </div>
      </div>

      {/* Wordmark limpo e minimalista */}
      <div className="font-mono text-2xl font-bold tracking-tight text-foreground flex items-center gap-1.5">
        <span>boopaste</span>
        <span className="h-5 w-2 bg-[#00FF66] animate-pulse inline-block" />
      </div>
    </div>
  );
}
