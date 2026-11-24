# 03. UI Design System Critique & Visual Pivot — Cristian Mancuso

> **Rol:** UI Designer — System Critic  
> **Principio Rector:** **Estética de Sastrería Editorial Sobria + Motion de Nivel Awwwards.** El *motion* aporta la sensación moderna y fluida; la interfaz visual se limpia para respirar lujo artesanal.

---

## 1. Auditoría Visual de la Iteración 1 (Evidencia en Capturas)

| Capa | Hallazgo en v1 | Impacto | Corrección en v2 |
| :--- | :--- | :--- | :--- |
| **Densidad Textual** | Párrafos largos en Hero y 4 tarjetas de Anatomía con mucho texto. | Alto (fatiga de lectura) | Reducir subtítulos a 1 línea. Eliminar bloques redundantes entre Hero y Catálogo. |
| **Tono Estético** | Exceso de `JetBrains Mono`, coordenadas (`34°36'S`) y retículas cyan tipo sci-fi. | Alto (desalineación de marca) | Usar `Plus Jakarta Sans` / `Cormorant` o `Syne` limpia. Reservar `Mono` **únicamente** para `Ref. Art.` y números en `cm`. |
| **Jerarquía de Compra** | Solo botón *"Personalizar y Pedir"*, sin talle comercial visible en la card. | Crítico (fricción de venta) | En Sección A: selector de talle inline + botón primario **"Agregar al carrito"** + link secundario **"Hacer a medida"**. |
| **Escala del Configurador** | Oculto dentro de un modal, poco aprovechado. | Alto | Convertir **"Armá tu camisa"** en la Sección B de página completa con tiras horizontales táctiles y esquema vivo. |

---

## 2. Trade-off Visual: "Futurista en Estética" vs. "Futurista en Motion"

| Dimensión | Enfoque v1 (Descartado) | Enfoque v2 (Elegido) |
| :--- | :--- | :--- |
| **Superficies** | Cajas oscuras con retículas cyan y telemetría constante | Superficies limpias, bordes sutiles `1px`, contraste equilibrado entre Obsidiana `#0B0B0D` y Marfil `#F4F1EA` |
| **Sensación Moderna** | Lograda con elementos visuales "cyber" | Lograda con **coreografía de scroll (GSAP/Lenis)**, transiciones elásticas, listados horizontales fluidos y feedback en tiempo real |
| **Ergonomía Mobile (375px)** | Muchas pills apiladas | Tiras horizontales con *scroll-snap* suave (`min-h-[44px]` en cada chip de tela, cuello y botón) |
