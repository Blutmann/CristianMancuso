"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Check, Ruler, ShoppingBag } from "lucide-react";
import {
  BUTTON_OPTIONS,
  CATALOG_SHIRTS,
  COLLAR_META,
  COLLAR_OPTIONS,
  MONOGRAM_PLACEMENTS,
  MONOGRAM_THREAD_OPTIONS,
  formatMonogramDisplay,
  type BespokeMeasurements,
  type ButtonOption,
  type CatalogShirt,
  type CollarOption,
  type MonogramPlacement,
  type MonogramThreadOption,
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
  const [buttonId, setButtonId] = useState<ButtonOption>("Nácar blanco");
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
  const [monogramThread, setMonogramThread] =
    useState<MonogramThreadOption>("Champagne");
  const [justAdded, setJustAdded] = useState(false);
  const swatchTrackRef = useRef<HTMLDivElement | null>(null);
  const swatchItemRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Preselect shirt from ?tela= query param when arriving from /coleccion
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const tela = params.get("tela");
    if (tela && CATALOG_SHIRTS.some((s) => s.id === tela)) {
      setBuilderShirtId(tela);
    }
  }, [setBuilderShirtId]);

  const visibleFabrics = fabricCategory
    ? CATALOG_SHIRTS.filter((s) => s.fabricId === fabricCategory)
    : CATALOG_SHIRTS;

  const foundIndex = visibleFabrics.findIndex((s) => s.id === builderShirtId);
  const activeIndex = foundIndex >= 0 ? foundIndex : 0;
  const selectedShirt = visibleFabrics[activeIndex] ?? CATALOG_SHIRTS[0];

  // Auto-center the selected fabric smoothly inside the horizontal dock track
  useEffect(() => {
    if (step !== 1) return;
    const track = swatchTrackRef.current;
    const item = swatchItemRefs.current[selectedShirt.id];
    if (!track || !item) return;

    const rafId = window.requestAnimationFrame(() => {
      const targetLeft =
        item.offsetLeft - track.clientWidth / 2 + item.offsetWidth / 2;
      track.scrollTo({
        left: Math.max(0, targetLeft),
        behavior: isMotionPaused ? "auto" : "smooth",
      });
    });

    return () => window.cancelAnimationFrame(rafId);
  }, [selectedShirt.id, fabricCategory, step, isMotionPaused]);

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
      monogramThread,
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
      className="relative overflow-x-clip bg-transparent text-[#111113] dark:text-[#F5F5F7]"
    >
      <div className="mx-auto flex min-h-[100dvh] w-full max-w-[1440px] flex-col justify-between gap-4 px-5 pt-24 pb-8 sm:px-8 lg:h-[100svh] lg:gap-4 lg:px-12 lg:pt-28 lg:pb-6">
        {/* TOP ROW: Clean title on left, 4-step stepper on right */}
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <h1
            id="builder-heading"
            className="font-display text-2xl font-bold tracking-[-0.025em] text-[#111113] sm:text-3xl dark:text-white"
          >
            Armá tu camisa
          </h1>

          <nav
            aria-label="Pasos del configurador"
            className="liquid-glass scrollbar-none inline-flex w-full items-center gap-1 overflow-x-auto rounded-full p-1 lg:w-auto"
          >
            {STEPS.map((item) => {
              const isActive = step === item.id;
              const isDone = step > item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setStep(item.id)}
                  className={`cursor-pointer relative flex min-h-[44px] flex-1 items-center justify-center gap-1.5 whitespace-nowrap rounded-full px-3 text-xs font-medium transition-colors lg:min-h-[40px] lg:flex-none lg:px-3.5 ${
                    isActive
                      ? "text-white dark:text-[#090B10]"
                      : isDone
                        ? "text-[#111113]/85 hover:text-[#111113] dark:text-white/85 dark:hover:text-white"
                        : "text-[#111113]/55 hover:text-[#111113] dark:text-white/55 dark:hover:text-white/85"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="v12BuilderStepPill"
                      transition={
                        isMotionPaused
                          ? { duration: 0 }
                          : { type: "spring", stiffness: 380, damping: 32 }
                      }
                      className="absolute inset-0 rounded-full bg-[#111113] shadow-md dark:bg-white dark:shadow-[0_6px_20px_rgba(255,255,255,0.22)]"
                    />
                  )}
                  <span className="relative z-10 flex items-center gap-1">
                    {isDone && (
                      <Check
                        className="h-3 w-3 opacity-75"
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

        {/* CENTER STAGE: Explicit Mobile Height (iOS Safari safe) + Full Flex Stage on Desktop */}
        <div className="relative flex h-[390px] w-full items-center justify-center overflow-hidden rounded-3xl sm:h-[440px] lg:h-auto lg:min-h-0 lg:flex-1">
          <StudioShirtStage
            shirt={selectedShirt}
            collar={collar}
            buttonId={buttonId}
            monogramDisplay={monogramDisplay}
            monogramPlacement={monogramPlacement}
            monogramThread={monogramThread}
            step={step}
            measurements={measurements}
            focusedMeasure={focusedMeasure}
            isMotionPaused={isMotionPaused}
          />
        </div>

        {/* BOTTOM DOCK: Single straight compact .liquid-glass bar */}
        <div className="liquid-glass rounded-2xl p-4 sm:p-5">
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
                    className="flex flex-col gap-2"
                  >
                    {/* Clean Typographic Category Tabs with Active Underline (Zero Boxes) */}
                    <div className="scrollbar-none flex items-center gap-5 overflow-x-auto border-b border-black/8 pb-1.5 dark:border-white/10">
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
                            className={`cursor-pointer relative shrink-0 pb-1 text-[11px] font-medium transition-colors ${
                              active
                                ? "font-semibold text-[#111113] dark:text-white"
                                : "text-[#111113]/55 hover:text-[#111113] dark:text-white/55 dark:hover:text-white"
                            }`}
                          >
                            {cat.label}
                            {active && (
                              <motion.span
                                layoutId={
                                  isMotionPaused
                                    ? undefined
                                    : "builder-cat-underline"
                                }
                                className="absolute right-0 -bottom-[7px] left-0 h-[2px] rounded-full bg-[#111113] dark:bg-white"
                              />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Centered Expansive Carousel: Active Fabric Slides Smoothly to Center */}
                    <div
                      ref={swatchTrackRef}
                      role="listbox"
                      aria-label="Selector de telas"
                      className="scrollbar-none relative flex items-center gap-3.5 overflow-x-auto px-[26%] py-1.5 sm:px-[34%]"
                    >
                      {visibleFabrics.map((shirt) => {
                        const isSelected = shirt.id === selectedShirt.id;
                        return (
                          <motion.button
                            key={shirt.id}
                            ref={(el) => {
                              swatchItemRefs.current[shirt.id] = el;
                            }}
                            layout
                            transition={
                              isMotionPaused
                                ? { duration: 0 }
                                : {
                                    type: "spring",
                                    stiffness: 320,
                                    damping: 28,
                                  }
                            }
                            type="button"
                            role="option"
                            aria-selected={isSelected}
                            onClick={() => setBuilderShirtId(shirt.id)}
                            title={`${shirt.name} · ${shirt.refCode}`}
                            className={`cursor-pointer group relative flex shrink-0 items-center text-left ${
                              isSelected
                                ? "gap-3 pr-2 opacity-100"
                                : "opacity-65 hover:opacity-100"
                            }`}
                          >
                            <motion.span
                              layout="position"
                              aria-hidden="true"
                              className={`block h-12 w-12 shrink-0 rounded-xl shadow-inner transition-shadow ${
                                isSelected
                                  ? "ring-2 ring-[#111113] ring-offset-2 ring-offset-[#F7F6F3] dark:ring-white dark:ring-offset-[#0B0B0E]"
                                  : "ring-1 ring-black/15 group-hover:scale-105 dark:ring-white/25"
                              }`}
                              style={getSwatchStyle(shirt)}
                            />
                            <AnimatePresence initial={false} mode="popLayout">
                              {isSelected && (
                                <motion.span
                                  key={`meta-${shirt.id}`}
                                  initial={
                                    isMotionPaused
                                      ? false
                                      : { opacity: 0, x: -8 }
                                  }
                                  animate={{ opacity: 1, x: 0 }}
                                  exit={
                                    isMotionPaused
                                      ? undefined
                                      : { opacity: 0, x: -6 }
                                  }
                                  transition={{ duration: 0.2 }}
                                  className="flex flex-col whitespace-nowrap"
                                >
                                  <span className="text-xs font-semibold text-[#111113] dark:text-white">
                                    {shirt.name}
                                  </span>
                                  <span className="mt-0.5 flex items-center gap-2 font-mono text-[10px] text-[#111113]/60 dark:text-white/60">
                                    <span>{shirt.refCode}</span>
                                    <span
                                      aria-hidden="true"
                                      className="opacity-40"
                                    >
                                      ·
                                    </span>
                                    <span className="font-semibold text-[#16233B] dark:text-white/90">
                                      {formatFabricPrice(
                                        shirt.priceArs,
                                        currency
                                      )}
                                    </span>
                                  </span>
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </motion.button>
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
                    className="grid grid-cols-2 gap-2 sm:grid-cols-5"
                  >
                    {COLLAR_OPTIONS.map((opt) => {
                      const active = collar === opt;
                      return (
                        <button
                          key={opt}
                          type="button"
                          onClick={() => setCollar(opt)}
                          className={`cursor-pointer flex min-h-[52px] flex-col justify-center rounded-xl px-3 py-2 text-left transition-all ${
                            active
                              ? "bg-[#111113] text-white shadow-md dark:bg-white dark:text-[#090B10] dark:shadow-[0_8px_24px_rgba(255,255,255,0.2)]"
                              : "border border-black/12 bg-black/[0.03] text-[#111113]/85 hover:bg-black/[0.07] dark:border-white/15 dark:bg-white/[0.04] dark:text-white/85 dark:hover:bg-white/[0.1]"
                          }`}
                        >
                          <span className="block truncate text-xs font-semibold">
                            {opt}
                          </span>
                          <span
                            className={`block truncate text-[10px] ${
                              active
                                ? "text-white/75 dark:text-[#090B10]/70"
                                : "text-[#111113]/55 dark:text-white/55"
                            }`}
                          >
                            {COLLAR_META[opt].note}
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
                    className="flex flex-col gap-2.5 xl:flex-row xl:items-center xl:gap-4"
                  >
                    {/* 4 Real Button Options */}
                    <div className="flex flex-wrap items-center gap-1.5">
                      {BUTTON_OPTIONS.map((btn) => {
                        const active = buttonId === btn.id;
                        return (
                          <button
                            key={btn.id}
                            type="button"
                            onClick={() => setButtonId(btn.id)}
                            className={`cursor-pointer flex min-h-[42px] items-center gap-2 rounded-full px-3 text-xs font-medium transition-all ${
                              active
                                ? "bg-[#111113] text-white dark:bg-white dark:text-[#090B10]"
                                : "border border-black/12 bg-black/[0.03] text-[#111113]/80 hover:bg-black/[0.08] dark:border-white/15 dark:bg-white/[0.04] dark:text-white/80 dark:hover:bg-white/[0.1]"
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
                            <span>{btn.shortLabel}</span>
                          </button>
                        );
                      })}
                    </div>

                    <div
                      aria-hidden="true"
                      className="hidden h-7 w-px bg-black/12 xl:block dark:bg-white/15"
                    />

                    {/* Monogram Initials + Placement + Thread Color */}
                    <div className="flex flex-wrap items-center gap-2">
                      <label className="flex items-center gap-1.5 text-xs text-[#111113]/75 dark:text-white/75">
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
                          className="min-h-[40px] w-14 rounded-xl border border-black/15 bg-white/80 px-2 text-center font-mono text-xs uppercase tracking-[0.18em] text-[#111113] placeholder:text-black/35 focus:border-[#16233B] focus:outline-none dark:border-white/20 dark:bg-white/[0.06] dark:text-white dark:placeholder:text-white/35 dark:focus:border-white"
                        />
                      </label>

                      <div className="inline-flex rounded-full border border-black/12 bg-black/[0.03] p-0.5 dark:border-white/15 dark:bg-white/[0.04]">
                        {MONOGRAM_PLACEMENTS.map((place) => {
                          const active = monogramPlacement === place;
                          return (
                            <button
                              key={place}
                              type="button"
                              onClick={() => setMonogramPlacement(place)}
                              className={`cursor-pointer min-h-[34px] rounded-full px-2.5 text-[11px] font-medium transition-colors ${
                                active
                                  ? "bg-[#111113] text-white dark:bg-white dark:text-[#090B10]"
                                  : "text-[#111113]/70 hover:text-[#111113] dark:text-white/70 dark:hover:text-white"
                              }`}
                            >
                              {place === "Puño izquierdo" ? "Puño" : "Pechera"}
                            </button>
                          );
                        })}
                      </div>

                      {/* 4 Thread Colors */}
                      <div
                        role="radiogroup"
                        aria-label="Color de hilo del bordado"
                        className="flex items-center gap-1.5"
                      >
                        {MONOGRAM_THREAD_OPTIONS.map((t) => {
                          const active = monogramThread === t.id;
                          return (
                            <button
                              key={t.id}
                              type="button"
                              role="radio"
                              aria-checked={active}
                              title={`Hilo ${t.label}`}
                              aria-label={`Hilo ${t.label}`}
                              onClick={() => setMonogramThread(t.id)}
                              className={`cursor-pointer flex h-8 w-8 items-center justify-center rounded-full border transition-transform ${
                                active
                                  ? "scale-110 ring-2 ring-[#16233B] ring-offset-1 ring-offset-[#F7F6F3] dark:ring-white dark:ring-offset-[#0B0B0E]"
                                  : "opacity-80 hover:opacity-100"
                              }`}
                              style={{
                                backgroundColor: t.hex,
                                borderColor: t.ring,
                              }}
                            />
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
                            className={`flex min-h-[46px] items-center justify-between gap-2 rounded-xl border px-3 transition-colors ${
                              isInvalid
                                ? "border-red-500/70 bg-red-500/10"
                                : focusedMeasure === field.key
                                  ? "border-[#16233B] bg-white dark:border-white/60 dark:bg-white/[0.1]"
                                  : "border-black/12 bg-white/60 dark:border-white/15 dark:bg-white/[0.04]"
                            }`}
                          >
                            <span className="text-[11px] text-[#111113]/70 dark:text-white/70">
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
                                className="w-11 bg-transparent text-right font-mono text-xs text-[#111113] placeholder:text-black/30 focus:outline-none dark:text-white dark:placeholder:text-white/30"
                              />
                              <span className="font-mono text-[10px] text-[#111113]/45 dark:text-white/45">
                                cm
                              </span>
                            </span>
                          </label>
                        );
                      })}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 text-[11px]">
                      {invalidField ? (
                        <p className="text-red-600 dark:text-red-300" role="alert">
                          {invalidField.label}: ingresá entre {invalidField.min}{" "}
                          y {invalidField.max} cm.
                        </p>
                      ) : (
                        <p className="text-muted">
                          Opcional: también podés confirmarlas luego por
                          WhatsApp.
                        </p>
                      )}
                      <Link
                        href="/como-medir"
                        className="inline-flex items-center gap-1 font-medium text-[#16233B] underline-offset-4 hover:underline dark:text-white/85"
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
                  className="cursor-pointer inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-[#111113] px-6 text-xs font-semibold tracking-[0.04em] text-white shadow-lg transition-transform hover:scale-[1.01] hover:bg-[#16233B] active:scale-[0.99] lg:w-auto dark:bg-white dark:text-[#090B10] dark:shadow-[0_10px_30px_rgba(255,255,255,0.2)] dark:hover:bg-white/95"
                >
                  <span>{nextStepLabel[step as 1 | 2 | 3]}</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              ) : (
                <button
                  type="button"
                  disabled={Boolean(invalidField)}
                  onClick={handleAddBespoke}
                  className="cursor-pointer inline-flex min-h-[48px] w-full items-center justify-center gap-2 rounded-full bg-[#111113] px-6 text-xs font-semibold tracking-[0.04em] text-white shadow-lg transition-transform hover:scale-[1.01] hover:bg-[#16233B] active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-45 lg:w-auto dark:bg-white dark:text-[#090B10] dark:shadow-[0_10px_30px_rgba(255,255,255,0.22)] dark:hover:bg-white/95"
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
