# Sistema de Diseño: Dashboard Monocromático

## 1. Fundamentos (Tokens)

Este proyecto utiliza un enfoque de diseño estrictamente monocromático (Blanco y Negro) con una escala de grises funcional para profundidad, bordes y estados de interacción. La arquitectura de componentes está basada en [Mantine / Carbon Design System].

### 1.1. Paleta de Colores
Dado que el diseño es B/N, el contraste y la jerarquía se logran a través de la escala de grises.

*   **Backgrounds:**
    *   `bg-primary`: `#FFFFFF` (Fondo principal de la aplicación)
    *   `bg-secondary`: `#F4F4F5` (Fondo para sidebars, headers o áreas de contraste)
    *   `bg-tertiary`: `#E4E4E7` (Fondo para estados *hover* o elementos inactivos)
*   **Superficies / Elevación:**
    *   `surface-base`: `#FFFFFF` (Tarjetas, modales, menús desplegables)
    *   `surface-inverted`: `#000000` (Tooltips, notificaciones toast)
*   **Texto:**
    *   `text-primary`: `#000000` (Títulos y texto principal)
    *   `text-secondary`: `#52525B` (Subtítulos, texto de soporte, placeholders)
    *   `text-inverted`: `#FFFFFF` (Texto sobre fondos negros)
*   **Bordes y Líneas:**
    *   `border-light`: `#E4E4E7` (Divisores sutiles, bordes de tablas)
    *   `border-dark`: `#000000` (Bordes de inputs enfocados, botones delineados)

### 1.2. Tipografía
*   **Fuente Principal:** `Inter` (fuente del sistema con fallback a sans-serif moderna).
*   **Tamaño Base del Cuerpo (Body):** `14px` (`text-sm` / `font-size: 14px; line-height: 1.5;`). Todo el cuerpo de texto, descripciones, contenido de tablas y campos de entrada deben basarse estrictamente en **14px** para garantizar balance óptimo, alta densidad de información y legibilidad en pantallas de administración.
*   **Pesos Tipográficos:** 
    *   **Regular (400):** Cuerpo de texto general (`body` a 14px), descripciones secundarias, notas de pedidos y textos de soporte.
    *   **Medium (500):** Botones, etiquetas de formulario (`labels`), inputs, filtros, badges de estado y cabeceras de tablas.
    *   **Semibold (600):** Títulos de tarjetas (`cards`), subtítulos de secciones, nombres de clientes y elementos destacados.
    *   **Bold (700):** Título principal de la página (H1), totales numéricos clave y métricas destacadas de KPIs.

### 1.3. Espaciado y Layout (Grid Estricto de 8px en 8px)
Todo el espaciado dentro del sistema de diseño (paddings, márgenes, gaps y layouts) se rige de manera estricta en múltiplos de **8px**:
*   `8px` (`sm`): Separación mínima entre elementos estrechos e íconos.
*   `16px` (`md`): Padding estándar de tarjetas, botones y contenedores internos.
*   `24px` (`lg`): Separación y márgenes entre secciones de contenido y grids.
*   `32px` (`xl`): Espaciado principal de layout y contenedores macro.
*   `40px` (`xxl`): **Padding obligatorio para todas las secciones padre** y área principal (`main`). (5 × 8px = 40px).
*   `48px`, `64px`: Alturas de cabeceras, layouts y componentes de nivel superior.

### 1.4. Redondeo de Esquinas (Round Corners / Border Radius)
*   **Contenedores de Tarjetas (Cards):** `16px` (`border-radius: 16px`). Aplica para todas las tarjetas de métricas, widgets, contenedores de vistas y comprobantes.
*   **Botones (Buttons):** `6px` (`border-radius: 6px`). Aplica a botones primarios, secundarios, de acción y filtros.
*   **Entradas de Texto y Formularios:** `6px` (`border-radius: 6px`). Aplica para `inputs`, `textarea`, selects y demás elementos de formulario.
*   **Badges y Píldoras:** `6px` para mantener la coherencia geométrica del sistema.

---

## 2. Componentes Básicos (UI Kit)

### 2.1. Botones (Buttons)
Solo existen tres variantes funcionales. No hay colores de estado (éxito/error), estos se comunican mediante iconografía y texto. Todos los botones tienen un redondeo de esquina de `6px`.

*   **Round Corner:** `6px` (`border-radius: 6px`).
*   **Primary:** 
    *   Fondo: `#000000`, Texto: `#FFFFFF`.
    *   Hover: Cambio de opacidad al 80% o fondo `#27272A`.
*   **Secondary (Outline):** 
    *   Fondo: Transparente, Borde: `1px solid #000000`, Texto: `#000000`.
    *   Hover: Fondo `#F4F4F5`.
*   **Ghost / Tertiary:** 
    *   Fondo: Transparente, Borde: Ninguno, Texto: `#000000`.
    *   Hover: Fondo `#E4E4E7`.

