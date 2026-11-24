"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Check, Ruler, Scissors, Sparkles } from "lucide-react";
import { FABRIC_RANGES, type FabricCategoryId } from "@/data/fabrics";
import { useMotion } from "@/context/MotionContext";

const GAMA_IMAGE: Record<FabricCategoryId, string> = {
  urbano: "/images/shirts/oxford-grafito.png",
  pima: "/images/shirts/pima-acero.png",
  italiano: "/images/shirts/lino-marfil.png",
  donna: "/images/shirts/donna-mineral.png",
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

export function HomeShowcaseSections() {
  const { isMotionPaused } = useMotion();

  return (
    <>
      {/* BLOQUE 2: Cuatro Gamas de Telas en Grilla 2×2 Horizontal con Lupa Real 2.5x */}
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
              const imgSrc = GAMA_IMAGE[gama.id];
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
                    {/* Left: Floating Shirt + Elliptical Floor Shadow + Real 2.5x Magnifier Loupe */}
                    <div className="relative flex h-44 w-32 shrink-0 flex-col items-center justify-center sm:h-48 sm:w-36">
                      <div
                        className={`relative h-full w-full pb-3 ${
                          isMotionPaused
                            ? ""
                            : "transition-transform duration-500 ease-out group-hover:-translate-y-2 group-hover:scale-105"
                        }`}
                      >
                        <Image
                          src={imgSrc}
                          alt={gama.name}
                          fill
                          sizes="160px"
                          className="object-contain drop-shadow-[0_14px_18px_rgba(17,17,19,0.2)] dark:drop-shadow-[0_16px_22px_rgba(0,0,0,0.55)]"
                        />
                      </div>

                      {/* Soft elliptical floor shadow */}
                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute bottom-1 h-2.5 w-20 rounded-full bg-[#111113] opacity-20 blur-md transition-all duration-500 group-hover:scale-85 group-hover:opacity-15 dark:bg-black dark:opacity-55"
                      />

                      {/* Wide w-24 h-24 Liquid Glass Magnifier Loupe with Real 2.5x Photo Zoom */}
                      <div
                        aria-hidden="true"
                        className={`liquid-glass pointer-events-none absolute -right-2 bottom-2 z-20 h-24 w-24 overflow-hidden rounded-full border-2 border-white/85 shadow-[0_14px_32px_rgba(0,0,0,0.28)] transition-all duration-300 dark:border-white/75 ${
                          isMotionPaused
                            ? "scale-100 opacity-100"
                            : "scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={imgSrc}
                          alt=""
                          fill
                          sizes="240px"
                          className="scale-[2.5] object-cover object-center"
                        />
                        {/* Subtle convex glass reflection */}
                        <div
                          className="absolute inset-0 rounded-full"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(255,255,255,0.38) 0%, transparent 45%, rgba(0,0,0,0.12) 100%)",
                          }}
                        />
                      </div>
                    </div>

                    {/* Right: Clean Editorial Text + Price (Zero Inner Containers) */}
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

      {/* BLOQUE 3: Invitación A Medida Limpia (Sin Tira Cinética) */}
      <section
        id="invitacion-medida"
        aria-labelledby="invitacion-heading"
        className="relative py-12 lg:py-14"
      >
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
