"use client";

import { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowRight, Check, ChevronDown, ShoppingBag } from "lucide-react";
import {
  ALPHA_SIZES,
  CATALOG_SHIRTS,
  NUMERIC_SIZES,
  type CatalogShirt,
  type CommercialSize,
  type ShirtBadge,
} from "@/data/catalog";
import {
  formatFabricPrice,
  type FabricCategoryId,
} from "@/data/fabrics";
import { useAtelier } from "@/context/AtelierContext";
import { useMotion } from "@/context/MotionContext";

const FILTER_OPTIONS: { id: FabricCategoryId | null; label: string }[] = [
  { id: null, label: "Todas" },
  { id: "urbano", label: "Algodón 100%" },
  { id: "pima", label: "Pima Peruano" },
  { id: "italiano", label: "Italiano" },
  { id: "donna", label: "Donna" },
];

const CURATED_IDS = new Set([
  "pima-piura-noche",
  "biella-lino-marfil",
  "urbano-oxford-grafito",
  "donna-cloque-raya-mineral",
]);

function getBadgeStyle(badge: ShirtBadge): string {
  switch (badge) {
    case "EDICIÓN LIMITADA":
      return "bg-white text-[#0B0B0E]";
    case "OFERTA":
      return "bg-[#881337] text-white";
    case "DESTACADO":
      return "bg-white/15 border border-white/30 text-white backdrop-blur-md";
    case "NOVEDAD":
    default:
      return "bg-white/10 border border-white/20 text-white/90 backdrop-blur-md";
  }
}

