import { Routes } from '@angular/router';

export const SELLER_ROUTES: Routes = [
  {
    path: 'products',
    loadComponent: () =>
      import('./components/my-products/my-products.component').then((m) => m.MyProductsComponent)
  },
  {
    path: 'products/new',
    loadComponent: () =>
      import('./components/product-form/product-form.component').then((m) => m.ProductFormComponent)
  },
  {
    path: 'products/:id/edit',
    loadComponent: () =>
      import('./components/product-form/product-form.component').then((m) => m.ProductFormComponent)
  },
  { path: '', redirectTo: 'products', pathMatch: 'full' }
];
