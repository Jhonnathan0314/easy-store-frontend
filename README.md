# 🛒 EasyStoreFrontend

Frontend para la aplicación **Easy Store**, desarrollado con Angular 18, PrimeNG y arquitectura basada en componentes standalone con manejo de estado reactivo.

> Generado con [Angular CLI](https://github.com/angular/angular-cli) versión 18.2.13.

---

## 🚀 Development server

```bash
ng serve
```

Navega a `http://localhost:4200/`. La app se recargará automáticamente al modificar cualquier archivo fuente.

---

## 🏗️ Build

```bash
ng build
```

Los artefactos de construcción se almacenan en el directorio `dist/`.

---

## 📦 Estructura general del proyecto

```
src/
├── app/
│   ├── core/
│   │   ├── models/            # Modelos de datos (DTOs)
│   │   ├── services/          # Servicios API y utilitarios (con signals)
│   │   └── pipes/             # Pipes reutilizables
│   ├── shared/                # Componentes UI reutilizables (inputs, menús, etc.)
│   └── module/
│       └── dashboard/         # Módulos por funcionalidad (store, purchase, etc.)
│           ├── pages/         # Páginas específicas
│           └── components/    # Componentes visuales internos
├── assets/                    # Imágenes y estilos
└── environments/              # Variables de entorno
```

---

## 🧭 Mapa de arquitectura

### 🔹 **Roles de usuario**
- **Admin**: CRUD completo de tiendas, categorías, productos y compras.
- **Client**: visualiza tiendas, usa carrito, finaliza compra vía WhatsApp.
- **Ghost**: visualiza productos y compra directa sin login.

### 🔹 **Capas**
- `services/`: maneja comunicación con backend, usa `signal()` y `effect()`.
- `pages/`: componentes principales, orquestan datos.
- `components/`: visuales y reutilizables, aislados por contexto.
- `pipes/`: transformaciones simples como generación de texto WhatsApp.
- `shared/`: inputs, tablas, menús, cargadores (`skeletons`, `buttons`, etc.).

### 🔁 **Flujo de datos**
1. `signal()` carga info desde el `service`.
2. `effect()` reacciona a cambios y transforma/mapea.
3. Se actualiza UI con componentes standalone.
4. Las acciones (`addToCart`, `delete`, etc.) van hacia servicios vía `Output`.

---

## ✅ Buenas prácticas usadas

- Angular Standalone Components
- Signals y efectos reactivos (`computed`, `effect`)
- Input components desacoplados y validables
- Componentes estructurados por dominio
- Pipes utilitarios (`WhatsappPipe`)
- Reutilización máxima (`@Input`, `@Output`)
- Preparado para internacionalización (estructura modular)

---
