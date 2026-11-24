"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import {
  BUTTON_OPTIONS,
  COLLAR_META,
  MONOGRAM_THREAD_OPTIONS,
  type BespokeMeasurements,
  type ButtonOption,
  type CatalogShirt,
  type CollarOption,
  type MonogramPlacement,
  type MonogramThreadOption,
} from "@/data/catalog";

const ShirtGLBViewer = dynamic(() => import("@/components/ShirtGLBViewer"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center">
      <div className="liquid-glass flex items-center gap-2.5 rounded-full px-4 py-2 text-xs text-[#111113]/75 dark:text-white/75">
        <span className="h-2 w-2 animate-pulse rounded-full bg-[#B08D57]" />
        <span>Cargando camisa 3D…</span>
      </div>
    </div>
  ),
});

type MeasureKey = keyof BespokeMeasurements;

export interface StudioShirtStageProps {
  shirt: CatalogShirt;
  collar: CollarOption;
  buttonId: ButtonOption;
  monogramDisplay: string;
  monogramPlacement: MonogramPlacement;
  monogramThread: MonogramThreadOption;
  step: 1 | 2 | 3 | 4;
  measurements: BespokeMeasurements;
  focusedMeasure: MeasureKey | null;
  isMotionPaused: boolean;
}

export function StudioShirtStage({
  shirt,
  collar,
  buttonId,
  monogramDisplay,
  monogramPlacement,
  monogramThread,
  step,
  measurements,
  focusedMeasure,
  isMotionPaused,
}: StudioShirtStageProps) {
  const selectedButton =
    BUTTON_OPTIONS.find((b) => b.id === buttonId) ?? BUTTON_OPTIONS[3];
  const selectedThread =
    MONOGRAM_THREAD_OPTIONS.find((t) => t.id === monogramThread) ??
    MONOGRAM_THREAD_OPTIONS[2];
  const collarMeta = COLLAR_META[collar];

  const formatLiveCm = (val: string) => (val ? `${val} cm` : "-- cm");

  return (
    <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-3xl bg-transparent">
      {/* Subtle studio softbox halo behind the 3D garment / macro */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 44%, rgba(255,255,255,0.22) 0%, rgba(148,163,184,0.06) 44%, transparent 74%)",
        }}
      />

      <AnimatePresence mode="wait">
        {/* STEP 1 & STEP 4: Real CLO3D 3D Shirt Model with 360° Orbit & Manual Zoom Controls */}
        {(step === 1 || step === 4) && (
          <motion.div
            key="stage-glb-3d"
            initial={isMotionPaused ? false : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={isMotionPaused ? undefined : { opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3 }}
            className="relative h-full w-full"
          >
            <ShirtGLBViewer
              shirt={shirt}
              buttonId={buttonId}
              step={step}
              isMotionPaused={isMotionPaused}
            />
          </motion.div>
        )}

        {/* STEP 2: Real Macro Collar Studio Photograph */}
        {step === 2 && (
          <motion.div
            key="stage-collar-macro"
            initial={isMotionPaused ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={isMotionPaused ? undefined : { opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex aspect-[4/3] h-[88%] max-h-[450px] max-w-[92%] items-center justify-center overflow-hidden rounded-3xl border border-black/10 shadow-[0_24px_60px_rgba(0,0,0,0.14)] dark:border-white/18 dark:shadow-[0_28px_70px_rgba(0,0,0,0.65)]"
          >
            <AnimatePresence mode="sync">
              <motion.img
                key={collar}
                src={collarMeta.macroImage}
                alt={`Macro real Cuello ${collar}`}
                draggable={false}
                initial={isMotionPaused ? false : { opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={isMotionPaused ? undefined : { opacity: 0 }}
                transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </AnimatePresence>

            {/* Floating Collar Spec Pill */}
            <div className="liquid-glass pointer-events-none absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2.5 whitespace-nowrap rounded-full px-4 py-2 text-xs text-[#111113] dark:text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-[#16233B] dark:bg-white" />
              <span className="font-semibold">Cuello {collar}</span>
              <span
                aria-hidden="true"
                className="hidden text-black/25 sm:inline dark:text-white/30"
              >
                ·
              </span>
              <span className="hidden text-[#111113]/70 sm:inline dark:text-white/75">
                {collarMeta.detail}
              </span>
            </div>
          </motion.div>
        )}

        {/* STEP 3: Real Macro Button / Cuff Photograph + Perspective Stitch Embroidery */}
        {step === 3 && (
          <motion.div
            key="stage-button-macro"
            initial={isMotionPaused ? false : { opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={isMotionPaused ? undefined : { opacity: 0, scale: 0.96 }}
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex aspect-[4/3] h-[88%] max-h-[450px] max-w-[92%] items-center justify-center overflow-hidden rounded-3xl border border-black/10 shadow-[0_24px_60px_rgba(0,0,0,0.16)] dark:border-white/18 dark:shadow-[0_28px_70px_rgba(0,0,0,0.68)]"
          >
            <AnimatePresence mode="sync">
              <motion.img
                key={selectedButton.id}
                src={selectedButton.macroImage}
                alt={`Macro real Botón ${selectedButton.label}`}
                draggable={false}
                initial={isMotionPaused ? false : { opacity: 0, scale: 1.04 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={isMotionPaused ? undefined : { opacity: 0 }}
                transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
                className="absolute inset-0 h-full w-full object-cover"
              />
            </AnimatePresence>

            {/* Realistic Embroidered Monogram with Perspective Tilt & Raised Stitch Relief */}
            {monogramDisplay && (
              <motion.div
                key={`${monogramDisplay}-${monogramThread}-${monogramPlacement}`}
                initial={isMotionPaused ? false : { opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.25 }}
                aria-label={`Iniciales bordadas ${monogramDisplay} en hilo ${selectedThread.label}`}
                className="pointer-events-none absolute right-[12%] bottom-[26%] z-20 select-none"
                style={{
                  transform:
                    "perspective(260px) rotateX(12deg) rotateY(-8deg) rotateZ(-6deg)",
                }}
              >
                <span
                  className="block font-serif text-xl italic font-semibold tracking-[0.18em] sm:text-2xl"
                  style={{
                    color: selectedThread.hex,
                    textShadow:
                      selectedThread.id === "Negro"
                        ? "0 1px 0 rgba(255,255,255,0.22), 0 -0.5px 1px rgba(0,0,0,0.85), 1px 2px 3px rgba(0,0,0,0.65)"
                        : "0 1px 0 rgba(0,0,0,0.65), 0 -0.5px 0 rgba(255,255,255,0.45), 1px 2px 4px rgba(0,0,0,0.55)",
                    filter: "contrast(1.08)",
                  }}
                >
                  {monogramDisplay}
                </span>
              </motion.div>
            )}

            {/* Floating Button + Thread Detail Card */}
            <div className="liquid-glass pointer-events-none absolute bottom-4 left-4 z-20 flex items-center gap-3 rounded-2xl px-3.5 py-2 text-xs text-[#111113] dark:text-white">
              <span
                aria-hidden="true"
                className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border shadow-sm"
                style={{
                  backgroundColor: selectedButton.fill,
                  borderColor: selectedButton.ring,
                }}
              >
                <span
                  className="h-2 w-2 rounded-full border border-dashed opacity-80"
                  style={{ borderColor: selectedButton.thread }}
                />
              </span>
              <div className="leading-tight">
                <p className="font-semibold">Botón {selectedButton.label}</p>
                <p className="mt-0.5 text-[11px] text-[#111113]/70 dark:text-white/70">
                  {monogramDisplay
                    ? `${monogramDisplay} · ${monogramPlacement} · Hilo ${selectedThread.label}`
                    : "Sin iniciales bordadas"}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STEP 4 OVERLAY: Floating cm Measurement Callouts over the 3D Garment */}
      <AnimatePresence>
        {step === 4 && (
          <motion.div
            initial={isMotionPaused ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-none absolute inset-0 z-30"
          >
            {(
              [
                {
                  key: "cuello",
                  label: "Cuello",
                  pos: "left-1/2 top-4 -translate-x-1/2",
                },
                {
                  key: "pecho",
                  label: "Pecho",
                  pos: "right-4 top-1/2 -translate-y-1/2 sm:right-10",
                },
                {
                  key: "manga",
                  label: "Manga",
                  pos: "left-4 top-[44%] -translate-y-1/2 sm:left-10",
                },
                {
                  key: "largo",
                  label: "Largo",
                  pos: "bottom-4 right-4 sm:right-10",
                },
              ] as const
            ).map((item) => {
              const active =
                focusedMeasure === item.key || Boolean(measurements[item.key]);
              return (
                <div
                  key={item.key}
                  className={`liquid-glass absolute rounded-full px-3 py-1 text-[11px] transition-all ${item.pos} ${
                    active
                      ? "border-[#16233B]/50 text-[#111113] shadow-md dark:border-white/55 dark:text-white"
                      : "text-[#111113]/65 dark:text-white/65"
                  }`}
                >
                  <span className="mr-1.5 opacity-70">{item.label}</span>
                  <span className="font-mono font-semibold text-[#111113] dark:text-white">
                    {formatLiveCm(measurements[item.key])}
                  </span>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
