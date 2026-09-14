import React from "react";

export type LogoConceptId = "spark-boo";

export interface LogoConcept {
  id: LogoConceptId;
  number: string;
  name: string;
  concept: string;
  description: string;
}

export const OFFICIAL_LOGO: LogoConcept = {
  id: "spark-boo",
  number: "01",
  name: "Boo Spark (✦)",
  concept: "Fantasma + Centelha Estelar",
  description:
    "Silhueta suave de fantasma com uma centelha estelar de 4 pontas (✦) no topo direito, representando o momento em que a imagem é gerada e colada instantaneamente.",
};

export const LOGO_CONCEPTS: LogoConcept[] = [OFFICIAL_LOGO];

export interface SymbolProps extends React.SVGProps<SVGSVGElement> {
  size?: number | string;
  variant?: string;
}

/**
 * BoopasteSymbol (Boo Spark ✦)
 * Símbolo oficial definitivo do Boopaste.
 * Proporções vetoriais perfeitas com recorte de olhos em espaço negativo (fillRule evenodd)
 * e centelha cósmica de paste instantâneo no ápice.
 */
export function BoopasteSymbol({
  size = 48,
  className = "",
  ...props
}: SymbolProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      width={size}
      height={size}
      fill="none"
      className={className}
      {...props}
    >
      {/* Fantasma Suave com olhos em recorte negativo real */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M24 11C18.4772 11 14 15.4772 14 21V34C14 36.5 16 36 17.5 34.5C19 33 21 34 22.5 35.5C23.5 36.5 24.5 36.5 25.5 35.5C27 34 29 33 30.5 34.5C32 36 34 36.5 34 34V21C34 15.4772 29.5228 11 24 11ZM19.5 21a1.8 1.8 0 1 0 3.6 0a1.8 1.8 0 1 0 -3.6 0ZM26 21a1.8 1.8 0 1 0 3.6 0a1.8 1.8 0 1 0 -3.6 0Z"
        fill="#00FF66"
      />
      {/* Centelha cósmica ✦ flutuando no topo direito */}
      <path
        d="M36 10C36 12.5 37.5 14 40 14C37.5 14 36 15.5 36 18C36 15.5 34.5 14 32 14C34.5 14 36 12.5 36 10Z"
        fill="#ffffff"
      />
    </svg>
  );
}

// Alias para compatibilidade
export const SparkBooSymbol = BoopasteSymbol;
export const BoopasteLogoSymbol = BoopasteSymbol;
