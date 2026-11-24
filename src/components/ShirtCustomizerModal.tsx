"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  MessageCircle,
  Ruler,
  ShoppingBag,
  Sparkles,
  X,
} from "lucide-react";
import {
  COLLAR_OPTIONS,
  CUFF_OPTIONS,
  FIT_OPTIONS,
  MONOGRAM_PLACEMENTS,
  STANDARD_SIZES,
  buildSingleShirtWhatsAppUrl,
  formatMonogramDisplay,
  type CatalogShirt,
  type CollarOption,
  type CuffOption,
  type FitOption,
  type MonogramPlacement,
  type ShirtCustomization,
  type StandardSize,
} from "@/data/catalog";
import { formatFabricPrice } from "@/data/fabrics";
import { useAtelier } from "@/context/AtelierContext";
import { ShirtArtwork } from "@/components/ShirtArtwork";

function CustomizerForm({
  shirt,
  onClose,
}: {
  shirt: CatalogShirt;
  onClose: () => void;
}) {
  const { currency, addToSelection, openDrawer } = useAtelier();

  const [fit, setFit] = useState<FitOption>("Clásico Anatómico");
  const [collar, setCollar] = useState<CollarOption>("Italiano");
  const [cuff, setCuff] = useState<CuffOption>("Simple Biselado");
  const [monogramText, setMonogramText] = useState("CM");
  const [monogramPlacement, setMonogramPlacement] =
    useState<MonogramPlacement>("Puño izquierdo");
  const [sizingMode, setSizingMode] = useState<"bespoke" | "standard">(
    "bespoke"
  );
  const [standardSize, setStandardSize] = useState<StandardSize>("40");

  const customization: ShirtCustomization = {
    fit,
    collar,
    cuff,
    monogramText,
    monogramPlacement,
    sizingMode,
    standardSize,
  };

  const monogramDisplay = formatMonogramDisplay(monogramText);
  const formattedPrice = formatFabricPrice(shirt.priceArs, currency);
  const whatsappUrl = buildSingleShirtWhatsAppUrl(
    shirt,
    customization,
    currency
  );

  const handleAdd = () => {
    addToSelection(shirt, customization);
    onClose();
    openDrawer();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="customizer-modal-title"
      data-lenis-prevent
      className="relative grid max-h-[92svh] w-full max-w-5xl grid-cols-1 overflow-y-auto rounded-3xl border border-white/[0.12] bg-obsidian shadow-[0_32px_100px_rgba(0,0,0,0.85)] lg:grid-cols-12 lg:overflow-hidden"
    >
      {/* Close Button */}
      <button
        id="customizer-close-btn"
        type="button"
        onClick={onClose}
        aria-label="Cerrar configurador"
        className="cursor-pointer absolute top-4 right-4 z-30 inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.12] bg-obsidian/85 text-primary backdrop-blur-md transition-colors hover:border-champagne/60 hover:text-champagne focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-champagne"
      >
        <X className="h-4 w-4" aria-hidden="true" />
      </button>

      {/* Left Column: Live Shirt & Embroidered Initials Preview */}
      <div className="relative flex flex-col justify-between border-b border-white/[0.08] bg-elevated p-5 sm:p-6 lg:col-span-5 lg:border-r lg:border-b-0">
        <div>
          <div className="flex items-center justify-between gap-2 pr-10 lg:pr-0">
            <span className="font-mono text-[10px] tracking-[0.2em] text-champagne uppercase">
              VISTA PREVIA EN VIVO
            </span>
            <span className="font-mono text-[10px] tracking-[0.16em] text-muted uppercase">
              {shirt.refCode}
            </span>
          </div>

          <div className="relative mt-4 aspect-[4/4.6] w-full overflow-hidden rounded-2xl border border-white/[0.09] shadow-2xl">
            <ShirtArtwork
              shirt={shirt}
              collar={collar}
              cuff={cuff}
              monogramDisplay={monogramDisplay}
              monogramPlacement={monogramPlacement}
              interactivePreview
              uidPrefix="modal"
            />

            {/* Live Embroidered Monogram Callout Badge */}
            <div className="pointer-events-none absolute top-3.5 left-3.5 rounded-full border border-champagne/40 bg-obsidian/85 px-3 py-1 backdrop-blur-md">
              <span className="font-mono text-[9.5px] tracking-[0.16em] text-champagne uppercase">
                {monogramDisplay
                  ? `Bordado ${monogramDisplay} · ${monogramPlacement}`
                  : "Sin iniciales bordadas"}
              </span>
            </div>
          </div>
        </div>

        {/* Live Spec Summary */}
        <div className="mt-5 rounded-2xl border border-white/[0.08] bg-obsidian/70 p-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3
                id="customizer-modal-title"
                className="font-display text-lg font-bold tracking-[-0.02em] text-primary"
              >
                {shirt.name}
              </h3>
              <p className="mt-0.5 font-mono text-[10px] tracking-[0.14em] text-muted uppercase">
                {shirt.fabricLabel} · {shirt.refCode}
              </p>
            </div>
            <span className="font-mono text-base font-medium text-primary tabular-nums shrink-0">
              {formattedPrice}
            </span>
          </div>

          <div className="mt-3 flex flex-wrap gap-1.5 font-mono text-[9.5px] tracking-[0.12em] text-muted uppercase">
            <span className="rounded-md border border-white/[0.08] px-2 py-0.5 text-primary/90">
              {fit}
            </span>
            <span className="rounded-md border border-white/[0.08] px-2 py-0.5 text-primary/90">
              Cuello {collar}
            </span>
            <span className="rounded-md border border-white/[0.08] px-2 py-0.5 text-primary/90">
              Puño {cuff}
            </span>
          </div>
        </div>
      </div>

      {/* Right Column: 5-Step Bespoke Configurator */}
      <div
        data-lenis-prevent
        className="flex flex-col justify-between p-5 sm:p-7 lg:col-span-7 lg:max-h-[92svh] lg:overflow-y-auto"
      >
        <div className="space-y-6 pr-1">
          <div>
            <p className="font-mono text-[10px] tracking-[0.22em] text-cyan uppercase">
              CONFIGURADOR ATELIER · 5 PASOS
            </p>
            <p className="mt-1 text-sm text-muted">
              Personalizá cada detalle de tu camisa. La confección a medida y el
              bordado de iniciales están incluidos sin costo extra.
            </p>
          </div>

          {/* Step 1: Calce */}
          <div>
            <label className="block font-mono text-[11px] font-medium tracking-[0.18em] text-primary uppercase">
              01 · Calce
            </label>
            <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-3">
              {FIT_OPTIONS.map((option) => {
                const active = fit === option;
                return (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setFit(option)}
                    className={`cursor-pointer rounded-xl border px-3.5 py-2.5 text-left text-xs font-medium transition-all ${
                      active
                        ? "border-champagne bg-champagne/15 text-primary"
                        : "border-white/[0.09] bg-elevated text-muted hover:border-white/[0.2] hover:text-primary"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2: Cuello */}
          <div>
            <label className="block font-mono text-[11px] font-medium tracking-[0.18em] text-primary uppercase">
              02 · Cuello
            </label>
            <div className="mt-2.5 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {COLLAR_OPTIONS.map((option) => {
                const active = collar === option;
                return (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setCollar(option)}
                    className={`cursor-pointer rounded-xl border px-3 py-2.5 text-center text-xs font-medium transition-all ${
                      active
                        ? "border-champagne bg-champagne/15 text-primary"
                        : "border-white/[0.09] bg-elevated text-muted hover:border-white/[0.2] hover:text-primary"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3: Puños */}
          <div>
            <label className="block font-mono text-[11px] font-medium tracking-[0.18em] text-primary uppercase">
              03 · Puños
            </label>
            <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
              {CUFF_OPTIONS.map((option) => {
                const active = cuff === option;
                return (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={active}
                    onClick={() => setCuff(option)}
                    className={`cursor-pointer rounded-xl border px-3.5 py-2.5 text-left text-xs font-medium transition-all ${
                      active
                        ? "border-champagne bg-champagne/15 text-primary"
                        : "border-white/[0.09] bg-elevated text-muted hover:border-white/[0.2] hover:text-primary"
                    }`}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 4: Iniciales Bordadas (Sin cargo) */}
          <div className="rounded-2xl border border-champagne/25 bg-champagne/[0.04] p-4">
            <div className="flex items-center justify-between gap-2">
              <label
                htmlFor="monogram-input"
                className="flex items-center gap-1.5 font-mono text-[11px] font-medium tracking-[0.18em] text-champagne uppercase"
              >
                <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
                <span>04 · Iniciales Bordadas (Sin cargo)</span>
              </label>
              <span className="font-mono text-[10px] tracking-[0.14em] text-muted uppercase">
                Hasta 3 letras
              </span>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-12">
              <div className="sm:col-span-5">
                <input
                  id="monogram-input"
                  type="text"
                  maxLength={3}
                  value={monogramText}
                  onChange={(e) =>
                    setMonogramText(
                      e.target.value
                        .toUpperCase()
                        .replace(/[^A-ZÁÉÍÓÚÑ]/g, "")
                        .slice(0, 3)
                    )
                  }
                  placeholder="Ej. CM"
                  className="w-full rounded-xl border border-white/[0.14] bg-obsidian px-3.5 py-2.5 font-mono text-sm tracking-[0.28em] text-champagne uppercase placeholder:text-muted/50 focus:border-champagne focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2 sm:col-span-7">
                {MONOGRAM_PLACEMENTS.map((place) => {
                  const active = monogramPlacement === place;
                  return (
                    <button
                      key={place}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setMonogramPlacement(place)}
                      className={`cursor-pointer rounded-xl border px-3 py-2.5 text-xs font-medium transition-all ${
                        active
                          ? "border-champagne bg-champagne/20 text-primary"
                          : "border-white/[0.09] bg-obsidian/70 text-muted hover:border-white/[0.2] hover:text-primary"
                      }`}
                    >
                      {place}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Step 5: Medida */}
          <div>
            <label className="block font-mono text-[11px] font-medium tracking-[0.18em] text-primary uppercase">
              05 · Medida
            </label>

            <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2">
              <button
                type="button"
                aria-pressed={sizingMode === "bespoke"}
                onClick={() => setSizingMode("bespoke")}
                className={`cursor-pointer flex items-center justify-between gap-2 rounded-xl border px-3.5 py-3 text-left transition-all ${
                  sizingMode === "bespoke"
                    ? "border-champagne bg-champagne/15 text-primary"
                    : "border-white/[0.09] bg-elevated text-muted hover:border-white/[0.2] hover:text-primary"
                }`}
              >
                <div>
                  <span className="block text-xs font-semibold">
                    Confección A Medida
                  </span>
                  <span className="mt-0.5 block font-mono text-[9.5px] tracking-[0.12em] text-champagne uppercase">
                    Sin costo extra · Coordinamos por WhatsApp
                  </span>
                </div>
                <Ruler
                  className="h-4 w-4 shrink-0 text-champagne"
                  aria-hidden="true"
                />
              </button>

              <button
                type="button"
                aria-pressed={sizingMode === "standard"}
                onClick={() => setSizingMode("standard")}
                className={`cursor-pointer flex items-center justify-between gap-2 rounded-xl border px-3.5 py-3 text-left transition-all ${
                  sizingMode === "standard"
                    ? "border-cyan bg-cyan/10 text-primary"
                    : "border-white/[0.09] bg-elevated text-muted hover:border-white/[0.2] hover:text-primary"
                }`}
              >
                <div>
                  <span className="block text-xs font-semibold">
                    Talle Estándar
                  </span>
                  <span className="mt-0.5 block font-mono text-[9.5px] tracking-[0.12em] text-muted uppercase">
                    38 a 46 o S a XL
                  </span>
                </div>
                {sizingMode === "standard" && (
                  <Check
                    className="h-4 w-4 shrink-0 text-cyan"
                    aria-hidden="true"
                  />
                )}
              </button>
            </div>

            {sizingMode === "standard" && (
              <div className="mt-3 flex flex-wrap gap-2">
                {STANDARD_SIZES.map((size) => {
                  const active = standardSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      aria-pressed={active}
                      onClick={() => setStandardSize(size)}
                      className={`cursor-pointer min-w-[44px] rounded-lg border px-3 py-1.5 font-mono text-xs transition-all ${
                        active
                          ? "border-cyan bg-cyan/20 text-primary font-medium"
                          : "border-white/[0.1] bg-elevated text-muted hover:border-white/[0.25] hover:text-primary"
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Modal CTAs */}
        <div className="mt-7 flex flex-col gap-3 border-t border-white/[0.08] pt-5 sm:flex-row">
          <button
            id="customizer-add-selection-btn"
            type="button"
            onClick={handleAdd}
            className="cursor-pointer inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-ivory px-6 py-3.5 text-xs font-semibold tracking-[0.06em] text-obsidian uppercase transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
          >
            <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            <span>Agregar a Mi Selección</span>
          </button>

          <a
            id="customizer-whatsapp-btn"
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full border border-champagne/45 bg-elevated px-5 py-3.5 text-xs font-medium tracking-[0.04em] text-primary transition-colors hover:border-champagne hover:bg-champagne/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
          >
            <MessageCircle
              className="h-4 w-4 text-champagne"
              aria-hidden="true"
            />
            <span>Consultar esta configuración por WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}

export function ShirtCustomizerModal() {
  const { customizingShirt, closeCustomizer } = useAtelier();

  useEffect(() => {
    if (!customizingShirt) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeCustomizer();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [customizingShirt, closeCustomizer]);

  return (
    <AnimatePresence>
      {customizingShirt && (
        <motion.div
          key="customizer-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeCustomizer();
          }}
          className="fixed inset-0 z-[80] flex items-center justify-center bg-black/75 p-3 sm:p-6 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="flex w-full justify-center"
          >
            <CustomizerForm
              key={customizingShirt.id}
              shirt={customizingShirt}
              onClose={closeCustomizer}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