function CommercialShirtCard({ shirt }: { shirt: CatalogShirt }) {
  const { currency, addToSelection, openDrawer, goToBuilderWithShirt } =
    useAtelier();
  const { isMotionPaused } = useMotion();

  const sizes = shirt.sizeType === "alpha" ? ALPHA_SIZES : NUMERIC_SIZES;
  const defaultSize: CommercialSize = shirt.sizeType === "alpha" ? "M" : "40";
  const [selectedSize, setSelectedSize] = useState<CommercialSize>(defaultSize);
  const [justAdded, setJustAdded] = useState(false);

  const formattedPrice = formatFabricPrice(shirt.priceArs, currency);
  const formattedCompare = shirt.compareAtArs
    ? formatFabricPrice(shirt.compareAtArs, currency)
    : null;
  const installmentArs = Math.round(shirt.priceArs / 3);

  const handleAddDirect = () => {
    addToSelection(shirt, {
      mode: "commercial",
      commercialSize: selectedSize,
    });
    setJustAdded(true);
    openDrawer();
    window.setTimeout(() => setJustAdded(false), 1800);
  };

  return (
    <article className="group liquid-glass flex flex-col overflow-hidden rounded-2xl text-white transition-all duration-300 hover:border-white/28 hover:bg-white/[0.075]">
      {/* Compact Transparent Studio Stage (h-40 = 160px) */}
      <div className="relative h-40 w-full overflow-hidden bg-transparent">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-4 rounded-full opacity-45 blur-2xl"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.14) 0%, transparent 72%)",
          }}
        />
        <Image
          src={shirt.studioImage}
          alt={`${shirt.name} — ${shirt.composition}`}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className={`object-contain px-3 pt-2 drop-shadow-[0_14px_22px_rgba(0,0,0,0.55)] ${
            isMotionPaused
              ? ""
              : "transition-transform duration-500 ease-out group-hover:scale-[1.06]"
          }`}
        />

        {/* Floating Ref & Badge */}
        <div className="pointer-events-none absolute inset-x-2.5 top-2.5 z-10 flex items-start justify-between gap-1.5">
          <span className="rounded-full bg-black/55 px-2 py-0.5 font-mono text-[9.5px] text-white/85 backdrop-blur-md">
            {shirt.refCode}
          </span>

          {shirt.badge && (
            <span
              className={`rounded-full px-2 py-0.5 text-[9.5px] font-semibold tracking-[0.06em] uppercase ${getBadgeStyle(
                shirt.badge
              )}`}
            >
              {shirt.badge}
            </span>
          )}
        </div>
      </div>

      {/* Compact Card Body (p-4) */}
      <div className="flex flex-1 flex-col justify-between p-4">
        <div>
          <p className="text-[11px] font-medium text-white/55">
            {shirt.fabricLabel}
          </p>

          <h3 className="mt-0.5 truncate font-display text-base font-bold leading-snug tracking-[-0.02em] text-white">
            {shirt.name}
          </h3>

          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-base font-semibold text-white tabular-nums">
              {formattedPrice}
            </span>
            {formattedCompare && (
              <span className="text-[11px] text-muted line-through tabular-nums">
                {formattedCompare}
              </span>
            )}
          </div>

          <p className="mt-0.5 truncate text-[11px] text-muted">
            {currency === "ARS"
              ? `3 cuotas s/i de ARS $${installmentArs.toLocaleString("es-AR")}`
              : "3 cuotas sin interés en ARS"}
          </p>

          {/* Commercial Size Selector — 1 Single Row */}
          <div className="mt-3">
            <div
              className={`grid gap-1 ${
                shirt.sizeType === "alpha" ? "grid-cols-4" : "grid-cols-5"
              }`}
            >
              {sizes.map((size) => {
                const active = selectedSize === size;
                return (
                  <button
                    key={size}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setSelectedSize(size)}
                    className={`cursor-pointer flex min-h-[38px] w-full items-center justify-center rounded-lg text-[11px] font-medium transition-all ${
                      active
                        ? "bg-white text-[#07080B] font-semibold shadow-sm"
                        : "bg-white/[0.06] text-white/80 border border-white/12 hover:bg-white/[0.12] hover:text-white"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Primary CTA + Compact Bespoke Link */}
        <div className="mt-3.5 space-y-1.5">
          <button
            id={`add-cart-btn-${shirt.id}`}
            type="button"
            onClick={handleAddDirect}
            className={`cursor-pointer flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full px-4 text-[11px] font-semibold tracking-[0.04em] uppercase transition-all ${
              justAdded
                ? "bg-white/20 text-white border border-white/35"
                : "bg-white text-[#07080B] hover:bg-white/90"
            }`}
          >
            {justAdded ? (
              <>
                <Check className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Agregada</span>
              </>
            ) : (
              <>
                <ShoppingBag className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Agregar al carrito</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => goToBuilderWithShirt(shirt.id)}
            className="cursor-pointer inline-flex min-h-[36px] w-full items-center justify-center gap-1 rounded-full px-2 text-[11px] font-medium whitespace-nowrap text-white/65 transition-colors hover:bg-white/[0.06] hover:text-white"
          >
            <span>¿A medida? Armala sin cargo</span>
            <ArrowRight className="h-3 w-3 shrink-0" aria-hidden="true" />
          </button>
        </div>
      </div>
    </article>
  );
}

export function CatalogSection() {
  const { currency, setCurrency, selectedFabric, setSelectedFabric } =
    useAtelier();
  const { isMotionPaused } = useMotion();
  const [showAll, setShowAll] = useState(false);

  const categoryFiltered = selectedFabric
    ? CATALOG_SHIRTS.filter((s) => s.fabricId === selectedFabric)
    : CATALOG_SHIRTS;

  const visibleShirts =
    !selectedFabric && !showAll
      ? categoryFiltered.filter((s) => CURATED_IDS.has(s.id))
      : categoryFiltered;

  return (
    <section
      id="coleccion"
      aria-labelledby="coleccion-heading"
      className="relative w-full scroll-mt-20 bg-transparent py-10 text-white lg:py-12"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 xl:pr-24">
        {/* Compact Header Row */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <h2
                id="coleccion-heading"
                className="font-display text-[clamp(1.75rem,3vw,2.5rem)] font-bold leading-[1.05] tracking-[-0.03em] text-white"
              >
                Listas para enviar
              </h2>
              <p className="text-sm text-muted">
                Elegí tu talle comercial o pedila a medida sin cargo.
              </p>
            </div>
          </div>

          {/* Liquid Glass ARS / USD Toggle */}
          <div
            role="radiogroup"
            aria-label="Moneda"
            className="liquid-glass inline-flex self-start items-center rounded-full p-1 lg:self-end"
          >
            <button
              type="button"
              role="radio"
              aria-checked={currency === "ARS"}
              onClick={() => setCurrency("ARS")}
              className={`cursor-pointer min-h-[38px] rounded-full px-3.5 text-xs font-semibold transition-colors ${
                currency === "ARS"
                  ? "bg-white text-[#0B0B0E]"
                  : "text-white/70 hover:text-white"
              }`}
            >
              ARS
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={currency === "USD"}
              onClick={() => setCurrency("USD")}
              className={`cursor-pointer min-h-[38px] rounded-full px-3.5 text-xs font-semibold transition-colors ${
                currency === "USD"
                  ? "bg-white text-[#0B0B0E]"
                  : "text-white/70 hover:text-white"
              }`}
            >
              USD (Exterior)
            </button>
          </div>
        </div>

        {/* Compact Filter Bar */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div
            role="tablist"
            aria-label="Filtrar por gama de tela"
            className="flex flex-wrap items-center gap-1.5"
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
                  className={`cursor-pointer relative min-h-[38px] rounded-full px-3.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 ${
                    isActive
                      ? "text-[#0B0B0E] font-semibold"
                      : "bg-white/[0.05] text-white/70 border border-white/10 hover:bg-white/[0.1] hover:text-white"
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
                      className="absolute inset-0 rounded-full bg-white"
                    />
                  )}
                  <span className="relative z-10">{option.label}</span>
                </button>
              );
            })}
          </div>

          <span className="text-xs text-muted tabular-nums">
            Mostrando {visibleShirts.length} de {categoryFiltered.length}
          </span>
        </div>

        {/* 4-Column Compact Grid (fits 100% in 1 desktop viewport) */}
        {visibleShirts.length === 0 ? (
          <div className="liquid-glass mt-6 rounded-2xl p-8 text-center">
            <p className="text-sm text-muted">No hay telas en esta gama.</p>
            <button
              type="button"
              onClick={() => setSelectedFabric(null)}
              className="cursor-pointer mt-4 min-h-[44px] rounded-full bg-white px-5 text-xs font-semibold text-[#0B0B0E]"
            >
              Ver todas
            </button>
          </div>
        ) : (
          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {visibleShirts.map((shirt) => (
              <CommercialShirtCard key={shirt.id} shirt={shirt} />
            ))}
          </div>
        )}

        {/* Discreet Liquid Glass Expand Toggle */}
        {!selectedFabric && (
          <div className="mt-5 flex justify-center">
            <button
              id="catalog-toggle-all-btn"
              type="button"
              onClick={() => setShowAll((prev) => !prev)}
              className="cursor-pointer liquid-glass inline-flex min-h-[40px] items-center gap-2 rounded-full px-5 py-2 text-xs font-semibold tracking-[0.04em] text-white transition-all hover:bg-white/[0.12]"
            >
              <span>
                {showAll
                  ? "Mostrar selección curada (4)"
                  : `Ver las ${CATALOG_SHIRTS.length} telas`}
              </span>
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  showAll ? "rotate-180" : ""
                }`}
                aria-hidden="true"
              />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
