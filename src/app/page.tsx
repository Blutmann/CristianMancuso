import { Hero } from "@/components/Hero";
import { FabricComparator } from "@/components/FabricComparator";
import { AtelierAnatomy } from "@/components/AtelierAnatomy";
import { CatalogSection } from "@/components/CatalogSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FabricComparator />
      <AtelierAnatomy />
      <CatalogSection />
    </>
  );
}
