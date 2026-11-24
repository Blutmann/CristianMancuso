# 06. V4 Upgrade Spec — Blanco & Negro Editorial + Coreografía de Sastrería (Efecto WOW)

> **Roles:** UI System Critic, Motion Designer & Product Designer  
> **Origen:** Revisión visual de V3 en `cristianmancuso.pages.dev` (capturas desktop).

---

## 1. Diagnóstico V3 → Soluciones V4

| Punto detectado en V3 | Solución V4 |
| :--- | :--- |
| Paleta Navy/Beige no representa la marca (logo es blanco sobre negro) | **Blanco & Negro Puro Editorial (`#09090B` y `#FFFFFF`)** con un único acento sutil **Hilo Crudo / Plata (`#D4D4D8` / `#A89068`)** para costuras y estados activos. |
| Acción al scrollear pasa desapercibida | **Coreografía de Sastrería Real (GSAP Scrub):** aguja + hilo dibujando puntadas de ojal y contorno de patrón con tiza sastrera al scrollear + cinta métrica horizontal que corre de `0 cm` a `120 cm`. |
| Header se ve como píldora genérica | **Header con identidad de camisa:** borde inferior con pespunte sutil de sastrería y monograma `CM` estilo **bordado de puño**. |
| Talles comerciales (`38–46`) se parten en 2 renglones | `grid-cols-5` compacto en todas las cards para garantizar **1 sola línea**. |
| Swatches en "Armá tu camisa" sin precio ni sectorización | Sectorizados por gama (`Algodón Urbano`, `Algodón Pima Peruano`, `Algodón Italiano`, `Mancuso Donna`) con swatch cuadrado + nombre + `Ref. Art.` + **Precio visible**. |
