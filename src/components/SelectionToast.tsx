"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Check, ShoppingBag } from "lucide-react";
import { useAtelier } from "@/context/AtelierContext";
import { useMotion } from "@/context/MotionContext";

export function SelectionToast() {
  const { toastMessage, dismissToast, openDrawer } = useAtelier();
  const { isMotionPaused } = useMotion();

  return (
    <div
      role="status"
      aria-live="polite"
      aria-atomic="true"
      className="pointer-events-none fixed inset-x-4 bottom-5 z-[90] flex justify-center"
    >
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            key={toastMessage}
            initial={isMotionPaused ? false : { opacity: 0, y: 14, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={isMotionPaused ? undefined : { opacity: 0, y: 10, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="liquid-glass-active pointer-events-auto flex max-w-md items-center gap-3 rounded-full py-1.5 pr-1.5 pl-4 text-xs text-[#111113] shadow-[0_14px_38px_rgba(0,0,0,0.14)] dark:text-[#F8FAFC] dark:shadow-[0_16px_42px_rgba(0,0,0,0.65)]"
          >
            <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#16233B] text-white dark:bg-white dark:text-[#0B0B0E]">
              <Check className="h-3 w-3" aria-hidden="true" />
            </span>

            <span className="truncate font-medium">{toastMessage}</span>

            <button
              type="button"
              onClick={() => {
                dismissToast();
                openDrawer();
              }}
              className="cursor-pointer inline-flex min-h-[36px] shrink-0 items-center gap-1.5 rounded-full bg-[#16233B] px-3.5 text-[11px] font-semibold tracking-[0.04em] text-white uppercase transition-colors hover:bg-[#1E2F4F] dark:bg-white dark:text-[#0B0B0E] dark:hover:bg-white/90"
            >
              <ShoppingBag className="h-3 w-3" aria-hidden="true" />
              <span>Ver bolsa</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
