"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, Ruler } from "lucide-react";
import { useMotion } from "@/context/MotionContext";

gsap.registerPlugin(ScrollTrigger);

interface HeroShowcaseSlide {
  id: string;
  name: string;
  fabric: string;
  lightMobile: string;
  lightHd: string;
  darkMobile: string;
  darkHd: string;
  alt: string;
}

const HERO_SHOWCASE_SLIDES: HeroShowcaseSlide[] = [
  {
    id: "pima-piura-noche",
    name: "Piura Noche",
    fabric: "Algodón Pima",
    lightMobile: "/images/shirts/light/pima-noche-mobile.webp",
    lightHd: "/images/shirts/light/pima-noche-hd.webp",
    darkMobile: "/images/shirts/dark/pima-noche-mobile.webp",
    darkHd: "/images/shirts/dark/pima-noche-hd.webp",
    alt: "Camisa a medida Cristian Mancuso Piura Noche en Algodón Pima Peruano",
  },
  {
    id: "biella-lino-marfil",
    name: "Biella Marfil",
    fabric: "Lino Italiano",
    lightMobile: "/images/shirts/light/lino-marfil-mobile.webp",
    lightHd: "/images/shirts/light/lino-marfil-hd.webp",
    darkMobile: "/images/shirts/dark/lino-marfil-mobile.webp",
    darkHd: "/images/shirts/dark/lino-marfil-hd.webp",
    alt: "Camisa a medida Cristian Mancuso Biella Marfil en 100% Lino Italiano",
  },
  {
    id: "cuadros-ventana-lino-algodon",
    name: "Cuadros Ventana",
    fabric: "Lino & Algodón",
    lightMobile: "/images/shirts/light/cuadros-ventana-mobile.webp",
    lightHd: "/images/shirts/light/cuadros-ventana-hd.webp",
    darkMobile: "/images/shirts/dark/cuadros-ventana-mobile.webp",
    darkHd: "/images/shirts/dark/cuadros-ventana-hd.webp",
    alt: "Camisa a medida Cristian Mancuso Cuadros Ventana en Blend Lino y Algodón",
  },
  {
    id: "pima-piura-acero",
    name: "Piura Acero",
    fabric: "Algodón Pima",
    lightMobile: "/images/shirts/light/pima-acero-mobile.webp",
    lightHd: "/images/shirts/light/pima-acero-hd.webp",
    darkMobile: "/images/shirts/dark/pima-acero-mobile.webp",
    darkHd: "/images/shirts/dark/pima-acero-hd.webp",
    alt: "Camisa a medida Cristian Mancuso Piura Acero en Algodón Pima Peruano",
  },
];

const SHOWCASE_INTERVAL_MS = 3500;

