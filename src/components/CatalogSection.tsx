"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  Grid2x2,
  Grid3x3,
  Search,
  Shirt,
  ShoppingBag,
  SwatchBook,
  X,
} from "lucide-react";
import {
  ALPHA_SIZES,
  CATALOG_SHIRTS,
  NUMERIC_SIZES,
  type CatalogShirt,
  type CommercialSize,
  type ShirtBadge,
} from "@/data/catalog";
import type { FabricCategoryId } from "@/data/fabrics";
import { useAtelier } from "@/context/AtelierContext";
import { useMotion } from "@/context/MotionContext";
import { TailorFabricSwatch } from "@/components/TailorFabricSwatch";

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

type GridCols = 3 | 4;
type VisualMode = "camisa" | "tela";

function formatArsClean(amount: number): string {
  return `$${amount.toLocaleString("es-AR")}`;
}

function getDiscreetBadge(badge?: ShirtBadge): {
  label: string;
  className: string;
} | null {
  if (badge === "OFERTA") {
    return {
      label: "OFERTA",
      className: "bg-[#881337] text-white",
    };
  }
  if (badge === "DESTACADO") {
    return {
      label: "DESTACADO",
      className:
        "bg-[#16233B]/90 text-white dark:bg-white/15 dark:border dark:border-white/25 dark:backdrop-blur-md",
    };
  }
  return null;
}

