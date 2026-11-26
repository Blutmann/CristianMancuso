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
      className="relative flex min-h-[70svh] items-center bg-transparent pt-24 pb-6 text-[#111113] sm:pt-28 sm:pb-8 lg:min-h-[74svh] lg:pb-10 dark:text-white"
    >
      <div className="mx-auto grid w-full max-w-[1360px] grid-cols-1 items-center gap-7 px-5 sm:px-8 lg:grid-cols-12 lg:gap-10 lg:px-10">
        {/* Left Editorial Copy */}
        <div className="lg:col-span-7">
          <h1 className="ds-h1-hero">
            Tu camisa a medida,{" "}
            <span className="text-[#16233B] dark:text-white/80">
              sin costo extra.
            </span>
          </h1>

          <p className="ds-body mt-4 max-w-xl text-muted">
            Telas italianas y peruanas. Envíos a todo el país y exterior.
          </p>

          {/* 2 Clean Primary / Secondary CTAs */}
          <div className="mt-7 flex flex-wrap items-center gap-3.5">
            <motion.div
              whileHover={isMotionPaused ? undefined : { scale: 1.02 }}
              whileTap={isMotionPaused ? undefined : { scale: 0.97 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
            >
              <Link
                id="hero-cta-coleccion"
                href="/coleccion"
                className="ds-btn-primary shadow-[0_14px_34px_rgba(22,35,59,0.2)] dark:shadow-[0_14px_34px_rgba(255,255,255,0.16)]"
              >
                <span>Ver Colección</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
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
                className="ds-btn-secondary"
              >
                <Ruler className="h-4 w-4" aria-hidden="true" />
                <span>Armá tu camisa</span>
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Right Living Auto-Showcase Stage: Continuous Rotation + 3D Levitation + Interactive Pointer Tilt + Live Liquid Glass Capsule */}
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
            className="relative flex w-full max-w-[290px] flex-col items-center sm:max-w-[330px] lg:max-w-[355px] will-change-transform"
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
              className="relative aspect-[4/4.85] w-full overflow-hidden rounded-3xl border border-black/10 bg-[#F4F1EC] shadow-[0_26px_64px_rgba(17,17,19,0.16)] select-none dark:border-white/14 dark:bg-[#0E0F13] dark:shadow-[0_30px_72px_rgba(0,0,0,0.62)]"
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
                  className="absolute inset-0 h-full w-full pb-14"
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
                      className="h-full w-full object-contain object-center"
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
                      className="h-full w-full object-contain object-center"
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

              {/* Live Floating Liquid Glass Capsule (Garment Name + Fabric + Interactive Progress Dots) */}
              <div className="liquid-glass absolute right-2.5 bottom-2.5 left-2.5 z-20 flex items-center justify-between gap-2 rounded-2xl px-3 py-2">
                <Link
                  href={`/coleccion/${currentSlide.id}`}
                  className="group min-w-0 flex-1"
                >
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.div
                      key={currentSlide.id}
                      initial={
                        isMotionPaused ? false : { opacity: 0, y: 5 }
                      }
                      animate={{ opacity: 1, y: 0 }}
                      exit={isMotionPaused ? undefined : { opacity: 0, y: -5 }}
                      transition={{
                        type: "spring",
                        stiffness: 320,
                        damping: 26,
                      }}
                      className="flex items-center gap-2 min-w-0"
                    >
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#16233B] dark:bg-[#D6C3A5]" />
                      <div className="min-w-0 leading-tight">
                        <p className="truncate text-[11.5px] font-semibold text-[#111113] group-hover:underline dark:text-white">
                          {currentSlide.name}
                        </p>
                        <p className="truncate text-[10.5px] text-[#111113]/70 dark:text-white/75">
                          {currentSlide.fabric}
                        </p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </Link>

                {/* Minimalist Interactive Progress Indicators */}
                <div
                  role="tablist"
                  aria-label="Seleccionar camisa destacada"
                  className="flex shrink-0 items-center gap-1"
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
                              ? "w-5 bg-black/15 dark:bg-white/20"
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
            </motion.div>

            {/* Synchronized Breathing Elliptical Floor Shadow */}
            <motion.div
              aria-hidden="true"
              animate={
                isMotionPaused
                  ? { scale: 1, opacity: 0.2 }
                  : {
                      scale: [1, 0.86, 1],
                      opacity: [0.22, 0.1, 0.22],
                    }
              }
              transition={{
                duration: 4.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="pointer-events-none mt-1.5 h-4 w-48 rounded-full bg-[#111113] blur-xl dark:bg-black"
            />
          </div>
        </div>
      </div>

      {/* Sartorial SVG Thread Line Connecting Hero -> 4 Gamas on Scroll */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-7 left-1/2 z-10 hidden h-14 w-16 -translate-x-1/2 lg:block"
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
