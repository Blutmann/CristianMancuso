import { Hero } from "@/components/Hero";
import { TailorCuttingTable } from "@/components/TailorCuttingTable";
import { CatalogSection } from "@/components/CatalogSection";
import { ShirtBuilderSection } from "@/components/ShirtBuilderSection";
import { BespokeProcess } from "@/components/BespokeProcess";
import { TailorTapeProgress } from "@/components/TailorTapeProgress";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <TailorTapeProgress />
      <Hero />
      <TailorCuttingTable />
      <CatalogSection />
      <ShirtBuilderSection />
      <BespokeProcess />
      <Footer />
    </>
  );
}
