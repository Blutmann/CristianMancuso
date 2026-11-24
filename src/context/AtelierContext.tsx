"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import type { Currency, FabricCategoryId } from "@/data/fabrics";
import type {
  CatalogShirt,
  SelectionItem,
  ShirtCustomization,
} from "@/data/catalog";

interface AtelierContextValue {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  selectedFabric: FabricCategoryId | null;
  setSelectedFabric: (fabric: FabricCategoryId | null) => void;
  toggleSelectedFabric: (fabric: FabricCategoryId) => void;

  // Customizer modal state
  customizingShirt: CatalogShirt | null;
  openCustomizer: (shirt: CatalogShirt) => void;
  closeCustomizer: () => void;

  // Selection drawer state
  selectionItems: SelectionItem[];
  totalSelectionCount: number;
  totalSelectionArs: number;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  toggleDrawer: () => void;
  addToSelection: (shirt: CatalogShirt, customization: ShirtCustomization) => void;
  updateItemQuantity: (key: string, delta: number) => void;
  removeItem: (key: string) => void;
  clearSelection: () => void;
}

const AtelierContext = createContext<AtelierContextValue | null>(null);

function makeItemKey(shirtId: string, c: ShirtCustomization): string {
  return [
    shirtId,
    c.fit,
    c.collar,
    c.cuff,
    c.monogramText.trim().toUpperCase(),
    c.monogramPlacement,
    c.sizingMode,
    c.sizingMode === "standard" ? c.standardSize : "bespoke",
  ].join("|");
}

export function AtelierProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("ARS");
  const [selectedFabric, setSelectedFabric] =
    useState<FabricCategoryId | null>(null);
  const [customizingShirt, setCustomizingShirt] =
    useState<CatalogShirt | null>(null);
  const [selectionItems, setSelectionItems] = useState<SelectionItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleSelectedFabric = useCallback((fabric: FabricCategoryId) => {
    setSelectedFabric((prev) => (prev === fabric ? null : fabric));
  }, []);

  const openCustomizer = useCallback((shirt: CatalogShirt) => {
    setCustomizingShirt(shirt);
  }, []);

  const closeCustomizer = useCallback(() => {
    setCustomizingShirt(null);
  }, []);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);
  const toggleDrawer = useCallback(() => setIsDrawerOpen((o) => !o), []);

  const addToSelection = useCallback(
    (shirt: CatalogShirt, customization: ShirtCustomization) => {
      const key = makeItemKey(shirt.id, customization);
      setSelectionItems((prev) => {
        const existing = prev.find((item) => item.key === key);
        if (existing) {
          return prev.map((item) =>
            item.key === key
              ? { ...item, quantity: item.quantity + 1 }
              : item
          );
        }
        return [...prev, { key, shirt, customization, quantity: 1 }];
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
      toggleSelectedFabric,
      customizingShirt,
      openCustomizer,
      closeCustomizer,
      selectionItems,
      totalSelectionCount,
      totalSelectionArs,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
      toggleDrawer,
      addToSelection,
      updateItemQuantity,
      removeItem,
      clearSelection,
    }),
    [
      currency,
      selectedFabric,
      toggleSelectedFabric,
      customizingShirt,
      openCustomizer,
      closeCustomizer,
      selectionItems,
      totalSelectionCount,
      totalSelectionArs,
      isDrawerOpen,
      openDrawer,
      closeDrawer,
      toggleDrawer,
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
