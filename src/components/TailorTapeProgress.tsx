"use client";

import { useEffect, useState } from "react";
import { useMotion } from "@/context/MotionContext";

const TICKS = Array.from({ length: 21 }, (_, idx) => idx * 5); // 0, 5, 10 ... 100 cm

const NAV_STOPS = [
  { cm: 0, label: "Inicio", targetId: "hero" },
  { cm: 35, label: "Colección", targetId: "coleccion" },
  { cm: 70, label: "Armá tu camisa", targetId: "arma-tu-camisa" },
  { cm: 100, label: "Cómo medir", targetId: "como-medir" },
] as const;

export function TailorTapeProgress() {
  const { isMotionPaused } = useMotion();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const update = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const ratio =
        docHeight > 0 ? Math.min(Math.max(scrollTop / docHeight, 0), 1) : 0;
      setProgress(ratio);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update, { passive: true });

    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  const currentCm = Math.round(progress * 100);

  const handleJump = (targetId: string) => {
    const el = document.getElementById(targetId);
    if (!el) return;
    el.scrollIntoView({
      behavior: isMotionPaused ? "auto" : "smooth",
      block: "start",
    });
  };

  return (
    <aside
      aria-label="Navegación rápida en cinta métrica"
      className="hidden xl:flex fixed right-4 top-1/2 -translate-y-1/2 z-40 w-16 flex-col items-center rounded-2xl liquid-glass py-3 px-1.5 text-white select-none"
    >
      {/* Live cm Readout */}
      <div className="mb-2.5 w-full border-b border-white/12 pb-2 text-center">
        <span className="block font-mono text-xs font-semibold text-white tabular-nums leading-none">
          {String(currentCm).padStart(2, "0")}
        </span>
        <span className="mt-0.5 block font-mono text-[9px] text-white/55 leading-none">
          cm
        </span>
      </div>

      {/* Interactive Liquid Glass Graduated Tape (0 to 100 cm) */}
      <div className="relative h-[300px] w-full">
        {/* Background vertical rail */}
        <div className="pointer-events-none absolute right-2 top-0 bottom-0 w-[1.5px] rounded-full bg-white/12">
          <div
            className="h-full w-full origin-top rounded-full bg-white will-change-transform"
            style={{
              transform: `scaleY(${isMotionPaused ? 1 : Math.max(progress, 0.02)})`,
              transition: isMotionPaused ? "none" : "transform 110ms linear",
            }}
          />
        </div>

        {/* Moving Specular White Cursor */}
        {!isMotionPaused && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 flex items-center justify-end pr-1 will-change-transform"
            style={{
              top: 0,
              transform: `translate3d(0, ${progress * 288}px, 0)`,
              transition: "transform 110ms linear",
            }}
          >
            <span className="h-[1px] w-full bg-white/70" />
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.9)]" />
          </div>
        )}

        {/* Background Fine 5 cm Ticks */}
        <div
          aria-hidden="true"
          className="pointer-events-none relative flex h-full flex-col justify-between pr-3.5"
        >
          {TICKS.map((cm) => {
            const isMajor = cm % 10 === 0;
            const isPassed = currentCm >= cm;
            return (
              <div
                key={cm}
                className="flex items-center justify-end gap-1 leading-none"
              >
                <span
                  className={`block h-[1px] ${
                    isMajor
                      ? isPassed
                        ? "w-2.5 bg-white/80"
                        : "w-2.5 bg-white/30"
                      : isPassed
                      ? "w-1.5 bg-white/45"
                      : "w-1.5 bg-white/15"
                  }`}
                />
              </div>
            );
          })}
        </div>

        {/* Clickable Section Navigation Stops (0, 35, 70, 100) */}
        {NAV_STOPS.map((stop) => {
          const topPercent = stop.cm;
          const isReached = currentCm >= stop.cm - 6;
          return (
            <button
              key={stop.targetId}
              type="button"
              onClick={() => handleJump(stop.targetId)}
              title={`Ir a ${stop.label}`}
              aria-label={`Ir a ${stop.label} (${stop.cm} cm)`}
              style={{ top: `${topPercent}%` }}
              className="cursor-pointer group absolute left-0 right-1 -translate-y-1/2 flex items-center justify-start pl-1 py-1.5 focus-visible:outline-none"
            >
              <span
                className={`font-mono text-[9.5px] tabular-nums transition-colors ${
                  isReached
                    ? "text-white font-semibold"
                    : "text-white/50 group-hover:text-white"
                }`}
              >
                {stop.cm}
              </span>

              {/* Hover Glass Tooltip */}
              <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-full liquid-glass-active px-3 py-1 text-[11px] font-medium text-white opacity-0 transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
                {stop.label}
              </span>
            </button>
          );
        })}
      </div>
    </aside>
  );
}
