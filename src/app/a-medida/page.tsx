import type { Metadata } from "next";
import { ShirtBuilderSection } from "@/components/ShirtBuilderSection";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Armá tu camisa a medida · Cristian Mancuso Atelier",
  description:
    "Configurá tu camisa a medida sin costo extra: elegí tela, cuello, botones, iniciales bordadas y medidas exactas.",
};

export default function AMedidaPage() {
  return (
    <div className="relative min-h-screen">
      <ShirtBuilderSection />
      <Footer />
    </div>
  );
}
