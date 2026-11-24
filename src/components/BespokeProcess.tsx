"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Globe, MapPin, MessageCircle } from "lucide-react";
import { buildWhatsAppUrl } from "@/data/config";
import { useMotion } from "@/context/MotionContext";

type Modality = "presencial" | "distancia";
type MeasureId = "cuello" | "pecho" | "manga" | "largo";

const MODALITIES: Record<
  Modality,
  {
    label: string;
    steps: { number: string; title: string; description: string }[];
    whatsappMessage: string;
  }
> = {
  presencial: {
    label: "Buenos Aires (Presencial)",
    steps: [
      {
        number: "01",
        title: "Elegís tela y detalles",
        description: "Armás tu selección online antes de tu visita.",
      },
      {
        number: "02",
        title: "Cita de 15 min en el Atelier",
        description: "Tomamos tus medidas exactas y definimos el calce.",
      },
      {
        number: "03",
        title: "Confección y entrega",
        description: "Tu camisa a medida sin costo extra, lista en días.",
      },
    ],
    whatsappMessage:
      "Hola Cristian Mancuso, estoy en Buenos Aires y quiero coordinar una cita de 15 min para tomar mis medidas.",
  },
  distancia: {
    label: "Interior / Exterior por WhatsApp",
    steps: [
      {
        number: "01",
        title: "Enviás tu selección",
        description: "Nos compartís la tela elegida y tu altura y peso.",
      },
      {
        number: "02",
        title: "Medís tu camisa favorita",
        description: "Te guiamos en 4 medidas rápidas sobre una camisa tuya.",
      },
      {
        number: "03",
        title: "Envío asegurado",
        description: "Despachamos a todo el país, México, EE. UU. y España.",
      },
    ],
    whatsappMessage:
      "Hola Cristian Mancuso, quiero pedir a medida a distancia y coordinar las 4 medidas por WhatsApp.",
  },
};

const MEASURES: Record<
  MeasureId,
  {
    id: MeasureId;
    label: string;
    rangeCm: string;
    instruction: string;
  }
