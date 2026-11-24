"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Globe, MapPin, MessageCircle, Ruler } from "lucide-react";
import { buildWhatsAppUrl } from "@/data/config";
import { useMotion } from "@/context/MotionContext";

type Modality = "presencial" | "distancia";
type MeasureId = "cuello" | "pecho" | "manga" | "largo";

const MODALITIES: Record<
  Modality,
  {
    label: string;
    shortLabel: string;
    steps: { number: string; title: string; description: string }[];
    whatsappMessage: string;
  }
> = {
  presencial: {
    label: "Estoy en Buenos Aires (Presencial)",
    shortLabel: "Buenos Aires (Presencial)",
    steps: [
      {
        number: "01",
        title: "Elegís tu tela y detalles",
        description:
          "Seleccionás gama, cuello, puños e iniciales bordadas desde la web para preparar tus géneros antes de tu visita.",
      },
      {
        number: "02",
        title: "Cita de 15 min en el Atelier",
        description:
          "Coordinás tu visita para que Cristian o su equipo tomen tus medidas exactas y validen el calce ideal.",
      },
      {
        number: "03",
        title: "Confección & Entrega",
        description:
          "Tu camisa a medida sin costo extra, lista con terminación artesanal y lista para retirar o recibir en tu domicilio.",
      },
    ],
    whatsappMessage:
      "Hola Cristian Mancuso Atelier, estoy en Buenos Aires y quiero coordinar una cita presencial de 15 min para tomar mis medidas.",
  },
  distancia: {
    label: "Interior de Argentina / Exterior (México, EE. UU., España)",
    shortLabel: "Interior / Exterior",
    steps: [
      {
        number: "01",
        title: "Asesoramiento directo por WhatsApp",
        description:
          "Nos enviás tu selección de telas junto con tu altura y peso aproximado para recomendar el calce base.",
      },
      {
        number: "02",
        title: "4 medidas sobre tu camisa favorita",
        description:
          "Te guiamos por videollamada o guía visual para medir una camisa tuya que te quede perfecta (Cuello, Ancho de pecho, Largo de manga y Largo total).",
      },
      {
        number: "03",
        title: "Envío asegurado",
        description:
          "Confeccionamos a tu medida exacta y despachamos a todo el país o al exterior (México, EE. UU. y España).",
      },
    ],
    whatsappMessage:
      "Hola Cristian Mancuso Atelier, quiero pedir a medida a distancia (Interior / Exterior) y coordinar la toma de las 4 medidas por WhatsApp.",
  },
};

const MEASURES: Record<
  MeasureId,
  {
    id: MeasureId;
    label: string;
    code: string;
    rangeCm: string;
    instruction: string;
  }
> = {
  cuello: {
    id: "cuello",
    label: "Cuello",
    code: "M-01",
    rangeCm: "38 – 45 cm",
    instruction:
      "Extendé el cuello abierto sobre una mesa y medí en línea recta desde el centro del botón hasta el extremo interior del ojal.",
  },
  pecho: {
    id: "pecho",
    label: "Pecho",
    code: "M-02",
    rangeCm: "51 – 62 cm",
    instruction:
      "Con la camisa abotonada y apoyada plana, medí de costura de axila a costura de axila justo por debajo de las mangas.",
  },
  manga: {
    id: "manga",
    label: "Manga",
    code: "M-03",
    rangeCm: "61 – 68 cm",
    instruction:
      "Medí desde la costura superior donde nace el hombro hasta el borde final del puño abotonado.",
  },
  largo: {
    id: "largo",
    label: "Largo",
    code: "M-04",
    rangeCm: "73 – 81 cm",
    instruction:
      "Por la espalda, medí en línea vertical desde la costura base del pie de cuello hasta el borde inferior del ruedo.",
  },
};

const MEASURE_ORDER: MeasureId[] = ["cuello", "pecho", "manga", "largo"];

