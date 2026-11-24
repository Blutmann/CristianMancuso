# 08. V7 UI System Critique & Liquid Glass Spec — Cristian Mancuso

> **Roles:** UI Designer (System Critic), UX Designer (Flow Architect) & Motion Designer  
> **Evidencia:** Auditoría visual sobre capturas de V6 (`cristianmancuso.pages.dev`).

---

## 1. Diagnóstico Crítico de V6 (Por qué se veía "viejo")

1. **Exceso de bordes y cajas anidadas ("Container dentro de Container"):** Cards con bordes sólidos oscuros dentro de secciones con bordes, dentro de inputs con bordes. Reduce la sensación de modernidad.
2. **Color mostaza/dorado plano (`#C8A25A`):** En botones grandes y talles activos se percibe apagado/antiguo frente a una estética contemporánea.
3. **`pin: true` en Mesa de Corte:** Bloqueaba el scroll e impedía llegar rápido al catálogo comercial.
4. **Cinta métrica opaca sin interacción:** El bloque crema `#EFE8D8` rompía la armonía oscura y no permitía navegar al hacer clic.

---

## 2. Sistema Visual V7: "Liquid Glass Atelier"

- **Materialidad Liquid Glass:** Superficies translúcidas (`bg-white/[0.05] backdrop-blur-2xl`), borde especular fino (`border-white/15`), reflejo superior (`shadow-[inset_0_1px_0_rgba(255,255,255,0.22)]`) y **cero cajas innecesarias** alrededor de las prendas (las camisas flotan sobre luz ambiental).
- **Paleta Refinada:**
  - Fondo continuo: **Obsidiana Profunda `#0B0B0E`** con luz líquida ambiental plata/grafito muy sutil.
  - Acción Primaria / Activos: **Blanco Cristalino (`#FFFFFF` / `bg-white text-[#0B0B0E]`)** y **Cristal Iluminado (`bg-white/15 border-white/35`)** — eliminando el amarillo mostaza plano.
- **Cinta Métrica Navegable en Liquid Glass:** Regla lateral translúcida donde **cada marca (`0 Inicio`, `35 Colección`, `70 Armá tu camisa`, `100 Medidas`) es clickeable** y hace scroll suave a esa sección.
- **Scroll sin bloqueos:** Eliminamos el `pin` bloqueante de la Mesa de Corte para que el usuario fluya directo al catálogo y al configurador.

---

## 3. "Armá tu camisa": Escenario Flotante + Arco de Telas `︶`

- **Centro:** Camisa manga larga **flotando sin caja contenedora**, con un único dock compacto en Liquid Glass debajo/al lado para medidas (`cm`) e iniciales.
- **Carrusel en Arco Curvo (`︶`):** Las telas se deslizan horizontalmente formando una **curva suave (`translateY` parabólico + `scale`)**: la tela seleccionada queda **centrada, elevada y nítida**, mientras las laterales descienden levemente siguiendo la curva `︶`.
