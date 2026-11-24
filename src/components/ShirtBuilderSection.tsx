"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Ruler,
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
  type CatalogShirt,
  type CollarOption,
  type MonogramPlacement,
} from "@/data/catalog";
import {
  formatFabricPrice,
  type FabricCategoryId,
} from "@/data/fabrics";
import { useAtelier } from "@/context/AtelierContext";
import { useMotion } from "@/context/MotionContext";
import { StudioShirtStage } from "@/components/StudioShirtStage";

type BuilderStep = 1 | 2 | 3 | 4;
type MeasureKey = keyof BespokeMeasurements;

const STEPS: { id: BuilderStep; label: string; shortLabel: string }[] = [
  { id: 1, label: "1. Tela", shortLabel: "1. Tela" },
  { id: 2, label: "2. Cuello", shortLabel: "2. Cuello" },
  { id: 3, label: "3. Botón & Iniciales", shortLabel: "3. Detalles" },
  { id: 4, label: "4. Medidas", shortLabel: "4. Medidas" },
];

const BUILDER_CATEGORIES: { id: FabricCategoryId | null; label: string }[] = [
  { id: null, label: "Todas" },
  { id: "urbano", label: "Algodón 100%" },
  { id: "pima", label: "Pima Peruano" },
  { id: "italiano", label: "Italiano" },
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

function getSwatchStyle(shirt: CatalogShirt): React.CSSProperties {
  if (shirt.weaveKind === "mineral-stripe") {
    return {
      backgroundColor: shirt.baseHex,
      backgroundImage: `repeating-linear-gradient(90deg, ${shirt.secondaryHex} 0px, ${shirt.secondaryHex} 2px, transparent 2px, transparent 9px)`,
    };
  }
  if (shirt.weaveKind === "windowpane") {
    return {
      backgroundColor: shirt.baseHex,
      backgroundImage: `linear-gradient(90deg, ${shirt.secondaryHex} 1px, transparent 1px), linear-gradient(0deg, ${shirt.secondaryHex} 1px, transparent 1px)`,
      backgroundSize: "14px 14px",
    };
  }
  if (shirt.weaveKind === "twill") {
    return {
      backgroundColor: shirt.baseHex,
      backgroundImage: `repeating-linear-gradient(135deg, ${shirt.secondaryHex}55 0px, ${shirt.secondaryHex}55 1px, transparent 1px, transparent 5px)`,
    };
  }
  if (shirt.weaveKind === "oxford") {
    return {
      backgroundColor: shirt.baseHex,
      backgroundImage: `radial-gradient(${shirt.secondaryHex}88 0.8px, transparent 0.8px)`,
      backgroundSize: "5px 5px",
    };
  }
  return {
    backgroundColor: shirt.baseHex,
    backgroundImage: `repeating-linear-gradient(0deg, ${shirt.secondaryHex}44 0px, ${shirt.secondaryHex}44 1px, transparent 1px, transparent 4px)`,
  };
}

function CollarMiniIcon({
  collar,
  active,
}: {
  collar: CollarOption;
  active: boolean;
}) {
  const stroke = active ? "#090B10" : "#E4E4E7";
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
  const [justAdded, setJustAdded] = useState(false);

  const visibleFabrics = fabricCategory
    ? CATALOG_SHIRTS.filter((s) => s.fabricId === fabricCategory)
    : CATALOG_SHIRTS;

  const foundIndex = visibleFabrics.findIndex((s) => s.id === builderShirtId);
  const activeIndex = foundIndex >= 0 ? foundIndex : 0;
  const selectedShirt = visibleFabrics[activeIndex] ?? CATALOG_SHIRTS[0];

  const monogramDisplay = formatMonogramDisplay(monogramText);

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

  const nextStepLabel: Record<1 | 2 | 3, string> = {
    1: "Confirmar tela",
    2: "Confirmar cuello",
    3: "Confirmar detalles",
  };

  return (
    <section
      id="arma-tu-camisa"
      aria-labelledby="builder-heading"
      className="relative scroll-mt-4 bg-transparent text-[#F5F5F7]"
    >
      <div className="mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-between gap-3 px-5 pt-24 pb-6 sm:px-8 lg:h-[100svh] lg:min-h-[700px] lg:max-h-[920px] lg:px-12 lg:pt-24 lg:pb-5 xl:pr-24">
        {/* TOP ROW: Compact title + live fabric meta on left, 4-step stepper on right */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <h2
              id="builder-heading"
              className="text-2xl font-medium tracking-[-0.025em] text-white sm:text-3xl"
            >
              Armá tu camisa
            </h2>
            <div className="flex items-center gap-2.5 text-xs text-white/65">
              <span className="font-mono text-[11px] text-white/80">
                {selectedShirt.refCode}
              </span>
              <span aria-hidden="true" className="text-white/25">
                ·
              </span>
              <span className="max-w-[180px] truncate text-white/85 sm:max-w-none">
                {selectedShirt.name}
              </span>
              <span aria-hidden="true" className="text-white/25">
                ·
              </span>
              <span className="font-mono text-[11px] text-white">
                {formatFabricPrice(selectedShirt.priceArs, currency)}
              </span>
            </div>
          </div>

          <nav
            aria-label="Pasos del configurador"
            className="liquid-glass inline-flex w-full items-center gap-1 overflow-x-auto rounded-full p-1 lg:w-auto"
          >
            {STEPS.map((item) => {
              const isActive = step === item.id;
              const isDone = step > item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setStep(item.id)}
                  className={`relative flex min-h-[40px] flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3.5 text-xs font-medium transition-colors lg:flex-none ${
                    isActive
                      ? "text-[#090B10]"
                      : isDone
                        ? "text-white/85 hover:text-white"
                        : "text-white/55 hover:text-white/85"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="v11BuilderStepPill"
                      transition={
                        isMotionPaused
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 380, damping: 32 }
                      }
                      className="absolute inset-0 rounded-full bg-white shadow-[0_6px_20px_rgba(255,255,255,0.22)]"
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1">
                    {isDone && (
                      <Check
                        className="h-3 w-3 text-white/75"
                        aria-hidden="true"
                      />
                    )}
                    <span className="hidden sm:inline">{item.label}</span>
                    <span className="sm:hidden">{item.shortLabel}</span>
                  </span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* CENTER STAGE: Photorealistic Studio Dress Shirt with 3D Tilt & Per-Step Macro Zoom */}
        <div className="relative flex min-h-[340px] flex-1 items-center justify-center overflow-hidden rounded-3xl sm:min-h-[390px] lg:min-h-0">
          <StudioShirtStage
            shirt={selectedShirt}
            collar={collar}
            buttonId={buttonId}
            monogramDisplay={monogramDisplay}
            monogramPlacement={monogramPlacement}
            step={step}
            measurements={measurements}
            focusedMeasure={focusedMeasure}
            isMotionPaused={isMotionPaused}
          />

          {/* Active detail pill (Collar / Button / Monogram) */}
          <div className="liquid-glass pointer-events-none absolute right-3 top-3 z-30 hidden items-center gap-2 rounded-full px-3.5 py-1.5 text-[11px] text-white/80 sm:flex">
            <span>Cuello {collar}</span>
            <span aria-hidden="true" className="text-white/25">
              ·
            </span>
            <span>{buttonId}</span>
            {monogramDisplay && (
              <>
                <span aria-hidden="true" className="text-white/25">
                  ·
                </span>
                <span className="font-mono text-white">
                  {monogramDisplay}
                </span>
              </>
            )}
          </div>
        </div>

        {/* BOTTOM DOCK: Single straight compact .liquid-glass bar */}
        <div className="liquid-glass rounded-2xl px-4 py-3 sm:px-5 sm:py-3.5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between lg:gap-5">
            {/* LEFT: Active Step Controls */}
            <div className="min-w-0 flex-1">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div
                    key="dock-step-1"
                    initial={isMotionPaused ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={isMotionPaused ? undefined : { opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col gap-2.5"
                  >
                    {/* Compact fabric sector pills */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
                      {BUILDER_CATEGORIES.map((cat) => {
                        const active = fabricCategory === cat.id;
                        return (
                          <button
                            key={cat.label}
                            type="button"
                            onClick={() => {
                              setFabricCategory(cat.id);
                              const nextList = cat.id
                                ? CATALOG_SHIRTS.filter(
                                    (s) => s.fabricId === cat.id
                                  )
                                : CATALOG_SHIRTS;
                              if (
                                nextList.length > 0 &&
                                !nextList.some((s) => s.id === selectedShirt.id)
                              ) {
                                setBuilderShirtId(nextList[0].id);
                              }
                            }}
                            className={`min-h-[32px] shrink-0 rounded-full px-3 text-[11px] font-medium transition-colors ${
                              active
                                ? "bg-white text-[#090B10]"
                                : "border border-white/15 bg-white/[0.04] text-white/70 hover:bg-white/[0.1] hover:text-white"
                            }`}
                          >
                            {cat.label}
                          </button>
                        );
                      })}
                    </div>

                    {/* Straight horizontal strip of square swatches */}
                    <div
                      role="listbox"
                      aria-label="Selector de telas"
                      className="flex items-center gap-2.5 overflow-x-auto py-1"
                    >
                      {visibleFabrics.map((shirt) => {
                        const isSelected = shirt.id === selectedShirt.id;
                        return (
                          <button
                            key={shirt.id}
                            type="button"
                            role="option"
                            aria-selected={isSelected}
                            onClick={() => setBuilderShirtId(shirt.id)}
                            title={`${shirt.name} (${shirt.refCode})`}
                            className={`group relative flex shrink-0 items-center gap-2.5 rounded-xl p-1.5 pr-3 text-left transition-all ${
                              isSelected
                                ? "bg-white/15 ring-1 ring-white/70"
                                : "bg-white/[0.04] ring-1 ring-white/10 hover:bg-white/[0.09]"
                            }`}
                          >
                            <span
                              aria-hidden="true"
                              className="block h-10 w-10 shrink-0 rounded-lg border border-white/25 shadow-inner"
                              style={getSwatchStyle(shirt)}
                            />
                            <span className="flex flex-col">
                              <span className="max-w-[110px] truncate text-xs font-medium text-white">
                                {shirt.name}
                              </span>
                              <span className="font-mono text-[10px] text-white/55">
                                {shirt.refCode}
                              </span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div
                    key="dock-step-2"
                    initial={isMotionPaused ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={isMotionPaused ? undefined : { opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="grid grid-cols-2 gap-2 sm:grid-cols-4"
                  >
                    {COLLAR_OPTIONS.map((opt) => {
                      const active = collar === opt;
                      const note =
                        opt === "Italiano"
                          ? "Clásico versátil"
                          : opt === "Francés"
                            ? "Puntas abiertas"
                            : opt === "Button-Down"
                              ? "Con botones"
                              : "Limpio sin solapa";
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setCollar(opt)}
                          className={`flex min-h-[56px] items-center gap-2.5 rounded-xl px-3 py-2 text-left transition-all ${
                            active
                              ? "bg-white text-[#090B10] shadow-[0_8px_24px_rgba(255,255,255,0.2)]"
                              : "border border-white/15 bg-white/[0.04] text-white/85 hover:bg-white/[0.1]"
                          }`}
                        >
                          <CollarMiniIcon collar={opt} active={active} />
                          <span className="min-w-0">
                            <span className="block truncate text-xs font-medium">
                              {opt}
                            </span>
                            <span
                              className={`block truncate text-[10px] ${
                                active ? "text-[#090B10]/70" : "text-white/55"
                              }`}
                            >
                              {note}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div
                    key="dock-step-3"
                    initial={isMotionPaused ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={isMotionPaused ? undefined : { opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col gap-3 xl:flex-row xl:items-center xl:gap-5"
                  >
                    {/* Buttons selector */}
                    <div className="flex flex-wrap items-center gap-2">
                      {BUTTON_OPTIONS.map((btn) => {
                        const active = buttonId === btn.id;
                        return (
                          <button
                            key={btn.id}
                            type="button"
                            onClick={() => setButtonId(btn.id)}
                            className={`flex min-h-[44px] items-center gap-2 rounded-full px-3.5 text-xs font-medium transition-all ${
                              active
                                ? "bg-white text-[#090B10]"
                                : "border border-white/15 bg-white/[0.04] text-white/80 hover:bg-white/[0.1]"
                            }`}
                          >
                            <span
                              aria-hidden="true"
                              className="h-3.5 w-3.5 rounded-full border"
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

                    {/* Divider */}
                    <div
                      aria-hidden="true"
                      className="hidden h-8 w-px bg-white/15 xl:block"
                    />

                    {/* Monogram initials + placement */}
                    <div className="flex flex-wrap items-center gap-2.5">
                      <label className="flex items-center gap-2 text-xs text-white/75">
                        <span>Iniciales</span>
                        <input
                          type="text"
                          value={monogramText}
                          maxLength={3}
                          onChange={(e) =>
                            setMonogramText(
                              e.target.value
                                .replace(/[^a-zA-ZáéíóúñÁÉÍÓÚÑ]/g, "")
                                .toUpperCase()
                                .slice(0, 3)
                            )
                          }
                          placeholder="CM"
                          aria-label="Iniciales bordadas"
                          className="min-h-[44px] w-16 rounded-xl border border-white/20 bg-white/[0.06] px-2.5 text-center font-mono text-xs uppercase tracking-[0.2em] text-white placeholder:text-white/35 focus:border-white focus:outline-none"
                        />
                      </label>

                      <div className="inline-flex rounded-full border border-white/15 bg-white/[0.04] p-0.5">
                        {MONOGRAM_PLACEMENTS.map((place) => {
                          const active = monogramPlacement === place;
                          return (
                            <button
                              key={place}
                              type="button"
                              onClick={() => setMonogramPlacement(place)}
                              className={`min-h-[38px] rounded-full px-3 text-xs font-medium transition-colors ${
                                active
                                  ? "bg-white text-[#090B10]"
                                  : "text-white/70 hover:text-white"
                              }`}
                            >
                              {place === "Puño izquierdo" ? "Puño" : "Pechera"}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 4 && (
                  <motion.div
                    key="dock-step-4"
                    initial={isMotionPaused ? false : { opacity: 0, y: 6 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={isMotionPaused ? undefined : { opacity: 0, y: -6 }}
                    transition={{ duration: 0.2 }}
                    className="flex flex-col gap-2"
                  >
                    <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                      {MEASURE_FIELDS.map((field) => {
                        const raw = measurements[field.key];
                        const num = Number(raw);
                        const isInvalid =
                          Boolean(raw) &&
                          (Number.isNaN(num) ||
                            num < field.min ||
                            num > field.max);
                        return (
                          <label
                            key={field.key}
                            className={`flex min-h-[48px] items-center justify-between gap-2 rounded-xl border px-3 transition-colors ${
                              isInvalid
                                ? "border-red-400/70 bg-red-500/10"
                                : focusedMeasure === field.key
                                  ? "border-white/60 bg-white/[0.1]"
                                  : "border-white/15 bg-white/[0.04]"
                            }`}
                          >
                            <span className="text-[11px] text-white/70">
                              {field.label}
                            </span>
                            <span className="flex items-center gap-1">
                              <input
                                type="text"
                                inputMode="decimal"
                                value={raw}
                                placeholder={field.placeholder}
                                onFocus={() => setFocusedMeasure(field.key)}
                                onBlur={() => setFocusedMeasure(null)}
                                onChange={(e) =>
                                  handleMeasureChange(field.key, e.target.value)
                                }
                                aria-label={`${field.label} en centímetros`}
                                className="w-11 bg-transparent text-right font-mono text-xs text-white placeholder:text-white/30 focus:outline-none"
                              />
                              <span className="font-mono text-[10px] text-white/45">
                                cm
                              </span>
                            </span>
                          </label>
                        );
                      })}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                      {invalidField ? (
                        <p className="text-red-300" role="alert">
                          {invalidField.label}: ingresá entre {invalidField.min}{" "}
                          y {invalidField.max} cm.
                        </p>
                      ) : (
                        <p className="text-white/55">
                          Opcional: también podés confirmarlas luego por
                          WhatsApp.
                        </p>
                      )}
                      <Link
                        href="/#como-pedir"
                        className="inline-flex items-center gap-1 text-white/80 underline-offset-4 hover:text-white hover:underline"
                      >
                        <Ruler className="h-3 w-3" aria-hidden="true" />
                        ¿Cómo me mido?
                      </Link>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* RIGHT: Primary Action CTA */}
            <div className="shrink-0">
              {step < 4 ? (
                <button
                  type="button"
                  onClick={() => setStep((step + 1) as BuilderStep)}
                  className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-white px-6 text-xs font-medium tracking-[0.04em] text-[#090B10] shadow-[0_10px_30px_rgba(255,255,255,0.2)] transition-transform hover:scale-[1.01] hover:bg-white/95 active:scale-[0.99] lg:w-auto"
                >
                  <span>{nextStepLabel[step as 1 | 2 | 3]}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={Boolean(invalidField)}
                  onClick={handleAddBespoke}
                  className="inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-white px-6 text-xs font-medium tracking-[0.04em] text-[#090B10] shadow-[0_10px_30px_rgba(255,255,255,0.22)] transition-transform hover:scale-[1.01] hover:bg-white/95 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-45 lg:w-auto"
                >
                  {justAdded ? (
                    <>
                      <Check className="h-4 w-4" aria-hidden="true" />
                      <span>Agregada a tu bolsa</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                      <span>Agregar camisa a medida al carrito</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
