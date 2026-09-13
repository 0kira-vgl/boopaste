"use client";

import { GithubIcon } from "@/components/icons";
import { useLocale } from "@/components/locale-provider";
import { SITE } from "@/lib/site";

export function SiteFooter() {
  const { t } = useLocale();

  return (
    <footer className="border-t border-foreground/10 px-6 py-10">
      <div className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-4 font-mono text-xs text-foreground/60 sm:flex-row sm:items-center">
        <span>
          {SITE.name} — {t.footer.tagline}
        </span>
        <a
          href={SITE.githubUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1.5 hover:text-foreground"
        >
          <GithubIcon size={14} />
          {SITE.githubUrl.replace("https://", "")}
        </a>
      </div>
    </footer>
  );
}
