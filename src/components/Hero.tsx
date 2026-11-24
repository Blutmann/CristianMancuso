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
const STITCH_LEN = 20;

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

  // Prominent Needle & Gold Thread (#C8A25A) Cross-Stitching the 4 buttons on scroll
  useEffect(() => {
    const stitchesA = stitchARefs.current.filter(Boolean) as SVGLineElement[];
    const stitchesB = stitchBRefs.current.filter(Boolean) as SVGLineElement[];
    const trail = trailPathRef.current;
    const needle = needleRef.current;

    if (isMotionPaused || !sectionRef.current || stitchesA.length === 0) {
      gsap.set([...stitchesA, ...stitchesB], { strokeDashoffset: 0 });
      if (trail) gsap.set(trail, { strokeDashoffset: 0 });
      if (needle) gsap.set(needle, { y: 274, x: 0, rotation: 0, opacity: 0.9 });
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
        gsap.set(needle, { y: -16, x: 14, rotation: -22, opacity: 1 });
      }

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom 42%",
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
              rotation: idx % 2 === 0 ? -26 : 18,
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

    return () => ctx.revert();
  }, [isMotionPaused]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      aria-labelledby="hero-heading"
      className="relative min-h-[94svh] w-full overflow-hidden bg-[#111113] pt-32 pb-16 sm:pt-36 sm:pb-20 lg:pt-40 flex flex-col justify-center"
    >
      {/* Subtle charcoal grain & warm gold rim */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-24 right-[-8%] h-[500px] w-[500px] rounded-full opacity-25 blur-[130px]"
          style={{
            background:
              "radial-gradient(circle, rgba(200,162,90,0.34) 0%, rgba(17,17,19,0) 70%)",
          }}
        />
        <div className="absolute inset-0 atelier-grain opacity-65" />
      </div>

      {/* Main Editorial Split */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Stark Editorial Typography */}
          <div className="lg:col-span-7 flex flex-col items-start">
            <div
              ref={(el) => {
                fadeRefs.current[0] = el;
              }}
              className="mb-6 flex items-center gap-3"
            >
              <span aria-hidden="true" className="h-[1px] w-7 bg-gold" />
              <span className="text-xs font-medium tracking-[0.2em] text-gold uppercase">
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
                      line.accent ? "text-gold" : "text-white"
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

            {/* 2 Clear CTAs (Gold Protagonist Primary CTA) */}
            <div
              ref={(el) => {
                fadeRefs.current[2] = el;
              }}
              className="mt-9 flex flex-wrap items-center gap-3.5"
            >
              <Link
                id="hero-cta-collection"
                href="/#coleccion"
                className="group inline-flex min-h-[44px] items-center gap-2.5 rounded-full bg-gold px-7 py-3 text-sm font-semibold text-[#111113] transition-all duration-300 hover:-translate-y-0.5 hover:bg-gold-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-[#111113]"
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
                className="group inline-flex min-h-[44px] items-center gap-2.5 rounded-full border border-white/20 bg-transparent px-6 py-3 text-sm font-medium text-white transition-all duration-300 hover:border-gold hover:bg-white/[0.05] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-[#111113]"
              >
                <Ruler
                  className="h-4 w-4 text-gold transition-transform duration-300 group-hover:rotate-12"
                  aria-hidden="true"
                />
                <span>Armar a medida</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Large Protagonist Needle & Gold Cross-Stitching Placket */}
          <div className="lg:col-span-5 flex items-center justify-center lg:justify-end">
            <div
              ref={specimenRef}
              className="relative aspect-[4/4.8] w-full max-w-[460px] overflow-hidden rounded-3xl border border-white/12 bg-[#1B1B1F] shadow-[0_32px_90px_rgba(0,0,0,0.75)] will-change-transform"
            >
              <svg
                aria-hidden="true"
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 400 490"
                preserveAspectRatio="xMidYMid slice"
              >
                <defs>
                  <pattern
                    id="hero-charcoal-twill"
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
                      stroke="rgba(255, 255, 255, 0.05)"
                      strokeWidth="1.1"
                    />
                  </pattern>

                  <radialGradient id="hero-charcoal-sheen" cx="65%" cy="25%" r="74%">
                    <stop offset="0%" stopColor="#2A2A32" />
                    <stop offset="55%" stopColor="#1B1B1F" />
                    <stop offset="100%" stopColor="#111113" />
                  </radialGradient>

                  <radialGradient id="hero-pearl-v6" cx="38%" cy="34%" r="65%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="45%" stopColor="#F4F4F5" />
                    <stop offset="85%" stopColor="#D4D4D8" />
                    <stop offset="100%" stopColor="#A1A1AA" />
                  </radialGradient>
                </defs>

                <rect width="400" height="490" fill="url(#hero-charcoal-sheen)" />
                <rect width="400" height="490" fill="url(#hero-charcoal-twill)" />

                {/* Wide Protagonist Center Placket */}
                <rect
                  x="136"
                  y="0"
                  width="128"
                  height="490"
                  fill="rgba(17, 17, 19, 0.58)"
                />
                <line
                  x1="148"
                  y1="0"
                  x2="148"
                  y2="490"
                  stroke="rgba(200, 162, 90, 0.55)"
                  strokeWidth="1.2"
                  strokeDasharray="4 3"
                />
                <line
                  x1="252"
                  y1="0"
                  x2="252"
                  y2="490"
                  stroke="rgba(200, 162, 90, 0.55)"
                  strokeWidth="1.2"
                  strokeDasharray="4 3"
                />

                {/* Bold Golden Sewing Thread connecting all 4 buttons */}
                <path
                  ref={trailPathRef}
                  d="M 200 58 C 244 96, 162 152, 200 196 C 240 242, 160 326, 200 372 L 200 416"
                  fill="none"
                  stroke="#C8A25A"
                  strokeOpacity="0.82"
                  strokeWidth="2.2"
                  strokeDasharray="5 3"
                />

                {/* 4 Large Mother-of-Pearl Buttons with Bold Gold Cross-Stitch (X) */}
                {BUTTON_Y.map((cy, idx) => (
                  <g key={cy} transform={`translate(200, ${cy})`}>
                    <circle
                      r="30"
                      fill="rgba(0,0,0,0.6)"
                      transform="translate(3, 6)"
                    />
                    <circle r="29" fill="url(#hero-pearl-v6)" />
                    <circle
                      r="22"
                      fill="none"
                      stroke="rgba(255,255,255,0.88)"
                      strokeWidth="1"
                    />
                    {/* 4 Buttonholes */}
                    <circle cx="-6.5" cy="-6.5" r="2.3" fill="#111113" />
                    <circle cx="6.5" cy="-6.5" r="2.3" fill="#111113" />
                    <circle cx="-6.5" cy="6.5" r="2.3" fill="#111113" />
                    <circle cx="6.5" cy="6.5" r="2.3" fill="#111113" />

                    {/* Animated Cross-Stitch Diagonal A (\) */}
                    <line
                      ref={(el) => {
                        stitchARefs.current[idx] = el;
                      }}
                      x1="-6.5"
                      y1="-6.5"
                      x2="6.5"
                      y2="6.5"
                      stroke="#C8A25A"
                      strokeWidth="3.6"
                      strokeLinecap="round"
                      strokeDasharray={STITCH_LEN}
                      strokeDashoffset={STITCH_LEN}
                    />

                    {/* Animated Cross-Stitch Diagonal B (/) */}
                    <line
                      ref={(el) => {
                        stitchBRefs.current[idx] = el;
                      }}
                      x1="6.5"
                      y1="-6.5"
                      x2="-6.5"
                      y2="6.5"
                      stroke="#C8A25A"
                      strokeWidth="3.6"
                      strokeLinecap="round"
                      strokeDasharray={STITCH_LEN}
                      strokeDashoffset={STITCH_LEN}
                    />
                  </g>
                ))}

                {/* Large Protagonist Silver Tailor's Needle & Flowing Gold Thread */}
                <g ref={needleRef} transform="translate(242, 108)">
                  <line
                    x1="0"
                    y1="0"
                    x2="68"
                    y2="-38"
                    stroke="#FFFFFF"
                    strokeWidth="3.4"
                    strokeLinecap="round"
                  />
                  <ellipse
                    cx="56"
                    cy="-31.5"
                    rx="4.4"
                    ry="1.7"
                    transform="rotate(-29 56 -31.5)"
                    fill="#111113"
                  />
                  <path
                    d="M 59 -33 C 96 -52, 108 -10, 74 30"
                    fill="none"
                    stroke="#C8A25A"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  />
                </g>
              </svg>

              {/* Quiet Editorial Caption */}
              <div className="absolute inset-x-5 bottom-4 z-10 flex items-end justify-between border-t border-white/10 pt-3.5">
                <div>
                  <p className="font-display text-base font-bold text-white">
                    Pima Piura Noche
                  </p>
                  <p className="mt-0.5 font-mono text-[11px] text-muted">
                    Ref. Art. 2529
                  </p>
                </div>
                <span className="font-serif text-base italic tracking-[0.14em] text-gold">
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
