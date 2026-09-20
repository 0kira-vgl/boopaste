"use client";

import Link from "next/link";
import { GithubIcon } from "@/components/icons";
import { useLocale } from "@/components/locale-provider";
import { SITE } from "@/lib/site";

export function SiteFooter() {
  const { t } = useLocale();

  return (
    <footer className="border-t border-foreground/10 px-6 py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-4 font-mono text-xs text-foreground/60 sm:flex-row sm:items-center">
        <span>
          {SITE.name} · {t.footer.tagline}
        </span>
        <div className="flex items-center gap-6">
          <Link href="/docs" className="hover:text-foreground transition-colors">
            {t.nav.docs}
          </Link>
          <a
            href={SITE.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:text-foreground transition-colors"
          >
            <GithubIcon size={14} />
            {SITE.githubUrl.replace("https://", "")}
          </a>
        </div>
      </div>
    </footer>
  );
}
