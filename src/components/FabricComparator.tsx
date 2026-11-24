"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Check, SlidersHorizontal, X } from "lucide-react";
import {
  FABRIC_RANGES,
  USD_REFERENCE_RATE,
  formatFabricPrice,
  type FabricRange,
} from "@/data/fabrics";
import { useAtelier } from "@/context/AtelierContext";
import { useMotion } from "@/context/MotionContext";

gsap.registerPlugin(ScrollTrigger);

const MARQUEE_SEGMENT =
  "CONFECCIÓN A MEDIDA SIN COSTO EXTRA ✦ ALGODÓN URBANO · PIMA PERUANO · LINO ITALIANO · MANCUSO DONNA ✦ ENVÍOS A ARGENTINA, MÉXICO, EE. UU. Y ESPAÑA ✦";

function FabricWeaveSwatch({
  fabric,
  isSelected,
}: {
  fabric: FabricRange;
  isSelected: boolean;
}) {
  const patternId = `weave-${fabric.id}`;

  return (
    <div
      className="relative h-24 w-full overflow-hidden rounded-xl border border-[#121215]/10"
      style={{ backgroundColor: fabric.swatchBg }}
    >
      <svg
        aria-hidden="true"
        className="h-full w-full transition-transform duration-500 ease-out group-hover:scale-110"
        viewBox="0 0 280 96"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          {fabric.weaveType === "poplin" && (
            <pattern
              id={patternId}
              width="6"
              height="6"
              patternUnits="userSpaceOnUse"
            >
              <line
                x1="0"
                y1="3"
                x2="6"
                y2="3"
                stroke={fabric.swatchStroke}
                strokeOpacity="0.22"
                strokeWidth="0.9"
              />
              <line
                x1="3"
                y1="0"
                x2="3"
                y2="6"
                stroke={fabric.swatchStroke}
                strokeOpacity="0.14"
                strokeWidth="0.7"
              />
            </pattern>
          )}
          {fabric.weaveType === "twill" && (
            <pattern
              id={patternId}
              width="8"
              height="8"
              patternUnits="userSpaceOnUse"
              patternTransform="rotate(38)"
            >
              <line
                x1="0"
                y1="0"
                x2="0"
                y2="8"
                stroke={fabric.swatchStroke}
                strokeOpacity="0.28"
                strokeWidth="1.2"
              />
              <line
                x1="4"
                y1="0"
                x2="4"
                y2="8"
                stroke="#FFFFFF"
                strokeOpacity="0.4"
                strokeWidth="0.9"
              />
            </pattern>
          )}
          {fabric.weaveType === "linen" && (
            <pattern
              id={patternId}
              width="14"
              height="14"
              patternUnits="userSpaceOnUse"
            >
              <line
                x1="0"
                y1="4"
                x2="14"
                y2="4"
                stroke={fabric.swatchStroke}
                strokeOpacity="0.25"
                strokeWidth="1.1"
              />
              <line
                x1="0"
                y1="10"
                x2="14"
                y2="10"
                stroke={fabric.swatchStroke}
                strokeOpacity="0.16"
                strokeWidth="1.6"
              />
              <line
                x1="6"
                y1="0"
                x2="6"
                y2="14"
                stroke={fabric.swatchStroke}
                strokeOpacity="0.22"
                strokeWidth="1"
              />
            </pattern>
          )}
          {fabric.weaveType === "cloque" && (
            <pattern
              id={patternId}
              width="12"
              height="12"
              patternUnits="userSpaceOnUse"
            >
              <circle
                cx="3"
                cy="3"
                r="1.6"
                fill="none"
                stroke={fabric.swatchStroke}
                strokeOpacity="0.28"
                strokeWidth="0.8"
              />
              <circle
                cx="9"
                cy="9"
                r="1.6"
                fill="none"
                stroke={fabric.swatchStroke}
                strokeOpacity="0.22"
                strokeWidth="0.8"
              />
            </pattern>
          )}
        </defs>

        <rect width="280" height="96" fill={`url(#${patternId})`} />
      </svg>

      {/* Top Swatch Telemetry Overlay */}
      <div className="absolute inset-x-3 top-2.5 flex items-center justify-between">
        <span className="rounded-full bg-[#121215]/80 px-2.5 py-0.5 font-mono text-[9px] tracking-[0.16em] text-[#F5F2EB] uppercase backdrop-blur-sm">
          {fabric.index} / 04
        </span>
        <span
          className={`rounded-full px-2.5 py-0.5 font-mono text-[9px] tracking-[0.14em] uppercase backdrop-blur-sm transition-colors ${
            isSelected
              ? "bg-champagne text-obsidian font-medium"
              : "bg-[#F4F1EA]/90 text-[#121215]"
          }`}
        >
          {fabric.refCode}
        </span>
      </div>

      {/* Bottom Micro Spec */}
      <div className="absolute inset-x-3 bottom-2 flex items-center justify-between">
        <span className="font-mono text-[9px] tracking-[0.14em] text-[#121215]/75 uppercase">
          {fabric.telemetry}
        </span>
      </div>
    </div>
  );
}

