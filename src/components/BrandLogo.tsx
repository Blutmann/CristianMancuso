"use client";

interface BrandLogoProps {
  showWordmark?: boolean;
  stacked?: boolean;
  markSize?: number;
  className?: string;
}

/**
 * Monograma vectorial heráldico Cristian Mancuso:
 * M vertical con remates serifados + C envolvente + anillo/ojal central en blanco puro.
 */
export function BrandLogo({
  showWordmark = true,
  stacked = false,
  markSize = 32,
  className = "",
}: BrandLogoProps) {
  return (
    <div
      className={`inline-flex items-center ${
        stacked ? "flex-col gap-3 text-center" : "gap-3"
      } ${className}`}
    >
      <svg
        width={markSize}
        height={markSize}
        viewBox="0 0 64 64"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="shrink-0"
      >
        {/* Outer Enveloping C Crescent */}
        <path
          d="M 46.5 16.5 A 22 22 0 1 0 46.5 47.5"
          stroke="#FFFFFF"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
        {/* Serif terminals on C */}
        <line
          x1="44"
          y1="12.5"
          x2="49"
          y2="19.5"
          stroke="#FFFFFF"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
        <line
          x1="44"
          y1="51.5"
          x2="49"
          y2="44.5"
          stroke="#FFFFFF"
          strokeWidth="2.4"
          strokeLinecap="round"
        />

        {/* Interlocked Heraldic Vertical M with Serifed Stems */}
        <path
          d="M 20 46 V 19 L 32 33 L 44 19 V 46"
          stroke="#FFFFFF"
          strokeWidth="3.1"
          strokeLinecap="square"
          strokeLinejoin="miter"
        />
        {/* Serif feet & crowns on M */}
        <line
          x1="16.5"
          y1="19"
          x2="23.5"
          y2="19"
          stroke="#FFFFFF"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <line
          x1="40.5"
          y1="19"
          x2="47.5"
          y2="19"
          stroke="#FFFFFF"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <line
          x1="16.5"
          y1="46"
          x2="23.5"
          y2="46"
          stroke="#FFFFFF"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <line
          x1="40.5"
          y1="46"
          x2="47.5"
          y2="46"
          stroke="#FFFFFF"
          strokeWidth="2.2"
          strokeLinecap="round"
        />

        {/* Central Ring / Sartorial Eyelet (Ojal) */}
        <circle
          cx="32"
          cy="33"
          r="6.2"
          fill="#07080B"
          stroke="#FFFFFF"
          strokeWidth="2.2"
        />
        <circle cx="32" cy="33" r="1.8" fill="#D6C3A5" />
      </svg>

      {showWordmark && (
        <div
          className={`flex flex-col leading-none ${
            stacked ? "items-center gap-1" : "items-start gap-0.5"
          }`}
        >
          <span className="font-display text-[11px] sm:text-xs font-bold tracking-[0.22em] text-white uppercase">
            Cristian Mancuso
          </span>
          {stacked && (
            <span className="text-[10px] tracking-[0.24em] text-white/55 uppercase">
              Sastrería de Autor
            </span>
          )}
        </div>
      )}
    </div>
  );
}
