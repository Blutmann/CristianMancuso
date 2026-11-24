import type { Metadata } from "next";
import { CatalogSection } from "@/components/CatalogSection";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Colección · Cristian Mancuso Atelier",
  description:
    "Camisas de vestir listas para enviar en Algodón Urbano, Pima Peruano, Lino Italiano y Mancuso Donna. Talles comerciales o a medida sin cargo.",
};

export default function ColeccionPage() {
  return (
    <div className="relative min-h-screen">
      <CatalogSection />
      <Footer />
    </div>
  );
}
