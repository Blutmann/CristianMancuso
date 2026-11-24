"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, type PanInfo } from "framer-motion";
import {
  ArrowDown,
  ArrowRight,
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
import {
  formatFabricPrice,
  type FabricCategoryId,
} from "@/data/fabrics";
import { useAtelier } from "@/context/AtelierContext";
import { useMotion } from "@/context/MotionContext";

type BuilderStep = 1 | 2 | 3 | 4;
type MeasureKey = keyof BespokeMeasurements;

const STEPS: { id: BuilderStep; label: string }[] = [
  { id: 1, label: "1. Tela" },
  { id: 2, label: "2. Cuello" },
  { id: 3, label: "3. Botón & Iniciales" },
  { id: 4, label: "4. Medidas" },
];

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
  const stroke = active ? "#0B0B0E" : "#D4D4D8";
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 64 34"
      className="h-6 w-12 shrink-0"
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

  const [step, setStep] = useState<BuilderStep>(1);
  const [fabricCategory, setFabricCategory] =
    useState<FabricCategoryId | null>(null);
  const [collar, setCollar] = useState<CollarOption>("Italiano");
  const [buttonId, setButtonId] = useState<ButtonOption>("Nácar Blanco");
  const [measurements, setMeasurements] = useState<BespokeMeasurements>({
    cuello: "",
    pecho: "",
    manga: "",
    largo: "",
  });
  const [focusedMeasure, setFocusedMeasure] = useState<MeasureKey | null>(null);
  const [monogramText, setMonogramText] = useState("CM");
  const [monogramPlacement, setMonogramPlacement] =
    useState<MonogramPlacement>("Puño izquierdo");
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
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

  const handleStagePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isMotionPaused || step !== 1 || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rotateX: -ny * 14, rotateY: nx * 16 });
  };

  const handleStagePointerLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
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

  // Dynamic Camera Target per Step
  const getCameraTarget = () => {
    if (step === 2) {
      return { scale: 2.1, x: "0%", y: "26%", rotateX: 0, rotateY: 0 };
    }
    if (step === 3) {
      return monogramPlacement === "Puño izquierdo"
        ? { scale: 1.9, x: "-14%", y: "-22%", rotateX: 0, rotateY: 0 }
        : { scale: 1.9, x: "-4%", y: "8%", rotateX: 0, rotateY: 0 };
    }
    if (step === 1 && !isMotionPaused) {
      return {
        scale: 1,
        x: "0%",
        y: "0%",
        rotateX: tilt.rotateX,
        rotateY: tilt.rotateY,
      };
    }
    return { scale: 1, x: "0%", y: "0%", rotateX: 0, rotateY: 0 };
  };

  const cameraTarget = getCameraTarget();
  const formatLiveCm = (val: string) => (val ? `${val} cm` : "-- cm");

  const lineStroke = (key: MeasureKey) =>
    focusedMeasure === key || measurements[key]
      ? "#FFFFFF"
      : "rgba(255, 255, 255, 0.28)";

  const isLight = Boolean(selectedShirt.isLightFabric);
  const seamColor = isLight
    ? "rgba(7, 8, 11, 0.28)"
    : "rgba(255, 255, 255, 0.22)";
  const cuffShade = isLight
    ? "rgba(7, 8, 11, 0.08)"
    : "rgba(7, 8, 11, 0.44)";

  return (
    <section
      id="arma-tu-camisa"
      aria-labelledby="builder-heading"
      className="relative w-full scroll-mt-24 overflow-hidden bg-transparent text-white py-16 lg:py-20"
    >
      <div className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-12 xl:pr-24">
        {/* Compact Header + 4-Step Navigable Stepper */}
        <div className="flex flex-col items-center text-center">
          <h2
            id="builder-heading"
            className="font-display text-[clamp(1.9rem,3.6vw,2.9rem)] font-bold leading-tight tracking-[-0.035em] text-white"
          >
            Armá tu camisa
          </h2>

          {/* 4-Step Liquid Glass Stepper */}
          <div
            role="tablist"
            aria-label="Pasos del configurador"
            className="liquid-glass scrollbar-none mt-4 inline-flex max-w-full items-center gap-1 overflow-x-auto rounded-full p-1"
          >
            {STEPS.map((s) => {
              const active = step === s.id;
              return (
                <button
                  key={s.id}
                  id={`builder-step-${s.id}`}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setStep(s.id)}
                  className={`cursor-pointer relative shrink-0 min-h-[40px] rounded-full px-3.5 sm:px-4 text-xs font-medium transition-colors ${
                    active
                      ? "text-[#0B0B0E] font-semibold"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  {active && (
                    <motion.span
                      layoutId={
                        isMotionPaused ? undefined : "builder-step-pill"
                      }
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 32,
                      }}
                      className="absolute inset-0 rounded-full bg-white"
                    />
                  )}
                  <span className="relative z-10">{s.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* PROTAGONIST CENTRAL STAGE WITH DYNAMIC CAMERA (~65-70% Focus) */}
        <div
          onPointerMove={handleStagePointerMove}
          onPointerLeave={handleStagePointerLeave}
          style={{ perspective: "1100px" }}
          className="relative mt-5 flex h-[340px] sm:h-[400px] w-full items-center justify-center overflow-hidden rounded-3xl"
        >
          {/* Ambient Radial Halo behind Garment */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute h-[340px] w-[340px] rounded-full opacity-45 blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(255,255,255,0.2) 0%, rgba(7,8,11,0) 72%)",
            }}
          />

          {/* Camera Zoom & Tilt Container */}
          <motion.div
            animate={cameraTarget}
            transition={
              isMotionPaused
                ? { duration: 0 }
                : { type: "spring", stiffness: 130, damping: 22 }
            }
            style={{ transformStyle: "preserve-3d" }}
            className="relative z-10 w-full max-w-[360px] will-change-transform"
          >
            <svg
              viewBox="0 0 420 375"
              className="mx-auto h-auto w-full drop-shadow-[0_28px_55px_rgba(0,0,0,0.75)]"
              role="img"
              aria-label={`Camisa manga larga ${selectedShirt.name} — paso ${step}`}
            >
              <defs>
                <radialGradient
                  id="builder-v9-grad"
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
                d="M 166 56 Q 210 72 254 56 L 288 72 L 346 294 L 312 304 L 278 162 L 278 330 Q 210 344 142 330 L 142 162 L 108 304 L 74 294 L 132 72 Z"
                fill="url(#builder-v9-grad)"
                stroke={seamColor}
                strokeWidth="1.4"
                strokeLinejoin="round"
              />

              {/* Armholes */}
              <path
                d="M 142 162 Q 136 116 132 72"
                fill="none"
                stroke={seamColor}
                strokeWidth="1"
                strokeDasharray="3 3"
              />
              <path
                d="M 278 162 Q 284 116 288 72"
                fill="none"
                stroke={seamColor}
                strokeWidth="1"
                strokeDasharray="3 3"
              />

              {/* Right Cuff */}
              <path
                d="M 80 270 L 114 280 L 108 304 L 74 294 Z"
                fill={cuffShade}
                stroke={seamColor}
                strokeWidth="1.1"
              />
              <circle
                cx="93"
                cy="287"
                r="3.2"
                fill={selectedButton.fill}
                stroke={selectedButton.ring}
                strokeWidth="0.7"
              />

              {/* Left Cuff with Sleeve Placket */}
              <path
                d="M 306 280 L 340 270 L 346 294 L 312 304 Z"
                fill={cuffShade}
                stroke={seamColor}
                strokeWidth="1.1"
              />
              <line
                x1="316"
                y1="242"
                x2="324"
                y2="274"
                stroke={seamColor}
                strokeWidth="1"
              />
              <circle
                cx="332"
                cy="286"
                r="3.2"
                fill={selectedButton.fill}
                stroke={selectedButton.ring}
                strokeWidth="0.7"
              />

              {/* Center Placket */}
              <rect x="199" y="72" width="22" height="264" fill={cuffShade} />

              {/* Dynamic Collar */}
              {collar === "Mao" ? (
                <path
                  d="M 168 56 Q 210 72 252 56 L 256 76 Q 210 90 164 76 Z"
                  fill={selectedShirt.secondaryHex}
                  stroke={seamColor}
                  strokeWidth="1.3"
                />
              ) : collar === "Francés" ? (
                <>
                  <path
                    d="M 166 56 L 138 86 L 208 76 Z"
                    fill={selectedShirt.secondaryHex}
                    stroke={seamColor}
                    strokeWidth="1.3"
                  />
                  <path
                    d="M 254 56 L 282 86 L 212 76 Z"
                    fill={selectedShirt.secondaryHex}
                    stroke={seamColor}
                    strokeWidth="1.3"
                  />
                </>
              ) : (
                <>
                  <path
                    d="M 166 56 L 154 96 L 208 76 Z"
                    fill={selectedShirt.secondaryHex}
                    stroke={seamColor}
                    strokeWidth="1.3"
                  />
                  <path
                    d="M 254 56 L 266 96 L 212 76 Z"
                    fill={selectedShirt.secondaryHex}
                    stroke={seamColor}
                    strokeWidth="1.3"
                  />
                  {collar === "Button-Down" && (
                    <>
                      <circle
                        cx="159"
                        cy="89"
                        r="2.4"
                        fill={selectedButton.fill}
                      />
                      <circle
                        cx="261"
                        cy="89"
                        r="2.4"
                        fill={selectedButton.fill}
                      />
                    </>
                  )}
                </>
              )}

              {/* Dynamic Placket Buttons */}
              {[110, 158, 206, 254, 302].map((cy) => (
                <g key={cy} transform={`translate(210, ${cy})`}>
                  <circle
                    r="5"
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
                  y={monogramPlacement === "Pechera" ? 138 : 294}
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

              {/* Step 4 Measurement Callouts (Cleanly revealed only on Step 4) */}
              {step === 4 && (
                <>
                  <g>
                    <path
                      d="M 166 42 Q 210 56 254 42"
                      fill="none"
                      stroke={lineStroke("cuello")}
                      strokeWidth={focusedMeasure === "cuello" ? 2.4 : 1.4}
                    />
                    <text
                      x="210"
                      y="26"
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="11"
                      fontFamily="monospace"
                    >
                      {formatLiveCm(measurements.cuello)}
                    </text>
                  </g>
                  <g>
                    <line
                      x1="142"
                      y1="182"
                      x2="278"
                      y2="182"
                      stroke={lineStroke("pecho")}
                      strokeWidth={focusedMeasure === "pecho" ? 2.4 : 1.4}
                      strokeDasharray={measurements.pecho ? "0" : "4 3"}
                    />
                    <text
                      x="210"
                      y="172"
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="11"
                      fontFamily="monospace"
                    >
                      {formatLiveCm(measurements.pecho)}
                    </text>
                  </g>
                  <g>
                    <line
                      x1="296"
                      y1="68"
                      x2="356"
                      y2="292"
                      stroke={lineStroke("manga")}
                      strokeWidth={focusedMeasure === "manga" ? 2.4 : 1.4}
                    />
                    <text
                      x="376"
                      y="182"
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="11"
                      fontFamily="monospace"
                    >
                      {formatLiveCm(measurements.manga)}
                    </text>
                  </g>
                  <g>
                    <line
                      x1="54"
                      y1="60"
                      x2="54"
                      y2="336"
                      stroke={lineStroke("largo")}
                      strokeWidth={focusedMeasure === "largo" ? 2.4 : 1.4}
                      strokeDasharray={measurements.largo ? "0" : "4 3"}
                    />
                    <text
                      x="32"
                      y="200"
                      textAnchor="middle"
                      fill="#FFFFFF"
                      fontSize="11"
                      fontFamily="monospace"
                    >
                      {formatLiveCm(measurements.largo)}
                    </text>
                  </g>
                </>
              )}
            </svg>
          </motion.div>
        </div>

        {/* Subtle Price & Spec Summary Line Above Dock */}
        <div className="mt-2 flex flex-wrap items-center justify-center gap-x-2.5 gap-y-1 text-xs">
          <span className="font-semibold text-white">{selectedShirt.name}</span>
          <span aria-hidden="true" className="text-white/25">
            ·
          </span>
          <span className="font-mono text-[11px] text-white/65">
            {selectedShirt.refCode}
          </span>
          <span aria-hidden="true" className="text-white/25">
            ·
          </span>
          <span className="font-semibold text-white tabular-nums">
            {formatFabricPrice(selectedShirt.priceArs, currency)}
          </span>
          <span aria-hidden="true" className="hidden sm:inline text-white/25">
            ·
          </span>
          <span className="hidden sm:inline text-white/60">
            Cuello {collar} · Botón {buttonId}
          </span>
        </div>

        {/* SINGLE LIQUID GLASS CONTROL DOCK (ONLY 1 STEP VISIBLE AT A TIME) */}
        <div className="liquid-glass mt-4 rounded-3xl p-4 sm:p-6">
          <AnimatePresence mode="wait">
            {/* STEP 1: TELA (Sector Tabs + Curved Arc ︶ + Confirmar) */}
            {step === 1 && (
              <motion.div
                key="dock-step-1"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <div
                  role="tablist"
                  aria-label="Categorías de tela"
                  className="scrollbar-none flex items-center justify-start sm:justify-center gap-1.5 overflow-x-auto pb-1"
                >
                  {BUILDER_CATEGORIES.map((cat) => {
                    const active = fabricCategory === cat.id;
                    return (
                      <button
                        key={cat.label}
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
                        className={`cursor-pointer shrink-0 min-h-[38px] rounded-full px-3.5 text-xs font-medium transition-all ${
                          active
                            ? "bg-white text-[#0B0B0E] font-semibold"
                            : "bg-white/[0.06] text-white/75 hover:bg-white/[0.12] hover:text-white"
                        }`}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>

                {/* Curved Fabric Arc ︶ */}
                <div className="relative mt-2 flex items-center justify-center">
                  <button
                    type="button"
                    aria-label="Tela anterior"
                    disabled={activeIndex === 0}
                    onClick={() => stepArc(-1)}
                    className="cursor-pointer liquid-glass z-30 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white hover:bg-white/[0.15] disabled:opacity-30"
                  >
                    <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                  </button>

                  <motion.div
                    drag={isMotionPaused ? false : "x"}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.18}
                    onDragEnd={handleArcDragEnd}
                    className="relative mx-2 h-[170px] flex-1 overflow-hidden cursor-grab active:cursor-grabbing"
                  >
                    <svg
                      aria-hidden="true"
                      viewBox="0 0 600 96"
                      className="pointer-events-none absolute inset-x-0 bottom-2 mx-auto h-20 w-full max-w-[520px] opacity-25"
                      fill="none"
                    >
                      <path
                        d="M 20 14 Q 300 104 580 14"
                        stroke="rgba(255,255,255,0.45)"
                        strokeWidth="1"
                        strokeDasharray="3 5"
                      />
                    </svg>

                    {visibleFabrics.map((shirt, index) => {
                      const d = index - activeIndex;
                      const absD = Math.abs(d);
                      const isSelected = d === 0;
                      const shortName = shirt.name
                        .split(" ")
                        .slice(0, 2)
                        .join(" ");

                      const x = d * 114;
                      const y = -Math.pow(absD, 1.65) * 14;
                      const rotate = d * -5;
                      const scale = isSelected
                        ? 1.1
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
                          animate={{ x, y, rotate, scale, opacity }}
                          transition={
                            isMotionPaused
                              ? { duration: 0 }
                              : { type: "spring", stiffness: 280, damping: 26 }
                          }
                          style={{
                            zIndex: 20 - absD,
                            pointerEvents: absD > 3 ? "none" : "auto",
                          }}
                          className="cursor-pointer absolute bottom-2 left-1/2 -ml-[48px] flex w-[96px] flex-col items-center text-center focus-visible:outline-none"
                        >
                          <div
                            className={`relative h-20 w-20 rounded-2xl transition-shadow ${
                              isSelected
                                ? "ring-2 ring-white shadow-[0_14px_34px_rgba(255,255,255,0.22)]"
                                : "border border-white/20"
                            }`}
                            style={{
                              background: `linear-gradient(135deg, ${shirt.secondaryHex} 0%, ${shirt.baseHex} 100%)`,
                            }}
                          >
                            {isSelected && (
                              <span className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-white text-[#0B0B0E]">
                                <Check className="h-3 w-3" aria-hidden="true" />
                              </span>
                            )}
                          </div>
                          <p
                            className={`mt-1.5 text-[11px] font-semibold line-clamp-1 ${
                              isSelected ? "text-white" : "text-white/65"
                            }`}
                          >
                            {shortName}
                          </p>
                          <p className="font-mono text-[9.5px] text-white/50">
                            {shirt.refCode}
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
                    className="cursor-pointer liquid-glass z-30 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-white hover:bg-white/[0.15] disabled:opacity-30"
                  >
                    <ChevronRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>

                <div className="mt-4 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="cursor-pointer inline-flex min-h-[46px] items-center gap-2 rounded-full bg-white px-7 text-xs font-semibold tracking-[0.06em] text-[#0B0B0E] uppercase transition-all hover:bg-white/90"
                  >
                    <span>Confirmar tela → Cuello</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 2: CUELLO */}
            {step === 2 && (
              <motion.div
                key="dock-step-2"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                  {COLLAR_OPTIONS.map((option) => {
                    const active = collar === option;
                    return (
                      <button
                        key={option}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setCollar(option)}
                        className={`cursor-pointer flex min-h-[76px] flex-col items-center justify-center gap-1.5 rounded-2xl px-3 py-3 text-xs font-semibold transition-all ${
                          active
                            ? "bg-white text-[#0B0B0E] shadow-md"
                            : "bg-white/[0.06] text-white/80 border border-white/10 hover:bg-white/[0.12] hover:text-white"
                        }`}
                      >
                        <CollarMiniIcon collar={option} active={active} />
                        <span>{option}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="mt-5 flex justify-center">
                  <button
                    type="button"
                    onClick={() => setStep(3)}
                    className="cursor-pointer inline-flex min-h-[46px] items-center gap-2 rounded-full bg-white px-7 text-xs font-semibold tracking-[0.06em] text-[#0B0B0E] uppercase transition-all hover:bg-white/90"
                  >
                    <span>Confirmar cuello → Botón</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 3: BOTÓN & INICIALES */}
            {step === 3 && (
              <motion.div
                key="dock-step-3"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                  {BUTTON_OPTIONS.map((btn) => {
                    const active = buttonId === btn.id;
                    return (
                      <button
                        key={btn.id}
                        type="button"
                        aria-pressed={active}
                        onClick={() => setButtonId(btn.id)}
                        className={`cursor-pointer flex min-h-[54px] items-center justify-center gap-2.5 rounded-2xl px-3 py-2 text-xs font-semibold transition-all ${
                          active
                            ? "bg-white text-[#0B0B0E] shadow-md"
                            : "bg-white/[0.06] text-white/80 border border-white/10 hover:bg-white/[0.12] hover:text-white"
                        }`}
                      >
                        <span
                          className="h-5 w-5 shrink-0 rounded-full border"
                          style={{
                            backgroundColor: btn.fill,
                            borderColor: btn.ring,
                          }}
                        />
                        <span>{btn.label}</span>
                      </button>
                    );
                  })}
                </div>

                {/* Compact Initials + Placement Toggle (pans camera between Cuff and Chest!) */}
                <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-center">
                  <div className="flex min-h-[44px] items-center gap-2.5 rounded-full bg-white/[0.06] border border-white/12 px-4">
                    <label
                      htmlFor="builder-monogram-input"
                      className="text-xs text-white/65"
                    >
                      Iniciales (sin cargo)
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
                      placeholder="CM"
                      className="w-16 bg-transparent text-center text-sm font-semibold tracking-[0.22em] text-champagne uppercase placeholder:text-white/30 focus:outline-none"
                    />
                  </div>

                  <div className="inline-flex rounded-full bg-white/[0.06] border border-white/12 p-1">
                    {MONOGRAM_PLACEMENTS.map((place) => {
                      const active = monogramPlacement === place;
                      return (
                        <button
                          key={place}
                          type="button"
                          aria-pressed={active}
                          onClick={() => setMonogramPlacement(place)}
                          className={`cursor-pointer min-h-[36px] rounded-full px-3.5 text-xs font-medium transition-colors ${
                            active
                              ? "bg-white text-[#0B0B0E] font-semibold"
                              : "text-white/75 hover:text-white"
                          }`}
                        >
                          {place}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="flex justify-center">
                  <button
                    type="button"
                    onClick={() => setStep(4)}
                    className="cursor-pointer inline-flex min-h-[46px] items-center gap-2 rounded-full bg-white px-7 text-xs font-semibold tracking-[0.06em] text-[#0B0B0E] uppercase transition-all hover:bg-white/90"
                  >
                    <span>Confirmar detalles → Medidas</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </button>
                </div>
              </motion.div>
            )}

            {/* STEP 4: MEDIDAS */}
            {step === 4 && (
              <motion.div
                key="dock-step-4"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4">
                  {MEASURE_FIELDS.map((field) => {
                    const val = measurements[field.key];
                    const isFocused = focusedMeasure === field.key;
                    return (
                      <label
                        key={field.key}
                        htmlFor={`measure-input-${field.key}`}
                        className={`flex min-h-[48px] items-center justify-between gap-2 rounded-2xl px-3.5 py-2 transition-all ${
                          isFocused || val
                            ? "bg-white/[0.14] ring-1 ring-white/40"
                            : "bg-white/[0.06] border border-white/10"
                        }`}
                      >
                        <span className="text-xs font-medium text-white/75">
                          {field.label}
                        </span>
                        <span className="flex items-baseline gap-1">
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
                            className="w-11 bg-transparent text-right font-mono text-sm font-semibold text-white placeholder:text-white/30 focus:outline-none"
                          />
                          <span className="font-mono text-[10px] text-white/55">
                            cm
                          </span>
                        </span>
                      </label>
                    );
                  })}
                </div>

                {invalidField && (
                  <p
                    role="alert"
                    className="mt-2.5 text-center text-xs text-amber-300"
                  >
                    Revisá {invalidField.label}: rango habitual{" "}
                    <span className="font-mono">
                      {invalidField.min}–{invalidField.max} cm
                    </span>
                    .
                  </p>
                )}

                <div className="mt-5 flex flex-col items-center gap-2 sm:flex-row sm:justify-center sm:gap-5">
                  <button
                    id="builder-add-bespoke-btn"
                    type="button"
                    disabled={Boolean(invalidField)}
                    onClick={handleAddBespoke}
                    className="cursor-pointer inline-flex min-h-[48px] w-full sm:w-auto sm:min-w-[320px] items-center justify-center gap-2.5 rounded-full bg-white px-8 py-3 text-xs font-semibold tracking-[0.08em] text-[#0B0B0E] uppercase shadow-[0_14px_36px_rgba(255,255,255,0.16)] transition-all hover:bg-white/90 disabled:cursor-not-allowed disabled:opacity-50"
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
                    className="inline-flex min-h-[44px] items-center gap-1.5 text-xs font-medium text-white/65 transition-colors hover:text-white"
                  >
                    <span>¿Cómo me mido?</span>
                    <ArrowDown className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
