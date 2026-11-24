"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  BUTTON_OPTIONS,
  type BespokeMeasurements,
  type ButtonOption,
  type CatalogShirt,
  type CollarOption,
  type MonogramPlacement,
} from "@/data/catalog";

type MeasureKey = keyof BespokeMeasurements;

export interface StudioShirtStageProps {
  shirt: CatalogShirt;
  collar: CollarOption;
  buttonId: ButtonOption;
  monogramDisplay: string;
  monogramPlacement: MonogramPlacement;
  step: 1 | 2 | 3 | 4;
  measurements: BespokeMeasurements;
  focusedMeasure: MeasureKey | null;
  isMotionPaused: boolean;
}

const COLLAR_DESCRIPTIONS: Record<CollarOption, string> = {
  Italiano: "Puntas equilibradas · Ideal con o sin corbata",
  Francés: "Apertura amplia · Elegancia clásica de sastrería",
  "Button-Down": "Puntas abotonadas · Estructura relajada",
  Mao: "Limpio sin solapa · Silueta minimalista",
};

export function StudioShirtStage({
  shirt,
  collar,
  buttonId,
  monogramDisplay,
  monogramPlacement,
  step,
  measurements,
  focusedMeasure,
  isMotionPaused,
}: StudioShirtStageProps) {
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const selectedButton =
    BUTTON_OPTIONS.find((b) => b.id === buttonId) ?? BUTTON_OPTIONS[0];

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isMotionPaused || step !== 1 || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rotateX: -ny * 10,
      rotateY: nx * 13,
    });
  };

  const handlePointerLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  // Dynamic studio camera zoom per step
  const cameraTarget = (() => {
    if (step === 2) {
      // Macro zoom into the upper collar zone
      return { scale: 2.15, x: "0%", y: "34%", rotateX: 0, rotateY: 0 };
    }
    if (step === 3) {
      // Macro zoom into left cuff (viewer's right lower cuff) or chest placket
      return monogramPlacement === "Puño izquierdo"
        ? { scale: 1.95, x: "-26%", y: "-28%", rotateX: 0, rotateY: 0 }
        : { scale: 1.95, x: "-10%", y: "12%", rotateX: 0, rotateY: 0 };
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
  })();

  const formatLiveCm = (val: string) => (val ? `${val} cm` : "-- cm");

  // Thread ink color contrasts cleanly against light vs dark studio fabrics
  const embroideryColor = shirt.isLightFabric
    ? "rgba(24, 30, 42, 0.88)"
    : "rgba(232, 218, 193, 0.92)";

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-3xl bg-[#09090D]"
      style={{ perspective: "1100px" }}
    >
      {/* Subtle studio softbox halo behind the garment */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 42%, rgba(255,255,255,0.09) 0%, rgba(148,163,184,0.03) 40%, rgba(9,9,13,0.92) 78%)",
        }}
      />

      {/* Camera-transformed photorealistic garment container */}
      <motion.div
        animate={cameraTarget}
        transition={
          isMotionPaused
            ? { duration: 0 }
            : { type: "spring", stiffness: 120, damping: 22, mass: 0.9 }
        }
        style={{ transformStyle: "preserve-3d" }}
        className="relative flex aspect-[3/4] h-[94%] max-h-[540px] max-w-full items-center justify-center select-none"
      >
        {/* Crossfading photorealistic studio shirt */}
        <AnimatePresence mode="sync">
          <motion.img
            key={shirt.id}
            src={shirt.studioImage}
            alt={`${shirt.name} — ${shirt.composition}`}
            draggable={false}
            initial={isMotionPaused ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={isMotionPaused ? undefined : { opacity: 0 }}
            transition={{ duration: 0.42, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-none absolute inset-0 h-full w-full object-contain"
            style={{
              WebkitMaskImage:
                "radial-gradient(ellipse 92% 94% at 50% 50%, #000 72%, transparent 100%)",
              maskImage:
                "radial-gradient(ellipse 92% 94% at 50% 50%, #000 72%, transparent 100%)",
            }}
          />
        </AnimatePresence>

        {/* Live embroidered monogram directly on the real fabric (cuff or chest) */}
        {monogramDisplay && (
          <motion.span
            key={`${monogramPlacement}-${monogramDisplay}`}
            initial={isMotionPaused ? false : { opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.25 }}
            aria-label={`Iniciales bordadas ${monogramDisplay} en ${monogramPlacement}`}
            className="pointer-events-none absolute z-20 font-serif italic tracking-[0.14em]"
            style={{
              color: embroideryColor,
              textShadow: shirt.isLightFabric
                ? "0 1px 1px rgba(255,255,255,0.45)"
                : "0 1px 2px rgba(0,0,0,0.75)",
              ...(monogramPlacement === "Puño izquierdo"
                ? {
                    right: "11.5%",
                    bottom: "13.5%",
                    fontSize: "clamp(8px, 1.15vw, 11px)",
                    transform: "rotate(-3deg)",
                  }
                : {
                    left: "59%",
                    top: "35.5%",
                    fontSize: "clamp(8px, 1.15vw, 11px)",
                  }),
            }}
          >
            {monogramDisplay}
          </motion.span>
        )}

        {/* Step 4 tailored measurement lines anchored to the garment silhouette */}
        <AnimatePresence>
          {step === 4 && (
            <motion.svg
              aria-hidden="true"
              viewBox="0 0 300 400"
              initial={isMotionPaused ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.28 }}
              className="pointer-events-none absolute inset-0 z-20 h-full w-full"
              fill="none"
            >
              {/* Cuello */}
              <line
                x1="116"
                y1="62"
                x2="184"
                y2="62"
                stroke={
                  focusedMeasure === "cuello" || measurements.cuello
                    ? "#FFFFFF"
                    : "rgba(255,255,255,0.38)"
                }
                strokeWidth="1.2"
                strokeDasharray="3 3"
              />
              {/* Pecho */}
              <line
                x1="78"
                y1="176"
                x2="222"
                y2="176"
                stroke={
                  focusedMeasure === "pecho" || measurements.pecho
                    ? "#FFFFFF"
                    : "rgba(255,255,255,0.38)"
                }
                strokeWidth="1.2"
                strokeDasharray="3 3"
              />
              {/* Manga */}
              <line
                x1="60"
                y1="92"
                x2="44"
                y2="342"
                stroke={
                  focusedMeasure === "manga" || measurements.manga
                    ? "#FFFFFF"
                    : "rgba(255,255,255,0.38)"
                }
                strokeWidth="1.2"
                strokeDasharray="3 3"
              />
              {/* Largo */}
              <line
                x1="150"
                y1="72"
                x2="150"
                y2="360"
                stroke={
                  focusedMeasure === "largo" || measurements.largo
                    ? "#FFFFFF"
                    : "rgba(255,255,255,0.28)"
                }
                strokeWidth="1.1"
                strokeDasharray="3 3"
              />
            </motion.svg>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Soft perimeter vignette so studio photo blends seamlessly */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 rounded-3xl shadow-[inset_0_0_60px_rgba(9,9,13,0.85)]"
      />

      {/* STEP 2 OVERLAY: Floating Collar Detail Pill */}
      <AnimatePresence>
        {step === 2 && (
          <motion.div
            key={`collar-badge-${collar}`}
            initial={isMotionPaused ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={isMotionPaused ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="liquid-glass pointer-events-none absolute bottom-4 left-1/2 z-30 flex -translate-x-1/2 items-center gap-3 rounded-full px-4 py-2 text-xs text-white"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
            <span className="font-medium">Cuello {collar}</span>
            <span aria-hidden="true" className="hidden text-white/30 sm:inline">
              ·
            </span>
            <span className="hidden text-white/70 sm:inline">
              {COLLAR_DESCRIPTIONS[collar]}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STEP 3 OVERLAY: Live Button & Monogram Macro Preview Card */}
      <AnimatePresence>
        {step === 3 && (
          <motion.div
            key={`detail-badge-${buttonId}-${monogramPlacement}`}
            initial={isMotionPaused ? false : { opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={isMotionPaused ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.25 }}
            className="liquid-glass pointer-events-none absolute bottom-4 left-4 z-30 flex items-center gap-3.5 rounded-2xl px-4 py-2.5 text-xs text-white"
          >
            {/* Macro tactile button disc preview */}
            <span
              aria-hidden="true"
              className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border shadow-md"
              style={{
                backgroundColor: selectedButton.fill,
                borderColor: selectedButton.ring,
              }}
            >
              <span
                className="h-2.5 w-2.5 rounded-full border border-dashed opacity-75"
                style={{ borderColor: selectedButton.thread }}
              />
            </span>
            <div className="leading-tight">
              <p className="font-medium text-white">
                Botón {selectedButton.label}
              </p>
              <p className="mt-0.5 text-[11px] text-white/65">
                {monogramDisplay
                  ? `Bordado ${monogramDisplay} · ${monogramPlacement}`
                  : "Sin iniciales bordadas"}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STEP 4 OVERLAY: Floating cm Measurement Callouts */}
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
                      ? "border-white/55 text-white shadow-[0_0_20px_rgba(255,255,255,0.2)]"
                      : "text-white/65"
                  }`}
                >
                  <span className="mr-1.5 text-white/60">{item.label}</span>
                  <span className="font-mono text-white">
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
