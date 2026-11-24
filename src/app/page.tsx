import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Check, Ruler, Scissors, Sparkles } from "lucide-react";
import { FABRIC_RANGES, type FabricCategoryId } from "@/data/fabrics";
import { Hero } from "@/components/Hero";
import { TailorTapeProgress } from "@/components/TailorTapeProgress";
import { Footer } from "@/components/Footer";

const GAMA_PREVIEW_IMAGE: Record<FabricCategoryId, string> = {
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

export default function Home() {
  return (
    <div className="relative">
      <TailorTapeProgress />

      {/* BLOQUE 1: Hero Editorial */}
      <Hero />

      {/* BLOQUE 2: Las 4 Gamas de Telas */}
      <section
        id="gamas"
        aria-labelledby="gamas-heading"
        className="relative py-16 lg:py-24"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 xl:pr-24">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-medium tracking-[0.2em] text-muted uppercase">
                Nuestros Géneros
              </p>
              <h2
                id="gamas-heading"
                className="mt-2 font-display text-[clamp(1.9rem,3.6vw,2.9rem)] font-bold leading-[1.05] tracking-[-0.03em] text-[#111113] dark:text-white"
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

          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {FABRIC_RANGES.map((gama) => (
              <Link
                key={gama.id}
                href={`/coleccion?gama=${gama.id}`}
                className="group liquid-glass flex flex-col justify-between overflow-hidden rounded-3xl p-5 transition-all duration-300 hover:-translate-y-1 hover:border-black/20 dark:hover:border-white/30"
              >
                <div>
                  <div className="relative h-44 w-full">
                    <Image
                      src={GAMA_PREVIEW_IMAGE[gama.id]}
                      alt={gama.name}
                      fill
                      sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                      className="object-contain drop-shadow-[0_14px_20px_rgba(17,17,19,0.2)] transition-transform duration-500 ease-out group-hover:scale-[1.06] dark:drop-shadow-[0_16px_24px_rgba(0,0,0,0.55)]"
                    />
                  </div>

                  <p className="mt-4 text-[11px] font-medium text-muted">
                    {gama.origin}
                  </p>
                  <h3 className="mt-1 font-display text-lg font-bold tracking-[-0.02em] text-[#111113] dark:text-white">
                    {gama.name}
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-muted">
                    {gama.description}
                  </p>
                </div>

                <div className="mt-5 border-t border-black/8 pt-4 dark:border-white/10">
                  <div className="flex items-baseline justify-between gap-2">
                    <span className="text-xs text-muted">Desde</span>
                    <span className="font-mono text-sm font-semibold text-[#111113] tabular-nums dark:text-white">
                      ARS ${gama.priceArs.toLocaleString("es-AR")}
                    </span>
                  </div>
                  <div className="mt-2.5 flex items-center justify-between text-[11px] font-medium text-[#16233B] dark:text-champagne">
                    <span className="inline-flex items-center gap-1">
                      <Check className="h-3.5 w-3.5" aria-hidden="true" />A
                      medida sin cargo
                    </span>
                    <ArrowRight
                      className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1"
                      aria-hidden="true"
                    />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* BLOQUE 3: Invitación A Medida */}
      <section
        id="invitacion-medida"
        aria-labelledby="invitacion-heading"
        className="relative py-16 lg:py-24"
      >
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 xl:pr-24">
          <div className="liquid-glass rounded-3xl p-7 sm:p-10 lg:p-12">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-xl">
                <p className="text-xs font-medium tracking-[0.2em] text-muted uppercase">
                  Atelier A Medida
                </p>
                <h2
                  id="invitacion-heading"
                  className="mt-2 font-display text-[clamp(1.85rem,3.4vw,2.75rem)] font-bold leading-[1.06] tracking-[-0.03em] text-[#111113] dark:text-white"
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

            <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
              {BESPOKE_STEPS.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.num}
                    className="rounded-2xl border border-black/8 bg-white/55 p-5 dark:border-white/10 dark:bg-white/[0.04]"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-semibold text-muted">
                        {item.num}
                      </span>
                      <Icon
                        className="h-4 w-4 text-[#16233B] dark:text-champagne"
                        aria-hidden="true"
                      />
                    </div>
                    <h3 className="mt-4 font-display text-base font-bold text-[#111113] dark:text-white">
                      {item.title}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-muted">
                      {item.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
