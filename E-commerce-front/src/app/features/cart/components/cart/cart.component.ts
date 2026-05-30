import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CartService } from '@core/services/cart.service';
import { PaymentService } from '@core/services/payment.service';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {
  readonly cart = inject(CartService);
  private readonly payment = inject(PaymentService);

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
    this.payment.createCheckout(items).subscribe({
      next: (res) => {
        // Redirect to the Stripe Checkout hosted page
        window.location.href = res.url;
      },
      error: () => this.placing.set(false)
    });
  }
}
