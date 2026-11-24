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
}

export const CATALOG_SHIRTS: CatalogShirt[] = [
  {
    id: "pima-piura-noche",
    name: "Pima Piura Noche",
    refCode: "Ref. Art. 2529",
    fabricId: "pima",
    fabricLabel: "Algodón Peruano",
    priceArs: 120000,
    compareAtArs: 140000,
    badge: "DESTACADO",
    weaveKind: "twill",
    baseHex: "#101A2B",
    secondaryHex: "#1B2C47",
    accentLineHex: "rgba(147, 197, 253, 0.14)",
    composition: "Algodón Pima Peruano 120/2",
    sizeType: "numeric",
  },
  {
    id: "pima-piura-acero",
    name: "Pima Piura Acero",
    refCode: "Ref. Art. 2530",
    fabricId: "pima",
    fabricLabel: "Algodón Peruano",
    priceArs: 120000,
    compareAtArs: 140000,
    weaveKind: "twill",
    baseHex: "#2C394B",
    secondaryHex: "#44576D",
    accentLineHex: "rgba(226, 232, 240, 0.16)",
    composition: "Algodón Pima Peruano 120/2",
    sizeType: "numeric",
  },
  {
    id: "biella-lino-negro",
    name: "Biella Lino Puro Negro",
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
  },
  {
    id: "biella-lino-marfil",
    name: "Biella Lino Puro Marfil",
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
  },
  {
    id: "urbano-oxford-grafito",
    name: "Urbano Oxford Grafito",
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
  },
  {
    id: "cuadros-ventana-lino-algodon",
    name: "Cuadros Ventana Lino & Algodón",
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
  },
  {
    id: "donna-cloque-raya-mineral",
    name: "Donna Cloque Raya Mineral",
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
  },
];

export const COLLAR_OPTIONS = [
  "Italiano",
  "Francés",
  "Button-Down",
  "Mao",
] as const;

export const BUTTON_OPTIONS = [
  {
    id: "Nácar Blanco",
    label: "Nácar Blanco",
    fill: "#F4F7FA",
    ring: "rgba(18, 18, 21, 0.22)",
    thread: "#C8A97E",
  },
  {
    id: "Nácar Humo",
    label: "Nácar Humo",
    fill: "#58606E",
    ring: "rgba(255, 255, 255, 0.35)",
    thread: "#D4D4D8",
  },
  {
    id: "Mate Oscuro",
    label: "Mate Oscuro",
    fill: "#1B1D22",
    ring: "rgba(255, 255, 255, 0.22)",
    thread: "#9CA3AF",
  },
  {
    id: "Champagne",
    label: "Champagne",
    fill: "#C8A97E",
    ring: "rgba(255, 255, 255, 0.45)",
    thread: "#121215",
  },
] as const;

export const MONOGRAM_PLACEMENTS = ["Puño izquierdo", "Pechera"] as const;

export const NUMERIC_SIZES = ["38", "40", "42", "44", "46"] as const;
export const ALPHA_SIZES = ["S", "M", "L", "XL"] as const;

export type CollarOption = (typeof COLLAR_OPTIONS)[number];
export type ButtonOption = (typeof BUTTON_OPTIONS)[number]["id"];
export type MonogramPlacement = (typeof MONOGRAM_PLACEMENTS)[number];
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
  if (!m) return "A coordinar con el atelier";
  const parts: string[] = [];
  if (m.cuello) parts.push(`Cuello ${m.cuello}cm`);
  if (m.pecho) parts.push(`Pecho ${m.pecho}cm`);
  if (m.manga) parts.push(`Manga ${m.manga}cm`);
  if (m.largo) parts.push(`Largo ${m.largo}cm`);
  return parts.length > 0 ? parts.join(", ") : "A coordinar con el atelier";
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
      const monogramPart = monogram
        ? ` | Iniciales: ${monogram} (${item.config.monogramPlacement ?? "Puño izquierdo"})`
        : "";
      lines.push(
        `${index + 1}) Camisa: ${item.shirt.name} (${item.shirt.refCode})${qtyLabel} | Cuello: ${item.config.collar ?? "Italiano"} | Botón: ${item.config.button ?? "Nácar Blanco"}${monogramPart} | Medidas: ${formatMeasurementsInline(item.config.measurements)} | ${formatFabricPrice(item.shirt.priceArs * item.quantity, currency)}`
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
