"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion } from "framer-motion";
import { ArrowRight, Check, Ruler, Scissors, Sparkles } from "lucide-react";
import { FABRIC_RANGES, type FabricCategoryId } from "@/data/fabrics";
import { useMotion } from "@/context/MotionContext";

gsap.registerPlugin(ScrollTrigger);

const GAMA_VISUALS: Record<
  FabricCategoryId,
  { image: string; loupeStyle: React.CSSProperties }
> = {
  urbano: {
    image: "/images/shirts/oxford-grafito.png",
    loupeStyle: {
      backgroundColor: "#2C3038",
      backgroundImage:
        "radial-gradient(rgba(255,255,255,0.22) 1px, transparent 1px), radial-gradient(rgba(0,0,0,0.35) 1px, transparent 1px)",
      backgroundSize: "6px 6px",
      backgroundPosition: "0 0, 3px 3px",
    },
  },
  pima: {
    image: "/images/shirts/pima-acero.png",
    loupeStyle: {
      backgroundColor: "#334459",
      backgroundImage:
        "repeating-linear-gradient(135deg, rgba(226,232,240,0.28) 0px, rgba(226,232,240,0.28) 1.5px, transparent 1.5px, transparent 5px)",
    },
  },
  italiano: {
    image: "/images/shirts/lino-marfil.png",
    loupeStyle: {
      backgroundColor: "#E5DDD0",
      backgroundImage:
        "repeating-linear-gradient(0deg, rgba(140,122,96,0.22) 0px, rgba(140,122,96,0.22) 1px, transparent 1px, transparent 4px), repeating-linear-gradient(90deg, rgba(140,122,96,0.16) 0px, rgba(140,122,96,0.16) 1px, transparent 1px, transparent 5px)",
    },
  },
  donna: {
    image: "/images/shirts/donna-mineral.png",
    loupeStyle: {
      backgroundColor: "#E8DDD6",
      backgroundImage:
        "repeating-linear-gradient(90deg, rgba(75,85,99,0.34) 0px, rgba(75,85,99,0.34) 1.5px, transparent 1.5px, transparent 8px)",
    },
  },
};

const BESPOKE_STEPS = [
  {
    num: "01",
    icon: Sparkles,
    title: "Elegí tela y cuello",
    text: "Algodón Urbano, Pima Peruano, Lino Italiano o Donna con 5 cortes de cuello.",
  },
  {
    num: "02",
    icon: Scissors,
    title: "Botones e iniciales",
    text: "Personalizá el botón y bordá tus iniciales en puño o pechera sin cargo.",
  },
  {
    num: "03",
    icon: Ruler,
    title: "Tus medidas exactas",
    text: "Presencial en Buenos Aires o a distancia con nuestra guía de 4 medidas.",
  },
] as const;

const KINETIC_RIBBON_ITEMS = [
  "Cuello Italiano",
  "Botón Nácar Blanco",
  "Iniciales Bordadas",
  "Calce Anatómico",
  "Algodón Pima 120/2",
  "Lino de Biella",
  "A Medida Sin Cargo",
  "Cuello Francés & Mao",
] as const;

