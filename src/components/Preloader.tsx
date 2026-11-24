"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useMotion } from "@/context/MotionContext";
import { BrandLogo } from "@/components/BrandLogo";

const PRELOADER_DURATION_MS = 1350;
const CURTAIN_DURATION_MS = 650;
const SESSION_KEY = "cm_preloader_seen";

export function Preloader() {
  const { isMotionPaused, markPreloaderDone } = useMotion();
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<"loading" | "exiting" | "hidden">(
    "loading"
  );
  const rafRef = useRef<number | null>(null);
  const exitTimerRef = useRef<number | null>(null);

  const triggerExit = useCallback(
    (instant = false) => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }

      try {
        window.sessionStorage.setItem(SESSION_KEY, "1");
      } catch {
        // Ignore storage errors in private contexts
      }

      if (instant) {
        setProgress(100);
        setPhase("hidden");
        markPreloaderDone();
        return;
      }

      setProgress(100);
      setPhase("exiting");
      exitTimerRef.current = window.setTimeout(() => {
        setPhase("hidden");
        markPreloaderDone();
      }, CURTAIN_DURATION_MS);
    },
    [markPreloaderDone]
  );

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    let alreadySeen = false;
    try {
      alreadySeen = window.sessionStorage.getItem(SESSION_KEY) === "1";
    } catch {
      alreadySeen = false;
    }

    if (alreadySeen || prefersReduced || isMotionPaused) {
      const id = window.requestAnimationFrame(() => triggerExit(true));
      return () => window.cancelAnimationFrame(id);
    }

    const startTime = performance.now();

    const step = (now: number) => {
      const elapsed = now - startTime;
      const raw = Math.min(elapsed / PRELOADER_DURATION_MS, 1);
      // Ease-out cubic for brisk, refined sartorial cadence
      const eased = 1 - Math.pow(1 - raw, 3);
      const nextValue = Math.round(eased * 100);

      setProgress(nextValue);

      if (raw < 1) {
        rafRef.current = requestAnimationFrame(step);
      } else {
        triggerExit(false);
      }
    };

    rafRef.current = requestAnimationFrame(step);

    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
      if (exitTimerRef.current !== null) {
        window.clearTimeout(exitTimerRef.current);
      }
    };
  }, [isMotionPaused, triggerExit]);

  if (phase === "hidden") {
    return null;
  }

  const formattedProgress = String(progress).padStart(2, "0");

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label={`Cargando atelier Cristian Mancuso ${progress}%`}
      className="fixed inset-0 z-[100] flex flex-col justify-between bg-obsidian px-6 py-7 sm:px-12 sm:py-10 select-none will-change-transform"
      style={{
        transform:
          phase === "exiting" ? "translate3d(0, -100%, 0)" : "translate3d(0, 0, 0)",
        transition:
          phase === "exiting"
            ? `transform ${CURTAIN_DURATION_MS}ms cubic-bezier(0.76, 0, 0.24, 1)`
            : "none",
      }}
    >
      {/* Subtle ambient grain */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 atelier-grain opacity-70"
      />

      {/* Top Monogram Row */}
      <div className="relative z-10 flex items-center justify-between border-b border-black/10 pb-4 dark:border-white/[0.08]">
        <BrandLogo markSize={28} />
        <span className="hidden sm:inline text-xs tracking-[0.18em] text-muted uppercase">
          Buenos Aires · Sastrería de Autor
        </span>
      </div>

      {/* Center Counter & Hairline */}
      <div className="relative z-10 my-auto flex flex-col items-center text-center">
        <p className="mb-4 font-mono text-[10px] sm:text-[11px] tracking-[0.28em] text-muted uppercase">
          Calibrando Atelier Textil
        </p>

        <div className="flex items-baseline justify-center font-display text-[clamp(4.5rem,16vw,11rem)] font-bold leading-none tracking-[-0.05em] text-primary tabular-nums">
          <span>{formattedProgress}</span>
          <span className="ml-1 text-[0.38em] font-semibold text-champagne">
            %
          </span>
        </div>

        <div className="mt-8 w-full max-w-md overflow-hidden bg-black/10 dark:bg-white/[0.08] h-[1.5px]">
          <div
            className="h-full w-full origin-left will-change-transform"
            style={{
              transform: `scaleX(${progress / 100})`,
              background:
                "linear-gradient(90deg, var(--accent-champagne) 0%, var(--accent-cyan) 100%)",
            }}
          />
        </div>

        <p className="mt-4 font-mono text-[10px] tracking-[0.22em] text-muted/80 uppercase">
          Pima 120/2 · Lino Italiano · Nácar Australiano
        </p>
      </div>

      {/* Bottom Row with Skip Button */}
      <div className="relative z-10 flex items-center justify-between border-t border-black/10 pt-4 dark:border-white/[0.08]">
        <span className="font-mono text-[10px] sm:text-[11px] tracking-[0.2em] text-champagne/90 uppercase">
          A medida · Sin cargo extra
        </span>

        <button
          id="preloader-skip-btn"
          type="button"
          onClick={() => triggerExit(isMotionPaused)}
          className="cursor-pointer font-mono text-[11px] tracking-[0.22em] text-muted transition-colors duration-200 hover:text-primary focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-champagne px-2 py-1"
        >
          [ SALTAR ]
        </button>
      </div>
    </div>
  );
}
