import * as React from "react";
import { cn } from "@/lib/cn";

export interface KbdProps extends React.ComponentProps<"kbd"> {
  size?: "default" | "sm" | "xs";
}

export function Kbd({
  className,
  size = "default",
  children,
  ...props
}: KbdProps) {
  return (
    <kbd
      data-slot="kbd"
      className={cn(
        "pointer-events-none inline-flex select-none items-center justify-center gap-0.5 font-mono font-medium",
        "rounded-[4px] border border-foreground/20 bg-foreground/[0.06] text-foreground/90",
        "shadow-[0_1px_0_1px_rgba(0,0,0,0.06)] dark:border-foreground/20 dark:bg-foreground/[0.09] dark:text-foreground/90 dark:shadow-[0_1px_0_1px_rgba(255,255,255,0.08)]",
        "transition-colors align-baseline",
        size === "xs" && "h-4 min-w-[16px] px-1 text-[9px]",
        size === "sm" && "h-4.5 min-w-[18px] px-1 text-[10px]",
        size === "default" && "h-5 min-w-[20px] px-1.5 text-[11px]",
        className
      )}
      {...props}
    >
      {children}
    </kbd>
  );
}

export function KbdGroup({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="kbd-group"
      className={cn("inline-flex items-center gap-1 align-baseline", className)}
      {...props}
    >
      {children}
    </div>
  );
}
