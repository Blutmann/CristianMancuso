import { Hero } from "@/components/Hero";
import { CatalogSection } from "@/components/CatalogSection";
import { ShirtBuilderSection } from "@/components/ShirtBuilderSection";
import { BespokeProcess } from "@/components/BespokeProcess";
import { TailorTapeProgress } from "@/components/TailorTapeProgress";
import { Footer } from "@/components/Footer";

export default function HomePage() {
  return (
    <div className="relative bg-[#090B10]">
      {/* Luminous Studio Atelier Light Beams behind all sections for real Liquid Glass refraction */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#090B10]"
      >
        {/* Diagonal Studio Light Beam #1 (Warm Silver-Champagne) */}
        <div
          className="animate-orb-slow absolute -top-[18%] -left-[10%] h-[780px] w-[960px] -rotate-12 opacity-45 blur-[120px]"
          style={{
            background:
              "linear-gradient(125deg, rgba(255,255,255,0.22) 0%, rgba(214,195,165,0.16) 40%, rgba(9,11,16,0) 75%)",
          }}
        />
        {/* Diagonal Studio Light Beam #2 (Cool Slate-Silver Spotlight) */}
        <div
          className="animate-orb-reverse absolute top-[26%] right-[-14%] h-[760px] w-[860px] rotate-12 opacity-60 blur-[130px]"
          style={{
            background:
              "radial-gradient(ellipse at center, rgba(148,163,184,0.28) 0%, rgba(51,65,85,0.24) 44%, rgba(9,11,16,0) 74%)",
          }}
        />
        {/* Bottom Atelier Rim Glow */}
        <div
          className="animate-orb-slow absolute -bottom-36 left-[22%] h-[620px] w-[720px] rounded-full opacity-40 blur-[135px]"
          style={{
            background:
              "radial-gradient(circle, rgba(226,232,240,0.24) 0%, rgba(214,195,165,0.12) 45%, rgba(9,11,16,0) 74%)",
          }}
        />
        {/* Subtle Woven Cloth Grain */}
        <div className="absolute inset-0 atelier-grain opacity-75" />
      </div>

      {/* Main Content Layers refracting the studio light beams */}
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
