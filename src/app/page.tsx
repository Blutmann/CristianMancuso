import { Hero } from "@/components/Hero";
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
      <CatalogSection />
      <ShirtBuilderSection />
      <BespokeProcess />
      <Footer />
    </>
  );
}
