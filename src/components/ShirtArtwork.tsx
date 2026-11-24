"use client";

import type {
  CatalogShirt,
  CollarOption,
  MonogramPlacement,
} from "@/data/catalog";

interface ShirtArtworkProps {
  shirt: CatalogShirt;
  collar?: CollarOption;
  monogramDisplay?: string;
  monogramPlacement?: MonogramPlacement;
  uidPrefix?: string;
}

export function ShirtArtwork({
  shirt,
  collar = "Italiano",
  monogramDisplay = "C.M.",
  monogramPlacement = "Puño izquierdo",
  uidPrefix = "card",
}: ShirtArtworkProps) {
  const pid = `${uidPrefix}-${shirt.id}`;
  const isLight = Boolean(shirt.isLightFabric);
  const stageBg = isLight ? "#F4F4F5" : "#09090B";
  const seamStroke = isLight
    ? "rgba(9, 9, 11, 0.24)"
    : "rgba(255, 255, 255, 0.22)";
  const placketShade = isLight
    ? "rgba(9, 9, 11, 0.06)"
    : "rgba(9, 9, 11, 0.42)";
  const buttonFill = isLight ? "#FFFFFF" : "#F4F4F5";
  const buttonRing = isLight
    ? "rgba(9, 9, 11, 0.22)"
    : "rgba(255, 255, 255, 0.5)";

  return (
    <svg
      aria-hidden="true"
      className="h-full w-full"
      viewBox="0 0 360 370"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id={`${pid}-grad`} cx="62%" cy="22%" r="82%">
          <stop offset="0%" stopColor={shirt.secondaryHex} />
          <stop offset="100%" stopColor={shirt.baseHex} />
        </radialGradient>

        {shirt.weaveKind === "twill" && (
          <pattern
            id={`${pid}-weave`}
            width="8"
            height="8"
            patternUnits="userSpaceOnUse"
            patternTransform="rotate(36)"
          >
            <line
              x1="0"
              y1="0"
              x2="0"
              y2="8"
              stroke={shirt.accentLineHex}
              strokeWidth="1.1"
            />
          </pattern>
        )}

        {shirt.weaveKind === "linen" && (
          <pattern
            id={`${pid}-weave`}
            width="14"
            height="14"
            patternUnits="userSpaceOnUse"
          >
            <line
              x1="0"
              y1="4"
              x2="14"
              y2="4"
              stroke={shirt.accentLineHex}
              strokeWidth="1"
            />
            <line
              x1="0"
              y1="10"
              x2="14"
              y2="10"
              stroke={shirt.accentLineHex}
              strokeWidth="1.4"
              strokeOpacity="0.6"
            />
            <line
              x1="7"
              y1="0"
              x2="7"
              y2="14"
              stroke={shirt.accentLineHex}
              strokeWidth="0.9"
            />
          </pattern>
        )}

        {shirt.weaveKind === "oxford" && (
          <pattern
            id={`${pid}-weave`}
            width="6"
            height="6"
            patternUnits="userSpaceOnUse"
          >
            <rect x="0" y="0" width="3" height="3" fill={shirt.accentLineHex} />
            <rect
              x="3"
              y="3"
              width="3"
              height="3"
              fill={shirt.accentLineHex}
              opacity="0.55"
            />
          </pattern>
        )}

        {shirt.weaveKind === "windowpane" && (
          <pattern
            id={`${pid}-weave`}
            width="36"
            height="36"
            patternUnits="userSpaceOnUse"
          >
            <line
              x1="0"
              y1="18"
              x2="36"
              y2="18"
              stroke={shirt.accentLineHex}
              strokeWidth="0.9"
            />
            <line
              x1="18"
              y1="0"
              x2="18"
              y2="36"
              stroke={shirt.accentLineHex}
              strokeWidth="0.9"
            />
          </pattern>
        )}

        {shirt.weaveKind === "mineral-stripe" && (
          <pattern
            id={`${pid}-weave`}
            width="14"
            height="14"
            patternUnits="userSpaceOnUse"
          >
            <line
              x1="4"
              y1="0"
              x2="4"
              y2="14"
              stroke={shirt.accentLineHex}
              strokeWidth="2"
            />
            <line
              x1="8.5"
              y1="0"
              x2="8.5"
              y2="14"
              stroke={shirt.accentLineHex}
              strokeWidth="0.7"
              strokeOpacity="0.6"
            />
          </pattern>
        )}
      </defs>

      {/* Subtle Editorial Studio Backdrop */}
      <rect width="360" height="370" fill={stageBg} />

      {/* Full Long-Sleeve Dress Shirt Silhouette */}
      <g>
        {/* Left & Right Full Long Sleeves + Torso */}
        <path
          d="M 140 52 Q 180 68 220 52 L 256 68 L 314 282 L 280 292 L 246 154 L 246 318 Q 180 332 114 318 L 114 154 L 80 292 L 46 282 L 104 68 Z"
          fill={`url(#${pid}-grad)`}
          stroke={seamStroke}
          strokeWidth="1.3"
          strokeLinejoin="round"
        />
        <path
          d="M 140 52 Q 180 68 220 52 L 256 68 L 314 282 L 280 292 L 246 154 L 246 318 Q 180 332 114 318 L 114 154 L 80 292 L 46 282 L 104 68 Z"
          fill={`url(#${pid}-weave)`}
        />

        {/* Armhole & Sleeve Placket Seams (Tapetas de Manga) */}
        <path
          d="M 114 154 Q 108 110 104 68"
          fill="none"
          stroke={seamStroke}
          strokeWidth="1"
          strokeDasharray="3 3"
        />
        <path
          d="M 246 154 Q 252 110 256 68"
          fill="none"
          stroke={seamStroke}
          strokeWidth="1"
          strokeDasharray="3 3"
        />

        {/* Right Cuff (Viewer Left) */}
        <path
          d="M 52 258 L 86 268 L 80 292 L 46 282 Z"
          fill={placketShade}
          stroke={seamStroke}
          strokeWidth="1.1"
        />
        <circle
          cx="65"
          cy="275"
          r="3.2"
          fill={buttonFill}
          stroke={buttonRing}
          strokeWidth="0.7"
        />

        {/* Left Cuff (Viewer Right) with Sleeve Placket & Monogram */}
        <path
          d="M 274 268 L 308 258 L 314 282 L 280 292 Z"
          fill={placketShade}
          stroke={seamStroke}
          strokeWidth="1.1"
        />
        <line
          x1="286"
          y1="230"
          x2="294"
          y2="262"
          stroke={seamStroke}
          strokeWidth="1"
        />
        <circle
          cx="299"
          cy="274"
          r="3.2"
          fill={buttonFill}
          stroke={buttonRing}
          strokeWidth="0.7"
        />

        {/* Center Tailored Placket */}
        <rect x="169" y="68" width="22" height="256" fill={placketShade} />
        <line
          x1="173"
          y1="68"
          x2="173"
          y2="324"
          stroke={seamStroke}
          strokeWidth="0.8"
          strokeDasharray="3 3"
        />
        <line
          x1="187"
          y1="68"
          x2="187"
          y2="324"
          stroke={seamStroke}
          strokeWidth="0.8"
          strokeDasharray="3 3"
        />

        {/* Collar */}
        {collar === "Mao" ? (
          <path
            d="M 142 52 Q 180 66 218 52 L 222 72 Q 180 84 138 72 Z"
            fill={shirt.secondaryHex}
            stroke={seamStroke}
            strokeWidth="1.2"
          />
        ) : (
          <>
            <path
              d="M 140 52 L 128 94 L 178 74 Z"
              fill={shirt.secondaryHex}
              stroke={seamStroke}
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
            <path
              d="M 220 52 L 232 94 L 182 74 Z"
              fill={shirt.secondaryHex}
              stroke={seamStroke}
              strokeWidth="1.2"
              strokeLinejoin="round"
            />
          </>
        )}

        {/* Placket Mother-of-Pearl Buttons with Bronze Cross Stitch */}
        {[106, 152, 198, 244, 290].map((cy) => (
          <g key={cy} transform={`translate(180, ${cy})`}>
            <circle
              r="4.2"
              fill={buttonFill}
              stroke={buttonRing}
              strokeWidth="0.8"
            />
            <line
              x1="-1.5"
              y1="-1.5"
              x2="1.5"
              y2="1.5"
              stroke="#C59B5F"
              strokeWidth="0.9"
            />
            <line
              x1="1.5"
              y1="-1.5"
              x2="-1.5"
              y2="1.5"
              stroke="#C59B5F"
              strokeWidth="0.9"
            />
          </g>
        ))}

        {/* Embroidered Monogram on Left Cuff or Chest */}
        {monogramDisplay && (
          <text
            x={monogramPlacement === "Pechera" ? 216 : 286}
            y={monogramPlacement === "Pechera" ? 136 : 281}
            textAnchor="middle"
            fill="#C59B5F"
            fontSize={monogramPlacement === "Pechera" ? "11" : "8.5"}
            fontFamily="Georgia, serif"
            fontStyle="italic"
            fontWeight="600"
          >
            {monogramDisplay}
          </text>
        )}
      </g>
    </svg>
  );
}
