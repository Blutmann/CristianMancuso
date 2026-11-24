"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Grid2x2, Grid3x3, Shirt, SwatchBook } from "lucide-react";
import {
  CATALOG_SHIRTS,
  type CatalogShirt,
  type ShirtBadge,
} from "@/data/catalog";
import type { FabricCategoryId } from "@/data/fabrics";
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
  const { isMotionPaused } = useMotion();
  const badge = getDiscreetBadge(shirt.badge);

  return (
    <Link
      href={`/coleccion/${shirt.id}`}
      className="group liquid-glass flex flex-col overflow-hidden rounded-2xl text-[#111113] transition-all duration-300 hover:-translate-y-0.5 hover:border-black/20 dark:text-white dark:hover:border-white/28"
    >
      {/* Visual Area: Floating Shirt OR Clean Square Fabric Macro */}
      <div
        className={`relative w-full overflow-hidden ${
          visualMode === "tela"
            ? "aspect-square"
            : isWide
              ? "aspect-[4/4.3]"
              : "aspect-[4/4.5]"
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
            {/* Soft floor shadow */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute bottom-3 left-1/2 h-2.5 w-24 -translate-x-1/2 rounded-full bg-[#111113] opacity-15 blur-md dark:bg-black dark:opacity-50"
            />
          </div>
        ) : (
          <div className="relative h-full w-full overflow-hidden">
            <Image
              src={shirt.studioImage}
              alt={`Detalle de tela ${shirt.name}`}
              fill
              sizes="(min-width: 1024px) 33vw, 50vw"
              className={`scale-[2.65] object-cover object-center ${
                isMotionPaused
                  ? ""
                  : "transition-transform duration-700 ease-out group-hover:scale-[2.85]"
              }`}
            />
          </div>
        )}

        {/* Discreet badge ONLY for DESTACADO / OFERTA */}
        {badge && (
          <span
            className={`pointer-events-none absolute right-3 top-3 z-10 rounded-full px-2.5 py-0.5 text-[9.5px] font-semibold tracking-[0.08em] uppercase ${badge.className}`}
          >
            {badge.label}
          </span>
        )}
      </div>

      {/* Ultra-clean Editorial Metadata: Name + Ref. Art. + Price */}
      <div className="flex flex-1 flex-col justify-between gap-2 px-4 py-3.5">
        <div>
          <h2 className="truncate font-display text-sm font-bold tracking-[-0.015em] text-[#111113] sm:text-[15px] dark:text-white">
            {shirt.name}
          </h2>
          <p className="mt-0.5 font-mono text-[10.5px] text-muted">
            {shirt.refCode}
          </p>
        </div>

        <div className="flex items-baseline gap-2 pt-0.5">
          <span className="font-mono text-sm font-semibold text-[#111113] tabular-nums dark:text-white">
            {formatArsClean(shirt.priceArs)}
          </span>
          {shirt.compareAtArs && (
            <span className="font-mono text-[11px] text-muted line-through tabular-nums">
              {formatArsClean(shirt.compareAtArs)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}

export function CatalogSection() {
  const { selectedFabric, setSelectedFabric } = useAtelier();
  const { isMotionPaused } = useMotion();
  const [gridCols, setGridCols] = useState<GridCols>(4);
  const [visualMode, setVisualMode] = useState<VisualMode>("camisa");

  // Sync ?gama= query param when arriving from Home's 4 Fabric Gamas
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const gama = params.get("gama") as FabricCategoryId | null;
    if (gama && VALID_GAMAS.has(gama)) {
      setSelectedFabric(gama);
    }
  }, [setSelectedFabric]);

  const visibleShirts = selectedFabric
    ? CATALOG_SHIRTS.filter((s) => s.fabricId === selectedFabric)
    : CATALOG_SHIRTS;

  return (
    <section
      id="coleccion"
      aria-labelledby="coleccion-heading"
      className="relative w-full bg-transparent pt-28 pb-16 text-[#111113] dark:text-white"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Clean Editorial Header */}
        <div className="flex flex-col gap-1.5">
          <h1
            id="coleccion-heading"
            className="font-display text-[clamp(1.9rem,3.4vw,2.75rem)] font-bold leading-[1.05] tracking-[-0.03em] text-[#111113] dark:text-white"
          >
            Colección
          </h1>
          <p className="text-sm text-muted">
            Prendas listas para enviar o confeccionadas a tu medida sin cargo.
          </p>
        </div>

        {/* Top Control Bar: Fabric Gama Filters + Visual Mode (Camisa/Tela) + Grid (3/4 cols) */}
        <div className="mt-6 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          {/* Category Filter Pills */}
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
                      className="absolute inset-0 rounded-full bg-[#111113] dark:bg-white"
                    />
                  )}
                  <span className="relative z-10">{option.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Controls: Visual (Camisa / Tela) + Grid (3 cols / 4 cols) */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Visual Mode Toggle */}
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
                    ? "bg-[#111113] text-white dark:bg-white dark:text-[#0B0B0E]"
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
                    ? "bg-[#111113] text-white dark:bg-white dark:text-[#0B0B0E]"
                    : "text-[#111113]/70 hover:text-[#111113] dark:text-white/70 dark:hover:text-white"
                }`}
              >
                <SwatchBook className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Tela</span>
              </button>
            </div>

            {/* Grid Columns Toggle (Desktop) */}
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
                    ? "bg-[#111113] text-white dark:bg-white dark:text-[#0B0B0E]"
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
                    ? "bg-[#111113] text-white dark:bg-white dark:text-[#0B0B0E]"
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
          <div
            className={`mt-7 grid grid-cols-2 gap-4 sm:gap-5 ${
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
