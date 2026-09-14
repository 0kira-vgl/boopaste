"use client";

import { LivingSky } from "@/components/living-sky";

/**
 * Background permanente e oficial da Landing Page:
 * Céu Vivo 3D (LivingSky) com Starfield cintilante em shaders GPU,
 * CursorGlow reativo e o enxame ectoplasmático Three.js scroll-driven.
 */
export function ScrollVideoBackground() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-background">
      <LivingSky />
    </div>
  );
}
