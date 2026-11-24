"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowDown,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  Sparkles,
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
import {
  formatFabricPrice,
  type FabricCategoryId,
} from "@/data/fabrics";
import { useAtelier } from "@/context/AtelierContext";

type MeasureKey = keyof BespokeMeasurements;
type ActiveHotspot = "collar" | "button" | null;

const BUILDER_CATEGORIES: { id: FabricCategoryId | null; label: string }[] = [
  { id: null, label: "Todas" },
  { id: "urbano", label: "Algodón 100%" },
  { id: "pima", label: "Algodón Pima Peruano" },
  { id: "italiano", label: "Algodón Italiano" },
  { id: "donna", label: "Donna" },
];

const MEASURE_FIELDS: {
  key: MeasureKey;
  label: string;
  placeholder: string;
  min: number;
  max: number;
  desktopPosition: string;
}[] = [
  {
    key: "cuello",
    label: "Cuello",
    placeholder: "40",
    min: 32,
    max: 54,
    desktopPosition: "md:top-6 md:left-6",
  },
  {
    key: "pecho",
    label: "Pecho",
    placeholder: "55",
    min: 42,
    max: 78,
    desktopPosition: "md:top-[38%] md:left-6",
  },
  {
    key: "largo",
    label: "Largo",
    placeholder: "74",
    min: 62,
    max: 94,
    desktopPosition: "md:bottom-20 md:left-6",
  },
  {
    key: "manga",
    label: "Manga",
    placeholder: "64",
    min: 52,
    max: 78,
    desktopPosition: "md:bottom-20 md:right-6",
  },
];

