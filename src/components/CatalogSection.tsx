"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Grid2x2,
  Grid3x3,
  Plus,
  Search,
  Shirt,
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
type SortOrder = "featured" | "price-asc" | "price-desc";

const SORT_OPTIONS: { id: SortOrder; label: string }[] = [
  { id: "featured", label: "Destacados" },
  { id: "price-asc", label: "Menor precio" },
  { id: "price-desc", label: "Mayor precio" },
];

function formatArsClean(value: number): string {
  return `$${value.toLocaleString("es-AR")}`;
}

function getDiscreetBadge(
  badge?: ShirtBadge
): { label: string; className: string } | null {
  if (badge === "OFERTA") {
    return {
      label: "OFERTA",
      className:
        "bg-[#16233B] text-white dark:bg-white dark:text-[#0B0B0E]",
    };
  }
  if (badge === "DESTACADO") {
    return {
      label: "DESTACADO",
      className:
        "border border-black/10 bg-white/88 text-[#111113] backdrop-blur-md dark:border-white/15 dark:bg-white/12 dark:text-white",
    };
  }
  return null;
}

function normalizeSearch(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function MinimalShirtCard({
  shirt,
  visualMode,
  isWide,
  onOpenSizeSheet,
}: {
  shirt: CatalogShirt;
  visualMode: VisualMode;
  isWide: boolean;
  onOpenSizeSheet: (shirt: CatalogShirt) => void;
}) {
  const { isMotionPaused } = useMotion();
  const badge = getDiscreetBadge(shirt.badge);

  return (
    <article className="group liquid-glass flex flex-col overflow-hidden rounded-2xl text-[#111113] transition-all duration-300 hover:-translate-y-0.5 hover:border-black/20 dark:text-white dark:hover:border-white/28">
      {/* Clickable Product Link Area */}
      <Link href={`/coleccion/${shirt.id}`} className="flex flex-1 flex-col">
        {/* Clean Borderless Studio Garment Stage + Top-Left Badge + Bottom-Right Circular + */}
        <div
          className={`relative flex w-full items-center justify-center overflow-hidden bg-transparent ${
            isWide ? "aspect-[4/4.6]" : "aspect-[4/4.4]"
          }`}
        >
          {visualMode === "camisa" ? (
            <div className="relative flex h-full w-full items-center justify-center p-4 pb-6">
              <div
                className={`relative flex h-full w-full items-center justify-center ${
                  isMotionPaused
                    ? ""
                    : "transition-transform duration-500 ease-out group-hover:-translate-y-1.5 group-hover:scale-[1.04]"
                }`}
              >
                <picture className="flex h-full w-full items-center justify-center">
                  <source
                    media="(min-width: 768px)"
                    srcSet={shirt.studioImageHd}
                    type="image/webp"
                  />
                  <img
                    src={shirt.studioImage}
                    alt={shirt.name}
                    loading="lazy"
                    className="h-full w-full object-contain drop-shadow-[0_14px_18px_rgba(17,17,19,0.2)] dark:drop-shadow-[0_16px_22px_rgba(0,0,0,0.58)]"
                  />
                </picture>
              </div>
              <span
                aria-hidden="true"
                className="pointer-events-none absolute bottom-2.5 left-1/2 h-2.5 w-24 -translate-x-1/2 rounded-full bg-[#111113] opacity-20 blur-md transition-opacity duration-500 group-hover:opacity-15 dark:bg-black dark:opacity-55"
              />
            </div>
          ) : (
            <TailorFabricSwatch shirt={shirt} compact />
          )}

          {/* Top-Left Badge */}
          {badge && (
            <span
              className={`pointer-events-none absolute top-2.5 left-2.5 z-10 rounded-full px-2.5 py-0.5 text-[9.5px] font-semibold tracking-[0.08em] uppercase ${badge.className}`}
            >
              {badge.label}
            </span>
          )}
        </div>

        {/* Clean 4-Line Hierarchy with breathing room + circular + beside price */}
        <div className="flex flex-1 flex-col justify-between gap-2.5 px-3.5 pt-3 pb-3.5 sm:px-4 sm:pb-4">
          <div className="space-y-1.5">
            <h2 className="ds-h3 leading-snug">{shirt.name}</h2>
            <p className="text-xs text-muted">{shirt.fabricLabel}</p>
            <p className="ds-mono text-[11px] text-muted/85">
              {shirt.refCode}
            </p>
          </div>

          <div className="flex items-center justify-between gap-2 pt-0.5">
            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
              <span className="font-sans text-sm font-semibold text-[#111113] tabular-nums dark:text-white">
                {formatArsClean(shirt.priceArs)}
              </span>
              {shirt.compareAtArs && (
                <span className="font-sans text-xs text-muted line-through tabular-nums">
                  {formatArsClean(shirt.compareAtArs)}
                </span>
              )}
            </div>

            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onOpenSizeSheet(shirt);
              }}
              aria-label={`Elegir talle para ${shirt.name}`}
              title={`Agregar ${shirt.name}`}
              className="cursor-pointer inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/14 bg-white/85 text-[#16233B] transition-all duration-200 hover:bg-[#16233B] hover:text-white active:scale-95 sm:h-10 sm:w-10 dark:border-white/18 dark:bg-white/[0.08] dark:text-white dark:hover:bg-white dark:hover:text-[#0B0B0E]"
            >
              <Plus className="h-4 w-4 stroke-[2.1]" aria-hidden="true" />
            </button>
          </div>
        </div>
      </Link>
    </article>
  );
}

