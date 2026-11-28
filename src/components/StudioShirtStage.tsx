"use client";

import { Component, useState, useSyncExternalStore, type ReactNode } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { Box, ChevronLeft, ChevronRight } from "lucide-react";
import {
  BUTTON_OPTIONS,
  COLLAR_META,
  COLLAR_OPTIONS,
  type BespokeMeasurements,
  type ButtonOption,
  type CatalogShirt,
  type CollarOption,
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
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, active: false });

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isMotionPaused) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rotateX: -ny * 7,
      rotateY: nx * 9,
      active: true,
    });
  };

  const handlePointerLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, active: false });
  };

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      style={{ perspective: "1000px" }}
      className="flex h-full w-full flex-col items-center justify-center p-1 sm:p-2"
    >
      <motion.div
        animate={
          isMotionPaused
            ? { y: 0, rotateX: 0, rotateY: 0 }
            : {
                y: [0, -12, 0],
                rotateY: tilt.active ? tilt.rotateY : [-2.5, 2.5, -2.5],
                rotateX: tilt.active ? tilt.rotateX : [1.2, -1.2, 1.2],
              }
        }
        transition={{
          y: { duration: 4.2, repeat: Infinity, ease: "easeInOut" },
          rotateY: tilt.active
            ? { type: "spring", stiffness: 320, damping: 26 }
            : { duration: 5.4, repeat: Infinity, ease: "easeInOut" },
          rotateX: tilt.active
            ? { type: "spring", stiffness: 320, damping: 26 }
            : { duration: 5.4, repeat: Infinity, ease: "easeInOut" },
        }}
        style={{ transformStyle: "preserve-3d" }}
        className="liquid-glass relative aspect-[3/4] h-[310px] overflow-hidden rounded-3xl !bg-[#F4F1EC]/76 shadow-[0_22px_54px_rgba(17,17,19,0.14)] will-change-transform sm:h-[350px] lg:h-[58vh] lg:min-h-[480px] lg:max-h-[580px] dark:!bg-[#0E0F13]/82 dark:shadow-[0_26px_64px_rgba(0,0,0,0.62)]"
      >
        {/* Top crystalline Liquid Glass specular highlight */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-white/35 via-white/10 to-transparent dark:from-white/14 dark:via-white/[0.03]"
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={shirt.id}
            initial={isMotionPaused ? false : { opacity: 0, scale: 0.97, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={isMotionPaused ? undefined : { opacity: 0, scale: 0.97, y: -4 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            className="h-full w-full"
          >
            <picture className="block h-full w-full dark:hidden">
              <source
                media="(min-width: 768px)"
                srcSet={shirt.studioImageHd}
                type="image/webp"
              />
              <img
                src={shirt.studioImage}
                alt={shirt.name}
                draggable={false}
                className="h-full w-full scale-[1.10] object-contain object-center mix-blend-multiply select-none"
              />
            </picture>
            <picture className="hidden h-full w-full dark:block">
              <source
                media="(min-width: 768px)"
                srcSet={shirt.studioImageDarkHd}
                type="image/webp"
              />
              <img
                src={shirt.studioImageDark}
                alt={shirt.name}
                draggable={false}
                className="h-full w-full scale-[1.10] object-contain object-center select-none dark:[mask-image:radial-gradient(ellipse_88%_92%_at_50%_48%,black_68%,transparent_100%)]"
              />
            </picture>
          </motion.div>
        </AnimatePresence>

        {/* Periodic soft specular sheen sweep across studio card */}
        {!isMotionPaused && (
          <div
            aria-hidden="true"
            className="animate-sheen-sweep pointer-events-none absolute inset-y-0 left-0 w-1/2"
            style={{
              background:
                "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.16) 50%, transparent 100%)",
            }}
          />
        )}
      </motion.div>

      {/* Synchronized organic soft elliptical shadow directly under the studio card */}
      <motion.span
        aria-hidden="true"
        animate={
          isMotionPaused
            ? { scale: 1, opacity: 0.22 }
            : { scale: [1, 0.88, 1], opacity: [0.24, 0.12, 0.24] }
        }
        transition={{
          duration: 4.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="pointer-events-none mt-2 h-4 w-44 rounded-full bg-black blur-xl"
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
  onButtonChange?: (buttonId: ButtonOption) => void;
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
  onButtonChange,
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
  const collarMeta = COLLAR_META[collar];

  const handleCollarSwipe = (direction: -1 | 1) => {
    if (!onCollarChange) return;
    const idx = COLLAR_OPTIONS.indexOf(collar);
    if (idx < 0) return;
    const nextIdx =
      (idx + direction + COLLAR_OPTIONS.length) % COLLAR_OPTIONS.length;
    onCollarChange(COLLAR_OPTIONS[nextIdx]);
  };

  const handleButtonSwipe = (direction: -1 | 1) => {
    if (!onButtonChange) return;
    const idx = BUTTON_OPTIONS.findIndex((b) => b.id === buttonId);
    if (idx < 0) return;
    const nextIdx =
      (idx + direction + BUTTON_OPTIONS.length) % BUTTON_OPTIONS.length;
    onButtonChange(BUTTON_OPTIONS[nextIdx].id);
  };

  const show3DViewer = is3DActive && !webglFailed;

  return (
    <div className="relative flex h-[360px] w-full items-center justify-center bg-transparent sm:h-[400px] lg:h-full lg:min-h-[520px]">
      {/* Persistent corner 3D / Foto toggle button for Step 1 & Step 4 */}
      {(step === 1 || step === 4) && (
        <button
          id="stage-3d-toggle"
          type="button"
          onClick={() => {
            const next = !is3DActive;
            if (next) {
              setWebglFailed(false);
            }
            setUser3DOverride(next);
          }}
          aria-pressed={show3DViewer}
          aria-label={
            show3DViewer
              ? "Volver a foto de estudio"
              : "Activar vista 3D interactiva 360°"
          }
          title={show3DViewer ? "Ver foto de estudio" : "Ver en 3D (360°)"}
          className={`liquid-glass cursor-pointer absolute top-2.5 right-2.5 z-40 inline-flex min-h-[38px] items-center gap-1.5 rounded-full px-3 text-[11px] font-semibold tracking-wider transition-all ${
            show3DViewer
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

        {/* STEP 2: Full-bleed Studio Editorial Collar Frame (Light & Dark native studio macros) */}
        {step === 2 && (
          <motion.div
            key="stage-collar-macro"
            initial={isMotionPaused ? false : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={isMotionPaused ? undefined : { opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
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
            className="relative flex h-full w-full cursor-grab touch-pan-y items-center justify-center overflow-hidden rounded-3xl bg-[#F4F1EC] shadow-[0_18px_48px_rgba(17,17,19,0.08)] active:cursor-grabbing dark:bg-[#0E0F13] dark:shadow-[0_24px_60px_rgba(0,0,0,0.45)]"
          >
            <AnimatePresence mode="sync">
              <motion.div
                key={collar}
                initial={isMotionPaused ? false : { opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={isMotionPaused ? undefined : { opacity: 0 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                className="pointer-events-none absolute inset-0 h-full w-full select-none"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={collarMeta.macroImage}
                  alt={`Macro editorial Cuello ${collar}`}
                  draggable={false}
                  className="h-full w-full object-cover object-center dark:hidden"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={collarMeta.macroImageDark}
                  alt={`Macro editorial Cuello ${collar}`}
                  draggable={false}
                  className="hidden h-full w-full object-cover object-center dark:block"
                />
              </motion.div>
            </AnimatePresence>

            {/* Discreet Previous / Next Collar Arrows (Adaptive Liquid Glass) */}
            {onCollarChange && (
              <>
                <button
                  type="button"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() => handleCollarSwipe(-1)}
                  aria-label="Cuello anterior"
                  className="cursor-pointer absolute top-1/2 left-2.5 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white/75 text-[#111113] shadow-sm backdrop-blur-md transition-transform hover:scale-105 active:scale-95 sm:left-3 sm:h-10 sm:w-10 dark:border-white/15 dark:bg-[#111113]/75 dark:text-white"
                >
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() => handleCollarSwipe(1)}
                  aria-label="Siguiente cuello"
                  className="cursor-pointer absolute top-1/2 right-2.5 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white/75 text-[#111113] shadow-sm backdrop-blur-md transition-transform hover:scale-105 active:scale-95 sm:right-3 sm:h-10 sm:w-10 dark:border-white/15 dark:bg-[#111113]/75 dark:text-white"
                >
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </>
            )}

            {/* Floating Collar Spec Pill (Adaptive Liquid Glass) */}
            <div className="pointer-events-none absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2.5 whitespace-nowrap rounded-full border border-black/10 bg-white/75 px-4 py-1.5 text-xs text-[#111113] shadow-sm backdrop-blur-md sm:bottom-4 sm:py-2 dark:border-white/15 dark:bg-[#111113]/75 dark:text-white">
              <span className="h-1.5 w-1.5 rounded-full bg-[#16233B] dark:bg-white" />
              <span className="font-semibold">Cuello {collar}</span>
              <span
                aria-hidden="true"
                className="hidden text-black/25 sm:inline dark:text-white/30"
              >
                ·
              </span>
              <span className="hidden text-[#111113]/75 sm:inline dark:text-white/80">
                {collarMeta.detail}
              </span>
            </div>
          </motion.div>
        )}

        {/* STEP 3: Full-bleed Studio Editorial White Placket & Button Frame (Light & Dark native studio macros) */}
        {step === 3 && (
          <motion.div
            key="stage-button-macro"
            initial={isMotionPaused ? false : { opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={isMotionPaused ? undefined : { opacity: 0, scale: 0.98 }}
            transition={{ type: "spring", stiffness: 320, damping: 26 }}
            drag={onButtonChange ? "x" : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.22}
            onDragEnd={(_, info) => {
              if (info.offset.x < -38) {
                handleButtonSwipe(1);
              } else if (info.offset.x > 38) {
                handleButtonSwipe(-1);
              }
            }}
            className="relative flex h-full w-full cursor-grab touch-pan-y items-center justify-center overflow-hidden rounded-3xl bg-[#F4F1EC] shadow-[0_18px_48px_rgba(17,17,19,0.08)] active:cursor-grabbing dark:bg-[#0E0F13] dark:shadow-[0_24px_60px_rgba(0,0,0,0.45)]"
          >
            <AnimatePresence mode="sync">
              <motion.div
                key={selectedButton.id}
                initial={isMotionPaused ? false : { opacity: 0, scale: 1.03 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={isMotionPaused ? undefined : { opacity: 0 }}
                transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                className="pointer-events-none absolute inset-0 h-full w-full select-none"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedButton.macroImage}
                  alt={`Macro editorial Botón ${selectedButton.label}`}
                  draggable={false}
                  className="h-full w-full object-cover object-center dark:hidden"
                />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={selectedButton.macroImageDark}
                  alt={`Macro editorial Botón ${selectedButton.label}`}
                  draggable={false}
                  className="hidden h-full w-full object-cover object-center dark:block"
                />
              </motion.div>
            </AnimatePresence>

            {/* Discreet Previous / Next Button Arrows (Adaptive Liquid Glass) */}
            {onButtonChange && (
              <>
                <button
                  type="button"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() => handleButtonSwipe(-1)}
                  aria-label="Botón anterior"
                  className="cursor-pointer absolute top-1/2 left-2.5 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white/75 text-[#111113] shadow-sm backdrop-blur-md transition-transform hover:scale-105 active:scale-95 sm:left-3 sm:h-10 sm:w-10 dark:border-white/15 dark:bg-[#111113]/75 dark:text-white"
                >
                  <ChevronLeft className="h-5 w-5" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onPointerDown={(e) => e.stopPropagation()}
                  onClick={() => handleButtonSwipe(1)}
                  aria-label="Siguiente botón"
                  className="cursor-pointer absolute top-1/2 right-2.5 z-20 inline-flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-black/10 bg-white/75 text-[#111113] shadow-sm backdrop-blur-md transition-transform hover:scale-105 active:scale-95 sm:right-3 sm:h-10 sm:w-10 dark:border-white/15 dark:bg-[#111113]/75 dark:text-white"
                >
                  <ChevronRight className="h-5 w-5" aria-hidden="true" />
                </button>
              </>
            )}

            {/* Floating Button Detail Pill (Adaptive Liquid Glass) */}
            <div className="pointer-events-none absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2.5 whitespace-nowrap rounded-full border border-black/10 bg-white/75 px-4 py-1.5 text-xs text-[#111113] shadow-sm backdrop-blur-md sm:bottom-4 sm:py-2 dark:border-white/15 dark:bg-[#111113]/75 dark:text-white">
              <span
                aria-hidden="true"
                className="h-3.5 w-3.5 shrink-0 rounded-full border shadow-sm"
                style={{
                  backgroundColor: selectedButton.fill,
                  borderColor: selectedButton.ring,
                }}
              />
              <span className="font-semibold">Botón {selectedButton.label}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* STEP 4 OVERLAY: Floating cm Measurement Callouts anchored around the Garment */}
      <AnimatePresence>
        {step === 4 && (
          <motion.div
            initial={isMotionPaused ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center"
          >
            <div className="relative h-full w-full max-w-[340px] sm:max-w-[380px] lg:max-w-[520px]">
              {(
                [
                  {
                    key: "cuello",
                    code: "(A)",
                    name: "Cuello",
                    pos: "left-1/2 top-3 -translate-x-1/2 lg:top-5",
                  },
                  {
                    key: "pecho",
                    code: "(B)",
                    name: "Pecho",
                    pos: "right-2 top-1/2 -translate-y-1/2 sm:right-3 lg:right-4",
                  },
                  {
                    key: "manga",
                    code: "(C)",
                    name: "Manga",
                    pos: "left-2 top-[44%] -translate-y-1/2 sm:left-3 lg:left-4",
                  },
                  {
                    key: "largo",
                    code: "(D)",
                    name: "Largo",
                    pos: "bottom-3 right-2 sm:right-3 lg:bottom-5 lg:right-4",
                  },
                ] as const
              ).map((item) => {
                const active =
                  focusedMeasure === item.key || Boolean(measurements[item.key]);
                return (
                  <div
                    key={item.key}
                    aria-label={`${item.name}: ${measurements[item.key] ? `${measurements[item.key]} cm` : "sin completar"}`}
                    className={`liquid-glass absolute inline-flex items-baseline gap-1.5 rounded-full px-3.5 py-1.5 text-xs transition-all sm:px-4 sm:py-2 sm:text-sm ${item.pos} ${
                      active
                        ? "border-[#16233B]/50 text-[#111113] shadow-md dark:border-white/55 dark:text-white"
                        : "text-[#111113]/75 dark:text-white/75"
                    }`}
                  >
                    <span className="font-mono font-bold text-[#16233B] dark:text-[#D6C3A5]">
                      {item.code}
                    </span>
                    <span className="font-mono text-sm font-bold text-[#111113] sm:text-base dark:text-white">
                      {measurements[item.key]
                        ? `${measurements[item.key]} cm`
                        : "— cm"}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
