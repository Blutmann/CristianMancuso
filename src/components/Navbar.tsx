"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useAtelier } from "@/context/AtelierContext";

const NAV_LINKS = [
  { label: "Colección", href: "/#coleccion" },
  { label: "Armá tu camisa", href: "/#arma-tu-camisa" },
  { label: "Cómo medir", href: "/#como-medir" },
  { label: "Empresas", href: "/empresas" },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const { totalSelectionCount, openDrawer } = useAtelier();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const updateScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const ratio =
        docHeight > 0 ? Math.min(Math.max(scrollTop / docHeight, 0), 1) : 0;

      setScrollProgress(ratio);
      setIsScrolled(scrollTop > 20);
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
      {/* Top 1.5px Scroll Progress Hairline */}
      <div
        aria-hidden="true"
        className="fixed top-0 left-0 right-0 z-[70] h-[1.5px] bg-white/10 pointer-events-none"
      >
        <div
          className="h-full w-full origin-left bg-stitch will-change-transform"
          style={{ transform: `scaleX(${scrollProgress})` }}
        />
      </div>

      {/* Monochrome Sewn-Label Header (Logo · Links · Bolsa) */}
      <header
        className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b border-dashed ${
          isScrolled
            ? "border-white/20 bg-[#09090B]/95 backdrop-blur-xl shadow-[0_12px_36px_rgba(0,0,0,0.6)]"
            : "border-white/15 bg-[#09090B]/88 backdrop-blur-md"
        }`}
      >
        <nav
          aria-label="Navegación principal"
          className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-8 lg:px-10"
        >
          {/* Woven Sewn Collar Label Logo */}
          <Link
            id="nav-brand-link"
            href="/"
            className="group relative inline-flex items-center gap-3 bg-[#09090B] px-3.5 py-2 border border-dashed border-stitch/55 transition-colors hover:border-stitch focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-stitch"
          >
            {/* 4 Corner Tack Stitches simulating sewn collar label */}
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-[2px] -left-[2px] h-1.5 w-1.5 border-t border-l border-stitch"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -top-[2px] -right-[2px] h-1.5 w-1.5 border-t border-r border-stitch"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-[2px] -left-[2px] h-1.5 w-1.5 border-b border-l border-stitch"
            />
            <span
              aria-hidden="true"
              className="pointer-events-none absolute -bottom-[2px] -right-[2px] h-1.5 w-1.5 border-b border-r border-stitch"
            />

            <span className="font-display text-xs font-bold tracking-[0.14em] text-stitch">
              CM
            </span>
            <span aria-hidden="true" className="text-white/25 text-[10px]">
              {"//"}
            </span>
            <span className="font-display text-[11px] sm:text-xs font-bold tracking-[0.18em] text-white uppercase leading-none">
              Cristian Mancuso
            </span>
          </Link>

          {/* Center Navigation Links */}
          <ul className="hidden md:flex items-center gap-8 lg:gap-10">
            {NAV_LINKS.map((item) => {
              const isActive =
                item.href === "/empresas" && pathname.startsWith("/empresas");
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`relative py-1 text-xs font-medium tracking-[0.08em] uppercase transition-colors duration-200 ${
                      isActive
                        ? "text-white"
                        : "text-white/70 hover:text-white"
                    }`}
                  >
                    {item.label}
                    {isActive && (
                      <span
                        aria-hidden="true"
                        className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-stitch"
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right Controls: Bolsa + Mobile Trigger */}
          <div className="flex items-center gap-2">
            <button
              id="nav-selection-btn"
              type="button"
              onClick={openDrawer}
              aria-label={`Mi Selección, ${totalSelectionCount} prendas`}
              className="cursor-pointer group inline-flex min-h-[44px] items-center gap-2.5 rounded-full border border-white/20 bg-white/[0.04] px-4 py-1.5 text-xs font-medium text-white transition-all duration-200 hover:border-white/60 hover:bg-white/[0.08] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-stitch"
            >
              <ShoppingBag
                className="h-3.5 w-3.5 text-stitch transition-transform duration-200 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
              <span className="hidden sm:inline">Bolsa</span>
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1.5 text-[10px] font-semibold text-[#09090B] tabular-nums">
                {totalSelectionCount}
              </span>
            </button>

            <button
              id="nav-mobile-menu-btn"
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
              className="cursor-pointer inline-flex md:hidden h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white transition-colors hover:border-white/40"
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
          <div className="border-t border-white/10 bg-[#09090B] px-4 py-4 md:hidden">
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((item) => {
                const isActive =
                  item.href === "/empresas" && pathname.startsWith("/empresas");
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex min-h-[44px] items-center rounded-xl px-3.5 py-2 text-sm font-medium tracking-[0.06em] uppercase transition-colors ${
                        isActive
                          ? "bg-white/10 text-white"
                          : "text-white/75 hover:bg-white/[0.05] hover:text-white"
                      }`}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </header>
    </>
  );
}
