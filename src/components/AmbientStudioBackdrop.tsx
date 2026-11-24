"use client";

export function AmbientStudioBackdrop() {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 overflow-hidden bg-[#F7F6F3] transition-colors duration-500 dark:bg-[#0B0B0E]"
    >
      {/* LIGHT MODE: Warm alabaster + subtle architectural silver daylight beams */}
      <div className="absolute inset-0 opacity-100 transition-opacity duration-500 dark:opacity-0">
        <div
          className="animate-orb-slow absolute -top-[16%] left-[12%] h-[58vh] w-[58vh] rounded-full blur-[120px]"
          style={{
            background:
              "radial-gradient(circle, rgba(255,255,255,0.95) 0%, rgba(226,232,240,0.45) 48%, transparent 74%)",
          }}
        />
        <div
          className="animate-orb-reverse absolute top-[32%] -right-[8%] h-[54vh] w-[54vh] rounded-full blur-[130px]"
          style={{
            background:
              "radial-gradient(circle, rgba(214,205,190,0.42) 0%, rgba(226,232,240,0.22) 50%, transparent 75%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-55"
          style={{
            background:
              "linear-gradient(122deg, transparent 15%, rgba(255,255,255,0.75) 38%, transparent 56%, rgba(22,35,59,0.035) 76%, transparent 92%)",
          }}
        />
      </div>

      {/* DARK MODE: Deep obsidian + luminous studio diagonal light beams */}
      <div className="absolute inset-0 opacity-0 transition-opacity duration-500 dark:opacity-100">
        <div
          className="animate-orb-slow absolute -top-[14%] left-[18%] h-[56vh] w-[56vh] rounded-full blur-[120px]"
          style={{
            background:
              "radial-gradient(circle, rgba(226,232,240,0.16) 0%, rgba(148,163,184,0.07) 44%, transparent 72%)",
          }}
        />
        <div
          className="animate-orb-reverse absolute top-[30%] -right-[10%] h-[58vh] w-[58vh] rounded-full blur-[130px]"
          style={{
            background:
              "radial-gradient(circle, rgba(59,130,246,0.14) 0%, rgba(30,41,59,0.18) 46%, transparent 74%)",
          }}
        />
        <div
          className="absolute inset-0 opacity-75"
          style={{
            background:
              "linear-gradient(122deg, transparent 12%, rgba(255,255,255,0.065) 36%, transparent 54%, rgba(148,163,184,0.055) 76%, transparent 92%)",
          }}
        />
      </div>

      {/* Subtle fine weave film grain */}
      <div className="atelier-grain absolute inset-0" />
    </div>
  );
}
