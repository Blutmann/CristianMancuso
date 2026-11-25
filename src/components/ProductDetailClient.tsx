"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Ruler,
  Shirt,
  ShoppingBag,
  ZoomIn,
} from "lucide-react";
import {
  ALPHA_SIZES,
  CATALOG_SHIRTS,
  NUMERIC_SIZES,
  type CatalogShirt,
  type CommercialSize,
} from "@/data/catalog";
import { useAtelier } from "@/context/AtelierContext";
import { useMotion } from "@/context/MotionContext";
import { TailorFabricSwatch } from "@/components/TailorFabricSwatch";

function formatArsClean(amount: number): string {
  return `$${amount.toLocaleString("es-AR")}`;
}

function getEditorialDescription(shirt: CatalogShirt): string {
  if (shirt.fabricId === "pima") {
    return `${shirt.composition}. Hilado de fibra extra larga del valle de Piura con caída fluida, brillo satinado discreto y costura francesa.`;
  }
  if (shirt.fabricId === "italiano") {
    return `${shirt.composition}. Tejedurías del norte de Italia con trama respirable, frescura natural y calce sastrero.`;
  }
  if (shirt.fabricId === "donna") {
    return `${shirt.composition}. Moldería anatómica femenina diseñada en nuestro atelier con botones perlados.`;
  }
  return `${shirt.composition}. Algodón de uso diario con excelente estructura y planchado ágil.`;
}

