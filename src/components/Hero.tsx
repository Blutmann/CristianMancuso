"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { ArrowRight, Ruler } from "lucide-react";
import { useMotion } from "@/context/MotionContext";

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const { isMotionPaused } = useMotion();
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });
  const sectionRef = useRef<HTMLElement | null>(null);
  const shirtParallaxRef = useRef<HTMLDivElement | null>(null);
  const threadPathRef = useRef<SVGPathElement | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const parallaxEl = shirtParallaxRef.current;
    const threadPath = threadPathRef.current;
    if (!section) return;

    if (isMotionPaused) {
      if (parallaxEl) gsap.set(parallaxEl, { y: 0, scale: 1 });
      if (threadPath) {
        gsap.set(threadPath, { strokeDasharray: "none", strokeDashoffset: 0 });
      }
      return;
    }

    const ctx = gsap.context(() => {
      // Dramatic non-blocking scroll parallax + scale + subtle rotation on the protagonist shirt
      if (parallaxEl) {
        gsap.fromTo(
          parallaxEl,
          { y: 0, scale: 1, rotate: 0 },
          {
            y: -90,
            scale: 1.12,
            rotate: -3,
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

      // Sartorial thread line drawing itself downward into the 4 Gamas section
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

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (isMotionPaused || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rotateX: -ny * 9, rotateY: nx * 12 });
  };

  const handlePointerLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  return (
    <section
      ref={sectionRef}
      id="hero"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative flex min-h-[88svh] items-center bg-transparent pt-24 pb-12 text-[#111113] sm:pt-28 dark:text-white"
    >
      <div className="mx-auto grid w-full max-w-[1360px] grid-cols-1 items-center gap-8 px-5 sm:px-8 lg:grid-cols-12 lg:gap-10 lg:px-10">
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
            <Link
              id="hero-cta-coleccion"
              href="/coleccion"
              className="ds-btn-primary shadow-[0_14px_34px_rgba(22,35,59,0.2)] dark:shadow-[0_14px_34px_rgba(255,255,255,0.16)]"
            >
              <span>Ver Colección</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>

            <Link
              id="hero-cta-medida"
              href="/a-medida"
              className="ds-btn-secondary"
            >
              <Ruler className="h-4 w-4" aria-hidden="true" />
              <span>Armá tu camisa</span>
            </Link>
          </div>
        </div>

        {/* Right Protagonist Transparent PNG Shirt: Magical Levitation + 3D Tilt + Scroll Parallax + Synced Floor Shadow */}
        <div
          className="relative flex flex-col items-center justify-center lg:col-span-5"
          style={{ perspective: "1100px" }}
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
            className="relative flex w-full max-w-[340px] flex-col items-center sm:max-w-[385px] lg:max-w-[410px] will-change-transform"
          >
            <motion.div
              animate={
                isMotionPaused
                  ? { y: 0, rotate: 0, scale: 1, rotateX: 0, rotateY: 0 }
                  : {
                      y: [0, -7, 0],
                      rotate: [-0.45, 0.45, -0.45],
                      scale: [1, 1.015, 1],
                      rotateX: tilt.rotateX,
                      rotateY: tilt.rotateY,
                    }
              }
              transition={{
                y: { duration: 5.5, repeat: Infinity, ease: "easeInOut" },
                rotate: { duration: 5.5, repeat: Infinity, ease: "easeInOut" },
                scale: { duration: 5.5, repeat: Infinity, ease: "easeInOut" },
                rotateX: { type: "spring", stiffness: 120, damping: 20 },
                rotateY: { type: "spring", stiffness: 120, damping: 20 },
              }}
              style={{ transformStyle: "preserve-3d" }}
              className="relative aspect-[3/4] w-full px-2 py-4 select-none"
            >
              <picture className="block h-full w-full">
                <source
                  media="(min-width: 768px)"
                  srcSet="/images/shirts/pima-noche-hd.webp"
                  type="image/webp"
                />
                <motion.img
                  src="/images/shirts/pima-noche-mobile.webp"
                  alt="Camisa a medida Cristian Mancuso en Algodón Pima Peruano Azul Noche"
                  loading="eager"
                  fetchPriority="high"
                  draggable={false}
                  initial={isMotionPaused ? false : { opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
                  className="h-full w-full object-contain drop-shadow-[0_24px_34px_rgba(17,17,19,0.22)] dark:drop-shadow-[0_28px_44px_rgba(0,0,0,0.65)]"
                />
              </picture>
            </motion.div>

            {/* Synchronized Breathing Elliptical Floor Shadow */}
            <motion.div
              aria-hidden="true"
              animate={
                isMotionPaused
                  ? { scale: 1, opacity: 0.22 }
                  : {
                      scale: [1, 0.93, 1],
                      opacity: [0.22, 0.14, 0.22],
                    }
              }
              transition={{
                duration: 5.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="pointer-events-none -mt-1 h-5 w-48 rounded-full bg-[#111113] blur-xl dark:bg-black"
            />
          </div>
        </div>
      </div>

      {/* Sartorial SVG Thread Line Connecting Hero -> 4 Gamas on Scroll */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-12 left-1/2 z-10 hidden h-24 w-24 -translate-x-1/2 lg:block"
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
