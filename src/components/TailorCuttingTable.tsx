"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMotion } from "@/context/MotionContext";

gsap.registerPlugin(ScrollTrigger);

const PHRASES = [
  {
    step: "01",
    text: "Trazamos tu molde desde cero",
  },
  {
    step: "02",
    text: "Cortamos sobre tu tela elegida",
  },
  {
    step: "03",
    text: "Cosemos cada detalle a tu medida",
  },
] as const;

export function TailorCuttingTable() {
  const { isMotionPaused } = useMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const phase1Ref = useRef<SVGPathElement | null>(null);
  const phase2Ref = useRef<SVGPathElement | null>(null);
  const phase3Ref = useRef<SVGPathElement | null>(null);
  const monogramRef = useRef<SVGTextElement | null>(null);
  const [activePhase, setActivePhase] = useState(0);

  useEffect(() => {
    const p1 = phase1Ref.current;
    const p2 = phase2Ref.current;
    const p3 = phase3Ref.current;
    const mono = monogramRef.current;

    if (!p1 || !p2 || !p3) return;

    const resetToCompleted = () => {
      [p1, p2, p3].forEach((path) => {
        path.style.strokeDasharray = "none";
        path.style.strokeDashoffset = "0";
      });
      if (mono) gsap.set(mono, { opacity: 1 });
    };

    if (isMotionPaused || !sectionRef.current) {
      resetToCompleted();
      return;
    }

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const len1 = p1.getTotalLength();
      const len2 = p2.getTotalLength();
      const len3 = p3.getTotalLength();

      gsap.set(p1, { strokeDasharray: len1, strokeDashoffset: len1 });
      gsap.set(p2, { strokeDasharray: len2, strokeDashoffset: len2 });
      gsap.set(p3, { strokeDasharray: len3, strokeDashoffset: len3 });
      if (mono) gsap.set(mono, { opacity: 0 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=1900",
          pin: true,
          scrub: 0.6,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;
            setActivePhase(p < 0.34 ? 0 : p < 0.68 ? 1 : 2);
          },
        },
      });

      tl.to(p1, { strokeDashoffset: 0, duration: 0.34, ease: "none" })
        .to(p2, { strokeDashoffset: 0, duration: 0.34, ease: "none" })
        .to(p3, { strokeDashoffset: 0, duration: 0.28, ease: "none" });

      if (mono) {
        tl.to(mono, { opacity: 1, duration: 0.12, ease: "power1.out" }, "-=0.1");
      }

      return () => {
        resetToCompleted();
      };
    });

    mm.add("(max-width: 1023px)", () => {
      resetToCompleted();
    });

    return () => {
      mm.revert();
    };
  }, [isMotionPaused]);

  return (
    <section
      ref={sectionRef}
      id="oficio"
      aria-labelledby="oficio-heading"
      className="relative w-full border-t border-white/10 bg-[#09090B] text-white overflow-hidden"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 atelier-grain opacity-65" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[82svh] lg:min-h-[100svh] max-w-7xl flex-col justify-center px-5 py-20 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          {/* Left Column: 3 Concise Sartorial Craft Phrases */}
          <div className="lg:col-span-5">
            <div className="mb-4 flex items-center gap-3">
              <span aria-hidden="true" className="h-[1px] w-7 bg-stitch" />
              <span className="text-xs font-medium tracking-[0.2em] text-stitch uppercase">
                El oficio del sastre
              </span>
            </div>

            <h2
              id="oficio-heading"
              className="font-display text-[clamp(1.9rem,3.8vw,3rem)] font-bold leading-[1.05] tracking-[-0.03em] text-white"
            >
              Mesa de corte
            </h2>

            <ol className="mt-8 space-y-5 border-l border-white/12 pl-5">
              {PHRASES.map((item, idx) => {
                const highlighted = isMotionPaused || activePhase >= idx;
                const isCurrent = !isMotionPaused && activePhase === idx;
                return (
                  <li
                    key={item.step}
                    className={`relative transition-opacity duration-300 ${
                      highlighted ? "opacity-100" : "opacity-35"
                    }`}
                  >
                    <span
                      aria-hidden="true"
                      className={`absolute -left-[25px] top-1.5 h-2 w-2 rounded-full transition-colors ${
                        isCurrent || isMotionPaused
                          ? "bg-stitch"
                          : highlighted
                          ? "bg-white"
                          : "bg-white/25"
                      }`}
                    />
                    <span className="block font-mono text-[11px] text-stitch">
                      {item.step}
                    </span>
                    <p className="mt-1 font-display text-xl sm:text-2xl font-bold leading-snug tracking-[-0.02em] text-white">
                      {item.text}
                    </p>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Right Column: White Tailor's Chalk Pattern Drawing Live on Black Wool */}
          <div className="lg:col-span-7">
            <div className="relative overflow-hidden rounded-3xl border border-white/12 bg-[#0D0D10] p-4 sm:p-8 shadow-[0_30px_90px_rgba(0,0,0,0.75)]">
              {/* Subtle Tailor Ruler Edge Ticks */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-8 top-3 flex justify-between opacity-30"
              >
                {Array.from({ length: 19 }).map((_, i) => (
                  <span
                    key={i}
                    className={`w-[1px] bg-white ${
                      i % 3 === 0 ? "h-2.5" : "h-1.5"
                    }`}
                  />
                ))}
              </div>

              <svg
                viewBox="0 0 520 420"
                className="mx-auto h-auto w-full max-w-[500px]"
                role="img"
                aria-label="Molde de camisa manga larga trazado con tiza blanca de sastre sobre paño negro"
              >
                {/* Phase 1 Chalk: Shoulders, Collar Neckline & Torso Pattern */}
                <path
                  ref={phase1Ref}
                  d="M 206 62 Q 260 82 314 62 L 356 82 L 344 176 L 344 366 Q 260 384 176 366 L 176 176 L 164 82 Z M 206 62 L 190 112 L 258 88 M 314 62 L 330 112 L 262 88"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Phase 2 Chalk: Armholes (Sisas), Full Long Sleeves & Buttoned Cuffs */}
                <path
                  ref={phase2Ref}
                  d="M 164 82 L 96 330 L 136 342 L 176 176 M 102 302 L 142 314 M 356 82 L 424 330 L 384 342 L 344 176 M 378 314 L 418 302"
                  fill="none"
                  stroke="#FFFFFF"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Phase 3 Stitch & Cut Guides: Center Placket, Darts, Cut Notches (#C9A96E) */}
                <path
                  ref={phase3Ref}
                  d="M 248 88 L 248 372 M 272 88 L 272 372 M 176 196 L 344 196 M 206 46 Q 260 66 314 46 M 366 76 L 434 328 M 86 328 L 154 76"
                  fill="none"
                  stroke="#C9A96E"
                  strokeWidth="1.25"
                  strokeDasharray="5 4"
                  strokeLinecap="round"
                />

                {/* Embroidered C.M. Monogram on Left Cuff */}
                <text
                  ref={monogramRef}
                  x="396"
                  y="328"
                  textAnchor="middle"
                  fill="#C9A96E"
                  fontSize="12"
                  fontFamily="Georgia, serif"
                  fontStyle="italic"
                  fontWeight="600"
                >
                  C.M.
                </text>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
