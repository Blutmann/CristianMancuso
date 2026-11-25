# 17. V19 Layout & Spacing Spec — Aprovechamiento Widescreen (`1440px`) & Padding Respirable

> **Roles:** UI Designer (System Critic) & UX Designer (Flow Architect)  
> **Evidencia:** Anotaciones visuales sobre captura desktop (`image_2.png`) y mobile.

---

## 1. Diagnóstico de Grilla y Espaciado
1. **Desperdicio lateral en Desktop:** Los contenedores estaban limitados a `max-w-5xl` / `max-w-6xl`, dejando ~35% de la pantalla vacía a los costados mientras la UI central se comprimía.
2. **Colisión superior e inferior en `/a-medida`:** El título `Armá tu camisa` y el Stepper quedaban muy cerca del `Navbar`, y el dock inferior tocaba el borde inferior de la ventana.
3. **Saturación en pantallas pequeñas:** En `< 768px`, `gap-2` y `px-3` hacían que todos los bloques se vieran pegados.

---

## 2. Reglas de Contenedor & Padding (V19)
- **Ancho Desktop unificado:** Pasar `Navbar`, `Hero`, `HomeShowcaseSections`, `CatalogSection`, `ShirtBuilderSection`, `BespokeProcess` y `Footer` a **`max-w-[1440px] mx-auto w-full px-5 sm:px-8 lg:px-12`**.
- **Respiración Vertical en `/a-medida`:**
  - `pt-24 lg:pt-28` para separar limpiamente el título y stepper del Navbar flotante.
  - `pb-8 lg:pb-6` para que el dock inferior tenga aire real respecto al borde de la ventana/Safari.
  - En mobile (`< 768px`), aumentar separación entre elementos a `gap-4` y padding interno de tarjetas/docks a `p-4 sm:p-5`.