> = {
  cuello: {
    id: "cuello",
    label: "Cuello",
    rangeCm: "38 – 45 cm",
    instruction:
      "Con el cuello abierto sobre una mesa, medí desde el centro del botón hasta el ojal.",
  },
  pecho: {
    id: "pecho",
    label: "Pecho",
    rangeCm: "51 – 62 cm",
    instruction:
      "Con la camisa abotonada y plana, medí de axila a axila en línea recta.",
  },
  manga: {
    id: "manga",
    label: "Manga",
    rangeCm: "61 – 68 cm",
    instruction:
      "Desde la costura superior del hombro hasta el borde final del puño.",
  },
  largo: {
    id: "largo",
    label: "Largo",
    rangeCm: "73 – 81 cm",
    instruction:
      "Por la espalda, desde la base del cuello hasta el borde inferior.",
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
    activeMeasure === id ? "#78572B" : "rgba(18, 18, 21, 0.25)";
  const widthFor = (id: MeasureId) => (activeMeasure === id ? 2.4 : 1.2);

  return (
    <section
      id="como-medir"
      aria-labelledby="como-medir-heading"
      className="relative w-full scroll-mt-24 bg-ivory text-[#121215] py-20 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* Concise Header */}
        <div className="max-w-xl">
          <h2
            id="como-medir-heading"
            className="font-display text-[clamp(2rem,4.2vw,3.3rem)] font-bold leading-[1.03] tracking-[-0.035em] text-[#121215]"
          >
            ¿Cómo tomar tus medidas?
          </h2>
          <p className="mt-3 text-base text-[#4B4D55]">
            En nuestro atelier de Buenos Aires o guiado por WhatsApp desde
            donde estés.
          </p>
        </div>

        {/* Modality Tabs */}
        <div className="mt-8">
          <div
            role="tablist"
            aria-label="Modalidad de toma de medidas"
            className="inline-flex flex-col sm:flex-row w-full sm:w-auto gap-1.5 rounded-2xl sm:rounded-full border border-[#121215]/14 bg-[#E9E4D8] p-1"
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
                  className={`cursor-pointer relative flex min-h-[44px] items-center justify-center gap-2 rounded-xl sm:rounded-full px-5 py-2 text-xs font-semibold transition-colors ${
                    isActive
                      ? "text-[#F5F2EB]"
                      : "text-[#4B4D55] hover:text-[#121215]"
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
                      className="absolute inset-0 rounded-xl sm:rounded-full bg-[#121215]"
                    />
                  )}
                  <Icon className="relative z-10 h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                  <span className="relative z-10">{tab.text}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 12-Column Split: 3 Concise Steps + Interactive 4-Measure Guide */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start lg:gap-10">
          {/* Left: 3 Short Steps + WhatsApp CTA */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <ol className="space-y-3.5">
              {currentModality.steps.map((step) => (
                <li
                  key={`${modality}-${step.number}`}
                  className="rounded-2xl border border-[#121215]/10 bg-[#FAF8F4] p-5"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#121215] text-xs font-semibold text-champagne">
                      {step.number}
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-bold text-[#121215]">
                        {step.title}
                      </h3>
                      <p className="mt-1 text-sm text-[#4B4D55]">
                        {step.description}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ol>

            <div className="mt-6">
              <a
                id="bespoke-whatsapp-cta"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex min-h-[48px] items-center justify-center gap-2.5 rounded-full bg-[#121215] px-7 py-3 text-xs font-semibold tracking-[0.06em] text-[#F5F2EB] uppercase transition-transform duration-200 hover:-translate-y-0.5"
              >
                <MessageCircle className="h-4 w-4 text-champagne" aria-hidden="true" />
                <span>Coordinar medidas por WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Right: Clean Interactive 4-Measurement Schematic */}
          <div className="lg:col-span-6 rounded-3xl border border-[#121215]/10 bg-[#FAF8F4] p-5 sm:p-6">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
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
                    className={`cursor-pointer min-h-[44px] rounded-xl border px-3 py-2 text-center text-xs font-semibold transition-all ${
                      isActive
                        ? "border-[#121215] bg-[#121215] text-[#F5F2EB]"
                        : "border-[#121215]/14 bg-[#F4F1EA] text-[#4B4D55] hover:border-[#121215]/40 hover:text-[#121215]"
                    }`}
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 overflow-hidden rounded-2xl border border-[#121215]/10 bg-[#F4F1EA] px-3 py-4">
              <svg
                viewBox="0 0 420 295"
                className="mx-auto h-auto w-full max-w-[370px]"
                role="img"
                aria-label={`Esquema de medición destacando ${currentMeasure.label}`}
              >
                <path
                  d="M 164 42 Q 210 58 256 42 L 288 60 L 364 128 L 334 158 L 292 120 L 292 260 Q 210 274 128 260 L 128 120 L 86 158 L 56 128 L 132 60 Z"
                  fill="#FAF8F4"
                  stroke="rgba(18, 18, 21, 0.25)"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                />
                <path
                  d="M 164 42 L 184 72 L 210 60 L 236 72 L 256 42"
                  fill="none"
                  stroke="rgba(18, 18, 21, 0.35)"
                  strokeWidth="1.2"
                />

                {/* Cuello */}
                <g onClick={() => setActiveMeasure("cuello")} className="cursor-pointer">
                  <path
                    d="M 162 30 Q 210 46 258 30"
                    fill="none"
                    stroke={strokeFor("cuello")}
                    strokeWidth={widthFor("cuello")}
                  />
                  <circle cx="162" cy="30" r="3" fill={strokeFor("cuello")} />
                  <circle cx="258" cy="30" r="3" fill={strokeFor("cuello")} />
                  <text
                    x="210"
                    y="19"
                    textAnchor="middle"
                    fill={activeMeasure === "cuello" ? "#78572B" : "#6B6D76"}
                    fontSize="10"
                    fontWeight="600"
                  >
                    Cuello
                  </text>
                </g>

                {/* Pecho */}
                <g onClick={() => setActiveMeasure("pecho")} className="cursor-pointer">
                  <line
                    x1="128"
                    y1="132"
                    x2="292"
                    y2="132"
                    stroke={strokeFor("pecho")}
                    strokeWidth={widthFor("pecho")}
                    strokeDasharray={activeMeasure === "pecho" ? "0" : "4 3"}
                  />
                  <circle cx="128" cy="132" r="3" fill={strokeFor("pecho")} />
                  <circle cx="292" cy="132" r="3" fill={strokeFor("pecho")} />
                  <text
                    x="210"
                    y="122"
                    textAnchor="middle"
                    fill={activeMeasure === "pecho" ? "#78572B" : "#6B6D76"}
                    fontSize="10"
                    fontWeight="600"
                  >
                    Pecho
                  </text>
                </g>

                {/* Manga */}
                <g onClick={() => setActiveMeasure("manga")} className="cursor-pointer">
                  <line
                    x1="292"
                    y1="52"
                    x2="372"
                    y2="124"
                    stroke={strokeFor("manga")}
                    strokeWidth={widthFor("manga")}
                  />
                  <circle cx="292" cy="52" r="3" fill={strokeFor("manga")} />
                  <circle cx="372" cy="124" r="3" fill={strokeFor("manga")} />
                  <text
                    x="352"
                    y="74"
                    textAnchor="middle"
                    fill={activeMeasure === "manga" ? "#78572B" : "#6B6D76"}
                    fontSize="10"
                    fontWeight="600"
                  >
                    Manga
                  </text>
                </g>

                {/* Largo */}
                <g onClick={() => setActiveMeasure("largo")} className="cursor-pointer">
                  <line
                    x1="102"
                    y1="48"
                    x2="102"
                    y2="266"
                    stroke={strokeFor("largo")}
                    strokeWidth={widthFor("largo")}
                    strokeDasharray={activeMeasure === "largo" ? "0" : "4 3"}
                  />
                  <circle cx="102" cy="48" r="3" fill={strokeFor("largo")} />
                  <circle cx="102" cy="266" r="3" fill={strokeFor("largo")} />
                  <text
                    x="66"
                    y="206"
                    textAnchor="middle"
                    fill={activeMeasure === "largo" ? "#78572B" : "#6B6D76"}
                    fontSize="10"
                    fontWeight="600"
                  >
                    Largo
                  </text>
                </g>
              </svg>
            </div>

            <div className="mt-4 flex items-start justify-between gap-4 rounded-2xl bg-[#F4F1EA] p-4">
              <div>
                <p className="text-sm font-semibold text-[#121215]">
                  {currentMeasure.label}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-[#4B4D55]">
                  {currentMeasure.instruction}
                </p>
              </div>
              <span className="shrink-0 font-mono text-xs font-medium text-[#78572B] tabular-nums">
                {currentMeasure.rangeCm}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
