"use client";

import { motion } from "framer-motion";
import { SlidersHorizontal, Sparkles } from "lucide-react";
import { CATALOG_SHIRTS, type ShirtBadge } from "@/data/catalog";
import {
  formatFabricPrice,
  type FabricCategoryId,
} from "@/data/fabrics";
import { useAtelier } from "@/context/AtelierContext";
import { useMotion } from "@/context/MotionContext";
import { ShirtArtwork } from "@/components/ShirtArtwork";

const FILTER_OPTIONS: { id: FabricCategoryId | null; label: string }[] = [
  { id: null, label: "Todas" },
  { id: "urbano", label: "Algodón Urbano" },
  { id: "pima", label: "Algodón Peruano" },
  { id: "italiano", label: "Algodón & Lino Italiano" },
  { id: "donna", label: "Mancuso Donna" },
];

function getBadgeStyle(badge: ShirtBadge): string {
  switch (badge) {
    case "DESTACADO":
      return "border-champagne/45 bg-obsidian/85 text-champagne";
    case "EDICIÓN LIMITADA":
      return "border-cyan/45 bg-obsidian/85 text-cyan";
    case "OFERTA":
      return "border-emerald-400/40 bg-obsidian/85 text-emerald-300";
    case "NOVEDAD":
    default:
      return "border-white/20 bg-obsidian/85 text-primary";
  }
}

