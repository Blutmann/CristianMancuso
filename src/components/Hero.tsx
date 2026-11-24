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
  const tagPrimaryRef = useRef<HTMLDivElement | null>(null);
  const tagSecondaryRef = useRef<HTMLDivElement | null>(null);
  const tagTertiaryRef = useRef<HTMLDivElement | null>(null);
  const lineRefs = useRef<(HTMLSpanElement | null)[]>([]);
  const fadeRefs = useRef<(HTMLElement | null)[]>([]);

  // Entrance choreography (runs once preloader finishes, or immediately if motion is paused)
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
      gsap.set(fades, { y: 20, opacity: 0 });
      if (specimenRef.current) {
        gsap.set(specimenRef.current, { y: 28, scale: 0.97, opacity: 0 });
      }
      return;
    }

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power4.out" } });

      tl.to(lines, {
        yPercent: 0,
        opacity: 1,
        duration: 1.05,
        stagger: 0.09,
      })
        .to(
          fades,
          {
            y: 0,
            opacity: 1,
            duration: 0.85,
            stagger: 0.08,
            ease: "power3.out",
          },
          "-=0.68"
        )
        .to(
          specimenRef.current,
          {
            y: 0,
            scale: 1,
            opacity: 1,
            duration: 1.1,
            ease: "power3.out",
          },
          "-=0.8"
        );
    }, sectionRef);

    return () => ctx.revert();
  }, [isMotionPaused, preloaderDone]);

  // Mouse parallax + GSAP ScrollTrigger depth choreography
  useEffect(() => {
    if (isMotionPaused || !sectionRef.current) return;

    const section = sectionRef.current;
    const primaryTag = tagPrimaryRef.current;
    const secondaryTag = tagSecondaryRef.current;
    const tertiaryTag = tagTertiaryRef.current;
    const specimen = specimenRef.current;

    const ctx = gsap.context(() => {
      if (primaryTag) {
        gsap.to(primaryTag, {
          yPercent: -28,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: 1.1,
          },
        });
      }

      if (secondaryTag) {
        gsap.to(secondaryTag, {
          yPercent: -42,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: 1.3,
          },
        });
      }

      if (tertiaryTag) {
        gsap.to(tertiaryTag, {
          yPercent: 24,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: 1,
          },
        });
      }

      if (specimen) {
        gsap.to(specimen, {
          yPercent: 10,
          scale: 1.03,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom top",
            scrub: 1.2,
          },
        });
      }
    }, sectionRef);

    // Subtle pointer-driven GPU parallax for telemetry tags & specimen
    const quickPrimaryX = primaryTag
      ? gsap.quickTo(primaryTag, "x", { duration: 0.7, ease: "power3.out" })
      : null;
    const quickPrimaryY = primaryTag
      ? gsap.quickTo(primaryTag, "y", { duration: 0.7, ease: "power3.out" })
      : null;

    const quickSecondaryX = secondaryTag
      ? gsap.quickTo(secondaryTag, "x", { duration: 0.85, ease: "power3.out" })
      : null;
    const quickSecondaryY = secondaryTag
      ? gsap.quickTo(secondaryTag, "y", { duration: 0.85, ease: "power3.out" })
      : null;

    const quickTertiaryX = tertiaryTag
      ? gsap.quickTo(tertiaryTag, "x", { duration: 0.8, ease: "power3.out" })
      : null;
    const quickTertiaryY = tertiaryTag
      ? gsap.quickTo(tertiaryTag, "y", { duration: 0.8, ease: "power3.out" })
      : null;

    const quickSpecimenX = specimen
      ? gsap.quickTo(specimen, "x", { duration: 1.0, ease: "power3.out" })
      : null;
    const quickSpecimenY = specimen
      ? gsap.quickTo(specimen, "y", { duration: 1.0, ease: "power3.out" })
      : null;

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const rect = section.getBoundingClientRect();
      const nx = (e.clientX - rect.left) / rect.width - 0.5;
      const ny = (e.clientY - rect.top) / rect.height - 0.5;

      quickPrimaryX?.(nx * 24);
      quickPrimaryY?.(ny * 16);

      quickSecondaryX?.(nx * -18);
      quickSecondaryY?.(ny * 14);

      quickTertiaryX?.(nx * 16);
      quickTertiaryY?.(ny * -14);

      quickSpecimenX?.(nx * -10);
      quickSpecimenY?.(ny * -8);
    };

    const handlePointerLeave = () => {
      quickPrimaryX?.(0);
      quickPrimaryY?.(0);
      quickSecondaryX?.(0);
      quickSecondaryY?.(0);
      quickTertiaryX?.(0);
      quickTertiaryY?.(0);
      quickSpecimenX?.(0);
      quickSpecimenY?.(0);
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
      className="relative min-h-[100svh] w-full overflow-hidden bg-obsidian pt-28 pb-16 sm:pt-32 sm:pb-20 lg:pt-36 flex flex-col justify-between"
    >
      {/* Chiaroscuro Atelier Lighting & Subtle Grain */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute -top-32 right-[-10%] h-[580px] w-[580px] rounded-full opacity-35 blur-[130px]"
          style={{
            background:
              "radial-gradient(circle, rgba(200,169,126,0.34) 0%, rgba(6,7,9,0) 70%)",
          }}
        />
        <div
          className="absolute bottom-[-18%] left-[-8%] h-[460px] w-[460px] rounded-full opacity-25 blur-[120px]"
          style={{
            background:
              "radial-gradient(circle, rgba(56,189,248,0.22) 0%, rgba(6,7,9,0) 70%)",
          }}
        />
        <div className="absolute inset-0 atelier-grain opacity-75" />
      </div>

      {/* Main Content Grid */}
      <div className="relative z-10 mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10 my-auto">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-10">
          {/* Left Column: Kinetic Typography & CTAs */}
          <div className="lg:col-span-7 flex flex-col items-start">
            {/* Eyebrow */}
            <div
              ref={(el) => {
                fadeRefs.current[0] = el;
              }}
              className="mb-6 flex items-center gap-3.5"
            >
              <span
                aria-hidden="true"
                className="h-[1px] w-8 bg-champagne/80"
              />
              <span className="font-mono text-[11px] sm:text-xs font-medium tracking-[0.24em] text-champagne uppercase">
                SASTRERÍA DE AUTOR · BUENOS AIRES
              </span>
            </div>

            {/* Giant Kinetic H1 */}
            <h1
              id="hero-heading"
              className="font-display text-[clamp(2.65rem,6.4vw,5.4rem)] font-bold leading-[0.98] tracking-[-0.04em] text-primary"
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

            {/* Editorial Subtitle */}
            <p
              ref={(el) => {
                fadeRefs.current[1] = el;
              }}
              className="mt-7 max-w-xl text-base sm:text-lg leading-[1.68] text-muted font-normal"
            >
              Confección artesanal con ajuste personalizado, elección de cuello,
              puños e iniciales bordadas en todas nuestras gamas — desde algodón
              urbano hasta lino italiano.
            </p>

            {/* Primary Telemetry Strip (Mobile-friendly inline + desktop floating companion) */}
            <div
              ref={(el) => {
                fadeRefs.current[2] = el;
              }}
              className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2 border-y border-white/[0.08] py-3.5 w-full max-w-xl font-mono text-[10px] sm:text-[11px] tracking-[0.16em] text-muted uppercase"
            >
              <span className="text-primary/90">01 / Ajuste personalizado</span>
              <span className="text-white/20" aria-hidden="true">
                ·
              </span>
              <span className="text-primary/90">02 / Cuello &amp; Puños</span>
              <span className="text-white/20" aria-hidden="true">
                ·
              </span>
              <span className="text-champagne">03 / Monograma incluido</span>
            </div>

            {/* Dual CTAs */}
            <div
              ref={(el) => {
                fadeRefs.current[3] = el;
              }}
              className="mt-9 flex flex-wrap items-center gap-3.5 sm:gap-4"
            >
              <Link
                id="hero-cta-collection"
                href="/#coleccion"
                className="group inline-flex items-center gap-2.5 rounded-full bg-ivory px-6 py-3.5 text-sm font-semibold tracking-[0.01em] text-obsidian transition-transform duration-300 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian"
              >
                <span>Explorar Colección</span>
                <ArrowUpRight
                  className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  aria-hidden="true"
                />
              </Link>

              <Link
                id="hero-cta-bespoke"
                href="/#como-pedir"
                className="group inline-flex items-center gap-2.5 rounded-full border border-white/[0.14] bg-elevated/80 px-6 py-3.5 text-sm font-medium text-primary backdrop-blur-md transition-all duration-300 hover:border-champagne/60 hover:bg-elevated focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian"
              >
                <Ruler
                  className="h-4 w-4 text-champagne transition-transform duration-300 group-hover:rotate-12"
                  aria-hidden="true"
                />
                <span>Cómo pedir a medida</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Kinetic Sartorial Specimen + Floating Telemetry Tags */}
          <div className="relative lg:col-span-5 flex items-center justify-center lg:justify-end">
            <div className="relative w-full max-w-[440px]">
              {/* Main Sartorial Fabric & Craft Specimen Frame */}
              <div
                ref={specimenRef}
                className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-white/[0.09] bg-elevated shadow-[0_30px_90px_rgba(0,0,0,0.7)] will-change-transform"
              >
                {/* Layered Pima 120/2 Diagonal Twill Weave + Chiaroscuro Sheen */}
                <svg
                  aria-hidden="true"
                  className="absolute inset-0 h-full w-full"
                  viewBox="0 0 400 500"
                  preserveAspectRatio="xMidYMid slice"
                >
                  <defs>
                    <pattern
                      id="pima-twill-weave"
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
                        stroke="rgba(245, 242, 235, 0.065)"
                        strokeWidth="1.2"
                      />
                      <line
                        x1="5"
                        y1="0"
                        x2="5"
                        y2="10"
                        stroke="rgba(56, 189, 248, 0.045)"
                        strokeWidth="0.8"
                      />
                    </pattern>

                    <radialGradient
                      id="fabric-sheen"
                      cx="68%"
                      cy="30%"
                      r="72%"
                    >
                      <stop offset="0%" stopColor="#1E2836" stopOpacity="0.95" />
                      <stop offset="48%" stopColor="#11151E" stopOpacity="0.98" />
                      <stop offset="100%" stopColor="#080A0F" stopOpacity="1" />
                    </radialGradient>

                    <radialGradient
                      id="mother-of-pearl"
                      cx="38%"
                      cy="34%"
                      r="65%"
                    >
                      <stop offset="0%" stopColor="#FFFFFF" />
                      <stop offset="35%" stopColor="#E6EDF5" />
                      <stop offset="70%" stopColor="#C8D6E5" />
                      <stop offset="100%" stopColor="#8D99AE" />
                    </radialGradient>

                    <linearGradient
                      id="placket-fold"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="rgba(6,7,9,0.75)" />
                      <stop offset="14%" stopColor="rgba(245,242,235,0.06)" />
                      <stop offset="86%" stopColor="rgba(245,242,235,0.02)" />
                      <stop offset="100%" stopColor="rgba(6,7,9,0.65)" />
                    </linearGradient>
                  </defs>

                  {/* Base Poplin/Twill Drape */}
                  <rect width="400" height="500" fill="url(#fabric-sheen)" />
                  <rect
                    width="400"
                    height="500"
                    fill="url(#pima-twill-weave)"
                  />

                  {/* Tailored Shirt Placket Architectural Fold */}
                  <rect
                    x="156"
                    y="0"
                    width="88"
                    height="500"
                    fill="url(#placket-fold)"
                  />

                  {/* Precision 18-stitches/cm Sartorial Topstitching */}
                  <line
                    x1="168"
                    y1="0"
                    x2="168"
                    y2="500"
                    stroke="rgba(200, 169, 126, 0.36)"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />
                  <line
                    x1="232"
                    y1="0"
                    x2="232"
                    y2="500"
                    stroke="rgba(200, 169, 126, 0.36)"
                    strokeWidth="1"
                    strokeDasharray="3 3"
                  />

                  {/* Sculpted Australian Mother-of-Pearl Button Macro */}
                  <g transform="translate(200, 218)">
                    <circle
                      r="44"
                      fill="rgba(0,0,0,0.55)"
                      transform="translate(4, 10)"
                    />
                    <circle r="42" fill="url(#mother-of-pearl)" />
                    <circle
                      r="33"
                      fill="none"
                      stroke="rgba(255,255,255,0.65)"
                      strokeWidth="1.2"
                    />
                    <circle
                      r="31"
                      fill="none"
                      stroke="rgba(56,189,248,0.22)"
                      strokeWidth="1"
                    />
                    {/* Four Buttonholes */}
                    <circle cx="-8" cy="-8" r="3" fill="#101218" />
                    <circle cx="8" cy="-8" r="3" fill="#101218" />
                    <circle cx="-8" cy="8" r="3" fill="#101218" />
                    <circle cx="8" cy="8" r="3" fill="#101218" />
                    {/* Hand-sewn Champagne Cross Stitch */}
                    <line
                      x1="-8"
                      y1="-8"
                      x2="8"
                      y2="8"
                      stroke="#C8A97E"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                    />
                    <line
                      x1="8"
                      y1="-8"
                      x2="-8"
                      y2="8"
                      stroke="#C8A97E"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                    />
                  </g>

                  {/* Subtle Tailoring Caliper Guides */}
                  <g stroke="rgba(56, 189, 248, 0.28)" strokeWidth="0.8">
                    <line x1="200" y1="150" x2="200" y2="168" />
                    <line x1="200" y1="268" x2="200" y2="286" />
                    <line x1="132" y1="218" x2="150" y2="218" />
                    <line x1="250" y1="218" x2="268" y2="218" />
                  </g>
                </svg>

                {/* Top Specimen Caption */}
                <div className="relative z-10 flex items-center justify-between px-5 pt-5">
                  <span className="font-mono text-[10px] tracking-[0.2em] text-muted uppercase">
                    Pima Piura Celeste
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.2em] text-cyan uppercase">
                    MACRO 1:1
                  </span>
                </div>

                {/* Embroidered Monogram Corner Detail */}
                <div className="absolute bottom-5 left-5 right-5 z-10 flex items-end justify-between border-t border-white/[0.08] pt-4">
                  <div>
                    <p className="font-display text-lg font-bold tracking-[0.04em] text-primary">
                      Pima Piura Celeste
                    </p>
                    <p className="mt-0.5 font-mono text-[10px] tracking-[0.18em] text-muted uppercase">
                      Ref. Art. 2529 · Hilado 120/2
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-display text-sm font-semibold italic tracking-[0.12em] text-champagne">
                      C.M.
                    </span>
                    <span className="font-mono text-[9px] tracking-[0.16em] text-muted uppercase">
                      Bordado
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Telemetry Tag #1 (Primary Required Spec) */}
              <div
                ref={tagPrimaryRef}
                className="relative mt-4 sm:mt-0 sm:absolute sm:-bottom-5 sm:-left-10 lg:-left-20 z-20 rounded-xl border border-white/[0.11] bg-obsidian/90 px-4 py-2.5 backdrop-blur-xl shadow-[0_14px_35px_rgba(0,0,0,0.6)] will-change-transform"
              >
                <div className="flex items-center gap-2.5">
                  <span
                    aria-hidden="true"
                    className="h-1.5 w-1.5 shrink-0 rounded-full bg-cyan"
                  />
                  <span className="font-mono text-[10px] sm:text-[11px] font-medium tracking-[0.14em] text-primary uppercase">
                    REF. ART. 2529 · PIMA 120/2 · PIURA 38MM · NÁCAR AUSTRALIANO
                  </span>
                </div>
              </div>

              {/* Floating Telemetry Tag #2 (Top Right) */}
              <div
                ref={tagSecondaryRef}
                className="hidden sm:block absolute -top-4 -right-5 z-20 rounded-xl border border-champagne/30 bg-obsidian/90 px-3.5 py-2 backdrop-blur-xl shadow-[0_12px_30px_rgba(0,0,0,0.55)] will-change-transform"
              >
                <p className="font-mono text-[10px] tracking-[0.18em] text-champagne uppercase">
                  A MEDIDA · SIN CARGO EXTRA
                </p>
              </div>

              {/* Floating Telemetry Tag #3 (Mid Left) */}
              <div
                ref={tagTertiaryRef}
                className="hidden lg:block absolute top-1/3 -left-14 z-20 rounded-xl border border-white/[0.09] bg-elevated/90 px-3.5 py-2 backdrop-blur-xl shadow-[0_12px_30px_rgba(0,0,0,0.5)] will-change-transform"
              >
                <p className="font-mono text-[10px] tracking-[0.16em] text-muted uppercase">
                  COSTURA FRANCESA ·{" "}
                  <span className="text-primary">18 PTS/CM</span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Atelier Telemetry Footer Bar */}
      <div className="relative z-10 mx-auto mt-14 w-full max-w-7xl px-5 sm:px-8 lg:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.08] pt-5 font-mono text-[10px] tracking-[0.2em] text-muted uppercase">
          <span>34°36&apos;S 58°22&apos;W · BUENOS AIRES · ENVÍOS AL EXTERIOR</span>
          <span className="text-primary/70">
            ARS / USD ORIENTATIVO · ATENCIÓN PERSONALIZADA
          </span>
        </div>
      </div>
    </section>
  );
}
