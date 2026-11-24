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

const BUTTON_Y = [108, 196, 284, 372] as const;
const STITCH_LEN = 18; // exact diagonal length for cross-stitch strokeDasharray

export function Hero() {
  const { isMotionPaused, preloaderDone } = useMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const specimenRef = useRef<HTMLDivElement | null>(null);
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
      if (specimenRef.current) {
        gsap.set(specimenRef.current, { y: 0, scale: 1, opacity: 1 });
      }
      return;
    }

    if (!preloaderDone) {
      gsap.set(lines, { yPercent: 105, opacity: 0 });
      gsap.set(fades, { y: 18, opacity: 0 });
      if (specimenRef.current) {
        gsap.set(specimenRef.current, { y: 24, scale: 0.97, opacity: 0 });
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
          specimenRef.current,
          {
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 1.05,
            ease: "power3.out",
          },
          "-=0.75"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, [isMotionPaused, preloaderDone]);

  // WOW #1: Needle & Thread Cross-Stitching the 4 mother-of-pearl buttons on scroll
  useEffect(() => {
    const stitchesA = stitchARefs.current.filter(Boolean) as SVGLineElement[];
    const stitchesB = stitchBRefs.current.filter(Boolean) as SVGLineElement[];
    const trail = trailPathRef.current;
    const needle = needleRef.current;

    if (isMotionPaused || !sectionRef.current || stitchesA.length === 0) {
      gsap.set([...stitchesA, ...stitchesB], { strokeDashoffset: 0 });
      if (trail) gsap.set(trail, { strokeDashoffset: 0 });
      if (needle) gsap.set(needle, { y: 278, x: 0, rotation: 0, opacity: 0.85 });
      return;
    }

    const trailLength = trail ? trail.getTotalLength() : 320;

    const ctx = gsap.context(() => {
      gsap.set([...stitchesA, ...stitchesB], { strokeDashoffset: STITCH_LEN });
      if (trail) {
        gsap.set(trail, {
          strokeDasharray: trailLength,
          strokeDashoffset: trailLength,
        });
      }
      if (needle) {
        gsap.set(needle, { y: 0, x: 0, rotation: -12, opacity: 1 });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom 25%",
          scrub: 0.6,
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
              rotation: idx % 2 === 0 ? -18 : 14,
              duration: 0.2,
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

    return () => ctx.revert();
  }, [isMotionPaused]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      aria-labelledby="hero-heading"
      className="relative min-h-[94svh] w-full overflow-hidden bg-[#09090B] pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-36 flex flex-col justify-center"
    >
      {/* Subtle monochrome grain */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 atelier-grain opacity-65" />
      </div>

      {/* Main Editorial Split */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Stark Monochrome Editorial Typography */}
          <div className="lg:col-span-7 flex flex-col items-start">
            <div
              ref={(el) => {
                fadeRefs.current[0] = el;
              }}
              className="mb-6 flex items-center gap-3"
            >
              <span aria-hidden="true" className="h-[1px] w-7 bg-stitch" />
              <span className="text-xs font-medium tracking-[0.2em] text-stitch uppercase">
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
                      line.accent ? "text-stitch" : "text-white"
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

            {/* 2 Clear B&W CTAs */}
            <div
              ref={(el) => {
                fadeRefs.current[2] = el;
              }}
              className="mt-9 flex flex-wrap items-center gap-3.5"
            >
              <Link
                id="hero-cta-collection"
                href="/#coleccion"
                className="group inline-flex min-h-[44px] items-center gap-2.5 rounded-full bg-white px-6 py-3 text-sm font-semibold text-[#09090B] transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stitch focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090B]"
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
                className="group inline-flex min-h-[44px] items-center gap-2.5 rounded-full border border-white/20 bg-transparent px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:border-white hover:bg-white/[0.06] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stitch focus-visible:ring-offset-2 focus-visible:ring-offset-[#09090B]"
              >
                <Ruler
                  className="h-4 w-4 text-stitch transition-transform duration-300 group-hover:rotate-12"
                  aria-hidden="true"
                />
                <span>Armar a medida</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Live Needle & Thread Cross-Stitching Placket */}
          <div className="lg:col-span-5 flex items-center justify-center lg:justify-end">
            <div
              ref={specimenRef}
              className="relative aspect-[4/5] w-full max-w-[400px] overflow-hidden rounded-3xl border border-white/12 bg-[#141417] shadow-[0_30px_80px_rgba(0,0,0,0.75)] will-change-transform"
            >
              <svg
                aria-hidden="true"
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 400 500"
                preserveAspectRatio="xMidYMid slice"
              >
                <defs>
                  <pattern
                    id="hero-bw-twill"
                    width="10"
                    height="10"
                    patternUnits="userSpaceOnUse"
                    patternTransform="rotate(35)"
                  >
                    <line
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="10"
                      stroke="rgba(255, 255, 255, 0.045)"
                      strokeWidth="1"
                    />
                  </pattern>

                  <radialGradient id="hero-bw-sheen" cx="68%" cy="26%" r="74%">
                    <stop offset="0%" stopColor="#202026" />
                    <stop offset="55%" stopColor="#121216" />
                    <stop offset="100%" stopColor="#09090B" />
                  </radialGradient>

                  <radialGradient id="hero-pearl-bw" cx="38%" cy="34%" r="65%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="45%" stopColor="#F4F4F5" />
                    <stop offset="85%" stopColor="#D4D4D8" />
                    <stop offset="100%" stopColor="#A1A1AA" />
                  </radialGradient>
                </defs>

                <rect width="400" height="500" fill="url(#hero-bw-sheen)" />
                <rect width="400" height="500" fill="url(#hero-bw-twill)" />

                {/* Tailored Center Placket */}
                <rect
                  x="156"
                  y="0"
                  width="88"
                  height="500"
                  fill="rgba(9, 9, 11, 0.55)"
                />
                <line
                  x1="166"
                  y1="0"
                  x2="166"
                  y2="500"
                  stroke="rgba(201, 169, 110, 0.45)"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <line
                  x1="234"
                  y1="0"
                  x2="234"
                  y2="500"
                  stroke="rgba(201, 169, 110, 0.45)"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />

                {/* Continuous Guiding Thread connecting the 4 buttons */}
                <path
                  ref={trailPathRef}
                  d="M 200 72 C 216 90, 188 152, 200 196 C 214 238, 186 322, 200 372 L 200 412"
                  fill="none"
                  stroke="rgba(201, 169, 110, 0.45)"
                  strokeWidth="1.2"
                  strokeDasharray="3 3"
                />

                {/* 4 Mother-of-Pearl Buttons with Live Cross-Stitch (X) */}
                {BUTTON_Y.map((cy, idx) => (
                  <g key={cy} transform={`translate(200, ${cy})`}>
                    <circle
                      r="23"
                      fill="rgba(0,0,0,0.55)"
                      transform="translate(2, 5)"
                    />
                    <circle r="22" fill="url(#hero-pearl-bw)" />
                    <circle
                      r="16.5"
                      fill="none"
                      stroke="rgba(255,255,255,0.8)"
                      strokeWidth="0.9"
                    />
                    {/* 4 Buttonholes */}
                    <circle cx="-4.5" cy="-4.5" r="1.7" fill="#09090B" />
                    <circle cx="4.5" cy="-4.5" r="1.7" fill="#09090B" />
                    <circle cx="-4.5" cy="4.5" r="1.7" fill="#09090B" />
                    <circle cx="4.5" cy="4.5" r="1.7" fill="#09090B" />

                    {/* Animated Cross-Stitch Diagonal A (\) */}
                    <line
                      ref={(el) => {
                        stitchARefs.current[idx] = el;
                      }}
                      x1="-4.5"
                      y1="-4.5"
                      x2="4.5"
                      y2="4.5"
                      stroke="#C9A96E"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeDasharray={STITCH_LEN}
                      strokeDashoffset={STITCH_LEN}
                    />

                    {/* Animated Cross-Stitch Diagonal B (/) */}
                    <line
                      ref={(el) => {
                        stitchBRefs.current[idx] = el;
                      }}
                      x1="4.5"
                      y1="-4.5"
                      x2="-4.5"
                      y2="4.5"
                      stroke="#C9A96E"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeDasharray={STITCH_LEN}
                      strokeDashoffset={STITCH_LEN}
                    />
                  </g>
                ))}

                {/* Animated Tailor's Silver Needle & Thread Eye */}
                <g ref={needleRef} transform="translate(238, 108)">
                  <line
                    x1="0"
                    y1="0"
                    x2="44"
                    y2="-24"
                    stroke="#E4E4E7"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                  {/* Eye of the needle */}
                  <ellipse
                    cx="36"
                    cy="-19.5"
                    rx="3.2"
                    ry="1.2"
                    transform="rotate(-28 36 -19.5)"
                    fill="#09090B"
                  />
                  {/* Trailing champagne thread from needle eye */}
                  <path
                    d="M 38 -20.5 Q 68 -32 76 -4"
                    fill="none"
                    stroke="#C9A96E"
                    strokeWidth="1.3"
                  />
                </g>
              </svg>

              {/* Quiet Editorial Caption */}
              <div className="absolute inset-x-5 bottom-5 z-10 flex items-end justify-between border-t border-white/10 pt-4">
                <div>
                  <p className="font-display text-base font-bold text-white">
                    Pima Piura Noche
                  </p>
                  <p className="mt-0.5 font-mono text-[11px] text-muted">
                    Ref. Art. 2529
                  </p>
                </div>
                <span className="font-serif text-base italic tracking-[0.14em] text-stitch">
                  C.M.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
