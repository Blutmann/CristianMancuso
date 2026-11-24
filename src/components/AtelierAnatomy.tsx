"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown } from "lucide-react";
import { ANATOMY_ACTS, type AnatomyAct } from "@/data/fabrics";
import { useMotion } from "@/context/MotionContext";

gsap.registerPlugin(ScrollTrigger);

function MacroAnatomyVisor({
  act,
  isMotionPaused,
}: {
  act: AnatomyAct;
  isMotionPaused: boolean;
}) {
  const { scale, x, y } = act.zoomTransform;

  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-3xl border border-white/[0.09] bg-elevated shadow-[0_32px_90px_rgba(0,0,0,0.75)]">
      {/* Optical Zoom Layer (GPU transform only) */}
      <div
        className="h-full w-full will-change-transform"
        style={{
          transform: isMotionPaused
            ? "scale(1) translate3d(0, 0, 0)"
            : `scale(${scale}) translate3d(${x}%, ${y}%, 0)`,
          transition: isMotionPaused
            ? "none"
            : "transform 780ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
      >
        <svg
          aria-hidden="true"
          className="h-full w-full"
          viewBox="0 0 400 500"
          preserveAspectRatio="xMidYMid slice"
        >
          <defs>
            <radialGradient id="anatomy-bg" cx="50%" cy="38%" r="68%">
              <stop offset="0%" stopColor="#1B2432" />
              <stop offset="55%" stopColor="#0E121A" />
              <stop offset="100%" stopColor="#060709" />
            </radialGradient>

            <pattern
              id="anatomy-pima-weave"
              width="8"
              height="8"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(35)"
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="8"
                stroke="rgba(245,242,235,0.065)"
                strokeWidth="1"
              />
              <line
                x1="4"
                y1="0"
                x2="4"
                y2="8"
                stroke="rgba(56,189,248,0.045)"
                strokeWidth="0.7"
              />
            </pattern>

            <radialGradient id="anatomy-pearl" cx="38%" cy="35%" r="65%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="42%" stopColor="#E4ECF4" />
              <stop offset="78%" stopColor="#BAC8D9" />
              <stop offset="100%" stopColor="#7C8BA1" />
            </radialGradient>
          </defs>

          {/* Base Fabric Field */}
          <rect width="400" height="500" fill="url(#anatomy-bg)" />
          <rect width="400" height="500" fill="url(#anatomy-pima-weave)" />

          {/* Zone 01: Macro Fiber Magnification Arc */}
          <g opacity={act.id === "fibra" ? 1 : 0.32}>
            <circle
              cx="132"
              cy="132"
              r="54"
              fill="rgba(56,189,248,0.04)"
              stroke="rgba(56,189,248,0.38)"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
            <g stroke="rgba(245,242,235,0.22)" strokeWidth="0.8">
              <line x1="92" y1="112" x2="172" y2="152" />
              <line x1="92" y1="126" x2="172" y2="166" />
              <line x1="92" y1="140" x2="164" y2="176" />
              <line x1="100" y1="98" x2="172" y2="134" />
            </g>
          </g>

          {/* Zone 02: Structured Sartorial Collar Silhouette */}
          <g opacity={act.id === "cuello" ? 1 : 0.45}>
            {/* Collar Band */}
            <path
              d="M 118 82 Q 200 116 282 82 L 296 138 Q 200 162 104 138 Z"
              fill="rgba(245,242,235,0.045)"
              stroke="rgba(245,242,235,0.32)"
              strokeWidth="1.2"
            />
            {/* Italian Spread Collar Points */}
            <path
              d="M 118 82 L 88 158 L 196 142 Z"
              fill="rgba(200,169,126,0.08)"
              stroke="rgba(200,169,126,0.55)"
              strokeWidth="1.2"
            />
            <path
              d="M 282 82 L 312 158 L 204 142 Z"
              fill="rgba(200,169,126,0.08)"
              stroke="rgba(200,169,126,0.55)"
              strokeWidth="1.2"
            />
            {/* Removable Collar Stay Guide */}
            <line
              x1="122"
              y1="108"
              x2="100"
              y2="148"
              stroke="rgba(56,189,248,0.65)"
              strokeWidth="1.2"
              strokeDasharray="2 3"
            />
          </g>

          {/* Center Placket & Zone 03: French Seam (7 pts/cm) */}
          <g>
            <rect
              x="166"
              y="142"
              width="68"
              height="358"
              fill="rgba(6,7,9,0.45)"
              stroke="rgba(255,255,255,0.08)"
              strokeWidth="1"
            />
            {/* Precision 7 stitches/cm French Seam Column */}
            <line
              x1="256"
              y1="142"
              x2="256"
              y2="460"
              stroke={
                act.id === "costura"
                  ? "rgba(200,169,126,0.95)"
                  : "rgba(200,169,126,0.34)"
              }
              strokeWidth={act.id === "costura" ? "1.6" : "1"}
              strokeDasharray="4 3"
            />
            <line
              x1="264"
              y1="142"
              x2="264"
              y2="460"
              stroke={
                act.id === "costura"
                  ? "rgba(56,189,248,0.75)"
                  : "rgba(255,255,255,0.16)"
              }
              strokeWidth="1"
              strokeDasharray="4 3"
            />
            {/* Caliper Tick Marks for 7 pts/cm */}
            {act.id === "costura" && (
              <g stroke="rgba(56,189,248,0.8)" strokeWidth="1">
                <line x1="242" y1="226" x2="278" y2="226" />
                <line x1="242" y1="290" x2="278" y2="290" />
                <line x1="278" y1="226" x2="278" y2="290" />
              </g>
            )}
          </g>

          {/* Zone 04: Australian Mother-of-Pearl Button & Embroidered Monogram */}
          <g
            transform="translate(200, 326)"
            opacity={act.id === "nacar" ? 1 : 0.65}
          >
            <circle
              r="30"
              fill="rgba(0,0,0,0.6)"
              transform="translate(3, 7)"
            />
            <circle r="28" fill="url(#anatomy-pearl)" />
            <circle
              r="22"
              fill="none"
              stroke="rgba(255,255,255,0.75)"
              strokeWidth="1"
            />
            <circle cx="-5.5" cy="-5.5" r="2.2" fill="#101218" />
            <circle cx="5.5" cy="-5.5" r="2.2" fill="#101218" />
            <circle cx="-5.5" cy="5.5" r="2.2" fill="#101218" />
            <circle cx="5.5" cy="5.5" r="2.2" fill="#101218" />
            <line
              x1="-5.5"
              y1="-5.5"
              x2="5.5"
              y2="5.5"
              stroke="#C8A97E"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <line
              x1="5.5"
              y1="-5.5"
              x2="-5.5"
              y2="5.5"
              stroke="#C8A97E"
              strokeWidth="2"
              strokeLinecap="round"
            />
            {/* Embroidered C.M. Monogram beside placket */}
            <text
              x="54"
              y="8"
              fill="#C8A97E"
              fontSize="16"
              fontStyle="italic"
              fontWeight="600"
              letterSpacing="3"
            >
              C.M.
            </text>
          </g>

          {/* Active Optical Focus Reticle */}
          <g
            style={{
              transform: `translate3d(${act.reticle.cx}px, ${act.reticle.cy}px, 0)`,
              transition: isMotionPaused
                ? "none"
                : "transform 680ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
          >
            <circle
              r="22"
              fill="none"
              stroke="#38BDF8"
              strokeWidth="1"
              strokeOpacity="0.85"
            />
            <line
              x1="-30"
              y1="0"
              x2="-16"
              y2="0"
              stroke="#38BDF8"
              strokeWidth="1"
            />
            <line
              x1="16"
              y1="0"
              x2="30"
              y2="0"
              stroke="#38BDF8"
              strokeWidth="1"
            />
            <line
              x1="0"
              y1="-30"
              x2="0"
              y2="-16"
              stroke="#38BDF8"
              strokeWidth="1"
            />
            <line
              x1="0"
              y1="16"
              x2="0"
              y2="30"
              stroke="#38BDF8"
              strokeWidth="1"
            />
          </g>
        </svg>
      </div>

      {/* Top HUD Overlay */}
      <div className="pointer-events-none absolute inset-x-5 top-5 flex items-center justify-between">
        <span className="rounded-full border border-white/[0.1] bg-obsidian/80 px-3 py-1 font-mono text-[10px] tracking-[0.2em] text-cyan uppercase backdrop-blur-md">
          {act.reticle.label}
        </span>
        <span className="rounded-full border border-champagne/30 bg-obsidian/80 px-3 py-1 font-mono text-[10px] tracking-[0.18em] text-champagne uppercase backdrop-blur-md tabular-nums">
          {act.step}
        </span>
      </div>

      {/* Bottom Telemetry Readout */}
      <div className="pointer-events-none absolute inset-x-5 bottom-5 rounded-2xl border border-white/[0.09] bg-obsidian/85 p-4 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3">
          <span className="font-mono text-[10px] tracking-[0.2em] text-champagne uppercase">
            {act.zone}
          </span>
          <span className="font-mono text-[10px] tracking-[0.16em] text-primary uppercase">
            {act.metric}
          </span>
        </div>
        <p className="mt-2 font-mono text-[10px] tracking-[0.14em] text-muted uppercase">
          {act.telemetry}
        </p>
      </div>
    </div>
  );
}

export function AtelierAnatomy() {
  const { isMotionPaused } = useMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollRatio, setScrollRatio] = useState(0);
  const pinSectionRef = useRef<HTMLElement | null>(null);
  const triggerRef = useRef<ScrollTrigger | null>(null);

  useEffect(() => {
    if (isMotionPaused || !pinSectionRef.current) {
      triggerRef.current = null;
      return;
    }

    const mm = gsap.matchMedia();

    mm.add("(min-width: 1024px)", () => {
      const st = ScrollTrigger.create({
        trigger: pinSectionRef.current,
        start: "top top",
        end: "+=2600",
        pin: true,
        scrub: 0.5,
        anticipatePin: 1,
        onUpdate: (self) => {
          const p = self.progress;
          setScrollRatio(p);
          const idx = Math.min(
            ANATOMY_ACTS.length - 1,
            Math.floor(p * ANATOMY_ACTS.length)
          );
          setActiveIndex(idx);
        },
      });

      triggerRef.current = st;

      return () => {
        triggerRef.current = null;
        st.kill();
      };
    });

    return () => {
      mm.revert();
    };
  }, [isMotionPaused]);

  const handleSelectAct = useCallback(
    (index: number) => {
      setActiveIndex(index);
      const st = triggerRef.current;
      if (!isMotionPaused && st && window.innerWidth >= 1024) {
        const targetProgress =
          (index + 0.15) / ANATOMY_ACTS.length;
        const targetScrollY =
          st.start + (st.end - st.start) * targetProgress;
        window.scrollTo({ top: targetScrollY, behavior: "smooth" });
      }
    },
    [isMotionPaused]
  );

  const activeAct = ANATOMY_ACTS[activeIndex] ?? ANATOMY_ACTS[0];
  const progressScale = isMotionPaused
    ? (activeIndex + 1) / ANATOMY_ACTS.length
    : Math.max((activeIndex + 1) / ANATOMY_ACTS.length, scrollRatio);

  return (
    <section
      ref={pinSectionRef}
      id="anatomia"
      aria-labelledby="anatomia-heading"
      className="relative w-full bg-obsidian text-primary overflow-hidden"
    >
      {/* Subtle Atelier Grain & Rim Glow */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute top-1/4 left-[-10%] h-[480px] w-[480px] rounded-full opacity-25 blur-[130px]"
          style={{
            background:
              "radial-gradient(circle, rgba(56,189,248,0.22) 0%, rgba(6,7,9,0) 70%)",
          }}
        />
        <div className="absolute inset-0 atelier-grain opacity-75" />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-7xl flex-col justify-center px-5 py-20 sm:px-8 lg:px-10 lg:py-24">
        {/* Top Section Header */}
        <div className="mb-10 flex flex-col gap-4 lg:mb-12 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-[1px] w-8 bg-champagne/80"
              />
              <span className="font-mono text-[11px] tracking-[0.24em] text-champagne uppercase">
                ANATOMÍA MANCUSO · INGENIERÍA SARTORIAL
              </span>
            </div>
            <h2
              id="anatomia-heading"
              className="font-display text-[clamp(2rem,4.2vw,3.3rem)] font-bold leading-[1.03] tracking-[-0.035em] text-primary"
            >
              Cuatro zonas de precisión artesanal.
            </h2>
          </div>

          <div className="flex items-center gap-3 font-mono text-xs tracking-[0.2em] text-muted uppercase tabular-nums">
            <span className="text-champagne">{activeAct.step}</span>
            <span aria-hidden="true" className="text-white/20">
              /
            </span>
            <span>{activeAct.zone}</span>
          </div>
        </div>

        {/* Main 12-Column Split */}
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          {/* Left Column: Progress Rail + 4 Acts */}
          <div className="order-2 lg:order-1 lg:col-span-7 flex gap-5 sm:gap-7">
            {/* Vertical Progress Rail (Desktop) */}
            <div
              aria-hidden="true"
              className="hidden sm:block relative w-[2px] shrink-0 overflow-hidden rounded-full bg-white/[0.08]"
            >
              <div
                className="h-full w-full origin-top will-change-transform"
                style={{
                  transform: `scaleY(${Math.min(Math.max(progressScale, 0.08), 1)})`,
                  background:
                    "linear-gradient(180deg, var(--accent-champagne) 0%, var(--accent-cyan) 100%)",
                  transition: isMotionPaused
                    ? "none"
                    : "transform 280ms ease-out",
                }}
              />
            </div>

            {/* 4 Interactive Acts (Accordion-friendly on mobile & reduced motion) */}
            <div className="flex w-full flex-col divide-y divide-white/[0.08] border-y border-white/[0.08]">
              {ANATOMY_ACTS.map((act, index) => {
                const isActive = index === activeIndex;

                return (
                  <div key={act.id} className="py-4 sm:py-5">
                    <button
                      id={`anatomy-act-${act.id}`}
                      type="button"
                      aria-expanded={isActive}
                      onClick={() => handleSelectAct(index)}
                      className="cursor-pointer group flex w-full items-start justify-between gap-4 text-left focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-champagne rounded-lg"
                    >
                      <div className="flex flex-col">
                        <div className="flex items-center gap-3">
                          <span
                            className={`font-mono text-[11px] tracking-[0.2em] tabular-nums transition-colors ${
                              isActive ? "text-champagne" : "text-muted/70"
                            }`}
                          >
                            {act.step}
                          </span>
                          <span
                            className={`font-mono text-[11px] tracking-[0.2em] uppercase transition-colors ${
                              isActive
                                ? "text-cyan"
                                : "text-muted group-hover:text-primary/80"
                            }`}
                          >
                            {act.zone}
                          </span>
                        </div>

                        <h3
                          className={`mt-2 font-display text-xl sm:text-2xl font-bold tracking-[-0.025em] transition-colors ${
                            isActive
                              ? "text-primary"
                              : "text-primary/45 group-hover:text-primary/80"
                          }`}
                        >
                          {act.title}
                        </h3>
                      </div>

                      <ChevronDown
                        className={`mt-1 h-4 w-4 shrink-0 text-muted transition-transform duration-300 lg:hidden ${
                          isActive ? "rotate-180 text-champagne" : ""
                        }`}
                        aria-hidden="true"
                      />
                    </button>

                    {/* Expanded Editorial Body */}
                    <div
                      className={`grid transition-[grid-template-rows,opacity] duration-300 ${
                        isActive
                          ? "grid-rows-[1fr] opacity-100 mt-3"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <p className="max-w-xl text-sm sm:text-base leading-relaxed text-muted">
                          {act.description}
                        </p>
                        <p className="mt-3 font-mono text-[10px] tracking-[0.16em] text-champagne/90 uppercase">
                          {act.telemetry}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: High-Precision Macro Visor */}
          <div className="order-1 lg:order-2 lg:col-span-5">
            <div className="mx-auto max-w-[420px] lg:ml-auto lg:mr-0">
              <MacroAnatomyVisor
                act={activeAct}
                isMotionPaused={isMotionPaused}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
