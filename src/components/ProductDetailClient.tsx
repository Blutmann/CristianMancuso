"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Check,
  Ruler,
  Shirt,
  ShoppingBag,
  SwatchBook,
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
  const [viewMode, setViewMode] = useState<
    "prenda" | "cuello" | "tejido" | "puno"
  >("prenda");
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

  const cycleMobileView = () => {
    setViewMode((prev) =>
      prev === "prenda"
        ? "cuello"
        : prev === "cuello"
          ? "tejido"
          : prev === "tejido"
            ? "puno"
            : "prenda"
    );
  };

  return (
    <div className="mx-auto w-full max-w-[1360px] px-5 pt-24 pb-16 sm:px-8 sm:pt-28 lg:px-10">
      {/* Accessible Breadcrumbs */}
      <nav
        aria-label="Breadcrumb"
        className="flex flex-wrap items-center gap-2 text-xs text-muted"
      >
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link
              href="/coleccion"
              className="transition-colors hover:text-[#111113] dark:hover:text-white"
            >
              Colección
            </Link>
          </li>
          <li aria-hidden="true" className="opacity-40">
            /
          </li>
          <li>
            <Link
              href={`/coleccion?gama=${encodeURIComponent(shirt.fabricId)}`}
              className="transition-colors hover:text-[#111113] dark:hover:text-white"
            >
              {shirt.fabricLabel}
            </Link>
          </li>
          <li aria-hidden="true" className="opacity-40">
            /
          </li>
          <li
            aria-current="page"
            className="font-medium text-[#111113] dark:text-[#F8FAFC]"
          >
            {shirt.name}
          </li>
        </ol>
      </nav>

      {/* 2-Column Clean PDP Layout */}
      <div className="mt-4 grid grid-cols-1 items-start gap-5 lg:mt-6 lg:grid-cols-12 lg:gap-10">
        {/* LEFT COLUMN: Desktop Vertical 3-Thumbnail Strip + Main Photo Stage */}
        <div className="flex flex-col items-center gap-3 lg:col-span-6 lg:flex-row lg:items-start lg:gap-3.5">
          {/* Desktop (lg+) Vertical 4-Thumbnail Strip on the Left — full height of main card */}
          <div
            role="tablist"
            aria-label="Vistas del producto"
            className="hidden shrink-0 flex-col justify-between gap-3 lg:flex lg:h-[520px]"
          >
            {/* Thumbnail 1: Vista Prenda */}
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === "prenda"}
              aria-label="Vista Prenda"
              title="Vista Prenda"
              onClick={() => setViewMode("prenda")}
              className={`cursor-pointer relative w-24 flex-1 overflow-hidden rounded-2xl bg-[#F4F1EC] transition-all xl:w-28 dark:bg-[#0E0F13] ${
                viewMode === "prenda"
                  ? "border-2 border-[#16233B] opacity-100 shadow-md dark:border-white"
                  : "border border-black/10 opacity-75 hover:opacity-100 dark:border-white/15"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={shirt.studioImage}
                alt={`${shirt.name} — Vista prenda`}
                className="h-full w-full object-contain p-1 dark:hidden"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={shirt.studioImageDark}
                alt={`${shirt.name} — Vista prenda`}
                className="hidden h-full w-full object-contain p-1 dark:block"
              />
            </button>

            {/* Thumbnail 2: Detalle Cuello / Botones */}
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === "cuello"}
              aria-label="Detalle Cuello y Botones"
              title="Detalle Cuello / Botones"
              onClick={() => setViewMode("cuello")}
              className={`cursor-pointer relative w-24 flex-1 overflow-hidden rounded-2xl bg-[#F4F1EC] transition-all xl:w-28 dark:bg-[#0E0F13] ${
                viewMode === "cuello"
                  ? "border-2 border-[#16233B] opacity-100 shadow-md dark:border-white"
                  : "border border-black/10 opacity-75 hover:opacity-100 dark:border-white/15"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={shirt.studioImage}
                alt={`${shirt.name} — Detalle cuello y botones`}
                className="h-full w-full origin-top scale-[1.85] object-cover object-top dark:hidden"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={shirt.studioImageDark}
                alt={`${shirt.name} — Detalle cuello y botones`}
                className="hidden h-full w-full origin-top scale-[1.85] object-cover object-top dark:block"
              />
            </button>

            {/* Thumbnail 3: Muestra de Tela */}
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === "tejido"}
              aria-label="Muestra de Tela"
              title="Muestra de Tela"
              onClick={() => setViewMode("tejido")}
              style={{ backgroundColor: shirt.baseHex }}
              className={`cursor-pointer relative w-24 flex-1 overflow-hidden rounded-2xl transition-all xl:w-28 ${
                viewMode === "tejido"
                  ? "border-2 border-[#16233B] opacity-100 shadow-md dark:border-white"
                  : "border border-black/10 opacity-75 hover:opacity-100 dark:border-white/15"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={shirt.studioImage}
                alt={`${shirt.name} — Muestra de tela`}
                className="h-full w-full scale-[3.2] object-cover object-center"
              />
            </button>

            {/* Thumbnail 4: Detalle Puño / Confección */}
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === "puno"}
              aria-label="Detalle Puño y Confección"
              title="Detalle Puño / Confección"
              onClick={() => setViewMode("puno")}
              className={`cursor-pointer relative w-24 flex-1 overflow-hidden rounded-2xl bg-[#F4F1EC] transition-all xl:w-28 dark:bg-[#0E0F13] ${
                viewMode === "puno"
                  ? "border-2 border-[#16233B] opacity-100 shadow-md dark:border-white"
                  : "border border-black/10 opacity-75 hover:opacity-100 dark:border-white/15"
              }`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={shirt.studioImage}
                alt={`${shirt.name} — Detalle puño y confección`}
                className="h-full w-full origin-bottom-left scale-[1.75] object-cover object-bottom dark:hidden"
              />
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={shirt.studioImageDark}
                alt={`${shirt.name} — Detalle puño y confección`}
                className="hidden h-full w-full origin-bottom-left scale-[1.75] object-cover object-bottom dark:block"
              />
            </button>
          </div>

          {/* Main Photo Stage — Liquid Glass */}
          <div className="liquid-glass relative flex h-[38svh] min-h-[260px] max-h-[340px] w-full flex-1 items-center justify-center overflow-hidden rounded-3xl !bg-white/35 shadow-[0_20px_50px_rgba(22,35,59,0.10)] lg:aspect-[4/4.6] lg:h-[520px] lg:w-auto lg:min-h-0 lg:max-h-[540px] lg:flex-none dark:!bg-[#0E0F13]/82 dark:shadow-[0_24px_60px_rgba(0,0,0,0.52)]">
            {/* Top crystalline Liquid Glass specular highlight */}
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-x-0 top-0 z-10 h-24 bg-gradient-to-b from-white/45 via-white/12 to-transparent dark:from-white/14 dark:via-white/[0.03]"
            />

            <AnimatePresence mode="wait">
              {viewMode === "prenda" && (
                <motion.div
                  key="pdp-prenda"
                  initial={isMotionPaused ? false : { opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={isMotionPaused ? undefined : { opacity: 0 }}
                  transition={{ type: "spring", stiffness: 320, damping: 26 }}
                  className="relative h-full w-full p-0"
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
                      loading="eager"
                      fetchPriority="high"
                      className="h-full w-full object-cover object-center mix-blend-multiply brightness-[1.06] contrast-[1.03] [mask-image:radial-gradient(ellipse_90%_94%_at_50%_48%,black_72%,transparent_100%)] dark:brightness-100 dark:contrast-100"
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
                      loading="eager"
                      fetchPriority="high"
                      className="h-full w-full object-cover object-center dark:[mask-image:radial-gradient(ellipse_88%_92%_at_50%_48%,black_68%,transparent_100%)]"
                    />
                  </picture>
                </motion.div>
              )}

              {viewMode === "cuello" && (
                <motion.div
                  key="pdp-cuello"
                  initial={isMotionPaused ? false : { opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={isMotionPaused ? undefined : { opacity: 0 }}
                  transition={{ type: "spring", stiffness: 320, damping: 26 }}
                  className="relative h-full w-full overflow-hidden"
                >
                  <picture className="block h-full w-full dark:hidden">
                    <source
                      media="(min-width: 768px)"
                      srcSet={shirt.studioImageHd}
                      type="image/webp"
                    />
                    <img
                      src={shirt.studioImage}
                      alt={`${shirt.name} — Detalle de cuello y botones`}
                      className="h-full w-full origin-top scale-[1.85] object-cover object-top mix-blend-multiply brightness-[1.06] contrast-[1.03] [mask-image:radial-gradient(ellipse_90%_94%_at_50%_48%,black_72%,transparent_100%)] dark:brightness-100 dark:contrast-100"
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
                      alt={`${shirt.name} — Detalle de cuello y botones`}
                      className="h-full w-full origin-top scale-[1.85] object-cover object-top dark:[mask-image:radial-gradient(ellipse_88%_92%_at_50%_48%,black_68%,transparent_100%)]"
                    />
                  </picture>
                </motion.div>
              )}

              {viewMode === "tejido" && (
                <motion.div
                  key="pdp-tejido"
                  initial={isMotionPaused ? false : { opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={isMotionPaused ? undefined : { opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="flex h-full w-full items-center justify-center"
                >
                  <TailorFabricSwatch shirt={shirt} />
                </motion.div>
              )}

              {viewMode === "puno" && (
                <motion.div
                  key="pdp-puno"
                  initial={isMotionPaused ? false : { opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={isMotionPaused ? undefined : { opacity: 0 }}
                  transition={{ type: "spring", stiffness: 320, damping: 26 }}
                  className="relative h-full w-full overflow-hidden"
                >
                  <picture className="block h-full w-full dark:hidden">
                    <source
                      media="(min-width: 768px)"
                      srcSet={shirt.studioImageHd}
                      type="image/webp"
                    />
                    <img
                      src={shirt.studioImage}
                      alt={`${shirt.name} — Detalle de puño y confección`}
                      className="h-full w-full origin-bottom-left scale-[1.75] object-cover object-bottom mix-blend-multiply brightness-[1.06] contrast-[1.03] [mask-image:radial-gradient(ellipse_90%_94%_at_50%_48%,black_72%,transparent_100%)] dark:brightness-100 dark:contrast-100"
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
                      alt={`${shirt.name} — Detalle de puño y confección`}
                      className="h-full w-full origin-bottom-left scale-[1.75] object-cover object-bottom dark:[mask-image:radial-gradient(ellipse_88%_92%_at_50%_48%,black_68%,transparent_100%)]"
                    />
                  </picture>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Mobile (< lg) Compact Icon-Only Circular Liquid Glass View Switcher inside bottom-right corner */}
            <motion.button
              type="button"
              whileHover={isMotionPaused ? undefined : { scale: 1.06 }}
              whileTap={isMotionPaused ? undefined : { scale: 0.92 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              onClick={cycleMobileView}
              aria-label={
                viewMode === "prenda"
                  ? "Ver muestra de tela"
                  : viewMode === "tejido"
                    ? "Ver detalle de cuello y botón"
                    : "Volver a vista de prenda"
              }
              title={
                viewMode === "prenda"
                  ? "Ver muestra de tela"
                  : viewMode === "tejido"
                    ? "Ver detalle cuello"
                    : "Ver prenda"
              }
              className="liquid-glass cursor-pointer absolute right-3 bottom-3 z-20 inline-flex h-10 w-10 items-center justify-center rounded-full text-[#111113] shadow-sm transition-colors hover:border-black/25 lg:hidden dark:text-white dark:hover:border-white/30"
            >
              {viewMode === "prenda" ? (
                <SwatchBook className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Shirt className="h-4 w-4" aria-hidden="true" />
              )}
            </motion.button>
          </div>
        </div>

        {/* RIGHT COLUMN: Details, Commercial Size, Add to Cart, Bespoke Shortcut */}
        <div className="flex flex-col lg:col-span-6 lg:pt-2">
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted lg:gap-2.5">
            <span className="ds-caption uppercase">{shirt.fabricLabel}</span>
            <span aria-hidden="true" className="opacity-35">
              ·
            </span>
            <span className="ds-mono text-[11px]">{shirt.refCode}</span>
          </div>

          <h1 className="mt-1.5 text-xl font-semibold tracking-tight text-[#111113] sm:text-2xl lg:mt-2 dark:text-white">
            {shirt.name}
          </h1>

          {/* Price + 3 Installments */}
          <div className="mt-2.5 flex items-baseline gap-3 lg:mt-4">
            <span className="font-sans text-2xl font-semibold text-[#111113] tabular-nums dark:text-white">
              {formatArsClean(shirt.priceArs)}
            </span>
            {shirt.compareAtArs && (
              <span className="font-sans text-sm text-muted line-through tabular-nums">
                {formatArsClean(shirt.compareAtArs)}
              </span>
            )}
          </div>
          <p className="mt-0.5 text-xs font-medium text-[#16233B] lg:mt-1 dark:text-gold">
            3 cuotas sin interés de {formatArsClean(installmentArs)}
          </p>

          {/* Editorial Description */}
          <p className="ds-body mt-3 hidden text-muted sm:block lg:mt-5">
            {getEditorialDescription(shirt)}
          </p>

          {/* Commercial Size Selector — 1 Single Row (Border + Glass Tint Active State) */}
          <div className="mt-4 lg:mt-7">
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
              className={`mt-2 grid gap-2 lg:mt-2.5 ${
                shirt.sizeType === "alpha"
                  ? "grid-cols-3 sm:grid-cols-6"
                  : "grid-cols-5"
              }`}
            >
              {sizes.map((size) => {
                const active = selectedSize === size;
                return (
                  <motion.button
                    key={size}
                    type="button"
                    aria-pressed={active}
                    whileHover={isMotionPaused ? undefined : { scale: 1.04 }}
                    whileTap={isMotionPaused ? undefined : { scale: 0.94 }}
                    transition={{ type: "spring", stiffness: 320, damping: 26 }}
                    onClick={() => setSelectedSize(size)}
                    className={`cursor-pointer flex min-h-[40px] w-full items-center justify-center rounded-full text-xs font-semibold transition-colors lg:min-h-[44px] ${
                      active
                        ? "border-2 border-[#16233B] bg-[#16233B]/10 text-[#16233B] dark:border-white dark:bg-white/12 dark:text-white"
                        : "border border-black/12 bg-white/55 text-[#111113]/80 hover:border-black/25 hover:bg-white/80 dark:border-white/16 dark:bg-white/[0.04] dark:text-white/80 dark:hover:border-white/30 dark:hover:bg-white/[0.1]"
                    }`}
                  >
                    {size}
                  </motion.button>
                );
              })}
            </div>
          </div>

          {/* Primary CTA: Exclusive Solid Protagonist (#16233B / dark:bg-white) */}
          <div className="mt-4 space-y-2.5 lg:mt-7 lg:space-y-3">
            <motion.button
              id="pdp-add-to-cart"
              type="button"
              whileHover={isMotionPaused ? undefined : { scale: 1.01 }}
              whileTap={isMotionPaused ? undefined : { scale: 0.98 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
              onClick={handleAddToCart}
              className="ds-btn-primary min-h-[48px] w-full"
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
            </motion.button>

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
        className="mt-8 border-t border-black/10 pt-6 lg:mt-10 lg:pt-8 dark:border-white/10"
      >
        <h2 id="related-heading" className="ds-h2">
          También te puede interesar
        </h2>

        <div className="mt-6 grid grid-cols-2 gap-5 md:grid-cols-4">
          {relatedShirts.map((item) => (
            <motion.div
              key={item.id}
              whileHover={isMotionPaused ? undefined : { y: -4 }}
              transition={{ type: "spring", stiffness: 320, damping: 26 }}
            >
              <Link
                href={`/coleccion/${item.id}`}
                className="group liquid-glass flex h-full flex-col overflow-hidden rounded-2xl transition-colors duration-300 hover:border-black/20 dark:hover:border-white/28"
              >
                <div className="relative aspect-[4/4.4] w-full overflow-hidden bg-[#F4F1EC] dark:bg-[#0E0F13]">
                  <picture className="block h-full w-full dark:hidden">
                    <source
                      media="(min-width: 768px)"
                      srcSet={item.studioImageHd}
                      type="image/webp"
                    />
                    <img
                      src={item.studioImage}
                      alt={item.name}
                      loading="lazy"
                      className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </picture>
                  <picture className="hidden h-full w-full dark:block">
                    <source
                      media="(min-width: 768px)"
                      srcSet={item.studioImageDarkHd}
                      type="image/webp"
                    />
                    <img
                      src={item.studioImageDark}
                      alt={item.name}
                      loading="lazy"
                      className="h-full w-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.04]"
                    />
                  </picture>
                </div>
                <div className="p-3">
                  <p className="ds-h3 truncate text-xs sm:text-sm">{item.name}</p>
                  <p className="mt-0.5 font-sans text-xs font-medium text-muted tabular-nums">
                    {formatArsClean(item.priceArs)}
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
