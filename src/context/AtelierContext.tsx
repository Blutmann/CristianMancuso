"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
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

const SELECTION_STORAGE_KEY = "cm_selection_v1";

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
  toastMessage: string | null;
  dismissToast: () => void;
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

function readStoredSelection(): SelectionItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(SELECTION_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    const valid: SelectionItem[] = [];
    for (const entry of parsed) {
      if (
        !entry ||
        typeof entry !== "object" ||
        typeof entry.key !== "string" ||
        typeof entry.quantity !== "number" ||
        entry.quantity < 1 ||
        !entry.shirt ||
        typeof entry.shirt.id !== "string" ||
        !entry.config ||
        typeof entry.config !== "object"
      ) {
        continue;
      }
      const freshShirt = CATALOG_SHIRTS.find((s) => s.id === entry.shirt.id);
      if (!freshShirt) continue;
      valid.push({
        key: entry.key,
        shirt: freshShirt,
        config: entry.config as ShirtConfiguration,
        quantity: Math.floor(entry.quantity),
      });
    }
    return valid;
  } catch {
    return [];
  }
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
  const hasHydratedSelectionRef = useRef(false);

  // Hydrate persisted selection from localStorage strictly on client mount (SSG-safe)
  useEffect(() => {
    const stored = readStoredSelection();
    hasHydratedSelectionRef.current = true;
    if (stored.length > 0) {
      queueMicrotask(() => {
        setSelectionItems(stored);
      });
    }
  }, []);

  // Persist selection changes to localStorage after initial hydration
  useEffect(() => {
    if (!hasHydratedSelectionRef.current) return;
    try {
      window.localStorage.setItem(
        SELECTION_STORAGE_KEY,
        JSON.stringify(selectionItems)
      );
    } catch {
      // Ignore storage quota or private mode restrictions
    }
  }, [selectionItems]);

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const dismissToast = useCallback(() => {
    if (toastTimerRef.current !== null) {
      window.clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }
    setToastMessage(null);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

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

      if (typeof window !== "undefined") {
        if (toastTimerRef.current !== null) {
          window.clearTimeout(toastTimerRef.current);
        }
        setToastMessage(`${shirt.name} agregada a tu bolsa`);
        toastTimerRef.current = window.setTimeout(() => {
          setToastMessage(null);
          toastTimerRef.current = null;
        }, 2600);
      }
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
      toastMessage,
      dismissToast,
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
      toastMessage,
      dismissToast,
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
