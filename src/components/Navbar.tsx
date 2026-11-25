"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Moon, ShoppingBag, Sun, X } from "lucide-react";
import { useAtelier } from "@/context/AtelierContext";
import { useTheme } from "@/context/ThemeContext";
import { BrandLogo } from "@/components/BrandLogo";

const NAV_LINKS = [
  { label: "Colección", href: "/coleccion" },
  { label: "Armá tu camisa", href: "/a-medida" },
  { label: "Cómo medir", href: "/como-medir" },
  { label: "Empresas", href: "/empresas" },
] as const;

export function Navbar() {
  const pathname = usePathname();
  const { totalSelectionCount, openDrawer } = useAtelier();
  const { theme, toggleTheme } = useTheme();
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

  const isRouteActive = (href: string) =>
    pathname === href || pathname.startsWith(`${href}/`);

  return (
    <>
      {/* Top 1.5px Scroll Progress Hairline */}
      <div
        aria-hidden="true"
        className="pointer-events-none fixed top-0 left-0 right-0 z-[70] h-[1.5px] bg-black/8 dark:bg-white/10"
      >
        <div
          className="h-full w-full origin-left bg-[#16233B] will-change-transform dark:bg-white"
          style={{ transform: `scaleX(${scrollProgress})` }}
        />
      </div>

      {/* Liquid Glass Floating Capsule Header with Perimeter Cuff Stitch */}
      <header className="pointer-events-none fixed top-0 inset-x-0 z-50 px-5 pt-3.5 sm:px-8 sm:pt-4 lg:px-12">
        <nav
          aria-label="Navegación principal"
          className={`pointer-events-auto relative mx-auto flex w-full max-w-[1440px] items-center justify-between overflow-hidden rounded-2xl px-4 py-2.5 backdrop-blur-2xl sm:px-6 sm:py-3 transition-all duration-300 ${
            isScrolled
              ? "liquid-glass-active !bg-white/88 border-black/12 shadow-[0_14px_40px_rgba(0,0,0,0.08)] dark:!bg-[#0B0B0E]/86 dark:border-white/25 dark:shadow-[inset_0_1px_1px_rgba(255,255,255,0.34),0_20px_50px_rgba(0,0,0,0.55)]"
              : "liquid-glass !bg-white/82 border-black/10 dark:!bg-[#0B0B0E]/80 dark:border-white/20"
          }`}
        >
          {/* Full 4-Sided Perimeter Interior Stitch (Shirt Cuff Detail) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-1.5 rounded-xl border border-dashed border-black/12 dark:border-white/18"
          />

          {/* Brand Logo */}
          <Link
            id="nav-brand-link"
            href="/"
            className="group relative inline-flex items-center gap-3 rounded-xl px-1.5 py-1 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#16233B]/50 dark:focus-visible:ring-white/60"
          >
            <BrandLogo markSize={30} />
          </Link>

          {/* Center Navigation Links */}
          <ul className="hidden items-center gap-7 md:flex lg:gap-9">
            {NAV_LINKS.map((item) => {
              const active = isRouteActive(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`relative py-1 text-xs font-medium tracking-[0.08em] uppercase transition-colors duration-200 ${
                      active
                        ? "text-[#111113] font-semibold dark:text-white"
                        : "text-[#111113]/65 hover:text-[#111113] dark:text-white/70 dark:hover:text-white"
                    }`}
                  >
                    {item.label}
                    {active && (
                      <span
                        aria-hidden="true"
                        className="absolute -bottom-1 left-0 right-0 h-[1.5px] bg-[#16233B] dark:bg-white"
                      />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Right Controls: Theme Toggle + Bolsa + Mobile Trigger */}
          <div className="flex items-center gap-2">
            <button
              id="nav-theme-toggle"
              type="button"
              onClick={toggleTheme}
              aria-label={
                theme === "light"
                  ? "Cambiar a modo oscuro"
                  : "Cambiar a modo claro"
              }
              title={theme === "light" ? "Modo oscuro" : "Modo claro"}
              className="cursor-pointer inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/12 bg-black/[0.04] text-[#111113] transition-colors hover:bg-black/[0.08] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#16233B]/50 dark:border-white/18 dark:bg-white/[0.06] dark:text-white dark:hover:bg-white/[0.14] dark:focus-visible:ring-white/60"
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Sun className="h-4 w-4" aria-hidden="true" />
              )}
            </button>

            <button
              id="nav-selection-btn"
              type="button"
              onClick={openDrawer}
              aria-label={`Bolsa, ${totalSelectionCount} prendas`}
              className="cursor-pointer group inline-flex min-h-[44px] items-center gap-2.5 rounded-full border border-black/12 bg-black/[0.04] px-4 py-1.5 text-xs font-medium text-[#111113] transition-all duration-200 hover:border-black/25 hover:bg-black/[0.08] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[#16233B]/50 dark:border-white/20 dark:bg-white/[0.08] dark:text-white dark:hover:border-white/45 dark:hover:bg-white/[0.14] dark:focus-visible:ring-white/60"
            >
              <ShoppingBag
                className="h-3.5 w-3.5 text-[#111113]/85 transition-transform duration-200 group-hover:-translate-y-0.5 dark:text-white/90"
                aria-hidden="true"
              />
              <span className="hidden sm:inline">Bolsa</span>
              <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-[#111113] px-1.5 text-[10px] font-semibold text-white tabular-nums dark:bg-white dark:text-[#0B0B0E]">
                {totalSelectionCount}
              </span>
            </button>

            <button
              id="nav-mobile-menu-btn"
              type="button"
              onClick={() => setMobileMenuOpen((open) => !open)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? "Cerrar menú" : "Abrir menú"}
              className="cursor-pointer inline-flex h-11 w-11 items-center justify-center rounded-full border border-black/12 bg-black/[0.04] text-[#111113] transition-colors hover:bg-black/[0.08] md:hidden dark:border-white/15 dark:bg-white/[0.05] dark:text-white"
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
          <div className="pointer-events-auto mx-auto mt-2 w-full max-w-[1440px] rounded-2xl border border-black/10 bg-white/95 p-4 shadow-xl backdrop-blur-2xl md:hidden dark:border-white/15 dark:bg-[#111113]/95">
            <ul className="flex flex-col gap-1">
              {NAV_LINKS.map((item) => {
                const active = isRouteActive(item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex min-h-[44px] items-center rounded-xl px-3.5 py-2 text-sm font-medium tracking-[0.06em] uppercase transition-colors ${
                        active
                          ? "bg-[#16233B] text-white dark:bg-white dark:text-[#0B0B0E]"
                          : "text-[#111113]/80 hover:bg-black/[0.05] dark:text-white/80 dark:hover:bg-white/[0.06]"
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
