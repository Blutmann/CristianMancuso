import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Building2, Check, Store } from "lucide-react";
import { EmpresasInquiryForm } from "@/components/EmpresasInquiryForm";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Empresas & Mayorista — Cristian Mancuso Atelier",
  description:
    "Camisería de autor para tu equipo o tu local. Diseños corporativos con bordado institucional discreto y venta mayorista para locales multimarca en Argentina.",
};

export default function EmpresasPage() {
  return (
    <>
      <section className="relative w-full overflow-hidden bg-obsidian pt-32 pb-20 sm:pt-36 sm:pb-24">
        {/* Chiaroscuro Atelier Glow & Grain */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <div
            className="absolute -top-24 right-[-10%] h-[500px] w-[500px] rounded-full opacity-30 blur-[130px]"
            style={{
              background:
                "radial-gradient(circle, rgba(200,169,126,0.32) 0%, rgba(6,7,9,0) 70%)",
            }}
          />
          <div className="absolute inset-0 atelier-grain opacity-75" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] text-muted uppercase transition-colors hover:text-champagne"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Volver al Atelier B2C</span>
          </Link>

          {/* Header */}
          <div className="mt-8 max-w-3xl">
            <div className="mb-4 flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-[1px] w-8 bg-champagne/80"
              />
              <span className="font-mono text-[11px] tracking-[0.24em] text-champagne uppercase">
                DIVISIÓN CORPORATIVA &amp; MAYORISTA
              </span>
            </div>

            <h1 className="font-display text-[clamp(2.3rem,5.4vw,4.3rem)] font-bold leading-[1.01] tracking-[-0.035em] text-primary">
              Camisería de autor para tu equipo o tu local.
            </h1>

            <p className="mt-5 max-w-2xl text-base sm:text-lg leading-relaxed text-muted">
              Acompañamos a estudios, firmas ejecutivas y locales multimarca de
              Buenos Aires y el interior con moldería consistente, géneros de
              primera línea y atención comercial directa.
            </p>
          </div>

          {/* 2 Differentiated B2B / Wholesale Blocks */}
          <div className="mt-12 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Block 1: Diseños para tu Empresa */}
            <article className="flex flex-col justify-between rounded-3xl border border-black/10 dark:border-white/[0.09] bg-elevated p-6 sm:p-8">
              <div>
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-champagne/35 bg-obsidian text-champagne">
                    <Building2 className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.2em] text-champagne uppercase">
                    01 / CORPORATIVO
                  </span>
                </div>

                <h2 className="mt-6 font-display text-2xl font-bold tracking-[-0.025em] text-primary">
                  Diseños para tu Empresa
                </h2>

                <p className="mt-3 text-sm sm:text-base leading-relaxed text-muted">
                  Camisas ejecutivas en Algodón Urbano o Pima Peruano con
                  bordado institucional discreto, moldería consistente y
                  reposición continua.
                </p>

                <ul className="mt-6 space-y-2.5 border-t border-white/[0.08] pt-5 text-sm text-primary/90">
                  <li className="flex items-center gap-2.5">
                    <Check
                      className="h-4 w-4 shrink-0 text-champagne"
                      aria-hidden="true"
                    />
                    <span>
                      Géneros Algodón Urbano Easy Care y Pima Peruano 120/2
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check
                      className="h-4 w-4 shrink-0 text-champagne"
                      aria-hidden="true"
                    />
                    <span>
                      Bordado institucional discreto en puño o pechera
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check
                      className="h-4 w-4 shrink-0 text-champagne"
                      aria-hidden="true"
                    />
                    <span>
                      Registro de talles y medidas para reposiciones ágiles
                    </span>
                  </li>
                </ul>
              </div>
            </article>

            {/* Block 2: Venta Mayorista / Locales Multimarca */}
            <article className="flex flex-col justify-between rounded-3xl border border-black/10 dark:border-white/[0.09] bg-elevated p-6 sm:p-8">
              <div>
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-cyan/35 bg-obsidian text-cyan">
                    <Store className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="font-mono text-[10px] tracking-[0.2em] text-cyan uppercase">
                    02 / MAYORISTA
                  </span>
                </div>

                <h2 className="mt-6 font-display text-2xl font-bold tracking-[-0.025em] text-primary">
                  Venta Mayorista / Locales Multimarca
                </h2>

                <p className="mt-3 text-sm sm:text-base leading-relaxed text-muted">
                  Sumá las líneas de Cristian Mancuso en tu tienda del interior
                  o Buenos Aires con asesoramiento comercial directo.
                </p>

                <ul className="mt-6 space-y-2.5 border-t border-white/[0.08] pt-5 text-sm text-primary/90">
                  <li className="flex items-center gap-2.5">
                    <Check
                      className="h-4 w-4 shrink-0 text-cyan"
                      aria-hidden="true"
                    />
                    <span>
                      Curvas completas en líneas Urbano, Pima, Lino y Donna
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check
                      className="h-4 w-4 shrink-0 text-cyan"
                      aria-hidden="true"
                    />
                    <span>
                      Lista de precios mayorista y envío de muestrario textil
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check
                      className="h-4 w-4 shrink-0 text-cyan"
                      aria-hidden="true"
                    />
                    <span>
                      Despachos asegurados a todo el interior y Buenos Aires
                    </span>
                  </li>
                </ul>
              </div>
            </article>
          </div>

          {/* Commercial Inquiry Form */}
          <div className="mt-12">
            <EmpresasInquiryForm />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
