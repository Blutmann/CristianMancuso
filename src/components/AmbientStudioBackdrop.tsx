"use client";

export function AmbientStudioBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden bg-[#F7F6F3] transition-colors duration-500 dark:bg-[#0B0B0E]"
    >
      {/* LIGHT MODE: Rich warm sand (#D9CCBA), champagne (#E6DCCB), and mist blue (#C3D0E2) orbs + diagonal ribbon for perceptible Liquid Glass refraction */}
      <div className="absolute inset-0 opacity-100 transition-opacity duration-500 dark:opacity-0">
        <div
          className="animate-orb-slow absolute -top-[10%] -left-[8%] h-[68vh] w-[68vh] rounded-full blur-[82px] md:blur-[108px]"
          style={{
            background:
              "radial-gradient(circle, rgba(217,204,186,0.95) 0%, rgba(230,220,203,0.68) 46%, transparent 74%)",
          }}
        />
        <div
          className="animate-orb-reverse absolute top-[14%] -right-[8%] h-[66vh] w-[66vh] rounded-full blur-[86px] md:blur-[112px]"
          style={{
            background:
              "radial-gradient(circle, rgba(195,208,226,0.92) 0%, rgba(195,208,226,0.52) 48%, transparent 74%)",
          }}
        />
        <div
          className="animate-orb-drift-third absolute -bottom-[10%] left-[16%] h-[62vh] w-[62vh] rounded-full blur-[84px] md:blur-[110px]"
          style={{
            background:
              "radial-gradient(circle, rgba(217,204,186,0.88) 0%, rgba(230,220,203,0.62) 48%, transparent 76%)",
          }}
        />
        <div
          className="animate-orb-slow absolute top-[40%] left-[18%] h-[44vh] w-[74vw] -rotate-12 rounded-full blur-[90px] md:blur-[114px]"
          style={{
            background:
              "linear-gradient(90deg, rgba(195,208,226,0.68) 0%, rgba(230,220,203,0.74) 50%, rgba(217,204,186,0.78) 100%)",
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
