import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export const metadata: Metadata = {
  title: "Empresas & Mayorista — Cristian Mancuso",
  description:
    "Camisería corporativa y líneas institucionales a medida por Cristian Mancuso, Buenos Aires.",
};

export default function EmpresasPage() {
  return (
    <section className="relative flex min-h-[100svh] flex-col items-center justify-center bg-obsidian px-6 pt-28 pb-16 text-center">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 atelier-grain opacity-70"
      />
      <div className="relative z-10 mx-auto max-w-2xl">
        <p className="font-mono text-[11px] tracking-[0.24em] text-champagne uppercase">
          CRISTIAN MANCUSO · B2B &amp; CORPORATIVO
        </p>
        <h1 className="mt-5 font-display text-4xl sm:text-5xl font-bold tracking-[-0.03em] text-primary">
          División Empresas &amp; Mayorista
        </h1>
        <p className="mt-5 text-base leading-relaxed text-muted">
          Próximamente disponible en esta sección: uniformes ejecutivos,
          producciones corporativas y atención dedicada para firmas en Argentina
          y el exterior.
        </p>
        <div className="mt-9">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-full border border-white/[0.14] bg-elevated px-5 py-3 text-sm font-medium text-primary transition-colors hover:border-champagne/60"
          >
            <ArrowLeft className="h-4 w-4 text-champagne" aria-hidden="true" />
            <span>Volver al Atelier</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
