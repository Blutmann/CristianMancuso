"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowDown,
  Check,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
} from "lucide-react";
import {
  BUTTON_OPTIONS,
  CATALOG_SHIRTS,
  COLLAR_OPTIONS,
  MONOGRAM_PLACEMENTS,
  formatMonogramDisplay,
  type BespokeMeasurements,
  type ButtonOption,
  type CollarOption,
  type MonogramPlacement,
} from "@/data/catalog";
import { formatFabricPrice } from "@/data/fabrics";
import { useAtelier } from "@/context/AtelierContext";

type MeasureKey = keyof BespokeMeasurements;

const MEASURE_FIELDS: {
  key: MeasureKey;
  label: string;
  placeholder: string;
  min: number;
  max: number;
}[] = [
  { key: "cuello", label: "Cuello", placeholder: "40", min: 32, max: 54 },
  { key: "pecho", label: "Pecho", placeholder: "55", min: 42, max: 78 },
  { key: "manga", label: "Manga", placeholder: "64", min: 52, max: 78 },
  { key: "largo", label: "Largo", placeholder: "74", min: 62, max: 94 },
];

function CollarMiniIcon({
  collar,
  active,
}: {
  collar: CollarOption;
  active: boolean;
}) {
  const stroke = active ? "#C59B5F" : "#94A3B8";
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 64 34"
      className="h-7 w-14 shrink-0"
      fill="none"
    >
      {collar === "Mao" ? (
        <path
          d="M 14 14 Q 32 22 50 14 L 52 24 Q 32 30 12 24 Z"
          stroke={stroke}
          strokeWidth="1.5"
        />
      ) : collar === "Francés" ? (
        <>
          <path
            d="M 14 10 L 6 24 L 30 20 Z"
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M 50 10 L 58 24 L 34 20 Z"
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
        </>
      ) : (
        <>
          <path
            d="M 16 8 L 12 27 L 30 20 Z"
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          <path
            d="M 48 8 L 52 27 L 34 20 Z"
            stroke={stroke}
            strokeWidth="1.5"
            strokeLinejoin="round"
          />
          {collar === "Button-Down" && (
            <>
              <circle cx="15" cy="23" r="1.7" fill={stroke} />
              <circle cx="49" cy="23" r="1.7" fill={stroke} />
            </>
          )}
        </>
      )}
    </svg>
  );
}

