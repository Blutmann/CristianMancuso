import type { Currency, FabricCategoryId } from "./fabrics";
import { formatFabricPrice } from "./fabrics";
import { buildWhatsAppUrl } from "./config";

export { WHATSAPP_NUMBER } from "./config";

export type ShirtBadge =
  | "DESTACADO"
  | "EDICIÓN LIMITADA"
  | "NOVEDAD"
  | "OFERTA";

export type WeaveKind =
  | "twill"
  | "linen"
  | "oxford"
  | "windowpane"
  | "mineral-stripe";

export interface CatalogShirt {
  id: string;
  name: string;
  refCode: string;
  fabricId: FabricCategoryId;
  fabricLabel: string;
  priceArs: number;
  compareAtArs?: number;
  badge?: ShirtBadge;
  weaveKind: WeaveKind;
  baseHex: string;
  secondaryHex: string;
  accentLineHex: string;
  isLightFabric?: boolean;
  composition: string;
  sizeType: "numeric" | "alpha";
  studioImage: string;
}

export const CATALOG_SHIRTS: CatalogShirt[] = [
  {
    id: "pima-piura-noche",
    name: "Piura Noche",
    refCode: "Ref. Art. 2529",
    fabricId: "pima",
    fabricLabel: "Algodón Pima Peruano",
    priceArs: 120000,
    compareAtArs: 140000,
    badge: "DESTACADO",
    weaveKind: "twill",
    baseHex: "#101A2B",
    secondaryHex: "#1B2C47",
    accentLineHex: "rgba(147, 197, 253, 0.14)",
    composition: "Algodón Pima Peruano 120/2",
    sizeType: "numeric",
    studioImage: "/images/shirts/pima-noche.png",
  },
  {
    id: "pima-piura-acero",
    name: "Piura Acero",
    refCode: "Ref. Art. 2530",
    fabricId: "pima",
    fabricLabel: "Algodón Pima Peruano",
    priceArs: 120000,
    compareAtArs: 140000,
    weaveKind: "twill",
    baseHex: "#2C394B",
    secondaryHex: "#44576D",
    accentLineHex: "rgba(226, 232, 240, 0.16)",
    composition: "Algodón Pima Peruano 120/2",
    sizeType: "numeric",
    studioImage: "/images/shirts/pima-acero.png",
  },
  {
    id: "biella-lino-negro",
    name: "Biella Negro",
    refCode: "Ref. Art. Lino 01",
    fabricId: "italiano",
    fabricLabel: "Lino Italiano",
    priceArs: 200000,
    badge: "EDICIÓN LIMITADA",
    weaveKind: "linen",
    baseHex: "#141518",
    secondaryHex: "#24262B",
    accentLineHex: "rgba(200, 169, 126, 0.16)",
    composition: "100% Lino Italiano de Biella",
    sizeType: "numeric",
    studioImage: "/images/shirts/lino-negro.png",
  },
  {
    id: "biella-lino-marfil",
    name: "Biella Marfil",
    refCode: "Ref. Art. Lino 02",
    fabricId: "italiano",
    fabricLabel: "Lino Italiano",
    priceArs: 200000,
    badge: "NOVEDAD",
    weaveKind: "linen",
    baseHex: "#E8E1D3",
    secondaryHex: "#D6CBB8",
    accentLineHex: "rgba(122, 102, 74, 0.18)",
    isLightFabric: true,
    composition: "100% Lino Italiano de Biella",
    sizeType: "numeric",
    studioImage: "/images/shirts/lino-marfil.png",
  },
  {
    id: "urbano-oxford-grafito",
    name: "Oxford Grafito",
    refCode: "Ref. Art. 2514",
    fabricId: "urbano",
    fabricLabel: "Algodón Urbano",
    priceArs: 79000,
    weaveKind: "oxford",
    baseHex: "#2A2D34",
    secondaryHex: "#3C414B",
    accentLineHex: "rgba(245, 242, 235, 0.12)",
    composition: "Algodón Urbano Oxford Easy Care",
    sizeType: "numeric",
    studioImage: "/images/shirts/oxford-grafito.png",
  },
  {
    id: "cuadros-ventana-lino-algodon",
    name: "Cuadros Lino",
    refCode: "Ref. Art. 2518",
    fabricId: "urbano",
    fabricLabel: "Algodón Urbano",
    priceArs: 89000,
    compareAtArs: 120000,
    badge: "OFERTA",
    weaveKind: "windowpane",
    baseHex: "#1C2430",
    secondaryHex: "#273345",
    accentLineHex: "rgba(200, 169, 126, 0.28)",
    composition: "Blend Lino & Algodón Urbano",
    sizeType: "numeric",
    studioImage: "/images/shirts/cuadros-ventana.png",
  },
  {
    id: "donna-cloque-raya-mineral",
    name: "Donna Mineral",
    refCode: "Ref. Donna 027",
    fabricId: "donna",
    fabricLabel: "Mancuso Donna",
    priceArs: 62000,
    badge: "NOVEDAD",
    weaveKind: "mineral-stripe",
    baseHex: "#D8D3CC",
    secondaryHex: "#C5BEB5",
    accentLineHex: "rgba(56, 70, 88, 0.24)",
    isLightFabric: true,
    composition: "Cloqué liviano · Corte femenino",
    sizeType: "alpha",
    studioImage: "/images/shirts/donna-mineral.png",
  },
];

