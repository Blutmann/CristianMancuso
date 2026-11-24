# 02. UX Flow & Information Architecture — Cristian Mancuso (v2)

> **Rol:** UX Designer — Flow Architect  
> **Objetivo:** Reestructurar la experiencia en **3 pilares claros** sin fricción cognitiva, separando la compra rápida de la confección a medida.

---

## 1. Arquitectura de Información (Antes vs. Después)

```mermaid
flowchart TD
    subgraph V1["Iteración 1 (Alta Densidad)"]
        H1["Hero con telemetría"] --> C1["Comparador 4 gamas"]
        C1 --> A1["Anatomía 4 actos (mucho texto)"]
        A1 --> K1["Catálogo (solo modal)"]
        K1 --> M1["Cómo pedir + Guía"]
    end

    subgraph V2["Iteración 2 (3 Pilares Claros)"]
        H2["Hero Limpio + Motion Fluido"] --> SA["A) Sección Comercial: Catálogo Entrega Inmediata (Talle + Carrito directo)"]
        SA -->|"Opción: ¿La querés a medida?"| SB["B) Armá tu Camisa: Tela -> Cuello -> Botón -> Medidas en vivo"]
        SB --> SC["C) Instrucciones para Medir (BA Presencial vs. Distancia)"]
        SA --> Cart["Bolsa Lateral + WhatsApp"]
        SB --> Cart
    end
```

---

## 2. User Flow Principal: Compra Comercial vs. A Medida

```mermaid
flowchart TD
    Start(["Usuario ingresa a la Home"]) --> Choice{"¿Cómo quiere comprar?"}

    Choice -->|"Compra rápida"| Commercial["Sección A: Catálogo Comercial"]
    Commercial --> Size["Elige talle comercial (38-46 / S-XL)"]
    Size --> AddDirect["Clic en 'Agregar al carrito'"]
    AddDirect --> Drawer["Se abre Bolsa Lateral"]

    Choice -->|"Confección a medida"| Custom["Sección B: Armá tu Camisa"]
    Commercial -->|"Prefiero a medida (sin cargo)"| Custom

    Custom --> Step1["1. Elige Tela (listado horizontal + Ref. Art.)"]
    Step1 --> Step2["2. Elige Cuello (listado horizontal)"]
    Step2 --> Step3["3. Elige Botón (listado horizontal)"]
    Step3 --> Step4["4. Carga 4 Medidas (se dibujan en vivo en la camisa)"]
    Step4 --> Validate{"¿Tiene sus medidas?"}
    Validate -->|"Sí"| AddCustom["Agregar Camisa Armada a la Bolsa / WhatsApp"]
    Validate -->|"No, no sé medir"| Guide["Scroll a Sección C: Instrucciones para Medir"]
    Guide -->|"Vuelve con los cm"| Step4
    AddCustom --> Drawer
```

---

## 3. Matriz de Estados (Zero Orphan States)

| Componente / Flujo | `Empty` | `Partial / Editing` | `Error / Validation` | `Success` |
| :--- | :--- | :--- | :--- | :--- |
| **Sección A (Catálogo)** | Filtro sin resultados: *"No hay telas en esta gama. Ver todas."* | Talle preseleccionado por defecto para 1-clic. | Botón deshabilitado si no hay talle elegido (con tooltip claro). | Feedback visual `"✓ Agregada"` + apertura sutil de bolsa. |
| **Sección B (Armá tu camisa)** | Camisa base con cotas `-- cm` esperando medidas. | Al tipear cada medida (`39`, `54`, `64`, `74`), aparece el N° en vivo sobre el esquema. | Si ingresa valor fuera de rango lógico (ej. cuello `120`), aviso inline amable. | Resumen completo listo para sumar a la bolsa o enviar a WhatsApp con `Ref. Art.`. |
| **Bolsa Lateral** | *"Tu bolsa está vacía"* + CTA `"Ir al catálogo"`. | Muestra tanto camisas comerciales como configuradas a medida. | Sin conexión: permite copiar el texto del pedido al portapapeles como *fallback*. | Redirección limpia a WhatsApp con el pedido completo. |
