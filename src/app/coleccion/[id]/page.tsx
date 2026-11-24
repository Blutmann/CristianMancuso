import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CATALOG_SHIRTS } from "@/data/catalog";
import { ProductDetailClient } from "@/components/ProductDetailClient";
import { Footer } from "@/components/Footer";

export function generateStaticParams() {
  return CATALOG_SHIRTS.map((shirt) => ({
    id: shirt.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const shirt = CATALOG_SHIRTS.find((s) => s.id === id);
  if (!shirt) {
    return { title: "Prenda no encontrada · Cristian Mancuso Atelier" };
  }
  return {
    title: `${shirt.name} (${shirt.refCode}) · Cristian Mancuso Atelier`,
    description: `${shirt.composition}. Comprala en talle comercial o armala a medida sin costo extra.`,
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const shirt = CATALOG_SHIRTS.find((s) => s.id === id);

  if (!shirt) {
    notFound();
  }

  return (
    <div className="relative min-h-screen">
      <ProductDetailClient shirt={shirt} />
      <Footer />
    </div>
  );
}
