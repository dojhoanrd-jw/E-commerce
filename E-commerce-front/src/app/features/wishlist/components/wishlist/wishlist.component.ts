import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { WishlistService } from '@core/services/wishlist.service';
import { CartService } from '@core/services/cart.service';
import { NotificationService } from '@core/services/notification.service';
import { Product } from '@features/products/models/product.model';

@Component({
  selector: 'app-wishlist',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './wishlist.component.html'
})
export class WishlistComponent {
  readonly wishlist = inject(WishlistService);
  private readonly cart = inject(CartService);
  private readonly notification = inject(NotificationService);

  addToCart(product: Product): void {
    this.cart.add(product);
    this.notification.success(`${product.name} agregado al carrito`);
  }
}
