import * as React from "react";
import { Kbd, KbdGroup } from "@/components/ui/kbd";

interface DocTextProps {
  text: string;
  className?: string;
  kbdSize?: "default" | "sm" | "xs";
}

// Regex to match shortcuts, code in backticks, commands, and paths
const TOKEN_REGEX =
  /(⌘\+?[CV]|Cmd\+[CV]|`[^`]+`|\bboopaste\s+(?:on|off|init|status|permissions|uninstall)\b|\/tmp\/boopaste\/clip_[^\s.,()]+|→)/g;

export function DocText({ text, className, kbdSize = "default" }: DocTextProps) {
  if (!text) return null;

  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = TOKEN_REGEX.exec(text)) !== null) {
    const matchedText = match[0];
    const matchIndex = match.index;

    // Text before match
    if (matchIndex > lastIndex) {
      parts.push(text.slice(lastIndex, matchIndex));
    }

    // Process matched token
    if (matchedText === "⌘C" || matchedText === "Cmd+C") {
      parts.push(
        <Kbd key={matchIndex} size={kbdSize} className="mx-0.5">
          ⌘C
        </Kbd>
      );
    } else if (matchedText === "⌘V" || matchedText === "Cmd+V") {
      parts.push(
        <Kbd key={matchIndex} size={kbdSize} className="mx-0.5">
          ⌘V
        </Kbd>
      );
    } else if (matchedText === "⌘+V") {
      parts.push(
        <KbdGroup key={matchIndex} className="mx-0.5">
          <Kbd size={kbdSize}>⌘</Kbd>
          <span className="text-[10px] text-foreground/40 font-mono">+</span>
          <Kbd size={kbdSize}>V</Kbd>
        </KbdGroup>
      );
    } else if (matchedText === "⌘+C") {
      parts.push(
        <KbdGroup key={matchIndex} className="mx-0.5">
          <Kbd size={kbdSize}>⌘</Kbd>
          <span className="text-[10px] text-foreground/40 font-mono">+</span>
          <Kbd size={kbdSize}>C</Kbd>
        </KbdGroup>
      );
    } else if (matchedText.startsWith("`") && matchedText.endsWith("`")) {
      const codeContent = matchedText.slice(1, -1);
      parts.push(
        <code
          key={matchIndex}
          className="rounded border border-foreground/15 bg-foreground/[0.05] px-1.5 py-0.5 font-mono text-[11px] text-foreground font-medium"
        >
          {codeContent}
        </code>
      );
    } else if (matchedText.startsWith("boopaste ")) {
      parts.push(
        <Kbd
          key={matchIndex}
          size={kbdSize}
          className="mx-0.5 px-1.5 font-semibold text-emerald-600 dark:text-emerald-400 border-emerald-500/30 bg-emerald-500/5 dark:bg-emerald-500/10"
        >
          {matchedText}
        </Kbd>
      );
    } else if (matchedText.startsWith("/tmp/boopaste/clip_")) {
      parts.push(
        <code
          key={matchIndex}
          className="rounded border border-emerald-500/25 bg-emerald-500/10 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-emerald-600 dark:text-emerald-400"
        >
          {matchedText}
        </code>
      );
    } else if (matchedText === "→") {
      parts.push(
        <span
          key={matchIndex}
          className="inline-block px-1 text-foreground/40 font-mono select-none"
        >
          →
        </span>
      );
    } else {
      parts.push(matchedText);
    }

    lastIndex = matchIndex + matchedText.length;
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex));
  }

  return <span className={className}>{parts}</span>;
}
