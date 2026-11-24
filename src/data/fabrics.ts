export type Currency = "ARS" | "USD";

export type FabricCategoryId = "urbano" | "pima" | "italiano" | "donna";

/**
 * Tasa de referencia orientativa ARS -> USD para clientes del exterior
 * (México, EE. UU., España). Ajustable en un único punto.
 */
export const USD_REFERENCE_RATE = 1200;

export interface FabricRange {
  id: FabricCategoryId;
  index: string;
  name: string;
  origin: string;
  description: string;
  priceArs: number;
  refCode: string;
  badge: string;
  weaveType: "poplin" | "twill" | "linen" | "cloque";
  swatchBg: string;
  swatchStroke: string;
  telemetry: string;
}

export const FABRIC_RANGES: FabricRange[] = [
  {
    id: "urbano",
    index: "01",
    name: "Algodón Urbano",
    origin: "Tejido Compacto · Uso Diario",
    description: "Versatilidad diaria, fácil planchado y resistencia.",
    priceArs: 79000,
    refCode: "Ref. Art. 2514",
    badge: "✓ A medida sin cargo",
    weaveType: "poplin",
    swatchBg: "#DCE5EE",
    swatchStroke: "#64748B",
    telemetry: "POPLÍN 80/2 · EASY CARE",
  },
  {
    id: "pima",
    index: "02",
    name: "Algodón Peruano (Pima)",
    origin: "Valle de Piura · Perú",
    description: "Fibra extra larga de Piura. Brillo sutil y tacto sedoso.",
    priceArs: 120000,
    refCode: "Ref. Art. 2529",
    badge: "✓ A medida sin cargo",
    weaveType: "twill",
    swatchBg: "#C9DDF0",
    swatchStroke: "#3B82F6",
    telemetry: "PIMA 120/2 · FIBRA 38MM",
  },
  {
    id: "italiano",
    index: "03",
    name: "Algodón & Lino Italiano",
    origin: "Biella · Norte de Italia",
    description: "Tejedurías del norte de Italia. Frescura y caída superior.",
    priceArs: 200000,
    refCode: "Ref. Art. Lino",
    badge: "✓ A medida sin cargo",
    weaveType: "linen",
    swatchBg: "#E7DFD1",
    swatchStroke: "#A88B61",
    telemetry: "LINO DE BIELLA · ALTA RESPIRABILIDAD",
  },
  {
    id: "donna",
    index: "04",
    name: "Mancuso Donna",
    origin: "Sastrería Femenina · Atelier",
    description: "Sastrería femenina en cloque y algodones livianos.",
    priceArs: 62000,
    refCode: "Ref. Donna 027",
    badge: "✓ A medida sin cargo",
    weaveType: "cloque",
    swatchBg: "#EAE3DF",
    swatchStroke: "#8C746A",
    telemetry: "CLOQUÉ LIVIANO · CORTE ANATÓMICO",
  },
];

export function formatFabricPrice(priceArs: number, currency: Currency): string {
  if (currency === "USD") {
    const usd = Math.round(priceArs / USD_REFERENCE_RATE);
    return `USD $${usd.toLocaleString("en-US")}`;
  }
  return `ARS $${priceArs.toLocaleString("es-AR")}`;
}

export interface AnatomyAct {
  id: string;
  step: string;
  zone: string;
  title: string;
  description: string;
  telemetry: string;
  metric: string;
  zoomTransform: {
    scale: number;
    x: number;
    y: number;
  };
  reticle: {
    cx: number;
    cy: number;
    label: string;
  };
}

export const ANATOMY_ACTS: AnatomyAct[] = [
  {
    id: "fibra",
    step: "01 / 04",
    zone: "FIBRA & TEJIDO",
    title: "Algodón Pima 120/2 & Lino de Biella",
    description:
      "Hilos largos peinados que respiran y mantienen la caída impecable desde la mañana hasta la noche.",
    telemetry: "TÍTULO 120/2 · FIBRA 38MM · TEJEDURÍA DE ALTA DENSIDAD",
    metric: "38 mm fibra extra larga",
    zoomTransform: { scale: 1.48, x: 16, y: 18 },
    reticle: { cx: 132, cy: 132, label: "TRAMA 120/2" },
  },
  {
    id: "cuello",
    step: "02 / 04",
    zone: "CUELLO ESTRUCTURAL",
    title: "Italiano, Francés, Button-Down o Mao",
    description:
      "Entretelas respirables calibradas para sostener la postura con o sin corbata, sin rigidez artificial.",
    telemetry: "ENTRETELA FLOTANTE · BALLENAS REMOVIBLES · 4 CORTES",
    metric: "4 arquitecturas de cuello",
    zoomTransform: { scale: 1.42, x: -4, y: 24 },
    reticle: { cx: 200, cy: 108, label: "ESTRUCTURA CUELLO" },
  },
  {
    id: "costura",
    step: "03 / 04",
    zone: "COSTURA FRANCESA",
    title: "7 puntadas por cm · Calce Anatómico",
    description:
      "Terminación limpia por dentro y por fuera, ajustada a tus medidas exactas de hombro, pecho y cintura sin costo extra.",
    telemetry: "AGUJA SIMPLE · COSTURA FRANCESA · TOLERANCIA ±1MM",
    metric: "7 puntadas / cm",
    zoomTransform: { scale: 1.55, x: -16, y: -6 },
    reticle: { cx: 256, cy: 258, label: "7 PTS / CM" },
  },
  {
    id: "nacar",
    step: "04 / 04",
    zone: "NÁCAR & INICIALES",
    title: "Botones de nácar australiano & Monograma",
    description:
      "Botones naturales cosidos en punto gallina y tus iniciales bordadas en puño o pechera sin cargo adicional.",
    telemetry: "NÁCAR AUSTRALIANO 2.4MM · BORDADO DE AUTOR INCLUIDO",
    metric: "Monograma sin cargo",
    zoomTransform: { scale: 1.5, x: 0, y: -22 },
    reticle: { cx: 200, cy: 332, label: "NÁCAR + C.M." },
  },
];
