"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowDown, Check, ShoppingBag } from "lucide-react";
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
  const stroke = active ? "#C8A97E" : "#9CA3AF";
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

  const handleMeasureChange = (key: MeasureKey, value: string) => {
    const clean = value.replace(/[^0-9.]/g, "").slice(0, 4);
    setMeasurements((prev) => ({ ...prev, [key]: clean }));
  };

  // Gentle inline range check
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
      ? "#C8A97E"
      : "rgba(245, 242, 235, 0.28)";

  const isLight = Boolean(selectedShirt.isLightFabric);
  const seamColor = isLight
    ? "rgba(18, 18, 21, 0.25)"
    : "rgba(245, 242, 235, 0.22)";

  return (
    <section
      id="arma-tu-camisa"
      aria-labelledby="builder-heading"
      className="relative w-full scroll-mt-24 bg-obsidian text-primary py-20 sm:py-24 lg:py-28"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 atelier-grain opacity-70" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* Section Header */}
        <div className="max-w-2xl">
          <div className="mb-3 flex items-center gap-3">
            <span
              aria-hidden="true"
              className="h-[1px] w-7 bg-champagne/80"
            />
            <span className="text-xs font-medium tracking-[0.18em] text-champagne uppercase">
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
          {/* LEFT COLUMN: 4 Steps with Horizontal Scroll-Snap Strips */}
          <div className="lg:col-span-7 space-y-8 min-w-0">
            {/* Step 1: Tipo de Tela */}
            <div>
              <div className="mb-3 flex items-baseline justify-between gap-2">
                <h3 className="text-sm font-semibold text-primary">
                  1. Elegí el tipo de tela
                </h3>
                <span className="text-xs text-muted">Deslizá para ver todas</span>
              </div>

              <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2 snap-x snap-mandatory">
                {CATALOG_SHIRTS.map((shirt) => {
                  const active = shirt.id === selectedShirt.id;
                  return (
                    <button
                      key={shirt.id}
                      id={`builder-fabric-${shirt.id}`}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setBuilderShirtId(shirt.id)}
                      className={`cursor-pointer snap-start shrink-0 w-[188px] rounded-2xl border p-3 text-left transition-all ${
                        active
                          ? "border-champagne bg-elevated shadow-[0_12px_30px_rgba(0,0,0,0.45)]"
                          : "border-white/[0.08] bg-elevated/60 hover:border-white/[0.2]"
                      }`}
                    >
                      <div
                        className="h-12 w-full rounded-xl border border-white/[0.1]"
                        style={{
                          background: `linear-gradient(135deg, ${shirt.secondaryHex} 0%, ${shirt.baseHex} 100%)`,
                        }}
                      />
                      <p className="mt-2.5 text-xs font-semibold leading-snug text-primary line-clamp-1">
                        {shirt.name}
                      </p>
                      <p className="mt-0.5 font-mono text-[10px] text-muted">
                        {shirt.refCode}
                      </p>
                      <p className="mt-1.5 text-xs font-medium text-champagne tabular-nums">
                        {formatFabricPrice(shirt.priceArs, currency)}
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
              <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2 snap-x snap-mandatory">
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
                          ? "border-champagne bg-champagne/12 text-primary"
                          : "border-white/[0.08] bg-elevated/60 text-muted hover:border-white/[0.2] hover:text-primary"
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
              <div className="-mx-1 flex gap-3 overflow-x-auto px-1 pb-2 snap-x snap-mandatory">
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
                          ? "border-champagne bg-champagne/12 text-primary"
                          : "border-white/[0.08] bg-elevated/60 text-muted hover:border-white/[0.2] hover:text-primary"
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
            <div className="rounded-2xl border border-white/[0.08] bg-elevated p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-sm font-semibold text-primary">
                  4. Ingresá tus medidas (cm)
                </h3>
                <Link
                  href="/#como-medir"
                  className="text-xs font-medium text-champagne hover:underline"
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
                        className={`mt-1.5 flex min-h-[44px] items-center rounded-xl border bg-obsidian px-3 transition-colors ${
                          isFocused
                            ? "border-champagne"
                            : "border-white/[0.12]"
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
                <p
                  role="alert"
                  className="mt-3 text-xs text-amber-300"
                >
                  Revisá {invalidField.label}: el rango habitual es entre{" "}
                  <span className="font-mono">
                    {invalidField.min} y {invalidField.max} cm
                  </span>
                  .
                </p>
              )}

              {/* Optional Monogram */}
              <div className="mt-5 border-t border-white/[0.08] pt-4">
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
                      className="mt-1.5 min-h-[44px] w-full rounded-xl border border-white/[0.12] bg-obsidian px-3.5 text-sm tracking-[0.22em] text-champagne uppercase placeholder:tracking-normal placeholder:text-muted/40 focus:border-champagne focus:outline-none"
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
                              ? "border-champagne bg-champagne/15 text-primary"
                              : "border-white/[0.1] bg-obsidian/70 text-muted hover:text-primary"
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

          {/* RIGHT COLUMN: Live Shirt Model + Real-Time cm Callouts */}
          <div className="lg:col-span-5 lg:sticky lg:top-24">
            <div className="rounded-3xl border border-white/[0.09] bg-elevated p-5 sm:p-6 shadow-[0_28px_80px_rgba(0,0,0,0.55)]">
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

              {/* Live SVG Shirt Schematic with Dynamic Fabric, Collar, Buttons & Live cm */}
              <div className="relative mt-4 overflow-hidden rounded-2xl border border-white/[0.08] bg-obsidian px-2 py-4">
                <svg
                  viewBox="0 0 420 350"
                  className="mx-auto h-auto w-full max-w-[390px]"
                  role="img"
                  aria-label={`Vista en vivo de ${selectedShirt.name} con medidas en centímetros`}
                >
                  <defs>
                    <radialGradient
                      id="builder-fabric-grad"
                      cx="60%"
                      cy="28%"
                      r="80%"
                    >
                      <stop offset="0%" stopColor={selectedShirt.secondaryHex} />
                      <stop offset="100%" stopColor={selectedShirt.baseHex} />
                    </radialGradient>
                  </defs>

                  {/* Shirt Body Silhouette */}
                  <path
                    d="M 164 56 Q 210 72 256 56 L 288 74 L 364 146 L 336 174 L 292 136 L 292 292 Q 210 306 128 292 L 128 136 L 84 174 L 56 146 L 132 74 Z"
                    fill="url(#builder-fabric-grad)"
                    stroke={seamColor}
                    strokeWidth="1.4"
                    strokeLinejoin="round"
                  />

                  {/* Center Placket */}
                  <rect
                    x="198"
                    y="72"
                    width="24"
                    height="226"
                    fill={
                      isLight
                        ? "rgba(18,18,21,0.06)"
                        : "rgba(6,7,9,0.34)"
                    }
                  />

                  {/* Dynamic Collar Shape */}
                  {collar === "Mao" ? (
                    <path
                      d="M 166 56 Q 210 72 254 56 L 258 76 Q 210 90 162 76 Z"
                      fill={selectedShirt.secondaryHex}
                      stroke={seamColor}
                      strokeWidth="1.3"
                    />
                  ) : collar === "Francés" ? (
                    <>
                      <path
                        d="M 164 56 L 136 86 L 208 76 Z"
                        fill={selectedShirt.secondaryHex}
                        stroke={seamColor}
                        strokeWidth="1.3"
                      />
                      <path
                        d="M 256 56 L 284 86 L 212 76 Z"
                        fill={selectedShirt.secondaryHex}
                        stroke={seamColor}
                        strokeWidth="1.3"
                      />
                    </>
                  ) : (
                    <>
                      <path
                        d="M 164 56 L 152 96 L 208 76 Z"
                        fill={selectedShirt.secondaryHex}
                        stroke={seamColor}
                        strokeWidth="1.3"
                      />
                      <path
                        d="M 256 56 L 268 96 L 212 76 Z"
                        fill={selectedShirt.secondaryHex}
                        stroke={seamColor}
                        strokeWidth="1.3"
                      />
                      {collar === "Button-Down" && (
                        <>
                          <circle
                            cx="157"
                            cy="89"
                            r="2.4"
                            fill={selectedButton.fill}
                          />
                          <circle
                            cx="263"
                            cy="89"
                            r="2.4"
                            fill={selectedButton.fill}
                          />
                        </>
                      )}
                    </>
                  )}

                  {/* Dynamic Buttons */}
                  {[106, 152, 198, 244].map((cy) => (
                    <g key={cy} transform={`translate(210, ${cy})`}>
                      <circle
                        r="4.6"
                        fill={selectedButton.fill}
                        stroke={selectedButton.ring}
                        strokeWidth="0.9"
                      />
                      <circle r="1.1" fill={selectedButton.thread} />
                    </g>
                  ))}

                  {/* Live Embroidered Initials */}
                  {monogramDisplay && (
                    <text
                      x={monogramPlacement === "Pechera" ? 254 : 344}
                      y={monogramPlacement === "Pechera" ? 132 : 162}
                      textAnchor="middle"
                      fill="#C8A97E"
                      fontSize="13"
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
                      d="M 164 42 Q 210 56 256 42"
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
                      fill="#101218"
                      stroke={lineStroke("cuello")}
                      strokeWidth="1"
                    />
                    <text
                      x="210"
                      y="24.5"
                      textAnchor="middle"
                      fill={
                        measurements.cuello || focusedMeasure === "cuello"
                          ? "#C8A97E"
                          : "#9CA3AF"
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
                      x1="128"
                      y1="176"
                      x2="292"
                      y2="176"
                      stroke={lineStroke("pecho")}
                      strokeWidth={focusedMeasure === "pecho" ? 2.2 : 1.3}
                      strokeDasharray={measurements.pecho ? "0" : "4 3"}
                    />
                    <rect
                      x="170"
                      y="165"
                      width="80"
                      height="22"
                      rx="11"
                      fill="#101218"
                      stroke={lineStroke("pecho")}
                      strokeWidth="1"
                    />
                    <text
                      x="210"
                      y="179.5"
                      textAnchor="middle"
                      fill={
                        measurements.pecho || focusedMeasure === "pecho"
                          ? "#C8A97E"
                          : "#9CA3AF"
                      }
                      fontSize="10.5"
                      fontFamily="monospace"
                    >
                      {formatLiveCm(measurements.pecho)}
                    </text>
                  </g>

                  {/* LIVE MEASUREMENT 3: MANGA */}
                  <g>
                    <line
                      x1="292"
                      y1="66"
                      x2="372"
                      y2="140"
                      stroke={lineStroke("manga")}
                      strokeWidth={focusedMeasure === "manga" ? 2.2 : 1.3}
                    />
                    <rect
                      x="324"
                      y="64"
                      width="76"
                      height="22"
                      rx="11"
                      fill="#101218"
                      stroke={lineStroke("manga")}
                      strokeWidth="1"
                    />
                    <text
                      x="362"
                      y="78.5"
                      textAnchor="middle"
                      fill={
                        measurements.manga || focusedMeasure === "manga"
                          ? "#C8A97E"
                          : "#9CA3AF"
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
                      x1="96"
                      y1="62"
                      x2="96"
                      y2="296"
                      stroke={lineStroke("largo")}
                      strokeWidth={focusedMeasure === "largo" ? 2.2 : 1.3}
                      strokeDasharray={measurements.largo ? "0" : "4 3"}
                    />
                    <rect
                      x="14"
                      y="214"
                      width="74"
                      height="22"
                      rx="11"
                      fill="#101218"
                      stroke={lineStroke("largo")}
                      strokeWidth="1"
                    />
                    <text
                      x="51"
                      y="228.5"
                      textAnchor="middle"
                      fill={
                        measurements.largo || focusedMeasure === "largo"
                          ? "#C8A97E"
                          : "#9CA3AF"
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
                  className="cursor-pointer flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-ivory px-6 py-3 text-xs font-semibold tracking-[0.06em] text-obsidian uppercase transition-transform duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
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
                  className="flex min-h-[44px] w-full items-center justify-center gap-1.5 text-xs font-medium text-muted transition-colors hover:text-champagne"
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