export function CatalogSection() {
  const { selectedFabric, setSelectedFabric, addToSelection } = useAtelier();
  const { isMotionPaused } = useMotion();
  const [gridCols, setGridCols] = useState<GridCols>(4);
  const [visualMode, setVisualMode] = useState<VisualMode>("camisa");
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [sortOrder, setSortOrder] = useState<SortOrder>("featured");
  const [sizeSheetShirt, setSizeSheetShirt] = useState<CatalogShirt | null>(
    null
  );
  const sizeTrackRef = useRef<HTMLDivElement | null>(null);
  const mobileSearchInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const gama = params.get("gama") as FabricCategoryId | null;
    if (gama && VALID_GAMAS.has(gama)) {
      setSelectedFabric(gama);
    }
  }, [setSelectedFabric]);

  // Focus mobile search input when expanded in place of title
  useEffect(() => {
    if (mobileSearchOpen) {
      mobileSearchInputRef.current?.focus();
    }
  }, [mobileSearchOpen]);

  // Escape key & body scroll-lock when Size Bottom Sheet is open
  useEffect(() => {
    if (!sizeSheetShirt) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSizeSheetShirt(null);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [sizeSheetShirt]);

  const isGlobalSearchActive = searchQuery.trim().length > 0;
  const isMobileSearchExpanded = mobileSearchOpen || isGlobalSearchActive;

  // Smart Global Search: when query is non-empty, search across ALL gamas
  const visibleShirts = useMemo(() => {
    const query = normalizeSearch(searchQuery.trim());
    const filtered = CATALOG_SHIRTS.filter((s) => {
      if (!query && selectedFabric && s.fabricId !== selectedFabric) {
        return false;
      }
      if (!query) return true;
      const haystack = normalizeSearch(
        `${s.name} ${s.refCode} ${s.fabricLabel} ${s.composition}`
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

  const handleToggleVisualMode = () => {
    setVisualMode((prev) => (prev === "camisa" ? "tela" : "camisa"));
  };

  const handleSelectSize = (size: CommercialSize) => {
    if (!sizeSheetShirt) return;
    addToSelection(sizeSheetShirt, {
      mode: "commercial",
      commercialSize: size,
    });
    setSizeSheetShirt(null);
  };

  const scrollSizeTrack = (direction: -1 | 1) => {
    const el = sizeTrackRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction * 160,
      behavior: isMotionPaused ? "auto" : "smooth",
    });
  };

  const sheetSizes = sizeSheetShirt
    ? sizeSheetShirt.sizeType === "alpha"
      ? ALPHA_SIZES
      : NUMERIC_SIZES
    : [];

  return (
    <section
      id="coleccion"
      aria-labelledby="coleccion-heading"
      className="relative w-full bg-transparent pt-20 pb-16 text-[#111113] sm:pt-24 lg:pt-28 dark:text-white"
    >
      <div className="mx-auto w-full max-w-[1360px] px-5 sm:px-8 lg:px-10">
        {/* ROW 1: Mobile (Title OR Inline Expanded Search + Single 🧵/👕 toggle) | Desktop (Title + Search + Sort) */}
        <div className="flex min-h-[44px] items-center justify-between gap-2.5">
          {/* Desktop Title (always visible on md+) + Mobile Title (hidden while mobile search is expanded) */}
          <h1
            id="coleccion-heading"
            className={`ds-h1-page ${
              isMobileSearchExpanded ? "hidden md:block" : "block"
            }`}
          >
            Colección
          </h1>

          {/* Mobile (< md) Expanded Search Input replacing Title in-place */}
          <AnimatePresence initial={false}>
            {isMobileSearchExpanded && (
              <motion.div
                key="mobile-inline-search"
                initial={isMotionPaused ? false : { opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={isMotionPaused ? undefined : { opacity: 0, x: 12 }}
                transition={{ duration: 0.18 }}
                className="liquid-glass flex min-h-[44px] min-w-0 flex-1 items-center rounded-full px-3.5 md:hidden"
              >
                <Search
                  className="h-4 w-4 shrink-0 text-muted"
                  aria-hidden="true"
                />
                <input
                  ref={mobileSearchInputRef}
                  id="catalog-search-input-mobile"
                  type="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Buscar tela o Ref. Art. (ej. 2529)..."
                  aria-label="Buscar por tela o referencia de artículo"
                  className="w-full min-w-0 bg-transparent px-2 text-base text-[#111113] placeholder:text-muted/75 focus:outline-none md:text-sm dark:text-[#F8FAFC]"
                />
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setMobileSearchOpen(false);
                  }}
                  aria-label="Cerrar búsqueda"
                  className="cursor-pointer inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-black/[0.06] hover:text-[#111113] dark:hover:bg-white/10 dark:hover:text-white"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Mobile (< md) Row 1 Right Control: [🔍 when collapsed] */}
          {!isMobileSearchExpanded && (
            <div className="flex shrink-0 items-center md:hidden">
              <button
                type="button"
                onClick={() => setMobileSearchOpen(true)}
                aria-expanded={false}
                aria-label="Buscar en la colección"
                title="Buscar"
                className="liquid-glass cursor-pointer inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-[#111113] transition-colors hover:border-black/25 dark:text-white dark:hover:border-white/30"
              >
                <Search className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          )}

          {/* Desktop (md+): Inline Search + Sort Pills */}
          <div className="hidden items-center gap-2.5 md:flex">
            <div className="liquid-glass relative flex min-h-[44px] w-72 items-center rounded-full px-4 lg:w-80">
              <Search
                className="h-4 w-4 shrink-0 text-muted"
                aria-hidden="true"
              />
              <input
                id="catalog-search-input-desktop"
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Buscar por tela o Ref. Art. (ej. 2529)..."
                aria-label="Buscar por tela o referencia de artículo"
                className="w-full bg-transparent px-2.5 text-base text-[#111113] placeholder:text-muted/75 focus:outline-none md:text-sm dark:text-[#F8FAFC]"
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
              className="liquid-glass inline-flex items-center rounded-full p-1"
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

        {/* MOBILE (< md) Row 2: [Todas las telas ▾] + [Destacados ▾] + [🧵/👕] */}
        <div className="mt-3 flex items-center gap-2 md:hidden">
          <div className="liquid-glass relative flex min-h-[44px] min-w-0 flex-1 items-center rounded-full">
            <select
              aria-label="Filtrar por gama de tela"
              value={isGlobalSearchActive ? "" : (selectedFabric ?? "")}
              onChange={(e) => {
                const val = e.target.value as FabricCategoryId | "";
                setSearchQuery("");
                setSelectedFabric(val ? val : null);
              }}
              className="h-full w-full cursor-pointer appearance-none bg-transparent pr-7 pl-3.5 text-xs font-medium text-[#111113] focus:outline-none dark:text-[#F8FAFC]"
            >
              {FILTER_OPTIONS.map((opt) => (
                <option
                  key={opt.label}
                  value={opt.id ?? ""}
                  className="bg-[#F7F6F3] text-[#111113] dark:bg-[#14161D] dark:text-white"
                >
                  {opt.id === null ? "Todas las telas" : opt.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-2.5 h-3.5 w-3.5 text-muted"
              aria-hidden="true"
            />
          </div>

          <div className="liquid-glass relative flex min-h-[44px] min-w-0 flex-1 items-center rounded-full">
            <select
              aria-label="Ordenar colección"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as SortOrder)}
              className="h-full w-full cursor-pointer appearance-none bg-transparent pr-7 pl-3.5 text-xs font-medium text-[#111113] focus:outline-none dark:text-[#F8FAFC]"
            >
              {SORT_OPTIONS.map((opt) => (
                <option
                  key={opt.id}
                  value={opt.id}
                  className="bg-[#F7F6F3] text-[#111113] dark:bg-[#14161D] dark:text-white"
                >
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown
              className="pointer-events-none absolute right-2.5 h-3.5 w-3.5 text-muted"
              aria-hidden="true"
            />
          </div>

          <button
            type="button"
            onClick={handleToggleVisualMode}
            aria-label={
              visualMode === "camisa"
                ? "Cambiar a vista de tela"
                : "Cambiar a vista de camisa"
            }
            title={
              visualMode === "camisa" ? "Ver muestras de tela" : "Ver camisas"
            }
            className="liquid-glass cursor-pointer inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-full text-[#111113] transition-colors hover:border-black/25 dark:text-white dark:hover:border-white/30"
          >
            {visualMode === "camisa" ? (
              <SwatchBook className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Shirt className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>

        {/* DESKTOP (md+): Gama Filter Pills + Single Circular 🧵/👕 Toggle + Grid (3/4 cols) */}
        <div className="mt-5 hidden items-center justify-between gap-3 md:flex">
          <div
            role="tablist"
            aria-label="Filtrar por gama de tela"
            className="scrollbar-none flex items-center gap-1.5 overflow-x-auto pb-0.5"
          >
            {FILTER_OPTIONS.map((option) => {
              const isActive =
                !isGlobalSearchActive && selectedFabric === option.id;
              return (
                <button
                  key={option.label}
                  id={`catalog-filter-${option.id ?? "all"}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedFabric(option.id);
                  }}
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
            {/* Single Circular Visual Mode Toggle */}
            <button
              type="button"
              onClick={handleToggleVisualMode}
              aria-label={
                visualMode === "camisa"
                  ? "Cambiar a vista de tela"
                  : "Cambiar a vista de camisa"
              }
              title={
                visualMode === "camisa" ? "Ver muestras de tela" : "Ver camisas"
              }
              className="liquid-glass cursor-pointer inline-flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full text-[#111113] transition-colors hover:border-black/25 dark:text-white dark:hover:border-white/30"
            >
              {visualMode === "camisa" ? (
                <SwatchBook className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Shirt className="h-4 w-4" aria-hidden="true" />
              )}
            </button>

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

        {/* Global Search Notice when searching while a fabric filter was selected */}
        {isGlobalSearchActive && selectedFabric && (
          <p className="ds-caption mt-3 text-muted">
            Resultados en toda la colección para “{searchQuery.trim()}”
          </p>
        )}

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
            className={`mt-5 grid grid-cols-2 gap-4 sm:mt-7 sm:gap-5 ${
              gridCols === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"
            }`}
          >
            {visibleShirts.map((shirt) => (
              <MinimalShirtCard
                key={shirt.id}
                shirt={shirt}
                visualMode={visualMode}
                isWide={gridCols === 3}
                onOpenSizeSheet={setSizeSheetShirt}
              />
            ))}
          </div>
        )}
      </div>

      {/* SCALABLE SIZE BOTTOM SHEET (Mobile Bottom Sheet / Desktop Compact Modal) */}
      <AnimatePresence>
        {sizeSheetShirt && (
          <motion.div
            key="size-sheet-backdrop"
            initial={isMotionPaused ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={isMotionPaused ? undefined : { opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setSizeSheetShirt(null);
            }}
            className="fixed inset-0 z-[85] flex items-end justify-center bg-black/60 backdrop-blur-sm sm:items-center sm:p-4"
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-labelledby="size-sheet-title"
              initial={isMotionPaused ? false : { y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={isMotionPaused ? undefined : { y: 32, opacity: 0 }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="liquid-glass-active w-full rounded-t-2xl border-x-0 border-b-0 !bg-[#F7F6F3]/98 p-5 pb-8 text-[#111113] shadow-[0_-18px_48px_rgba(0,0,0,0.22)] sm:max-w-md sm:rounded-2xl sm:border sm:p-6 dark:!bg-[#0B0B0E]/98 dark:text-[#F8FAFC]"
            >
              <div
                aria-hidden="true"
                className="mx-auto mb-4 h-1 w-10 rounded-full bg-black/15 sm:hidden dark:bg-white/20"
              />

              {/* Header: Square Fabric Swatch + Fabric Type above Name + Ref. Art. + Price */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-0.5 h-11 w-11 shrink-0 rounded-xl border border-black/12 shadow-inner dark:border-white/18"
                    style={{ backgroundColor: sizeSheetShirt.baseHex }}
                  />
                  <div>
                    <p className="ds-caption text-muted uppercase">
                      {sizeSheetShirt.fabricLabel}
                    </p>
                    <h2 id="size-sheet-title" className="ds-h3 mt-0.5">
                      {sizeSheetShirt.name}
                    </h2>
                    <p className="mt-0.5 text-xs text-muted">
                      <span className="ds-mono">{sizeSheetShirt.refCode}</span>{" "}
                      ·{" "}
                      <span className="font-sans font-semibold text-[#111113] tabular-nums dark:text-white">
                        {formatArsClean(sizeSheetShirt.priceArs)}
                      </span>
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSizeSheetShirt(null)}
                  aria-label="Cerrar selector de talle"
                  className="liquid-glass cursor-pointer inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-full text-[#111113] dark:text-white"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <p className="mt-5 text-xs font-semibold text-[#111113] dark:text-white">
                Elegí tu talle
              </p>

              {/* Horizontally Scrollable Scalable Size Strip with Discreet ‹ / › Arrows */}
              <div className="mt-2.5 flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => scrollSizeTrack(-1)}
                  aria-label="Ver talles anteriores"
                  className="cursor-pointer inline-flex h-10 w-8 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-black/[0.06] hover:text-[#111113] dark:hover:bg-white/10 dark:hover:text-white"
                >
                  <ChevronLeft className="h-4 w-4" aria-hidden="true" />
                </button>

                <div
                  ref={sizeTrackRef}
                  className="scrollbar-none flex flex-1 items-center gap-2 overflow-x-auto py-0.5"
                >
                  {sheetSizes.map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => handleSelectSize(size)}
                      aria-label={`Agregar ${sizeSheetShirt.name} talle ${size}`}
                      className="cursor-pointer flex h-12 min-w-[52px] shrink-0 items-center justify-center rounded-full border border-black/14 bg-white/90 px-4 text-sm font-semibold text-[#111113] transition-colors active:scale-95 hover:bg-[#16233B] hover:text-white dark:border-white/18 dark:bg-white/[0.08] dark:text-white dark:hover:bg-white dark:hover:text-[#0B0B0E]"
                    >
                      {size}
                    </button>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={() => scrollSizeTrack(1)}
                  aria-label="Ver talles siguientes"
                  className="cursor-pointer inline-flex h-10 w-8 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-black/[0.06] hover:text-[#111113] dark:hover:bg-white/10 dark:hover:text-white"
                >
                  <ChevronRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
