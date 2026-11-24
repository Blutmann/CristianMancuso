# 09. V8 UI System Critique, Spacing Spec & True Liquid Glass — Cristian Mancuso

> **Roles:** UX Designer (Flow Architect), UI Designer (System Critic) & Product Designer (Handoff Spec)  
> **Evidencia:** Auditoría visual de V7 (`image.png` – `image_4.png`).

---

## 1. Por qué V7 aún no parecía Liquid Glass (Diagnóstico Físico/Visual)
1. **Fondo plano `#0B0B0E` sin luz detrás:** El efecto `backdrop-filter: blur()` es invisible sobre un fondo sólido liso; el vidrio líquido necesita **gradientes de luz ambiental y reflejos detrás** para refractar.
2. **Falta de reflejo especular en los bordes:** Los contenedores usaban bordes opacos simples en vez de gradientes diagonales translúcidos con `inset` highlight superior.
3. **Altura excesiva en "Armá tu camisa":** Al ubicar el dock de medidas *debajo* de la camisa, la sección superaba la altura de la pantalla (`100vh`) y cortaba el arco de telas y el botón CTA.
4. **Colisión con Navbar al navegar:** En `#coleccion`, el eyebrow `ENTREGA INMEDIATA` quedaba tapado por el Navbar flotante por falta de `scroll-margin-top`.

---

## 2. Criterios Estrictos de Padding & Layout (8pt Grid)

| Regla | Especificación Exacta | Objetivo UX |
| :--- | :--- | :--- |
| **Scroll Margin en Anclas** | `scroll-mt-24` (`96px`) en `#coleccion`, `#arma-tu-camisa`, `#como-medir` | Evita que el Navbar flotante tape los títulos al hacer clic en links o en la Cinta Métrica. |
| **Contenedor Global** | `max-w-7xl mx-auto px-5 sm:px-8 lg:px-12 xl:pr-24` | Mantiene márgenes respirables y reserva espacio para la Cinta Métrica lateral en `xl+`. |
| **Ritmo Vertical** | `py-16 lg:py-20` en secciones estándar | Elimina huecos vacíos entre secciones sin amontonar contenido. |
| **Workbench "Armá tu camisa"** | Layout **3 columnas (`lg:grid-cols-12`: 3 cols Medidas · 6 cols Camisa · 3 cols Cuello/Botón)** + Arco `︶` y CTA debajo | Garantiza que **toda la experiencia de armado entre en 1 sola pantalla desktop (`<= 860px` de alto)**. |

---

## 3. Receta CSS de "True Liquid Glass"
- **Luz Ambiental Global (detrás de todo):** Capa fija `pointer-events-none` con 3 orbes difusos sutiles (blanco plata, azul pizarra `#1E293B` y gris perla) para que cada panel de vidrio refracte luz real.
- **Superficies `.liquid-glass`:**
  - Gradiente diagonal translúcido: `linear-gradient(135deg, rgba(255,255,255,0.13) 0%, rgba(255,255,255,0.03) 55%, rgba(255,255,255,0.08) 100%)`
  - `backdrop-filter: blur(28px) saturate(180%)`
  - Borde especular: `1px solid rgba(255,255,255,0.20)`
  - Reflejo interno de cristal: `inset 0 1px 1px rgba(255,255,255,0.38), inset 0 -1px 1px rgba(255,255,255,0.06)`
