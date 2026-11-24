import { Hero } from "@/components/Hero";
import { CatalogSection } from "@/components/CatalogSection";
import { ShirtBuilderSection } from "@/components/ShirtBuilderSection";
import { BespokeProcess } from "@/components/BespokeProcess";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <>
      <Hero />
      <CatalogSection />
      <ShirtBuilderSection />
      <BespokeProcess />
      <Footer />
    </>
  );
}
