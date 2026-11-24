import { Hero } from "@/components/Hero";
import { CatalogSection } from "@/components/CatalogSection";
import { ShirtBuilderSection } from "@/components/ShirtBuilderSection";
import { BespokeProcess } from "@/components/BespokeProcess";
import { TailorTapeProgress } from "@/components/TailorTapeProgress";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="relative bg-[#07080B]">
      {/* Global Ambient Liquid Light Canvas behind all sections for real glass refraction */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#07080B]"
      >
        {/* Orb 1: Diffuse Silver-White (Top Right) */}
        <div
          className="animate-orb-slow absolute -top-28 right-[6%] h-[620px] w-[620px] rounded-full opacity-35 blur-[145px]"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.28) 0%, rgba(226,232,240,0.10) 45%, rgba(7,8,11,0) 74%)",
          }}
        />
        {/* Orb 2: Slate Blue #1E293B (Center Left) */}
        <div
          className="animate-orb-reverse absolute top-[34%] -left-24 h-[680px] w-[680px] rounded-full opacity-75 blur-[150px]"
          style={{
            background:
              "radial-gradient(circle, rgba(30,41,59,0.85) 0%, rgba(51,65,85,0.35) 45%, rgba(7,8,11,0) 74%)",
          }}
        />
        {/* Orb 3: Subtle Pearl Gray (Bottom Center-Right) */}
        <div
          className="animate-orb-slow absolute -bottom-32 right-[18%] h-[580px] w-[580px] rounded-full opacity-30 blur-[145px]"
          style={{
            background:
              "radial-gradient(circle, rgba(212,212,216,0.22) 0%, rgba(161,161,170,0.08) 45%, rgba(7,8,11,0) 74%)",
          }}
        />
        <div className="absolute inset-0 atelier-grain opacity-60" />
      </div>

      {/* Main Content Layers refracting the global ambient light */}
      <div className="relative z-10">
        <TailorTapeProgress />
        <Hero />
        <CatalogSection />
        <ShirtBuilderSection />
        <BespokeProcess />
        <Footer />
      </div>
    </div>
  );
}
