# 20. UX & UI Backlog Checklist — Cristian Mancuso

> Checklist vivo priorizado por impacto en **Conversión, Usabilidad y Accesibilidad**.

## P0 — Críticos (Bloqueantes de Venta y Prevención de Errores)
- [ ] **1. Persistencia de la Bolsa (`localStorage`)** en `AtelierContext.tsx` (`"cm_selection_v1"`).
- [ ] **2. Prevención de medidas vacías en `/a-medida`** (opción explícita *"Coordinar medidas por WhatsApp"* vs. validación de `cm`).
- [ ] **3. Tiempos de entrega y Garantía de calce** en `/coleccion/[id]` y `/a-medida`.
- [ ] **4. Número real de WhatsApp** en `src/data/config.ts` (reemplazar `5491100000000`).

## P1 — Altos (Descubrimiento, Orientación y Confianza)
- [ ] **5. Buscador (`Ref. Art.` / nombre) + Orden por precio** en `/coleccion`.
- [ ] **6. Breadcrumbs (`Colección / Gama / Producto`)** en `/coleccion/[id]`.
- [ ] **7. Prueba Social sobria** (3 testimonios breves de BA, Interior y Exterior).

## P2 — Ergonomía Táctil & Accesibilidad (WCAG / Apple HIG)
- [ ] **8. Touch targets `>= 44×44px`** en controles móviles (`ShirtGLBViewer`, `Navbar`, `Footer`).
- [ ] **9. Menú Mobile con tecla `Escape` y `scroll-lock`** + Toast `aria-live` al agregar producto.
