"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ShoppingBag, X } from "lucide-react";
import { useAtelier } from "@/context/AtelierContext";
import { BrandLogo } from "@/components/BrandLogo";

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
          className="h-full w-full origin-left bg-white will-change-transform"
          style={{ transform: `scaleX(${scrollProgress})` }}
        />
      </div>

      {/* Liquid Glass Floating Capsule Header with Perimeter Cuff Stitch */}
      <header className="fixed top-0 inset-x-0 z-50 px-3.5 pt-3.5 sm:px-6 sm:pt-4 pointer-events-none">
        <nav
          aria-label="Navegación principal"
          className={`pointer-events-auto relative mx-auto flex max-w-6xl items-center justify-between overflow-hidden rounded-2xl px-4 py-2.5 sm:px-6 sm:py-3 transition-all duration-300 ${
            isScrolled ? "liquid-glass-active" : "liquid-glass"
          }`}
        >
          {/* Full 4-Sided Perimeter Interior Stitch (Shirt Cuff Detail) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-1.5 rounded-xl border border-dashed border-white/18"
          />

          {/* Brand Logo + Decorative Cuff Buttonhole & Mother-of-Pearl Button */}
          <Link
            id="nav-brand-link"
            href="/"
            className="group relative inline-flex items-center gap-3 rounded-xl px-1.5 py-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/60"
          >
            <BrandLogo markSize={30} />
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
                        className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-white"
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
              aria-label={`Bolsa, ${totalSelectionCount} prendas`}
              className="cursor-pointer group inline-flex min-h-[44px] items-center gap-2.5 rounded-full border border-white/20 bg-white/[0.08] px-4 py-1.5 text-xs font-medium text-white transition-all duration-200 hover:border-white/45 hover:bg-white/[0.14] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/60"
            >
              <ShoppingBag
                className="h-3.5 w-3.5 text-white/90 transition-transform duration-200 group-hover:-translate-y-0.5"
                aria-hidden="true"
              />
              <span className="hidden sm:inline">Bolsa</span>
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-white px-1.5 text-[10px] font-semibold text-[#0B0B0E] tabular-nums">
                {totalSelectionCount}
              </span>
            </button>

            <button
              id="nav-mobile-menu-btn"
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
              className="cursor-pointer inline-flex md:hidden h-11 w-11 items-center justify-center rounded-full border border-white/15 bg-white/[0.04] text-white transition-colors hover:border-gold/60"
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
          <div className="pointer-events-auto mx-auto mt-2 max-w-6xl rounded-2xl border border-white/12 bg-[#111113]/95 p-4 backdrop-blur-xl md:hidden">
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
                          ? "bg-gold/15 text-gold"
                          : "text-white/80 hover:bg-white/[0.05] hover:text-white"
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
