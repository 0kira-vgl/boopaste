"use client";

import Link from "next/link";
import { ArrowLeft, Check, Terminal, Shield, Cpu, Wrench } from "lucide-react";
import { FloatingNav } from "@/components/floating-nav";
import { SiteFooter } from "@/components/site-footer";
import { useLocale } from "@/components/locale-provider";
import { DocCodeBlock } from "@/components/doc-code-block";
import { BoopasteSymbol } from "@/components/brand/boopaste-brand";

export default function DocsPage() {
  const { t } = useLocale();
  const docs = t.docs;

  return (
    <div className="relative flex min-h-screen flex-col bg-background text-foreground selection:bg-foreground selection:text-background">
      <FloatingNav />

      <div className="mx-auto flex w-full max-w-6xl flex-1 px-6 pt-24 pb-20">
        {/* Desktop Sidebar / Table of Contents */}
        <aside className="hidden w-64 shrink-0 lg:block">
          <div className="sticky top-24 flex flex-col gap-6 pr-8">
            <Link
              href="/"
              className="inline-flex items-center gap-2 font-mono text-xs text-foreground/60 transition-colors hover:text-foreground"
            >
              <ArrowLeft size={14} />
              <span>{docs.backToHome}</span>
            </Link>

            <div className="flex flex-col gap-2 border-l border-foreground/15 pl-4">
              <span className="font-mono text-[10px] uppercase tracking-widest text-foreground/40">
                {docs.tocTitle}
              </span>
              <nav className="flex flex-col gap-2 pt-1 font-mono text-xs">
                {docs.sections.map((section) => (
                  <a
                    key={section.id}
                    href={`#${section.id}`}
                    className="flex items-center gap-2 text-foreground/70 transition-colors hover:text-foreground"
                  >
                    <span className="text-[10px] text-foreground/30">{section.tag}</span>
                    <span className="truncate">{section.title}</span>
                  </a>
                ))}
              </nav>
            </div>

            <div className="rounded-lg border border-foreground/10 bg-foreground/[0.02] p-3 font-mono text-[11px] text-foreground/60 leading-relaxed">
              <span className="text-foreground font-semibold">Ghostty only:</span> macOS Apple Silicon arm64 native.
            </div>
          </div>
        </aside>

        {/* Main Documentation Body */}
        <main className="flex min-w-0 flex-1 flex-col gap-16 lg:pl-4">
          {/* Header Banner */}
          <header className="flex flex-col gap-4 border-b border-foreground/10 pb-10">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded border border-foreground/20 bg-foreground/5 px-2 py-0.5 font-mono text-xs text-foreground/70">
                {docs.badge}
              </span>
              <span className="flex items-center gap-1.5 font-mono text-xs text-emerald-600 dark:text-emerald-400">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                MIT License
              </span>
            </div>

            <div className="flex items-center gap-3">
              <BoopasteSymbol size={32} />
              <h1 className="font-mono text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
                {docs.title}
              </h1>
            </div>

            <p className="max-w-2xl font-mono text-sm leading-relaxed text-foreground/70 sm:text-base">
              {docs.subtitle}
            </p>

            <div className="mt-2 rounded-xl border border-foreground/15 bg-foreground/[0.02] p-5">
              <p className="font-mono text-xs leading-relaxed text-foreground/80 sm:text-sm">
                <span className="font-semibold text-foreground">TL;DR: </span>
                {docs.quickSummary}
              </p>
            </div>
          </header>

          {/* Section 01: Overview */}
          <section id="overview" className="flex scroll-mt-24 flex-col gap-6">
            <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-foreground/40">
              <span>01</span>
              <span className="h-px flex-1 bg-foreground/15" />
              <span>{docs.overview.tag}</span>
            </div>

            <h2 className="font-mono text-2xl font-bold text-foreground">
              {docs.overview.title}
            </h2>

            <div className="flex flex-col gap-4 text-sm leading-relaxed text-foreground/80">
              <p>{docs.overview.p1}</p>
              <p>{docs.overview.p2}</p>
            </div>

            {/* Before / After Box */}
            <div className="flex flex-col overflow-hidden rounded-xl border border-foreground/15">
              <div className="border-b border-foreground/10 bg-foreground/[0.03] px-4 py-2 font-mono text-xs font-semibold text-foreground">
                {docs.overview.problemBox.title}
              </div>
              <div className="grid grid-cols-1 divide-y divide-foreground/10 md:grid-cols-2 md:divide-x md:divide-y-0">
                <div className="flex flex-col gap-2 p-5 bg-rose-500/[0.03]">
                  <span className="font-mono text-xs font-semibold uppercase tracking-wider text-rose-600 dark:text-rose-400">
                    ✕ {docs.overview.problemBox.beforeTitle}
                  </span>
                  <p className="font-mono text-xs leading-relaxed text-foreground/70">
                    {docs.overview.problemBox.beforeBody}
                  </p>
                </div>
                <div className="flex flex-col gap-2 p-5 bg-emerald-500/[0.03]">
                  <span className="font-mono text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                    ✓ {docs.overview.problemBox.afterTitle}
                  </span>
                  <p className="font-mono text-xs leading-relaxed text-foreground/70">
                    {docs.overview.problemBox.afterBody}
                  </p>
                </div>
              </div>
            </div>

            {/* Design Tenets */}
            <div className="mt-4 flex flex-col gap-3">
              <h3 className="font-mono text-sm font-semibold uppercase tracking-wider text-foreground/80">
                {docs.overview.keyBenefitsTitle}
              </h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {docs.overview.keyBenefits.map((item) => (
                  <div
                    key={item.title}
                    className="flex flex-col gap-1.5 rounded-lg border border-foreground/10 bg-foreground/[0.01] p-4 transition-colors hover:border-foreground/25"
                  >
                    <span className="font-mono text-xs font-bold text-foreground">
                      {item.title}
                    </span>
                    <span className="text-xs leading-relaxed text-foreground/60">
                      {item.desc}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section 02: Pipeline */}
          <section id="how-it-works" className="flex scroll-mt-24 flex-col gap-6">
            <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-foreground/40">
              <span>02</span>
              <span className="h-px flex-1 bg-foreground/15" />
              <span>{docs.pipeline.tag}</span>
            </div>

            <h2 className="font-mono text-2xl font-bold text-foreground">
              {docs.pipeline.title}
            </h2>

            <p className="text-sm leading-relaxed text-foreground/70">
              {docs.pipeline.description}
            </p>

            {/* Step list */}
            <div className="flex flex-col divide-y divide-foreground/10 rounded-xl border border-foreground/15">
              {docs.pipeline.steps.map((step) => (
                <div key={step.num} className="flex flex-col gap-2 p-5 sm:flex-row sm:items-start sm:gap-5">
                  <span className="font-mono text-xs font-bold text-foreground/40 sm:pt-0.5">
                    {step.num}
                  </span>
                  <div className="flex flex-1 flex-col gap-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="font-mono text-sm font-semibold text-foreground">
                        {step.title}
                      </span>
                      <span className="rounded bg-foreground/5 px-2 py-0.5 font-mono text-[10px] text-foreground/60">
                        {step.code}
                      </span>
                    </div>
                    <p className="text-xs leading-relaxed text-foreground/70 sm:text-sm">
                      {step.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Flow diagram ASCII */}
            <div className="flex flex-col gap-2">
              <span className="font-mono text-xs uppercase tracking-wider text-foreground/50">
                {docs.pipeline.flowDiagramTitle}
              </span>
              <pre className="overflow-x-auto rounded-xl border border-foreground/15 bg-foreground/[0.02] p-4 font-mono text-[11px] leading-relaxed text-foreground/80 sm:text-xs">
                {docs.pipeline.flowDiagramAscii}
              </pre>
            </div>
          </section>

          {/* Section 03: CLI Commands */}
          <section id="cli-commands" className="flex scroll-mt-24 flex-col gap-6">
            <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-foreground/40">
              <span>03</span>
              <span className="h-px flex-1 bg-foreground/15" />
              <span>{docs.commands.tag}</span>
            </div>

            <div className="flex flex-col gap-1">
              <h2 className="font-mono text-2xl font-bold text-foreground">
                {docs.commands.title}
              </h2>
              <p className="text-sm leading-relaxed text-foreground/70">
                {docs.commands.description}
              </p>
            </div>

            <div className="flex flex-col gap-5">
              {docs.commands.items.map((cmd) => (
                <div
                  key={cmd.name}
                  className="flex flex-col overflow-hidden rounded-xl border border-foreground/15 bg-background transition-colors hover:border-foreground/30"
                >
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-foreground/10 bg-foreground/[0.02] px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Terminal size={15} className="text-emerald-500" />
                      <code className="font-mono text-sm font-bold text-foreground">
                        {cmd.syntax}
                      </code>
                    </div>
                    <span className="font-mono text-[11px] text-foreground/50">
                      subcommand: {cmd.name}
                    </span>
                  </div>

                  <div className="flex flex-col gap-3 p-5">
                    <p className="font-mono text-xs font-semibold text-foreground/90">
                      {cmd.summary}
                    </p>
                    <p className="text-xs leading-relaxed text-foreground/70">
                      <span className="font-semibold text-foreground">macOS action: </span>
                      {cmd.behavior}
                    </p>

                    <div className="mt-1 flex flex-col gap-1.5 rounded-lg border border-foreground/10 bg-foreground/[0.01] p-3.5">
                      <span className="font-mono text-[10px] uppercase tracking-wider text-foreground/40">
                        Under the hood:
                      </span>
                      <ul className="flex flex-col gap-1 font-mono text-xs text-foreground/70">
                        {cmd.details.map((detail, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-foreground/30">•</span>
                            <span>{detail}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="pt-1">
                      <DocCodeBlock code={cmd.syntax} language="bash" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 04: Rust Modules Architecture */}
          <section id="architecture" className="flex scroll-mt-24 flex-col gap-6">
            <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-foreground/40">
              <span>04</span>
              <span className="h-px flex-1 bg-foreground/15" />
              <span>{docs.architecture.tag}</span>
            </div>

            <div className="flex flex-col gap-1">
              <h2 className="font-mono text-2xl font-bold text-foreground">
                {docs.architecture.title}
              </h2>
              <p className="text-sm leading-relaxed text-foreground/70">
                {docs.architecture.description}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {docs.architecture.modules.map((mod) => (
                <div
                  key={mod.file}
                  className="flex flex-col gap-3 rounded-xl border border-foreground/15 bg-foreground/[0.01] p-5 transition-colors hover:border-foreground/30"
                >
                  <div className="flex items-center justify-between gap-2 border-b border-foreground/10 pb-3">
                    <div className="flex items-center gap-2">
                      <Cpu size={15} className="text-foreground/60" />
                      <code className="font-mono text-xs font-bold text-foreground">
                        {mod.file}
                      </code>
                    </div>
                    <span className="rounded bg-foreground/5 px-2 py-0.5 font-mono text-[10px] text-foreground/50">
                      {mod.role}
                    </span>
                  </div>

                  <p className="text-xs leading-relaxed text-foreground/80">
                    {mod.description}
                  </p>

                  <div className="mt-auto flex flex-col gap-1 pt-2">
                    <span className="font-mono text-[10px] uppercase tracking-wider text-foreground/40">
                      Key Highlights:
                    </span>
                    <ul className="flex flex-col gap-1 font-mono text-[11px] text-foreground/60">
                      {mod.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-emerald-500">›</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 05: Permissions & Security */}
          <section id="permissions" className="flex scroll-mt-24 flex-col gap-6">
            <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-foreground/40">
              <span>05</span>
              <span className="h-px flex-1 bg-foreground/15" />
              <span>{docs.permissions.tag}</span>
            </div>

            <div className="flex flex-col gap-1">
              <h2 className="font-mono text-2xl font-bold text-foreground">
                {docs.permissions.title}
              </h2>
              <p className="text-sm leading-relaxed text-foreground/70">
                {docs.permissions.description}
              </p>
            </div>

            {/* Auditability Callout */}
            <div className="flex items-start gap-4 rounded-xl border border-emerald-500/30 bg-emerald-500/[0.04] p-5">
              <Shield size={22} className="shrink-0 text-emerald-500 mt-0.5" />
              <div className="flex flex-col gap-1.5">
                <h3 className="font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  {docs.permissions.calloutTitle}
                </h3>
                <p className="font-mono text-xs leading-relaxed text-foreground/80">
                  {docs.permissions.calloutBody}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {docs.permissions.points.map((pt) => (
                <div
                  key={pt.title}
                  className="flex flex-col gap-2 rounded-xl border border-foreground/10 bg-foreground/[0.01] p-5"
                >
                  <span className="font-mono text-xs font-bold text-foreground">
                    {pt.title}
                  </span>
                  <p className="text-xs leading-relaxed text-foreground/70">
                    {pt.desc}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 06: Installation */}
          <section id="installation" className="flex scroll-mt-24 flex-col gap-6">
            <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-foreground/40">
              <span>06</span>
              <span className="h-px flex-1 bg-foreground/15" />
              <span>{docs.installation.tag}</span>
            </div>

            <div className="flex flex-col gap-1">
              <h2 className="font-mono text-2xl font-bold text-foreground">
                {docs.installation.title}
              </h2>
              <p className="text-sm leading-relaxed text-foreground/70">
                {docs.installation.description}
              </p>
            </div>

            {/* Requirements list */}
            <div className="rounded-xl border border-foreground/15 bg-foreground/[0.02] p-5">
              <span className="font-mono text-xs font-bold uppercase tracking-wider text-foreground">
                {docs.installation.requirementsTitle}
              </span>
              <ul className="mt-3 flex flex-col gap-2 font-mono text-xs text-foreground/75">
                {docs.installation.requirements.map((req, i) => (
                  <li key={i} className="flex items-center gap-2">
                    <Check size={14} className="text-emerald-500" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Steps */}
            <div className="flex flex-col gap-5">
              {docs.installation.steps.map((step) => (
                <div key={step.title} className="flex flex-col gap-2">
                  <span className="font-mono text-xs font-semibold text-foreground">
                    {step.title}
                  </span>
                  <DocCodeBlock code={step.command} language="bash" />
                  <span className="font-mono text-[11px] text-foreground/50">
                    {step.notes}
                  </span>
                </div>
              ))}
            </div>
          </section>

          {/* Section 07: Troubleshooting */}
          <section id="troubleshooting" className="flex scroll-mt-24 flex-col gap-6">
            <div className="flex items-center gap-3 font-mono text-xs uppercase tracking-widest text-foreground/40">
              <span>07</span>
              <span className="h-px flex-1 bg-foreground/15" />
              <span>{docs.troubleshooting.tag}</span>
            </div>

            <div className="flex flex-col gap-1">
              <h2 className="font-mono text-2xl font-bold text-foreground">
                {docs.troubleshooting.title}
              </h2>
              <p className="text-sm leading-relaxed text-foreground/70">
                {docs.troubleshooting.description}
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {docs.troubleshooting.items.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col gap-2.5 rounded-xl border border-foreground/15 bg-foreground/[0.01] p-5"
                >
                  <div className="flex items-center gap-2">
                    <Wrench size={15} className="text-foreground/60" />
                    <span className="font-mono text-xs font-bold text-foreground">
                      {item.issue}
                    </span>
                  </div>
                  <p className="text-xs text-foreground/70">{item.solution}</p>
                  {item.code && <DocCodeBlock code={item.code} language="bash" />}
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>

      <SiteFooter />
    </div>
  );
}