export const COLLAR_OPTIONS = [
  "Italiano",
  "Francés",
  "Oxford",
  "Americano",
  "Mao",
] as const;

export type CollarOption = (typeof COLLAR_OPTIONS)[number];

export const COLLAR_META: Record<
  CollarOption,
  { note: string; detail: string; macroImage: string }
> = {
  Italiano: {
    note: "Clásico versátil",
    detail: "Puntas equilibradas · Ideal con o sin corbata",
    macroImage: "/images/collars/italiano.png",
  },
  Francés: {
    note: "Puntas abiertas",
    detail: "Apertura amplia · Elegancia sastrera clásica",
    macroImage: "/images/collars/frances.png",
  },
  Oxford: {
    note: "Caída suave",
    detail: "Estructura relajada · Perfecto uso diario",
    macroImage: "/images/collars/oxford.png",
  },
  Americano: {
    note: "Button-down",
    detail: "Puntas abotonadas · Estilo smart-casual",
    macroImage: "/images/collars/americano.png",
  },
  Mao: {
    note: "Sin solapa",
    detail: "Cuello tirilla limpio · Silueta minimalista",
    macroImage: "/images/collars/mao.png",
  },
};

export const BUTTON_OPTIONS = [
  {
    id: "Blanco",
    label: "Blanco",
    shortLabel: "Blanco",
    fill: "#F8F8FA",
    ring: "rgba(17, 17, 19, 0.22)",
    thread: "#B08D57",
    macroImage: "/images/buttons/blanco.png",
  },
  {
    id: "Negro",
    label: "Negro",
    shortLabel: "Negro",
    fill: "#18191D",
    ring: "rgba(255, 255, 255, 0.28)",
    thread: "#9CA3AF",
    macroImage: "/images/buttons/negro.png",
  },
  {
    id: "Mismo tono que la camisa",
    label: "Mismo tono que la camisa",
    shortLabel: "Al tono",
    fill: "#46586F",
    ring: "rgba(255, 255, 255, 0.32)",
    thread: "#E2E8F0",
    macroImage: "/images/buttons/mismo-tono.png",
  },
  {
    id: "Nácar blanco",
    label: "Nácar blanco",
    shortLabel: "Nácar blanco",
    fill: "#F2EFE9",
    ring: "rgba(176, 141, 87, 0.45)",
    thread: "#C8A97E",
    macroImage: "/images/buttons/nacar-blanco.png",
  },
] as const;

export const MONOGRAM_PLACEMENTS = ["Puño izquierdo", "Pechera"] as const;

export const MONOGRAM_THREAD_OPTIONS = [
  { id: "Blanco", label: "Blanco", hex: "#F8F8FA", ring: "rgba(17,17,19,0.22)" },
  { id: "Negro", label: "Negro", hex: "#141518", ring: "rgba(255,255,255,0.28)" },
  { id: "Champagne", label: "Champagne", hex: "#D6C3A5", ring: "rgba(176,141,87,0.5)" },
  { id: "Azul Noche", label: "Azul Noche", hex: "#1B2E4B", ring: "rgba(147,197,253,0.35)" },
] as const;

