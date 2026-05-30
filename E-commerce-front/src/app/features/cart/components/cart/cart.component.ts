import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CartService } from '@core/services/cart.service';
import { OrderService } from '@core/services/order.service';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  readonly cart = inject(CartService);
  private readonly orderService = inject(OrderService);
  private readonly notification = inject(NotificationService);
  private readonly router = inject(Router);

  readonly placing = signal(false);

  changeQty(productId: number, value: number): void {
    this.cart.setQuantity(productId, Number(value));
  }

  remove(productId: number): void {
    this.cart.remove(productId);
  }

  checkout(): void {
    const items = this.cart.items().map((i) => ({ productId: i.productId, quantity: i.quantity }));
    if (items.length === 0) {
      return;
    }

    this.placing.set(true);
    this.orderService.createOrder(items).subscribe({
      next: () => {
        this.cart.clear();
        this.notification.success('¡Compra realizada con éxito!');
        this.router.navigate(['/orders']);
      },
      error: () => this.placing.set(false)
    });
  }
}
