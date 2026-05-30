# E-commerce — Frontend (Angular)

Single Page Application built with **Angular 19** (standalone components). It is the
frontend of a full-stack e-commerce project and consumes the REST API to display the
product catalog.

> Part of the monorepo: `E-commerce-front` (this app), `E-commerce-api` (ASP.NET Core 8)
> and `E-commerce-db` (PostgreSQL schema & seed).

## Tech stack

- Angular 19 (standalone components, lazy-loaded routes)
- TypeScript
- RxJS / HttpClient
- Deployed as a static site on **Vercel**

## Project structure (feature / domain)

```
src/app/
├── core/                  # app-wide singletons (interceptors, guards) — reserved
├── shared/                # reusable UI, pipes, directives — reserved
├── features/
│   └── products/          # products domain
│       ├── components/    # UI components
│       ├── services/      # data access
│       ├── models/        # types
│       └── products.routes.ts
├── app.component.ts
├── app.config.ts          # provideRouter + provideHttpClient
└── app.routes.ts          # lazy loads each feature
```

Path aliases are configured in `tsconfig.json`: `@features/*`, `@core/*`,
`@shared/*`, `@environments/*`.

## Getting started

```bash
npm install
npm start          # dev server at http://localhost:4200
```

## Configuration

The API base URL lives in the environment files:

- `src/environments/environment.ts` — development
- `src/environments/environment.prod.ts` — production (used by `ng build`)

```ts
export const environment = {
  production: true,
  apiUrl: 'https://your-api-host/api'
};
```

## Build

```bash
npm run build      # outputs to dist/e-commerce/browser
```

On Vercel set **Output Directory** to `dist/e-commerce/browser`.

## Adding a new feature

1. Create `features/<name>/` with its `components/`, `services/`, `models/` and
   `<name>.routes.ts`.
2. Register it in `app.routes.ts`:

```ts
{
  path: '<name>',
  loadChildren: () =>
    import('@features/<name>/<name>.routes').then((m) => m.<NAME>_ROUTES)
}
```
