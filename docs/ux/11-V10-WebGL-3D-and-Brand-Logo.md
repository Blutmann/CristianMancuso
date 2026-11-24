# 11. V10 Spec — Camisa 3D Real (WebGL), Liquid Glass Profundo, Viewport Único & Logo Real

> **Roles:** Product Owner, UX Flow Architect, UI System Critic & Motion Designer  
> **Decisión Estratégica:** Reemplazar el SVG 2D plano por una **Camisa 3D WebGL interactiva (`Three.js` / `React Three Fiber`)** con texturas procedurales de tela, cámara 3D animada por paso y **ajuste estricto a 1 sola pantalla (`100dvh`)**.

---

## 1. Vectorización del Logo Real (Cristian Mancuso)
El logo original posee un **monograma heráldico entrelazado (`M` + `C` + anillo/ojal central)** en blanco puro sobre negro, acompañado de `CRISTIAN` / `MANCUSO` en sans-serif geométrica bold.
- El Developer debe crear `BrandLogo.tsx` con un **SVG vectorial nítido** fiel a ese monograma entrelazado (`M` vertical con remates serifados + `C` envolvente + círculo central) para usarlo en `Preloader.tsx`, `Navbar.tsx` y `Footer.tsx`.

---

## 2. Camisa 3D WebGL (`Shirt3DCanvas.tsx`)
- **Stack:** `three`, `@types/three`, `@react-three/fiber`, `@react-three/drei` (cargado con `next/dynamic` `ssr: false` para mantener `output: 'export'` de Cloudflare Pages).
- **Geometría 3D Manga Larga:**
  - Torso anatómico (`LatheGeometry` / malla esculpida con pliegues sutiles), hombros, mangas largas con **puños abotonados**, tapeta frontal, botones 3D con brillo de nácar y cuello 3D dinámico (`Italiano`, `Francés`, `Button-Down`, `Mao`).
- **Textura de Tela en Vivo (`CanvasTexture` + `bumpMap`):**
  - Cada tela de `catalog.ts` genera su textura procedural (sarga Pima diagonal, lino abierto, cuadros ventana, raya cloque) aplicada como `map` y `bumpMap` sobre `MeshPhysicalMaterial` (`sheen`, `roughness`) para que la luz de estudio rebote como tela real.
- **Cámara 3D por Paso (`useFrame` + `OrbitControls`):**
  - `Paso 1 (Tela)`: Vista completa + rotación suave interactiva 360°.
  - `Paso 2 (Cuello)`: Cámara orbita y hace zoom suave al cuello.
  - `Paso 3 (Botón & Iniciales)`: Cámara hace zoom a la pechera / puño izquierdo.
  - `Paso 4 (Medidas)`: Vista completa con overlay sutil de cotas en `cm` alrededor del canvas.

---

## 3. Layout 100% en 1 Pantalla (`ShirtBuilderSection.tsx`)
- **Prohibido desbordar:** En desktop, la sección completa debe entrar en **un solo viewport (`<= 760px` útiles debajo del navbar)**:
  1. **Fila superior compacta:** Título `Armá tu camisa` + Stepper 4 pasos en una misma línea.
  2. **Centro (`flex-1 min-h-[360px]`):** Canvas 3D WebGL de la camisa flotando libre.
  3. **Barra inferior única `.liquid-glass` (recta, sin arco `︶`):** Tira horizontal compacta de opciones a la izquierda + botón de confirmación / agregar a la derecha (todo en `~130px` de alto).

---

## 4. Fondo para Refracción Real de Liquid Glass
- En `page.tsx`, el fondo global fijo debe tener **haces de luz de estudio / gradiente radial de atelier visible** (no negro plano), para que el `backdrop-filter: blur(28px)` de `.liquid-glass` refracte luz real en cada card y barra.
