import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ProductsService } from '@features/products/services/products.service';
import { Product } from '@features/products/models/product.model';
import { CartService } from '@core/services/cart.service';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly cart = inject(CartService);
  private readonly notification = inject(NotificationService);

  products: Product[] = [];
  loading = true;

  ngOnInit(): void {
    this.productsService.getProduct().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  addToCart(product: Product, event: Event): void {
    event.stopPropagation();
    this.cart.add(product);
    this.notification.success(`${product.name} agregado al carrito`);
  }
}
