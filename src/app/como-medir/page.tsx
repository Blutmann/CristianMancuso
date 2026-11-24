import type { Metadata } from "next";
import { BespokeProcess } from "@/components/BespokeProcess";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Cómo medir · Cristian Mancuso Atelier",
  description:
    "Guía interactiva de 4 medidas para pedir tu camisa a medida en Buenos Aires o a distancia desde todo el país y exterior.",
};

export default function ComoMedirPage() {
  return (
    <div className="relative min-h-screen pt-12">
      <BespokeProcess />
      <Footer />
    </div>
  );
}