### 2.2. Entradas de Texto (Inputs, Textarea y Formularios)
El estado de foco es crucial en un diseño B/N para guiar al usuario.

*   **Round Corner:** `6px` (`border-radius: 6px`).
*   **Default:** Borde `border-light`, Fondo `bg-primary`.
*   **Hover:** Borde `#A1A1AA`.
*   **Focus / Active:** Borde `border-dark` (2px), sin anillo de sombra (ring) para mantener la estética brutalista/minimalista.
*   **Disabled:** Fondo `bg-tertiary`, Texto `text-secondary`, opacidad 50%.

### 2.3. Tarjetas (Cards)
Utilizadas para envolver widgets del dashboard, métricas y tablas.

*   **Round Corner:** `16px` (`border-radius: 16px`).
*   **Estilo Base:** Fondo `surface-base`, Borde `1px solid border-light`. 
*   **Padding:** `16px` o `24px` (siguiendo el grid de 8 en 8).
*   **Sombra:** Sin sombras (Flat design) o una sombra muy sutil e intensa (ej. `0 4px 0 #000000` para un estilo neobrutalista, o `0 2px 4px rgba(0,0,0,0.05)` para un estilo corporativo limpio).

### 2.4. Tablas (Data Tables)
El componente central de cualquier plataforma/dashboard.

*   **Contenedor:** Envuelto en tarjeta con round corner de `16px` y borde `1px solid border-light`.
*   **Header (th):** Fondo `bg-secondary`, Texto `text-secondary`, Medium (500), borde inferior `1px solid border-dark`. Padding: `16px` (vertical `8px` o `16px`).
*   **Celdas (td):** Fondo `bg-primary`, texto `text-primary`, borde inferior `1px solid border-light`. Padding: `16px`.
*   **Fila Hover:** Fondo `bg-secondary`.

### 2.5. Navegación (Sidebar & Topbar)
*   **Sidebar:** Fondo `bg-secondary`, ancho fijo de `260px`. Enlace activo (Active Item) marcado con un fondo `#000000`, texto `#FFFFFF` y round corner de `6px`.
*   **Topbar:** Fondo `bg-primary`, altura fija de `64px`, separado del contenido por un borde inferior `border-light`. 
    *   **Breadcrumbs:** **No deben aparecer en las secciones principales** (donde se muestra directamente el título limpio de la vista actual). Se reservan exclusivamente para secciones secundarias, niveles de detalle o subpáginas.
    *   **Controles:** Botón de navegación móvil (en pantallas pequeñas) y botón de notificaciones sin badges innecesarios de versión.

### 2.6. Pantalla Inicial de Inicio de Sesión (Login View)
*   **Comportamiento:** Si el usuario no cuenta con una sesión activa con token JWT válido, la aplicación presenta de forma obligatoria la pantalla inicial de inicio de sesión como puerta de entrada al dashboard.
*   **Seguridad y Privacidad:** Las credenciales **nunca deben mostrarse ni sugerirse en la pantalla**.
*   **Contenedor:** Tarjeta centrada con fondo `surface-base` (`#FFFFFF`), borde `1px solid border-light` (`#E4E4E7`), round corner de `16px` y padding de `32px` (múltiplo de 8px).
*   **Controles:** Inputs de texto/contraseña con round corner de `6px` y botón primario de ancho completo con round corner de `6px` (`#000000`/`#FFFFFF`).
*   **Feedback:** Mensajes de error en caso de credenciales inválidas (401) representados mediante bordes oscuros de alto contraste e iconografía de alerta sin colores semánticos.

---

## 3. Estados de Retroalimentación (Feedback)

Al no tener colores semánticos (Rojo para error, Verde para éxito), el sistema depende de:
1.  **Iconografía de alto contraste:** (ej. ✕ para error, ✓ para éxito).
2.  **Grosor de bordes:** Un error en un input se marca con un borde más grueso y un ícono de alerta, además del mensaje de texto explicativo debajo del input.
3.  **Notificaciones (Toasts):** Utilizan el fondo `surface-inverted` (Negro) con texto blanco para asegurar que destaquen inmediatamente sobre la interfaz blanca, con round corner de `6px` o `8px`.

---

## 4. Estructura de Layout del Dashboard

*   **Navegación Izquierda (Sidebar):** Ancho fijo de `260px`.
*   **Cabecera (Header):** Altura fija de `64px` (múltiplo de 8px).
*   **Contenedor Principal (Main) y Secciones Padre:** Área fluida de ancho completo (`100%` adaptativa, sin restricciones artificiales de ancho como `max-w-7xl` o márgenes automáticos) con **padding perimetral estricto de 40px** (`p-[40px]`, múltiplo de 8px: 5 × 8px = 40px). Todo el contenido interior debe expandirse y adaptarse directamente a este contenedor respetando de forma exacta los 40px de separación de los bordes. Fondo `bg-secondary` (`#F4F4F5`) para generar contraste limpio frente a las tarjetas blancas (`#FFFFFF`).
