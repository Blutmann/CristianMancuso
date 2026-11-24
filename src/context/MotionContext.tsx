"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from "react";
import { MotionConfig } from "framer-motion";

const STORAGE_KEY = "cm_motion_paused";
const MOTION_CHANGE_EVENT = "cm-motion-pref-change";

function subscribeMotionPref(callback: () => void) {
  const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  mediaQuery.addEventListener("change", callback);
  window.addEventListener("storage", callback);
  window.addEventListener(MOTION_CHANGE_EVENT, callback);

  return () => {
    mediaQuery.removeEventListener("change", callback);
    window.removeEventListener("storage", callback);
    window.removeEventListener(MOTION_CHANGE_EVENT, callback);
  };
}

function getMotionPrefSnapshot(): boolean {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved !== null) {
      return saved === "true";
    }
  } catch {
    // Ignore storage access errors
  }
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function getMotionPrefServerSnapshot(): boolean {
  return false;
}

interface MotionContextValue {
  isMotionPaused: boolean;
  toggleMotion: () => void;
  preloaderDone: boolean;
  markPreloaderDone: () => void;
  selectionCount: number;
  setSelectionCount: React.Dispatch<React.SetStateAction<number>>;
}

const MotionContext = createContext<MotionContextValue | null>(null);

export function MotionProvider({ children }: { children: React.ReactNode }) {
  const isMotionPaused = useSyncExternalStore(
    subscribeMotionPref,
    getMotionPrefSnapshot,
    getMotionPrefServerSnapshot
  );
  const [preloaderDone, setPreloaderDone] = useState(false);
  const [selectionCount, setSelectionCount] = useState(0);

  useEffect(() => {
    document.documentElement.dataset.motion = isMotionPaused
      ? "paused"
      : "active";
  }, [isMotionPaused]);

  const toggleMotion = useCallback(() => {
    const next = !getMotionPrefSnapshot();
    try {
      window.localStorage.setItem(STORAGE_KEY, String(next));
    } catch {
      // Ignore storage access errors
    }
    window.dispatchEvent(new Event(MOTION_CHANGE_EVENT));
  }, []);

  const markPreloaderDone = useCallback(() => {
    setPreloaderDone(true);
  }, []);

  const value = useMemo(
    () => ({
      isMotionPaused,
      toggleMotion,
      preloaderDone,
      markPreloaderDone,
      selectionCount,
      setSelectionCount,
    }),
    [
      isMotionPaused,
      toggleMotion,
      preloaderDone,
      markPreloaderDone,
      selectionCount,
    ]
  );

  return (
    <MotionContext.Provider value={value}>
      <MotionConfig reducedMotion={isMotionPaused ? "always" : "user"}>
        {children}
      </MotionConfig>
    </MotionContext.Provider>
  );
}

export function useMotion() {
  const ctx = useContext(MotionContext);
  if (!ctx) {
    throw new Error("useMotion must be used within a MotionProvider");
  }
  return ctx;
}