export function HomeShowcaseSections() {
  const { isMotionPaused } = useMotion();
  const ribbonTriggerRef = useRef<HTMLDivElement | null>(null);
  const ribbonTrackRef = useRef<HTMLDivElement | null>(null);

  // Non-blocking horizontal kinetic ribbon driven smoothly by vertical scroll
  useEffect(() => {
    const trigger = ribbonTriggerRef.current;
    const track = ribbonTrackRef.current;
    if (!trigger || !track) return;

    if (isMotionPaused) {
      gsap.set(track, { xPercent: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        track,
        { xPercent: 4 },
        {
          xPercent: -24,
          ease: "none",
          scrollTrigger: {
            trigger,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
          },
        }
      );
    }, trigger);

    return () => ctx.revert();
  }, [isMotionPaused]);

  return (
    <>
      {/* BLOQUE 2: Cuatro Gamas de Telas en Grilla 2×2 Horizontal (Zero Nested Boxes) */}
      <section
        id="gamas"
        aria-labelledby="gamas-heading"
        className="relative py-12 lg:py-14"
      >
        <div className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-6">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-medium tracking-[0.2em] text-muted uppercase">
                Nuestros Géneros
              </p>
              <h2
                id="gamas-heading"
                className="mt-1.5 font-display text-[clamp(1.8rem,3.2vw,2.65rem)] font-bold leading-[1.05] tracking-[-0.03em] text-[#111113] dark:text-white"
              >
                Cuatro gamas de telas
              </h2>
            </div>

            <Link
              href="/coleccion"
              className="inline-flex min-h-[44px] items-center gap-1.5 text-xs font-semibold tracking-[0.06em] text-[#16233B] uppercase transition-opacity hover:opacity-75 dark:text-white"
            >
              <span>Ver toda la colección</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-7 grid grid-cols-1 gap-5 md:grid-cols-2">
            {FABRIC_RANGES.map((gama, idx) => {
              const visual = GAMA_VISUALS[gama.id];
              return (
                <motion.div
                  key={gama.id}
                  initial={isMotionPaused ? false : { opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.25 }}
                  transition={{
                    duration: 0.5,
                    delay: isMotionPaused ? 0 : idx * 0.06,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <Link
                    href={`/coleccion?gama=${gama.id}`}
                    className="group liquid-glass flex h-full flex-row items-center gap-4 overflow-hidden rounded-3xl p-5 transition-all duration-300 hover:border-black/20 sm:gap-5 sm:p-6 dark:hover:border-white/30"
                  >
                    {/* Left: Floating Shirt + Elliptical Floor Shadow + Circular Fabric Loupe */}
                    <div className="relative flex h-40 w-32 shrink-0 flex-col items-center justify-center sm:h-44 sm:w-36">
                      <div
                        className={`relative h-full w-full pb-3 ${
                          isMotionPaused
                            ? ""
                            : "transition-transform duration-500 ease-out group-hover:-translate-y-1.5 group-hover:scale-105"
                        }`}
                      >
                        <Image
                          src={visual.image}
                          alt={gama.name}
                          fill
                          sizes="160px"
                          className="object-contain drop-shadow-[0_14px_18px_rgba(17,17,19,0.2)] dark:drop-shadow-[0_16px_22px_rgba(0,0,0,0.55)]"
                        />
                      </div>

                      {/* Soft floor shadow */}
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute bottom-1 h-2.5 w-20 rounded-full bg-[#111113] opacity-20 blur-md transition-transform duration-500 group-hover:scale-90 dark:bg-black dark:opacity-55"
                      />

                      {/* Circular Magnifier Loupe revealing fabric weave on hover */}
                      <span
                        aria-hidden="true"
                        style={visual.loupeStyle}
                        className={`pointer-events-none absolute right-0 bottom-3 h-11 w-11 rounded-full border-2 border-white/90 shadow-[0_8px_20px_rgba(0,0,0,0.25)] transition-all duration-300 dark:border-white/75 ${
                          isMotionPaused
                            ? "opacity-95 scale-100"
                            : "scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100"
                        }`}
                      />
                    </div>

                    {/* Right: Clean Editorial Text + Price (No Inner Containers) */}
                    <div className="flex min-w-0 flex-1 flex-col justify-between self-stretch py-0.5">
                      <div>
                        <p className="text-[11px] font-medium text-muted">
                          {gama.origin}
                        </p>
                        <h3 className="mt-1 font-display text-lg font-bold leading-snug tracking-[-0.02em] text-[#111113] dark:text-white">
                          {gama.name}
                        </h3>
                        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted">
                          {gama.description}
                        </p>
                      </div>

                      <div className="mt-4 pt-2">
                        <div className="flex items-baseline gap-2">
                          <span className="text-[11px] text-muted">Desde</span>
                          <span className="font-mono text-sm font-semibold text-[#111113] tabular-nums dark:text-white">
                            ARS ${gama.priceArs.toLocaleString("es-AR")}
                          </span>
                        </div>
                        <div className="mt-1.5 flex items-center justify-between text-[11px] font-medium text-[#16233B] dark:text-champagne">
                          <span className="inline-flex items-center gap-1">
                            <Check
                              className="h-3.5 w-3.5"
                              aria-hidden="true"
                            />
                            A medida sin cargo
                          </span>
                          <ArrowRight
                            className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                            aria-hidden="true"
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* BLOQUE 3: Invitación A Medida + Tira Cinética Ligada al Scroll (Sin Pin) */}
      <section
        id="invitacion-medida"
        aria-labelledby="invitacion-heading"
        className="relative overflow-hidden py-12 lg:py-14"
      >
        {/* Scroll-Driven Horizontal Editorial Ribbon */}
        <div
          ref={ribbonTriggerRef}
          aria-hidden="true"
          className="mb-8 overflow-hidden py-2"
        >
          <div
            ref={ribbonTrackRef}
            className="flex w-max items-center gap-3 will-change-transform"
          >
            {[...KINETIC_RIBBON_ITEMS, ...KINETIC_RIBBON_ITEMS].map(
              (phrase, i) => (
                <span
                  key={`${phrase}-${i}`}
                  className="liquid-glass inline-flex items-center gap-2.5 rounded-full px-5 py-2 text-xs font-medium tracking-[0.08em] text-[#111113]/85 uppercase whitespace-nowrap dark:text-white/85"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-[#B08D57]" />
                  {phrase}
                </span>
              )
            )}
          </div>
        </div>

        {/* Clean Single-Surface Invitation Panel (Dividers instead of nested boxes) */}
        <div className="mx-auto max-w-5xl px-5 sm:px-8 lg:px-6">
          <div className="liquid-glass rounded-3xl p-6 sm:p-9 lg:p-10">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-xl">
                <p className="text-xs font-medium tracking-[0.2em] text-muted uppercase">
                  Atelier A Medida
                </p>
                <h2
                  id="invitacion-heading"
                  className="mt-1.5 font-display text-[clamp(1.75rem,3.2vw,2.5rem)] font-bold leading-[1.06] tracking-[-0.03em] text-[#111113] dark:text-white"
                >
                  Confeccionada a tu silueta, al mismo valor que un talle
                  estándar.
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/a-medida"
                  className="inline-flex min-h-[48px] items-center gap-2 rounded-full bg-[#111113] px-6 text-xs font-semibold tracking-[0.06em] text-white uppercase transition-colors hover:bg-[#16233B] dark:bg-white dark:text-[#0B0B0E] dark:hover:bg-white/90"
                >
                  <span>Armar mi camisa</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </Link>
                <Link
                  href="/como-medir"
                  className="inline-flex min-h-[48px] items-center gap-2 rounded-full border border-black/15 bg-white/70 px-6 text-xs font-semibold tracking-[0.06em] text-[#111113] uppercase transition-colors hover:bg-white dark:border-white/20 dark:bg-white/[0.06] dark:text-white dark:hover:bg-white/[0.12]"
                >
                  <Ruler className="h-4 w-4" aria-hidden="true" />
                  <span>Cómo tomar medidas</span>
                </Link>
              </div>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-6 border-t border-black/10 pt-7 md:grid-cols-3 md:divide-x md:divide-black/10 dark:border-white/10 dark:md:divide-white/10">
              {BESPOKE_STEPS.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.num}
                    className={idx > 0 ? "md:pl-6" : undefined}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs font-semibold text-muted">
                        {item.num}
                      </span>
                      <Icon
                        className="h-4 w-4 text-[#16233B] dark:text-champagne"
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="mt-3 font-display text-base font-bold text-[#111113] dark:text-white">
                      {item.title}
                    </h3>
                    <p className="mt-1 text-xs leading-relaxed text-muted">
                      {item.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
