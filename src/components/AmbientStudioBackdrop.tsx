"use client";

export function AmbientStudioBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#F6F4EF] transition-colors duration-500 dark:bg-[#0B0B0E]"
    >
      {/* LIGHT MODE: Warm Italian tailoring ivory (#F6F4EF) with subtle champagne (#E8DFD1), pure luminous white (#FFFFFF), and soft sand (#DFD5C5) orbs */}
      <div className="absolute inset-0 opacity-100 transition-opacity duration-500 dark:opacity-0">
        <div
          className="animate-orb-slow absolute -top-[12%] -left-[8%] h-[72vh] w-[72vh] rounded-full blur-[78px] md:blur-[104px]"
          style={{
            background:
              "radial-gradient(circle, rgba(232,223,209,0.92) 0%, rgba(232,223,209,0.52) 48%, transparent 74%)",
          }}
        />
        <div
          className="animate-orb-reverse absolute top-[8%] -right-[8%] h-[70vh] w-[70vh] rounded-full blur-[82px] md:blur-[108px]"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.94) 0%, rgba(232,223,209,0.48) 48%, transparent 74%)",
          }}
        />
        <div
          className="animate-orb-drift-third absolute -bottom-[12%] left-[14%] h-[66vh] w-[66vh] rounded-full blur-[80px] md:blur-[104px]"
          style={{
            background:
              "radial-gradient(circle, rgba(223,213,197,0.88) 0%, rgba(255,255,255,0.84) 52%, transparent 76%)",
          }}
        />
        <div
          className="animate-orb-slow absolute top-[32%] left-[10%] h-[42vh] w-[82vw] -rotate-12 rounded-full blur-[84px] md:blur-[108px]"
          style={{
            background:
              "linear-gradient(90deg, rgba(232,223,209,0.62) 0%, rgba(255,255,255,0.92) 48%, rgba(223,213,197,0.68) 100%)",
          }}
        />
      </div>

      {/* DARK MODE: Living midnight navy (#16233B), steel sapphire (#243B64), and deep graphite (#1C1F28) ambient studio light orbs + ribbon */}
      <div className="absolute inset-0 opacity-0 transition-opacity duration-500 dark:opacity-100">
        <div
          className="animate-orb-slow absolute -top-[10%] -left-[8%] h-[66vh] w-[66vh] rounded-full blur-[90px] md:blur-[120px]"
          style={{
            background:
              "radial-gradient(circle, rgba(32,56,98,0.92) 0%, rgba(22,35,59,0.55) 48%, transparent 74%)",
          }}
        />
        <div
          className="animate-orb-reverse absolute top-[20%] -right-[10%] h-[64vh] w-[64vh] rounded-full blur-[94px] md:blur-[124px]"
          style={{
            background:
              "radial-gradient(circle, rgba(54,78,120,0.62) 0%, rgba(28,33,46,0.55) 48%, transparent 75%)",
          }}
        />
        <div
          className="animate-orb-drift-third absolute -bottom-[14%] left-[16%] h-[58vh] w-[58vh] rounded-full blur-[92px] md:blur-[118px]"
          style={{
            background:
              "radial-gradient(circle, rgba(36,58,96,0.78) 0%, rgba(28,31,40,0.46) 52%, transparent 76%)",
          }}
        />
        <div
          className="animate-orb-slow absolute top-[48%] left-[20%] h-[36vh] w-[70vw] -rotate-12 rounded-full blur-[100px] md:blur-[128px]"
          style={{
            background:
              "linear-gradient(90deg, rgba(22,35,59,0.58) 0%, rgba(56,78,118,0.34) 50%, rgba(28,31,40,0.52) 100%)",
          }}
        />
      </div>

      {/* Subtle fine weave film grain */}
      <div className="atelier-grain absolute inset-0" />
    </div>
  );
}
