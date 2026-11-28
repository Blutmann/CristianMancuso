"use client";

export function AmbientStudioBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#F4F5F7] transition-colors duration-500 dark:bg-[#0B0B0E]"
    >
      {/* LIGHT MODE: Neutral pearl-white (#F4F5F7) with soft sapphire, luminous white, and light champagne reflectors */}
      <div className="absolute inset-0 opacity-100 transition-opacity duration-500 dark:opacity-0">
        <div
          className="animate-orb-slow absolute -top-[12%] -left-[8%] h-[70vh] w-[70vh] rounded-full blur-[78px] md:blur-[102px]"
          style={{
            background:
              "radial-gradient(circle, rgba(132,164,214,0.44) 0%, rgba(186,206,236,0.26) 46%, transparent 74%)",
          }}
        />
        <div
          className="animate-orb-reverse absolute top-[10%] -right-[8%] h-[68vh] w-[68vh] rounded-full blur-[82px] md:blur-[108px]"
          style={{
            background:
              "radial-gradient(circle, rgba(214,196,170,0.52) 0%, rgba(235,225,209,0.32) 48%, transparent 74%)",
          }}
        />
        <div
          className="animate-orb-drift-third absolute -bottom-[12%] left-[14%] h-[64vh] w-[64vh] rounded-full blur-[80px] md:blur-[104px]"
          style={{
            background:
              "radial-gradient(circle, rgba(142,172,218,0.38) 0%, rgba(255,255,255,0.92) 50%, transparent 76%)",
          }}
        />
        <div
          className="animate-orb-slow absolute top-[34%] left-[12%] h-[42vh] w-[80vw] -rotate-12 rounded-full blur-[84px] md:blur-[106px]"
          style={{
            background:
              "linear-gradient(90deg, rgba(136,168,218,0.34) 0%, rgba(255,255,255,0.88) 48%, rgba(218,200,174,0.42) 100%)",
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
