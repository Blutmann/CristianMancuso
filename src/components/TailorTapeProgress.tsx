"use client";

import { useEffect, useState } from "react";
import { useMotion } from "@/context/MotionContext";

const TICKS = Array.from({ length: 21 }, (_, idx) => idx * 5);

const NAV_STOPS = [
  { cm: 0, label: "Inicio", targetId: "hero" },
  { cm: 50, label: "4 Gamas", targetId: "gamas" },
  { cm: 100, label: "A medida", targetId: "invitacion-medida" },
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
      className="liquid-glass fixed right-4 top-1/2 z-40 hidden w-16 -translate-y-1/2 flex-col items-center rounded-2xl px-1.5 py-3 text-[#111113] select-none xl:flex dark:text-white"
    >
      {/* Live cm Readout */}
      <div className="mb-2.5 w-full border-b border-black/10 pb-2 text-center dark:border-white/12">
        <span className="block font-mono text-xs font-semibold leading-none tabular-nums">
          {String(currentCm).padStart(2, "0")}
        </span>
        <span className="mt-0.5 block font-mono text-[9px] leading-none opacity-55">
          cm
        </span>
      </div>

      {/* Interactive Graduated Tape */}
      <div className="relative h-[260px] w-full">
        <div className="pointer-events-none absolute right-2 top-0 bottom-0 w-[1.5px] rounded-full bg-black/12 dark:bg-white/12">
          <div
            className="h-full w-full origin-top rounded-full bg-[#16233B] will-change-transform dark:bg-white"
            style={{
              transform: `scaleY(${isMotionPaused ? 1 : Math.max(progress, 0.02)})`,
              transition: isMotionPaused ? "none" : "transform 110ms linear",
            }}
          />
        </div>

        {!isMotionPaused && (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 flex items-center justify-end pr-1 will-change-transform"
            style={{
              top: 0,
              transform: `translate3d(0, ${progress * 248}px, 0)`,
              transition: "transform 110ms linear",
            }}
          >
            <span className="h-[1px] w-full bg-[#16233B]/60 dark:bg-white/70" />
            <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#16233B] shadow-sm dark:bg-white dark:shadow-[0_0_12px_rgba(255,255,255,0.9)]" />
          </div>
        )}

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
                        ? "w-2.5 bg-[#16233B] dark:bg-white/80"
                        : "w-2.5 bg-black/25 dark:bg-white/30"
                      : isPassed
                        ? "w-1.5 bg-[#16233B]/55 dark:bg-white/45"
                        : "w-1.5 bg-black/12 dark:bg-white/15"
                  }`}
                />
              </div>
            );
          })}
        </div>

        {NAV_STOPS.map((stop) => {
          const isCurrent = Math.abs(currentCm - stop.cm) <= 22;
          return (
            <button
              key={stop.targetId}
              type="button"
              onClick={() => handleJump(stop.targetId)}
              title={stop.label}
              aria-label={`Ir a ${stop.label}`}
              style={{ top: `${stop.cm}%` }}
              className="group cursor-pointer absolute right-0 flex h-6 w-full -translate-y-1/2 items-center justify-end pr-1"
            >
              <span
                className={`h-2 w-2 rounded-full transition-all ${
                  isCurrent
                    ? "scale-125 bg-[#16233B] dark:bg-white"
                    : "bg-black/25 group-hover:bg-[#16233B] dark:bg-white/35 dark:group-hover:bg-white"
                }`}
              />
            </button>
          );
        })}
      </div>
    </aside>
  );
}
