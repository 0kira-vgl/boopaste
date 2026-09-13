"use client";

import Link from "next/link";
import { GithubIcon } from "@/components/icons";
import { PixelBar } from "@/components/pixel-bar";
import { ThemeToggle } from "@/components/theme-toggle";
import { LocaleToggle } from "@/components/locale-toggle";
import { useLocale } from "@/components/locale-provider";
import { SITE } from "@/lib/site";

export function FloatingNav() {
  const { t } = useLocale();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-foreground/10 bg-background/80 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <Link href="#top" className="font-mono text-sm font-semibold tracking-tight text-foreground">
          boopaste_
        </Link>
        <div className="flex items-center gap-6 font-mono text-xs text-foreground/70">
          <Link href="#how-it-works" className="hidden hover:text-foreground sm:inline">
            {t.nav.howItWorks}
          </Link>
          <Link href="#terminals" className="hidden hover:text-foreground sm:inline">
            {t.nav.terminals}
          </Link>
          <Link href="#install" className="hidden hover:text-foreground sm:inline">
            {t.nav.install}
          </Link>
          <a
            href={SITE.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-foreground"
          >
            <GithubIcon size={14} />
            {t.nav.github}
          </a>
          <Link
            href="/preview"
            className="rounded border border-[#00FF66]/40 bg-[#00FF66]/10 px-2 py-0.5 text-[#00FF66] hover:bg-[#00FF66]/20 transition-colors"
          >
            preview
          </Link>
          <LocaleToggle />
          <ThemeToggle />
        </div>
      </nav>
      <PixelBar interactive />
    </header>
  );
}
