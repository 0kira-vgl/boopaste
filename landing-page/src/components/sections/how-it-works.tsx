import { SectionLabel } from "@/components/sections/problem";

const STEPS = [
  {
    title: "Global event tap",
    body:
      "A CGEventTap listens for ⌘V at the OS level. It never swallows the keystroke — paste still works everywhere, in every app.",
  },
  {
    title: "Frontmost app check",
    body:
      "Before doing anything, boopaste checks which app is focused via NSWorkspace. It only acts when that app is Ghostty (more terminals coming).",
  },
  {
    title: "Swap and restore",
    body:
      "If the clipboard holds an image, it's written to disk as a PNG and the clipboard is swapped to that file path — just before the paste event reaches the terminal — then restored right after.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="mx-auto flex max-w-2xl flex-col gap-10 px-6 py-24">
      <SectionLabel n="02" title="how it works" />
      <ol className="flex flex-col gap-8">
        {STEPS.map((step, i) => (
          <li key={step.title} className="flex gap-4">
            <span className="font-mono text-sm text-foreground/30">{i + 1}</span>
            <div className="flex flex-col gap-1">
              <h3 className="font-mono text-sm font-semibold text-foreground">{step.title}</h3>
              <p className="text-sm leading-relaxed text-foreground/60">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>
      <p className="text-sm leading-relaxed text-foreground/50">
        It runs as a LaunchAgent — a tiny background daemon, on at login, off
        with one command. No menu bar icon, no window, nothing to babysit.
      </p>
    </section>
  );
}
