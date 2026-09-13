export function Problem() {
  return (
    <section className="mx-auto flex max-w-2xl flex-col gap-6 px-6 py-24">
      <SectionLabel n="01" title="the problem" />
      <p className="text-lg leading-relaxed text-foreground/90">
        Paste an image into most terminals and you get nothing useful — some
        terminals silently drop it, others dump raw binary or a base64 blob
        into your shell. You end up dragging the file from Finder, or saving
        it manually, just to get a path you can type into a command.
      </p>
      <p className="text-lg leading-relaxed text-foreground/70">
        boopaste exists because that round-trip is friction that shouldn&apos;t
        exist. If it&apos;s on your clipboard, it should paste — as a path,
        like everything else in a terminal.
      </p>
    </section>
  );
}

export function SectionLabel({ n, title }: { n: string; title: string }) {
  return (
    <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-foreground/40">
      <span>{n}</span>
      <span className="h-px flex-1 bg-foreground/15" />
      <span>{title}</span>
    </div>
  );
}
