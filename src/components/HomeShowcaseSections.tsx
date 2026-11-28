"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Check, Ruler, Scissors, Sparkles } from "lucide-react";
import { FABRIC_RANGES, type FabricCategoryId } from "@/data/fabrics";
import { useMotion } from "@/context/MotionContext";

const GAMA_VISUAL: Record<
  FabricCategoryId,
  { image: string; shortCopy: string }
> = {
  urbano: {
    image: "/images/shirts/oxford-grafito.png",
    shortCopy: "Uso diario, fácil planchado.",
  },
  pima: {
    image: "/images/shirts/pima-acero.png",
    shortCopy: "Fibra extra larga, tacto sedoso.",
  },
  italiano: {
    image: "/images/shirts/lino-marfil.png",
    shortCopy: "Tejedurías italianas, frescura superior.",
  },
  donna: {
    image: "/images/shirts/donna-mineral.png",
    shortCopy: "Corte femenino, cloqué liviano.",
  },
};

const BESPOKE_STEPS = [
  { num: "1.", icon: Sparkles, title: "Elegí tela" },
  { num: "2.", icon: Ruler, title: "Cargá medidas" },
  { num: "3.", icon: Scissors, title: "Recibila en casa" },
] as const;

export function HomeShowcaseSections() {
  const { isMotionPaused } = useMotion();

  return (
    <>
      {/* BLOQUE 2: Cuatro Gamas de Telas en Grilla 2×2 Horizontal con Lupa Real 2.5x */}
      <section
        id="gamas"
        aria-labelledby="gamas-heading"
        className="relative pt-6 pb-8 sm:pt-8 sm:pb-10 lg:pt-4 lg:pb-12"
      >
        <div className="mx-auto w-full max-w-[1360px] px-5 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <h2 id="gamas-heading" className="ds-h2">
              Cuatro gamas de telas
            </h2>

            <Link
              href="/coleccion"
              className="ds-caption inline-flex min-h-[44px] items-center gap-1.5 font-semibold text-[#16233B] uppercase transition-opacity hover:opacity-75 dark:text-white"
            >
              <span>Ver colección</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
            {FABRIC_RANGES.map((gama, idx) => {
              const visual = GAMA_VISUAL[gama.id];
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
                    className="group liquid-glass flex h-full flex-row items-center gap-3.5 overflow-hidden rounded-2xl p-4 transition-all duration-300 hover:border-black/20 sm:gap-5 sm:p-6 dark:hover:border-white/30"
                  >
                    {/* Left: Floating Shirt + Elliptical Floor Shadow + Real 2.5x Magnifier Loupe */}
                    <div className="relative flex h-40 w-28 shrink-0 flex-col items-center justify-center sm:h-48 sm:w-36">
                      <div
                        className={`relative h-full w-full pb-3 ${
                          isMotionPaused
                            ? ""
                            : "transition-transform duration-500 ease-out group-hover:-translate-y-2 group-hover:scale-105"
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

                      <span
                        aria-hidden="true"
                        className="pointer-events-none absolute bottom-1 h-2.5 w-20 rounded-full bg-[#111113] opacity-20 blur-md transition-all duration-500 group-hover:scale-85 group-hover:opacity-15 dark:bg-black dark:opacity-55"
                      />

                      <div
                        aria-hidden="true"
                        className={`liquid-glass pointer-events-none absolute -right-2 bottom-2 z-20 h-24 w-24 overflow-hidden rounded-full border-2 border-white/85 shadow-[0_14px_32px_rgba(0,0,0,0.28)] transition-all duration-300 dark:border-white/75 ${
                          isMotionPaused
                            ? "scale-100 opacity-100"
                            : "scale-75 opacity-0 group-hover:scale-100 group-hover:opacity-100"
                        }`}
                      >
                        <Image
                          src={visual.image}
                          alt=""
                          fill
                          sizes="240px"
                          className="scale-[2.5] object-cover object-center"
                        />
                        <div
                          className="absolute inset-0 rounded-full"
                          style={{
                            background:
                              "linear-gradient(135deg, rgba(255,255,255,0.38) 0%, transparent 45%, rgba(0,0,0,0.12) 100%)",
                          }}
                        />
                      </div>
                    </div>

                    {/* Right: Ultra-concise Title + <=5-word Copy + Price */}
                    <div className="flex min-w-0 flex-1 flex-col justify-between self-stretch py-1">
                      <div>
                        <h3 className="ds-h3">{gama.name}</h3>
                        <p className="mt-1.5 text-xs text-muted">
                          {visual.shortCopy}
                        </p>
                      </div>

                      <div className="mt-4 pt-2">
                        <div className="flex items-baseline gap-2">
                          <span className="text-[11px] text-muted">Desde</span>
                          <span className="font-sans text-sm font-semibold text-[#111113] tabular-nums dark:text-white">
                            ${gama.priceArs.toLocaleString("es-AR")}
                          </span>
                        </div>
                        <div className="mt-1.5 flex items-center justify-between text-[11px] font-medium text-[#16233B] dark:text-gold">
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

      {/* BLOQUE 3: Invitación A Medida Concisa */}
      <section
        id="invitacion-medida"
        aria-labelledby="invitacion-heading"
        className="relative py-8 sm:py-10 lg:py-12"
      >
        <div className="mx-auto w-full max-w-[1360px] px-5 sm:px-8 lg:px-10">
          <div className="liquid-glass rounded-2xl p-5 sm:p-9 lg:p-10">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
              <h2 id="invitacion-heading" className="ds-h2 max-w-lg">
                A medida, al mismo precio que un talle estándar.
              </h2>

              <div className="flex flex-wrap items-center gap-3">
                <Link
                  id="home-bespoke-cta"
                  href="/a-medida"
                  className="liquid-glass group relative inline-flex min-h-[44px] items-center justify-center gap-2 overflow-hidden rounded-full border-2 border-[#16233B]/35 bg-[#16233B]/[0.06] px-6 text-xs font-semibold tracking-[0.04em] text-[#16233B] uppercase transition-all duration-200 hover:border-[#16233B] hover:bg-[#16233B]/12 dark:border-white/40 dark:bg-white/[0.10] dark:text-white dark:hover:border-white dark:hover:bg-white/16"
                >
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-white/90 to-transparent dark:via-white/50"
                  />
                  <span>Armá tu camisa</span>
                  <ArrowRight
                    className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
                <Link href="/como-medir" className="ds-btn-secondary">
                  <Ruler className="h-4 w-4" aria-hidden="true" />
                  <span>Cómo medir</span>
                </Link>
              </div>
            </div>

            <div className="mt-7 grid grid-cols-1 gap-4 border-t border-black/10 pt-6 sm:grid-cols-3 sm:divide-x sm:divide-black/10 dark:border-white/10 dark:sm:divide-white/10">
              {BESPOKE_STEPS.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.num}
                    className={`flex items-center gap-3 ${idx > 0 ? "sm:pl-6" : ""}`}
                  >
                    <Icon
                      className="h-4 w-4 shrink-0 text-[#16233B] dark:text-gold"
                      aria-hidden="true"
                    />
                    <span className="font-sans text-sm font-semibold text-[#111113] dark:text-white">
                      {item.num} {item.title}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Sober Editorial Social Proof — 3 Concise Client Testimonials */}
          <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-3">
            {[
              {
                quote:
                  "“El calce del Pima 120/2 es impecable; pedí dos más con las mismas medidas.”",
                author: "Federico M.",
                location: "Palermo, Buenos Aires",
              },
              {
                quote:
                  "“Me guiaron por WhatsApp en 5 minutos y llegó exacta de hombros y manga.”",
                author: "Santiago R.",
                location: "Córdoba",
              },
              {
                quote:
                  "“El lino italiano tiene una caída difícil de encontrar. Envío perfecto a Europa.”",
                author: "Lucía V.",
                location: "Madrid, España",
              },
            ].map((item) => (
              <figure
                key={item.author}
                className="liquid-glass flex flex-col justify-between gap-3 rounded-2xl p-5"
              >
                <blockquote className="ds-body text-[#111113]/90 dark:text-[#F8FAFC]/90">
                  {item.quote}
                </blockquote>
                <figcaption className="ds-caption text-muted">
                  <span className="font-semibold text-[#111113] dark:text-white">
                    {item.author}
                  </span>{" "}
                  · {item.location}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
