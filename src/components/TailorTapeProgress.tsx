"use client";

import { useEffect, useState } from "react";
import { useMotion } from "@/context/MotionContext";

const TICKS = Array.from({ length: 21 }, (_, idx) => idx * 5); // 0, 5, 10 ... 100 cm

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

  return (
    <aside
      aria-label="Cinta métrica de sastre — progreso de lectura"
      className="hidden xl:flex fixed right-4 top-1/2 -translate-y-1/2 z-40 w-14 flex-col items-center rounded-2xl border border-gold/35 bg-[#18181B]/92 py-3 px-1.5 backdrop-blur-md shadow-[0_16px_40px_rgba(0,0,0,0.55)] pointer-events-none select-none"
    >
      {/* Live cm Readout */}
      <div className="mb-2.5 w-full border-b border-white/10 pb-2 text-center">
        <span className="block font-mono text-xs font-semibold text-gold tabular-nums leading-none">
          {String(currentCm).padStart(2, "0")}
        </span>
        <span className="mt-0.5 block font-mono text-[9px] text-muted leading-none">
          cm
        </span>
      </div>

      {/* Wide Graduated Tailor Tape (0 to 100 cm every 5 cm) */}
      <div className="relative h-[300px] w-full">
        {/* Background vertical rail */}
        <div className="absolute right-1.5 top-0 bottom-0 w-[2px] rounded-full bg-white/10">
          <div
            className="h-full w-full origin-top rounded-full bg-gold will-change-transform"
            style={{
              transform: `scaleY(${isMotionPaused ? 1 : Math.max(progress, 0.02)})`,
              transition: isMotionPaused ? "none" : "transform 110ms linear",
            }}
          />
        </div>

        {/* Moving Gold Needle Marker */}
        {!isMotionPaused && (
          <div
            aria-hidden="true"
            className="absolute inset-x-0 flex items-center justify-end pr-0.5 will-change-transform"
            style={{
              top: 0,
              transform: `translate3d(0, ${progress * 288}px, 0)`,
              transition: "transform 110ms linear",
            }}
          >
            <span className="h-[2px] w-full bg-gold/90" />
            <span className="h-2.5 w-2.5 shrink-0 rounded-full border border-[#111113] bg-gold shadow-[0_0_10px_rgba(200,162,90,0.85)]" />
          </div>
        )}

        {/* Graduated 5 cm Ticks + 10 cm Numbers */}
        <div className="relative flex h-full flex-col justify-between pr-3">
          {TICKS.map((cm) => {
            const isMajor = cm % 10 === 0;
            const isPassed = currentCm >= cm;
            return (
              <div
                key={cm}
                className="flex items-center justify-end gap-1 leading-none"
              >
                {isMajor && (
                  <span
                    className={`font-mono text-[9px] tabular-nums transition-colors ${
                      isPassed ? "text-gold font-medium" : "text-muted/65"
                    }`}
                  >
                    {cm}
                  </span>
                )}
                <span
                  className={`block h-[1px] ${
                    isMajor
                      ? isPassed
                        ? "w-3 bg-gold"
                        : "w-3 bg-white/35"
                      : isPassed
                      ? "w-1.5 bg-gold/60"
                      : "w-1.5 bg-white/20"
                  }`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </aside>
  );
}
