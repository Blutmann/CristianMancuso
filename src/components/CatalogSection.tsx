"use client";

import { useState } from "react";
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
import { ShirtArtwork } from "@/components/ShirtArtwork";

const FILTER_OPTIONS: { id: FabricCategoryId | null; label: string }[] = [
  { id: null, label: "Todas" },
  { id: "urbano", label: "Algodón 100%" },
  { id: "pima", label: "Algodón Pima Peruano" },
  { id: "italiano", label: "Algodón Italiano" },
  { id: "donna", label: "Mancuso Donna" },
];

/** 4 telas curadas principales (1 por gama) por defecto */
const CURATED_IDS = new Set([
  "pima-piura-noche",
  "biella-lino-marfil",
  "urbano-oxford-grafito",
  "donna-cloque-raya-mineral",
]);

function getBadgeStyle(badge: ShirtBadge): string {
  switch (badge) {
    case "DESTACADO":
      return "bg-[#09090B] text-stitch";
    case "EDICIÓN LIMITADA":
      return "bg-[#09090B] text-white";
    case "OFERTA":
      return "bg-stitch text-[#09090B]";
    case "NOVEDAD":
    default:
      return "bg-white/95 text-[#09090B] border border-[#E4E4E7]";
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
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-[#E4E4E7] bg-white text-[#09090B] transition-all duration-300 hover:border-[#09090B]/40 hover:shadow-[0_20px_50px_rgba(9,9,11,0.08)]">
      {/* Visual Stage */}
      <div className="relative aspect-[4/4.05] w-full overflow-hidden border-b border-[#E4E4E7] bg-[#F4F4F5]">
        <div
          className={`h-full w-full ${
            isMotionPaused
              ? ""
              : "transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          }`}
        >
          <ShirtArtwork shirt={shirt} uidPrefix="catalog" />
        </div>

        {/* Minimal Top Tags */}
        <div className="pointer-events-none absolute inset-x-3.5 top-3.5 flex items-start justify-between gap-2">
          <span className="rounded-full bg-[#09090B]/88 px-2.5 py-1 font-mono text-[10px] text-white backdrop-blur-sm">
            {shirt.refCode}
          </span>

          {shirt.badge && (
            <span
              className={`rounded-full px-2.5 py-1 text-[10px] font-semibold tracking-[0.08em] uppercase ${getBadgeStyle(
                shirt.badge
              )}`}
            >
              {shirt.badge}
            </span>
          )}
        </div>
      </div>

      {/* Card Body */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <p className="text-xs font-medium text-[#71717A]">
            {shirt.fabricLabel}
          </p>

          <h3 className="mt-1 font-display text-lg font-bold leading-snug tracking-[-0.02em] text-[#09090B]">
            {shirt.name}
          </h3>

          <div className="mt-2.5 flex items-baseline gap-2">
            <span className="text-lg font-semibold text-[#09090B] tabular-nums">
              {formattedPrice}
            </span>
            {formattedCompare && (
              <span className="text-xs text-[#71717A] line-through tabular-nums">
                {formattedCompare}
              </span>
            )}
          </div>

          <p className="mt-0.5 text-xs text-[#71717A]">
            {currency === "ARS"
              ? `3 cuotas sin interés de ARS $${installmentArs.toLocaleString("es-AR")}`
              : "3 cuotas sin interés en ARS"}
          </p>

          {/* Direct Commercial Size Selector — STRICTLY 1 SINGLE ROW */}
          <div className="mt-4">
            <span className="block text-[11px] font-medium text-[#52525B]">
              Talle comercial
            </span>
            <div
              className={`mt-2 grid gap-1.5 ${
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
                    className={`cursor-pointer flex min-h-[44px] w-full items-center justify-center rounded-xl border text-xs font-medium transition-all ${
                      active
                        ? "border-[#09090B] bg-[#09090B] text-white"
                        : "border-[#E4E4E7] bg-[#F4F4F5] text-[#09090B] hover:border-[#09090B]/50"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Actions: Direct Cart Add + Bespoke Shortcut */}
        <div className="mt-5 space-y-2 border-t border-[#E4E4E7] pt-4">
          <button
            id={`add-cart-btn-${shirt.id}`}
            type="button"
            onClick={handleAddDirect}
            className={`cursor-pointer flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full px-5 py-2.5 text-xs font-semibold tracking-[0.04em] uppercase transition-all ${
              justAdded
                ? "bg-stitch text-[#09090B]"
                : "bg-[#09090B] text-white hover:bg-[#27272A]"
            }`}
          >
            {justAdded ? (
              <>
                <Check className="h-4 w-4" aria-hidden="true" />
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
            className="cursor-pointer inline-flex min-h-[44px] w-full items-center justify-center gap-1.5 rounded-full px-3 text-xs font-medium text-[#52525B] transition-colors hover:bg-[#F4F4F5] hover:text-[#09090B]"
          >
            <span>¿La querés a medida? Armala sin cargo</span>
            <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
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
      className="relative w-full scroll-mt-24 bg-white text-[#09090B] py-20 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* Header */}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-xl">
            <h2
              id="coleccion-heading"
              className="font-display text-[clamp(2rem,4.2vw,3.3rem)] font-bold leading-[1.03] tracking-[-0.035em] text-[#09090B]"
            >
              Listas para enviar
            </h2>
            <p className="mt-3 text-base text-[#52525B]">
              Elegí tu talle comercial o pedila a medida sin cargo.
            </p>
          </div>

          {/* ARS / USD Toggle */}
          <div
            role="radiogroup"
            aria-label="Moneda"
            className="inline-flex self-start lg:self-end items-center rounded-full border border-[#E4E4E7] bg-[#F4F4F5] p-1"
          >
            <button
              type="button"
              role="radio"
              aria-checked={currency === "ARS"}
              onClick={() => setCurrency("ARS")}
              className={`cursor-pointer min-h-[44px] rounded-full px-4 text-xs font-semibold transition-colors ${
                currency === "ARS"
                  ? "bg-[#09090B] text-white"
                  : "text-[#52525B] hover:text-[#09090B]"
              }`}
            >
              ARS
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={currency === "USD"}
              onClick={() => setCurrency("USD")}
              className={`cursor-pointer min-h-[44px] rounded-full px-4 text-xs font-semibold transition-colors ${
                currency === "USD"
                  ? "bg-[#09090B] text-white"
                  : "text-[#52525B] hover:text-[#09090B]"
              }`}
            >
              USD (Exterior)
            </button>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-y border-[#E4E4E7] py-3.5">
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
                  className={`cursor-pointer relative min-h-[44px] rounded-full px-4 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#09090B] ${
                    isActive
                      ? "text-white"
                      : "text-[#52525B] hover:text-[#09090B]"
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
                      className="absolute inset-0 rounded-full bg-[#09090B]"
                    />
                  )}
                  <span className="relative z-10">{option.label}</span>
                </button>
              );
            })}
          </div>

          <span className="text-xs text-[#71717A] tabular-nums">
            Mostrando {visibleShirts.length} de {categoryFiltered.length}
          </span>
        </div>

        {/* Curated Grid */}
        {visibleShirts.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-[#E4E4E7] bg-[#F4F4F5] p-10 text-center">
            <p className="text-sm text-[#52525B]">
              No hay telas en esta gama.
            </p>
            <button
              type="button"
              onClick={() => setSelectedFabric(null)}
              className="cursor-pointer mt-4 min-h-[44px] rounded-full bg-[#09090B] px-5 text-xs font-semibold text-white"
            >
              Ver todas
            </button>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {visibleShirts.map((shirt) => (
              <CommercialShirtCard key={shirt.id} shirt={shirt} />
            ))}
          </div>
        )}

        {/* Discreet Expand Toggle for All 7 Fabrics */}
        {!selectedFabric && (
          <div className="mt-10 flex justify-center">
            <button
              id="catalog-toggle-all-btn"
              type="button"
              onClick={() => setShowAll((prev) => !prev)}
              className="cursor-pointer inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[#E4E4E7] bg-[#F4F4F5] px-6 py-2.5 text-xs font-semibold tracking-[0.04em] text-[#09090B] transition-colors hover:border-[#09090B] hover:bg-[#09090B] hover:text-white"
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
