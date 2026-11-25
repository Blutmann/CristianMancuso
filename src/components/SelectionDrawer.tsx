"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  Check,
  Copy,
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import {
  buildSelectionPlainText,
  buildSelectionWhatsAppUrl,
  formatMeasurementsInline,
  formatMonogramDisplay,
} from "@/data/catalog";
import { formatFabricPrice } from "@/data/fabrics";
import { useAtelier } from "@/context/AtelierContext";

export function SelectionDrawer() {
  const {
    currency,
    selectionItems,
    totalSelectionCount,
    totalSelectionArs,
    isDrawerOpen,
    closeDrawer,
    updateItemQuantity,
    removeItem,
  } = useAtelier();

  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!isDrawerOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeDrawer();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  const whatsappUrl = buildSelectionWhatsAppUrl(selectionItems, currency);

  const handleCopyOrder = async () => {
    try {
      await navigator.clipboard.writeText(
        buildSelectionPlainText(selectionItems, currency)
      );
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API unavailable
    }
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <motion.div
          key="selection-drawer-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) closeDrawer();
          }}
          className="fixed inset-0 z-[85] flex justify-end bg-black/70 backdrop-blur-sm"
        >
          <motion.aside
            role="dialog"
            aria-modal="true"
            aria-labelledby="selection-drawer-title"
            data-lenis-prevent
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="liquid-glass-active flex h-full w-full max-w-md flex-col border-l border-black/10 !bg-[#F7F6F3]/95 text-[#111113] dark:border-white/16 dark:!bg-[#0B0B0E]/95 dark:text-[#F8FAFC]"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-black/10 px-6 py-5 dark:border-white/12">
              <div className="flex items-center gap-3">
                <ShoppingBag
                  className="h-4 w-4 text-[#16233B] dark:text-gold"
                  aria-hidden="true"
                />
                <div>
                  <h2 id="selection-drawer-title" className="ds-h3">
                    Mi Selección
                  </h2>
                  <p className="text-xs text-muted tabular-nums">
                    {totalSelectionCount}{" "}
                    {totalSelectionCount === 1 ? "prenda" : "prendas"}
                  </p>
                </div>
              </div>

              <button
                id="drawer-close-btn"
                type="button"
                onClick={closeDrawer}
                aria-label="Cerrar Mi Selección"
                className="liquid-glass cursor-pointer inline-flex h-11 w-11 items-center justify-center rounded-full text-[#111113] transition-colors hover:border-black/25 dark:text-white dark:hover:border-white/35"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {selectionItems.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center py-12 text-center">
                  <div className="liquid-glass flex h-14 w-14 items-center justify-center rounded-2xl">
                    <ShoppingBag
                      className="h-6 w-6 text-[#16233B] dark:text-gold"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="ds-h3 mt-5">Tu bolsa está vacía</h3>
                  <p className="ds-body mt-2 max-w-xs text-muted">
                    Elegí una camisa lista para enviar o armala a medida sin
                    costo extra.
                  </p>
                  <Link
                    href="/coleccion"
                    onClick={closeDrawer}
                    className="ds-btn-primary mt-6"
                  >
                    <span>Ir al catálogo</span>
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              ) : (
                <ul className="space-y-4">
                  {selectionItems.map((item) => {
                    const monogram = formatMonogramDisplay(
                      item.config.monogramText
                    );
                    const linePrice = formatFabricPrice(
                      item.shirt.priceArs * item.quantity,
                      currency
                    );

                    return (
                      <li
                        key={item.key}
                        className="liquid-glass rounded-2xl p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <span
                              aria-hidden="true"
                              className="mt-0.5 h-10 w-10 shrink-0 rounded-full border border-black/12 dark:border-white/16"
                              style={{ backgroundColor: item.shirt.baseHex }}
                            />
                            <div>
                              <h3 className="ds-h3 leading-snug">
                                {item.shirt.name}
                              </h3>
                              <p className="ds-mono text-[11px] text-muted">
                                {item.shirt.refCode}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeItem(item.key)}
                            aria-label={`Eliminar ${item.shirt.name}`}
                            className="cursor-pointer inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-muted transition-colors hover:bg-black/[0.06] hover:text-[#111113] dark:hover:bg-white/[0.08] dark:hover:text-white"
                          >
                            <Trash2 className="h-4 w-4" aria-hidden="true" />
                          </button>
                        </div>

                        {item.config.mode === "commercial" ? (
                          <p className="mt-2.5 text-xs text-muted">
                            Talle comercial{" "}
                            <span className="font-semibold text-[#111113] dark:text-white">
                              {item.config.commercialSize}
                            </span>{" "}
                            · Lista para enviar
                          </p>
                        ) : (
                          <div className="mt-2.5 space-y-1 text-xs text-muted">
                            <p>
                              A medida · Cuello {item.config.collar} · Botón{" "}
                              {item.config.button}
                              {monogram
                                ? ` · Iniciales ${monogram} (${item.config.monogramPlacement})`
                                : ""}
                            </p>
                            <p className="ds-mono text-[11px] text-[#111113]/80 dark:text-white/85">
                              {formatMeasurementsInline(
                                item.config.measurements
                              )}
                            </p>
                          </div>
                        )}

                        <div className="mt-4 flex items-center justify-between border-t border-black/10 pt-3 dark:border-white/10">
                          <div className="inline-flex items-center rounded-full border border-black/12 bg-black/[0.03] dark:border-white/14 dark:bg-white/[0.05]">
                            <button
                              type="button"
                              aria-label="Disminuir cantidad"
                              onClick={() => updateItemQuantity(item.key, -1)}
                              className="cursor-pointer inline-flex h-10 w-10 items-center justify-center rounded-full text-muted hover:text-[#111113] dark:hover:text-white"
                            >
                              <Minus className="h-3.5 w-3.5" aria-hidden="true" />
                            </button>
                            <span className="min-w-7 text-center font-sans text-xs font-semibold text-[#111113] tabular-nums dark:text-white">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              aria-label="Aumentar cantidad"
                              onClick={() => updateItemQuantity(item.key, 1)}
                              className="cursor-pointer inline-flex h-10 w-10 items-center justify-center rounded-full text-muted hover:text-[#111113] dark:hover:text-white"
                            >
                              <Plus className="h-3.5 w-3.5" aria-hidden="true" />
                            </button>
                          </div>

                          <span className="font-sans text-sm font-semibold text-[#111113] tabular-nums dark:text-white">
                            {linePrice}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Footer */}
            {selectionItems.length > 0 && (
              <div className="border-t border-black/10 bg-white/75 px-6 py-5 backdrop-blur-xl dark:border-white/12 dark:bg-[#14161D]/85">
                <div className="flex items-center justify-between text-xs text-muted">
                  <span>Confección a medida e iniciales</span>
                  <span className="font-semibold text-[#16233B] dark:text-gold">
                    Sin cargo
                  </span>
                </div>

                <div className="mt-2 flex items-baseline justify-between">
                  <span className="text-xs text-muted">Total estimado</span>
                  <span className="font-sans text-xl font-semibold text-[#111113] tabular-nums dark:text-white">
                    {formatFabricPrice(totalSelectionArs, currency)}
                  </span>
                </div>

                <div className="mt-4 space-y-2.5">
                  <a
                    id="drawer-whatsapp-order-btn"
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ds-btn-primary w-full"
                  >
                    <MessageCircle className="h-4 w-4" aria-hidden="true" />
                    <span>Enviar Pedido por WhatsApp</span>
                  </a>

                  <button
                    type="button"
                    onClick={handleCopyOrder}
                    className="ds-btn-secondary w-full"
                  >
                    {copied ? (
                      <>
                        <Check
                          className="h-3.5 w-3.5 text-[#16233B] dark:text-gold"
                          aria-hidden="true"
                        />
                        <span>Pedido copiado al portapapeles</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Copiar resumen del pedido</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