function MinimalShirtCard({
  shirt,
  visualMode,
  isWide,
}: {
  shirt: CatalogShirt;
  visualMode: VisualMode;
  isWide: boolean;
}) {
  const { addToSelection, openDrawer } = useAtelier();
  const { isMotionPaused } = useMotion();
  const [pickingSize, setPickingSize] = useState(false);
  const [justAdded, setJustAdded] = useState(false);

  const badge = getDiscreetBadge(shirt.badge);
  const sizes = shirt.sizeType === "alpha" ? ALPHA_SIZES : NUMERIC_SIZES;

  const handleQuickSelectSize = (size: CommercialSize) => {
    addToSelection(shirt, {
      mode: "commercial",
      commercialSize: size,
    });
    setPickingSize(false);
    setJustAdded(true);
    openDrawer();
    window.setTimeout(() => setJustAdded(false), 1600);
  };

  return (
    <article className="group liquid-glass flex flex-col overflow-hidden rounded-2xl text-[#111113] transition-all duration-300 hover:-translate-y-0.5 hover:border-black/20 dark:text-white dark:hover:border-white/28">
      {/* Clickable Product Link Area */}
      <Link href={`/coleccion/${shirt.id}`} className="flex flex-1 flex-col">
        {/* Visual Area: Floating Shirt OR Tailor Pinked Swatch */}
        <div
          className={`relative w-full overflow-hidden ${
            visualMode === "tela"
              ? "aspect-square"
              : isWide
                ? "aspect-[4/4.2]"
                : "aspect-[4/4.4]"
          }`}
        >
          {visualMode === "camisa" ? (
            <div className="relative flex h-full w-full items-center justify-center p-5 pb-6">
              <div className="relative h-full w-full">
                <Image
                  src={shirt.studioImage}
                  alt={shirt.name}
                  fill
                  sizes={
                    isWide
                      ? "(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      : "(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
                  }
                  className={`object-contain drop-shadow-[0_14px_20px_rgba(17,17,19,0.2)] dark:drop-shadow-[0_16px_24px_rgba(0,0,0,0.55)] ${
                    isMotionPaused
                      ? ""
                      : "transition-transform duration-500 ease-out group-hover:-translate-y-1 group-hover:scale-[1.04]"
                  }`}
                />
              </div>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-3 left-1/2 h-2.5 w-24 -translate-x-1/2 rounded-full bg-[#111113] opacity-15 blur-md dark:bg-black dark:opacity-50"
              />
            </div>
          ) : (
            <TailorFabricSwatch shirt={shirt} compact />
          )}

          {badge && (
            <span
              className={`pointer-events-none absolute right-3 top-3 z-10 rounded-full px-2.5 py-0.5 text-[9.5px] font-semibold tracking-[0.08em] uppercase ${badge.className}`}
            >
              {badge.label}
            </span>
          )}
        </div>

        {/* Clean Metadata: Name + Ref. Art. + Price */}
        <div className="flex flex-1 flex-col justify-between gap-1.5 px-4 pt-3 pb-2">
          <div>
            <h2 className="ds-h3 truncate text-sm sm:text-[15px]">
              {shirt.name}
            </h2>
            <p className="ds-mono mt-0.5 text-[10.5px] text-muted">
              {shirt.refCode}
            </p>
          </div>

          <div className="flex items-baseline gap-2 pt-0.5">
            <span className="font-sans text-sm font-semibold text-[#111113] tabular-nums dark:text-white">
              {formatArsClean(shirt.priceArs)}
            </span>
            {shirt.compareAtArs && (
              <span className="font-sans text-[11px] text-muted line-through tabular-nums">
                {formatArsClean(shirt.compareAtArs)}
              </span>
            )}
          </div>
        </div>
      </Link>

      {/* Quick-Add Button -> Transforms In-Place into 1-Row Commercial Size Picker */}
      <div className="px-4 pt-1.5 pb-4">
        <AnimatePresence mode="wait" initial={false}>
          {pickingSize ? (
            <motion.div
              key="quick-sizes"
              initial={isMotionPaused ? false : { opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={isMotionPaused ? undefined : { opacity: 0, y: -4 }}
              transition={{ duration: 0.16 }}
              onMouseLeave={() => setPickingSize(false)}
              className={`grid gap-1 ${
                shirt.sizeType === "alpha" ? "grid-cols-4" : "grid-cols-5"
              }`}
            >
              {sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => handleQuickSelectSize(size)}
                  aria-label={`Agregar ${shirt.name} talle ${size}`}
                  className="cursor-pointer flex min-h-[40px] w-full items-center justify-center rounded-full border border-black/12 bg-white/85 text-[11px] font-semibold text-[#111113] transition-colors hover:bg-[#16233B] hover:text-white dark:border-white/16 dark:bg-white/[0.08] dark:text-white dark:hover:bg-white dark:hover:text-[#0B0B0E]"
                >
                  {size}
                </button>
              ))}
            </motion.div>
          ) : (
            <motion.button
              key="quick-add-btn"
              initial={isMotionPaused ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={isMotionPaused ? undefined : { opacity: 0 }}
              transition={{ duration: 0.14 }}
              type="button"
              onClick={() => setPickingSize(true)}
              className={`cursor-pointer flex min-h-[40px] w-full items-center justify-center gap-1.5 rounded-full text-[11px] font-semibold tracking-[0.04em] uppercase transition-colors ${
                justAdded
                  ? "bg-[#16233B] text-white dark:bg-white/20 dark:text-white"
                  : "border border-black/14 bg-white/75 text-[#111113] hover:bg-[#16233B] hover:text-white dark:border-white/16 dark:bg-white/[0.07] dark:text-white dark:hover:bg-white dark:hover:text-[#0B0B0E]"
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
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </article>
  );
}

type SortOrder = "featured" | "price-asc" | "price-desc";

const SORT_OPTIONS: { id: SortOrder; label: string }[] = [
  { id: "featured", label: "Destacados" },
  { id: "price-asc", label: "Menor precio" },
  { id: "price-desc", label: "Mayor precio" },
];

function normalizeSearch(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

export function CatalogSection() {
  const { selectedFabric, setSelectedFabric } = useAtelier();
  const { isMotionPaused } = useMotion();
  const [gridCols, setGridCols] = useState<GridCols>(4);
  const [visualMode, setVisualMode] = useState<VisualMode>("camisa");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<SortOrder>("featured");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const gama = params.get("gama") as FabricCategoryId | null;
    if (gama && VALID_GAMAS.has(gama)) {
      setSelectedFabric(gama);
    }
  }, [setSelectedFabric]);

  const visibleShirts = useMemo(() => {
    const query = normalizeSearch(searchQuery.trim());
    const filtered = CATALOG_SHIRTS.filter((s) => {
      if (selectedFabric && s.fabricId !== selectedFabric) return false;
      if (!query) return true;
      const haystack = normalizeSearch(
        `${s.name} ${s.refCode} ${s.fabricLabel}`
      );
      return haystack.includes(query);
    });

    if (sortOrder === "price-asc") {
      return [...filtered].sort((a, b) => a.priceArs - b.priceArs);
    }
    if (sortOrder === "price-desc") {
      return [...filtered].sort((a, b) => b.priceArs - a.priceArs);
    }
    return filtered;
  }, [selectedFabric, searchQuery, sortOrder]);

  return (
    <section
      id="coleccion"
      aria-labelledby="coleccion-heading"
      className="relative w-full bg-transparent pt-24 pb-16 text-[#111113] sm:pt-28 dark:text-white"
    >
      <div className="mx-auto w-full max-w-[1360px] px-5 sm:px-8 lg:px-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <h1 id="coleccion-heading" className="ds-h1-page">
            Colección
          </h1>

          {/* Quick Search + Sort Row */}
          <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
            <div className="liquid-glass relative flex min-h-[44px] w-full items-center rounded-full px-4 sm:w-80">
              <Search
                className="h-4 w-4 shrink-0 text-muted"
                aria-hidden="true"
              />
              <input
                id="catalog-search-input"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por tela o Ref. Art. (ej. 2529)..."
                aria-label="Buscar por tela o referencia de artículo"
                className="w-full bg-transparent px-2.5 text-xs text-[#111113] placeholder:text-muted/75 focus:outline-none dark:text-[#F8FAFC]"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  aria-label="Limpiar búsqueda"
                  className="cursor-pointer inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-black/[0.06] hover:text-[#111113] dark:hover:bg-white/10 dark:hover:text-white"
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              )}
            </div>

            <div
              role="radiogroup"
              aria-label="Ordenar colección"
              className="liquid-glass inline-flex items-center self-start rounded-full p-1 sm:self-auto"
            >
              {SORT_OPTIONS.map((opt) => {
                const active = sortOrder === opt.id;
                return (
                  <button
                    key={opt.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setSortOrder(opt.id)}
                    className={`cursor-pointer inline-flex min-h-[36px] items-center whitespace-nowrap rounded-full px-3 text-xs font-medium transition-colors ${
                      active
                        ? "bg-[#16233B] text-white dark:bg-white dark:text-[#0B0B0E]"
                        : "text-[#111113]/70 hover:text-[#111113] dark:text-white/70 dark:hover:text-white"
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Top Control Bar: Gama Filters + Visual (Camisa/Tela) + Grid (3/4 cols) */}
        <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div
            role="tablist"
            aria-label="Filtrar por gama de tela"
            className="scrollbar-none flex items-center gap-1.5 overflow-x-auto pb-0.5"
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
                  className={`cursor-pointer relative min-h-[40px] shrink-0 rounded-full px-4 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#16233B]/40 dark:focus-visible:ring-white/60 ${
                    isActive
                      ? "font-semibold text-white dark:text-[#0B0B0E]"
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
                      className="absolute inset-0 rounded-full bg-[#16233B] dark:bg-white"
                    />
                  )}
                  <span className="relative z-10">{option.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div
              role="radiogroup"
              aria-label="Modo de visualización"
              className="liquid-glass inline-flex items-center rounded-full p-1"
            >
              <button
                type="button"
                role="radio"
                aria-checked={visualMode === "camisa"}
                onClick={() => setVisualMode("camisa")}
                className={`cursor-pointer inline-flex min-h-[36px] items-center gap-1.5 rounded-full px-3 text-xs font-medium transition-colors ${
                  visualMode === "camisa"
                    ? "bg-[#16233B] text-white dark:bg-white dark:text-[#0B0B0E]"
                    : "text-[#111113]/70 hover:text-[#111113] dark:text-white/70 dark:hover:text-white"
                }`}
              >
                <Shirt className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Camisa</span>
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={visualMode === "tela"}
                onClick={() => setVisualMode("tela")}
                className={`cursor-pointer inline-flex min-h-[36px] items-center gap-1.5 rounded-full px-3 text-xs font-medium transition-colors ${
                  visualMode === "tela"
                    ? "bg-[#16233B] text-white dark:bg-white dark:text-[#0B0B0E]"
                    : "text-[#111113]/70 hover:text-[#111113] dark:text-white/70 dark:hover:text-white"
                }`}
              >
                <SwatchBook className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Tela</span>
              </button>
            </div>

            <div
              role="radiogroup"
              aria-label="Columnas de la grilla"
              className="liquid-glass hidden items-center rounded-full p-1 lg:inline-flex"
            >
              <button
                type="button"
                role="radio"
                aria-checked={gridCols === 3}
                onClick={() => setGridCols(3)}
                className={`cursor-pointer inline-flex min-h-[36px] items-center gap-1.5 rounded-full px-3 text-xs font-medium transition-colors ${
                  gridCols === 3
                    ? "bg-[#16233B] text-white dark:bg-white dark:text-[#0B0B0E]"
                    : "text-[#111113]/70 hover:text-[#111113] dark:text-white/70 dark:hover:text-white"
                }`}
              >
                <Grid2x2 className="h-3.5 w-3.5" aria-hidden="true" />
                <span>3 cols</span>
              </button>
              <button
                type="button"
                role="radio"
                aria-checked={gridCols === 4}
                onClick={() => setGridCols(4)}
                className={`cursor-pointer inline-flex min-h-[36px] items-center gap-1.5 rounded-full px-3 text-xs font-medium transition-colors ${
                  gridCols === 4
                    ? "bg-[#16233B] text-white dark:bg-white dark:text-[#0B0B0E]"
                    : "text-[#111113]/70 hover:text-[#111113] dark:text-white/70 dark:hover:text-white"
                }`}
              >
                <Grid3x3 className="h-3.5 w-3.5" aria-hidden="true" />
                <span>4 cols</span>
              </button>
            </div>
          </div>
        </div>

        {/* Minimal Product Grid */}
        {visibleShirts.length === 0 ? (
          <div className="liquid-glass mt-8 rounded-2xl p-8 text-center">
            <p className="ds-body text-muted">
              No encontramos camisas para{" "}
              {searchQuery.trim()
                ? `“${searchQuery.trim()}”`
                : "la gama seleccionada"}
              .
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedFabric(null);
              }}
              className="ds-btn-primary mt-4"
            >
              Limpiar búsqueda
            </button>
          </div>
        ) : (
          <div
            className={`mt-7 grid grid-cols-2 gap-5 ${
              gridCols === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"
            }`}
          >
            {visibleShirts.map((shirt) => (
              <MinimalShirtCard
                key={shirt.id}
                shirt={shirt}
                visualMode={visualMode}
                isWide={gridCols === 3}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
