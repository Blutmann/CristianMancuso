"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Pause, Play, ShoppingBag, X } from "lucide-react";
import { useMotion } from "@/context/MotionContext";
import { useAtelier } from "@/context/AtelierContext";

const NAV_LINKS = [
  { label: "Telas", href: "/#telas" },
  { label: "Colección", href: "/#coleccion" },
  { label: "Cómo Pedir", href: "/#como-pedir" },
  { label: "Empresas", href: "/empresas" },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const { isMotionPaused, toggleMotion } = useMotion();
  const { totalSelectionCount, openDrawer } = useAtelier();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const updateScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const ratio = docHeight > 0 ? Math.min(Math.max(scrollTop / docHeight, 0), 1) : 0;

      setScrollProgress(ratio);
      setIsScrolled(scrollTop > 24);
    };

    updateScroll();
    window.addEventListener("scroll", updateScroll, { passive: true });
    window.addEventListener("resize", updateScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", updateScroll);
      window.removeEventListener("resize", updateScroll);
    };
  }, [pathname]);

  return (
    <>
      {/* Top 1.5px Scroll Progress Bar */}
      <div
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 z-[70] h-[1.5px] bg-white/[0.06] pointer-events-none"
      >
        <div
          className="h-full w-full origin-left will-change-transform"
          style={{
            transform: `scaleX(${scrollProgress})`,
            background:
              "linear-gradient(90deg, var(--accent-champagne) 0%, var(--accent-cyan) 100%)",
          }}
        />
      </div>

      {/* Floating Glassmorphism Navbar */}
      <header className="fixed top-0 inset-x-0 z-50 px-4 pt-3.5 sm:px-6 sm:pt-4 pointer-events-none">
        <nav
          aria-label="Navegación principal"
          className={`pointer-events-auto mx-auto flex max-w-7xl items-center justify-between rounded-2xl border px-4 py-2.5 sm:px-6 sm:py-3 transition-all duration-300 ${
            isScrolled
              ? "border-white/[0.11] bg-obsidian/80 backdrop-blur-xl shadow-[0_12px_40px_rgba(0,0,0,0.55)]"
              : "border-white/[0.08] bg-elevated/60 backdrop-blur-md"
          }`}
        >
          {/* Brand Monogram & Wordmark */}
          <Link
            id="nav-brand-link"
            href="/"
            className="group flex items-center gap-3 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-champagne rounded-lg"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-champagne/35 bg-obsidian/90 font-display text-xs font-bold tracking-[0.06em] text-champagne transition-colors duration-200 group-hover:border-champagne/70">
              CM
            </span>
            <div className="flex flex-col">
              <span className="font-display text-xs sm:text-sm font-bold tracking-[0.14em] text-primary uppercase leading-none">
                Cristian Mancuso
              </span>
              <span className="mt-1 hidden sm:block font-mono text-[9px] tracking-[0.22em] text-muted uppercase leading-none">
                Atelier Buenos Aires
              </span>
            </div>
          </Link>

          {/* Center Navigation Links */}
          <ul className="hidden md:flex items-center gap-7 lg:gap-9">
            {NAV_LINKS.map((item) => {
              const isActive =
                item.href === "/empresas" && pathname.startsWith("/empresas");
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`relative py-1 text-xs font-medium tracking-[0.06em] uppercase transition-colors duration-200 ${
                      isActive
                        ? "text-champagne"
                        : "text-primary/80 hover:text-primary"
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <span
                        aria-hidden="true"
                        className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-champagne"
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right Controls: Motion Toggle + Mi Selección + Mobile Trigger */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              id="nav-motion-toggle"
              type="button"
              onClick={toggleMotion}
              aria-pressed={isMotionPaused}
              title={
                isMotionPaused ? "Reanudar movimiento" : "Pausar movimiento"
              }
              className={`cursor-pointer inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1.5 font-mono text-[10px] tracking-[0.12em] uppercase transition-colors duration-200 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan ${
                isMotionPaused
                  ? "border-cyan/40 bg-cyan/10 text-cyan"
                  : "border-white/[0.08] bg-white/[0.03] text-muted hover:border-white/[0.16] hover:text-primary"
              }`}
            >
              {isMotionPaused ? (
                <Play className="h-3 w-3 shrink-0" aria-hidden="true" />
              ) : (
                <Pause className="h-3 w-3 shrink-0" aria-hidden="true" />
              )}
              <span className="hidden xl:inline">
                {isMotionPaused ? "Reanudar" : "Pausar movimiento"}
              </span>
            </button>

            <button
              id="nav-selection-btn"
              type="button"
              onClick={openDrawer}
              aria-label={`Mi Selección, ${totalSelectionCount} prendas`}
              className="cursor-pointer group inline-flex items-center gap-2 rounded-full border border-champagne/35 bg-champagne/[0.08] px-3.5 py-1.5 text-xs font-medium text-primary transition-all duration-200 hover:border-champagne/70 hover:bg-champagne/15 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-champagne"
            >
              <ShoppingBag
                className="h-3.5 w-3.5 text-champagne transition-transform duration-200 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
              <span className="hidden sm:inline">Mi Selección</span>
              <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-champagne px-1 font-mono text-[10px] font-medium text-obsidian tabular-nums">
                {totalSelectionCount}
              </span>
            </button>

            <button
              id="nav-mobile-menu-btn"
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
              className="cursor-pointer inline-flex md:hidden h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] bg-white/[0.03] text-primary transition-colors hover:border-white/[0.18]"
            >
              {mobileMenuOpen ? (
                <X className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Menu className="h-4 w-4" aria-hidden="true" />
              )}
            </button>
          </div>
        </nav>

        {/* Mobile Dropdown Navigation */}
        {mobileMenuOpen && (
          <div className="pointer-events-auto mx-auto mt-2 max-w-7xl rounded-2xl border border-white/[0.1] bg-obsidian/95 p-5 backdrop-blur-xl md:hidden">
            <ul className="flex flex-col gap-3">
              {NAV_LINKS.map((item) => {
                const isActive =
                  item.href === "/empresas" && pathname.startsWith("/empresas");
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block rounded-lg px-3 py-2 text-sm font-medium tracking-[0.06em] uppercase transition-colors ${
                        isActive
                          ? "bg-champagne/10 text-champagne"
                          : "text-primary/85 hover:bg-white/[0.04] hover:text-primary"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
            <div className="mt-4 border-t border-white/[0.08] pt-3">
              <button
                type="button"
                onClick={toggleMotion}
                aria-pressed={isMotionPaused}
                className="cursor-pointer flex w-full items-center justify-between rounded-lg px-3 py-2 font-mono text-[11px] tracking-[0.14em] text-muted uppercase hover:bg-white/[0.04] hover:text-primary"
              >
                <span>
                  {isMotionPaused ? "Reanudar movimiento" : "Pausar movimiento"}
                </span>
                {isMotionPaused ? (
                  <Play className="h-3.5 w-3.5 text-cyan" aria-hidden="true" />
                ) : (
                  <Pause className="h-3.5 w-3.5" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
