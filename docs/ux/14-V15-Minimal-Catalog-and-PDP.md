# 14. V15 E-Commerce Spec — Catálogo Minimalista & Página de Producto (`/coleccion/[id]`)

> **Roles:** Product Owner, UX Flow Architect & UI System Critic  
> **Principio:** **Landing (`/`) y `/a-medida` = Experiencia WOW.** **Catálogo (`/coleccion`) y Detalle (`/coleccion/[id]`) = E-Commerce limpio, sencillo, sin ruido y enfocado en comprar.**

---

## 1. Simplificación Radical de `/coleccion`
- **Eliminar `ARS / USD`:** Mostrar precios limpios únicamente en `ARS`.
- **Controles de Vista en la barra superior:**
  - **Grilla:** `3 cols` / `4 cols` (amplia vs. compacta).
  - **Modo Visual:** `Camisa` (foto flotante) vs. `Tela` (muestra cuadrada del paño/estampado).
- **Tarjeta de Producto Minimalista (sin saturación):**
  - Foto limpia (o swatch de tela) + Nombre sartorial + `Ref. Art.` + Precio.
  - Se retiran de la grilla los 5 botones de talles, cuotas y links largos; todo eso pasa a la página de producto.
  - Clic en la tarjeta → navega a `/coleccion/[id]`.

---

## 2. Nueva Página de Detalle de Producto (`/coleccion/[id]`)
- **Static Export (`generateStaticParams`):** Pre-renderizar las 7 rutas de `PRODUCTS` para compatibilidad 100% con Cloudflare Pages (`out/`).
- **Layout 2 Columnas:**
  - **Izquierda:** Fotografía grande del producto + toggle sutil `Vista Prenda` / `Detalle Tela`.
  - **Derecha:** Nombre, `Ref. Art.`, Precio + `3 cuotas sin interés`, descripción textil, selector de Talle Comercial, CTA **"Agregar al carrito"** y acceso secundario **"¿La querés a medida? Armala sin cargo →"** (`/a-medida?tela=...`).
- **Debajo:** Carrusel/listado horizontal compacto **"También te puede interesar"** con camisas sugeridas.
