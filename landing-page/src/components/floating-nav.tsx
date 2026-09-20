"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { GithubIcon } from "@/components/icons";
import { ThemeToggle } from "@/components/theme-toggle";
import { LocaleToggle } from "@/components/locale-toggle";
import { useLocale } from "@/components/locale-provider";
import { BoopasteSymbol } from "@/components/brand/boopaste-brand";
import { SITE } from "@/lib/site";
import { cn } from "@/lib/cn";

export function FloatingNav() {
  const { t } = useLocale();
  const pathname = usePathname();
  const isDocs = pathname?.startsWith("/docs");

  function handleScrollTo(e: React.MouseEvent<HTMLAnchorElement>, targetId: string) {
    if (isDocs) return;
    e.preventDefault();
    const el = document.getElementById(targetId);
    if (el) {
      const yOffset = -70;
      const y = el.getBoundingClientRect().top + window.scrollY + yOffset;
      window.scrollTo({ top: y, behavior: "smooth" });
      window.history.pushState(null, "", `#${targetId}`);
    }
  }

  function handleLogoClick(e: React.MouseEvent<HTMLAnchorElement>) {
    if (isDocs) return;
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
    window.history.pushState(null, "", "/");
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-foreground/10 bg-background/80 backdrop-blur">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-6 py-3">
        <Link
          href="/"
          onClick={handleLogoClick}
          className="flex items-center gap-2.5 font-mono text-sm font-semibold tracking-tight text-foreground group"
        >
          <span className="transition-transform duration-200 group-hover:scale-110">
            <BoopasteSymbol size={28} />
          </span>
          <span>boopaste_</span>
          {isDocs && (
            <span className="rounded border border-foreground/20 bg-foreground/5 px-1.5 py-0.5 text-[10px] font-normal text-foreground/60">
              docs
            </span>
          )}
        </Link>
        <div className="flex items-center gap-5 font-mono text-xs text-foreground/70 sm:gap-6">
          <Link
            href={isDocs ? "/#how-it-works" : "#how-it-works"}
            onClick={(e) => handleScrollTo(e, "how-it-works")}
            className="hidden hover:text-foreground sm:inline transition-colors"
          >
            {t.nav.howItWorks}
          </Link>
          <Link
            href={isDocs ? "/#terminals" : "#terminals"}
            onClick={(e) => handleScrollTo(e, "terminals")}
            className="hidden hover:text-foreground sm:inline transition-colors"
          >
            {t.nav.terminals}
          </Link>
          <Link
            href={isDocs ? "/#install" : "#install"}
            onClick={(e) => handleScrollTo(e, "install")}
            className="hidden hover:text-foreground sm:inline transition-colors"
          >
            {t.nav.install}
          </Link>
          <Link
            href="/docs"
            className={cn(
              "transition-colors hover:text-foreground",
              isDocs
                ? "font-semibold text-foreground underline underline-offset-4 decoration-foreground/30"
                : "text-foreground/70"
            )}
          >
            {t.nav.docs}
          </Link>
          <a
            href={SITE.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            <GithubIcon size={14} />
            <span className="hidden md:inline">{t.nav.github}</span>
          </a>
          <LocaleToggle />
          <ThemeToggle />
        </div>
      </nav>
    </header>
  );
}
