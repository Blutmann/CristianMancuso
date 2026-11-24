import type { Currency, FabricCategoryId } from "./fabrics";
import { formatFabricPrice } from "./fabrics";

export const WHATSAPP_NUMBER = "5491100000000";

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
    composition: "100% Algodón Pima Peruano · Hilado 120/2",
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
    composition: "100% Algodón Pima Peruano · Hilado 120/2",
  },
  {
    id: "biella-lino-negro",
    name: "Biella Lino Puro Negro",
    refCode: "Ref. Art. Lino 01",
    fabricId: "italiano",
    fabricLabel: "Algodón & Lino Italiano",
    priceArs: 200000,
    badge: "EDICIÓN LIMITADA",
    weaveKind: "linen",
    baseHex: "#141518",
    secondaryHex: "#24262B",
    accentLineHex: "rgba(200, 169, 126, 0.16)",
    composition: "100% Lino Italiano de Biella · Fibra Larga",
  },
  {
    id: "biella-lino-marfil",
    name: "Biella Lino Puro Marfil",
    refCode: "Ref. Art. Lino 02",
    fabricId: "italiano",
    fabricLabel: "Algodón & Lino Italiano",
    priceArs: 200000,
    badge: "NOVEDAD",
    weaveKind: "linen",
    baseHex: "#E8E1D3",
    secondaryHex: "#D6CBB8",
    accentLineHex: "rgba(122, 102, 74, 0.18)",
    isLightFabric: true,
    composition: "100% Lino Italiano de Biella · Frescura Superior",
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
    composition: "Algodón Urbano Oxford · Easy Care",
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
    composition: "Blend Lino & Algodón Urbano · Cuadro Ventana",
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
    composition: "Cloqué Texturado & Algodón Liviano · Corte Donna",
  },
];

export const FIT_OPTIONS = [
  "Slim Sartorial",
  "Clásico Anatómico",
  "Relajado",
] as const;

export const COLLAR_OPTIONS = [
  "Italiano",
  "Francés",
  "Button-Down",
  "Mao",
] as const;

export const CUFF_OPTIONS = [
  "Simple Biselado",
  "Doble (para gemelos)",
] as const;

export const MONOGRAM_PLACEMENTS = ["Puño izquierdo", "Pechera"] as const;

export const STANDARD_SIZES = [
  "38",
  "40",
  "42",
  "44",
  "46",
  "S",
  "M",
  "L",
  "XL",
] as const;

export type FitOption = (typeof FIT_OPTIONS)[number];
export type CollarOption = (typeof COLLAR_OPTIONS)[number];
export type CuffOption = (typeof CUFF_OPTIONS)[number];
export type MonogramPlacement = (typeof MONOGRAM_PLACEMENTS)[number];
export type StandardSize = (typeof STANDARD_SIZES)[number];

export interface ShirtCustomization {
  fit: FitOption;
  collar: CollarOption;
  cuff: CuffOption;
  monogramText: string;
  monogramPlacement: MonogramPlacement;
  sizingMode: "bespoke" | "standard";
  standardSize: StandardSize;
}

export interface SelectionItem {
  key: string;
  shirt: CatalogShirt;
  customization: ShirtCustomization;
  quantity: number;
}

export function formatMonogramDisplay(raw: string): string {
  const cleaned = raw
    .toUpperCase()
    .replace(/[^A-ZÁÉÍÓÚÑ]/g, "")
    .slice(0, 3);
  if (!cleaned) return "";
  return cleaned.split("").join(".") + ".";
}

export function formatSizingLabel(c: ShirtCustomization): string {
  return c.sizingMode === "bespoke"
    ? "Confección A Medida (Sin costo extra)"
    : `Talle Estándar ${c.standardSize}`;
}

export function buildSingleShirtWhatsAppUrl(
  shirt: CatalogShirt,
  customization: ShirtCustomization,
  currency: Currency
): string {
  const monogram = formatMonogramDisplay(customization.monogramText);
  const monogramLine = monogram
    ? `${monogram} (${customization.monogramPlacement})`
    : "Sin iniciales";

  const lines = [
    "Hola Cristian Mancuso Atelier, quisiera consultar por esta camisa personalizada:",
    "",
    `• Modelo: ${shirt.name} (${shirt.refCode})`,
    `• Gama: ${shirt.fabricLabel}`,
    `• Precio ref.: ${formatFabricPrice(shirt.priceArs, currency)}`,
    `• Calce: ${customization.fit}`,
    `• Cuello: ${customization.collar}`,
    `• Puño: ${customization.cuff}`,
    `• Iniciales bordadas: ${monogramLine}`,
    `• Medida: ${formatSizingLabel(customization)}`,
  ];

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(lines.join("\n"))}`;
}

export function buildSelectionWhatsAppUrl(
  items: SelectionItem[],
  currency: Currency
): string {
  const totalArs = items.reduce(
    (sum, item) => sum + item.shirt.priceArs * item.quantity,
    0
  );

  const header = [
    "Hola Cristian Mancuso Atelier, envío Mi Selección para coordinar pedido:",
    "",
  ];

  const body = items.flatMap((item, index) => {
    const monogram = formatMonogramDisplay(item.customization.monogramText);
    const monogramText = monogram
      ? `${monogram} en ${item.customization.monogramPlacement}`
      : "Sin iniciales";

    return [
      `${index + 1}) ${item.shirt.name} (${item.shirt.refCode}) x${item.quantity}`,
      `   Calce: ${item.customization.fit} | Cuello: ${item.customization.collar} | Puño: ${item.customization.cuff}`,
      `   Iniciales: ${monogramText} | ${formatSizingLabel(item.customization)}`,
      `   Subtotal: ${formatFabricPrice(item.shirt.priceArs * item.quantity, currency)}`,
      "",
    ];
  });

  const footer = [
    `Total estimado: ${formatFabricPrice(totalArs, currency)}`,
    "Confección a medida e iniciales bordadas: Bonificadas sin cargo.",
  ];

  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
    [...header, ...body, ...footer].join("\n")
  )}`;
}
