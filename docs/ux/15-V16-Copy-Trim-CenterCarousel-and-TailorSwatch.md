# 15. V16 Final Polish Spec — Recorte de Copy, Carrusel Centrado, Quick-Add Talle & Muestrario de Sastre

> **Roles:** UX Writer, UI Designer (System Critic) & UX Researcher  
> **Objetivo:** Reducir el texto global en >50%, centrar siempre la tela activa en `/a-medida`, habilitar compra en 1 toque desde `/coleccion` con selector rápido de talle, y reemplazar el zoom plano por un **Muestrario de Tela de Sastre**.

---

## 1. Auditoría de Copywriting (UX Writer — Menos es Más)

| Ruta / Componente | Qué se elimina | Copy Final Conciso |
| :--- | :--- | :--- |
| **Hero (`/`)** | Eyebrow pill superior + línea inferior de cuotas/países | H1: *"Tu camisa a medida, sin costo extra."* + Subtítulo: *"Telas italianas y peruanas. Envíos a todo el país y exterior."* |
| **Gamas (`/`)** | Origen geográfico repetido + párrafos de 2 líneas | Máx. 5 palabras por gama (ej. *"Fibra extra larga, tacto sedoso."*). |
| **Invitación A Medida (`/`)** | Textos largos por paso | `1. Elegí tela` · `2. Cargá medidas` · `3. Recibila en casa`. |
| **`/a-medida`** | Pill flotante duplicada (`Cuello Italiano · C.M.`) y nombre/precio repetido arriba | Solo título `Armá tu camisa` + Stepper 4 pasos. El detalle vive en el ítem expandido del dock. |
| **`/como-medir` & `/empresas`** | Subtítulos redundantes | 1 línea directa por sección. |

---

## 2. Carrusel Centrado en `/a-medida` (`ShirtBuilderSection.tsx`)
- **Menos containers:** Reemplazar las pills con borde de las categorías (`Todas`, `Algodón 100%`, etc.) por **tabs tipográficas limpias con subrayado activo** (sin caja alrededor).
- **Centrado automático:** Al hacer clic en cualquier cuadrado de tela, el track horizontal anima su posición (`scrollTo` centrado o `x` spring) para que **la tela seleccionada quede siempre en el centro** y se expanda con su nombre, `Ref. Art.` y precio.

---

## 3. Quick-Add con Selector de Talle en `/coleccion` (`CatalogSection.tsx`)
- Cada card mantiene su diseño limpio (Foto + Nombre + `Ref. Art.` + Precio) y suma un botón simple **"Agregar al carrito"**.
- **Interacción sin salir de `/coleccion`:** Al tocar **"Agregar al carrito"**, el botón se transforma suavemente en una fila única de talles (`38 40 42 44 46` o `S M L XL`). Al tocar el talle, agrega directo a la Bolsa Lateral y vuelve a su estado inicial.

---

## 4. Formato "Muestrario de Sastre" (`Tela` / `Muestra de Tela`)
- En `/coleccion` (toggle `Tela`) y `/coleccion/[id]` (`Muestra de Tela`), presentar cada género como un **paño de muestrario sastrero real**: tarjeta cuadrada con **borde zig-zag de corte de tijera (pinked edge SVG/CSS)** o etiqueta de sastrería cosida en la esquina con `Ref. Art.` y composición del hilado.