export function Hero() {
  const { isMotionPaused } = useMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, active: false });
  const sectionRef = useRef<HTMLElement | null>(null);
  const shirtParallaxRef = useRef<HTMLDivElement | null>(null);
  const threadPathRef = useRef<SVGPathElement | null>(null);

  const currentSlide = HERO_SHOWCASE_SLIDES[activeIndex];

  // Continuous auto-showcase rotation every 3.5s (respecting isMotionPaused)
  useEffect(() => {
    if (isMotionPaused) return;
    const timer = window.setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % HERO_SHOWCASE_SLIDES.length);
    }, SHOWCASE_INTERVAL_MS);
    return () => window.clearInterval(timer);
  }, [isMotionPaused, activeIndex]);

  useEffect(() => {
    const section = sectionRef.current;
    const parallaxEl = shirtParallaxRef.current;
    const threadPath = threadPathRef.current;
    if (!section) return;

    if (isMotionPaused) {
      if (parallaxEl) gsap.set(parallaxEl, { y: 0, scale: 1, rotate: 0 });
      if (threadPath) {
        gsap.set(threadPath, { strokeDasharray: "none", strokeDashoffset: 0 });
      }
      return;
    }

    const ctx = gsap.context(() => {
      if (parallaxEl) {
        gsap.fromTo(
          parallaxEl,
          { y: 0, scale: 1, rotate: 0 },
          {
            y: -85,
            scale: 1.09,
            rotate: -2.5,
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: "bottom top",
              scrub: 0.5,
            },
          }
        );
      }

      if (threadPath) {
        const len = threadPath.getTotalLength();
        gsap.set(threadPath, {
          strokeDasharray: len,
          strokeDashoffset: len,
        });
        gsap.to(threadPath, {
          strokeDashoffset: 0,
          ease: "none",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: "bottom 25%",
            scrub: 0.5,
          },
        });
      }
    }, section);

    return () => ctx.revert();
  }, [isMotionPaused]);

  const handleStagePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (isMotionPaused) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rotateX: -ny * 10, rotateY: nx * 13, active: true });
  };

  const handleStagePointerLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, active: false });
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative flex items-center bg-transparent pt-20 pb-8 text-[#111113] sm:pt-24 sm:pb-10 lg:min-h-[78svh] lg:pt-28 lg:pb-10 dark:text-white"
    >
      <div className="mx-auto grid w-full max-w-[1360px] grid-cols-1 items-center gap-6 px-4 sm:gap-7 sm:px-8 lg:grid-cols-12 lg:gap-10 lg:px-10">
        {/* Left Editorial Copy */}
        <div className="lg:col-span-7">
          <h1 className="ds-h1-hero">
            Camisas de autor,{" "}
            <span className="text-[#16233B] dark:text-[#E5E9F0]">
              listas o a tu medida.
            </span>
          </h1>

          <p className="ds-body mt-3 max-w-xl text-muted sm:mt-4">
            Algodón Pima y lino italiano. Envíos a todo el país y exterior · A medida sin costo extra.
          </p>

          {/* 2 Clean Primary / Secondary CTAs — Single row even at 360px */}
          <div className="mt-4 flex flex-nowrap items-center gap-2 sm:mt-7 sm:flex-wrap sm:gap-3.5">
            <motion.div
              whileHover={isMotionPaused ? undefined : { scale: 1.02 }}
              whileTap={isMotionPaused ? undefined : { scale: 0.97 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
            >
              <Link
                id="hero-cta-coleccion"
                href="/coleccion"
                className="ds-btn-primary !min-h-[40px] !gap-1.5 !px-3.5 !py-2.5 !text-[11px] whitespace-nowrap shadow-[0_14px_34px_rgba(22,35,59,0.2)] sm:!min-h-[44px] sm:!gap-2 sm:!px-6 sm:!text-xs dark:shadow-[0_14px_34px_rgba(255,255,255,0.16)]"
              >
                <span>Ver Colección</span>
                <ArrowRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
              </Link>
            </motion.div>

            <motion.div
              whileHover={isMotionPaused ? undefined : { scale: 1.02 }}
              whileTap={isMotionPaused ? undefined : { scale: 0.97 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
            >
              <Link
                id="hero-cta-medida"
                href="/a-medida"
                className="ds-btn-secondary !min-h-[40px] !gap-1.5 !px-3.5 !py-2.5 !text-[11px] whitespace-nowrap sm:!min-h-[44px] sm:!gap-2 sm:!px-5 sm:!text-xs"
              >
                <Ruler className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
                <span>Armá tu camisa</span>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Right Living Auto-Showcase Stage: Continuous Rotation + 3D Levitation + Interactive Pointer Tilt + External Live Liquid Glass Capsule */}
        <div
          className="relative flex flex-col items-center justify-center lg:col-span-5"
          style={{ perspective: "1000px" }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-6 rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(22,35,59,0.14) 0%, transparent 70%)",
            }}
          />

          <div
            ref={shirtParallaxRef}
            onPointerMove={handleStagePointerMove}
            onPointerLeave={handleStagePointerLeave}
            onPointerCancel={handleStagePointerLeave}
            className="relative mx-auto flex w-full flex-col items-center will-change-transform"
          >
            <motion.div
              animate={
                isMotionPaused
                  ? { y: 0, rotateX: 0, rotateY: 0 }
                  : {
                      y: [0, -14, 0],
                      rotateY: tilt.active ? tilt.rotateY : [-3, 3, -3],
                      rotateX: tilt.active ? tilt.rotateX : [1.4, -1.4, 1.4],
                    }
              }
              transition={{
                y: { duration: 4.2, repeat: Infinity, ease: "easeInOut" },
                rotateY: tilt.active
                  ? { type: "spring", stiffness: 320, damping: 26 }
                  : { duration: 5.6, repeat: Infinity, ease: "easeInOut" },
                rotateX: tilt.active
                  ? { type: "spring", stiffness: 320, damping: 26 }
                  : { duration: 5.6, repeat: Infinity, ease: "easeInOut" },
              }}
              style={{ transformStyle: "preserve-3d" }}
              className="relative mx-auto h-[clamp(355px,54svh,520px)] w-full max-w-[360px] overflow-hidden rounded-3xl border border-black/10 bg-[#F4F1EC] shadow-[0_26px_64px_rgba(17,17,19,0.16)] select-none min-[410px]:max-w-[396px] lg:h-[540px] lg:max-w-[420px] dark:border-white/14 dark:bg-[#0E0F13] dark:shadow-[0_30px_72px_rgba(0,0,0,0.62)]"
            >
              <AnimatePresence mode="sync" initial={false}>
                <motion.div
                  key={currentSlide.id}
                  initial={
                    isMotionPaused ? false : { opacity: 0, scale: 1.04 }
                  }
                  animate={
                    isMotionPaused
                      ? { opacity: 1, scale: 1 }
                      : { opacity: 1, scale: [1.04, 1, 1.02] }
                  }
                  exit={isMotionPaused ? undefined : { opacity: 0, scale: 0.99 }}
                  transition={{
                    opacity: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
                    scale: { duration: 3.5, ease: "easeOut" },
                  }}
                  className="absolute inset-0 h-full w-full p-0"
                >
                  {/* Light Mode Loro Piana Ivory Studio Photograph */}
                  <picture className="block h-full w-full dark:hidden">
                    <source
                      media="(min-width: 768px)"
                      srcSet={currentSlide.lightHd}
                      type="image/webp"
                    />
                    <img
                      src={currentSlide.lightMobile}
                      alt={currentSlide.alt}
                      loading="eager"
                      fetchPriority={activeIndex === 0 ? "high" : "auto"}
                      draggable={false}
                      className="h-full w-full scale-[1.12] object-contain object-[50%_42%]"
                    />
                  </picture>

                  {/* Dark Mode Deep Charcoal Studio Photograph */}
                  <picture className="hidden h-full w-full dark:block">
                    <source
                      media="(min-width: 768px)"
                      srcSet={currentSlide.darkHd}
                      type="image/webp"
                    />
                    <img
                      src={currentSlide.darkMobile}
                      alt={currentSlide.alt}
                      loading="eager"
                      fetchPriority={activeIndex === 0 ? "high" : "auto"}
                      draggable={false}
                      className="h-full w-full scale-[1.12] object-contain object-[50%_42%]"
                    />
                  </picture>
                </motion.div>
              </AnimatePresence>

              {/* Periodic soft specular sheen sweep across studio card */}
              {!isMotionPaused && (
                <div
                  aria-hidden="true"
                  className="animate-sheen-sweep pointer-events-none absolute inset-y-0 left-0 z-10 w-1/2"
                  style={{
                    background:
                      "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.2) 50%, transparent 100%)",
                  }}
                />
              )}
            </motion.div>

            {/* Independent Floating Liquid Glass Capsule completely outside below card (zero-flicker text) */}
            <div className="liquid-glass relative z-20 mx-auto mt-3.5 flex w-max max-w-[92vw] items-center justify-between gap-3 rounded-full px-3.5 py-2 sm:gap-4 sm:px-4.5 sm:py-2.5">
              <Link
                href={`/coleccion/${currentSlide.id}`}
                className="group min-w-0"
              >
                <motion.div
                  key={currentSlide.id}
                  initial={
                    isMotionPaused ? false : { opacity: 0.45, y: 2 }
                  }
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.16, ease: "easeOut" }}
                  className="flex min-w-0 items-center gap-1.5 whitespace-nowrap text-xs"
                >
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#16233B] dark:bg-[#D6C3A5]" />
                  <span className="font-semibold text-[#111113] group-hover:underline dark:text-white">
                    {currentSlide.name}
                  </span>
                  <span
                    aria-hidden="true"
                    className="text-[#111113]/35 dark:text-white/35"
                  >
                    ·
                  </span>
                  <span className="text-[#111113]/70 dark:text-white/75">
                    {currentSlide.fabric}
                  </span>
                </motion.div>
              </Link>

              {/* Minimalist Interactive Progress Indicators */}
              <div
                role="tablist"
                aria-label="Seleccionar camisa destacada"
                className="flex shrink-0 items-center gap-1.5"
              >
                {HERO_SHOWCASE_SLIDES.map((slide, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <button
                      key={slide.id}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      aria-label={`Ver ${slide.name}`}
                      onClick={() => setActiveIndex(idx)}
                      className="relative flex h-5 items-center justify-center px-0.5 cursor-pointer"
                    >
                      <span
                        className={`relative block h-1.5 overflow-hidden rounded-full transition-all duration-300 ${
                          isActive
                            ? "w-6 bg-black/15 dark:bg-white/20"
                            : "w-1.5 bg-black/25 hover:bg-black/45 dark:bg-white/30 dark:hover:bg-white/60"
                        }`}
                      >
                        {isActive && (
                          <motion.span
                            key={`progress-${slide.id}-${isMotionPaused ? "paused" : "live"}`}
                            initial={{ scaleX: isMotionPaused ? 1 : 0 }}
                            animate={{ scaleX: 1 }}
                            transition={{
                              duration: isMotionPaused
                                ? 0
                                : SHOWCASE_INTERVAL_MS / 1000,
                              ease: "linear",
                            }}
                            style={{ transformOrigin: "left center" }}
                            className="absolute inset-0 rounded-full bg-[#16233B] dark:bg-white"
                          />
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Synchronized Breathing Elliptical Floor Shadow */}
            <motion.div
              aria-hidden="true"
              animate={
                isMotionPaused
                  ? { scale: 1, opacity: 0.18 }
                  : {
                      scale: [1, 0.86, 1],
                      opacity: [0.2, 0.09, 0.2],
                    }
              }
              transition={{
                duration: 4.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="pointer-events-none mt-1.5 h-3 w-44 rounded-full bg-[#111113] blur-xl dark:bg-black"
            />
          </div>
        </div>
      </div>

      {/* Sartorial SVG Thread Line Connecting Hero -> 4 Gamas on Scroll */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-3 left-1/2 z-10 hidden h-6 w-16 -translate-x-1/2 sm:-bottom-5 sm:h-10 lg:block"
      >
        <svg viewBox="0 0 80 120" className="h-full w-full overflow-visible" fill="none">
          <path
            ref={threadPathRef}
            d="M 40 0 C 40 34, 24 52, 40 80 C 52 100, 40 112, 40 120"
            stroke="var(--accent-gold)"
            strokeWidth="1.6"
            strokeLinecap="round"
          />
          <circle cx="40" cy="120" r="2.6" fill="var(--accent-gold)" opacity="0.85" />
        </svg>
      </div>
    </section>
  );
}
