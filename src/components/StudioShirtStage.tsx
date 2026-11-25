"use client";

import { Component, useState, useSyncExternalStore, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { Box } from "lucide-react";
import {
  BUTTON_OPTIONS,
  COLLAR_META,
  COLLAR_OPTIONS,
  MONOGRAM_THREAD_OPTIONS,
  type BespokeMeasurements,
  type ButtonOption,
  type CatalogShirt,
  type CollarOption,
  type MonogramPlacement,
  type MonogramThreadOption,
} from "@/data/catalog";

interface WebGLErrorBoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
}

interface WebGLErrorBoundaryState {
  hasError: boolean;
}

class WebGLErrorBoundary extends Component<
  WebGLErrorBoundaryProps,
  WebGLErrorBoundaryState
> {
  constructor(props: WebGLErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): WebGLErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function ShirtStudioFallback({
  shirt,
  isMotionPaused,
}: {
  shirt: CatalogShirt;
  isMotionPaused: boolean;
}) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center p-1 sm:p-2">
      <motion.div
        animate={
          isMotionPaused
            ? { y: 0, scale: 1 }
            : { y: [-7, 7, -7], scale: [1, 1.015, 1] }
        }
        transition={{
          duration: 4.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="relative flex h-[92%] max-h-[420px] w-full items-center justify-center"
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={shirt.id}
            src={shirt.studioImage}
            alt={shirt.name}
            draggable={false}
            initial={isMotionPaused ? false : { opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={isMotionPaused ? undefined : { opacity: 0, scale: 0.97 }}
            transition={{ duration: 0.24, ease: "easeOut" }}
            className="h-full w-auto max-w-full object-contain drop-shadow-[0_22px_32px_rgba(17,17,19,0.22)] select-none dark:drop-shadow-[0_26px_38px_rgba(0,0,0,0.62)]"
          />
        </AnimatePresence>
      </motion.div>
      <motion.span
        aria-hidden="true"
        animate={
          isMotionPaused
            ? { scale: 1, opacity: 0.22 }
            : { scale: [0.88, 1.08, 0.88], opacity: [0.16, 0.32, 0.16] }
        }
        transition={{
          duration: 4.8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none mt-1 h-2.5 w-36 rounded-full bg-[#111113] blur-lg dark:bg-black"
      />
    </div>
  );
}

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
  onCollarChange?: (collar: CollarOption) => void;
  buttonId: ButtonOption;
  monogramDisplay: string;
  monogramPlacement: MonogramPlacement;
  monogramThread: MonogramThreadOption;
  step: 1 | 2 | 3 | 4;
  measurements: BespokeMeasurements;
  focusedMeasure: MeasureKey | null;
  isMotionPaused: boolean;
}

const subscribeDesktopMedia = (callback: () => void) => {
  if (typeof window === "undefined") return () => {};
  const mql = window.matchMedia("(min-width: 1024px)");
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
};

const getDesktopSnapshot = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(min-width: 1024px)").matches;

const getDesktopServerSnapshot = () => false;

export function StudioShirtStage({
  shirt,
  collar,
  onCollarChange,
  buttonId,
  monogramDisplay,
  monogramPlacement,
  monogramThread,
  step,
  measurements,
  focusedMeasure,
  isMotionPaused,
}: StudioShirtStageProps) {
  const [webglFailed, setWebglFailed] = useState(false);
  // Mobile (< lg) defaults to large floating studio photo; desktop (lg+) defaults to 3D viewer
  const isDesktopDefault = useSyncExternalStore(
    subscribeDesktopMedia,
    getDesktopSnapshot,
    getDesktopServerSnapshot
  );
  const [user3DOverride, setUser3DOverride] = useState<boolean | null>(null);
  const is3DActive = user3DOverride ?? isDesktopDefault;

  const selectedButton =
    BUTTON_OPTIONS.find((b) => b.id === buttonId) ?? BUTTON_OPTIONS[3];
  const selectedThread =
    MONOGRAM_THREAD_OPTIONS.find((t) => t.id === monogramThread) ??
    MONOGRAM_THREAD_OPTIONS[2];
  const collarMeta = COLLAR_META[collar];

  const formatLiveCm = (val: string) => (val ? `${val} cm` : "-- cm");

  const handleCollarSwipe = (direction: -1 | 1) => {
    if (!onCollarChange) return;
    const idx = COLLAR_OPTIONS.indexOf(collar);
    if (idx < 0) return;
    const nextIdx =
      (idx + direction + COLLAR_OPTIONS.length) % COLLAR_OPTIONS.length;
    onCollarChange(COLLAR_OPTIONS[nextIdx]);
  };

  const show3DViewer = is3DActive && !webglFailed;

  return (
    <div className="relative flex h-[360px] w-full items-center justify-center overflow-hidden rounded-2xl bg-transparent sm:h-[400px] lg:h-full">
      {/* Subtle studio softbox halo behind the garment / macro */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at 50% 44%, rgba(255,255,255,0.22) 0%, rgba(148,163,184,0.06) 44%, transparent 74%)",
        }}
      />

      {/* Discreet corner 3D toggle button for Step 1 & Step 4 */}
      {(step === 1 || step === 4) && !webglFailed && (
        <button
          type="button"
          onClick={() => setUser3DOverride(!is3DActive)}
          aria-pressed={is3DActive}
          aria-label={
            is3DActive
              ? "Volver a foto de estudio"
              : "Activar vista 3D interactiva 360°"
          }
          title={is3DActive ? "Ver foto de estudio" : "Ver en 3D (360°)"}
          className={`liquid-glass cursor-pointer absolute top-2.5 right-2.5 z-30 inline-flex min-h-[38px] items-center gap-1.5 rounded-full px-3 text-[11px] font-semibold tracking-wider transition-all ${
            is3DActive
              ? "border-2 border-[#16233B] text-[#111113] dark:border-white dark:text-white"
              : "text-[#111113]/80 hover:text-[#111113] dark:text-white/80 dark:hover:text-white"
          }`}
        >
          <Box className="h-3.5 w-3.5" aria-hidden="true" />
          <span>3D</span>
        </button>
      )}

      <AnimatePresence mode="wait">
        {/* STEP 1 & STEP 4: Large Floating Studio Photo (Mobile default) or Interactive 3D Model (Optional / Desktop default) */}
        {(step === 1 || step === 4) && (
          <motion.div
            key={show3DViewer ? "stage-glb-3d" : "stage-studio-photo"}
            initial={isMotionPaused ? false : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={isMotionPaused ? undefined : { opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.28 }}
            className="relative h-[360px] w-full sm:h-[400px] lg:h-full"
          >
            {show3DViewer ? (
              <WebGLErrorBoundary
                fallback={
                  <ShirtStudioFallback
                    shirt={shirt}
                    isMotionPaused={isMotionPaused}
                  />
                }
              >
                <ShirtGLBViewer
                  shirt={shirt}
                  buttonId={buttonId}
                  step={step}
                  isMotionPaused={isMotionPaused}
                  onWebGLError={() => setWebglFailed(true)}
                />
              </WebGLErrorBoundary>
            ) : (
              <ShirtStudioFallback
                shirt={shirt}
                isMotionPaused={isMotionPaused}
              />
            )}
          </motion.div>
        )}

        {/* STEP 2: Full-bleed Macro Collar Studio Photograph with Horizontal Swipe (no inner double frame) */}
        {step === 2 && (
          <motion.div
            key="stage-collar-macro"
            initial={isMotionPaused ? false : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={isMotionPaused ? undefined : { opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            drag={onCollarChange ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.22}
            onDragEnd={(_, info) => {
              if (info.offset.x < -38) {
                handleCollarSwipe(1);
              } else if (info.offset.x > 38) {
                handleCollarSwipe(-1);
              }
            }}
            className="relative flex h-full w-full cursor-grab touch-pan-y items-center justify-center overflow-hidden rounded-2xl active:cursor-grabbing"
          >
            <AnimatePresence mode="sync">
              <motion.img
                key={collar}
                src={collarMeta.macroImage}
                alt={`Macro real Cuello ${collar}`}
                draggable={false}
                initial={isMotionPaused ? false : { opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={isMotionPaused ? undefined : { opacity: 0 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                className="pointer-events-none absolute inset-0 h-full w-full object-cover select-none"
              />
            </AnimatePresence>

            {/* Floating Collar Spec Pill */}
            <div className="liquid-glass pointer-events-none absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2.5 whitespace-nowrap rounded-full px-4 py-1.5 text-xs text-[#111113] sm:bottom-4 sm:py-2 dark:text-white">
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

        {/* STEP 3: Full-bleed Macro Button / Cuff Photograph + Perspective Stitch Embroidery */}
        {step === 3 && (
          <motion.div
            key="stage-button-macro"
            initial={isMotionPaused ? false : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={isMotionPaused ? undefined : { opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-2xl"
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
