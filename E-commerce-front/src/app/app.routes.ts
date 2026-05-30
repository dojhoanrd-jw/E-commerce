import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('@features/auth/auth.routes').then((m) => m.AUTH_ROUTES)
  },
  {
    path: 'products',
    loadChildren: () =>
      import('@features/products/products.routes').then((m) => m.PRODUCTS_ROUTES)
  },
  { path: '', redirectTo: 'products', pathMatch: 'full' }
];
