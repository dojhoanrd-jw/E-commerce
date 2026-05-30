import { Routes } from '@angular/router';
import { authGuard } from '@core/guards/auth.guard';
import { roleGuard } from '@core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('@features/home/components/home/home.component').then((m) => m.HomeComponent)
  },
  {
    path: 'auth',
    loadChildren: () => import('@features/auth/auth.routes').then((m) => m.AUTH_ROUTES)
  },
  {
    path: 'products',
    loadChildren: () =>
      import('@features/products/products.routes').then((m) => m.PRODUCTS_ROUTES)
  },
  {
    path: 'cart',
    canActivate: [authGuard],
    loadComponent: () =>
      import('@features/cart/components/cart/cart.component').then((m) => m.CartComponent)
  },
  {
    path: 'orders',
    canActivate: [authGuard],
    loadComponent: () =>
      import('@features/orders/components/my-orders/my-orders.component').then((m) => m.MyOrdersComponent)
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('@features/profile/components/profile/profile.component').then((m) => m.ProfileComponent)
  },
  {
    path: 'checkout/success',
    canActivate: [authGuard],
    loadComponent: () =>
      import('@features/checkout/components/success/checkout-success.component').then(
        (m) => m.CheckoutSuccessComponent
      )
  },
  {
    path: 'seller',
    canActivate: [roleGuard('Seller', 'Admin')],
    loadChildren: () => import('@features/seller/seller.routes').then((m) => m.SELLER_ROUTES)
  },
  {
    path: 'admin',
    canActivate: [roleGuard('Admin')],
    loadChildren: () => import('@features/admin/admin.routes').then((m) => m.ADMIN_ROUTES)
  },
  { path: '**', redirectTo: '' }
];
