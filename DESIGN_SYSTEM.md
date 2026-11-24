# Design System & Motion Architecture — Cristian Mancuso

> **Dirección Estética:** *Kinetic Sartorial Atelier* (Inspirado en referencias Awwwards como `theinfinitysocks.com` y `two26.studio`, aplicado a alta camisería argentina a medida).

---

## 1. Stack Técnico (Cloudflare Pages Ready)
- **Framework:** Next.js (App Router) + TypeScript con `output: 'export'` en `next.config.ts` (genera build estático en `/out` 100% compatible con Cloudflare Pages).
- **Estilos:** Tailwind CSS.
- **Scroll & Coreografía:** `lenis` (smooth scroll con inercia) + `gsap` (`ScrollTrigger` para pinning, scrubbing y macro-zoom).
- **Micro-interacciones UI:** `framer-motion` + `lucide-react`.

---

## 2. Paleta de Color (Tokens)
| Token | Hex | Uso |
| :--- | :--- | :--- |
| `--bg-obsidian` | `#060709` | Fondo principal oscuro |
| `--surface-elevated` | `#101218` | Tarjetas, modales y bloques elevados (`border: 1px solid rgba(255,255,255,0.08)`) |
| `--bg-ivory` | `#F4F1EA` | Secciones editoriales claras de alto contraste |
| `--text-primary` | `#F5F2EB` | Texto principal sobre oscuro |
| `--text-muted` | `#9CA3AF` | Textos secundarios y descripciones |
| `--accent-cyan` | `#38BDF8` | Luz futurista / telemetría textil / estados activos |
| `--accent-champagne` | `#C8A97E` | Acento sastrero cálido (bordados, sellos "A medida sin cargo") |

---

## 3. Tipografía (`next/font/google`)
- **Display / Titulares cinéticos:** `Syne` (pesos 600, 700, 800)
- **Cuerpo / UI:** `Plus Jakarta Sans` (pesos 400, 500, 600)
- **Telemetría / Códigos / Precios:** `JetBrains Mono` (pesos 400, 500)

---

## 4. Reglas de Producto & UX
1. **Diferencial #1 visible desde el segundo 0:** *"Tu camisa a medida, sin costo extra"* en todas las gamas (incluido Algodón Urbano).
2. **Jerarquía Dual en Códigos:**
   - **Título principal:** Nombre sartorial (ej. `Pima Piura Celeste`).
   - **Referencia técnica:** `Ref. Art. 2529` en `JetBrains Mono` discreto, incluido automáticamente en el mensaje de WhatsApp.
3. **Empresas / Mayorista separado:** Vive en `/empresas` para no competir con el cliente final B2C en la portada.
4. **Público:** Hombres 30–45 años de Buenos Aires, interior de Argentina y exterior (México, EE. UU., España). Precios en ARS con toggle orientativo a USD.
5. **Motion & Accesibilidad:** Respetar `prefers-reduced-motion`, incluir botón discreto de *Pausar movimiento* y animar solo propiedades GPU (`transform`, `opacity`, `clip-path`).