function CollarMiniIcon({
  collar,
  active,
}: {
  collar: CollarOption;
  active: boolean;
}) {
  const stroke = active ? "#C8A25A" : "#A1A1AA";
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 64 34"
      className="h-5 w-10 shrink-0"
      fill="none"
    >
      {collar === "Mao" ? (
        <path
          d="M 14 14 Q 32 22 50 14 L 52 24 Q 32 30 12 24 Z"
          stroke={stroke}
          strokeWidth="1.6"
        />
      ) : collar === "Francés" ? (
        <>
          <path
            d="M 14 10 L 6 24 L 30 20 Z"
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M 50 10 L 58 24 L 34 20 Z"
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
        </>
      ) : (
        <>
          <path
            d="M 16 8 L 12 27 L 30 20 Z"
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          <path
            d="M 48 8 L 52 27 L 34 20 Z"
            stroke={stroke}
            strokeWidth="1.6"
            strokeLinejoin="round"
          />
          {collar === "Button-Down" && (
            <>
              <circle cx="15" cy="23" r="1.8" fill={stroke} />
              <circle cx="49" cy="23" r="1.8" fill={stroke} />
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
  const [fabricCategory, setFabricCategory] =
    useState<FabricCategoryId | null>(null);
  const [collar, setCollar] = useState<CollarOption>("Italiano");
  const [buttonId, setButtonId] = useState<ButtonOption>("Nácar Blanco");
  const [openHotspot, setOpenHotspot] = useState<ActiveHotspot>(null);
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

  const visibleFabrics = fabricCategory
    ? CATALOG_SHIRTS.filter((s) => s.fabricId === fabricCategory)
    : CATALOG_SHIRTS;

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

  const lineStroke = (key: MeasureKey) =>
    focusedMeasure === key || measurements[key]
      ? "#C8A25A"
      : "rgba(255, 255, 255, 0.24)";

  const isLight = Boolean(selectedShirt.isLightFabric);
  const seamColor = isLight
    ? "rgba(17, 17, 19, 0.28)"
    : "rgba(255, 255, 255, 0.22)";
  const cuffShade = isLight
    ? "rgba(17, 17, 19, 0.08)"
    : "rgba(17, 17, 19, 0.44)";

  return (
    <section
      id="arma-tu-camisa"
      aria-labelledby="builder-heading"
      className="relative w-full scroll-mt-24 border-t border-white/10 bg-[#161619] text-[#F5F5F7] py-20 sm:py-24 lg:py-28"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 atelier-grain opacity-60" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-5 sm:px-8">
        {/* Centered Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-3 inline-flex items-center gap-3">
            <span aria-hidden="true" className="h-[1px] w-7 bg-gold" />
            <span className="text-xs font-medium tracking-[0.18em] text-gold uppercase">
              Confección a medida sin cargo
            </span>
            <span aria-hidden="true" className="h-[1px] w-7 bg-gold" />
          </div>

          <h2
            id="builder-heading"
            className="font-display text-[clamp(2rem,4.4vw,3.4rem)] font-bold leading-[1.03] tracking-[-0.035em] text-[#F5F5F7]"
          >
            Armá tu camisa
          </h2>

          <p className="mt-3 text-base text-muted">
            Tocá cuello, botones o cargá tus medidas directamente sobre la
            prenda.
          </p>

          {/* Active Shirt Summary Pill */}
          <div className="mt-5 inline-flex flex-wrap items-center justify-center gap-2.5 rounded-full border border-white/12 bg-[#1B1B1F] px-4 py-2 text-xs">
            <span className="font-semibold text-[#F5F5F7]">
              {selectedShirt.name}
            </span>
            <span className="text-white/25" aria-hidden="true">
              ·
            </span>
            <span className="font-mono text-[11px] text-muted">
              {selectedShirt.refCode}
            </span>
            <span className="text-white/25" aria-hidden="true">
              ·
            </span>
            <span className="font-semibold text-gold tabular-nums">
              {formatFabricPrice(selectedShirt.priceArs, currency)}
            </span>
          </div>
        </div>

        {/* CENTERED INTERACTIVE SHIRT STAGE */}
        <div className="relative mt-10 rounded-3xl border border-white/10 bg-[#1B1B1F] p-5 sm:p-7 shadow-[0_32px_90px_rgba(0,0,0,0.6)]">
          {/* Desktop Floating Hotspots + Centered Long-Sleeve Shirt */}
          <div className="relative flex flex-col items-center justify-center md:min-h-[480px]">
            {/* HOTSPOT 1: CUELLO (Top-Right on Desktop, Inline Top on Mobile) */}
            <div className="z-30 mb-3 w-full md:mb-0 md:w-auto md:absolute md:top-5 md:right-5">
              <button
                id="hotspot-collar-btn"
                type="button"
                aria-expanded={openHotspot === "collar"}
                onClick={() =>
                  setOpenHotspot((prev) => (prev === "collar" ? null : "collar"))
                }
                className={`cursor-pointer flex min-h-[44px] w-full md:w-auto items-center justify-between gap-2.5 rounded-full border px-4 py-2 text-xs font-medium backdrop-blur-md transition-all ${
                  openHotspot === "collar"
                    ? "border-gold bg-gold text-[#111113] font-semibold"
                    : "border-gold/45 bg-[#141417]/92 text-[#F5F5F7] hover:border-gold"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-current" />
                  <span>Cuello: {collar}</span>
                </span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform ${
                    openHotspot === "collar" ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>

              <AnimatePresence>
                {openHotspot === "collar" && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.18 }}
                    className="mt-2 grid grid-cols-2 gap-1.5 rounded-2xl border border-white/12 bg-[#111113]/96 p-2 shadow-2xl backdrop-blur-xl md:w-[250px]"
                  >
                    {COLLAR_OPTIONS.map((option) => {
                      const active = collar === option;
                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => {
                            setCollar(option);
                            setOpenHotspot(null);
                          }}
                          className={`cursor-pointer flex min-h-[44px] flex-col items-center justify-center gap-1 rounded-xl border px-2 py-2 text-[11px] font-medium transition-colors ${
                            active
                              ? "border-gold bg-gold/15 text-[#F5F5F7]"
                              : "border-white/10 bg-[#1B1B1F] text-muted hover:text-[#F5F5F7]"
                          }`}
                        >
                          <CollarMiniIcon collar={option} active={active} />
                          <span>{option}</span>
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* HOTSPOT 2: BOTONES (Mid-Right on Desktop, Inline Top on Mobile) */}
            <div className="z-20 mb-4 w-full md:mb-0 md:w-auto md:absolute md:top-[36%] md:right-5">
              <button
                id="hotspot-button-btn"
                type="button"
                aria-expanded={openHotspot === "button"}
                onClick={() =>
                  setOpenHotspot((prev) => (prev === "button" ? null : "button"))
                }
                className={`cursor-pointer flex min-h-[44px] w-full md:w-auto items-center justify-between gap-2.5 rounded-full border px-4 py-2 text-xs font-medium backdrop-blur-md transition-all ${
                  openHotspot === "button"
                    ? "border-gold bg-gold text-[#111113] font-semibold"
                    : "border-gold/45 bg-[#141417]/92 text-[#F5F5F7] hover:border-gold"
                }`}
              >
                <span className="flex items-center gap-2">
                  <span
                    className="h-3 w-3 rounded-full border"
                    style={{
                      backgroundColor: selectedButton.fill,
                      borderColor: selectedButton.ring,
                    }}
                  />
                  <span>Botón: {buttonId}</span>
                </span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform ${
                    openHotspot === "button" ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>

              <AnimatePresence>
                {openHotspot === "button" && (
                  <motion.div
                    initial={{ opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 4 }}
                    transition={{ duration: 0.18 }}
                    className="mt-2 grid grid-cols-2 gap-1.5 rounded-2xl border border-white/12 bg-[#111113]/96 p-2 shadow-2xl backdrop-blur-xl md:w-[260px]"
                  >
                    {BUTTON_OPTIONS.map((btn) => {
                      const active = buttonId === btn.id;
                      return (
                        <button
                          key={btn.id}
                          type="button"
                          onClick={() => {
                            setButtonId(btn.id);
                            setOpenHotspot(null);
                          }}
                          className={`cursor-pointer flex min-h-[44px] items-center gap-2 rounded-xl border px-2.5 py-2 text-left text-[11px] font-medium transition-colors ${
                            active
                              ? "border-gold bg-gold/15 text-[#F5F5F7]"
                              : "border-white/10 bg-[#1B1B1F] text-muted hover:text-[#F5F5F7]"
                          }`}
                        >
                          <span
                            className="h-4 w-4 shrink-0 rounded-full border"
                            style={{
                              backgroundColor: btn.fill,
                              borderColor: btn.ring,
                            }}
                          />
                          <span className="leading-tight">{btn.label}</span>
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* PROTAGONIST CENTERED LONG-SLEEVE SHIRT SVG */}
            <div className="relative w-full max-w-[430px] py-2">
              <svg
                viewBox="0 0 420 385"
                className="mx-auto h-auto w-full"
                role="img"
                aria-label={`Modelo interactivo manga larga de ${selectedShirt.name}`}
              >
                <defs>
                  <radialGradient
                    id="builder-v6-grad"
                    cx="60%"
                    cy="24%"
                    r="82%"
                  >
                    <stop offset="0%" stopColor={selectedShirt.secondaryHex} />
                    <stop offset="100%" stopColor={selectedShirt.baseHex} />
                  </radialGradient>
                </defs>

                {/* Full Long-Sleeve Dress Shirt Silhouette */}
                <path
                  d="M 166 58 Q 210 74 254 58 L 288 74 L 346 296 L 312 306 L 278 164 L 278 332 Q 210 346 142 332 L 142 164 L 108 306 L 74 296 L 132 74 Z"
                  fill="url(#builder-v6-grad)"
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
                <rect x="199" y="74" width="22" height="264" fill={cuffShade} />

                {/* Dynamic Collar */}
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

                {/* Dynamic Placket Buttons */}
                {[112, 160, 208, 256, 304].map((cy) => (
                  <g key={cy} transform={`translate(210, ${cy})`}>
                    <circle
                      r="4.8"
                      fill={selectedButton.fill}
                      stroke={selectedButton.ring}
                      strokeWidth="0.9"
                    />
                    <circle r="1.2" fill={selectedButton.thread} />
                  </g>
                ))}

                {/* Live Embroidered Initials */}
                {monogramDisplay && (
                  <text
                    x={monogramPlacement === "Pechera" ? 248 : 319}
                    y={monogramPlacement === "Pechera" ? 140 : 296}
                    textAnchor="middle"
                    fill="#C8A25A"
                    fontSize={monogramPlacement === "Pechera" ? "13" : "9.5"}
                    fontFamily="Georgia, serif"
                    fontStyle="italic"
                    fontWeight="600"
                  >
                    {monogramDisplay}
                  </text>
                )}

                {/* Illuminated Measurement Lines on the Shirt */}
                {/* Cuello */}
                <path
                  d="M 166 44 Q 210 58 254 44"
                  fill="none"
                  stroke={lineStroke("cuello")}
                  strokeWidth={focusedMeasure === "cuello" ? 2.4 : 1.3}
                />
                {/* Pecho */}
                <line
                  x1="142"
                  y1="184"
                  x2="278"
                  y2="184"
                  stroke={lineStroke("pecho")}
                  strokeWidth={focusedMeasure === "pecho" ? 2.4 : 1.3}
                  strokeDasharray={measurements.pecho ? "0" : "4 3"}
                />
                {/* Manga Larga */}
                <line
                  x1="296"
                  y1="70"
                  x2="356"
                  y2="294"
                  stroke={lineStroke("manga")}
                  strokeWidth={focusedMeasure === "manga" ? 2.4 : 1.3}
                />
                {/* Largo */}
                <line
                  x1="54"
                  y1="62"
                  x2="54"
                  y2="338"
                  stroke={lineStroke("largo")}
                  strokeWidth={focusedMeasure === "largo" ? 2.4 : 1.3}
                  strokeDasharray={measurements.largo ? "0" : "4 3"}
                />
              </svg>
            </div>

            {/* 4 FLOATING COMPACT cm INPUTS (Floating beside zones on md+, clean 2x2 grid on mobile) */}
            <div className="mt-4 grid w-full grid-cols-2 gap-2.5 md:mt-0 md:contents">
              {MEASURE_FIELDS.map((field) => {
                const val = measurements[field.key];
                const isFocused = focusedMeasure === field.key;
                return (
                  <div
                    key={field.key}
                    className={`z-10 md:absolute ${field.desktopPosition} md:w-[152px]`}
                  >
                    <label
                      htmlFor={`measure-input-${field.key}`}
                      className={`flex min-h-[44px] items-center justify-between gap-2 rounded-xl border bg-[#111113]/92 px-3 py-1.5 backdrop-blur-md transition-colors ${
                        isFocused || val
                          ? "border-gold"
                          : "border-white/12 hover:border-white/25"
                      }`}
                    >
                      <span className="text-[11px] font-medium text-muted">
                        {field.label}
                      </span>
                      <span className="flex items-center gap-1">
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
                          className="w-10 bg-transparent text-right font-mono text-sm font-medium text-[#F5F5F7] placeholder:text-muted/40 focus:outline-none"
                        />
                        <span className="font-mono text-[10px] text-gold">
                          cm
                        </span>
                      </span>
                    </label>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Inline Range Validation */}
          {invalidField && (
            <p
              role="alert"
              className="mt-3 text-center text-xs text-amber-300"
            >
              Revisá {invalidField.label}: el rango habitual es entre{" "}
              <span className="font-mono">
                {invalidField.min} y {invalidField.max} cm
              </span>
              .
            </p>
          )}

          {/* Compact Monogram Bar at Base of Stage */}
          <div className="mt-5 flex flex-col gap-3 border-t border-white/10 pt-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-xs text-muted">
              <Sparkles className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
              <span>Iniciales bordadas sin cargo:</span>
            </div>

            <div className="flex flex-wrap items-center gap-2">
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
                aria-label="Iniciales bordadas"
                className="min-h-[44px] w-24 rounded-xl border border-white/12 bg-[#111113] px-3 text-center text-xs tracking-[0.22em] text-gold uppercase placeholder:tracking-normal placeholder:text-muted/45 focus:border-gold focus:outline-none"
              />

              <div className="inline-flex rounded-xl border border-white/10 bg-[#111113] p-1">
                {MONOGRAM_PLACEMENTS.map((place) => {
                  const active = monogramPlacement === place;
                  return (
                    <button
                      key={place}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setMonogramPlacement(place)}
                      className={`cursor-pointer min-h-[36px] rounded-lg px-3 text-[11px] font-medium transition-colors ${
                        active
                          ? "bg-gold text-[#111113] font-semibold"
                          : "text-muted hover:text-[#F5F5F7]"
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

        {/* BELOW SHIRT: CENTERED HORIZONTAL FABRIC CAROUSEL */}
        <div className="mt-8">
          {/* Sector Category Tabs (Centered) */}
          <div
            role="tablist"
            aria-label="Categorías de tela"
            className="scrollbar-none flex items-center justify-start sm:justify-center gap-1.5 overflow-x-auto pb-2"
          >
            {BUILDER_CATEGORIES.map((cat) => {
              const active = fabricCategory === cat.id;
              return (
                <button
                  key={cat.label}
                  id={`builder-cat-${cat.id ?? "all"}`}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => {
                    setFabricCategory(cat.id);
                    if (cat.id) {
                      const firstInCat = CATALOG_SHIRTS.find(
                        (s) => s.fabricId === cat.id
                      );
                      if (firstInCat) setBuilderShirtId(firstInCat.id);
                    }
                  }}
                  className={`cursor-pointer shrink-0 min-h-[44px] rounded-full border px-4 text-xs font-medium transition-colors ${
                    active
                      ? "border-gold bg-gold text-[#111113] font-semibold"
                      : "border-white/10 bg-[#1B1B1F] text-muted hover:border-white/30 hover:text-[#F5F5F7]"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Horizontal Square Swatches Carousel with Arrows */}
          <div className="mt-4 flex items-center gap-2">
            <button
              type="button"
              aria-label="Desplazar telas a la izquierda"
              onClick={() => scrollFabricRail(-1)}
              className="cursor-pointer hidden sm:inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-[#1B1B1F] text-muted transition-colors hover:border-gold/60 hover:text-white"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>

            <div
              ref={fabricRailRef}
              className="scrollbar-none flex flex-1 gap-3.5 overflow-x-auto px-1 py-1 snap-x snap-mandatory sm:justify-center"
            >
              {visibleFabrics.map((shirt) => {
                const active = shirt.id === selectedShirt.id;
                const shortName = shirt.name.split(" ").slice(0, 2).join(" ");
                return (
                  <button
                    key={shirt.id}
                    id={`builder-fabric-${shirt.id}`}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setBuilderShirtId(shirt.id)}
                    className="cursor-pointer group snap-start shrink-0 w-[104px] text-left focus-visible:outline-none"
                  >
                    <div
                      className={`relative h-24 w-24 rounded-2xl border transition-all ${
                        active
                          ? "border-gold ring-2 ring-gold/45 shadow-[0_10px_24px_rgba(0,0,0,0.6)]"
                          : "border-white/12 group-hover:border-white/40"
                      }`}
                      style={{
                        background: `linear-gradient(135deg, ${shirt.secondaryHex} 0%, ${shirt.baseHex} 100%)`,
                      }}
                    >
                      {active && (
                        <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-gold text-[#111113]">
                          <Check className="h-3 w-3" aria-hidden="true" />
                        </span>
                      )}
                    </div>

                    <p
                      className={`mt-2 text-xs font-semibold leading-tight line-clamp-1 ${
                        active ? "text-[#F5F5F7]" : "text-[#F5F5F7]/75"
                      }`}
                    >
                      {shortName}
                    </p>
                    <p className="mt-0.5 font-mono text-[10px] text-muted line-clamp-1">
                      {shirt.refCode}
                    </p>
                    <p className="mt-0.5 text-xs font-medium text-gold tabular-nums">
                      {formatFabricPrice(shirt.priceArs, currency)}
                    </p>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              aria-label="Desplazar telas a la derecha"
              onClick={() => scrollFabricRail(1)}
              className="cursor-pointer hidden sm:inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-white/10 bg-[#1B1B1F] text-muted transition-colors hover:border-gold/60 hover:text-white"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* CENTERED PROTAGONIST GOLD CTA */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <button
            id="builder-add-bespoke-btn"
            type="button"
            disabled={Boolean(invalidField)}
            onClick={handleAddBespoke}
            className="cursor-pointer inline-flex min-h-[50px] w-full sm:w-auto sm:min-w-[340px] items-center justify-center gap-2.5 rounded-full bg-gold px-8 py-3.5 text-xs font-semibold tracking-[0.08em] text-[#111113] uppercase transition-all duration-200 hover:-translate-y-0.5 hover:bg-gold-hover disabled:cursor-not-allowed disabled:opacity-50"
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
            className="inline-flex min-h-[44px] items-center gap-1.5 text-xs font-medium text-muted transition-colors hover:text-gold"
          >
            <span>¿No sabés cómo tomar tus medidas? Ver guía rápida</span>
            <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
