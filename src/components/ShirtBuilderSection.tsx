"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import {
  ArrowDown,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
} from "lucide-react";
import {
  BUTTON_OPTIONS,
  CATALOG_SHIRTS,
  COLLAR_OPTIONS,
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
import { useMotion } from "@/context/MotionContext";

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
  const stroke = active ? "#FFFFFF" : "#A1A1AA";
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
  const { isMotionPaused } = useMotion();

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

  const foundIndex = visibleFabrics.findIndex((s) => s.id === builderShirtId);
  const activeIndex = foundIndex >= 0 ? foundIndex : 0;
  const selectedShirt = visibleFabrics[activeIndex] ?? CATALOG_SHIRTS[0];

  const selectedButton =
    BUTTON_OPTIONS.find((b) => b.id === buttonId) ?? BUTTON_OPTIONS[0];
  const monogramDisplay = formatMonogramDisplay(monogramText);

  const stepArc = (delta: -1 | 1) => {
    const nextIdx = Math.min(
      Math.max(activeIndex + delta, 0),
      visibleFabrics.length - 1
    );
    const nextShirt = visibleFabrics[nextIdx];
    if (nextShirt) setBuilderShirtId(nextShirt.id);
  };

  const handleArcDragEnd = (
    _: MouseEvent | TouchEvent | PointerEvent,
    info: PanInfo
  ) => {
    if (info.offset.x < -40) stepArc(1);
    else if (info.offset.x > 40) stepArc(-1);
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
      ? "#FFFFFF"
      : "rgba(255, 255, 255, 0.22)";

  const isLight = Boolean(selectedShirt.isLightFabric);
  const seamColor = isLight
    ? "rgba(11, 11, 14, 0.26)"
    : "rgba(255, 255, 255, 0.22)";
  const cuffShade = isLight
    ? "rgba(11, 11, 14, 0.08)"
    : "rgba(11, 11, 14, 0.44)";

  return (
    <section
      id="arma-tu-camisa"
      aria-labelledby="builder-heading"
      className="relative w-full scroll-mt-24 overflow-hidden bg-[#0B0B0E] text-white py-20 sm:py-24 lg:py-28"
    >
      {/* Subtle Ambient Liquid Light Halo behind Floating Garment */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute top-[22%] left-1/2 -translate-x-1/2 h-[520px] w-[520px] rounded-full opacity-30 blur-[150px]"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(214,195,165,0.06) 48%, rgba(11,11,14,0) 74%)",
          }}
        />
        <div className="absolute inset-0 atelier-grain opacity-55" />
      </div>

      <div className="relative z-10 mx-auto max-w-5xl px-5 sm:px-8">
        {/* Centered Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="mb-3 inline-flex items-center gap-3">
            <span aria-hidden="true" className="h-[1px] w-7 bg-white/35" />
            <span className="text-xs font-medium tracking-[0.2em] text-white/70 uppercase">
              Confección a medida sin cargo
            </span>
            <span aria-hidden="true" className="h-[1px] w-7 bg-white/35" />
          </div>

          <h2
            id="builder-heading"
            className="font-display text-[clamp(2rem,4.4vw,3.4rem)] font-bold leading-[1.03] tracking-[-0.035em] text-white"
          >
            Armá tu camisa
          </h2>

          <p className="mt-3 text-base text-muted">
            Tocá cuello, botones o deslizá el arco de telas para personalizarla
            en vivo.
          </p>
        </div>

        {/* BOXLESS FLOATING SHIRT STAGE (No Giant Outer Rectangle) */}
        <div className="relative mt-10 flex flex-col items-center">
          {/* Top-Side Liquid Glass Hotspots (Cuello & Botón) */}
          <div className="z-30 mb-4 flex w-full flex-col gap-2.5 sm:flex-row sm:justify-center md:mb-0">
            {/* Hotspot 1: Cuello */}
            <div className="relative md:absolute md:top-6 md:right-4">
              <button
                id="hotspot-collar-btn"
                type="button"
                aria-expanded={openHotspot === "collar"}
                onClick={() =>
                  setOpenHotspot((prev) => (prev === "collar" ? null : "collar"))
                }
                className={`cursor-pointer flex min-h-[44px] w-full sm:w-auto items-center justify-between gap-2.5 rounded-full px-4 py-2 text-xs font-medium transition-all ${
                  openHotspot === "collar"
                    ? "bg-white text-[#0B0B0E] font-semibold"
                    : "liquid-glass text-white hover:bg-white/[0.12]"
                }`}
              >
                <span>Cuello: {collar}</span>
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
                    className="liquid-glass-active mt-2 grid grid-cols-2 gap-1.5 rounded-2xl p-2 md:absolute md:right-0 md:w-[250px]"
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
                          className={`cursor-pointer flex min-h-[44px] flex-col items-center justify-center gap-1 rounded-xl px-2 py-2 text-[11px] font-medium transition-colors ${
                            active
                              ? "bg-white text-[#0B0B0E] font-semibold"
                              : "bg-white/[0.05] text-white/80 hover:bg-white/[0.12] hover:text-white"
                          }`}
                        >
                          <CollarMiniIcon collar={option} active={!active} />
                          <span>{option}</span>
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Hotspot 2: Botones */}
            <div className="relative md:absolute md:top-24 md:right-4">
              <button
                id="hotspot-button-btn"
                type="button"
                aria-expanded={openHotspot === "button"}
                onClick={() =>
                  setOpenHotspot((prev) => (prev === "button" ? null : "button"))
                }
                className={`cursor-pointer flex min-h-[44px] w-full sm:w-auto items-center justify-between gap-2.5 rounded-full px-4 py-2 text-xs font-medium transition-all ${
                  openHotspot === "button"
                    ? "bg-white text-[#0B0B0E] font-semibold"
                    : "liquid-glass text-white hover:bg-white/[0.12]"
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
                    className="liquid-glass-active mt-2 grid grid-cols-2 gap-1.5 rounded-2xl p-2 md:absolute md:right-0 md:w-[260px]"
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
                          className={`cursor-pointer flex min-h-[44px] items-center gap-2 rounded-xl px-2.5 py-2 text-left text-[11px] font-medium transition-colors ${
                            active
                              ? "bg-white text-[#0B0B0E] font-semibold"
                              : "bg-white/[0.05] text-white/80 hover:bg-white/[0.12] hover:text-white"
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
          </div>

          {/* Floating Long-Sleeve Shirt Model (Zero Outer Box) */}
          <div className="relative w-full max-w-[440px]">
            <svg
              viewBox="0 0 420 385"
              className="mx-auto h-auto w-full drop-shadow-[0_32px_60px_rgba(0,0,0,0.75)]"
              role="img"
              aria-label={`Camisa flotante manga larga ${selectedShirt.name}`}
            >
              <defs>
                <radialGradient
                  id="builder-v7-grad"
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
                fill="url(#builder-v7-grad)"
                stroke={seamColor}
                strokeWidth="1.4"
                strokeLinejoin="round"
              />

              {/* Armholes */}
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

              {/* Left Cuff (Viewer Right) */}
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

              {/* Embroidered Initials */}
              {monogramDisplay && (
                <text
                  x={monogramPlacement === "Pechera" ? 248 : 319}
                  y={monogramPlacement === "Pechera" ? 140 : 296}
                  textAnchor="middle"
                  fill="#D6C3A5"
                  fontSize={monogramPlacement === "Pechera" ? "13" : "9.5"}
                  fontFamily="Georgia, serif"
                  fontStyle="italic"
                  fontWeight="600"
                >
                  {monogramDisplay}
                </text>
              )}

              {/* Live Illuminated Measurement Callouts */}
              {/* Cuello */}
              <g>
                <path
                  d="M 166 44 Q 210 58 254 44"
                  fill="none"
                  stroke={lineStroke("cuello")}
                  strokeWidth={focusedMeasure === "cuello" ? 2.2 : 1.2}
                />
                <text
                  x="210"
                  y="28"
                  textAnchor="middle"
                  fill={
                    measurements.cuello || focusedMeasure === "cuello"
                      ? "#FFFFFF"
                      : "rgba(255,255,255,0.45)"
                  }
                  fontSize="10.5"
                  fontFamily="monospace"
                >
                  {formatLiveCm(measurements.cuello)}
                </text>
              </g>

              {/* Pecho */}
              <g>
                <line
                  x1="142"
                  y1="184"
                  x2="278"
                  y2="184"
                  stroke={lineStroke("pecho")}
                  strokeWidth={focusedMeasure === "pecho" ? 2.2 : 1.2}
                  strokeDasharray={measurements.pecho ? "0" : "4 3"}
                />
                <text
                  x="210"
                  y="174"
                  textAnchor="middle"
                  fill={
                    measurements.pecho || focusedMeasure === "pecho"
                      ? "#FFFFFF"
                      : "rgba(255,255,255,0.45)"
                  }
                  fontSize="10.5"
                  fontFamily="monospace"
                >
                  {formatLiveCm(measurements.pecho)}
                </text>
              </g>

              {/* Manga */}
              <g>
                <line
                  x1="296"
                  y1="70"
                  x2="356"
                  y2="294"
                  stroke={lineStroke("manga")}
                  strokeWidth={focusedMeasure === "manga" ? 2.2 : 1.2}
                />
                <text
                  x="374"
                  y="184"
                  textAnchor="middle"
                  fill={
                    measurements.manga || focusedMeasure === "manga"
                      ? "#FFFFFF"
                      : "rgba(255,255,255,0.45)"
                  }
                  fontSize="10.5"
                  fontFamily="monospace"
                >
                  {formatLiveCm(measurements.manga)}
                </text>
              </g>

              {/* Largo */}
              <g>
                <line
                  x1="54"
                  y1="62"
                  x2="54"
                  y2="338"
                  stroke={lineStroke("largo")}
                  strokeWidth={focusedMeasure === "largo" ? 2.2 : 1.2}
                  strokeDasharray={measurements.largo ? "0" : "4 3"}
                />
                <text
                  x="32"
                  y="202"
                  textAnchor="middle"
                  fill={
                    measurements.largo || focusedMeasure === "largo"
                      ? "#FFFFFF"
                      : "rgba(255,255,255,0.45)"
                  }
                  fontSize="10.5"
                  fontFamily="monospace"
                >
                  {formatLiveCm(measurements.largo)}
                </text>
              </g>
            </svg>
          </div>

          {/* SINGLE COMPACT LIQUID GLASS MEASUREMENTS & MONOGRAM DOCK */}
          <div className="liquid-glass mt-4 w-full max-w-3xl rounded-3xl p-4 sm:p-5">
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
              {MEASURE_FIELDS.map((field) => {
                const val = measurements[field.key];
                const isFocused = focusedMeasure === field.key;
                return (
                  <label
                    key={field.key}
                    htmlFor={`measure-input-${field.key}`}
                    className={`flex min-h-[44px] flex-col justify-center rounded-2xl px-3 py-2 transition-colors ${
                      isFocused || val
                        ? "bg-white/[0.12] ring-1 ring-white/35"
                        : "bg-white/[0.04] hover:bg-white/[0.07]"
                    }`}
                  >
                    <span className="text-[10px] font-medium text-white/55">
                      {field.label}
                    </span>
                    <span className="mt-0.5 flex items-baseline gap-1">
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
                        className="w-full bg-transparent font-mono text-sm font-medium text-white placeholder:text-white/30 focus:outline-none"
                      />
                      <span className="font-mono text-[10px] text-white/50">
                        cm
                      </span>
                    </span>
                  </label>
                );
              })}

              {/* Compact Monogram Input inside the same Dock */}
              <div className="col-span-2 sm:col-span-1 flex flex-col justify-center rounded-2xl bg-white/[0.04] px-3 py-2">
                <div className="flex items-center justify-between gap-1">
                  <label
                    htmlFor="builder-monogram-input"
                    className="text-[10px] font-medium text-white/55"
                  >
                    Iniciales
                  </label>
                  <button
                    type="button"
                    onClick={() =>
                      setMonogramPlacement((prev) =>
                        prev === "Puño izquierdo"
                          ? "Pechera"
                          : "Puño izquierdo"
                      )
                    }
                    className="cursor-pointer text-[9.5px] font-medium text-white/75 underline decoration-white/30 hover:text-white"
                  >
                    {monogramPlacement === "Puño izquierdo"
                      ? "Puño"
                      : "Pechera"}
                  </button>
                </div>
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
                  placeholder="C.M."
                  className="mt-0.5 w-full bg-transparent text-sm font-medium tracking-[0.2em] text-champagne uppercase placeholder:tracking-normal placeholder:text-white/30 focus:outline-none"
                />
              </div>
            </div>

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
          </div>
        </div>

        {/* CURVED HORIZONTAL FABRIC ARC ︶ */}
        <div className="mt-10">
          {/* Sector Category Tabs (Liquid Glass) */}
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
                  className={`cursor-pointer shrink-0 min-h-[44px] rounded-full px-4 text-xs font-medium transition-all ${
                    active
                      ? "bg-white text-[#0B0B0E] font-semibold"
                      : "bg-white/[0.05] text-white/70 border border-white/10 hover:bg-white/[0.12] hover:text-white"
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* Interactive Parabolic Smile Arc ︶ */}
          <div className="relative mt-4 flex items-center justify-center">
            <button
              type="button"
              aria-label="Tela anterior"
              disabled={activeIndex === 0}
              onClick={() => stepArc(-1)}
              className="cursor-pointer liquid-glass z-30 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white transition-all hover:bg-white/[0.14] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" aria-hidden="true" />
            </button>

            <motion.div
              drag={isMotionPaused ? false : "x"}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.18}
              onDragEnd={handleArcDragEnd}
              className="relative mx-2 h-[225px] flex-1 overflow-hidden cursor-grab active:cursor-grabbing"
            >
              {/* Subtle Curved Smile Guide Line ︶ */}
              <svg
                aria-hidden="true"
                viewBox="0 0 600 120"
                className="pointer-events-none absolute inset-x-0 bottom-4 mx-auto h-24 w-full max-w-[560px] opacity-25"
                fill="none"
              >
                <path
                  d="M 20 18 Q 300 132 580 18"
                  stroke="rgba(255,255,255,0.45)"
                  strokeWidth="1"
                  strokeDasharray="3 5"
                />
              </svg>

              {visibleFabrics.map((shirt, index) => {
                const d = index - activeIndex;
                const absD = Math.abs(d);
                const isSelected = d === 0;
                const shortName = shirt.name.split(" ").slice(0, 2).join(" ");

                // Parabolic smile curve ︶: sides curve gently up & outward
                const x = d * 124;
                const y = -Math.pow(absD, 1.65) * 18;
                const rotate = d * -5.5;
                const scale = isSelected
                  ? 1.15
                  : Math.max(0.76, 1 - absD * 0.12);
                const opacity =
                  absD > 3 ? 0 : Math.max(0.32, 1 - absD * 0.24);

                return (
                  <motion.button
                    key={shirt.id}
                    id={`builder-fabric-${shirt.id}`}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setBuilderShirtId(shirt.id)}
                    initial={false}
                    animate={{
                      x,
                      y,
                      rotate,
                      scale,
                      opacity,
                    }}
                    transition={
                      isMotionPaused
                        ? { duration: 0 }
                        : { type: "spring", stiffness: 280, damping: 26 }
                    }
                    style={{
                      zIndex: 20 - absD,
                      pointerEvents: absD > 3 ? "none" : "auto",
                    }}
                    className="cursor-pointer absolute bottom-4 left-1/2 -ml-[52px] flex w-[104px] flex-col items-center text-center focus-visible:outline-none"
                  >
                    <div
                      className={`relative h-24 w-24 rounded-2xl transition-shadow ${
                        isSelected
                          ? "ring-2 ring-white shadow-[0_20px_45px_rgba(255,255,255,0.22)]"
                          : "border border-white/20 shadow-[0_12px_28px_rgba(0,0,0,0.5)]"
                      }`}
                      style={{
                        background: `linear-gradient(135deg, ${shirt.secondaryHex} 0%, ${shirt.baseHex} 100%)`,
                      }}
                    >
                      {isSelected && (
                        <span className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[#0B0B0E] shadow-sm">
                          <Check className="h-3 w-3" aria-hidden="true" />
                        </span>
                      )}
                    </div>

                    <p
                      className={`mt-2.5 text-xs font-semibold leading-tight line-clamp-1 ${
                        isSelected ? "text-white" : "text-white/65"
                      }`}
                    >
                      {shortName}
                    </p>
                    <p className="mt-0.5 font-mono text-[10px] text-white/50 line-clamp-1">
                      {shirt.refCode}
                    </p>
                    <p
                      className={`mt-0.5 text-xs tabular-nums ${
                        isSelected
                          ? "font-semibold text-white"
                          : "text-white/55"
                      }`}
                    >
                      {formatFabricPrice(shirt.priceArs, currency)}
                    </p>
                  </motion.button>
                );
              })}
            </motion.div>

            <button
              type="button"
              aria-label="Siguiente tela"
              disabled={activeIndex >= visibleFabrics.length - 1}
              onClick={() => stepArc(1)}
              className="cursor-pointer liquid-glass z-30 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white transition-all hover:bg-white/[0.14] disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        </div>

        {/* CENTERED CRYSTALLINE WHITE PRIMARY CTA */}
        <div className="mt-8 flex flex-col items-center gap-3">
          <button
            id="builder-add-bespoke-btn"
            type="button"
            disabled={Boolean(invalidField)}
            onClick={handleAddBespoke}
            className="cursor-pointer inline-flex min-h-[50px] w-full sm:w-auto sm:min-w-[340px] items-center justify-center gap-2.5 rounded-full bg-white px-8 py-3.5 text-xs font-semibold tracking-[0.08em] text-[#0B0B0E] uppercase shadow-[0_14px_36px_rgba(255,255,255,0.16)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
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
            className="inline-flex min-h-[44px] items-center gap-1.5 text-xs font-medium text-white/60 transition-colors hover:text-white"
          >
            <span>¿No sabés cómo tomar tus medidas? Ver guía rápida</span>
            <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
