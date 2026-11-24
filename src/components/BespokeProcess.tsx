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
      "Desde la costura superior del hombro hasta el borde final del puño abotonado.",
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
    activeMeasure === id ? "#C8A25A" : "rgba(255, 255, 255, 0.25)";
  const widthFor = (id: MeasureId) => (activeMeasure === id ? 2.4 : 1.2);

  return (
    <section
      id="como-medir"
      aria-labelledby="como-medir-heading"
      className="relative w-full scroll-mt-24 border-t border-white/10 bg-[#111113] text-[#F5F5F7] py-20 sm:py-24 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* Concise Header */}
        <div className="max-w-xl">
          <div className="mb-3 flex items-center gap-3">
            <span aria-hidden="true" className="h-[1px] w-7 bg-gold" />
            <span className="text-xs font-medium tracking-[0.18em] text-gold uppercase">
              Guía de medidas
            </span>
          </div>
          <h2
            id="como-medir-heading"
            className="font-display text-[clamp(2rem,4.2vw,3.3rem)] font-bold leading-[1.03] tracking-[-0.035em] text-[#F5F5F7]"
          >
            ¿Cómo tomar tus medidas?
          </h2>
          <p className="mt-3 text-base text-muted">
            En nuestro atelier de Buenos Aires o guiado por WhatsApp desde
            donde estés.
          </p>
        </div>

        {/* Modality Tabs */}
        <div className="mt-8">
          <div
            role="tablist"
            aria-label="Modalidad de toma de medidas"
            className="inline-flex flex-col sm:flex-row w-full sm:w-auto gap-1.5 rounded-2xl sm:rounded-full border border-white/12 bg-[#1B1B1F] p-1"
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
                      ? "text-[#111113]"
                      : "text-muted hover:text-[#F5F5F7]"
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
                      className="absolute inset-0 rounded-xl sm:rounded-full bg-[#F5F5F7]"
                    />
                  )}
                  <Icon
                    className="relative z-10 h-3.5 w-3.5 shrink-0"
                    aria-hidden="true"
                  />
                  <span className="relative z-10">{tab.text}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 12-Column Split: 3 Concise Steps + Interactive Long-Sleeve 4-Measure Guide */}
        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-start lg:gap-10">
          {/* Left: 3 Short Steps + WhatsApp CTA */}
          <div className="lg:col-span-6 flex flex-col justify-between">
            <ol className="space-y-3.5">
              {currentModality.steps.map((step) => (
                <li
                  key={`${modality}-${step.number}`}
                  className="rounded-2xl border border-white/10 bg-[#1B1B1F] p-5"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-gold/35 bg-[#111113] text-xs font-semibold text-gold">
                      {step.number}
                    </span>
                    <div>
                      <h3 className="font-display text-lg font-bold text-[#F5F5F7]">
                        {step.title}
                      </h3>
                      <p className="mt-1 text-sm text-muted">
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
                className="inline-flex min-h-[48px] items-center justify-center gap-2.5 rounded-full bg-gold px-7 py-3 text-xs font-semibold tracking-[0.06em] text-[#111113] uppercase transition-all duration-200 hover:-translate-y-0.5 hover:bg-gold-hover"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                <span>Coordinar medidas por WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Right: Unified Dark Interactive Long-Sleeve 4-Measurement Schematic */}
          <div className="lg:col-span-6 rounded-3xl border border-white/10 bg-[#1B1B1F] p-5 sm:p-6">
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
                        ? "border-gold bg-gold text-[#111113]"
                        : "border-white/12 bg-[#141417] text-muted hover:border-white/35 hover:text-[#F5F5F7]"
                    }`}
                  >
                    {m.label}
                  </button>
                );
              })}
            </div>

            <div className="mt-4 overflow-hidden rounded-2xl border border-white/10 bg-[#141417] px-3 py-4">
              <svg
                viewBox="0 0 420 355"
                className="mx-auto h-auto w-full max-w-[375px]"
                role="img"
                aria-label={`Esquema manga larga destacando ${currentMeasure.label}`}
              >
                {/* Full Long-Sleeve Dress Shirt Flat Silhouette */}
                <path
                  d="M 166 44 Q 210 60 254 44 L 288 60 L 346 282 L 312 292 L 278 150 L 278 318 Q 210 332 142 318 L 142 150 L 108 292 L 74 282 L 132 60 Z"
                  fill="#1B1B1F"
                  stroke="rgba(255, 255, 255, 0.25)"
                  strokeWidth="1.4"
                  strokeLinejoin="round"
                />
                {/* Collar & Cuffs */}
                <path
                  d="M 166 44 L 184 74 L 210 62 L 236 74 L 254 44"
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.35)"
                  strokeWidth="1.2"
                />
                <path
                  d="M 80 258 L 114 268 L 108 292 L 74 282 Z"
                  fill="#141417"
                  stroke="rgba(255, 255, 255, 0.22)"
                  strokeWidth="1.1"
                />
                <path
                  d="M 306 268 L 340 258 L 346 282 L 312 292 Z"
                  fill="#141417"
                  stroke="rgba(255, 255, 255, 0.22)"
                  strokeWidth="1.1"
                />

                {/* Cuello */}
                <g
                  onClick={() => setActiveMeasure("cuello")}
                  className="cursor-pointer"
                >
                  <path
                    d="M 164 32 Q 210 48 256 32"
                    fill="none"
                    stroke={strokeFor("cuello")}
                    strokeWidth={widthFor("cuello")}
                  />
                  <circle cx="164" cy="32" r="3" fill={strokeFor("cuello")} />
                  <circle cx="256" cy="32" r="3" fill={strokeFor("cuello")} />
                  <text
                    x="210"
                    y="21"
                    textAnchor="middle"
                    fill={activeMeasure === "cuello" ? "#C8A25A" : "#A1A1AA"}
                    fontSize="10"
                    fontWeight="600"
                  >
                    Cuello
                  </text>
                </g>

                {/* Pecho */}
                <g
                  onClick={() => setActiveMeasure("pecho")}
                  className="cursor-pointer"
                >
                  <line
                    x1="142"
                    y1="158"
                    x2="278"
                    y2="158"
                    stroke={strokeFor("pecho")}
                    strokeWidth={widthFor("pecho")}
                    strokeDasharray={activeMeasure === "pecho" ? "0" : "4 3"}
                  />
                  <circle cx="142" cy="158" r="3" fill={strokeFor("pecho")} />
                  <circle cx="278" cy="158" r="3" fill={strokeFor("pecho")} />
                  <text
                    x="210"
                    y="148"
                    textAnchor="middle"
                    fill={activeMeasure === "pecho" ? "#C8A25A" : "#A1A1AA"}
                    fontSize="10"
                    fontWeight="600"
                  >
                    Pecho
                  </text>
                </g>

                {/* Manga Larga */}
                <g
                  onClick={() => setActiveMeasure("manga")}
                  className="cursor-pointer"
                >
                  <line
                    x1="296"
                    y1="56"
                    x2="356"
                    y2="280"
                    stroke={strokeFor("manga")}
                    strokeWidth={widthFor("manga")}
                  />
                  <circle cx="296" cy="56" r="3" fill={strokeFor("manga")} />
                  <circle cx="356" cy="280" r="3" fill={strokeFor("manga")} />
                  <text
                    x="362"
                    y="162"
                    textAnchor="middle"
                    fill={activeMeasure === "manga" ? "#C8A25A" : "#A1A1AA"}
                    fontSize="10"
                    fontWeight="600"
                  >
                    Manga
                  </text>
                </g>

                {/* Largo */}
                <g
                  onClick={() => setActiveMeasure("largo")}
                  className="cursor-pointer"
                >
                  <line
                    x1="54"
                    y1="48"
                    x2="54"
                    y2="324"
                    stroke={strokeFor("largo")}
                    strokeWidth={widthFor("largo")}
                    strokeDasharray={activeMeasure === "largo" ? "0" : "4 3"}
                  />
                  <circle cx="54" cy="48" r="3" fill={strokeFor("largo")} />
                  <circle cx="54" cy="324" r="3" fill={strokeFor("largo")} />
                  <text
                    x="34"
                    y="192"
                    textAnchor="middle"
                    fill={activeMeasure === "largo" ? "#C8A25A" : "#A1A1AA"}
                    fontSize="10"
                    fontWeight="600"
                  >
                    Largo
                  </text>
                </g>
              </svg>
            </div>

            <div className="mt-4 flex items-start justify-between gap-4 rounded-2xl border border-white/10 bg-[#141417] p-4">
              <div>
                <p className="text-sm font-semibold text-[#F5F5F7]">
                  {currentMeasure.label}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-muted">
                  {currentMeasure.instruction}
                </p>
              </div>
              <span className="shrink-0 font-mono text-xs font-medium text-gold tabular-nums">
                {currentMeasure.rangeCm}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
