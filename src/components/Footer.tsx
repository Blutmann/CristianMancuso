"use client";

import Link from "next/link";
import { ArrowUpRight, MessageCircle, Pause, Play } from "lucide-react";
import { buildWhatsAppUrl } from "@/data/config";
import { useMotion } from "@/context/MotionContext";

const DIRECT_WHATSAPP_URL = buildWhatsAppUrl(
  "Hola Cristian Mancuso Atelier, quisiera realizar una consulta sobre camisas a medida."
);

export function Footer() {
  const { isMotionPaused, toggleMotion } = useMotion();

  return (
    <footer className="relative w-full border-t border-dashed border-white/15 bg-[#09090B] text-primary">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          {/* Brand Column */}
          <div className="md:col-span-5">
            <Link
              href="/"
              className="relative inline-flex items-center gap-3 border border-dashed border-stitch/55 bg-[#09090B] px-3.5 py-2"
            >
              <span className="font-display text-xs font-bold tracking-[0.14em] text-stitch">
                CM
              </span>
              <span aria-hidden="true" className="text-white/25 text-[10px]">
                {"//"}
              </span>
              <span className="font-display text-xs font-bold tracking-[0.18em] text-white uppercase">
                Cristian Mancuso
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
              Alta camisería a medida sin costo extra. Envíos a Argentina,
              México, EE. UU. y España.
            </p>
          </div>

          {/* Navigation Column */}
          <div className="md:col-span-3">
            <h3 className="text-xs font-semibold tracking-[0.14em] text-muted uppercase">
              Navegación
            </h3>
            <ul className="mt-4 space-y-2.5 text-sm">
              <li>
                <Link
                  href="/#coleccion"
                  className="text-white/80 transition-colors hover:text-white"
                >
                  Colección
                </Link>
              </li>
              <li>
                <Link
                  href="/#arma-tu-camisa"
                  className="text-white/80 transition-colors hover:text-white"
                >
                  Armá tu camisa
                </Link>
              </li>
              <li>
                <Link
                  href="/#como-medir"
                  className="text-white/80 transition-colors hover:text-white"
                >
                  Cómo medir
                </Link>
              </li>
              <li>
                <Link
                  href="/empresas"
                  className="inline-flex items-center gap-1 text-white/80 transition-colors hover:text-white"
                >
                  <span>Empresas y Mayoristas</span>
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Direct Channel Column */}
          <div className="md:col-span-4">
            <h3 className="text-xs font-semibold tracking-[0.14em] text-muted uppercase">
              Canal Directo
            </h3>
            <p className="mt-4 text-sm leading-relaxed text-muted">
              Atención personalizada para medidas, selección de géneros y
              pedidos al exterior.
            </p>

            <a
              id="footer-whatsapp-link"
              href={DIRECT_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/25 bg-white/[0.04] px-5 py-2.5 text-xs font-semibold tracking-[0.06em] text-white uppercase transition-colors hover:border-white hover:bg-white hover:text-[#09090B]"
            >
              <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Escribir por WhatsApp</span>
            </a>

            <p className="mt-4 text-xs text-stitch">
              ✓ 3 cuotas sin interés · Confección a medida sin cargo
            </p>
          </div>
        </div>

        {/* Bottom Strip with Discreet Motion Accessibility Toggle */}
        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs text-muted">
          <span>© {new Date().getFullYear()} Cristian Mancuso Atelier</span>

          <button
            id="footer-motion-toggle"
            type="button"
            onClick={toggleMotion}
            aria-pressed={isMotionPaused}
            className="cursor-pointer inline-flex min-h-[44px] items-center gap-2 rounded-full border border-white/12 px-4 py-1.5 text-xs text-muted transition-colors hover:border-white/35 hover:text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-stitch"
          >
            {isMotionPaused ? (
              <Play className="h-3.5 w-3.5 text-stitch" aria-hidden="true" />
            ) : (
              <Pause className="h-3.5 w-3.5" aria-hidden="true" />
            )}
            <span>
              {isMotionPaused ? "Reanudar movimiento" : "Pausar movimiento"}
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}
