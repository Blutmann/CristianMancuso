# Design System Oficial — Cristian Mancuso (v2.0)

> **Identidad:** *Sastrería Minimalista Contemporánea + Liquid Glass* (Apple / Zara Studio).  
> **Fuente de verdad única** para Desktop (`>= 1024px`) y Mobile (`375px–767px`) en las 5 rutas: `/`, `/coleccion`, `/a-medida`, `/como-medir`, `/empresas`.

---

## 1. Sistema Tipográfico Único (`Plus Jakarta Sans` + `JetBrains Mono`)
- **Fuente Principal Global (`--font-sans`):** `Plus Jakarta Sans` para **TODOS los títulos (`H1`, `H2`, `H3`), botones, navegación y cuerpo**. *(Se elimina `Syne` para evitar saltos de estilo entre secciones).*
- **Fuente Técnica (`--font-mono`):** `JetBrains Mono` reservada **exclusivamente** para `Ref. Art. XXXX`, precios `ARS` y medidas en `cm` (`tabular-nums`).

### Escala Tipográfica Estandarizada (Desktop & Mobile)

| Token / Clase | Uso | Mobile (`375px`) | Desktop (`1024px+`) | Peso & Tracking |
| :--- | :--- | :--- | :--- | :--- |
| `.ds-h1-hero` | Solo `H1` del Hero (`/`) | `36px` (`2.25rem`) | `60px` (`3.75rem`) | `700` · `leading-[1.04]` · `tracking-[-0.03em]` |
| `.ds-h1-page` | `H1` único de `/coleccion`, `/a-medida`, `/como-medir`, `/empresas` | `28px` (`1.75rem`) | `40px` (`2.5rem`) | `700` · `leading-[1.08]` · `tracking-[-0.025em]` |
| `.ds-h2` | Títulos de sección (`H2`) | `22px` (`1.375rem`) | `30px` (`1.875rem`) | `600` · `leading-[1.15]` · `tracking-[-0.02em]` |
| `.ds-h3` | Títulos de tarjetas / pasos (`H3`) | `16px` (`1rem`) | `18px` (`1.125rem`) | `600` · `leading-[1.25]` · `tracking-[-0.015em]` |
| `.ds-body` | Párrafos y descripciones | `14px` (`0.875rem`) | `16px` (`1rem`) | `400` · `leading-[1.55]` |
| `.ds-caption` | Eyebrows, microcopy y labels | `11px` (`0.6875rem`) | `12px` (`0.75rem`) | `500` · `tracking-[0.06em]` |
| `.ds-mono` | `Ref. Art.`, precios, `cm` | `11px–13px` | `12px–14px` | `500` · `tabular-nums` |

---

## 2. Paleta Semántica (Modo Claro Principal + Modo Oscuro)

| Token | Modo Claro (Default) | Modo Oscuro (Toggle) |
| :--- | :--- | :--- |
| `--bg-canvas` | `#F7F6F3` (Blanco Alabastro) | `#0B0B0E` (Obsidiana) |
| `--text-primary` | `#111113` (Negro Tinta) | `#F8FAFC` (Blanco Puro) |
| `--text-muted` | `#52525B` (Gris Pizarra) | `#9CA3AF` (Gris Plata) |
| `--accent-sartorial` | `#16233B` (Marino Sastrero) | `#FFFFFF` (Blanco Cristalino) |
| `--glass-surface` | `rgba(255,255,255,0.78)` | `rgba(255,255,255,0.06)` |
| `--glass-border` | `rgba(17,17,19,0.10)` | `rgba(255,255,255,0.16)` |

---

## 3. Geometría, Botones y Contenedor (Single Rail)
- **Riel Único Global:** `max-w-[1360px] mx-auto w-full px-5 sm:px-8 lg:px-10`.
- **Botones y Pills (`rounded-full` obligatorio en toda la web):**
  - **Primario (`.ds-btn-primary`):** `rounded-full min-h-[44px] px-6 text-xs font-semibold tracking-[0.04em] uppercase` (`bg-[#111113] text-white` en claro / `bg-white text-[#0B0B0E]` en oscuro).
  - **Secundario (`.ds-btn-secondary`):** `rounded-full min-h-[44px] px-5 text-xs font-semibold` en `.liquid-glass`.
- **Tarjetas & Contenedores (`.liquid-glass`):** `rounded-2xl` obligatorio (`16px`).
- **Prohibido:** Colores heredados de V1 (`text-cyan`, `text-champagne`, `bg-obsidian`), botones `rounded-xl` mezclados con `rounded-full`, y tipografía `Syne`.
