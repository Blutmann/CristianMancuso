import { Hero } from "@/components/Hero";
import { TailorCuttingTable } from "@/components/TailorCuttingTable";
import { CatalogSection } from "@/components/CatalogSection";
import { ShirtBuilderSection } from "@/components/ShirtBuilderSection";
import { BespokeProcess } from "@/components/BespokeProcess";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TailorCuttingTable />
      <CatalogSection />
      <ShirtBuilderSection />
      <BespokeProcess />
      <Footer />
    </>
  );
}
