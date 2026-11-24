"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  MessageCircle,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  X,
} from "lucide-react";
import {
  buildSelectionWhatsAppUrl,
  formatMonogramDisplay,
  formatSizingLabel,
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

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <motion.div
          key="selection-drawer-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
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
            transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
            className="flex h-full w-full max-w-md flex-col border-l border-white/[0.1] bg-obsidian text-primary shadow-[0_0_80px_rgba(0,0,0,0.8)]"
          >
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-white/[0.08] px-6 py-5">
              <div className="flex items-center gap-3">
                <ShoppingBag
                  className="h-4 w-4 text-champagne"
                  aria-hidden="true"
                />
                <div>
                  <h2
                    id="selection-drawer-title"
                    className="font-display text-lg font-bold tracking-[-0.02em] text-primary"
                  >
                    Mi Selección
                  </h2>
                  <p className="font-mono text-[10px] tracking-[0.16em] text-muted uppercase tabular-nums">
                    {totalSelectionCount}{" "}
                    {totalSelectionCount === 1 ? "prenda" : "prendas"} en el
                    atelier
                  </p>
                </div>
              </div>

              <button
                id="drawer-close-btn"
                type="button"
                onClick={closeDrawer}
                aria-label="Cerrar Mi Selección"
                className="cursor-pointer inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/[0.1] bg-elevated text-primary transition-colors hover:border-champagne/60 hover:text-champagne"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            {/* Drawer Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5">
              {selectionItems.length === 0 ? (
                <div className="flex h-full flex-col items-center justify-center text-center py-12">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.1] bg-elevated">
                    <ShoppingBag
                      className="h-6 w-6 text-champagne/80"
                      aria-hidden="true"
                    />
                  </div>
                  <h3 className="mt-5 font-display text-xl font-bold tracking-[-0.02em] text-primary">
                    Tu selección está vacía
                  </h3>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted">
                    Elegí una camisa de la colección, configurá cuello, puños e
                    iniciales bordadas sin cargo y armá tu pedido a medida.
                  </p>
                  <Link
                    href="/#coleccion"
                    onClick={closeDrawer}
                    className="mt-7 inline-flex items-center gap-2 rounded-full bg-ivory px-6 py-3 text-xs font-semibold tracking-[0.08em] text-obsidian uppercase transition-transform hover:-translate-y-0.5"
                  >
                    <span>Explorar Colección</span>
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </div>
              ) : (
                <ul className="space-y-4">
                  {selectionItems.map((item) => {
                    const monogram = formatMonogramDisplay(
                      item.customization.monogramText
                    );
                    const linePrice = formatFabricPrice(
                      item.shirt.priceArs * item.quantity,
                      currency
                    );

                    return (
                      <li
                        key={item.key}
                        className="rounded-2xl border border-white/[0.08] bg-elevated p-4"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <span
                              aria-hidden="true"
                              className="mt-0.5 h-10 w-10 shrink-0 rounded-xl border border-white/[0.14]"
                              style={{ backgroundColor: item.shirt.baseHex }}
                            />
                            <div>
                              <h3 className="font-display text-base font-bold leading-snug text-primary">
                                {item.shirt.name}
                              </h3>
                              <p className="font-mono text-[10px] tracking-[0.14em] text-champagne uppercase">
                                {item.shirt.refCode} · {item.shirt.fabricLabel}
                              </p>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => removeItem(item.key)}
                            aria-label={`Eliminar ${item.shirt.name}`}
                            className="cursor-pointer rounded-lg p-1.5 text-muted transition-colors hover:bg-white/[0.06] hover:text-primary"
                          >
                            <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                          </button>
                        </div>

                        {/* Full Bespoke Summary */}
                        <p className="mt-3 text-xs leading-relaxed text-muted">
                          {item.customization.fit} · Cuello{" "}
                          {item.customization.collar} · Puño{" "}
                          {item.customization.cuff}
                          {monogram
                            ? ` · Iniciales: ${monogram} (${item.customization.monogramPlacement})`
                            : " · Sin iniciales"}{" "}
                          · {formatSizingLabel(item.customization)}
                        </p>

                        {/* Quantity Controls & Line Price */}
                        <div className="mt-4 flex items-center justify-between border-t border-white/[0.07] pt-3">
                          <div className="inline-flex items-center rounded-full border border-white/[0.1] bg-obsidian">
                            <button
                              type="button"
                              aria-label="Disminuir cantidad"
                              onClick={() => updateItemQuantity(item.key, -1)}
                              className="cursor-pointer px-2.5 py-1.5 text-muted transition-colors hover:text-primary"
                            >
                              <Minus className="h-3 w-3" aria-hidden="true" />
                            </button>
                            <span className="min-w-7 text-center font-mono text-xs text-primary tabular-nums">
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              aria-label="Aumentar cantidad"
                              onClick={() => updateItemQuantity(item.key, 1)}
                              className="cursor-pointer px-2.5 py-1.5 text-muted transition-colors hover:text-primary"
                            >
                              <Plus className="h-3 w-3" aria-hidden="true" />
                            </button>
                          </div>

                          <span className="font-mono text-sm font-medium text-primary tabular-nums">
                            {linePrice}
                          </span>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            {/* Drawer Footer */}
            {selectionItems.length > 0 && (
              <div className="border-t border-white/[0.08] bg-elevated/80 px-6 py-5">
                <div className="flex items-center justify-between text-xs text-muted">
                  <span>Confección a medida e iniciales</span>
                  <span className="font-mono text-champagne uppercase">
                    Bonificado ($0)
                  </span>
                </div>

                <div className="mt-2.5 flex items-baseline justify-between">
                  <span className="font-mono text-[11px] tracking-[0.16em] text-muted uppercase">
                    Total estimado
                  </span>
                  <span className="font-mono text-xl font-medium text-primary tabular-nums">
                    {formatFabricPrice(totalSelectionArs, currency)}
                  </span>
                </div>

                <a
                  id="drawer-whatsapp-order-btn"
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 flex w-full items-center justify-center gap-2.5 rounded-full bg-champagne px-6 py-3.5 text-xs font-semibold tracking-[0.08em] text-obsidian uppercase transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ivory"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  <span>Enviar Pedido por WhatsApp</span>
                </a>
              </div>
            )}
          </motion.aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
