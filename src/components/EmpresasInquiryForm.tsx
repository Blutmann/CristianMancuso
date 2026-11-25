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
        className="liquid-glass rounded-2xl p-6 sm:p-8"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-black/10 bg-black/[0.04] text-[#16233B] dark:border-white/16 dark:bg-white/[0.06] dark:text-gold">
            <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="ds-caption text-[#16233B] uppercase dark:text-gold">
              Consulta comercial preparada
            </p>
            <h3 className="ds-h2 mt-1.5">Gracias, {form.fullName}.</h3>
            <p className="ds-body mt-2 text-muted">
              Registramos tu solicitud para{" "}
              <strong className="font-semibold text-[#111113] dark:text-white">
                {form.company}
              </strong>{" "}
              ({form.inquiryType} · {form.estimatedQty} unidades estimadas).
              Para respuesta prioritaria del área comercial, podés enviar este
              mismo resumen ahora por WhatsApp.
            </p>
          </div>
        </div>

        <div className="mt-6 rounded-2xl border border-black/10 bg-black/[0.03] p-4 text-xs leading-relaxed text-muted dark:border-white/12 dark:bg-white/[0.04]">
          <p>
            <span className="font-semibold text-[#111113] dark:text-white">
              Tipo:
            </span>{" "}
            {form.inquiryType} ·{" "}
            <span className="font-semibold text-[#111113] dark:text-white">
              Ubicación:
            </span>{" "}
            {form.location}
          </p>
          <p className="mt-1">
            <span className="font-semibold text-[#111113] dark:text-white">
              Contacto:
            </span>{" "}
            {form.contact}
          </p>
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            id="empresas-confirm-whatsapp-btn"
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ds-btn-primary"
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
            className="ds-btn-secondary"
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>Nueva consulta</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="liquid-glass rounded-2xl p-6 sm:p-8">
      <div className="mb-6">
        <p className="ds-caption text-[#16233B] uppercase dark:text-gold">
          Contacto comercial directo
        </p>
        <h2 className="ds-h2 mt-1.5">Solicitá una propuesta a medida</h2>
        <p className="ds-body mt-1.5 text-muted">
          Completá tus datos para recibir catálogo mayorista, muestrario de
          géneros o presupuesto corporativo.
        </p>
      </div>

      {/* Inquiry Type Selector */}
      <div className="mb-5">
        <span className="ds-caption block text-muted uppercase">
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
                className={`cursor-pointer min-h-[44px] rounded-full border px-4 py-2.5 text-xs font-semibold tracking-[0.04em] uppercase transition-all ${
                  active
                    ? "border-[#16233B] bg-[#16233B] text-white dark:border-white dark:bg-white dark:text-[#0B0B0E]"
                    : "border-black/12 bg-white/70 text-[#111113]/75 hover:border-black/25 hover:text-[#111113] dark:border-white/16 dark:bg-white/[0.05] dark:text-white/75 dark:hover:border-white/30 dark:hover:text-white"
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
            className="ds-caption block text-muted uppercase"
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
            className="mt-1.5 w-full rounded-2xl border border-black/12 bg-white/80 px-4 py-3 text-sm text-[#111113] placeholder:text-muted/60 focus:border-[#16233B] focus:outline-none dark:border-white/16 dark:bg-white/[0.06] dark:text-[#F8FAFC] dark:placeholder:text-white/40 dark:focus:border-white"
          />
        </div>

        <div>
          <label
            htmlFor="emp-company"
            className="ds-caption block text-muted uppercase"
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
            className="mt-1.5 w-full rounded-2xl border border-black/12 bg-white/80 px-4 py-3 text-sm text-[#111113] placeholder:text-muted/60 focus:border-[#16233B] focus:outline-none dark:border-white/16 dark:bg-white/[0.06] dark:text-[#F8FAFC] dark:placeholder:text-white/40 dark:focus:border-white"
          />
        </div>

        <div>
          <label
            htmlFor="emp-location"
            className="ds-caption block text-muted uppercase"
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
            className="mt-1.5 w-full rounded-2xl border border-black/12 bg-white/80 px-4 py-3 text-sm text-[#111113] placeholder:text-muted/60 focus:border-[#16233B] focus:outline-none dark:border-white/16 dark:bg-white/[0.06] dark:text-[#F8FAFC] dark:placeholder:text-white/40 dark:focus:border-white"
          />
        </div>

        <div>
          <label
            htmlFor="emp-qty"
            className="ds-caption block text-muted uppercase"
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
            className="mt-1.5 w-full rounded-2xl border border-black/12 bg-white/80 px-4 py-3 text-sm text-[#111113] placeholder:text-muted/60 focus:border-[#16233B] focus:outline-none dark:border-white/16 dark:bg-white/[0.06] dark:text-[#F8FAFC] dark:placeholder:text-white/40 dark:focus:border-white"
          />
        </div>
      </div>

      <div className="mt-4">
        <label
          htmlFor="emp-contact"
          className="ds-caption block text-muted uppercase"
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
          className="mt-1.5 w-full rounded-2xl border border-black/12 bg-white/80 px-4 py-3 text-sm text-[#111113] placeholder:text-muted/60 focus:border-[#16233B] focus:outline-none dark:border-white/16 dark:bg-white/[0.06] dark:text-[#F8FAFC] dark:placeholder:text-white/40 dark:focus:border-white"
        />
      </div>

      <button
        id="empresas-submit-btn"
        type="submit"
        className="ds-btn-primary mt-6 w-full sm:w-auto"
      >
        <Send className="h-3.5 w-3.5" aria-hidden="true" />
        <span>Enviar consulta comercial</span>
      </button>
    </form>
  );
}