export function BespokeProcess() {
  const { isMotionPaused } = useMotion();
  const [modality, setModality] = useState<Modality>("presencial");
  const [activeMeasure, setActiveMeasure] = useState<MeasureId>("cuello");

  const currentModality = MODALITIES[modality];
  const currentMeasure = MEASURES[activeMeasure];
  const whatsappUrl = buildWhatsAppUrl(currentModality.whatsappMessage);

  const strokeFor = (id: MeasureId) =>
    activeMeasure === id ? "#38BDF8" : "rgba(194, 163, 107, 0.45)";
  const widthFor = (id: MeasureId) => (activeMeasure === id ? 2.4 : 1.3);

  return (
    <section
      id="como-pedir"
      aria-labelledby="como-pedir-heading"
      className="relative w-full scroll-mt-24 border-t border-white/[0.08] bg-obsidian text-primary py-20 sm:py-24 lg:py-28 overflow-hidden"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div
          className="absolute top-1/3 right-[-8%] h-[440px] w-[440px] rounded-full opacity-25 blur-[130px]"
          style={{
            background:
              "radial-gradient(circle, rgba(200,169,126,0.28) 0%, rgba(6,7,9,0) 70%)",
          }}
        />
        <div className="absolute inset-0 atelier-grain opacity-70" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* Section Header */}
        <div className="max-w-2xl">
          <div className="mb-3.5 flex items-center gap-3">
            <span
              aria-hidden="true"
              className="h-[1px] w-8 bg-champagne/80"
            />
            <span className="font-mono text-[11px] tracking-[0.24em] text-champagne uppercase">
              EXPERIENCIA A MEDIDA · SIN COSTO EXTRA
            </span>
          </div>

          <h2
            id="como-pedir-heading"
            className="font-display text-[clamp(2rem,4.4vw,3.4rem)] font-bold leading-[1.03] tracking-[-0.035em] text-primary"
          >
            Tu calce perfecto, estés donde estés.
          </h2>

          <p className="mt-4 text-base sm:text-lg leading-relaxed text-muted">
            Tomamos tus medidas en nuestro atelier de Buenos Aires o te guiamos
            paso a paso a distancia desde el interior y el exterior.
          </p>
        </div>

        {/* Modality Tabs */}
        <div className="mt-10">
          <div
            role="tablist"
            aria-label="Modalidad de toma de medidas"
            className="inline-flex flex-col sm:flex-row w-full sm:w-auto gap-1.5 rounded-2xl sm:rounded-full border border-white/[0.1] bg-elevated p-1.5"
          >
            {(
              [
                {
                  id: "presencial" as const,
                  icon: MapPin,
                  text: MODALITIES.presencial.label,
                },
                {
                  id: "distancia" as const,
                  icon: Globe,
                  text: MODALITIES.distancia.label,
                },
              ] as const
            ).map((tab) => {
              const Icon = tab.icon;
              const isActive = modality === tab.id;
              return (
                <button
                  key={tab.id}
                  id={`bespoke-tab-${tab.id}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setModality(tab.id)}
                  className={`cursor-pointer relative flex min-h-[44px] items-center justify-center gap-2 rounded-xl sm:rounded-full px-4 py-2.5 text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-champagne ${
                    isActive
                      ? "text-obsidian font-semibold"
                      : "text-muted hover:text-primary"
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId={
                        isMotionPaused ? undefined : "bespoke-modality-pill"
                      }
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 32,
                      }}
                      className="absolute inset-0 rounded-xl sm:rounded-full bg-ivory"
                    />
                  )}
                  <Icon className="relative z-10 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span className="relative z-10 text-left sm:text-center">
                    {tab.text}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 12-Column Split: Steps Left + Interactive 4-Measurement Diagram Right */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start lg:gap-10">
          {/* Left Column: 3 Steps + WhatsApp CTA */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <ol className="space-y-4">
              {currentModality.steps.map((step) => (
                <li
                  key={`${modality}-${step.number}`}
                  className="rounded-2xl border border-white/[0.08] bg-elevated p-5 sm:p-6 transition-colors hover:border-champagne/35"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-champagne/35 bg-obsidian font-mono text-xs font-medium text-champagne tabular-nums">
                      {step.number}
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-bold tracking-[-0.02em] text-primary">
                        {step.title}
                      </h3>
                      <p className="mt-1.5 text-sm leading-relaxed text-muted">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>

            {/* Primary WhatsApp CTA */}
            <div className="mt-7 flex flex-col sm:flex-row sm:items-center gap-4">
              <a
                id="bespoke-whatsapp-cta"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[44px] items-center justify-center gap-2.5 rounded-full bg-champagne px-6 py-3 text-xs font-semibold tracking-[0.08em] text-obsidian uppercase transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ivory"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                <span>Coordinar medidas por WhatsApp</span>
              </a>

              <span className="font-mono text-[10px] tracking-[0.16em] text-muted uppercase">
                Modalidad: {currentModality.shortLabel}
              </span>
            </div>
          </div>

          {/* Right Column: Interactive 4-Measurement Sartorial Blueprint */}
          <div className="lg:col-span-6 rounded-3xl border border-white/[0.09] bg-elevated p-5 sm:p-7">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2">
                <Ruler className="h-4 w-4 text-cyan" aria-hidden="true" />
                <span className="font-mono text-[11px] tracking-[0.18em] text-primary uppercase">
                  GUÍA VISUAL · 4 MEDIDAS CLAVE
                </span>
              </div>
              <span className="font-mono text-[10px] tracking-[0.16em] text-champagne uppercase">
                TOCÁ O PASÁ EL CURSOR
              </span>
            </div>

            {/* Interactive Measurement Selector Pills */}
            <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {MEASURE_ORDER.map((id) => {
                const m = MEASURES[id];
                const isActive = activeMeasure === id;
                return (
                  <button
                    key={id}
                    id={`measure-pill-${id}`}
                    type="button"
                    onMouseEnter={() => setActiveMeasure(id)}
                    onFocus={() => setActiveMeasure(id)}
                    onClick={() => setActiveMeasure(id)}
                    aria-pressed={isActive}
                    className={`cursor-pointer min-h-[44px] rounded-xl border px-3 py-2 text-left transition-all ${
                      isActive
                        ? "border-cyan bg-cyan/12 text-primary"
                        : "border-white/[0.08] bg-obsidian/70 text-muted hover:border-champagne/40 hover:text-primary"
                    }`}
                  >
                    <span className="block font-mono text-[9px] tracking-[0.16em] text-champagne uppercase">
                      {m.code}
                    </span>
                    <span className="mt-0.5 block text-xs font-semibold">
                      {m.label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Sartorial Flat-Lay SVG Schematic */}
            <div className="mt-5 relative overflow-hidden rounded-2xl border border-white/[0.07] bg-obsidian/80 px-4 py-5">
              <svg
                viewBox="0 0 420 310"
                className="mx-auto h-auto w-full max-w-[390px]"
                role="img"
                aria-label={`Esquema de medición sastrera destacando ${currentMeasure.label}`}
              >
                {/* Shirt Technical Flat Silhouette */}
                <path
                  d="M 164 46 Q 210 62 256 46 L 288 64 L 366 134 L 336 164 L 292 126 L 292 268 Q 210 282 128 268 L 128 126 L 84 164 L 54 134 L 132 64 Z"
                  fill="rgba(245, 242, 235, 0.035)"
                  stroke="rgba(245, 242, 235, 0.28)"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                />
                {/* Collar & Placket */}
                <path
                  d="M 164 46 L 184 76 L 210 64 L 236 76 L 256 46"
                  fill="none"
                  stroke="rgba(245, 242, 235, 0.36)"
                  strokeWidth="1.2"
                />
                <line
                  x1="210"
                  y1="64"
                  x2="210"
                  y2="274"
                  stroke="rgba(245, 242, 235, 0.16)"
                  strokeWidth="1"
                  strokeDasharray="3 4"
                />

                {/* 1. CUELLO Measurement Line */}
                <g
                  onClick={() => setActiveMeasure("cuello")}
                  className="cursor-pointer"
                >
                  <path
                    d="M 162 34 Q 210 50 258 34"
                    fill="none"
                    stroke={strokeFor("cuello")}
                    strokeWidth={widthFor("cuello")}
                  />
                  <circle cx="162" cy="34" r="3" fill={strokeFor("cuello")} />
                  <circle cx="258" cy="34" r="3" fill={strokeFor("cuello")} />
                  <text
                    x="210"
                    y="23"
                    textAnchor="middle"
                    fill={
                      activeMeasure === "cuello" ? "#38BDF8" : "#C8A97E"
                    }
                    fontSize="10"
                    fontFamily="monospace"
                    letterSpacing="1.6"
                  >
                    CUELLO
                  </text>
                </g>

                {/* 2. PECHO Measurement Line */}
                <g
                  onClick={() => setActiveMeasure("pecho")}
                  className="cursor-pointer"
                >
                  <line
                    x1="128"
                    y1="138"
                    x2="292"
                    y2="138"
                    stroke={strokeFor("pecho")}
                    strokeWidth={widthFor("pecho")}
                    strokeDasharray={activeMeasure === "pecho" ? "0" : "4 3"}
                  />
                  <circle cx="128" cy="138" r="3.2" fill={strokeFor("pecho")} />
                  <circle cx="292" cy="138" r="3.2" fill={strokeFor("pecho")} />
                  <text
                    x="210"
                    y="128"
                    textAnchor="middle"
                    fill={activeMeasure === "pecho" ? "#38BDF8" : "#C8A97E"}
                    fontSize="10"
                    fontFamily="monospace"
                    letterSpacing="1.6"
                  >
                    PECHO (AXILA A AXILA)
                  </text>
                </g>

                {/* 3. MANGA Measurement Line */}
                <g
                  onClick={() => setActiveMeasure("manga")}
                  className="cursor-pointer"
                >
                  <line
                    x1="292"
                    y1="56"
                    x2="374"
                    y2="130"
                    stroke={strokeFor("manga")}
                    strokeWidth={widthFor("manga")}
                  />
                  <circle cx="292" cy="56" r="3.2" fill={strokeFor("manga")} />
                  <circle cx="374" cy="130" r="3.2" fill={strokeFor("manga")} />
                  <text
                    x="352"
                    y="78"
                    textAnchor="middle"
                    fill={activeMeasure === "manga" ? "#38BDF8" : "#C8A97E"}
                    fontSize="10"
                    fontFamily="monospace"
                    letterSpacing="1.6"
                  >
                    MANGA
                  </text>
                </g>

                {/* 4. LARGO Measurement Line */}
                <g
                  onClick={() => setActiveMeasure("largo")}
                  className="cursor-pointer"
                >
                  <line
                    x1="102"
                    y1="52"
                    x2="102"
                    y2="274"
                    stroke={strokeFor("largo")}
                    strokeWidth={widthFor("largo")}
                    strokeDasharray={activeMeasure === "largo" ? "0" : "4 3"}
                  />
                  <circle cx="102" cy="52" r="3.2" fill={strokeFor("largo")} />
                  <circle cx="102" cy="274" r="3.2" fill={strokeFor("largo")} />
                  <text
                    x="62"
                    y="214"
                    textAnchor="middle"
                    fill={activeMeasure === "largo" ? "#38BDF8" : "#C8A97E"}
                    fontSize="10"
                    fontFamily="monospace"
                    letterSpacing="1.6"
                  >
                    LARGO
                  </text>
                </g>
              </svg>
            </div>

            {/* Active Measurement Instruction Readout */}
            <div className="mt-4 rounded-2xl border border-cyan/25 bg-obsidian/80 p-4">
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-[11px] font-medium tracking-[0.18em] text-cyan uppercase">
                  {currentMeasure.code} · {currentMeasure.label}
                </span>
                <span className="font-mono text-[11px] tracking-[0.14em] text-champagne tabular-nums">
                  Ref. {currentMeasure.rangeCm}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-primary/90">
                {currentMeasure.instruction}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
