# 🛒 E-commerce

Plataforma de e-commerce full-stack tipo marketplace (estilo Amazon/eBay) con catálogo, carrito, pagos reales con Stripe, autenticación con roles y panel de vendedor. Construida como proyecto de portafolio con **Angular 19** y **ASP.NET Core 8 (Clean Architecture)** sobre **PostgreSQL**.

🔗 **Demo en vivo:** [tu-proyecto.vercel.app](https://) · **API:** [Render](https://e-commerce-strz.onrender.com)

---

## ✨ Características

**Tienda (comprador)**
- Catálogo con **búsqueda con autocompletado**, filtros (categoría, precio), ordenamiento y paginación
- Barra de departamentos y tiles de categorías
- Detalle de producto con **galería de imágenes**, variantes (talla/color con stock por variante), reseñas y productos relacionados
- **Carrito** y **lista de deseos** persistentes
- **Checkout con Stripe** (sesiones de pago, códigos promocionales, dirección de envío)
- **Vistos recientemente** e historial de pedidos con seguimiento de estado
- Reseñas con calificación por estrellas

**Cuenta**
- Registro e inicio de sesión con **JWT** (3 roles: Admin, Vendedor, Comprador)
- **Login con Google** vía Firebase Authentication
- Editar perfil, cambiar contraseña y libreta de direcciones

**Vendedor / Admin**
- CRUD de productos (con variantes, imágenes, precio de oferta)
- **Dashboard de vendedor** con métricas y gráficas (ventas por mes, top productos)
- Panel de administración

---

## 🧱 Stack técnico

| Capa | Tecnología |
|------|------------|
| **Frontend** | Angular 19 (standalone components, signals, control flow `@if`/`@for`), TypeScript |
| **Backend** | ASP.NET Core 8 · Clean Architecture · EF Core 9 |
| **Base de datos** | PostgreSQL (Neon) |
| **Autenticación** | JWT + BCrypt · Firebase Admin SDK (Google sign-in) |
| **Pagos** | Stripe.net (Checkout) |
| **Despliegue** | Vercel (front) · Render (API) · Neon (DB) |

---

## 📁 Estructura del repositorio

```
E-commerce/
├── E-commerce-front/        # App Angular 19
│   └── src/app/
│       ├── core/            # servicios, guards, interceptores, modelos
│       ├── features/        # auth, home, products, cart, orders, profile, seller, admin
│       └── shared/ui/       # header, footer, search-bar, toast, etc.
│
├── E-commerce-api/          # API ASP.NET Core 8 (Clean Architecture)
│   └── src/
│       ├── ECommerce.Domain/          # entidades y enums (sin dependencias)
│       ├── ECommerce.Application/     # casos de uso, DTOs, interfaces
│       ├── ECommerce.Infrastructure/  # EF Core, Stripe, Firebase, JWT
│       └── ECommerce.Api/             # controllers, Program.cs, manejo global de errores
│
└── E-commerce-db/           # esquema y scripts SQL (migraciones manuales + seeds)
```

La API sigue **Clean Architecture**: las dependencias apuntan hacia adentro (Domain no depende de nada; Application define interfaces que Infrastructure implementa). Incluye manejo centralizado de errores con `ProblemDetails`, excepciones de dominio (`NotFoundException` → 404, `ConflictException` → 409, etc.) y proyecciones EF para respuestas eficientes.

---

## 🚀 Puesta en marcha local

### Requisitos
- [.NET SDK 8](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org) y npm
- Una base de datos PostgreSQL (local o [Neon](https://neon.tech) gratis)

### 1. Base de datos
Crea la base de datos y aplica los scripts SQL de `E-commerce-db/` en orden (esquema, luego migraciones, luego seeds). Para poblar el catálogo con ~194 productos reales:

```bash
# en el SQL editor de Neon, ejecuta el contenido de:
E-commerce-db/seed-dummyjson.sql
```

### 2. Backend
```bash
cd E-commerce-api
# Variables de entorno (no las subas al repo):
export DATABASE_URL="Host=...;Port=5432;Database=...;Username=...;Password=...;SSL Mode=Require;Trust Server Certificate=true"
export JWT_KEY="una-clave-secreta-de-al-menos-32-caracteres"
export STRIPE_SECRET_KEY="sk_test_..."
export FIREBASE_CREDENTIALS='{ ...json del service account... }'   # opcional (login Google)
export FRONTEND_URL="http://localhost:4200"

dotnet run --project src/ECommerce.Api   # API en http://localhost:5134
```

### 3. Frontend
```bash
cd E-commerce-front
npm install
npm start                                 # http://localhost:4200 (proxy /api -> backend)
```

En desarrollo, el dev-server de Angular hace proxy de `/api` al backend (ver `proxy.conf.json`). La config pública de Firebase va en `src/environments/environment.ts`.

---

## 🔐 Variables de entorno (backend)

| Variable | Descripción |
|----------|-------------|
| `DATABASE_URL` | Cadena de conexión a PostgreSQL (formato Npgsql) |
| `JWT_KEY` | Clave para firmar los tokens JWT (mín. 32 caracteres) |
| `STRIPE_SECRET_KEY` | Clave secreta de Stripe (`sk_test_...`) |
| `FIREBASE_CREDENTIALS` | JSON del service account de Firebase (login con Google) |
| `FRONTEND_URL` | Origen(es) permitido(s) para CORS y URLs de retorno de Stripe |

> ⚠️ Las credenciales son secretas: nunca las subas a Git. En producción van como variables de entorno en Render.

---

## ☁️ Despliegue

| Componente | Servicio | Notas |
|-----------|----------|-------|
| Frontend | **Vercel** | build de Angular; `environment.prod.ts` apunta a la API de Render |
| API | **Render** | Docker; variables de entorno configuradas en el dashboard |
| Base de datos | **Neon** | PostgreSQL serverless |

---

## 📜 Licencia

Proyecto de portafolio con fines educativos y de demostración.
