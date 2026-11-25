"use client";

import Link from "next/link";
import { MessageCircle, Pause, Play } from "lucide-react";
import { buildWhatsAppUrl } from "@/data/config";
import { useMotion } from "@/context/MotionContext";
import { BrandLogo } from "@/components/BrandLogo";

const DIRECT_WHATSAPP_URL = buildWhatsAppUrl(
  "Hola Cristian Mancuso Atelier, quisiera realizar una consulta sobre camisas a medida."
);

export function Footer() {
  const { isMotionPaused, toggleMotion } = useMotion();

  return (
    <footer className="relative w-full border-t border-black/8 bg-transparent text-[#111113] dark:border-white/10 dark:text-white">
      <div className="mx-auto w-full max-w-[1360px] px-5 py-6 sm:px-8 lg:px-10">
        <div className="liquid-glass flex flex-col gap-4 rounded-2xl px-5 py-3.5 lg:flex-row lg:items-center lg:justify-between">
          {/* Left: Compact BrandLogo + Tagline */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <Link href="/" className="inline-flex shrink-0 items-center">
              <BrandLogo markSize={24} />
            </Link>
            <span
              aria-hidden="true"
              className="hidden text-black/20 sm:inline dark:text-white/25"
            >
              |
            </span>
            <span className="text-xs text-muted">
              Alta camisería a medida · Argentina &amp; Exterior
            </span>
          </div>

          {/* Center: Single-line Navigation */}
          <nav
            aria-label="Enlaces del pie de página"
            className="flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs font-medium text-[#111113]/75 dark:text-white/75"
          >
            <Link
              href="/coleccion"
              className="transition-colors hover:text-[#111113] dark:hover:text-white"
            >
              Colección
            </Link>
            <span aria-hidden="true" className="text-black/25 dark:text-white/25">
              ·
            </span>
            <Link
              href="/a-medida"
              className="transition-colors hover:text-[#111113] dark:hover:text-white"
            >
              Armá tu camisa
            </Link>
            <span aria-hidden="true" className="text-black/25 dark:text-white/25">
              ·
            </span>
            <Link
              href="/como-medir"
              className="transition-colors hover:text-[#111113] dark:hover:text-white"
            >
              Cómo medir
            </Link>
            <span aria-hidden="true" className="text-black/25 dark:text-white/25">
              ·
            </span>
            <Link
              href="/empresas"
              className="transition-colors hover:text-[#111113] dark:hover:text-white"
            >
              Empresas
            </Link>
          </nav>

          {/* Right: WhatsApp + Motion Toggle + Copyright */}
          <div className="flex flex-wrap items-center gap-3 text-xs">
            <a
              id="footer-whatsapp-link"
              href={DIRECT_WHATSAPP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-8 items-center gap-1.5 rounded-full bg-[#111113] px-3.5 font-medium text-white transition-colors hover:bg-[#16233B] dark:bg-white dark:text-[#0B0B0E] dark:hover:bg-white/90"
            >
              <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
              <span>WhatsApp</span>
            </a>

            <button
              id="footer-motion-toggle"
              type="button"
              onClick={toggleMotion}
              aria-pressed={isMotionPaused}
              className="cursor-pointer inline-flex h-8 items-center gap-1.5 rounded-full border border-black/12 px-3 text-[11px] text-muted transition-colors hover:border-black/30 hover:text-[#111113] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-stitch dark:border-white/14 dark:hover:border-white/35 dark:hover:text-white"
            >
              {isMotionPaused ? (
                <Play className="h-3 w-3 text-stitch" aria-hidden="true" />
              ) : (
                <Pause className="h-3 w-3" aria-hidden="true" />
              )}
              <span>
                {isMotionPaused ? "Reanudar movimiento" : "Pausar movimiento"}
              </span>
            </button>

            <span className="text-[11px] text-muted">© 2026</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
