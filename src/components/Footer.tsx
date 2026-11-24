import Link from "next/link";
import { ArrowUpRight, MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/data/config";

const DIRECT_WHATSAPP_URL = buildWhatsAppUrl(
  "Hola Cristian Mancuso Atelier, quisiera realizar una consulta sobre camisas a medida."
);

export function Footer() {
  return (
    <footer className="relative w-full border-t border-white/[0.08] bg-obsidian text-primary">
      <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-10 lg:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-12">
          {/* Brand Column */}
          <div className="md:col-span-5">
            <Link href="/" className="inline-flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg border border-champagne/40 bg-elevated font-display text-xs font-bold tracking-[0.08em] text-champagne">
                CM
              </span>
              <span className="font-display text-sm font-bold tracking-[0.16em] text-primary uppercase">
                Cristian Mancuso
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted">
              Alta camisería a medida sin costo extra. Envíos a Argentina,
              México, EE. UU. y España.
            </p>

            <p className="mt-5 font-mono text-[10px] tracking-[0.2em] text-champagne/90 uppercase">
              BUENOS AIRES · SASTRERÍA DE AUTOR
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
                  className="text-primary/80 transition-colors hover:text-champagne"
                >
                  Colección
                </Link>
              </li>
              <li>
                <Link
                  href="/#arma-tu-camisa"
                  className="text-primary/80 transition-colors hover:text-champagne"
                >
                  Armá tu camisa
                </Link>
              </li>
              <li>
                <Link
                  href="/#como-medir"
                  className="text-primary/80 transition-colors hover:text-champagne"
                >
                  Cómo medir
                </Link>
              </li>
              <li>
                <Link
                  href="/empresas"
                  className="inline-flex items-center gap-1 text-primary/80 transition-colors hover:text-champagne"
                >
                  <span>Empresas y Mayoristas</span>
                  <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Direct Channel Column */}
          <div className="md:col-span-4">
            <h3 className="font-mono text-[10px] tracking-[0.22em] text-muted uppercase">
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
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-champagne/45 bg-champagne/[0.08] px-5 py-2.5 text-xs font-semibold tracking-[0.06em] text-primary uppercase transition-colors hover:border-champagne hover:bg-champagne hover:text-obsidian"
            >
              <MessageCircle className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Escribir por WhatsApp</span>
            </a>

            <p className="mt-4 font-mono text-[10px] tracking-[0.16em] text-champagne uppercase">
              ✓ 3 cuotas sin interés · Confección a medida sin cargo
            </p>
          </div>
        </div>

        {/* Bottom Strip */}
        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-white/[0.08] pt-6 font-mono text-[10px] tracking-[0.18em] text-muted uppercase">
          <span>© {new Date().getFullYear()} Cristian Mancuso Atelier</span>
          <span>Pima 120/2 · Lino Italiano · Nácar Australiano</span>
        </div>
      </div>
    </footer>
  );
}
