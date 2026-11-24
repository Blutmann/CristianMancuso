"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useMotion } from "@/context/MotionContext";

gsap.registerPlugin(ScrollTrigger);

const PHRASES = [
  { step: "01", text: "Trazamos tu molde desde cero" },
  { step: "02", text: "Cortamos sobre tu tela elegida" },
  { step: "03", text: "Cosemos cada detalle a tu medida" },
] as const;

const FULL_SHIRT_SILHOUETTE =
  "M 206 62 Q 260 82 314 62 L 356 82 L 424 330 L 384 342 L 344 176 L 344 366 Q 260 384 176 366 L 176 176 L 136 342 L 96 330 L 164 82 Z";

export function TailorCuttingTable() {
  const { isMotionPaused } = useMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const phase1Ref = useRef<SVGPathElement | null>(null);
  const phase2Ref = useRef<SVGPathElement | null>(null);
  const phase3Ref = useRef<SVGPathElement | null>(null);
  const fabricMaskRectRef = useRef<SVGRectElement | null>(null);
  const shearsRef = useRef<SVGGElement | null>(null);
  const monogramRef = useRef<SVGTextElement | null>(null);
  const [activePhase, setActivePhase] = useState(0);

  useEffect(() => {
    const p1 = phase1Ref.current;
    const p2 = phase2Ref.current;
    const p3 = phase3Ref.current;
    const fabricMask = fabricMaskRectRef.current;
    const shears = shearsRef.current;
    const mono = monogramRef.current;

    if (!p1 || !p2 || !p3) return;

    const resetToCompleted = () => {
      [p1, p2, p3].forEach((path) => {
        path.style.strokeDasharray = "none";
        path.style.strokeDashoffset = "0";
      });
      if (fabricMask) gsap.set(fabricMask, { attr: { height: 340 } });
      if (mono) gsap.set(mono, { opacity: 1 });
      if (shears) {
        gsap.set(shears, { x: 404, y: 318, rotation: -35, opacity: 0.9 });
      }
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
      if (fabricMask) gsap.set(fabricMask, { attr: { height: 0 } });
      if (mono) gsap.set(mono, { opacity: 0 });
      if (shears) {
        const startPt = p1.getPointAtLength(0);
        gsap.set(shears, { x: startPt.x, y: startPt.y, rotation: 0, opacity: 1 });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=950",
          pin: true,
          scrub: 0.55,
          anticipatePin: 1,
          onUpdate: (self) => {
            const p = self.progress;
            setActivePhase(p < 0.34 ? 0 : p < 0.68 ? 1 : 2);

            // Move Tailor's Shears smoothly along the active chalk contour
            if (shears) {
              let targetPath: SVGPathElement = p1;
              let localProgress = 0;

              if (p < 0.45) {
                targetPath = p1;
                localProgress = p / 0.45;
              } else {
                targetPath = p2;
                localProgress = Math.min((p - 0.45) / 0.55, 1);
              }

              const total = targetPath.getTotalLength();
              const dist = total * localProgress;
              const pt = targetPath.getPointAtLength(dist);
              const nextPt = targetPath.getPointAtLength(
                Math.min(dist + 4, total)
              );
              const angle =
                (Math.atan2(nextPt.y - pt.y, nextPt.x - pt.x) * 180) / Math.PI;
              const snip = Math.sin(p * Math.PI * 18) * 8;

              gsap.set(shears, {
                x: pt.x,
                y: pt.y,
                rotation: angle + snip,
              });
            }
          },
        },
      });

      tl.to(p1, { strokeDashoffset: 0, duration: 0.42, ease: "none" }, 0)
        .to(p2, { strokeDashoffset: 0, duration: 0.36, ease: "none" }, 0.38)
        .to(p3, { strokeDashoffset: 0, duration: 0.24, ease: "none" }, 0.72);

      // Progressively reveal real woven fabric texture inside the cut silhouette
      if (fabricMask) {
        tl.to(
          fabricMask,
          { attr: { height: 340 }, duration: 0.72, ease: "none" },
          0.18
        );
      }

      if (mono) {
        tl.to(mono, { opacity: 1, duration: 0.12, ease: "power1.out" }, 0.86);
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
      className="relative w-full border-t border-white/10 bg-[#161619] text-[#F5F5F7] overflow-hidden"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 atelier-grain opacity-60" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[78svh] lg:min-h-[100svh] max-w-7xl flex-col justify-center px-5 py-16 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
          {/* Left Column: 3 Concise Sartorial Craft Phrases */}
          <div className="lg:col-span-5">
            <div className="mb-4 flex items-center gap-3">
              <span aria-hidden="true" className="h-[1px] w-7 bg-gold" />
              <span className="text-xs font-medium tracking-[0.2em] text-gold uppercase">
                El oficio del sastre
              </span>
            </div>

            <h2
              id="oficio-heading"
              className="font-display text-[clamp(1.9rem,3.8vw,3rem)] font-bold leading-[1.05] tracking-[-0.03em] text-[#F5F5F7]"
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
                          ? "bg-gold"
                          : highlighted
                          ? "bg-white"
                          : "bg-white/25"
                      }`}
                    />
                    <span className="block font-mono text-[11px] text-gold">
                      {item.step}
                    </span>
                    <p className="mt-1 font-display text-xl sm:text-2xl font-bold leading-snug tracking-[-0.02em] text-[#F5F5F7]">
                      {item.text}
                    </p>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Right Column: Cutting Table with Progressive Fabric Texture Reveal & Shears */}
          <div className="lg:col-span-7">
            <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#1B1B1F] p-4 sm:p-8 shadow-[0_30px_90px_rgba(0,0,0,0.65)]">
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
                aria-label="Molde manga larga con textura textil revelada progresivamente al cortar con tijera de sastre"
              >
                <defs>
                  <pattern
                    id="cutting-pima-texture"
                    width="9"
                    height="9"
                    patternUnits="userSpaceOnUse"
                    patternTransform="rotate(35)"
                  >
                    <rect width="9" height="9" fill="#1F2430" />
                    <line
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="9"
                      stroke="rgba(255,255,255,0.09)"
                      strokeWidth="1.2"
                    />
                    <line
                      x1="4.5"
                      y1="0"
                      x2="4.5"
                      y2="9"
                      stroke="rgba(200,162,90,0.08)"
                      strokeWidth="0.9"
                    />
                  </pattern>

                  <clipPath id="cutting-fabric-wipe">
                    <rect
                      ref={fabricMaskRectRef}
                      x="80"
                      y="52"
                      width="360"
                      height="340"
                    />
                  </clipPath>
                </defs>

                {/* Progressively Revealed Woven Fabric Inside Shirt Silhouette */}
                <g clipPath="url(#cutting-fabric-wipe)">
                  <path
                    d={FULL_SHIRT_SILHOUETTE}
                    fill="url(#cutting-pima-texture)"
                    opacity="0.92"
                  />
                </g>

                {/* Phase 1 Chalk: Shoulders, Collar Neckline & Torso Pattern */}
                <path
                  ref={phase1Ref}
                  d="M 206 62 Q 260 82 314 62 L 356 82 L 344 176 L 344 366 Q 260 384 176 366 L 176 176 L 164 82 Z M 206 62 L 190 112 L 258 88 M 314 62 L 330 112 L 262 88"
                  fill="none"
                  stroke="#FAFAFA"
                  strokeWidth="1.9"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Phase 2 Chalk: Armholes, Full Long Sleeves & Buttoned Cuffs */}
                <path
                  ref={phase2Ref}
                  d="M 164 82 L 96 330 L 136 342 L 176 176 M 102 302 L 142 314 M 356 82 L 424 330 L 384 342 L 344 176 M 378 314 L 418 302"
                  fill="none"
                  stroke="#FAFAFA"
                  strokeWidth="1.7"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />

                {/* Phase 3 Gold Cut & Stitch Guides (#C8A25A) */}
                <path
                  ref={phase3Ref}
                  d="M 248 88 L 248 372 M 272 88 L 272 372 M 176 196 L 344 196 M 206 46 Q 260 66 314 46 M 366 76 L 434 328 M 86 328 L 154 76"
                  fill="none"
                  stroke="#C8A25A"
                  strokeWidth="1.5"
                  strokeDasharray="5 4"
                  strokeLinecap="round"
                />

                {/* Embroidered C.M. Monogram on Left Cuff */}
                <text
                  ref={monogramRef}
                  x="396"
                  y="328"
                  textAnchor="middle"
                  fill="#C8A25A"
                  fontSize="12"
                  fontFamily="Georgia, serif"
                  fontStyle="italic"
                  fontWeight="600"
                >
                  C.M.
                </text>

                {/* Animated Tailor's Shears gliding along the cut contour */}
                <g ref={shearsRef}>
                  <path
                    d="M -2 0 L 24 -5.5 L 2 3.2 Z"
                    fill="#FAFAFA"
                    stroke="#111113"
                    strokeWidth="0.6"
                  />
                  <path
                    d="M -2 0 L 24 5.5 L 2 -3.2 Z"
                    fill="#D4D4D8"
                    stroke="#111113"
                    strokeWidth="0.6"
                  />
                  <circle cx="2" cy="0" r="2.4" fill="#C8A25A" />
                  <circle
                    cx="-10.5"
                    cy="-6.8"
                    r="5.2"
                    fill="none"
                    stroke="#C8A25A"
                    strokeWidth="2.1"
                  />
                  <circle
                    cx="-10.5"
                    cy="6.8"
                    r="5.6"
                    fill="none"
                    stroke="#C8A25A"
                    strokeWidth="2.1"
                  />
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
