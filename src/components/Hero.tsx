"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowUpRight, Ruler } from "lucide-react";
import { useMotion } from "@/context/MotionContext";

gsap.registerPlugin(ScrollTrigger);

const HERO_LINES = [
  { text: "Tu camisa", accent: false },
  { text: "a medida,", accent: false },
  { text: "sin costo extra.", accent: true },
] as const;

const BUTTON_Y = [96, 186, 276, 366] as const;
const STITCH_LEN = 20;

export function Hero() {
  const { isMotionPaused, preloaderDone } = useMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const floatStageRef = useRef<HTMLDivElement | null>(null);
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const fadeRefs = useRef<(HTMLElement | null)[]>([]);
  const stitchARefs = useRef<(SVGLineElement | null)[]>([]);
  const stitchBRefs = useRef<(SVGLineElement | null)[]>([]);
  const trailPathRef = useRef<SVGPathElement | null>(null);
  const needleRef = useRef<SVGGElement | null>(null);

  // Kinetic entrance choreography
  useEffect(() => {
    const lines = lineRefs.current.filter(Boolean) as HTMLSpanElement[];
    const fades = fadeRefs.current.filter(Boolean) as HTMLElement[];

    if (isMotionPaused) {
      gsap.set(lines, { yPercent: 0, opacity: 1 });
      gsap.set(fades, { y: 0, opacity: 1 });
      if (floatStageRef.current) {
        gsap.set(floatStageRef.current, { y: 0, scale: 1, opacity: 1 });
      }
      return;
    }

    if (!preloaderDone) {
      gsap.set(lines, { yPercent: 105, opacity: 0 });
      gsap.set(fades, { y: 18, opacity: 0 });
      if (floatStageRef.current) {
        gsap.set(floatStageRef.current, { y: 24, scale: 0.96, opacity: 0 });
      }
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.to(lines, {
        yPercent: 0,
        opacity: 1,
        duration: 1.0,
        stagger: 0.08,
      })
        .to(
          fades,
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.08,
            ease: "power3.out",
          },
          "-=0.65"
        )
        .to(
          floatStageRef.current,
          {
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 1.1,
            ease: "power3.out",
          },
          "-=0.75"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, [isMotionPaused, preloaderDone]);

  // 3D Pointer Tilt + Non-blocking Scroll Needle & Thread Cross-Stitching
  useEffect(() => {
    const stitchesA = stitchARefs.current.filter(Boolean) as SVGLineElement[];
    const stitchesB = stitchBRefs.current.filter(Boolean) as SVGLineElement[];
    const trail = trailPathRef.current;
    const needle = needleRef.current;
    const stage = floatStageRef.current;
    const section = sectionRef.current;

    if (isMotionPaused || !section || stitchesA.length === 0) {
      gsap.set([...stitchesA, ...stitchesB], { strokeDashoffset: 0 });
      if (trail) gsap.set(trail, { strokeDashoffset: 0 });
      if (needle) gsap.set(needle, { y: 270, x: 0, rotation: 0, opacity: 0.85 });
      if (stage) gsap.set(stage, { rotateX: 0, rotateY: 0 });
      return;
    }

    const trailLength = trail ? trail.getTotalLength() : 360;

    const ctx = gsap.context(() => {
      gsap.set([...stitchesA, ...stitchesB], { strokeDashoffset: STITCH_LEN });
      if (trail) {
        gsap.set(trail, {
          strokeDasharray: trailLength,
          strokeDashoffset: trailLength,
        });
      }
      if (needle) {
        gsap.set(needle, { y: -14, x: 14, rotation: -20, opacity: 1 });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom 35%",
          scrub: 0.45,
        },
      });

      if (trail) {
        tl.to(trail, { strokeDashoffset: 0, duration: 1, ease: "none" }, 0);
      }

      BUTTON_Y.forEach((cy, idx) => {
        const startAt = idx * 0.23;
        const deltaY = cy - BUTTON_Y[0];

        if (needle) {
          tl.to(
            needle,
            {
              y: deltaY,
              x: idx % 2 === 0 ? -12 : 16,
              rotation: idx % 2 === 0 ? -24 : 16,
              duration: 0.19,
              ease: "power1.inOut",
            },
            startAt
          );
        }

        if (stitchesA[idx]) {
          tl.to(
            stitchesA[idx],
            { strokeDashoffset: 0, duration: 0.11, ease: "none" },
            startAt + 0.04
          );
        }

        if (stitchesB[idx]) {
          tl.to(
            stitchesB[idx],
            { strokeDashoffset: 0, duration: 0.11, ease: "none" },
            startAt + 0.14
          );
        }
      });
    }, sectionRef);

    // Mouse-reactive 3D tilt on floating placket
    const quickRotX = stage
      ? gsap.quickTo(stage, "rotateX", { duration: 0.7, ease: "power3.out" })
      : null;
    const quickRotY = stage
      ? gsap.quickTo(stage, "rotateY", { duration: 0.7, ease: "power3.out" })
      : null;

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const rect = section.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      quickRotY?.(nx * 14);
      quickRotX?.(-ny * 12);
    };

    const handlePointerLeave = () => {
      quickRotX?.(0);
      quickRotY?.(0);
    };

    section.addEventListener("pointermove", handlePointerMove);
    section.addEventListener("pointerleave", handlePointerLeave);

    return () => {
      section.removeEventListener("pointermove", handlePointerMove);
      section.removeEventListener("pointerleave", handlePointerLeave);
      ctx.revert();
    };
  }, [isMotionPaused]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      aria-labelledby="hero-heading"
      className="relative min-h-[90svh] w-full overflow-hidden bg-transparent pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-36 flex flex-col justify-center"
    >
      {/* Main Editorial Split */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-12 xl:pr-24">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Clean Editorial Typography */}
          <div className="lg:col-span-7 flex flex-col items-start">
            <div
              ref={(el) => {
                fadeRefs.current[0] = el;
              }}
              className="mb-6 flex items-center gap-3"
            >
              <span aria-hidden="true" className="h-[1px] w-7 bg-white/40" />
              <span className="text-xs font-medium tracking-[0.22em] text-white/75 uppercase">
                Sastrería de autor · Buenos Aires
              </span>
            </div>

            <h1
              id="hero-heading"
              className="font-display text-[clamp(2.15rem,6.2vw,5.2rem)] font-bold leading-[0.99] tracking-[-0.04em] text-white"
            >
              {HERO_LINES.map((line, index) => (
                <span key={line.text} className="block overflow-hidden pb-1">
                  <span
                    ref={(el) => {
                      lineRefs.current[index] = el;
                    }}
                    className={`block will-change-transform ${
                      line.accent ? "text-white/70" : "text-white"
                    }`}
                  >
                    {line.text}
                  </span>
                </span>
              ))}
            </h1>

            <p
              ref={(el) => {
                fadeRefs.current[1] = el;
              }}
              className="mt-6 max-w-lg text-base sm:text-lg leading-relaxed text-muted"
            >
              Elegí tela, cuello y medidas. Envío a todo el país y exterior.
            </p>

            {/* Crystalline White Primary CTA + Liquid Glass Secondary CTA */}
            <div
              ref={(el) => {
                fadeRefs.current[2] = el;
              }}
              className="mt-9 flex flex-wrap items-center gap-3.5"
            >
              <Link
                id="hero-cta-collection"
                href="/#coleccion"
                className="group inline-flex min-h-[48px] items-center gap-2.5 rounded-full bg-white px-7 py-3 text-sm font-semibold text-[#0B0B0E] shadow-[0_12px_32px_rgba(255,255,255,0.16)] transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#0B0B0E]"
              >
                <span>Ver colección</span>
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </Link>

              <Link
                id="hero-cta-builder"
                href="/#arma-tu-camisa"
                className="group liquid-glass inline-flex min-h-[48px] items-center gap-2.5 rounded-full px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white/[0.11] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
              >
                <Ruler
                  className="h-4 w-4 text-white/80 transition-transform duration-300 group-hover:rotate-12"
                  aria-hidden="true"
                />
                <span>Armar a medida</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Boxless Floating 3D-Tilt Placket with Ambient Halo */}
          <div
            className="lg:col-span-5 flex items-center justify-center lg:justify-end"
            style={{ perspective: "1000px" }}
          >
            <div
              ref={floatStageRef}
              className="relative flex w-full max-w-[420px] flex-col items-center justify-center will-change-transform"
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Soft Studio Radial Halo (No Hard Box Container) */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-0 rounded-full opacity-55 blur-[75px]"
                style={{
                  background:
                    "radial-gradient(circle, rgba(255,255,255,0.14) 0%, rgba(214,195,165,0.06) 45%, rgba(11,11,14,0) 74%)",
                }}
              />

              <svg
                aria-hidden="true"
                className="relative z-10 h-auto w-full max-w-[380px] drop-shadow-[0_32px_60px_rgba(0,0,0,0.8)]"
                viewBox="0 0 380 450"
              >
                <defs>
                  <linearGradient
                    id="hero-placket-glass"
                    x1="0%"
                    y1="0%"
                    x2="100%"
                    y2="100%"
                  >
                    <stop offset="0%" stopColor="rgba(255,255,255,0.14)" />
                    <stop offset="50%" stopColor="rgba(255,255,255,0.05)" />
                    <stop offset="100%" stopColor="rgba(255,255,255,0.02)" />
                  </linearGradient>

                  <radialGradient id="hero-pearl-v7" cx="36%" cy="32%" r="66%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="48%" stopColor="#F4F4F5" />
                    <stop offset="85%" stopColor="#D4D4D8" />
                    <stop offset="100%" stopColor="#9CA3AF" />
                  </radialGradient>
                </defs>

                {/* Sculpted Floating Translucent Placket Strip */}
                <rect
                  x="126"
                  y="24"
                  width="128"
                  height="402"
                  rx="32"
                  fill="url(#hero-placket-glass)"
                  stroke="rgba(255,255,255,0.18)"
                  strokeWidth="1"
                />
                {/* Fine Inner Topstitching */}
                <line
                  x1="140"
                  y1="40"
                  x2="140"
                  y2="410"
                  stroke="rgba(214, 195, 165, 0.45)"
                  strokeWidth="1"
                  strokeDasharray="3 4"
                />
                <line
                  x1="240"
                  y1="40"
                  x2="240"
                  y2="410"
                  stroke="rgba(214, 195, 165, 0.45)"
                  strokeWidth="1"
                  strokeDasharray="3 4"
                />

                {/* Guiding Fine Silver-Champagne Thread */}
                <path
                  ref={trailPathRef}
                  d="M 190 52 C 232 90, 152 146, 190 186 C 228 228, 150 322, 190 366 L 190 404"
                  fill="none"
                  stroke="#D6C3A5"
                  strokeOpacity="0.65"
                  strokeWidth="1.6"
                  strokeDasharray="4 3"
                />

                {/* 4 Large Mother-of-Pearl Buttons */}
                {BUTTON_Y.map((cy, idx) => (
                  <g key={cy} transform={`translate(190, ${cy})`}>
                    <circle
                      r="30"
                      fill="rgba(0,0,0,0.55)"
                      transform="translate(2, 6)"
                    />
                    <circle r="28" fill="url(#hero-pearl-v7)" />
                    <circle
                      r="21"
                      fill="none"
                      stroke="rgba(255,255,255,0.9)"
                      strokeWidth="1"
                    />
                    <circle cx="-6" cy="-6" r="2.2" fill="#0B0B0E" />
                    <circle cx="6" cy="-6" r="2.2" fill="#0B0B0E" />
                    <circle cx="-6" cy="6" r="2.2" fill="#0B0B0E" />
                    <circle cx="6" cy="6" r="2.2" fill="#0B0B0E" />

                    {/* Animated Fine Cross-Stitch (X) */}
                    <line
                      ref={(el) => {
                        stitchARefs.current[idx] = el;
                      }}
                      x1="-6"
                      y1="-6"
                      x2="6"
                      y2="6"
                      stroke="#D6C3A5"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                      strokeDasharray={STITCH_LEN}
                      strokeDashoffset={STITCH_LEN}
                    />
                    <line
                      ref={(el) => {
                        stitchBRefs.current[idx] = el;
                      }}
                      x1="6"
                      y1="-6"
                      x2="-6"
                      y2="6"
                      stroke="#D6C3A5"
                      strokeWidth="3.2"
                      strokeLinecap="round"
                      strokeDasharray={STITCH_LEN}
                      strokeDashoffset={STITCH_LEN}
                    />
                  </g>
                ))}

                {/* Gleaming Silver Tailor's Needle */}
                <g ref={needleRef} transform="translate(232, 96)">
                  <line
                    x1="0"
                    y1="0"
                    x2="66"
                    y2="-36"
                    stroke="#FFFFFF"
                    strokeWidth="3"
                    strokeLinecap="round"
                  />
                  <ellipse
                    cx="54"
                    cy="-29.5"
                    rx="4"
                    ry="1.5"
                    transform="rotate(-29 54 -29.5)"
                    fill="#0B0B0E"
                  />
                  <path
                    d="M 57 -31 C 92 -48, 102 -8, 70 28"
                    fill="none"
                    stroke="#D6C3A5"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </g>
              </svg>

              {/* Floating Minimal Glass Tag */}
              <div className="liquid-glass relative z-10 -mt-3 inline-flex items-center gap-3 rounded-full px-4 py-1.5 text-xs">
                <span className="font-medium text-white">Pima Piura Noche</span>
                <span aria-hidden="true" className="text-white/25">
                  ·
                </span>
                <span className="font-mono text-[11px] text-white/65">
                  Ref. Art. 2529
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