export function ShirtBuilderSection() {
  const {
    currency,
    builderShirtId,
    setBuilderShirtId,
    addToSelection,
    openDrawer,
  } = useAtelier();

  const fabricRailRef = useRef<HTMLDivElement | null>(null);
  const [collar, setCollar] = useState<CollarOption>("Italiano");
  const [buttonId, setButtonId] = useState<ButtonOption>("Nácar Blanco");
  const [measurements, setMeasurements] = useState<BespokeMeasurements>({
    cuello: "",
    pecho: "",
    manga: "",
    largo: "",
  });
  const [focusedMeasure, setFocusedMeasure] = useState<MeasureKey | null>(null);
  const [monogramText, setMonogramText] = useState("");
  const [monogramPlacement, setMonogramPlacement] =
    useState<MonogramPlacement>("Puño izquierdo");
  const [justAdded, setJustAdded] = useState(false);

  const selectedShirt =
    CATALOG_SHIRTS.find((s) => s.id === builderShirtId) ?? CATALOG_SHIRTS[0];
  const selectedButton =
    BUTTON_OPTIONS.find((b) => b.id === buttonId) ?? BUTTON_OPTIONS[0];
  const monogramDisplay = formatMonogramDisplay(monogramText);

  const scrollFabricRail = (direction: -1 | 1) => {
    fabricRailRef.current?.scrollBy({
      left: direction * 240,
      behavior: "smooth",
    });
  };

  const handleMeasureChange = (key: MeasureKey, value: string) => {
    const clean = value.replace(/[^0-9.]/g, "").slice(0, 4);
    setMeasurements((prev) => ({ ...prev, [key]: clean }));
  };

  const invalidField = MEASURE_FIELDS.find((f) => {
    const raw = measurements[f.key];
    if (!raw) return false;
    const num = Number(raw);
    return Number.isNaN(num) || num < f.min || num > f.max;
  });

  const handleAddBespoke = () => {
    if (invalidField) return;
    addToSelection(selectedShirt, {
      mode: "bespoke",
      collar,
      button: buttonId,
      monogramText,
      monogramPlacement,
      measurements,
    });
    setJustAdded(true);
    openDrawer();
    window.setTimeout(() => setJustAdded(false), 1800);
  };

  const formatLiveCm = (val: string) => (val ? `${val} cm` : "-- cm");

  const lineStroke = (key: MeasureKey) =>
    focusedMeasure === key || measurements[key]
      ? "#C59B5F"
      : "rgba(248, 250, 252, 0.28)";

  const isLight = Boolean(selectedShirt.isLightFabric);
  const seamColor = isLight
    ? "rgba(15, 23, 42, 0.28)"
    : "rgba(248, 250, 252, 0.24)";
  const cuffShade = isLight
    ? "rgba(15, 23, 42, 0.08)"
    : "rgba(15, 23, 42, 0.36)";

  return (
    <section
      id="arma-tu-camisa"
      aria-labelledby="builder-heading"
      className="relative w-full scroll-mt-24 bg-navy text-primary py-20 sm:py-24 lg:py-28"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 atelier-grain opacity-70" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* Section Header */}
        <div className="max-w-2xl">
          <div className="mb-3 flex items-center gap-3">
            <span aria-hidden="true" className="h-[1px] w-7 bg-bronze" />
            <span className="text-xs font-medium tracking-[0.18em] text-bronze uppercase">
              Confección a medida sin cargo
            </span>
          </div>
          <h2
            id="builder-heading"
            className="font-display text-[clamp(2rem,4.4vw,3.4rem)] font-bold leading-[1.03] tracking-[-0.035em] text-primary"
          >
            Armá tu camisa
          </h2>
          <p className="mt-3 text-base text-muted">
            Personalizá cada detalle. Confección a medida sin costo extra.
          </p>
        </div>

        {/* 2-Column Main Split */}
        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start lg:gap-12">
          {/* LEFT COLUMN: 4 Steps with Compact Swatches & Scroll-Snap Strips */}
          <div className="lg:col-span-7 space-y-8 min-w-0">
            {/* Step 1: Compact Square Fabric Swatches (w-24 / 96x96px) */}
            <div>
              <div className="mb-3 flex items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-primary">
                  1. Elegí el tipo de tela
                </h3>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    aria-label="Desplazar telas a la izquierda"
                    onClick={() => scrollFabricRail(-1)}
                    className="cursor-pointer inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-elevated text-muted transition-colors hover:border-bronze/60 hover:text-primary"
                  >
                    <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                  </button>
                  <button
                    type="button"
                    aria-label="Desplazar telas a la derecha"
                    onClick={() => scrollFabricRail(1)}
                    className="cursor-pointer inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-elevated text-muted transition-colors hover:border-bronze/60 hover:text-primary"
                  >
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>

              <div
                ref={fabricRailRef}
                className="scrollbar-none -mx-1 flex gap-3.5 overflow-x-auto px-1 pb-1 snap-x snap-mandatory"
              >
                {CATALOG_SHIRTS.map((shirt) => {
                  const active = shirt.id === selectedShirt.id;
                  const shortName = shirt.name.split(" ").slice(0, 2).join(" ");
                  return (
                    <button
                      key={shirt.id}
                      id={`builder-fabric-${shirt.id}`}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setBuilderShirtId(shirt.id)}
                      className="cursor-pointer group snap-start shrink-0 w-24 text-left focus-visible:outline-none"
                    >
                      {/* 96x96px Square Textile Swatch */}
                      <div
                        className={`relative h-24 w-24 rounded-2xl border transition-all ${
                          active
                            ? "border-bronze ring-2 ring-bronze/40 shadow-[0_10px_24px_rgba(0,0,0,0.45)]"
                            : "border-white/12 group-hover:border-white/30"
                        }`}
                        style={{
                          background: `linear-gradient(135deg, ${shirt.secondaryHex} 0%, ${shirt.baseHex} 100%)`,
                        }}
                      >
                        {active && (
                          <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-bronze text-navy">
                            <Check className="h-3 w-3" aria-hidden="true" />
                          </span>
                        )}
                      </div>

                      <p
                        className={`mt-2 text-xs font-medium leading-tight line-clamp-1 ${
                          active ? "text-primary" : "text-primary/80"
                        }`}
                      >
                        {shortName}
                      </p>
                      <p className="mt-0.5 font-mono text-[10px] text-muted line-clamp-1">
                        {shirt.refCode}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 2: Tipo de Cuello */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-primary">
                2. Elegí el tipo de cuello
              </h3>
              <div className="scrollbar-none -mx-1 flex gap-3 overflow-x-auto px-1 pb-1 snap-x snap-mandatory">
                {COLLAR_OPTIONS.map((option) => {
                  const active = collar === option;
                  return (
                    <button
                      key={option}
                      id={`builder-collar-${option.toLowerCase()}`}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setCollar(option)}
                      className={`cursor-pointer snap-start shrink-0 min-h-[76px] min-w-[126px] flex flex-col items-center justify-center gap-1.5 rounded-2xl border px-4 py-3 transition-all ${
                        active
                          ? "border-bronze bg-bronze/15 text-primary"
                          : "border-white/10 bg-elevated text-muted hover:border-white/25 hover:text-primary"
                      }`}
                    >
                      <CollarMiniIcon collar={option} active={active} />
                      <span className="text-xs font-medium">{option}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 3: Tipo de Botón */}
            <div>
              <h3 className="mb-3 text-sm font-semibold text-primary">
                3. Elegí el tipo de botón
              </h3>
              <div className="scrollbar-none -mx-1 flex gap-3 overflow-x-auto px-1 pb-1 snap-x snap-mandatory">
                {BUTTON_OPTIONS.map((btn) => {
                  const active = buttonId === btn.id;
                  return (
                    <button
                      key={btn.id}
                      id={`builder-button-${btn.id.toLowerCase().replace(/\s+/g, "-")}`}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setButtonId(btn.id)}
                      className={`cursor-pointer snap-start shrink-0 min-h-[56px] min-w-[144px] flex items-center gap-3 rounded-2xl border px-3.5 py-2.5 text-left transition-all ${
                        active
                          ? "border-bronze bg-bronze/15 text-primary"
                          : "border-white/10 bg-elevated text-muted hover:border-white/25 hover:text-primary"
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border"
                        style={{
                          backgroundColor: btn.fill,
                          borderColor: btn.ring,
                        }}
                      >
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: btn.thread }}
                        />
                      </span>
                      <span className="text-xs font-medium">{btn.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Step 4: Medidas en cm + Iniciales opcionales */}
            <div className="rounded-2xl border border-white/10 bg-elevated p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-primary">
                  4. Ingresá tus medidas (cm)
                </h3>
                <Link
                  href="/#como-medir"
                  className="text-xs font-medium text-bronze hover:underline"
                >
                  ¿Cómo me mido?
                </Link>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {MEASURE_FIELDS.map((field) => {
                  const val = measurements[field.key];
                  const isFocused = focusedMeasure === field.key;
                  return (
                    <div key={field.key}>
                      <label
                        htmlFor={`measure-input-${field.key}`}
                        className="block text-xs font-medium text-muted"
                      >
                        {field.label}
                      </label>
                      <div
                        className={`mt-1.5 flex min-h-[44px] items-center rounded-xl border bg-navy px-3 transition-colors ${
                          isFocused ? "border-bronze" : "border-white/12"
                        }`}
                      >
                        <input
                          id={`measure-input-${field.key}`}
                          type="text"
                          inputMode="decimal"
                          value={val}
                          onFocus={() => setFocusedMeasure(field.key)}
                          onBlur={() => setFocusedMeasure(null)}
                          onChange={(e) =>
                            handleMeasureChange(field.key, e.target.value)
                          }
                          placeholder={field.placeholder}
                          className="w-full bg-transparent font-mono text-sm text-primary placeholder:text-muted/40 focus:outline-none"
                        />
                        <span className="font-mono text-xs text-muted">cm</span>
                      </div>
                    </div>
                  );
                })}
              </div>

              {invalidField && (
                <p role="alert" className="mt-3 text-xs text-amber-300">
                  Revisá {invalidField.label}: el rango habitual es entre{" "}
                  <span className="font-mono">
                    {invalidField.min} y {invalidField.max} cm
                  </span>
                  .
                </p>
              )}

              {/* Optional Monogram */}
              <div className="mt-5 border-t border-white/10 pt-4">
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-12 sm:items-end">
                  <div className="sm:col-span-5">
                    <label
                      htmlFor="builder-monogram-input"
                      className="block text-xs font-medium text-muted"
                    >
                      Iniciales bordadas (opcional, sin cargo)
                    </label>
                    <input
                      id="builder-monogram-input"
                      type="text"
                      maxLength={3}
                      value={monogramText}
                      onChange={(e) =>
                        setMonogramText(
                          e.target.value
                            .toUpperCase()
                            .replace(/[^A-ZÁÉÍÓÚÑ]/g, "")
                            .slice(0, 3)
                        )
                      }
                      placeholder="Ej. CM"
                      className="mt-1.5 min-h-[44px] w-full rounded-xl border border-white/12 bg-navy px-3.5 text-sm tracking-[0.22em] text-bronze uppercase placeholder:tracking-normal placeholder:text-muted/40 focus:border-bronze focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2 sm:col-span-7">
                    {MONOGRAM_PLACEMENTS.map((place) => {
                      const active = monogramPlacement === place;
                      return (
                        <button
                          key={place}
                          type="button"
                          aria-pressed={active}
                          onClick={() => setMonogramPlacement(place)}
                          className={`cursor-pointer min-h-[44px] rounded-xl border px-3 text-xs font-medium transition-colors ${
                            active
                              ? "border-bronze bg-bronze/15 text-primary"
                              : "border-white/10 bg-navy/70 text-muted hover:text-primary"
                          }`}
                        >
                          {place}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Live Full Long-Sleeve Shirt Model + Real-Time cm Callouts */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="rounded-3xl border border-white/10 bg-elevated p-5 sm:p-6 shadow-[0_28px_80px_rgba(7,12,24,0.55)]">
              {/* Top Title + Ref */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-display text-lg font-bold text-primary">
                    {selectedShirt.name}
                  </p>
                  <p className="mt-0.5 text-xs text-muted">
                    Cuello {collar} · Botón {buttonId}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-base font-semibold text-primary tabular-nums">
                    {formatFabricPrice(selectedShirt.priceArs, currency)}
                  </p>
                  <p className="font-mono text-[10px] text-muted">
                    {selectedShirt.refCode}
                  </p>
                </div>
              </div>

              {/* Live Long-Sleeve SVG Shirt Schematic */}
              <div className="relative mt-4 overflow-hidden rounded-2xl border border-white/10 bg-navy px-2 py-4">
                <svg
                  viewBox="0 0 420 385"
                  className="mx-auto h-auto w-full max-w-[395px]"
                  role="img"
                  aria-label={`Vista en vivo manga larga de ${selectedShirt.name} con medidas en centímetros`}
                >
                  <defs>
                    <radialGradient
                      id="builder-fabric-grad"
                      cx="60%"
                      cy="24%"
                      r="82%"
                    >
                      <stop offset="0%" stopColor={selectedShirt.secondaryHex} />
                      <stop offset="100%" stopColor={selectedShirt.baseHex} />
                    </radialGradient>
                  </defs>

                  {/* Full Long-Sleeve Shirt Body Silhouette */}
                  <path
                    d="M 166 58 Q 210 74 254 58 L 288 74 L 346 296 L 312 306 L 278 164 L 278 332 Q 210 346 142 332 L 142 164 L 108 306 L 74 296 L 132 74 Z"
                    fill="url(#builder-fabric-grad)"
                    stroke={seamColor}
                    strokeWidth="1.4"
                    strokeLinejoin="round"
                  />

                  {/* Armhole Seams */}
                  <path
                    d="M 142 164 Q 136 118 132 74"
                    fill="none"
                    stroke={seamColor}
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                  <path
                    d="M 278 164 Q 284 118 288 74"
                    fill="none"
                    stroke={seamColor}
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />

                  {/* Right Cuff (Viewer Left) */}
                  <path
                    d="M 80 272 L 114 282 L 108 306 L 74 296 Z"
                    fill={cuffShade}
                    stroke={seamColor}
                    strokeWidth="1.1"
                  />
                  <circle
                    cx="93"
                    cy="289"
                    r="3.2"
                    fill={selectedButton.fill}
                    stroke={selectedButton.ring}
                    strokeWidth="0.7"
                  />

                  {/* Left Cuff (Viewer Right) with Sleeve Placket */}
                  <path
                    d="M 306 282 L 340 272 L 346 296 L 312 306 Z"
                    fill={cuffShade}
                    stroke={seamColor}
                    strokeWidth="1.1"
                  />
                  <line
                    x1="316"
                    y1="244"
                    x2="324"
                    y2="276"
                    stroke={seamColor}
                    strokeWidth="1"
                  />
                  <circle
                    cx="332"
                    cy="288"
                    r="3.2"
                    fill={selectedButton.fill}
                    stroke={selectedButton.ring}
                    strokeWidth="0.7"
                  />

                  {/* Center Placket */}
                  <rect
                    x="199"
                    y="74"
                    width="22"
                    height="264"
                    fill={cuffShade}
                  />

                  {/* Dynamic Collar Shape */}
                  {collar === "Mao" ? (
                    <path
                      d="M 168 58 Q 210 74 252 58 L 256 78 Q 210 92 164 78 Z"
                      fill={selectedShirt.secondaryHex}
                      stroke={seamColor}
                      strokeWidth="1.3"
                    />
                  ) : collar === "Francés" ? (
                    <>
                      <path
                        d="M 166 58 L 138 88 L 208 78 Z"
                        fill={selectedShirt.secondaryHex}
                        stroke={seamColor}
                        strokeWidth="1.3"
                      />
                      <path
                        d="M 254 58 L 282 88 L 212 78 Z"
                        fill={selectedShirt.secondaryHex}
                        stroke={seamColor}
                        strokeWidth="1.3"
                      />
                    </>
                  ) : (
                    <>
                      <path
                        d="M 166 58 L 154 98 L 208 78 Z"
                        fill={selectedShirt.secondaryHex}
                        stroke={seamColor}
                        strokeWidth="1.3"
                      />
                      <path
                        d="M 254 58 L 266 98 L 212 78 Z"
                        fill={selectedShirt.secondaryHex}
                        stroke={seamColor}
                        strokeWidth="1.3"
                      />
                      {collar === "Button-Down" && (
                        <>
                          <circle
                            cx="159"
                            cy="91"
                            r="2.4"
                            fill={selectedButton.fill}
                          />
                          <circle
                            cx="261"
                            cy="91"
                            r="2.4"
                            fill={selectedButton.fill}
                          />
                        </>
                      )}
                    </>
                  )}

                  {/* Dynamic Buttons */}
                  {[112, 160, 208, 256, 304].map((cy) => (
                    <g key={cy} transform={`translate(210, ${cy})`}>
                      <circle
                        r="4.5"
                        fill={selectedButton.fill}
                        stroke={selectedButton.ring}
                        strokeWidth="0.9"
                      />
                      <circle r="1.1" fill={selectedButton.thread} />
                    </g>
                  ))}

                  {/* Live Embroidered Initials on Left Cuff or Chest */}
                  {monogramDisplay && (
                    <text
                      x={monogramPlacement === "Pechera" ? 248 : 319}
                      y={monogramPlacement === "Pechera" ? 140 : 296}
                      textAnchor="middle"
                      fill="#C59B5F"
                      fontSize={monogramPlacement === "Pechera" ? "13" : "9.5"}
                      fontFamily="Georgia, serif"
                      fontStyle="italic"
                      fontWeight="600"
                    >
                      {monogramDisplay}
                    </text>
                  )}

                  {/* LIVE MEASUREMENT 1: CUELLO */}
                  <g>
                    <path
                      d="M 166 44 Q 210 58 254 44"
                      fill="none"
                      stroke={lineStroke("cuello")}
                      strokeWidth={focusedMeasure === "cuello" ? 2.2 : 1.3}
                    />
                    <rect
                      x="170"
                      y="10"
                      width="80"
                      height="22"
                      rx="11"
                      fill="#162033"
                      stroke={lineStroke("cuello")}
                      strokeWidth="1"
                    />
                    <text
                      x="210"
                      y="24.5"
                      textAnchor="middle"
                      fill={
                        measurements.cuello || focusedMeasure === "cuello"
                          ? "#C59B5F"
                          : "#94A3B8"
                      }
                      fontSize="10.5"
                      fontFamily="monospace"
                    >
                      {formatLiveCm(measurements.cuello)}
                    </text>
                  </g>

                  {/* LIVE MEASUREMENT 2: PECHO */}
                  <g>
                    <line
                      x1="142"
                      y1="184"
                      x2="278"
                      y2="184"
                      stroke={lineStroke("pecho")}
                      strokeWidth={focusedMeasure === "pecho" ? 2.2 : 1.3}
                      strokeDasharray={measurements.pecho ? "0" : "4 3"}
                    />
                    <rect
                      x="170"
                      y="173"
                      width="80"
                      height="22"
                      rx="11"
                      fill="#162033"
                      stroke={lineStroke("pecho")}
                      strokeWidth="1"
                    />
                    <text
                      x="210"
                      y="187.5"
                      textAnchor="middle"
                      fill={
                        measurements.pecho || focusedMeasure === "pecho"
                          ? "#C59B5F"
                          : "#94A3B8"
                      }
                      fontSize="10.5"
                      fontFamily="monospace"
                    >
                      {formatLiveCm(measurements.pecho)}
                    </text>
                  </g>

                  {/* LIVE MEASUREMENT 3: MANGA LARGA (Hombro hasta Puño) */}
                  <g>
                    <line
                      x1="296"
                      y1="70"
                      x2="356"
                      y2="294"
                      stroke={lineStroke("manga")}
                      strokeWidth={focusedMeasure === "manga" ? 2.2 : 1.3}
                    />
                    <rect
                      x="334"
                      y="168"
                      width="76"
                      height="22"
                      rx="11"
                      fill="#162033"
                      stroke={lineStroke("manga")}
                      strokeWidth="1"
                    />
                    <text
                      x="372"
                      y="182.5"
                      textAnchor="middle"
                      fill={
                        measurements.manga || focusedMeasure === "manga"
                          ? "#C59B5F"
                          : "#94A3B8"
                      }
                      fontSize="10.5"
                      fontFamily="monospace"
                    >
                      {formatLiveCm(measurements.manga)}
                    </text>
                  </g>

                  {/* LIVE MEASUREMENT 4: LARGO */}
                  <g>
                    <line
                      x1="54"
                      y1="62"
                      x2="54"
                      y2="338"
                      stroke={lineStroke("largo")}
                      strokeWidth={focusedMeasure === "largo" ? 2.2 : 1.3}
                      strokeDasharray={measurements.largo ? "0" : "4 3"}
                    />
                    <rect
                      x="12"
                      y="188"
                      width="74"
                      height="22"
                      rx="11"
                      fill="#162033"
                      stroke={lineStroke("largo")}
                      strokeWidth="1"
                    />
                    <text
                      x="49"
                      y="202.5"
                      textAnchor="middle"
                      fill={
                        measurements.largo || focusedMeasure === "largo"
                          ? "#C59B5F"
                          : "#94A3B8"
                      }
                      fontSize="10.5"
                      fontFamily="monospace"
                    >
                      {formatLiveCm(measurements.largo)}
                    </text>
                  </g>
                </svg>
              </div>

              {/* Primary CTA + Quick Guide Link */}
              <div className="mt-5 space-y-3">
                <button
                  id="builder-add-bespoke-btn"
                  type="button"
                  disabled={Boolean(invalidField)}
                  onClick={handleAddBespoke}
                  className="cursor-pointer flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-bronze px-6 py-3 text-xs font-semibold tracking-[0.06em] text-navy uppercase transition-transform duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {justAdded ? (
                    <>
                      <Check className="h-4 w-4" aria-hidden="true" />
                      <span>Agregada a tu selección</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                      <span>Agregar camisa a medida al carrito</span>
                    </>
                  )}
                </button>

                <Link
                  href="/#como-medir"
                  className="flex min-h-[44px] w-full items-center justify-center gap-1.5 text-xs font-medium text-muted transition-colors hover:text-bronze"
                >
                  <span>¿No sabés cómo tomar tus medidas? Ver guía rápida</span>
                  <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