export function ProductDetailClient({ shirt }: { shirt: CatalogShirt }) {
  const { addToSelection, openDrawer } = useAtelier();
  const { isMotionPaused } = useMotion();

  const sizes = shirt.sizeType === "alpha" ? ALPHA_SIZES : NUMERIC_SIZES;
  const defaultSize: CommercialSize = shirt.sizeType === "alpha" ? "M" : "40";
  const [selectedSize, setSelectedSize] = useState<CommercialSize>(defaultSize);
  const [viewMode, setViewMode] = useState<"prenda" | "tejido">("prenda");
  const [justAdded, setJustAdded] = useState(false);

  const installmentArs = Math.round(shirt.priceArs / 3);

  const relatedShirts = CATALOG_SHIRTS.filter((s) => s.id !== shirt.id)
    .sort((a, b) =>
      a.fabricId === shirt.fabricId && b.fabricId !== shirt.fabricId ? -1 : 1
    )
    .slice(0, 4);

  const handleAddToCart = () => {
    addToSelection(shirt, {
      mode: "commercial",
      commercialSize: selectedSize,
    });
    setJustAdded(true);
    openDrawer();
    window.setTimeout(() => setJustAdded(false), 1800);
  };

  return (
    <div className="mx-auto w-full max-w-[1360px] px-5 pt-24 pb-16 sm:px-8 sm:pt-28 lg:px-10">
      {/* Subtle Back Link */}
      <Link
        href="/coleccion"
        className="inline-flex min-h-[40px] items-center gap-2 text-xs font-medium text-muted transition-colors hover:text-[#111113] dark:hover:text-white"
      >
        <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
        <span>Volver a Colección</span>
      </Link>

      {/* 2-Column Clean PDP Layout */}
      <div className="mt-6 grid grid-cols-1 items-start gap-10 lg:grid-cols-12 lg:gap-12">
        {/* LEFT COLUMN: Large Product Image + Vista Prenda / Muestra de Tela Toggle */}
        <div className="flex flex-col items-center lg:col-span-6">
          <div className="liquid-glass relative flex aspect-[3/4] max-h-[520px] w-full items-center justify-center overflow-hidden rounded-2xl">
            <AnimatePresence mode="wait">
              {viewMode === "prenda" ? (
                <motion.div
                  key="pdp-prenda"
                  initial={isMotionPaused ? false : { opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={isMotionPaused ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="relative flex h-full w-full items-center justify-center p-6 pb-9"
                >
                  <div className="relative h-full w-full">
                    <Image
                      src={shirt.studioImage}
                      alt={shirt.name}
                      fill
                      priority
                      sizes="(min-width: 1024px) 520px, 90vw"
                      className="object-contain drop-shadow-[0_24px_34px_rgba(17,17,19,0.22)] dark:drop-shadow-[0_28px_42px_rgba(0,0,0,0.62)]"
                    />
                  </div>
                  <span
                    aria-hidden="true"
                    className="pointer-events-none absolute bottom-4 left-1/2 h-4 w-44 -translate-x-1/2 rounded-full bg-[#111113] opacity-20 blur-xl dark:bg-black dark:opacity-55"
                  />
                </motion.div>
              ) : (
                <motion.div
                  key="pdp-tejido"
                  initial={isMotionPaused ? false : { opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={isMotionPaused ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.32 }}
                  className="flex h-full w-full items-center justify-center"
                >
                  <TailorFabricSwatch shirt={shirt} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Subtle View Toggle below photo */}
          <div
            role="radiogroup"
            aria-label="Vista del producto"
            className="liquid-glass mt-4 inline-flex items-center rounded-full p-1"
          >
            <button
              type="button"
              role="radio"
              aria-checked={viewMode === "prenda"}
              onClick={() => setViewMode("prenda")}
              className={`cursor-pointer inline-flex min-h-[38px] items-center gap-1.5 rounded-full px-4 text-xs font-medium transition-colors ${
                viewMode === "prenda"
                  ? "bg-[#16233B] text-white dark:bg-white dark:text-[#0B0B0E]"
                  : "text-[#111113]/70 hover:text-[#111113] dark:text-white/70 dark:hover:text-white"
              }`}
            >
              <Shirt className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Vista Prenda</span>
            </button>
            <button
              type="button"
              role="radio"
              aria-checked={viewMode === "tejido"}
              onClick={() => setViewMode("tejido")}
              className={`cursor-pointer inline-flex min-h-[38px] items-center gap-1.5 rounded-full px-4 text-xs font-medium transition-colors ${
                viewMode === "tejido"
                  ? "bg-[#16233B] text-white dark:bg-white dark:text-[#0B0B0E]"
                  : "text-[#111113]/70 hover:text-[#111113] dark:text-white/70 dark:hover:text-white"
              }`}
            >
              <ZoomIn className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Muestra de Tela</span>
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: Details, Commercial Size, Add to Cart, Bespoke Shortcut */}
        <div className="flex flex-col lg:col-span-6 lg:pt-2">
          <div className="flex flex-wrap items-center gap-2.5 text-xs text-muted">
            <span className="ds-caption uppercase">{shirt.fabricLabel}</span>
            <span aria-hidden="true" className="opacity-35">
              ·
            </span>
            <span className="ds-mono text-[11px]">{shirt.refCode}</span>
          </div>

          <h1 className="ds-h1-page mt-2.5">{shirt.name}</h1>

          {/* Price + 3 Installments */}
          <div className="mt-4 flex items-baseline gap-3">
            <span className="font-sans text-2xl font-semibold text-[#111113] tabular-nums dark:text-white">
              {formatArsClean(shirt.priceArs)}
            </span>
            {shirt.compareAtArs && (
              <span className="font-sans text-sm text-muted line-through tabular-nums">
                {formatArsClean(shirt.compareAtArs)}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs font-medium text-[#16233B] dark:text-gold">
            3 cuotas sin interés de {formatArsClean(installmentArs)}
          </p>

          {/* Editorial Description */}
          <p className="ds-body mt-5 text-muted">
            {getEditorialDescription(shirt)}
          </p>

          {/* Commercial Size Selector — 1 Single Row */}
          <div className="mt-7">
            <div className="flex items-center justify-between">
              <span className="ds-caption font-semibold text-[#111113] uppercase dark:text-white">
                Talle comercial
              </span>
              <Link
                href="/como-medir"
                className="inline-flex items-center gap-1 text-xs text-muted underline-offset-4 hover:text-[#111113] hover:underline dark:hover:text-white"
              >
                <Ruler className="h-3 w-3" aria-hidden="true" />
                <span>Guía de medidas</span>
              </Link>
            </div>

            <div
              className={`mt-2.5 grid gap-2 ${
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
                    className={`cursor-pointer flex min-h-[44px] w-full items-center justify-center rounded-full text-xs font-semibold transition-all ${
                      active
                        ? "bg-[#16233B] text-white shadow-sm dark:bg-white dark:text-[#0B0B0E]"
                        : "border border-black/12 bg-white/75 text-[#111113]/85 hover:bg-white dark:border-white/16 dark:bg-white/[0.06] dark:text-white/85 dark:hover:bg-white/[0.14]"
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Primary CTA: Agregar al carrito */}
          <div className="mt-7 space-y-3">
            <button
              id="pdp-add-to-cart"
              type="button"
              onClick={handleAddToCart}
              className="ds-btn-primary w-full min-h-[48px] shadow-lg"
            >
              {justAdded ? (
                <>
                  <Check className="h-4 w-4" aria-hidden="true" />
                  <span>Agregada a tu bolsa</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                  <span>Agregar al carrito</span>
                </>
              )}
            </button>

            <p className="text-center text-xs text-muted">
              Despacho en 24–48 hs · Cambios y ajustes sin cargo
            </p>

            {/* Secondary Clean Bespoke Link */}
            <Link
              href={`/a-medida?tela=${encodeURIComponent(shirt.id)}`}
              className="ds-btn-secondary w-full min-h-[48px]"
            >
              <span>¿La querés a medida? Armala sin cargo</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>

      {/* RELATED SUGGESTIONS: También te puede interesar */}
      <section
        aria-labelledby="related-heading"
        className="mt-16 border-t border-black/10 pt-12 dark:border-white/10"
      >
        <h2 id="related-heading" className="ds-h2">
          También te puede interesar
        </h2>

        <div className="mt-6 grid grid-cols-2 gap-5 md:grid-cols-4">
          {relatedShirts.map((item) => (
            <Link
              key={item.id}
              href={`/coleccion/${item.id}`}
              className="group liquid-glass flex flex-col overflow-hidden rounded-2xl p-3 transition-all duration-300 hover:-translate-y-0.5 hover:border-black/20 dark:hover:border-white/28"
            >
              <div className="relative aspect-[4/4.4] w-full">
                <Image
                  src={item.studioImage}
                  alt={item.name}
                  fill
                  sizes="(min-width: 768px) 25vw, 50vw"
                  className="object-contain p-2 drop-shadow-[0_10px_14px_rgba(17,17,19,0.18)] transition-transform duration-500 group-hover:scale-[1.04] dark:drop-shadow-[0_12px_18px_rgba(0,0,0,0.5)]"
                />
              </div>
              <div className="mt-2 px-1">
                <p className="ds-h3 truncate text-xs sm:text-sm">{item.name}</p>
                <p className="mt-0.5 font-sans text-xs font-medium text-muted tabular-nums">
                  {formatArsClean(item.priceArs)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
