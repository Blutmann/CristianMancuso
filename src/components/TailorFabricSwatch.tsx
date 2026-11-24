"use client";

import Image from "next/image";
import type { CatalogShirt } from "@/data/catalog";

interface TailorFabricSwatchProps {
  shirt: CatalogShirt;
  compact?: boolean;
}

/**
 * Generates a realistic pinked-edge (zig-zag tailor shears cut) CSS polygon
 * along all 4 sides of the fabric swatch.
 */
function buildPinkedPolygon(teeth = 18, depth = 1.6): string {
  const pts: string[] = [];
  const step = 100 / teeth;

  // Top edge (left -> right)
  for (let i = 0; i < teeth; i++) {
    const x1 = (i * step).toFixed(2);
    const xm = ((i + 0.5) * step).toFixed(2);
    pts.push(`${x1}% 0%`, `${xm}% ${depth}%`);
  }
  pts.push("100% 0%");

  // Right edge (top -> bottom)
  for (let i = 0; i < teeth; i++) {
    const y1 = (i * step).toFixed(2);
    const ym = ((i + 0.5) * step).toFixed(2);
    pts.push(`100% ${y1}%`, `${(100 - depth).toFixed(2)}% ${ym}%`);
  }
  pts.push("100% 100%");

  // Bottom edge (right -> left)
  for (let i = teeth; i > 0; i--) {
    const x1 = (i * step).toFixed(2);
    const xm = ((i - 0.5) * step).toFixed(2);
    pts.push(`${x1}% 100%`, `${xm}% ${(100 - depth).toFixed(2)}%`);
  }
  pts.push("0% 100%");

  // Left edge (bottom -> top)
  for (let i = teeth; i > 0; i--) {
    const y1 = (i * step).toFixed(2);
    const ym = ((i - 0.5) * step).toFixed(2);
    pts.push(`0% ${y1}%`, `${depth}% ${ym}%`);
  }

  return `polygon(${pts.join(", ")})`;
}

const PINKED_CLIP_PATH = buildPinkedPolygon(18, 1.8);

export function TailorFabricSwatch({
  shirt,
  compact = false,
}: TailorFabricSwatchProps) {
  return (
    <div
      className={`relative flex h-full w-full items-center justify-center ${
        compact ? "p-3.5" : "p-6 sm:p-8"
      }`}
    >
      {/* Drop shadow wrapper so the zig-zag pinked silhouette casts real depth */}
      <div className="relative aspect-square h-full max-h-full w-full max-w-[380px] drop-shadow-[0_14px_24px_rgba(17,17,19,0.22)] dark:drop-shadow-[0_18px_30px_rgba(0,0,0,0.65)]">
        <div
          className="relative h-full w-full overflow-hidden"
          style={{
            clipPath: PINKED_CLIP_PATH,
            backgroundColor: shirt.baseHex,
          }}
        >
          {/* Real zoomed cloth photograph */}
          <Image
            src={shirt.studioImage}
            alt={`Muestrario de tela ${shirt.name}`}
            fill
            sizes={compact ? "(min-width: 1024px) 25vw, 50vw" : "420px"}
            className="scale-[2.7] object-cover object-center"
          />

          {/* Subtle directional weave lighting & edge shading */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(135deg, rgba(255,255,255,0.14) 0%, transparent 45%, rgba(0,0,0,0.22) 100%)",
            }}
          />

          {/* Sewn-on Tailor Sample Corner Label */}
          <div
            className={`pointer-events-none absolute left-3 bottom-3 max-w-[84%] rounded-sm border border-dashed border-[#111113]/30 bg-[#FAF8F4]/92 text-[#111113] shadow-sm backdrop-blur-xs ${
              compact ? "px-2 py-1" : "left-5 bottom-5 px-3 py-2"
            }`}
          >
            <p
              className={`font-mono font-semibold uppercase tracking-[0.08em] ${
                compact ? "text-[9px]" : "text-[10.5px]"
              }`}
            >
              {shirt.refCode}
            </p>
            <p
              className={`truncate text-[#111113]/75 ${
                compact ? "text-[9.5px]" : "mt-0.5 text-[11px]"
              }`}
            >
              {shirt.composition}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