export const NUMERIC_SIZES = ["38", "40", "42", "44", "46"] as const;
export const ALPHA_SIZES = ["S", "M", "L", "XL"] as const;

export type ButtonOption = (typeof BUTTON_OPTIONS)[number]["id"];
export type MonogramPlacement = (typeof MONOGRAM_PLACEMENTS)[number];
export type MonogramThreadOption = (typeof MONOGRAM_THREAD_OPTIONS)[number]["id"];
export type CommercialSize =
  | (typeof NUMERIC_SIZES)[number]
  | (typeof ALPHA_SIZES)[number];

export interface BespokeMeasurements {
  cuello: string;
  pecho: string;
  manga: string;
  largo: string;
}

export interface ShirtConfiguration {
  mode: "commercial" | "bespoke";
  commercialSize?: CommercialSize;
  collar?: CollarOption;
  button?: ButtonOption;
  monogramText?: string;
  monogramPlacement?: MonogramPlacement;
  monogramThread?: MonogramThreadOption;
  measurements?: BespokeMeasurements;
}

export interface SelectionItem {
  key: string;
  shirt: CatalogShirt;
  config: ShirtConfiguration;
  quantity: number;
}

export function formatMonogramDisplay(raw?: string): string {
  if (!raw) return "";
  const cleaned = raw
    .toUpperCase()
    .replace(/[^A-ZÁÉÍÓÚÑ]/g, "")
    .slice(0, 3);
  if (!cleaned) return "";
  return cleaned.split("").join(".") + ".";
}

export function formatMeasurementsInline(m?: BespokeMeasurements): string {
  if (!m) return "Medidas a coordinar por WhatsApp";
  const parts: string[] = [];
  if (m.cuello) parts.push(`Cuello ${m.cuello}cm`);
  if (m.pecho) parts.push(`Pecho ${m.pecho}cm`);
  if (m.manga) parts.push(`Manga ${m.manga}cm`);
  if (m.largo) parts.push(`Largo ${m.largo}cm`);
  return parts.length > 0
    ? parts.join(", ")
    : "Medidas a coordinar por WhatsApp";
}

export function buildSelectionPlainText(
  items: SelectionItem[],
  currency: Currency
): string {
  const totalArs = items.reduce(
    (sum, item) => sum + item.shirt.priceArs * item.quantity,
    0
  );

  const lines: string[] = [
    "Hola Cristian Mancuso, te envío mi pedido:",
    "",
  ];

  items.forEach((item, index) => {
    const qtyLabel = item.quantity > 1 ? ` (x${item.quantity})` : "";
    if (item.config.mode === "commercial") {
      lines.push(
        `${index + 1}) Camisa: ${item.shirt.name} (${item.shirt.refCode})${qtyLabel} | Talle comercial: ${item.config.commercialSize ?? "40"} | ${formatFabricPrice(item.shirt.priceArs * item.quantity, currency)}`
      );
    } else {
      const monogram = formatMonogramDisplay(item.config.monogramText);
      const threadPart = item.config.monogramThread
        ? ` · hilo ${item.config.monogramThread}`
        : "";
      const monogramPart = monogram
        ? ` | Iniciales: ${monogram} (${item.config.monogramPlacement ?? "Puño izquierdo"}${threadPart})`
        : "";
      lines.push(
        `${index + 1}) Camisa: ${item.shirt.name} (${item.shirt.refCode})${qtyLabel} | Cuello: ${item.config.collar ?? "Italiano"} | Botón: ${item.config.button ?? "Nácar blanco"}${monogramPart} | Medidas: ${formatMeasurementsInline(item.config.measurements)} | ${formatFabricPrice(item.shirt.priceArs * item.quantity, currency)}`
      );
    }
  });

  lines.push("");
  lines.push(`Total estimado: ${formatFabricPrice(totalArs, currency)}`);

  return lines.join("\n");
}

export function buildSelectionWhatsAppUrl(
  items: SelectionItem[],
  currency: Currency
): string {
  return buildWhatsAppUrl(buildSelectionPlainText(items, currency));
}
