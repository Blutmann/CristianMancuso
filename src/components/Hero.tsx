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

const PLACKET_BUTTON_Y = [110, 198, 286, 374] as const;

export function Hero() {
  const { isMotionPaused, preloaderDone } = useMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const specimenRef = useRef<HTMLDivElement | null>(null);
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const fadeRefs = useRef<(HTMLElement | null)[]>([]);
  const buttonGroupRefs = useRef<(SVGGElement | null)[]>([]);
  const threadRefs = useRef<(SVGGElement | null)[]>([]);

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

  // ScrollTrigger narrative action: 4 mother-of-pearl buttons fasten sequentially on scroll
  useEffect(() => {
    const buttons = buttonGroupRefs.current.filter(Boolean) as SVGGElement[];
    const threads = threadRefs.current.filter(Boolean) as SVGGElement[];

    if (isMotionPaused || !sectionRef.current || buttons.length === 0) {
      gsap.set(buttons, { x: 0, rotation: 0, transformOrigin: "50% 50%" });
      gsap.set(threads, { opacity: 1, scale: 1, transformOrigin: "50% 50%" });
      return;
    }

    const ctx = gsap.context(() => {
      // Initial unbuttoned state (offset & unfastened)
      gsap.set(buttons, {
        x: 24,
        rotation: -32,
        transformOrigin: "50% 50%",
      });
      gsap.set(threads, {
        opacity: 0,
        scale: 0.4,
        transformOrigin: "50% 50%",
      });

      const buttonTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom 35%",
          scrub: 0.6,
        },
      });

      buttons.forEach((btn, idx) => {
        const at = idx * 0.22;
        buttonTl.to(
          btn,
          {
            x: 0,
            rotation: 0,
            duration: 0.32,
            ease: "power2.out",
          },
          at
        );
        if (threads[idx]) {
          buttonTl.to(
            threads[idx],
            {
              opacity: 1,
              scale: 1,
              duration: 0.22,
              ease: "back.out(1.7)",
            },
            at + 0.16
          );
        }
      });

      if (specimenRef.current) {
        gsap.to(specimenRef.current, {
          yPercent: 6,
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [isMotionPaused]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      aria-labelledby="hero-heading"
      className="relative min-h-[94svh] w-full overflow-hidden bg-navy pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-36 flex flex-col justify-center"
    >
      {/* Subtle warm bronze rim glow & grain */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-28 right-[-8%] h-[540px] w-[540px] rounded-full opacity-35 blur-[130px]"
          style={{
            background:
              "radial-gradient(circle, rgba(197,155,95,0.34) 0%, rgba(15,23,42,0) 70%)",
          }}
        />
        <div className="absolute inset-0 atelier-grain opacity-70" />
      </div>

      {/* Main Editorial Split */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Clean Kinetic Typography */}
          <div className="lg:col-span-7 flex flex-col items-start">
            <div
              ref={(el) => {
                fadeRefs.current[0] = el;
              }}
              className="mb-6 flex items-center gap-3"
            >
              <span aria-hidden="true" className="h-[1px] w-7 bg-bronze" />
              <span className="text-xs font-medium tracking-[0.2em] text-bronze uppercase">
                Sastrería de autor · Buenos Aires
              </span>
            </div>

            <h1
              id="hero-heading"
              className="font-display text-[clamp(2.15rem,6.2vw,5.2rem)] font-bold leading-[0.99] tracking-[-0.04em] text-primary"
            >
              {HERO_LINES.map((line, index) => (
                <span key={line.text} className="block overflow-hidden pb-1">
                  <span
                    ref={(el) => {
                      lineRefs.current[index] = el;
                    }}
                    className={`block will-change-transform ${
                      line.accent ? "text-bronze" : "text-primary"
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

            {/* 2 Clear CTAs */}
            <div
              ref={(el) => {
                fadeRefs.current[2] = el;
              }}
              className="mt-9 flex flex-wrap items-center gap-3.5"
            >
              <Link
                id="hero-cta-collection"
                href="/#coleccion"
                className="group inline-flex min-h-[44px] items-center gap-2.5 rounded-full bg-ivory px-6 py-3 text-sm font-semibold text-navy transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
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
                className="group inline-flex min-h-[44px] items-center gap-2.5 rounded-full border border-white/15 bg-elevated/80 px-6 py-3 text-sm font-medium text-primary backdrop-blur-md transition-all duration-300 hover:border-bronze/70 hover:bg-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-bronze focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
              >
                <Ruler
                  className="h-4 w-4 text-bronze transition-transform duration-300 group-hover:rotate-12"
                  aria-hidden="true"
                />
                <span>Armar a medida</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Interactive Scroll-Buttoning Placket Visual */}
          <div className="lg:col-span-5 flex items-center justify-center lg:justify-end">
            <div
              ref={specimenRef}
              className="relative aspect-[4/5] w-full max-w-[400px] overflow-hidden rounded-3xl border border-white/10 bg-elevated shadow-[0_30px_80px_rgba(7,12,24,0.65)] will-change-transform"
            >
              <svg
                aria-hidden="true"
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 400 500"
                preserveAspectRatio="xMidYMid slice"
              >
                <defs>
                  <pattern
                    id="hero-navy-twill"
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
                      stroke="rgba(248, 250, 252, 0.06)"
                      strokeWidth="1.1"
                    />
                  </pattern>

                  <radialGradient id="hero-navy-sheen" cx="68%" cy="28%" r="74%">
                    <stop offset="0%" stopColor="#22314D" />
                    <stop offset="55%" stopColor="#162033" />
                    <stop offset="100%" stopColor="#0F172A" />
                  </radialGradient>

                  <radialGradient id="hero-pearl-v3" cx="38%" cy="34%" r="65%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="42%" stopColor="#E6EDF5" />
                    <stop offset="82%" stopColor="#C4D1E0" />
                    <stop offset="100%" stopColor="#8D99AE" />
                  </radialGradient>
                </defs>

                <rect width="400" height="500" fill="url(#hero-navy-sheen)" />
                <rect width="400" height="500" fill="url(#hero-navy-twill)" />

                {/* Tailored Center Placket */}
                <rect
                  x="156"
                  y="0"
                  width="88"
                  height="500"
                  fill="rgba(15, 23, 42, 0.45)"
                />
                <line
                  x1="166"
                  y1="0"
                  x2="166"
                  y2="500"
                  stroke="rgba(197, 155, 95, 0.42)"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <line
                  x1="234"
                  y1="0"
                  x2="234"
                  y2="500"
                  stroke="rgba(197, 155, 95, 0.42)"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />

                {/* 4 Scroll-Animated Mother-of-Pearl Buttons */}
                {PLACKET_BUTTON_Y.map((cy, idx) => (
                  <g key={cy} transform={`translate(200, ${cy})`}>
                    {/* Embroidered Buttonhole (Ojal) */}
                    <rect
                      x="-2.5"
                      y="-13"
                      width="5"
                      height="26"
                      rx="2.5"
                      fill="#0B1120"
                      stroke="rgba(197, 155, 95, 0.55)"
                      strokeWidth="1"
                    />

                    {/* Animated Mother-of-Pearl Button */}
                    <g
                      ref={(el) => {
                        buttonGroupRefs.current[idx] = el;
                      }}
                    >
                      <circle
                        r="23"
                        fill="rgba(0,0,0,0.45)"
                        transform="translate(2, 5)"
                      />
                      <circle r="22" fill="url(#hero-pearl-v3)" />
                      <circle
                        r="16.5"
                        fill="none"
                        stroke="rgba(255,255,255,0.7)"
                        strokeWidth="0.9"
                      />
                      <circle cx="-4.2" cy="-4.2" r="1.6" fill="#0F172A" />
                      <circle cx="4.2" cy="-4.2" r="1.6" fill="#0F172A" />
                      <circle cx="-4.2" cy="4.2" r="1.6" fill="#0F172A" />
                      <circle cx="4.2" cy="4.2" r="1.6" fill="#0F172A" />

                      {/* Bronze #C59B5F Cross-Stitch Thread (fades in as button fastens) */}
                      <g
                        ref={(el) => {
                          threadRefs.current[idx] = el;
                        }}
                      >
                        <line
                          x1="-4.2"
                          y1="-4.2"
                          x2="4.2"
                          y2="4.2"
                          stroke="#C59B5F"
                          strokeWidth="1.9"
                          strokeLinecap="round"
                        />
                        <line
                          x1="4.2"
                          y1="-4.2"
                          x2="-4.2"
                          y2="4.2"
                          stroke="#C59B5F"
                          strokeWidth="1.9"
                          strokeLinecap="round"
                        />
                      </g>
                    </g>
                  </g>
                ))}
              </svg>

              {/* Quiet Editorial Caption */}
              <div className="absolute inset-x-5 bottom-5 z-10 flex items-end justify-between border-t border-white/10 pt-4">
                <div>
                  <p className="font-display text-base font-bold text-primary">
                    Pima Piura Noche
                  </p>
                  <p className="mt-0.5 font-mono text-[11px] text-muted">
                    Ref. Art. 2529
                  </p>
                </div>
                <span className="font-serif text-base italic tracking-[0.14em] text-bronze">
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
