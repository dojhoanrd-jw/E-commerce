import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ProductsService } from '@features/products/services/products.service';
import { Product, PRODUCT_CATEGORIES } from '@features/products/models/product.model';
import { CartService } from '@core/services/cart.service';
import { NotificationService } from '@core/services/notification.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  private readonly productsService = inject(ProductsService);
  private readonly cart = inject(CartService);
  private readonly notification = inject(NotificationService);

  readonly categories = PRODUCT_CATEGORIES;
  readonly allProducts = signal<Product[]>([]);
  readonly loading = signal(true);

  readonly search = signal('');
  readonly category = signal('');
  readonly maxPrice = signal<number | null>(null);

  readonly filtered = computed(() => {
    const term = this.search().trim().toLowerCase();
    const cat = this.category();
    const max = this.maxPrice();

    return this.allProducts().filter((p) => {
      if (term && !p.name.toLowerCase().includes(term)) {
        return false;
      }
      if (cat && p.category !== cat) {
        return false;
      }
      if (max != null && p.price > max) {
        return false;
      }
      return true;
    });
  });

  ngOnInit(): void {
    this.productsService.getProduct().subscribe({
      next: (data) => {
        this.allProducts.set(data);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
  }

  addToCart(product: Product, event: Event): void {
    event.stopPropagation();
    this.cart.add(product);
    this.notification.success(`${product.name} agregado al carrito`);
  }

  clearFilters(): void {
    this.search.set('');
    this.category.set('');
    this.maxPrice.set(null);
  }
}
