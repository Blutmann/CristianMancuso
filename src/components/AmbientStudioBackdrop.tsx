"use client";

export function AmbientStudioBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#E9EDF4] transition-colors duration-500 dark:bg-[#0B0B0E]"
    >
      {/* LIGHT MODE: Cool pearl-gray (#E9EDF4) with pure white highlights, subtle sapphire (rgba(22,35,59,0.12)), and soft champagne (rgba(198,176,144,0.22)) reflectors */}
      <div className="absolute inset-0 opacity-100 transition-opacity duration-500 dark:opacity-0">
        <div
          className="animate-orb-slow absolute -top-[12%] -left-[8%] h-[72vh] w-[72vh] rounded-full blur-[76px] md:blur-[100px]"
          style={{
            background:
              "radial-gradient(circle, rgba(22,35,59,0.14) 0%, rgba(120,148,194,0.18) 46%, transparent 74%)",
          }}
        />
        <div
          className="animate-orb-reverse absolute top-[8%] -right-[8%] h-[70vh] w-[70vh] rounded-full blur-[80px] md:blur-[104px]"
          style={{
            background:
              "radial-gradient(circle, rgba(198,176,144,0.34) 0%, rgba(255,255,255,0.85) 48%, transparent 74%)",
          }}
        />
        <div
          className="animate-orb-drift-third absolute -bottom-[12%] left-[14%] h-[66vh] w-[66vh] rounded-full blur-[78px] md:blur-[100px]"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.96) 0%, rgba(22,35,59,0.10) 52%, transparent 76%)",
          }}
        />
        <div
          className="animate-orb-slow absolute top-[32%] left-[10%] h-[42vh] w-[82vw] -rotate-12 rounded-full blur-[82px] md:blur-[104px]"
          style={{
            background:
              "linear-gradient(90deg, rgba(22,35,59,0.12) 0%, rgba(255,255,255,0.92) 48%, rgba(198,176,144,0.28) 100%)",
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
