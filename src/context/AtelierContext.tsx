"use client";

import React, { createContext, useContext, useMemo, useState } from "react";
import type { Currency, FabricCategoryId } from "@/data/fabrics";

interface AtelierContextValue {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  selectedFabric: FabricCategoryId | null;
  setSelectedFabric: (fabric: FabricCategoryId | null) => void;
  toggleSelectedFabric: (fabric: FabricCategoryId) => void;
}

const AtelierContext = createContext<AtelierContextValue | null>(null);

export function AtelierProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrency] = useState<Currency>("ARS");
  const [selectedFabric, setSelectedFabric] =
    useState<FabricCategoryId | null>(null);

  const value = useMemo(
    () => ({
      currency,
      setCurrency,
      selectedFabric,
      setSelectedFabric,
      toggleSelectedFabric: (fabric: FabricCategoryId) => {
        setSelectedFabric((prev) => (prev === fabric ? null : fabric));
      },
    }),
    [currency, selectedFabric]
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