export function CatalogSection() {
  const {
    currency,
    setCurrency,
    selectedFabric,
    setSelectedFabric,
    openCustomizer,
  } = useAtelier();
  const { isMotionPaused } = useMotion();

  const filteredShirts = selectedFabric
    ? CATALOG_SHIRTS.filter((s) => s.fabricId === selectedFabric)
    : CATALOG_SHIRTS;

  return (
    <section
      id="coleccion"
      aria-labelledby="coleccion-heading"
      className="relative w-full border-t border-white/[0.08] bg-obsidian text-primary py-20 sm:py-24 lg:py-28"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 atelier-grain opacity-70" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* Header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-3.5 flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-[1px] w-8 bg-champagne/80"
              />
              <span className="font-mono text-[11px] tracking-[0.24em] text-champagne uppercase">
                COLECCIÓN ATELIER · TEMPORADA
              </span>
            </div>

            <h2
              id="coleccion-heading"
              className="font-display text-[clamp(2rem,4.4vw,3.4rem)] font-bold leading-[1.03] tracking-[-0.035em] text-primary"
            >
              Camisas de autor, confeccionadas a tu medida.
            </h2>

            <p className="mt-4 max-w-xl text-base leading-relaxed text-muted">
              Elegí tu género favorito y personalizá calce, cuello, puños e
              iniciales bordadas en vivo antes de enviar tu selección al taller.
            </p>
          </div>

          {/* Inline Currency Mirror */}
          <div
            role="radiogroup"
            aria-label="Moneda de catálogo"
            className="inline-flex self-start lg:self-end items-center rounded-full border border-white/[0.1] bg-elevated p-1"
          >
            <button
              type="button"
              role="radio"
              aria-checked={currency === "ARS"}
              onClick={() => setCurrency("ARS")}
              className={`cursor-pointer rounded-full px-3.5 py-1.5 font-mono text-[10px] tracking-[0.16em] uppercase transition-colors ${
                currency === "ARS"
                  ? "bg-ivory text-obsidian font-medium"
                  : "text-muted hover:text-primary"
              }`}
            >
              ARS
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={currency === "USD"}
              onClick={() => setCurrency("USD")}
              className={`cursor-pointer rounded-full px-3.5 py-1.5 font-mono text-[10px] tracking-[0.16em] uppercase transition-colors ${
                currency === "USD"
                  ? "bg-ivory text-obsidian font-medium"
                  : "text-muted hover:text-primary"
              }`}
            >
              USD (Exterior)
            </button>
          </div>
        </div>

        {/* Animated Category Filter Pills (synced with FabricComparator) */}
        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-y border-white/[0.08] py-4">
          <div
            role="tablist"
            aria-label="Filtrar camisas por gama de tela"
            className="flex flex-wrap items-center gap-2"
          >
            {FILTER_OPTIONS.map((option) => {
              const isActive = selectedFabric === option.id;
              return (
                <button
                  key={option.label}
                  id={`catalog-filter-${option.id ?? "all"}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setSelectedFabric(option.id)}
                  className={`cursor-pointer relative rounded-full px-4 py-2 font-mono text-[11px] tracking-[0.12em] uppercase transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-champagne ${
                    isActive
                      ? "text-obsidian font-medium"
                      : "text-muted hover:text-primary"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId={
                        isMotionPaused ? undefined : "catalog-filter-pill"
                      }
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 32,
                      }}
                      className="absolute inset-0 rounded-full bg-ivory"
                    />
                  )}
                  <span className="relative z-10">{option.label}</span>
                </button>
              );
            })}
          </div>

          <span className="font-mono text-[11px] tracking-[0.16em] text-muted uppercase tabular-nums">
            {filteredShirts.length}{" "}
            {filteredShirts.length === 1 ? "modelo" : "modelos"}
          </span>
        </div>

        {/* Catalog Grid */}
        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredShirts.map((shirt) => {
            const formattedPrice = formatFabricPrice(shirt.priceArs, currency);
            const formattedCompare = shirt.compareAtArs
              ? formatFabricPrice(shirt.compareAtArs, currency)
              : null;
            const installmentArs = Math.round(shirt.priceArs / 3);

            return (
              <article
                key={shirt.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/[0.08] bg-elevated transition-all duration-300 hover:border-[#C2A36B]/55 hover:shadow-[0_24px_60px_rgba(0,0,0,0.65)]"
              >
                {/* Visual Stage */}
                <div className="relative aspect-[4/4.2] w-full overflow-hidden border-b border-white/[0.07]">
                  <div
                    className={`h-full w-full ${
                      isMotionPaused
                        ? ""
                        : "transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                    }`}
                  >
                    <ShirtArtwork shirt={shirt} uidPrefix="catalog" />
                  </div>

                  {/* Top Badges & Ref. Art. */}
                  <div className="pointer-events-none absolute inset-x-4 top-4 flex items-start justify-between gap-2">
                    <span className="rounded-full border border-white/[0.12] bg-obsidian/80 px-2.5 py-1 font-mono text-[10px] tracking-[0.14em] text-primary/90 uppercase backdrop-blur-md">
                      {shirt.refCode}
                    </span>

                    {shirt.badge && (
                      <span
                        className={`rounded-full border px-2.5 py-1 font-mono text-[9.5px] font-medium tracking-[0.16em] uppercase backdrop-blur-md ${getBadgeStyle(
                          shirt.badge
                        )}`}
                      >
                        {shirt.badge}
                      </span>
                    )}
                  </div>

                  {/* Bottom Hover Telemetry Accent */}
                  <div className="pointer-events-none absolute inset-x-4 bottom-3 flex items-center justify-between">
                    <span className="rounded-full border border-champagne/35 bg-obsidian/85 px-2.5 py-1 font-mono text-[9.5px] tracking-[0.14em] text-champagne uppercase backdrop-blur-md">
                      ✓ A medida sin cargo
                    </span>
                  </div>
                </div>

                {/* Card Body */}
                <div className="flex flex-1 flex-col justify-between p-5 sm:p-6">
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.18em] text-cyan/90 uppercase">
                      {shirt.fabricLabel}
                    </p>

                    <h3 className="mt-1.5 font-display text-xl font-bold leading-snug tracking-[-0.02em] text-primary">
                      {shirt.name}
                    </h3>

                    <p className="mt-1 text-xs text-muted">
                      {shirt.composition}
                    </p>
                  </div>

                  {/* Pricing + CTA */}
                  <div className="mt-6 border-t border-white/[0.08] pt-4">
                    <div className="flex items-baseline gap-2.5">
                      <span className="font-mono text-lg font-medium tracking-[-0.02em] text-primary tabular-nums">
                        {formattedPrice}
                      </span>
                      {formattedCompare && (
                        <span className="font-mono text-xs text-muted line-through tabular-nums">
                          {formattedCompare}
                        </span>
                      )}
                    </div>

                    <p className="mt-1 font-mono text-[10px] tracking-[0.12em] text-champagne/90 uppercase">
                      {currency === "ARS"
                        ? `3 cuotas sin interés de ARS $${installmentArs.toLocaleString("es-AR")}`
                        : "3 cuotas sin interés disponibles en ARS"}
                    </p>

                    <button
                      id={`customize-btn-${shirt.id}`}
                      type="button"
                      onClick={() => openCustomizer(shirt)}
                      className="cursor-pointer mt-5 flex w-full items-center justify-center gap-2 rounded-full border border-champagne/40 bg-champagne/[0.1] px-5 py-3 text-xs font-semibold tracking-[0.08em] text-primary uppercase transition-all duration-200 hover:border-champagne hover:bg-champagne hover:text-obsidian focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
                    >
                      <SlidersHorizontal
                        className="h-3.5 w-3.5"
                        aria-hidden="true"
                      />
                      <span>Personalizar y Pedir</span>
                      <Sparkles
                        className="h-3.5 w-3.5 opacity-80"
                        aria-hidden="true"
                      />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
