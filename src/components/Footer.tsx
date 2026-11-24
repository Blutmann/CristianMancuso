"use client";

import Link from "next/link";
import { ArrowUpRight, MessageCircle, Pause, Play } from "lucide-react";
import { buildWhatsAppUrl } from "@/data/config";
import { useMotion } from "@/context/MotionContext";
import { BrandLogo } from "@/components/BrandLogo";

const DIRECT_WHATSAPP_URL = buildWhatsAppUrl(
  "Hola Cristian Mancuso Atelier, quisiera realizar una consulta sobre camisas a medida."
);

export function Footer() {
  const { isMotionPaused, toggleMotion } = useMotion();

  return (
    <footer className="relative w-full border-t border-black/8 bg-transparent text-[#111113] dark:border-white/12 dark:text-white">
      <div className="mx-auto max-w-7xl px-5 py-14 sm:px-8 lg:px-12 xl:pr-24">
        <div className="liquid-glass rounded-3xl p-6 sm:p-10">
          <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
            {/* Brand Column */}
            <div className="md:col-span-5">
              <Link href="/" className="inline-flex items-center">
                <BrandLogo markSize={36} />
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
                    href="/coleccion"
                    className="text-[#111113]/80 transition-colors hover:text-[#111113] dark:text-white/80 dark:hover:text-white"
                  >
                    Colección
                  </Link>
                </li>
                <li>
                  <Link
                    href="/a-medida"
                    className="text-[#111113]/80 transition-colors hover:text-[#111113] dark:text-white/80 dark:hover:text-white"
                  >
                    Armá tu camisa
                  </Link>
                </li>
                <li>
                  <Link
                    href="/como-medir"
                    className="text-[#111113]/80 transition-colors hover:text-[#111113] dark:text-white/80 dark:hover:text-white"
                  >
                    Cómo medir
                  </Link>
                </li>
                <li>
                  <Link
                    href="/empresas"
                    className="inline-flex items-center gap-1 text-[#111113]/80 transition-colors hover:text-[#111113] dark:text-white/80 dark:hover:text-white"
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
                className="mt-5 inline-flex min-h-[44px] items-center gap-2 rounded-full bg-[#111113] px-5 py-2.5 text-xs font-semibold tracking-[0.06em] text-white uppercase transition-colors hover:bg-[#16233B] dark:border dark:border-white/25 dark:bg-white/[0.06] dark:text-white dark:hover:border-white dark:hover:bg-white dark:hover:text-[#0B0B0E]"
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
          <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-black/10 pt-6 text-xs text-muted dark:border-white/10">
            <span>© {new Date().getFullYear()} Cristian Mancuso Atelier</span>

            <button
              id="footer-motion-toggle"
              type="button"
              onClick={toggleMotion}
              aria-pressed={isMotionPaused}
              className="cursor-pointer inline-flex min-h-[44px] items-center gap-2 rounded-full border border-black/12 px-4 py-1.5 text-xs text-muted transition-colors hover:border-black/30 hover:text-[#111113] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-stitch dark:border-white/12 dark:hover:border-white/35 dark:hover:text-white"
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
      </div>
    </footer>
  );
}
