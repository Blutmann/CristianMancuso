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
      <section className="relative w-full bg-transparent pt-20 pb-20 text-[#111113] sm:pt-24 sm:pb-24 lg:pt-28 dark:text-[#F8FAFC]">
        <div className="relative z-10 mx-auto w-full max-w-[1360px] px-5 sm:px-8 lg:px-10">
          {/* Back link */}
          <Link
            href="/"
            className="ds-caption inline-flex min-h-[40px] items-center gap-2 text-muted uppercase transition-colors hover:text-[#111113] dark:hover:text-white"
          >
            <ArrowLeft className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Volver al Atelier</span>
          </Link>

          {/* Header */}
          <div className="mt-4 max-w-3xl">
            <h1 className="ds-h1-page">
              Camisería de autor para tu equipo o tu local.
            </h1>

            <p className="ds-body mt-4 max-w-xl text-muted">
              Moldería consistente, telas de primera línea y atención comercial
              directa.
            </p>
          </div>

          {/* 2 Differentiated B2B / Wholesale Blocks */}
          <div className="mt-10 grid grid-cols-1 gap-5 lg:grid-cols-2">
            {/* Block 1: Diseños para tu Empresa */}
            <article className="liquid-glass flex flex-col justify-between rounded-2xl p-6 sm:p-8">
              <div>
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-black/[0.04] text-[#16233B] dark:border-white/16 dark:bg-white/[0.06] dark:text-gold">
                    <Building2 className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="ds-caption text-[#16233B] uppercase dark:text-gold">
                    01 / Corporativo
                  </span>
                </div>

                <h2 className="ds-h2 mt-5">Diseños para tu Empresa</h2>

                <p className="ds-body mt-2 text-muted">
                  Camisas ejecutivas con bordado institucional discreto y
                  reposición continua.
                </p>

                <ul className="mt-5 space-y-2.5 border-t border-black/10 pt-5 text-sm text-[#111113]/90 dark:border-white/12 dark:text-[#F8FAFC]/90">
                  <li className="flex items-center gap-2.5">
                    <Check
                      className="h-4 w-4 shrink-0 text-[#16233B] dark:text-gold"
                      aria-hidden="true"
                    />
                    <span>
                      Géneros Algodón Urbano Easy Care y Pima Peruano 120/2
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check
                      className="h-4 w-4 shrink-0 text-[#16233B] dark:text-gold"
                      aria-hidden="true"
                    />
                    <span>
                      Bordado institucional discreto en puño o pechera
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check
                      className="h-4 w-4 shrink-0 text-[#16233B] dark:text-gold"
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
            <article className="liquid-glass flex flex-col justify-between rounded-2xl p-6 sm:p-8">
              <div>
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/10 bg-black/[0.04] text-[#16233B] dark:border-white/16 dark:bg-white/[0.06] dark:text-white">
                    <Store className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span className="ds-caption text-[#16233B] uppercase dark:text-white/85">
                    02 / Mayorista
                  </span>
                </div>

                <h2 className="ds-h2 mt-5">
                  Venta Mayorista / Locales Multimarca
                </h2>

                <p className="ds-body mt-2 text-muted">
                  Sumá Cristian Mancuso a tu tienda con asesoramiento comercial
                  directo.
                </p>

                <ul className="mt-5 space-y-2.5 border-t border-black/10 pt-5 text-sm text-[#111113]/90 dark:border-white/12 dark:text-[#F8FAFC]/90">
                  <li className="flex items-center gap-2.5">
                    <Check
                      className="h-4 w-4 shrink-0 text-[#16233B] dark:text-white"
                      aria-hidden="true"
                    />
                    <span>
                      Curvas completas en líneas Urbano, Pima, Lino y Donna
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check
                      className="h-4 w-4 shrink-0 text-[#16233B] dark:text-white"
                      aria-hidden="true"
                    />
                    <span>
                      Lista de precios mayorista y envío de muestrario textil
                    </span>
                  </li>
                  <li className="flex items-center gap-2.5">
                    <Check
                      className="h-4 w-4 shrink-0 text-[#16233B] dark:text-white"
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
          <div className="mt-10">
            <EmpresasInquiryForm />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
