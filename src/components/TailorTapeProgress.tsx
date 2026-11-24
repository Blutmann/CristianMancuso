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
      className="hidden xl:flex fixed right-4 top-1/2 -translate-y-1/2 z-40 w-14 flex-col items-center rounded-2xl border border-[#111113]/30 bg-[#EFE8D8] py-3 px-1.5 text-[#111113] shadow-[0_18px_42px_rgba(0,0,0,0.45)] pointer-events-none select-none"
    >
      {/* Live cm Readout */}
      <div className="mb-2.5 w-full border-b border-[#111113]/15 pb-2 text-center">
        <span className="block font-mono text-xs font-bold text-[#111113] tabular-nums leading-none">
          {String(currentCm).padStart(2, "0")}
        </span>
        <span className="mt-0.5 block font-mono text-[9px] font-medium text-[#111113]/70 leading-none">
          cm
        </span>
      </div>

      {/* Natural Ivory Tailor Tape (0 to 100 cm every 5 cm) */}
      <div className="relative h-[300px] w-full">
        {/* Background vertical rail */}
        <div className="absolute right-1.5 top-0 bottom-0 w-[2px] rounded-full bg-[#111113]/15">
          <div
            className="h-full w-full origin-top rounded-full bg-[#C8A25A] will-change-transform"
            style={{
              transform: `scaleY(${isMotionPaused ? 1 : Math.max(progress, 0.02)})`,
              transition: isMotionPaused ? "none" : "transform 110ms linear",
            }}
          />
        </div>

        {/* Moving Gold Cursor Needle with Black Border */}
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
            <span className="h-[2px] w-full bg-[#C8A25A]" />
            <span className="h-3 w-3 shrink-0 rounded-full border-2 border-[#111113] bg-[#C8A25A] shadow-sm" />
          </div>
        )}

        {/* Graduated 5 cm Ticks + 10 cm Black Numerals */}
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
                    className={`font-mono text-[9px] tabular-nums ${
                      isPassed
                        ? "text-[#111113] font-bold"
                        : "text-[#111113]/65 font-medium"
                    }`}
                  >
                    {cm}
                  </span>
                )}
                <span
                  className={`block h-[1px] ${
                    isMajor
                      ? "w-3 bg-[#111113]"
                      : "w-1.5 bg-[#111113]/45"
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
