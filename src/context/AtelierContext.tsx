"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import type { Currency, FabricCategoryId } from "@/data/fabrics";
import {
  CATALOG_SHIRTS,
  type CatalogShirt,
  type SelectionItem,
  type ShirtConfiguration,
} from "@/data/catalog";

interface AtelierContextValue {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  selectedFabric: FabricCategoryId | null;
  setSelectedFabric: (fabric: FabricCategoryId | null) => void;

  // Bespoke Builder preselected shirt
  builderShirtId: string;
  setBuilderShirtId: (shirtId: string) => void;
  goToBuilderWithShirt: (shirtId: string) => void;

  // Selection drawer state
  selectionItems: SelectionItem[];
  totalSelectionCount: number;
  totalSelectionArs: number;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addToSelection: (shirt: CatalogShirt, config: ShirtConfiguration) => void;
  updateItemQuantity: (key: string, delta: number) => void;
  removeItem: (key: string) => void;
  clearSelection: () => void;
}

const AtelierContext = createContext<AtelierContextValue | null>(null);

function makeItemKey(shirtId: string, c: ShirtConfiguration): string {
  if (c.mode === "commercial") {
    return `${shirtId}|commercial|${c.commercialSize ?? "40"}`;
  }
  const m = c.measurements;
  return [
    shirtId,
    "bespoke",
    c.collar ?? "Italiano",
    c.button ?? "Nácar blanco",
    (c.monogramText ?? "").trim().toUpperCase(),
    c.monogramPlacement ?? "Puño izquierdo",
    c.monogramThread ?? "Champagne",
    m?.cuello ?? "",
    m?.pecho ?? "",
    m?.manga ?? "",
    m?.largo ?? "",
  ].join("|");
}

export function AtelierProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [currency, setCurrency] = useState<Currency>("ARS");
  const [selectedFabric, setSelectedFabric] =
    useState<FabricCategoryId | null>(null);
  const [builderShirtId, setBuilderShirtId] = useState<string>(
    CATALOG_SHIRTS[0].id
  );
  const [selectionItems, setSelectionItems] = useState<SelectionItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  const goToBuilderWithShirt = useCallback(
    (shirtId: string) => {
      setBuilderShirtId(shirtId);
      router.push(`/a-medida?tela=${encodeURIComponent(shirtId)}`);
    },
    [router]
  );

  const addToSelection = useCallback(
    (shirt: CatalogShirt, config: ShirtConfiguration) => {
      const key = makeItemKey(shirt.id, config);
      setSelectionItems((prev) => {
        const existing = prev.find((item) => item.key === key);
        if (existing) {
          return prev.map((item) =>
            item.key === key
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...prev, { key, shirt, config, quantity: 1 }];
      });
    },
    []
  );

  const updateItemQuantity = useCallback((key: string, delta: number) => {
    setSelectionItems((prev) =>
      prev
        .map((item) =>
          item.key === key
            ? { ...item, quantity: item.quantity + delta }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  }, []);

  const removeItem = useCallback((key: string) => {
    setSelectionItems((prev) => prev.filter((item) => item.key !== key));
  }, []);

  const clearSelection = useCallback(() => {
    setSelectionItems([]);
  }, []);

  const totalSelectionCount = useMemo(
    () => selectionItems.reduce((sum, item) => sum + item.quantity, 0),
    [selectionItems]
  );

  const totalSelectionArs = useMemo(
    () =>
      selectionItems.reduce(
        (sum, item) => sum + item.shirt.priceArs * item.quantity,
        0
      ),
    [selectionItems]
  );

  const value = useMemo(
    () => ({
      currency,
      setCurrency,
      selectedFabric,
      setSelectedFabric,
      builderShirtId,
      setBuilderShirtId,
      goToBuilderWithShirt,
      selectionItems,
      totalSelectionCount,
      totalSelectionArs,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
      addToSelection,
      updateItemQuantity,
      removeItem,
      clearSelection,
    }),
    [
      currency,
      selectedFabric,
      builderShirtId,
      goToBuilderWithShirt,
      selectionItems,
      totalSelectionCount,
      totalSelectionArs,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
      addToSelection,
      updateItemQuantity,
      removeItem,
      clearSelection,
    ]
  );

  return (
    <AtelierContext.Provider value={value}>{children}</AtelierContext.Provider>
  );
}

export function useAtelier() {
  const ctx = useContext(AtelierContext);
  if (!ctx) {
    throw new Error("useAtelier must be used within an AtelierProvider");
  }
  return ctx;
}
