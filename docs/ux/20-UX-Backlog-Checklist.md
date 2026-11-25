# 20. UX & UI Backlog Checklist — Cristian Mancuso

> Checklist vivo priorizado por impacto en **Conversión, Usabilidad y Accesibilidad**.

## P0 — Críticos (Bloqueantes de Venta y Prevención de Errores)
- [x] **1. Persistencia de la Bolsa (`localStorage`)** en `AtelierContext.tsx` (`"cm_selection_v1"`). *(V22 `d321b13`)*
- [x] **2. Prevención de medidas vacías en `/a-medida`** (opción explícita *"Coordinar medidas por WhatsApp"* vs. validación de `cm`). *(V22 `d321b13`)*
- [x] **3. Tiempos de entrega y Garantía de calce** en `/coleccion/[id]` y `/a-medida`. *(V22 `d321b13`)*
- [x] **4. Número real de WhatsApp** en `src/data/config.ts` (`5491158543013`). *(V23 `5e44bc2`)*

## P1 — Altos (Descubrimiento, Orientación y Confianza)
- [x] **5. Buscador (`Ref. Art.` / nombre) + Orden por precio** en `/coleccion`. *(V23 `5e44bc2`)*
- [x] **6. Breadcrumbs (`Colección / Gama / Producto`)** en `/coleccion/[id]`. *(V23 `5e44bc2`)*
- [x] **7. Prueba Social sobria** (3 testimonios breves de BA, Interior y Exterior). *(V23 `5e44bc2`)*

## P2 — Ergonomía Táctil & Accesibilidad (WCAG / Apple HIG)
- [ ] **8. Touch targets `>= 44×44px`** en controles móviles (`ShirtGLBViewer`, `Navbar`, `Footer`).
- [ ] **9. Menú Mobile con tecla `Escape` y `scroll-lock`** + Toast `aria-live` al agregar producto.
