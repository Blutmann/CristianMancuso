"use client";

import { useEffect, useState } from "react";
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

const VALID_GAMAS = new Set<FabricCategoryId>([
  "urbano",
  "pima",
  "italiano",
  "donna",
]);

const CURATED_IDS = new Set([
  "pima-piura-noche",
  "biella-lino-marfil",
  "urbano-oxford-grafito",
  "donna-cloque-raya-mineral",
]);

function getBadgeStyle(badge: ShirtBadge): string {
  switch (badge) {
    case "EDICIÓN LIMITADA":
      return "bg-[#111113] text-white dark:bg-white dark:text-[#0B0B0E]";
    case "OFERTA":
      return "bg-[#881337] text-white";
    case "DESTACADO":
      return "bg-[#16233B]/90 text-white dark:bg-white/15 dark:border dark:border-white/30 dark:backdrop-blur-md";
    case "NOVEDAD":
    default:
      return "bg-black/10 text-[#111113] backdrop-blur-md dark:bg-white/12 dark:border dark:border-white/20 dark:text-white/90";
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
    <article className="group liquid-glass flex flex-col overflow-hidden rounded-2xl text-[#111113] transition-all duration-300 hover:border-black/20 dark:text-white dark:hover:border-white/28 dark:hover:bg-white/[0.075]">
      {/* Compact Transparent Studio Stage (h-44) */}
      <div className="relative h-44 w-full overflow-hidden bg-transparent">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-4 rounded-full opacity-55 blur-2xl"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.45) 0%, transparent 72%)",
          }}
        />
        <Image
          src={shirt.studioImage}
          alt={`${shirt.name} — ${shirt.composition}`}
          fill
          sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
          className={`object-contain px-3 pt-2 drop-shadow-[0_14px_20px_rgba(17,17,19,0.2)] dark:drop-shadow-[0_14px_22px_rgba(0,0,0,0.55)] ${
            isMotionPaused
              ? ""
              : "transition-transform duration-500 ease-out group-hover:scale-[1.06]"
          }`}
        />

        {/* Floating Ref & Badge */}
        <div className="pointer-events-none absolute inset-x-2.5 top-2.5 z-10 flex items-start justify-between gap-1.5">
          <span className="rounded-full bg-white/85 px-2 py-0.5 font-mono text-[9.5px] text-[#111113]/85 shadow-xs backdrop-blur-md dark:bg-black/55 dark:text-white/85">
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
          <p className="text-[11px] font-medium text-[#111113]/55 dark:text-white/55">
            {shirt.fabricLabel}
          </p>

          <h3 className="mt-0.5 truncate font-display text-base font-bold leading-snug tracking-[-0.02em] text-[#111113] dark:text-white">
            {shirt.name}
          </h3>

          <div className="mt-1.5 flex items-baseline gap-2">
            <span className="text-base font-semibold text-[#111113] tabular-nums dark:text-white">
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
                        ? "bg-[#111113] text-white font-semibold shadow-sm dark:bg-white dark:text-[#07080B]"
                        : "border border-black/12 bg-black/[0.03] text-[#111113]/80 hover:bg-black/[0.08] dark:border-white/12 dark:bg-white/[0.06] dark:text-white/80 dark:hover:bg-white/[0.12] dark:hover:text-white"
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
                ? "bg-[#16233B] text-white dark:bg-white/20 dark:border dark:border-white/35"
                : "bg-[#111113] text-white hover:bg-[#16233B] dark:bg-white dark:text-[#07080B] dark:hover:bg-white/90"
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
            className="cursor-pointer inline-flex min-h-[36px] w-full items-center justify-center gap-1 rounded-full px-2 text-[11px] font-medium whitespace-nowrap text-[#111113]/65 transition-colors hover:bg-black/[0.05] hover:text-[#111113] dark:text-white/65 dark:hover:bg-white/[0.06] dark:hover:text-white"
          >
            <span>¿La querés a medida? Armala sin cargo</span>
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
  const [showAll, setShowAll] = useState(true);

  // Sync ?gama= query param when arriving from Home's 4 Fabric Gamas
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const gama = params.get("gama") as FabricCategoryId | null;
    if (gama && VALID_GAMAS.has(gama)) {
      setSelectedFabric(gama);
    }
  }, [setSelectedFabric]);

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
      className="relative w-full bg-transparent pt-28 pb-16 text-[#111113] dark:text-white"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Compact Header Row */}
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <h1
                id="coleccion-heading"
                className="font-display text-[clamp(1.9rem,3.4vw,2.75rem)] font-bold leading-[1.05] tracking-[-0.03em] text-[#111113] dark:text-white"
              >
                Colección · Listas para enviar
              </h1>
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
                  ? "bg-[#111113] text-white dark:bg-white dark:text-[#0B0B0E]"
                  : "text-[#111113]/70 hover:text-[#111113] dark:text-white/70 dark:hover:text-white"
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
                  ? "bg-[#111113] text-white dark:bg-white dark:text-[#0B0B0E]"
                  : "text-[#111113]/70 hover:text-[#111113] dark:text-white/70 dark:hover:text-white"
              }`}
            >
              USD (Exterior)
            </button>
          </div>
        </div>

        {/* Compact Filter Bar */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
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
                  className={`cursor-pointer relative min-h-[40px] rounded-full px-4 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16233B]/40 dark:focus-visible:ring-white/60 ${
                    isActive
                      ? "text-white font-semibold dark:text-[#0B0B0E]"
                      : "border border-black/10 bg-white/60 text-[#111113]/75 hover:bg-white dark:border-white/10 dark:bg-white/[0.05] dark:text-white/70 dark:hover:bg-white/[0.1] dark:hover:text-white"
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
                      className="absolute inset-0 rounded-full bg-[#111113] dark:bg-white"
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

        {/* 4-Column Compact Grid */}
        {visibleShirts.length === 0 ? (
          <div className="liquid-glass mt-6 rounded-2xl p-8 text-center">
            <p className="text-sm text-muted">No hay telas en esta gama.</p>
            <button
              type="button"
              onClick={() => setSelectedFabric(null)}
              className="cursor-pointer mt-4 min-h-[44px] rounded-full bg-[#111113] px-5 text-xs font-semibold text-white dark:bg-white dark:text-[#0B0B0E]"
            >
              Ver todas
            </button>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {visibleShirts.map((shirt) => (
              <CommercialShirtCard key={shirt.id} shirt={shirt} />
            ))}
          </div>
        )}

        {/* Discreet Toggle when showing all */}
        {!selectedFabric && (
          <div className="mt-7 flex justify-center">
            <button
              id="catalog-toggle-all-btn"
              type="button"
              onClick={() => setShowAll((prev) => !prev)}
              className="cursor-pointer liquid-glass inline-flex min-h-[42px] items-center gap-2 rounded-full px-5 py-2 text-xs font-semibold tracking-[0.04em] text-[#111113] transition-all hover:bg-white dark:text-white dark:hover:bg-white/[0.12]"
            >
              <span>
                {showAll
                  ? "Ver selección destacada (4)"
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
