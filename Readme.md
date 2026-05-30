# 🛒 E-commerce

A full-stack marketplace-style e-commerce platform (Amazon/eBay style) featuring a product catalog, cart, real Stripe payments, role-based authentication and a seller dashboard. Built as a portfolio project with **Angular 19** and **ASP.NET Core 8 (Clean Architecture)** on top of **PostgreSQL**.

---

## ✨ Features

**Storefront (buyer)**
- Catalog with **search autocomplete**, filters (category, price), sorting and pagination
- Departments bar and category tiles
- Product detail with **image gallery**, variants (size/color with per-variant stock), reviews and related products
- Persistent **cart** and **wishlist**
- **Stripe checkout** (payment sessions, promo codes, shipping address)
- **Recently viewed** and order history with status tracking
- Star-rating reviews

**Account**
- Sign up and sign in with **JWT** (3 roles: Admin, Seller, Buyer)
- **Google sign-in** via Firebase Authentication
- Edit profile, change password and address book

**Seller / Admin**
- Product CRUD (with variants, images, sale price)
- **Seller dashboard** with metrics and charts (sales per month, top products)
- Admin panel

---

## 🧱 Tech stack

| Layer | Technology |
|-------|------------|
| **Frontend** | Angular 19 (standalone components, signals, control flow `@if`/`@for`), TypeScript |
| **Backend** | ASP.NET Core 8 · Clean Architecture · EF Core 9 |
| **Database** | PostgreSQL |
| **Authentication** | JWT + BCrypt · Firebase Admin SDK (Google sign-in) |
| **Payments** | Stripe.net (Checkout) |

---

## 📁 Repository structure

```
E-commerce/
├── E-commerce-front/        # Angular 19 app
│   └── src/app/
│       ├── core/            # services, guards, interceptors, models
│       ├── features/        # auth, home, products, cart, orders, profile, seller, admin
│       └── shared/ui/       # header, footer, search-bar, toast, etc.
│
├── E-commerce-api/          # ASP.NET Core 8 API (Clean Architecture)
│   └── src/
│       ├── ECommerce.Domain/          # entities and enums (no dependencies)
│       ├── ECommerce.Application/     # use cases, DTOs, interfaces
│       ├── ECommerce.Infrastructure/  # EF Core, Stripe, Firebase, JWT
│       └── ECommerce.Api/             # controllers, Program.cs, global error handling
│
└── E-commerce-db/           # schema and SQL scripts (manual migrations + seeds)
```

The API follows **Clean Architecture**: dependencies point inward (Domain depends on nothing; Application defines interfaces that Infrastructure implements). It includes centralized error handling with `ProblemDetails`, domain exceptions (`NotFoundException` → 404, `ConflictException` → 409, etc.) and EF projections for efficient responses.

---

## 🚀 Getting started locally

### Requirements
- [.NET SDK 8](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org) and npm
- A PostgreSQL database

### 1. Database
Create the database and apply the SQL scripts in `E-commerce-db/` in order (schema, then migrations, then seeds). To populate the catalog with ~194 real products:

```bash
# in your PostgreSQL client, run the contents of:
E-commerce-db/seed-dummyjson.sql
```

### 2. Backend
```bash
cd E-commerce-api
# Environment variables (never commit them):
export DATABASE_URL="Host=...;Port=5432;Database=...;Username=...;Password=...;SSL Mode=Require;Trust Server Certificate=true"
export JWT_KEY="a-secret-key-at-least-32-characters-long"
export STRIPE_SECRET_KEY="sk_test_..."
export FIREBASE_CREDENTIALS='{ ...service account json... }'   # optional (Google sign-in)
export FRONTEND_URL="http://localhost:4200"

dotnet run --project src/ECommerce.Api   # API at http://localhost:5134
```

### 3. Frontend
```bash
cd E-commerce-front
npm install
npm start                                 # http://localhost:4200 (proxies /api -> backend)
```

In development, the Angular dev-server proxies `/api` to the backend (see `proxy.conf.json`). The public Firebase config goes in `src/environments/environment.ts`.

---

## 🔐 Environment variables (backend)

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (Npgsql format) |
| `JWT_KEY` | Key used to sign JWT tokens (min. 32 characters) |
| `STRIPE_SECRET_KEY` | Stripe secret key (`sk_test_...`) |
| `FIREBASE_CREDENTIALS` | Firebase service account JSON (Google sign-in) |
| `FRONTEND_URL` | Allowed CORS origin(s) and Stripe return URLs |

> ⚠️ These credentials are secret — never commit them to Git.

---

## 📜 License

Portfolio project for educational and demonstration purposes.
