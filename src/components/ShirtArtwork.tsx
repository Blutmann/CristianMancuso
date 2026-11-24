"use client";

import type {
  CatalogShirt,
  CollarOption,
  MonogramPlacement,
} from "@/data/catalog";

interface ShirtArtworkProps {
  shirt: CatalogShirt;
  collar?: CollarOption;
  cuff?: "Simple Biselado" | "Doble (para gemelos)";
  monogramDisplay?: string;
  monogramPlacement?: MonogramPlacement;
  interactivePreview?: boolean;
  uidPrefix?: string;
}

export function ShirtArtwork({
  shirt,
  collar = "Italiano",
  cuff = "Simple Biselado",
  monogramDisplay = "",
  monogramPlacement = "Puño izquierdo",
  interactivePreview = false,
  uidPrefix = "card",
}: ShirtArtworkProps) {
  const pid = `${uidPrefix}-${shirt.id}`;
  const isLight = Boolean(shirt.isLightFabric);
  const seamStroke = isLight
    ? "rgba(18, 18, 21, 0.24)"
    : "rgba(245, 242, 235, 0.22)";
  const placketShade = isLight
    ? "rgba(18, 18, 21, 0.06)"
    : "rgba(6, 7, 9, 0.36)";
  const buttonFill = isLight ? "#FFFFFF" : "#E6EEF7";
  const buttonRing = isLight
    ? "rgba(18, 18, 21, 0.22)"
    : "rgba(255, 255, 255, 0.55)";

  return (
    <svg
      aria-hidden="true"
      className="h-full w-full"
      viewBox="0 0 360 420"
      preserveAspectRatio="xMidYMid slice"
    >
      <defs>
        <radialGradient id={`${pid}-grad`} cx="65%" cy="24%" r="82%">
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
              strokeWidth="1.2"
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
              strokeWidth="1.5"
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
            <rect
              x="0"
              y="0"
              width="3"
              height="3"
              fill={shirt.accentLineHex}
            />
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
            width="44"
            height="44"
            patternUnits="userSpaceOnUse"
          >
            <line
              x1="0"
              y1="22"
              x2="44"
              y2="22"
              stroke={shirt.accentLineHex}
              strokeWidth="1"
            />
            <line
              x1="22"
              y1="0"
              x2="22"
              y2="44"
              stroke={shirt.accentLineHex}
              strokeWidth="1"
            />
            <line
              x1="0"
              y1="24"
              x2="44"
              y2="24"
              stroke="rgba(245,242,235,0.06)"
              strokeWidth="0.6"
            />
          </pattern>
        )}

        {shirt.weaveKind === "mineral-stripe" && (
          <pattern
            id={`${pid}-weave`}
            width="16"
            height="16"
            patternUnits="userSpaceOnUse"
          >
            <line
              x1="4"
              y1="0"
              x2="4"
              y2="16"
              stroke={shirt.accentLineHex}
              strokeWidth="2.2"
            />
            <line
              x1="9"
              y1="0"
              x2="9"
              y2="16"
              stroke={shirt.accentLineHex}
              strokeWidth="0.7"
              strokeOpacity="0.6"
            />
          </pattern>
        )}
      </defs>

      {/* Base Fabric & Weave */}
      <rect width="360" height="420" fill={`url(#${pid}-grad)`} />
      <rect width="360" height="420" fill={`url(#${pid}-weave)`} />

      {/* Center Tailored Placket */}
      <rect x="156" y="72" width="48" height="348" fill={placketShade} />
      <line
        x1="164"
        y1="72"
        x2="164"
        y2="420"
        stroke={seamStroke}
        strokeWidth="0.9"
        strokeDasharray="3 3"
      />
      <line
        x1="196"
        y1="72"
        x2="196"
        y2="420"
        stroke={seamStroke}
        strokeWidth="0.9"
        strokeDasharray="3 3"
      />

      {/* Dynamic Collar Architecture */}
      <g>
        {collar === "Mao" ? (
          <path
            d="M 122 60 Q 180 80 238 60 L 244 92 Q 180 110 116 92 Z"
            fill={placketShade}
            stroke={seamStroke}
            strokeWidth="1.3"
          />
        ) : collar === "Francés" ? (
          <>
            <path
              d="M 116 54 Q 180 78 244 54 L 254 90 Q 180 112 106 90 Z"
              fill={placketShade}
              stroke={seamStroke}
              strokeWidth="1.1"
            />
            <path
              d="M 116 54 L 70 118 L 176 102 Z"
              fill={shirt.baseHex}
              fillOpacity="0.55"
              stroke={seamStroke}
              strokeWidth="1.25"
            />
            <path
              d="M 244 54 L 290 118 L 184 102 Z"
              fill={shirt.baseHex}
              fillOpacity="0.55"
              stroke={seamStroke}
              strokeWidth="1.25"
            />
          </>
        ) : (
          <>
            <path
              d="M 118 54 Q 180 76 242 54 L 250 90 Q 180 110 110 90 Z"
              fill={placketShade}
              stroke={seamStroke}
              strokeWidth="1.1"
            />
            <path
              d="M 118 54 L 94 134 L 176 104 Z"
              fill={shirt.baseHex}
              fillOpacity="0.55"
              stroke={seamStroke}
              strokeWidth="1.25"
            />
            <path
              d="M 242 54 L 266 134 L 184 104 Z"
              fill={shirt.baseHex}
              fillOpacity="0.55"
              stroke={seamStroke}
              strokeWidth="1.25"
            />
            {collar === "Button-Down" && (
              <>
                <circle
                  cx="104"
                  cy="122"
                  r="3.2"
                  fill={buttonFill}
                  stroke={buttonRing}
                  strokeWidth="0.8"
                />
                <circle
                  cx="256"
                  cy="122"
                  r="3.2"
                  fill={buttonFill}
                  stroke={buttonRing}
                  strokeWidth="0.8"
                />
              </>
            )}
          </>
        )}
      </g>

      {/* Australian Mother-of-Pearl Placket Buttons */}
      {[124, 194, 264, 334].map((cy) => (
        <g key={cy} transform={`translate(180, ${cy})`}>
          <circle r="7.5" fill="rgba(0,0,0,0.28)" transform="translate(1, 2)" />
          <circle
            r="7"
            fill={buttonFill}
            stroke={buttonRing}
            strokeWidth="0.9"
          />
          <line
            x1="-2"
            y1="-2"
            x2="2"
            y2="2"
            stroke="#C8A97E"
            strokeWidth="1.1"
            strokeLinecap="round"
          />
          <line
            x1="2"
            y1="-2"
            x2="-2"
            y2="2"
            stroke="#C8A97E"
            strokeWidth="1.1"
            strokeLinecap="round"
          />
        </g>
      ))}

      {/* Subtle Chest Pocket Guide */}
      <path
        d="M 226 156 L 298 156 L 298 228 L 262 242 L 226 228 Z"
        fill="none"
        stroke={seamStroke}
        strokeWidth="0.9"
        strokeDasharray="2.5 2.5"
        opacity="0.7"
      />

      {/* Interactive Live Cuff Inset & Monogram Preview */}
      {interactivePreview && (
        <>
          {/* Left Cuff Architectural Detail Card (Bottom Left) */}
          <g transform="translate(20, 294)">
            <rect
              x="0"
              y="0"
              width="124"
              height="96"
              rx="14"
              fill={shirt.baseHex}
              stroke={
                monogramPlacement === "Puño izquierdo"
                  ? "#C8A97E"
                  : "rgba(255,255,255,0.16)"
              }
              strokeWidth={monogramPlacement === "Puño izquierdo" ? "1.4" : "1"}
            />
            <rect
              x="0"
              y="0"
              width="124"
              height="96"
              rx="14"
              fill={`url(#${pid}-weave)`}
            />
            {/* Cuff Seam & Double-cuff fold line */}
            <line
              x1="12"
              y1="26"
              x2="112"
              y2="26"
              stroke={seamStroke}
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            {cuff === "Doble (para gemelos)" && (
              <line
                x1="12"
                y1="34"
                x2="112"
                y2="34"
                stroke="#C8A97E"
                strokeOpacity="0.55"
                strokeWidth="0.9"
              />
            )}
            {/* Cuff Button or Cufflink */}
            <circle
              cx="26"
              cy="62"
              r={cuff === "Doble (para gemelos)" ? "6.5" : "5.5"}
              fill={cuff === "Doble (para gemelos)" ? "#C8A97E" : buttonFill}
              stroke={buttonRing}
              strokeWidth="0.9"
            />
            <text
              x="12"
              y="17"
              fill={isLight ? "#4B4D55" : "#9CA3AF"}
              fontSize="7.5"
              letterSpacing="1.6"
              fontFamily="monospace"
            >
              PUÑO IZQUIERDO
            </text>

            {/* Live Embroidered Initials on Cuff */}
            {monogramPlacement === "Puño izquierdo" && monogramDisplay && (
              <text
                x="76"
                y="68"
                textAnchor="middle"
                fill="#C8A97E"
                fontSize="20"
                fontFamily="Georgia, 'Times New Roman', serif"
                fontStyle="italic"
                fontWeight="600"
                letterSpacing="2"
              >
                {monogramDisplay}
              </text>
            )}
          </g>

          {/* Live Embroidered Initials on Chest (Pechera) */}
          {monogramPlacement === "Pechera" && monogramDisplay && (
            <g>
              <rect
                x="232"
                y="174"
                width="60"
                height="34"
                rx="8"
                fill={
                  isLight ? "rgba(18,18,21,0.08)" : "rgba(6,7,9,0.45)"
                }
                stroke="#C8A97E"
                strokeOpacity="0.65"
                strokeWidth="1"
              />
              <text
                x="262"
                y="197"
                textAnchor="middle"
                fill="#C8A97E"
                fontSize="18"
                fontFamily="Georgia, 'Times New Roman', serif"
                fontStyle="italic"
                fontWeight="600"
                letterSpacing="1.8"
              >
                {monogramDisplay}
              </text>
            </g>
          )}
        </>
      )}
    </svg>
  );
}
