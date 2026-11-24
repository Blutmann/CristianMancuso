import { Hero } from "@/components/Hero";
import { HomeShowcaseSections } from "@/components/HomeShowcaseSections";
import { TailorTapeProgress } from "@/components/TailorTapeProgress";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <div className="relative">
      <TailorTapeProgress />
      <Hero />
      <HomeShowcaseSections />
      <Footer />
    </div>
  );
}
