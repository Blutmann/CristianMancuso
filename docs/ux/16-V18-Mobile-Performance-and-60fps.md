# 16. V18 Performance & Mobile Ergonomics Spec — 60 FPS en Celular

> **Roles:** UI System Critic, UX Flow Architect & Performance Lead  
> **Problema Detectado:** En mobile, la carga inicial es lenta y la Landing se siente trabada al scrollear por sobrepeso de PNGs, `backdrop-filter: blur(28px)` apilado sobre orbes animados y *Lenis* interfiriendo con el scroll táctil nativo.

---

## 1. Optimizaciones de Carga (Network & Assets)
- **Compresión de imágenes (`public/images/shirts/*.png`):** Reducir resolución de las PNGs transparentes de `960x1280` (~1.3 MB c/u) a `640px` optimizadas / WebP (`~120–220 KB` c/u), reduciendo el peso inicial de la Home en **~80%**.
- **Preloader ágil en Mobile:** Acortar el preloader en pantallas táctiles o hacerlo no-bloqueante (`<= 650ms`) para mejorar el *First Contentful Paint (FCP)*.
- **Feedback de carga en `/a-medida`:** Mostrar un skeleton / indicador de progreso limpio mientras descarga `shirt.glb` en redes móviles y limitar `<Canvas dpr={[1, 1.5]}>`.

---

## 2. Optimizaciones de Scroll a 60 FPS en Mobile (`< 1024px`)
- **Scroll Táctil Nativo:** Desactivar **Lenis** en dispositivos táctiles (`pointer: coarse` o `< 1024px`) para aprovechar el *momentum scroll* nativo de iOS/Android sin lag.
- **Liquid Glass GPU-Friendly en Mobile:** En `@media (max-width: 767px)`, bajar `backdrop-filter` de `blur(28px)` a `blur(10px)` y desactivar la animación continua de los orbes de `AmbientStudioBackdrop` (dejando un gradiente estático ligero).
- **Ergonomía `375px`:** Verificar todas las rutas (`/`, `/coleccion`, `/coleccion/[id]`, `/a-medida`, `/como-medir`, `/empresas`) sin scroll horizontal (`overflow-x-clip`), menú mobile limpio y botones táctiles `min-h-[44px]`.
