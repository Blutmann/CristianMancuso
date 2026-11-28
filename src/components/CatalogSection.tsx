"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  ChevronDown,
  Grid2x2,
  Grid3x3,
  Plus,
  Search,
  Shirt,
  SlidersHorizontal,
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
  type ShirtPattern,
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
  { id: "donna", label: "Donna Mancuso" },
];

const SIZE_ROW_1: (CommercialSize | null)[] = [null, ...NUMERIC_SIZES];
const SIZE_ROW_2: CommercialSize[] = [...ALPHA_SIZES];

const PATTERN_FILTER_OPTIONS: { id: ShirtPattern | null; label: string }[] = [
  { id: null, label: "Todas" },
  { id: "lisa", label: "Lisas" },
  { id: "rayas", label: "Rayas" },
  { id: "cuadros", label: "Cuadros" },
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
    <motion.article
      whileHover={isMotionPaused ? undefined : { y: -4 }}
      transition={{ type: "spring", stiffness: 320, damping: 26 }}
      className="group liquid-glass flex flex-col overflow-hidden rounded-2xl text-[#111113] transition-colors duration-300 hover:border-black/20 dark:text-white dark:hover:border-white/28"
    >
      {/* Clickable Product Link Area */}
      <Link href={`/coleccion/${shirt.id}`} className="flex flex-1 flex-col">
        {/* Full-bleed Loro Piana Dual Light/Dark Studio Garment Stage + Top-Left Badge */}
        <div
          className={`relative flex w-full items-center justify-center overflow-hidden bg-[#F4F1EC] dark:bg-[#0E0F13] ${
            isWide ? "aspect-[4/4.6]" : "aspect-[4/4.4]"
          }`}
        >
          {visualMode === "camisa" ? (
            <div className="relative h-full w-full overflow-hidden">
              <div
                className={`relative h-full w-full ${
                  isMotionPaused
                    ? ""
                    : "transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                }`}
              >
                <picture className="block h-full w-full dark:hidden">
                  <source
                    media="(min-width: 768px)"
                    srcSet={shirt.studioImageHd}
                    type="image/webp"
                  />
                  <img
                    src={shirt.studioImage}
                    alt={shirt.name}
                    loading="lazy"
                    className="h-full w-full object-cover object-top"
                  />
                </picture>
                <picture className="hidden h-full w-full dark:block">
                  <source
                    media="(min-width: 768px)"
                    srcSet={shirt.studioImageDarkHd}
                    type="image/webp"
                  />
                  <img
                    src={shirt.studioImageDark}
                    alt={shirt.name}
                    loading="lazy"
                    className="h-full w-full object-cover object-top"
                  />
                </picture>
              </div>
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

        {/* Clean 4-Line Hierarchy with breathing room + exclusive solid CTA + beside price */}
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

            <motion.button
              type="button"
              whileHover={isMotionPaused ? undefined : { scale: 1.08 }}
              whileTap={isMotionPaused ? undefined : { scale: 0.92 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                onOpenSizeSheet(shirt);
              }}
              aria-label={`Elegir talle para ${shirt.name}`}
              title={`Agregar ${shirt.name}`}
              className="cursor-pointer inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#16233B] text-white shadow-sm transition-colors duration-200 hover:bg-[#1E2F4D] sm:h-10 sm:w-10 dark:bg-white dark:text-[#0B0B0E] dark:hover:bg-white/90"
            >
              <Plus className="h-4 w-4 stroke-[2.2]" aria-hidden="true" />
            </motion.button>
          </div>
        </div>
      </Link>
    </motion.article>
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
  const [sortOpen, setSortOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState<CommercialSize | null>(null);
  const [selectedPattern, setSelectedPattern] = useState<ShirtPattern | null>(
    null
  );
  const [sizeSheetShirt, setSizeSheetShirt] = useState<CatalogShirt | null>(
    null
  );
  const mobileSearchInputRef = useRef<HTMLInputElement | null>(null);
  const desktopFilterRef = useRef<HTMLDivElement | null>(null);
  const desktopSortRef = useRef<HTMLDivElement | null>(null);

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

  // Escape key & outside-click close for Filter Popover / Mobile Sheet
  useEffect(() => {
    if (!filtersOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setFiltersOpen(false);
      }
    };

    const handlePointerDown = (e: MouseEvent) => {
      if (
        desktopFilterRef.current &&
        desktopFilterRef.current.contains(e.target as Node)
      ) {
        return;
      }
      // On desktop (>= 768px), clicking outside the anchored popover closes it
      if (window.innerWidth >= 768) {
        setFiltersOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [filtersOpen]);

  // Escape key & outside-click close for Desktop Sort Dropdown
  useEffect(() => {
    if (!sortOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setSortOpen(false);
      }
    };

    const handlePointerDown = (e: MouseEvent) => {
      if (
        desktopSortRef.current &&
        desktopSortRef.current.contains(e.target as Node)
      ) {
        return;
      }
      setSortOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.removeEventListener("mousedown", handlePointerDown);
    };
  }, [sortOpen]);

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

  const activeFilterCount =
    (selectedFabric ? 1 : 0) +
    (selectedSize ? 1 : 0) +
    (selectedPattern ? 1 : 0);

  const clearAllFilters = () => {
    setSelectedFabric(null);
    setSelectedSize(null);
    setSelectedPattern(null);
  };

  const visibleShirts = useMemo(() => {
    const query = normalizeSearch(searchQuery.trim());
    const filtered = CATALOG_SHIRTS.filter((s) => {
      if (!query && selectedFabric && s.fabricId !== selectedFabric) {
        return false;
      }
      if (selectedSize) {
        const availableSizes: readonly string[] =
          s.sizeType === "alpha" ? ALPHA_SIZES : NUMERIC_SIZES;
        if (!availableSizes.includes(selectedSize)) {
          return false;
        }
      }
      if (selectedPattern && s.pattern !== selectedPattern) {
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
  }, [selectedFabric, selectedSize, selectedPattern, searchQuery, sortOrder]);

  const activeFabricLabel =
    FILTER_OPTIONS.find((f) => f.id === selectedFabric)?.label ?? null;
  const activePatternLabel =
    PATTERN_FILTER_OPTIONS.find((p) => p.id === selectedPattern)?.label ?? null;
  const activeSortLabel =
    SORT_OPTIONS.find((s) => s.id === sortOrder)?.label ?? "Destacados";

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
        {/* ROW 1: Mobile (Title OR Inline Expanded Search) | Desktop (Title + live count) */}
        <div className="flex min-h-[44px] items-center justify-between gap-2.5">
          {/* Desktop Title + Micro-counter (always visible on md+) | Mobile Title (hidden while mobile search is expanded) */}
          <div
            className={`items-baseline gap-3 ${
              isMobileSearchExpanded ? "hidden md:flex" : "flex"
            }`}
          >
            <h1 id="coleccion-heading" className="ds-h1-page">
              Colección
            </h1>
            <span
              id="catalog-results-count"
              aria-live="polite"
              className="text-xs font-medium text-muted tabular-nums"
            >
              {visibleShirts.length}{" "}
              {visibleShirts.length === 1 ? "prenda" : "prendas"}
            </span>
          </div>

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
        </div>

        {/* MOBILE (< md) Row 2: [Filtros (N)] + [Destacados ▾] + [🧵/👕] */}
        <div className="mt-3 flex items-center gap-2 md:hidden">
          <button
            id="catalog-filters-trigger-mobile"
            type="button"
            aria-expanded={filtersOpen}
            aria-controls="catalog-filters-sheet"
            onClick={() => setFiltersOpen((prev) => !prev)}
            className={`liquid-glass cursor-pointer inline-flex min-h-[44px] min-w-0 flex-1 items-center justify-center gap-2 rounded-full px-3.5 text-xs font-semibold transition-colors ${
              activeFilterCount > 0 || filtersOpen
                ? "border-[#16233B]/45 text-[#16233B] dark:border-white/45 dark:text-white"
                : "text-[#111113] dark:text-[#F8FAFC]"
            }`}
          >
            <SlidersHorizontal className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
            <span>
              {activeFilterCount > 0
                ? `Filtros (${activeFilterCount})`
                : "Filtros"}
            </span>
          </button>

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

        {/* DESKTOP (md+) Level 2: Single Unified Toolbar — Left: Search (max-w-md) | Right: [Filtros ▾] + [Destacados ▾] + [🧵/👕] + [4 × 4 / 3 × 3] */}
        <div className="mt-5 hidden items-center justify-between gap-3 md:flex">
          {/* Left: Comfortable wider Search */}
          <div className="liquid-glass relative flex min-h-[44px] w-full max-w-md items-center rounded-full px-4">
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
              className="w-full bg-transparent px-2.5 text-sm text-[#111113] placeholder:text-muted/75 focus:outline-none dark:text-[#F8FAFC]"
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

          {/* Right: [Filtros ▾] + [Destacados ▾] + [🧵/👕] + [4 × 4 / 3 × 3] */}
          <div className="flex shrink-0 items-center gap-2 lg:gap-2.5">
            {/* Desktop Filters Dropdown */}
            <div ref={desktopFilterRef} className="relative">
              <button
                id="catalog-filters-trigger-desktop"
                type="button"
                aria-expanded={filtersOpen}
                aria-controls="catalog-filters-popover"
                onClick={() => {
                  setSortOpen(false);
                  setFiltersOpen((prev) => !prev);
                }}
                className={`liquid-glass cursor-pointer inline-flex min-h-[44px] items-center gap-2 whitespace-nowrap rounded-full px-4 text-xs font-semibold transition-colors ${
                  activeFilterCount > 0 || filtersOpen
                    ? "border-2 border-[#16233B] bg-[#16233B]/10 text-[#16233B] dark:border-white dark:bg-white/12 dark:text-white"
                    : "text-[#111113] hover:border-black/25 dark:text-white dark:hover:border-white/30"
                }`}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" aria-hidden="true" />
                <span>
                  {activeFilterCount > 0
                    ? `Filtros (${activeFilterCount})`
                    : "Filtros"}
                </span>
                <ChevronDown
                  className={`h-3.5 w-3.5 opacity-60 transition-transform duration-200 ${
                    filtersOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>

              {/* Desktop Anchored Liquid Glass Filter Popover */}
              <AnimatePresence>
                {filtersOpen && (
                  <motion.div
                    id="catalog-filters-popover"
                    role="dialog"
                    aria-label="Filtros de colección"
                    initial={
                      isMotionPaused ? false : { opacity: 0, y: 8, scale: 0.98 }
                    }
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={
                      isMotionPaused
                        ? undefined
                        : { opacity: 0, y: 6, scale: 0.98 }
                    }
                    transition={{ type: "spring", stiffness: 320, damping: 26 }}
                    className="liquid-glass-active absolute top-full right-0 z-40 mt-2.5 hidden w-[440px] rounded-2xl !bg-[#F7F6F3]/95 p-5 text-[#111113] shadow-[0_20px_54px_rgba(17,17,19,0.16)] md:block dark:!bg-[#11131A]/95 dark:text-[#F8FAFC] dark:shadow-[0_24px_60px_rgba(0,0,0,0.65)]"
                  >
                    <div className="space-y-4">
                      {/* Tipo de tela — Todas first */}
                      <div>
                        <p className="ds-caption font-semibold text-muted uppercase">
                          Tipo de tela
                        </p>
                        <div className="mt-2 flex flex-wrap items-center gap-1.5">
                          {FILTER_OPTIONS.map((opt) => {
                            const active = selectedFabric === opt.id;
                            return (
                              <button
                                key={opt.label}
                                type="button"
                                aria-pressed={active}
                                onClick={() => {
                                  setSearchQuery("");
                                  setSelectedFabric(opt.id);
                                }}
                                className={`cursor-pointer inline-flex min-h-[38px] items-center whitespace-nowrap rounded-full px-3 text-xs font-medium transition-colors ${
                                  active
                                    ? "border-2 border-[#16233B] bg-[#16233B]/10 font-semibold text-[#16233B] dark:border-white dark:bg-white/12 dark:text-white"
                                    : "border border-black/12 bg-white/75 text-[#111113]/80 hover:border-black/25 dark:border-white/15 dark:bg-white/[0.06] dark:text-white/80 dark:hover:border-white/30"
                                }`}
                              >
                                {opt.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Talle — Row 1: Todos + Numeric 36-52 | Row 2: Alpha XS-XXL */}
                      <div>
                        <p className="ds-caption font-semibold text-muted uppercase">
                          Talle
                        </p>
                        <div className="mt-2 flex flex-col gap-1.5">
                          <div className="flex flex-wrap items-center gap-1.5">
                            {SIZE_ROW_1.map((sz) => {
                              const active = selectedSize === sz;
                              return (
                                <button
                                  key={sz ?? "all-sizes"}
                                  type="button"
                                  aria-pressed={active}
                                  onClick={() => setSelectedSize(sz)}
                                  className={`cursor-pointer inline-flex min-h-[38px] min-w-[40px] items-center justify-center whitespace-nowrap rounded-full px-3 text-xs font-medium transition-colors ${
                                    active
                                      ? "border-2 border-[#16233B] bg-[#16233B]/10 font-semibold text-[#16233B] dark:border-white dark:bg-white/12 dark:text-white"
                                      : "border border-black/12 bg-white/75 text-[#111113]/80 hover:border-black/25 dark:border-white/15 dark:bg-white/[0.06] dark:text-white/80 dark:hover:border-white/30"
                                  }`}
                                >
                                  {sz ?? "Todos"}
                                </button>
                              );
                            })}
                          </div>
                          <div className="flex flex-wrap items-center gap-1.5">
                            {SIZE_ROW_2.map((sz) => {
                              const active = selectedSize === sz;
                              return (
                                <button
                                  key={sz}
                                  type="button"
                                  aria-pressed={active}
                                  onClick={() => setSelectedSize(sz)}
                                  className={`cursor-pointer inline-flex min-h-[38px] min-w-[40px] items-center justify-center whitespace-nowrap rounded-full px-3 text-xs font-medium transition-colors ${
                                    active
                                      ? "border-2 border-[#16233B] bg-[#16233B]/10 font-semibold text-[#16233B] dark:border-white dark:bg-white/12 dark:text-white"
                                      : "border border-black/12 bg-white/75 text-[#111113]/80 hover:border-black/25 dark:border-white/15 dark:bg-white/[0.06] dark:text-white/80 dark:hover:border-white/30"
                                  }`}
                                >
                                  {sz}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* Trama */}
                      <div>
                        <p className="ds-caption font-semibold text-muted uppercase">
                          Trama
                        </p>
                        <div className="mt-2 flex flex-wrap gap-1.5">
                          {PATTERN_FILTER_OPTIONS.map((pat) => {
                            const active = selectedPattern === pat.id;
                            return (
                              <button
                                key={pat.label}
                                type="button"
                                aria-pressed={active}
                                onClick={() => setSelectedPattern(pat.id)}
                                className={`cursor-pointer inline-flex min-h-[38px] items-center rounded-full px-3.5 text-xs font-medium transition-colors ${
                                  active
                                    ? "border-2 border-[#16233B] bg-[#16233B]/10 font-semibold text-[#16233B] dark:border-white dark:bg-white/12 dark:text-white"
                                    : "border border-black/12 bg-white/75 text-[#111113]/80 hover:border-black/25 dark:border-white/15 dark:bg-white/[0.06] dark:text-white/80 dark:hover:border-white/30"
                                }`}
                              >
                                {pat.label}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="flex items-center justify-between gap-3 border-t border-black/10 pt-3.5 dark:border-white/10">
                        <button
                          type="button"
                          onClick={clearAllFilters}
                          disabled={activeFilterCount === 0}
                          className="cursor-pointer min-h-[40px] px-2 text-xs font-semibold text-muted transition-colors hover:text-[#111113] disabled:cursor-not-allowed disabled:opacity-40 dark:hover:text-white"
                        >
                          Limpiar
                        </button>

                        <button
                          type="button"
                          onClick={() => setFiltersOpen(false)}
                          className="cursor-pointer inline-flex min-h-[40px] items-center justify-center rounded-full border-2 border-[#16233B] bg-[#16233B]/10 px-5 text-xs font-semibold text-[#16233B] transition-colors hover:bg-[#16233B]/15 dark:border-white dark:bg-white/12 dark:text-white dark:hover:bg-white/18"
                        >
                          {visibleShirts.length === 0
                            ? "0 camisas"
                            : visibleShirts.length === 1
                              ? "Ver 1 camisa"
                              : `Ver ${visibleShirts.length} camisas`}
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Desktop Sort Dropdown (Option B — Compact Liquid Glass, sibling of Filtros) */}
            <div ref={desktopSortRef} className="relative">
              <button
                id="catalog-sort-trigger-desktop"
                type="button"
                aria-expanded={sortOpen}
                aria-haspopup="listbox"
                aria-controls="catalog-sort-popover"
                onClick={() => {
                  setFiltersOpen(false);
                  setSortOpen((prev) => !prev);
                }}
                className={`liquid-glass cursor-pointer inline-flex min-h-[44px] items-center gap-2 whitespace-nowrap rounded-full px-4 text-xs font-semibold transition-colors ${
                  sortOrder !== "featured" || sortOpen
                    ? "border-2 border-[#16233B] bg-[#16233B]/10 text-[#16233B] dark:border-white dark:bg-white/12 dark:text-white"
                    : "text-[#111113] hover:border-black/25 dark:text-white dark:hover:border-white/30"
                }`}
              >
                <span>{activeSortLabel}</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 opacity-60 transition-transform duration-200 ${
                    sortOpen ? "rotate-180" : ""
                  }`}
                  aria-hidden="true"
                />
              </button>

              <AnimatePresence>
                {sortOpen && (
                  <motion.div
                    id="catalog-sort-popover"
                    role="listbox"
                    aria-label="Ordenar colección"
                    initial={
                      isMotionPaused ? false : { opacity: 0, y: 8, scale: 0.98 }
                    }
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={
                      isMotionPaused
                        ? undefined
                        : { opacity: 0, y: 6, scale: 0.98 }
                    }
                    transition={{ type: "spring", stiffness: 320, damping: 26 }}
                    className="liquid-glass-active absolute top-full right-0 z-40 mt-2.5 w-48 rounded-2xl !bg-[#F7F6F3]/95 p-1.5 text-[#111113] shadow-[0_20px_54px_rgba(17,17,19,0.16)] dark:!bg-[#11131A]/95 dark:text-[#F8FAFC] dark:shadow-[0_24px_60px_rgba(0,0,0,0.65)]"
                  >
                    <div className="flex flex-col gap-1">
                      {SORT_OPTIONS.map((opt) => {
                        const active = sortOrder === opt.id;
                        return (
                          <button
                            key={opt.id}
                            type="button"
                            role="option"
                            aria-selected={active}
                            onClick={() => {
                              setSortOrder(opt.id);
                              setSortOpen(false);
                            }}
                            className={`cursor-pointer flex min-h-[38px] w-full items-center justify-between rounded-xl px-3 text-left text-xs transition-colors ${
                              active
                                ? "border-2 border-[#16233B] bg-[#16233B]/10 font-semibold text-[#16233B] dark:border-white dark:bg-white/12 dark:text-white"
                                : "border border-transparent font-medium text-[#111113]/80 hover:bg-black/[0.04] hover:text-[#111113] dark:text-white/80 dark:hover:bg-white/[0.06] dark:hover:text-white"
                            }`}
                          >
                            <span>{opt.label}</span>
                            {active && (
                              <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Single Circular Visual Mode Toggle (Camisa / Tela) */}
            <button
              id="catalog-visual-toggle-desktop"
              type="button"
              onClick={handleToggleVisualMode}
              aria-pressed={visualMode === "tela"}
              aria-label={
                visualMode === "camisa"
                  ? "Cambiar a vista de tela"
                  : "Cambiar a vista de camisa"
              }
              title={
                visualMode === "camisa" ? "Ver muestras de tela" : "Ver camisas"
              }
              className={`liquid-glass cursor-pointer inline-flex min-h-[44px] min-w-[44px] shrink-0 items-center justify-center rounded-full transition-colors ${
                visualMode === "tela"
                  ? "border-2 border-[#16233B] bg-[#16233B]/10 text-[#16233B] dark:border-white dark:bg-white/12 dark:text-white"
                  : "text-[#111113] hover:border-black/25 dark:text-white dark:hover:border-white/30"
              }`}
            >
              {visualMode === "camisa" ? (
                <SwatchBook className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Shirt className="h-4 w-4" aria-hidden="true" />
              )}
            </button>

            {/* Single Compact Grid Density Toggle: 4 × 4 ↔ 3 × 3 */}
            <button
              id="catalog-grid-toggle-desktop"
              type="button"
              onClick={() => setGridCols((prev) => (prev === 4 ? 3 : 4))}
              aria-pressed={gridCols === 3}
              aria-label={
                gridCols === 4
                  ? "Cambiar grilla a 3 columnas"
                  : "Cambiar grilla a 4 columnas"
              }
              title={
                gridCols === 4
                  ? "Grilla 4 × 4 (clic para 3 × 3)"
                  : "Grilla 3 × 3 (clic para 4 × 4)"
              }
              className={`liquid-glass cursor-pointer hidden min-h-[44px] shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-3.5 text-xs font-semibold transition-colors lg:inline-flex ${
                gridCols === 3
                  ? "border-2 border-[#16233B] bg-[#16233B]/10 text-[#16233B] dark:border-white dark:bg-white/12 dark:text-white"
                  : "border border-[#16233B]/30 text-[#111113] hover:border-[#16233B]/60 dark:border-white/30 dark:text-white dark:hover:border-white/60"
              }`}
            >
              {gridCols === 4 ? (
                <>
                  <Grid3x3 className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>4 × 4</span>
                </>
              ) : (
                <>
                  <Grid2x2 className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>3 × 3</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Active Removable Filter Chips */}
        {activeFilterCount > 0 && (
          <div
            aria-label="Filtros activos"
            className="mt-3 flex flex-wrap items-center gap-1.5"
          >
            {activeFabricLabel && (
              <button
                type="button"
                onClick={() => setSelectedFabric(null)}
                className="liquid-glass cursor-pointer inline-flex min-h-[32px] items-center gap-1.5 rounded-full px-3 text-xs font-medium text-[#111113] transition-colors hover:border-black/25 dark:text-white dark:hover:border-white/30"
              >
                <span>{activeFabricLabel}</span>
                <X className="h-3 w-3 opacity-65" aria-hidden="true" />
              </button>
            )}
            {selectedSize && (
              <button
                type="button"
                onClick={() => setSelectedSize(null)}
                className="liquid-glass cursor-pointer inline-flex min-h-[32px] items-center gap-1.5 rounded-full px-3 text-xs font-medium text-[#111113] transition-colors hover:border-black/25 dark:text-white dark:hover:border-white/30"
              >
                <span>Talle {selectedSize}</span>
                <X className="h-3 w-3 opacity-65" aria-hidden="true" />
              </button>
            )}
            {activePatternLabel && (
              <button
                type="button"
                onClick={() => setSelectedPattern(null)}
                className="liquid-glass cursor-pointer inline-flex min-h-[32px] items-center gap-1.5 rounded-full px-3 text-xs font-medium text-[#111113] transition-colors hover:border-black/25 dark:text-white dark:hover:border-white/30"
              >
                <span>{activePatternLabel}</span>
                <X className="h-3 w-3 opacity-65" aria-hidden="true" />
              </button>
            )}
            <button
              type="button"
              onClick={clearAllFilters}
              className="cursor-pointer px-2 text-xs font-semibold text-muted underline-offset-4 transition-colors hover:text-[#111113] hover:underline dark:hover:text-white"
            >
              Limpiar todo
            </button>
          </div>
        )}

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
              No encontramos camisas{" "}
              {searchQuery.trim()
                ? `para “${searchQuery.trim()}”`
                : "con los filtros seleccionados"}
              .
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                clearAllFilters();
              }}
              className="ds-btn-primary mt-4"
            >
              Limpiar filtros
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

            {/* Bespoke Bridge Card — harmonizes the 8th slot in 4×4 and invites custom tailoring */}
            <motion.article
              layout
              whileHover={isMotionPaused ? undefined : { y: -4 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              className="group liquid-glass flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-dashed border-black/22 p-5 transition-colors duration-300 hover:border-[#16233B]/45 sm:p-6 dark:border-white/24 dark:hover:border-white/45"
            >
              <div className="flex flex-1 flex-col justify-between gap-6">
                <div className="space-y-3">
                  <span className="inline-flex w-fit items-center rounded-full border border-[#16233B]/20 bg-[#16233B]/[0.05] px-2.5 py-1 text-[10px] font-semibold tracking-[0.14em] text-[#16233B] uppercase dark:border-white/20 dark:bg-white/[0.06] dark:text-[#D6C3A5]">
                    A medida sin cargo
                  </span>

                  <h2 className="font-display text-lg leading-snug font-semibold tracking-tight text-[#111113] sm:text-xl dark:text-white">
                    ¿Buscás otro cuello, botón o tela?
                  </h2>

                  <p className="text-xs leading-relaxed text-muted sm:text-sm">
                    Configurá tu camisa paso a paso con nuestras telas italianas
                    y peruanas.
                  </p>
                </div>

                <Link
                  id="catalog-bespoke-bridge-cta"
                  href="/a-medida"
                  className="inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full border border-[#16233B]/35 bg-[#16233B]/[0.05] px-4 text-xs font-semibold text-[#16233B] transition-colors duration-200 hover:border-[#16233B] hover:bg-[#16233B]/10 dark:border-white/30 dark:bg-white/[0.05] dark:text-white dark:hover:border-white dark:hover:bg-white/12"
                >
                  <span>Armá tu camisa</span>
                  <ArrowRight
                    className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </Link>
              </div>
            </motion.article>
          </div>
        )}
      </div>

      {/* MOBILE FILTER BOTTOM SHEET (< md) */}
      <AnimatePresence>
        {filtersOpen && (
          <motion.div
            key="mobile-filter-sheet-backdrop"
            initial={isMotionPaused ? false : { opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={isMotionPaused ? undefined : { opacity: 0 }}
            transition={{ duration: 0.18 }}
            onClick={(e) => {
              if (e.target === e.currentTarget) setFiltersOpen(false);
            }}
            className="fixed inset-0 z-[85] flex items-end justify-center bg-black/55 backdrop-blur-sm md:hidden"
          >
            <motion.div
              id="catalog-filters-sheet"
              role="dialog"
              aria-modal="true"
              aria-label="Filtros de colección"
              initial={isMotionPaused ? false : { y: 48, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={isMotionPaused ? undefined : { y: 40, opacity: 0 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              className="liquid-glass-active max-h-[85svh] w-full overflow-y-auto rounded-t-3xl border-x-0 border-b-0 !bg-[#F7F6F3]/98 p-5 pb-7 text-[#111113] shadow-[0_-18px_48px_rgba(0,0,0,0.22)] dark:!bg-[#0B0B0E]/98 dark:text-[#F8FAFC]"
            >
              <div
                aria-hidden="true"
                className="mx-auto mb-3.5 h-1 w-10 rounded-full bg-black/15 dark:bg-white/20"
              />

              <div className="flex items-center justify-between gap-3">
                <h2 className="ds-h3">Filtros</h2>
                <button
                  type="button"
                  onClick={() => setFiltersOpen(false)}
                  aria-label="Cerrar filtros"
                  className="liquid-glass cursor-pointer inline-flex h-10 w-10 items-center justify-center rounded-full text-[#111113] dark:text-white"
                >
                  <X className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              <div className="mt-4 space-y-4">
                {/* Tipo de tela — Todas first */}
                <div>
                  <p className="ds-caption font-semibold text-muted uppercase">
                    Tipo de tela
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-1.5">
                    {FILTER_OPTIONS.map((opt) => {
                      const active = selectedFabric === opt.id;
                      return (
                        <button
                          key={opt.label}
                          type="button"
                          aria-pressed={active}
                          onClick={() => {
                            setSearchQuery("");
                            setSelectedFabric(opt.id);
                          }}
                          className={`cursor-pointer inline-flex min-h-[38px] items-center whitespace-nowrap rounded-full px-3 text-xs font-medium transition-colors ${
                            active
                              ? "border-2 border-[#16233B] bg-[#16233B]/10 font-semibold text-[#16233B] dark:border-white dark:bg-white/12 dark:text-white"
                              : "border border-black/12 bg-white/80 text-[#111113]/80 dark:border-white/15 dark:bg-white/[0.06] dark:text-white/80"
                          }`}
                        >
                          {opt.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Talle — Row 1: Todos + Numeric 36-52 | Row 2: Alpha XS-XXL */}
                <div>
                  <p className="ds-caption font-semibold text-muted uppercase">
                    Talle
                  </p>
                  <div className="mt-2 flex flex-col gap-1.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      {SIZE_ROW_1.map((sz) => {
                        const active = selectedSize === sz;
                        return (
                          <button
                            key={sz ?? "all-sizes-mob"}
                            type="button"
                            aria-pressed={active}
                            onClick={() => setSelectedSize(sz)}
                            className={`cursor-pointer inline-flex min-h-[38px] min-w-[40px] items-center justify-center whitespace-nowrap rounded-full px-3 text-xs font-medium transition-colors ${
                              active
                                ? "border-2 border-[#16233B] bg-[#16233B]/10 font-semibold text-[#16233B] dark:border-white dark:bg-white/12 dark:text-white"
                                : "border border-black/12 bg-white/80 text-[#111113]/80 dark:border-white/15 dark:bg-white/[0.06] dark:text-white/80"
                            }`}
                          >
                            {sz ?? "Todos"}
                          </button>
                        );
                      })}
                    </div>
                    <div className="flex flex-wrap items-center gap-1.5">
                      {SIZE_ROW_2.map((sz) => {
                        const active = selectedSize === sz;
                        return (
                          <button
                            key={sz}
                            type="button"
                            aria-pressed={active}
                            onClick={() => setSelectedSize(sz)}
                            className={`cursor-pointer inline-flex min-h-[38px] min-w-[40px] items-center justify-center whitespace-nowrap rounded-full px-3 text-xs font-medium transition-colors ${
                              active
                                ? "border-2 border-[#16233B] bg-[#16233B]/10 font-semibold text-[#16233B] dark:border-white dark:bg-white/12 dark:text-white"
                                : "border border-black/12 bg-white/80 text-[#111113]/80 dark:border-white/15 dark:bg-white/[0.06] dark:text-white/80"
                            }`}
                          >
                            {sz}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Trama */}
                <div>
                  <p className="ds-caption font-semibold text-muted uppercase">
                    Trama
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {PATTERN_FILTER_OPTIONS.map((pat) => {
                      const active = selectedPattern === pat.id;
                      return (
                        <button
                          key={pat.label}
                          type="button"
                          aria-pressed={active}
                          onClick={() => setSelectedPattern(pat.id)}
                          className={`cursor-pointer inline-flex min-h-[40px] items-center rounded-full px-3.5 text-xs font-medium transition-colors ${
                            active
                              ? "border-2 border-[#16233B] bg-[#16233B]/10 font-semibold text-[#16233B] dark:border-white dark:bg-white/12 dark:text-white"
                              : "border border-black/12 bg-white/80 text-[#111113]/80 dark:border-white/15 dark:bg-white/[0.06] dark:text-white/80"
                          }`}
                        >
                          {pat.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between gap-3 border-t border-black/10 pt-4 dark:border-white/10">
                  <button
                    type="button"
                    onClick={clearAllFilters}
                    disabled={activeFilterCount === 0}
                    className="cursor-pointer min-h-[44px] px-3 text-xs font-semibold text-muted transition-colors hover:text-[#111113] disabled:cursor-not-allowed disabled:opacity-40 dark:hover:text-white"
                  >
                    Limpiar
                  </button>

                  <button
                    type="button"
                    onClick={() => setFiltersOpen(false)}
                    className="ds-btn-primary flex-1"
                  >
                    {visibleShirts.length === 0
                      ? "0 camisas"
                      : visibleShirts.length === 1
                        ? "Ver 1 camisa"
                        : `Ver ${visibleShirts.length} camisas`}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
              initial={isMotionPaused ? false : { y: 40, opacity: 0, scale: 0.98 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={isMotionPaused ? undefined : { y: 32, opacity: 0, scale: 0.98 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              className="liquid-glass-active w-full rounded-t-2xl border-x-0 border-b-0 !bg-[#F7F6F3]/98 p-5 pb-8 text-[#111113] shadow-[0_-18px_48px_rgba(0,0,0,0.22)] sm:max-w-2xl sm:rounded-2xl sm:border sm:p-6 dark:!bg-[#0B0B0E]/98 dark:text-[#F8FAFC]"
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

              {/* All sizes visible cleanly with flex-wrap (zero horizontal scroll or arrows) */}
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2 py-0.5">
                {sheetSizes.map((size) => (
                  <motion.button
                    key={size}
                    type="button"
                    whileHover={isMotionPaused ? undefined : { scale: 1.05 }}
                    whileTap={isMotionPaused ? undefined : { scale: 0.93 }}
                    transition={{ type: "spring", stiffness: 320, damping: 26 }}
                    onClick={() => handleSelectSize(size)}
                    aria-label={`Agregar ${sizeSheetShirt.name} talle ${size}`}
                    className="cursor-pointer flex h-11 min-w-[52px] items-center justify-center rounded-full border border-black/14 bg-white/90 px-4 text-sm font-semibold text-[#111113] transition-colors hover:bg-[#16233B] hover:text-white dark:border-white/18 dark:bg-white/[0.08] dark:text-white dark:hover:bg-white dark:hover:text-[#0B0B0E]"
                  >
                    {size}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
