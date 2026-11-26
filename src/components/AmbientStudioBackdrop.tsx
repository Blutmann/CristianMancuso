"use client";

export function AmbientStudioBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#F7F6F3] transition-colors duration-500 dark:bg-[#0B0B0E]"
    >
      {/* LIGHT MODE: Living warm sand (#E8DFD1), luminous ivory (#FFFFFF), and soft mist blue (#DDE3EC) orbs */}
      <div className="absolute inset-0 opacity-100 transition-opacity duration-500 dark:opacity-0">
        <div
          className="animate-orb-slow absolute -top-[14%] -left-[10%] h-[58vh] w-[58vh] rounded-full blur-[95px] md:blur-[125px]"
          style={{
            background:
              "radial-gradient(circle, rgba(232,223,209,0.92) 0%, rgba(232,223,209,0.42) 48%, transparent 74%)",
          }}
        />
        <div
          className="animate-orb-reverse absolute top-[26%] -right-[12%] h-[56vh] w-[56vh] rounded-full blur-[100px] md:blur-[130px]"
          style={{
            background:
              "radial-gradient(circle, rgba(221,227,236,0.9) 0%, rgba(221,227,236,0.4) 48%, transparent 74%)",
          }}
        />
        <div
          className="animate-orb-drift-third absolute -bottom-[14%] left-[22%] h-[52vh] w-[52vh] rounded-full blur-[90px] md:blur-[120px]"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.98) 0%, rgba(232,223,209,0.38) 52%, transparent 76%)",
          }}
        />
      </div>

      {/* DARK MODE: Living midnight navy (#16233B) and deep graphite (#1C1F28) ambient studio light orbs */}
      <div className="absolute inset-0 opacity-0 transition-opacity duration-500 dark:opacity-100">
        <div
          className="animate-orb-slow absolute -top-[14%] -left-[8%] h-[60vh] w-[60vh] rounded-full blur-[95px] md:blur-[125px]"
          style={{
            background:
              "radial-gradient(circle, rgba(22,35,59,0.85) 0%, rgba(22,35,59,0.38) 48%, transparent 74%)",
          }}
        />
        <div
          className="animate-orb-reverse absolute top-[28%] -right-[10%] h-[58vh] w-[58vh] rounded-full blur-[100px] md:blur-[130px]"
          style={{
            background:
              "radial-gradient(circle, rgba(28,31,40,0.95) 0%, rgba(56,74,108,0.28) 48%, transparent 75%)",
          }}
        />
        <div
          className="animate-orb-drift-third absolute -bottom-[16%] left-[18%] h-[52vh] w-[52vh] rounded-full blur-[95px] md:blur-[120px]"
          style={{
            background:
              "radial-gradient(circle, rgba(22,35,59,0.65) 0%, rgba(28,31,40,0.32) 52%, transparent 76%)",
          }}
        />
      </div>

      {/* Subtle fine weave film grain */}
      <div className="atelier-grain absolute inset-0" />
    </div>
  );
}