export function FabricComparator() {
  const { currency, setCurrency, selectedFabric, toggleSelectedFabric, setSelectedFabric } =
    useAtelier();
  const { isMotionPaused } = useMotion();
  const sectionRef = useRef<HTMLElement | null>(null);
  const cardsRef = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => {
    const cards = cardsRef.current.filter(Boolean) as HTMLButtonElement[];
    if (cards.length === 0) return;

    if (isMotionPaused) {
      gsap.set(cards, { y: 0, opacity: 1 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.fromTo(
        cards,
        { y: 26, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.75,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 90%",
            once: true,
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, [isMotionPaused]);

  const activeFabricObj = FABRIC_RANGES.find((f) => f.id === selectedFabric);

  return (
    <section
      ref={sectionRef}
      id="telas"
      aria-labelledby="telas-heading"
      className="relative w-full scroll-mt-24 bg-ivory text-[#121215] overflow-hidden"
    >
      {/* Top Kinetic Marquee Ribbon */}
      <div
        className="cm-marquee-container w-full overflow-hidden border-y border-[#121215]/12 bg-[#ECE7DC]/80 py-3.5 select-none"
        aria-label="Diferenciales y alcance internacional Cristian Mancuso"
      >
        <div
          className="cm-marquee-track"
          style={isMotionPaused ? { animationPlayState: "paused" } : undefined}
        >
          {[0, 1].map((dup) => (
            <div
              key={dup}
              aria-hidden={dup === 1}
              className="flex shrink-0 items-center gap-8 pr-8 font-mono text-[11px] font-medium tracking-[0.22em] text-[#121215] uppercase"
            >
              <span>{MARQUEE_SEGMENT}</span>
              <span>{MARQUEE_SEGMENT}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content Container */}
      <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 sm:py-24 lg:px-10 lg:py-28">
        {/* Editorial Header + Currency Toggle */}
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="mb-4 flex items-center gap-3">
              <span
                aria-hidden="true"
                className="h-[1px] w-8 bg-[#9A7444]"
              />
              <span className="font-mono text-[11px] font-medium tracking-[0.24em] text-[#8A6638] uppercase">
                ORÍGENES TEXTILES
              </span>
            </div>

            <h2
              id="telas-heading"
              className="font-display text-[clamp(2.1rem,4.5vw,3.6rem)] font-bold leading-[1.03] tracking-[-0.035em] text-[#121215]"
            >
              Cuatro gamas. Un mismo estándar de sastrería.
            </h2>

            <p className="mt-4 max-w-xl text-base sm:text-lg leading-relaxed text-[#4B4D55]">
              Elegí la tela según tu ritmo y ocasión. Todas incluyen confección
              a medida sin costo adicional.
            </p>
          </div>

          {/* Currency Switch ARS / USD (Exterior) */}
          <div className="flex flex-col items-start lg:items-end gap-2">
            <div
              role="radiogroup"
              aria-label="Moneda de precios orientativos"
              className="inline-flex items-center rounded-full border border-[#121215]/14 bg-[#E9E4D8] p-1"
            >
              <button
                id="currency-ars-btn"
                type="button"
                role="radio"
                aria-checked={currency === "ARS"}
                onClick={() => setCurrency("ARS")}
                className={`cursor-pointer min-h-[44px] rounded-full px-4 py-1.5 font-mono text-[11px] font-medium tracking-[0.14em] uppercase transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121215] ${
                  currency === "ARS"
                    ? "bg-[#121215] text-[#F5F2EB] shadow-sm"
                    : "text-[#4B4D55] hover:text-[#121215]"
                }`}
              >
                ARS
              </button>
              <button
                id="currency-usd-btn"
                type="button"
                role="radio"
                aria-checked={currency === "USD"}
                onClick={() => setCurrency("USD")}
                className={`cursor-pointer min-h-[44px] rounded-full px-4 py-1.5 font-mono text-[11px] font-medium tracking-[0.14em] uppercase transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121215] ${
                  currency === "USD"
                    ? "bg-[#121215] text-[#F5F2EB] shadow-sm"
                    : "text-[#4B4D55] hover:text-[#121215]"
                }`}
              >
                USD (Exterior)
              </button>
            </div>
            <span className="font-mono text-[10px] tracking-[0.12em] text-[#6B6D76] uppercase">
              {currency === "USD"
                ? `Ref. orientativa · 1 USD ≈ ARS $${USD_REFERENCE_RATE.toLocaleString("es-AR")}`
                : "Precios de referencia en Pesos Argentinos"}
            </span>
          </div>
        </div>

        {/* 4 Interactive Fabric Range Cards */}
        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {FABRIC_RANGES.map((fabric, idx) => {
            const isSelected = selectedFabric === fabric.id;
            const formattedPrice = formatFabricPrice(fabric.priceArs, currency);

            return (
              <button
                key={fabric.id}
                ref={(el) => {
                  cardsRef.current[idx] = el;
                }}
                id={`fabric-card-${fabric.id}`}
                type="button"
                aria-pressed={isSelected}
                onClick={() => toggleSelectedFabric(fabric.id)}
                className={`cursor-pointer group relative flex flex-col justify-between rounded-2xl border p-5 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#121215] focus-visible:ring-offset-2 focus-visible:ring-offset-ivory will-change-transform ${
                  isSelected
                    ? "border-[#121215] bg-[#121215] text-[#F5F2EB] shadow-[0_24px_50px_rgba(18,18,21,0.22)] -translate-y-1"
                    : "border-[#121215]/12 bg-[#FAF8F4] text-[#121215] hover:border-[#121215]/35 hover:-translate-y-1 hover:shadow-[0_16px_38px_rgba(18,18,21,0.08)]"
                }`}
              >
                <div>
                  <FabricWeaveSwatch fabric={fabric} isSelected={isSelected} />

                  <p
                    className={`mt-5 font-mono text-[10px] tracking-[0.18em] uppercase ${
                      isSelected ? "text-champagne" : "text-[#7A6B58]"
                    }`}
                  >
                    {fabric.origin}
                  </p>

                  <h3 className="mt-1.5 font-display text-xl font-bold leading-tight tracking-[-0.02em]">
                    {fabric.name}
                  </h3>

                  <p
                    className={`mt-2.5 text-sm leading-relaxed ${
                      isSelected ? "text-[#D4D4D8]" : "text-[#4B4D55]"
                    }`}
                  >
                    {fabric.description}
                  </p>
                </div>

                {/* Price, Seal & Selection Footer */}
                <div
                  className={`mt-6 border-t pt-4 ${
                    isSelected ? "border-white/12" : "border-[#121215]/10"
                  }`}
                >
                  <div className="flex items-baseline justify-between gap-2">
                    <span
                      className={`font-mono text-[10px] tracking-[0.14em] uppercase ${
                        isSelected ? "text-[#A1A1AA]" : "text-[#6B6D76]"
                      }`}
                    >
                      Desde
                    </span>
                    <span className="font-mono text-base font-medium tracking-[-0.02em] tabular-nums">
                      {formattedPrice}
                    </span>
                  </div>

                  <div className="mt-3.5 flex items-center justify-between gap-2">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-1 font-mono text-[10px] tracking-[0.1em] uppercase ${
                        isSelected
                          ? "bg-champagne/20 text-champagne"
                          : "bg-[#EFE8DC] text-[#78572B]"
                      }`}
                    >
                      {fabric.badge}
                    </span>

                    <span
                      className={`inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors ${
                        isSelected
                          ? "border-champagne bg-champagne text-obsidian"
                          : "border-[#121215]/20 text-transparent group-hover:border-[#121215]/45"
                      }`}
                      aria-hidden="true"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Active Catalog Filter Readiness Bar */}
        <div className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[#121215]/12 bg-[#EAE4D8]/75 px-5 py-3.5">
          <div className="flex items-center gap-3 text-sm">
            <SlidersHorizontal
              className="h-4 w-4 text-[#8A6638] shrink-0"
              aria-hidden="true"
            />
            {activeFabricObj ? (
              <p className="text-[#121215]">
                Filtro preparado para la colección:{" "}
                <strong className="font-semibold">{activeFabricObj.name}</strong>{" "}
                <span className="font-mono text-xs text-[#6B6D76]">
                  ({activeFabricObj.refCode})
                </span>
              </p>
            ) : (
              <p className="text-[#4B4D55]">
                Tocá una gama para pre-filtrar el catálogo o explorá todas las
                telas disponibles.
              </p>
            )}
          </div>

          {activeFabricObj && (
            <button
              id="fabric-clear-filter-btn"
              type="button"
              onClick={() => setSelectedFabric(null)}
              className="cursor-pointer inline-flex min-h-[44px] items-center gap-1.5 rounded-full border border-[#121215]/20 px-4 py-1.5 font-mono text-[10px] tracking-[0.14em] text-[#121215] uppercase transition-colors hover:bg-[#121215] hover:text-[#F5F2EB]"
            >
              <X className="h-3.5 w-3.5" aria-hidden="true" />
              <span>Ver todas</span>
            </button>
          )}
        </div>
      </div>
    </section>
  );
}
