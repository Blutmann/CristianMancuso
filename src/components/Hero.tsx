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

export function Hero() {
  const { isMotionPaused, preloaderDone } = useMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const specimenRef = useRef<HTMLDivElement | null>(null);
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const fadeRefs = useRef<(HTMLElement | null)[]>([]);

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

  // Subtle GPU scroll depth + pointer parallax on the sartorial specimen
  useEffect(() => {
    if (isMotionPaused || !sectionRef.current || !specimenRef.current) return;

    const section = sectionRef.current;
    const specimen = specimenRef.current;

    const ctx = gsap.context(() => {
      gsap.to(specimen, {
        yPercent: 8,
        scale: 1.03,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: 1.1,
        },
      });
    }, sectionRef);

    const quickX = gsap.quickTo(specimen, "x", {
      duration: 0.9,
      ease: "power3.out",
    });
    const quickY = gsap.quickTo(specimen, "y", {
      duration: 0.9,
      ease: "power3.out",
    });

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const rect = section.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;
      quickX(nx * -12);
      quickY(ny * -10);
    };

    const handlePointerLeave = () => {
      quickX(0);
      quickY(0);
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
      className="relative min-h-[92svh] w-full overflow-hidden bg-obsidian pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-36 flex flex-col justify-center"
    >
      {/* Subtle warm atelier light & grain */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-28 right-[-8%] h-[520px] w-[520px] rounded-full opacity-30 blur-[130px]"
          style={{
            background:
              "radial-gradient(circle, rgba(200,169,126,0.34) 0%, rgba(6,7,9,0) 70%)",
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
              <span
                aria-hidden="true"
                className="h-[1px] w-7 bg-champagne/80"
              />
              <span className="text-xs font-medium tracking-[0.2em] text-champagne uppercase">
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
                      line.accent ? "text-champagne" : "text-primary"
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
                className="group inline-flex min-h-[44px] items-center gap-2.5 rounded-full bg-ivory px-6 py-3 text-sm font-semibold text-obsidian transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian"
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
                className="group inline-flex min-h-[44px] items-center gap-2.5 rounded-full border border-white/[0.14] bg-elevated/80 px-6 py-3 text-sm font-medium text-primary backdrop-blur-md transition-all duration-300 hover:border-champagne/60 hover:bg-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian"
              >
                <Ruler
                  className="h-4 w-4 text-champagne transition-transform duration-300 group-hover:rotate-12"
                  aria-hidden="true"
                />
                <span>Armar a medida</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Clean Editorial Sartorial Visual */}
          <div className="lg:col-span-5 flex items-center justify-center lg:justify-end">
            <div
              ref={specimenRef}
              className="relative aspect-[4/5] w-full max-w-[400px] overflow-hidden rounded-3xl border border-white/[0.08] bg-elevated shadow-[0_30px_80px_rgba(0,0,0,0.65)] will-change-transform"
            >
              <svg
                aria-hidden="true"
                className="absolute inset-0 h-full w-full"
                viewBox="0 0 400 500"
                preserveAspectRatio="xMidYMid slice"
              >
                <defs>
                  <pattern
                    id="hero-pima-twill"
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
                      stroke="rgba(245, 242, 235, 0.06)"
                      strokeWidth="1.1"
                    />
                  </pattern>

                  <radialGradient id="hero-sheen" cx="68%" cy="28%" r="74%">
                    <stop offset="0%" stopColor="#1E2836" />
                    <stop offset="52%" stopColor="#11151E" />
                    <stop offset="100%" stopColor="#080A0F" />
                  </radialGradient>

                  <radialGradient id="hero-pearl" cx="38%" cy="34%" r="65%">
                    <stop offset="0%" stopColor="#FFFFFF" />
                    <stop offset="40%" stopColor="#E6EDF5" />
                    <stop offset="80%" stopColor="#C4D1E0" />
                    <stop offset="100%" stopColor="#8D99AE" />
                  </radialGradient>
                </defs>

                <rect width="400" height="500" fill="url(#hero-sheen)" />
                <rect width="400" height="500" fill="url(#hero-pima-twill)" />

                {/* Tailored Placket */}
                <rect
                  x="158"
                  y="0"
                  width="84"
                  height="500"
                  fill="rgba(6,7,9,0.42)"
                />
                <line
                  x1="168"
                  y1="0"
                  x2="168"
                  y2="500"
                  stroke="rgba(200, 169, 126, 0.34)"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />
                <line
                  x1="232"
                  y1="0"
                  x2="232"
                  y2="500"
                  stroke="rgba(200, 169, 126, 0.34)"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />

                {/* Australian Mother-of-Pearl Button */}
                <g transform="translate(200, 224)">
                  <circle
                    r="42"
                    fill="rgba(0,0,0,0.5)"
                    transform="translate(4, 10)"
                  />
                  <circle r="40" fill="url(#hero-pearl)" />
                  <circle
                    r="31"
                    fill="none"
                    stroke="rgba(255,255,255,0.65)"
                    strokeWidth="1.1"
                  />
                  <circle cx="-7.5" cy="-7.5" r="2.8" fill="#101218" />
                  <circle cx="7.5" cy="-7.5" r="2.8" fill="#101218" />
                  <circle cx="-7.5" cy="7.5" r="2.8" fill="#101218" />
                  <circle cx="7.5" cy="7.5" r="2.8" fill="#101218" />
                  <line
                    x1="-7.5"
                    y1="-7.5"
                    x2="7.5"
                    y2="7.5"
                    stroke="#C8A97E"
                    strokeWidth="2.3"
                    strokeLinecap="round"
                  />
                  <line
                    x1="7.5"
                    y1="-7.5"
                    x2="-7.5"
                    y2="7.5"
                    stroke="#C8A97E"
                    strokeWidth="2.3"
                    strokeLinecap="round"
                  />
                </g>
              </svg>

              {/* Quiet Editorial Caption */}
              <div className="absolute inset-x-5 bottom-5 z-10 flex items-end justify-between border-t border-white/[0.08] pt-4">
                <div>
                  <p className="font-display text-base font-bold text-primary">
                    Pima Piura Noche
                  </p>
                  <p className="mt-0.5 font-mono text-[11px] text-muted">
                    Ref. Art. 2529
                  </p>
                </div>
                <span className="font-serif text-base italic tracking-[0.14em] text-champagne">
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
