import Link from "next/link";
import { ArrowRight, Ruler } from "lucide-react";
import { Footer } from "@/components/Footer";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col justify-between bg-transparent">
      <section className="flex flex-1 items-center pt-28 pb-16">
        <div className="mx-auto w-full max-w-[1360px] px-5 sm:px-8 lg:px-10">
          <div className="liquid-glass mx-auto max-w-2xl rounded-2xl p-8 text-center sm:p-12">
            <p className="ds-caption text-[#16233B] uppercase dark:text-gold">
              Error 404 · Atelier
            </p>
            <h1 className="ds-h1-page mt-3">No encontramos esa prenda</h1>
            <p className="ds-body mx-auto mt-3 max-w-md text-muted">
              El enlace puede haber cambiado o la referencia ya no está
              disponible. Podés explorar la colección actual o armar tu camisa a
              medida sin costo extra.
            </p>

            <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
              <Link href="/coleccion" className="ds-btn-primary">
                <span>Ver colección</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
              <Link href="/a-medida" className="ds-btn-secondary">
                <Ruler className="h-4 w-4" aria-hidden="true" />
                <span>Armá tu camisa</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
