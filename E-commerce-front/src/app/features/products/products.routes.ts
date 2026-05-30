import { Routes } from '@angular/router';
import { ProductDetailComponent } from '@features/products/components/product-detail/product-detail.component';

export const PRODUCTS_ROUTES: Routes = [
  { path: ':id', component: ProductDetailComponent }
];
