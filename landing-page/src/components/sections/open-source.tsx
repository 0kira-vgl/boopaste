import { GithubIcon } from "@/components/icons";
import { SectionLabel } from "@/components/sections/problem";
import { SITE } from "@/lib/site";

export function OpenSource() {
  return (
    <section className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-24">
      <SectionLabel n="04" title="why open source" />
      <p className="text-lg leading-relaxed text-foreground/90">
        boopaste hooks into global keystrokes and reads your clipboard. That
        requires Accessibility / Input Monitoring permission on macOS — a
        real trust ask. The only honest answer to &quot;why should I grant
        this&quot; is: read the code yourself.
      </p>
      <p className="text-lg leading-relaxed text-foreground/70">
        Every line that touches the event tap or the clipboard is public,
        MIT-licensed, and small enough to actually audit in a few minutes.
      </p>
      <a
        href={SITE.githubUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 flex w-fit items-center gap-2 border border-foreground/30 px-4 py-2 font-mono text-sm text-foreground transition-colors hover:border-foreground hover:bg-foreground hover:text-background"
      >
        <GithubIcon size={16} />
        view source on GitHub
      </a>
    </section>
  );
}
