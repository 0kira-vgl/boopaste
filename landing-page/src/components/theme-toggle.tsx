"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("boopaste-theme", next ? "dark" : "light");
  }

  return (
    <button
      onClick={toggle}
      aria-label="Alternar tema"
      className="flex h-8 w-8 items-center justify-center border border-foreground/20 text-foreground transition-colors hover:border-foreground/60 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-foreground/50"
    >
      {dark ? <Sun size={14} /> : <Moon size={14} />}
    </button>
  );
}
