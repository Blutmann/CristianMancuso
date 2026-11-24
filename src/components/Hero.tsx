"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Ruler } from "lucide-react";
import { useMotion } from "@/context/MotionContext";

export function Hero() {
  const { isMotionPaused } = useMotion();
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0 });

  const handlePointerMove = (e: React.PointerEvent<HTMLElement>) => {
    if (isMotionPaused || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = (e.clientX - rect.left) / rect.width - 0.5;
    const ny = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rotateX: -ny * 10, rotateY: nx * 13 });
  };

  const handlePointerLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0 });
  };

  return (
    <section
      id="hero"
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className="relative flex min-h-[100svh] items-center bg-transparent pt-28 pb-14 text-[#111113] dark:text-white"
    >
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 px-5 sm:px-8 lg:grid-cols-12 lg:gap-8 lg:px-12 xl:pr-24">
        {/* Left Editorial Copy */}
        <div className="lg:col-span-7">
          <div className="mb-5 inline-flex items-center gap-2.5 rounded-full border border-black/10 bg-white/70 px-3.5 py-1.5 text-[11px] font-medium tracking-[0.14em] text-[#16233B] uppercase backdrop-blur-md dark:border-white/15 dark:bg-white/[0.06] dark:text-white/80">
            <span className="h-1.5 w-1.5 rounded-full bg-[#B08D57]" />
            Buenos Aires · Sastrería de Autor
          </div>

          <h1 className="font-display text-[clamp(2.5rem,5.4vw,4.6rem)] font-bold leading-[1.02] tracking-[-0.035em] text-[#111113] dark:text-white">
            Tu camisa a medida,{" "}
            <span className="text-[#16233B] dark:text-white/80">
              sin costo extra.
            </span>
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
            Elegí tela, cuello y medidas. Confección artesanal en Buenos Aires
            con envío a todo el país y exterior.
          </p>

          {/* 2 Clean Primary / Secondary CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-3.5">
            <Link
              id="hero-cta-coleccion"
              href="/coleccion"
              className="inline-flex min-h-[50px] items-center gap-2.5 rounded-full bg-[#111113] px-7 text-xs font-semibold tracking-[0.06em] text-white uppercase shadow-[0_14px_34px_rgba(17,17,19,0.2)] transition-transform hover:scale-[1.01] hover:bg-[#16233B] dark:bg-white dark:text-[#0B0B0E] dark:shadow-[0_14px_34px_rgba(255,255,255,0.18)] dark:hover:bg-white/90"
            >
              <span>Ver Colección</span>
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>

            <Link
              id="hero-cta-medida"
              href="/a-medida"
              className="liquid-glass inline-flex min-h-[50px] items-center gap-2.5 rounded-full px-7 text-xs font-semibold tracking-[0.06em] text-[#111113] uppercase transition-colors hover:bg-white dark:text-white dark:hover:bg-white/[0.14]"
            >
              <Ruler className="h-4 w-4" aria-hidden="true" />
              <span>Armá tu camisa</span>
            </Link>
          </div>

          <p className="mt-6 text-xs text-muted">
            ✓ 3 cuotas sin interés · Envíos a Argentina, México, EE. UU. y
            España
          </p>
        </div>

        {/* Right Protagonist Transparent PNG Shirt with Smooth 3D Mouse Tilt */}
        <div
          className="relative flex items-center justify-center lg:col-span-5"
          style={{ perspective: "1100px" }}
        >
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-6 rounded-full blur-3xl"
            style={{
              background:
                "radial-gradient(circle, rgba(22,35,59,0.12) 0%, transparent 70%)",
            }}
          />

          <motion.div
            animate={
              isMotionPaused
                ? { rotateX: 0, rotateY: 0 }
                : { rotateX: tilt.rotateX, rotateY: tilt.rotateY }
            }
            transition={{ type: "spring", stiffness: 120, damping: 20 }}
            style={{ transformStyle: "preserve-3d" }}
            className="relative aspect-[3/4] w-full max-w-[360px] sm:max-w-[400px] lg:max-w-[430px] select-none"
          >
            <motion.img
              src="/images/shirts/pima-noche.png"
              alt="Camisa a medida Cristian Mancuso en Algodón Pima Peruano Azul Noche"
              draggable={false}
              initial={isMotionPaused ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
              className="h-full w-full object-contain drop-shadow-[0_28px_40px_rgba(17,17,19,0.24)] dark:drop-shadow-[0_32px_48px_rgba(0,0,0,0.68)]"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
