"use client";

import { useEffect, useState } from "react";
import { useMotion } from "@/context/MotionContext";

const STOPS = [
  { cm: 0, label: "Inicio", href: "/#hero" },
  { cm: 35, label: "Colección", href: "/#coleccion" },
  { cm: 70, label: "A Medida", href: "/#arma-tu-camisa" },
  { cm: 100, label: "Medidas", href: "/#como-medir" },
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
  const activeStop =
    currentCm >= 82
      ? STOPS[3]
      : currentCm >= 52
      ? STOPS[2]
      : currentCm >= 18
      ? STOPS[1]
      : STOPS[0];

  return (
    <aside
      aria-label="Progreso de lectura — cinta métrica de sastre"
      className="hidden xl:flex fixed right-5 top-1/2 -translate-y-1/2 z-40 flex-col items-end gap-3 pointer-events-none select-none"
    >
      {/* Active cm & section badge */}
      <div className="rounded-xl border border-bronze/35 bg-navy/90 px-2.5 py-1.5 text-right backdrop-blur-md shadow-[0_10px_28px_rgba(15,23,42,0.35)]">
        <p className="font-mono text-[11px] font-medium text-bronze tabular-nums leading-none">
          {String(currentCm).padStart(2, "0")} cm
        </p>
        <p className="mt-1 text-[10px] font-medium text-primary/90 leading-none">
          {activeStop.label}
        </p>
      </div>

      {/* Graduated Tailor Tape Rail (0 cm -> 100 cm) */}
      <div className="relative flex h-56 w-7 items-center justify-end pr-1">
        {/* Background rail */}
        <div className="relative h-full w-[2px] rounded-full bg-bronze/20">
          {/* Active bronze progress fill */}
          <div
            className="h-full w-full origin-top rounded-full bg-bronze will-change-transform"
            style={{
              transform: `scaleY(${isMotionPaused ? 1 : Math.max(progress, 0.04)})`,
              transition: isMotionPaused ? "none" : "transform 120ms linear",
            }}
          />

          {/* Needle indicator */}
          {!isMotionPaused && (
            <span
              aria-hidden="true"
              className="absolute -left-[4px] h-2.5 w-2.5 rounded-full border border-navy bg-bronze shadow-[0_0_10px_rgba(197,155,95,0.75)] will-change-transform"
              style={{
                top: 0,
                transform: `translate3d(0, ${progress * 214}px, 0)`,
                transition: "transform 120ms linear",
              }}
            />
          )}
        </div>

        {/* Graduated millimeter / cm tick marks */}
        <div
          aria-hidden="true"
          className="absolute inset-y-0 right-2.5 flex flex-col justify-between py-0.5"
        >
          {Array.from({ length: 11 }).map((_, idx) => {
            const isMajor = idx === 0 || idx === 3 || idx === 7 || idx === 10;
            return (
              <span
                key={idx}
                className={`block h-[1px] ${
                  isMajor ? "w-3 bg-bronze/75" : "w-1.5 bg-bronze/35"
                }`}
              />
            );
          })}
        </div>
      </div>

      {/* 0 / 100 cm anchors */}
      <span className="font-mono text-[9px] text-bronze/80 tabular-nums">
        100 cm
      </span>
    </aside>
  );
}
