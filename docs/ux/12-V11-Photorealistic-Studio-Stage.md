# 12. V11 Spec — Fotorrealismo de Estudio + Compactación de Catálogo

> **Roles:** Product Designer, UI System Critic & Motion Designer  
> **Decisión:** Reemplazar el WebGL procedural (cilindros) por **Fotografía de Estudio Fotorrealista + Tilt 3D + Zoom Macro por Paso**, logrando estética de campaña real (*Loro Piana / Suitsupply*) y carga instantánea en Cloudflare Pages.

---

## 1. Visor Fotorrealista "Armá tu camisa" (`StudioShirtStage.tsx`)
- **Activos:** Fotografías de estudio generadas sobre fondo `#09090D` (maniquí invisible, manga larga, iluminación lateral sutil) guardadas en `public/images/shirts/`.
- **Interacción:**
  - **Paso 1 (Tela):** Vista completa con **tilt 3D suave al mouse** (`perspective(1000px) rotateX/Y`) y crossfade al cambiar de tela.
  - **Paso 2 (Cuello):** **Zoom macro suave (`scale: 2.15`, foco superior)** al cuello de la prenda real + indicador sutil del corte elegido.
  - **Paso 3 (Botón & Iniciales):** **Zoom macro (`scale: 1.95`)** al puño izquierdo o pechera con las iniciales `C.M.` bordadas en vivo sobre la tela.
  - **Paso 4 (Medidas):** Vista completa con las 4 cotas en `cm` alrededor de la camisa.

---

## 2. Compactación de "Listas para enviar" (`CatalogSection.tsx`)
- **Objetivo:** Que encabezado + filtros + fila de 4 cards entren **100% en 1 viewport desktop (`<= 760px` útiles)** sin cortarse abajo.
- **Ajustes:**
  - Usar las nuevas fotografías de estudio dentro de cada card (reemplazando el SVG plano).
  - Reducir el contenedor de imagen a `h-40` (`160px`) y el padding de card a `p-4`.
  - Mantener talles comerciales en **1 sola fila** (`grid-cols-5` / `grid-cols-4`), botón `"Agregar al carrito"` y link compacto `"¿A medida? Armala sin cargo →"`.
