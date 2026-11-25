# 18. Design System Audit & Unification Plan — Las 5 Rutas

> **Roles:** UI Designer (System Critic) & Product Designer (Handoff Spec)  
> **Objetivo:** Unificar tipografía, botones, colores y espaciados en `/`, `/coleccion`, `/coleccion/[id]`, `/a-medida`, `/como-medir` y `/empresas`.

---

## 1. Hallazgos de Auditoría Previa sobre el Código Real
1. **Inconsistencia de `H1`:** `/` usaba `clamp(...)`, `/coleccion` usaba `clamp(1.9rem,3.4vw,2.75rem)`, `/a-medida` usaba `text-xl sm:text-2xl`, y `/empresas` usaba otro tamaño.
2. **Mezcla de fuentes:** `Syne` en títulos convivía con `Plus Jakarta Sans` en cuerpo y `JetBrains Mono` en varios párrafos.
3. **Tokens obsoletos en `/empresas`:** `EmpresasInquiryForm.tsx` aún contenía `text-champagne`, `text-cyan`, `bg-obsidian/70`, `border-white/[0.08]`, rompiendo el Modo Claro.
4. **Botones inconsistentes:** Alturas `h-8`, `min-h-[40px]`, `min-h-[44px]` y radios mezclados (`rounded-xl` vs `rounded-full`).

---

## 2. Reglas de Unificación para Desarrollo (V21)
- Definir clases semánticas en `src/app/globals.css`: `.ds-h1-hero`, `.ds-h1-page`, `.ds-h2`, `.ds-h3`, `.ds-body`, `.ds-caption`, `.ds-btn-primary`, `.ds-btn-secondary`.
- Eliminar `Syne` de `layout.tsx` y `globals.css`; asignar `Plus Jakarta Sans` como `--font-display` y `--font-sans`.
- Auditar y migrar `EmpresasInquiryForm.tsx` y `src/app/empresas/page.tsx` al 100% al sistema Dual Claro/Oscuro `.liquid-glass`.
- Verificar que todos los botones de acción primaria y secundaria usen `rounded-full` y `min-h-[44px]` (`h-9` solo para mini-controles de toolbar).
