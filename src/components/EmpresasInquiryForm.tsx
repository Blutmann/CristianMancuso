"use client";

import { useState, type FormEvent } from "react";
import { CheckCircle2, MessageCircle, RotateCcw, Send } from "lucide-react";
import { buildWhatsAppUrl } from "@/data/config";

type InquiryType = "Corporativo" | "Mayorista";

interface InquiryFormState {
  fullName: string;
  company: string;
  location: string;
  inquiryType: InquiryType;
  estimatedQty: string;
  contact: string;
}

const INITIAL_STATE: InquiryFormState = {
  fullName: "",
  company: "",
  location: "",
  inquiryType: "Corporativo",
  estimatedQty: "",
  contact: "",
};

export function EmpresasInquiryForm() {
  const [form, setForm] = useState<InquiryFormState>(INITIAL_STATE);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const whatsappUrl = buildWhatsAppUrl(
    [
      `Hola Cristian Mancuso — Consulta ${form.inquiryType}:`,
      "",
      `• Nombre: ${form.fullName}`,
      `• Empresa / Local: ${form.company}`,
      `• Ciudad / País: ${form.location}`,
      `• Tipo de consulta: ${form.inquiryType}`,
      `• Cantidad estimada: ${form.estimatedQty}`,
      `• Contacto: ${form.contact}`,
    ].join("\n")
  );

  if (submitted) {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-3xl border border-champagne/40 bg-elevated p-6 sm:p-8"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-champagne/40 bg-champagne/10 text-champagne">
            <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="font-mono text-[10px] tracking-[0.22em] text-champagne uppercase">
              CONSULTA COMERCIAL PREPARADA
            </p>
            <h3 className="mt-1.5 font-display text-2xl font-bold tracking-[-0.02em] text-primary">
              Gracias, {form.fullName}.
            </h3>
            <p className="mt-2 text-sm leading-relaxed text-muted">
              Registramos tu solicitud para{" "}
              <strong className="text-primary">{form.company}</strong> (
              {form.inquiryType} · {form.estimatedQty} unidades estimadas). Para
              respuesta prioritaria del área comercial, podés enviar este mismo
              resumen ahora por WhatsApp.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-white/[0.08] bg-obsidian/70 p-4 font-mono text-[11px] leading-relaxed text-muted">
          <p>
            <span className="text-primary">Tipo:</span> {form.inquiryType} ·{" "}
            <span className="text-primary">Ubicación:</span> {form.location}
          </p>
          <p className="mt-1">
            <span className="text-primary">Contacto:</span> {form.contact}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            id="empresas-confirm-whatsapp-btn"
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-champagne px-6 py-3 text-xs font-semibold tracking-[0.08em] text-obsidian uppercase transition-transform hover:-translate-y-0.5"
          >
            <MessageCircle className="h-4 w-4" aria-hidden="true" />
            <span>Enviar esta consulta por WhatsApp</span>
          </a>

          <button
            type="button"
            onClick={() => {
              setSubmitted(false);
              setForm(INITIAL_STATE);
            }}
            className="cursor-pointer inline-flex items-center gap-1.5 rounded-full border border-white/[0.14] px-4 py-3 text-xs font-medium text-muted transition-colors hover:border-white/[0.3] hover:text-primary"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Nueva consulta</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-3xl border border-white/[0.09] bg-elevated p-6 sm:p-8"
    >
      <div className="mb-6">
        <p className="font-mono text-[10px] tracking-[0.22em] text-cyan uppercase">
          CONTACTO COMERCIAL DIRECTO
        </p>
        <h2 className="mt-1.5 font-display text-2xl font-bold tracking-[-0.025em] text-primary">
          Solicitá una propuesta a medida
        </h2>
        <p className="mt-1.5 text-sm text-muted">
          Completá tus datos para recibir catálogo mayorista, muestrario de
          géneros o presupuesto corporativo.
        </p>
      </div>

      {/* Inquiry Type Selector */}
      <div className="mb-5">
        <span className="block font-mono text-[10px] tracking-[0.18em] text-muted uppercase">
          Tipo de consulta
        </span>
        <div className="mt-2 grid grid-cols-2 gap-2.5">
          {(["Corporativo", "Mayorista"] as const).map((type) => {
            const active = form.inquiryType === type;
            return (
              <button
                key={type}
                type="button"
                aria-pressed={active}
                onClick={() => setForm((f) => ({ ...f, inquiryType: type }))}
                className={`cursor-pointer min-h-[44px] rounded-xl border px-4 py-2.5 text-xs font-semibold tracking-[0.06em] uppercase transition-all ${
                  active
                    ? "border-champagne bg-champagne/15 text-primary"
                    : "border-white/[0.09] bg-obsidian/70 text-muted hover:border-white/[0.2] hover:text-primary"
                }`}
              >
                {type}
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="emp-fullname"
            className="block font-mono text-[10px] tracking-[0.16em] text-muted uppercase"
          >
            Nombre y Apellido
          </label>
          <input
            id="emp-fullname"
            type="text"
            required
            value={form.fullName}
            onChange={(e) =>
              setForm((f) => ({ ...f, fullName: e.target.value }))
            }
            placeholder="Ej. Martín Gómez"
            className="mt-1.5 w-full rounded-xl border border-white/[0.12] bg-obsidian px-4 py-3 text-sm text-primary placeholder:text-muted/50 focus:border-champagne focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="emp-company"
            className="block font-mono text-[10px] tracking-[0.16em] text-muted uppercase"
          >
            Empresa o Local
          </label>
          <input
            id="emp-company"
            type="text"
            required
            value={form.company}
            onChange={(e) =>
              setForm((f) => ({ ...f, company: e.target.value }))
            }
            placeholder="Ej. Estudio / Boutique"
            className="mt-1.5 w-full rounded-xl border border-white/[0.12] bg-obsidian px-4 py-3 text-sm text-primary placeholder:text-muted/50 focus:border-champagne focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="emp-location"
            className="block font-mono text-[10px] tracking-[0.16em] text-muted uppercase"
          >
            Ciudad / País
          </label>
          <input
            id="emp-location"
            type="text"
            required
            value={form.location}
            onChange={(e) =>
              setForm((f) => ({ ...f, location: e.target.value }))
            }
            placeholder="Ej. Córdoba, Argentina"
            className="mt-1.5 w-full rounded-xl border border-white/[0.12] bg-obsidian px-4 py-3 text-sm text-primary placeholder:text-muted/50 focus:border-champagne focus:outline-none"
          />
        </div>

        <div>
          <label
            htmlFor="emp-qty"
            className="block font-mono text-[10px] tracking-[0.16em] text-muted uppercase"
          >
            Cantidad estimada
          </label>
          <input
            id="emp-qty"
            type="text"
            required
            value={form.estimatedQty}
            onChange={(e) =>
              setForm((f) => ({ ...f, estimatedQty: e.target.value }))
            }
            placeholder="Ej. 25 camisas"
            className="mt-1.5 w-full rounded-xl border border-white/[0.12] bg-obsidian px-4 py-3 text-sm text-primary placeholder:text-muted/50 focus:border-champagne focus:outline-none"
          />
        </div>
      </div>

      <div className="mt-4">
        <label
          htmlFor="emp-contact"
          className="block font-mono text-[10px] tracking-[0.16em] text-muted uppercase"
        >
          WhatsApp o Email
        </label>
        <input
          id="emp-contact"
          type="text"
          required
          value={form.contact}
          onChange={(e) => setForm((f) => ({ ...f, contact: e.target.value }))}
          placeholder="Ej. +54 9 11 ... o nombre@empresa.com"
          className="mt-1.5 w-full rounded-xl border border-white/[0.12] bg-obsidian px-4 py-3 text-sm text-primary placeholder:text-muted/50 focus:border-champagne focus:outline-none"
        />
      </div>

      <button
        id="empresas-submit-btn"
        type="submit"
        className="cursor-pointer mt-6 inline-flex w-full sm:w-auto items-center justify-center gap-2 rounded-full bg-ivory px-7 py-3.5 text-xs font-semibold tracking-[0.08em] text-obsidian uppercase transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-champagne"
      >
        <Send className="h-3.5 w-3.5" aria-hidden="true" />
        <span>Enviar consulta comercial</span>
      </button>
    </form>
  );
}
