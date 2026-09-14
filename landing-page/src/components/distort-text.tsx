"use client";

import { Fragment, useEffect, useRef } from "react";
import { cn } from "@/lib/cn";

interface DistortTextProps {
  children: string;
  className?: string;
  /** Alcance do efeito em px e intensidade do deslocamento — mais baixo em
   * textos longos de leitura pra não atrapalhar, mais alto em destaques. */
  radius?: number;
  strength?: number;
}

// Sutil por padrão — texto de leitura não pode "fugir" muito do cursor.
// A Hero usa valores maiores explicitamente pra ser mais expressiva.
const DEFAULT_RADIUS = 36;
const DEFAULT_STRENGTH = 6;

// Efeito magnético: cada caractere se afasta fisicamente do cursor quando ele
// chega perto, e volta à posição original quando o cursor se afasta.
export function DistortText({
  children,
  className,
  radius = DEFAULT_RADIUS,
  strength = DEFAULT_STRENGTH,
}: DistortTextProps) {
  const charRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const centers = useRef<{ x: number; y: number }[]>([]);

  function measure() {
    centers.current = charRefs.current.map((el) => {
      if (!el) return { x: 0, y: 0 };
      const rect = el.getBoundingClientRect();
      return { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    });
  }

  useEffect(() => {
    measure();
    let raf = 0;
    const scheduleMeasure = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(measure);
    };
    window.addEventListener("resize", scheduleMeasure);
    window.addEventListener("scroll", scheduleMeasure, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", scheduleMeasure);
      window.removeEventListener("scroll", scheduleMeasure);
    };
  }, [children]);

  function onMouseMove(e: React.MouseEvent<HTMLSpanElement>) {
    const { clientX, clientY } = e;
    charRefs.current.forEach((el, i) => {
      if (!el) return;
      const c = centers.current[i];
      if (!c) return;
      const dx = c.x - clientX;
      const dy = c.y - clientY;
      const dist = Math.hypot(dx, dy);

      if (dist < radius) {
        const force = (1 - dist / radius) ** 2 * strength;
        const angle = Math.atan2(dy, dx);
        const tx = Math.cos(angle) * force;
        const ty = Math.sin(angle) * force;
        el.style.transform = `translate(${tx.toFixed(1)}px, ${ty.toFixed(1)}px) rotate(${(tx / 4).toFixed(1)}deg)`;
      } else {
        el.style.transform = "";
      }
    });
  }

  function onMouseLeave() {
    charRefs.current.forEach((el) => {
      if (el) el.style.transform = "";
    });
  }

  const words = children.split(" ");
  let charIndex = 0;

  return (
    <span
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      className={cn("inline-block", className)}
    >
      {words.map((word, wi) => (
        <Fragment key={wi}>
          <span className="inline-block whitespace-nowrap">
            {word.split("").map((char) => {
              const i = charIndex++;
              return (
                <span
                  key={i}
                  ref={(el) => {
                    charRefs.current[i] = el;
                  }}
                  className="inline-block transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] will-change-transform"
                >
                  {char}
                </span>
              );
            })}
          </span>
          {wi < words.length - 1 ? " " : ""}
        </Fragment>
      ))}
    </span>
  );
}
