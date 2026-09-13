import { SectionLabel } from "@/components/sections/problem";
import { GhosttyDemo, NativeTerminalCard } from "@/components/terminal-demo";

export function Terminals() {
  return (
    <section id="terminals" className="mx-auto flex max-w-2xl flex-col gap-10 px-6 py-24">
      <SectionLabel n="03" title="terminals" />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <GhosttyDemo />
        <NativeTerminalCard />
      </div>
      <p className="text-sm leading-relaxed text-foreground/50">
        Ghostty support ships today. Native macOS Terminal.app is next — the
        frontmost-app check in <code className="font-mono text-xs">frontmost.rs</code>{" "}
        is built to extend, not rewrite, for each new terminal.
      </p>
    </section>
  );
}
