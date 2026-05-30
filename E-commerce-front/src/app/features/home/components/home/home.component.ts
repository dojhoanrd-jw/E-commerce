import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ProductsService } from '@features/products/services/products.service';
import { Product, PRODUCT_CATEGORIES, effectivePrice } from '@features/products/models/product.model';
import { CartService } from '@core/services/cart.service';
import { WishlistService } from '@core/services/wishlist.service';
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
  readonly wishlist = inject(WishlistService);
  private readonly notification = inject(NotificationService);
  private readonly router = inject(Router);

  readonly categories = PRODUCT_CATEGORIES;
  readonly allProducts = signal<Product[]>([]);
  readonly loading = signal(true);

  readonly search = signal('');
  readonly category = signal('');
  readonly maxPrice = signal<number | null>(null);
  readonly sort = signal('relevance');

  readonly filtered = computed(() => {
    const term = this.search().trim().toLowerCase();
    const cat = this.category();
    const max = this.maxPrice();

    const list = this.allProducts().filter((p) => {
      if (term && !p.name.toLowerCase().includes(term)) {
        return false;
      }
      if (cat && p.category !== cat) {
        return false;
      }
      if (max != null && effectivePrice(p) > max) {
        return false;
      }
      return true;
    });

    switch (this.sort()) {
      case 'price-asc':
        return [...list].sort((a, b) => effectivePrice(a) - effectivePrice(b));
      case 'price-desc':
        return [...list].sort((a, b) => effectivePrice(b) - effectivePrice(a));
      case 'rating':
        return [...list].sort((a, b) => b.averageRating - a.averageRating);
      case 'sales':
        return [...list].sort((a, b) => b.salesCount - a.salesCount);
      default:
        return list;
    }
  });

  readonly deals = computed(() => this.allProducts().filter((p) => this.hasDiscount(p)).slice(0, 8));

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
    if (product.variants.length > 0) {
      this.router.navigate(['/products', product.id]);
      return;
    }
    this.cart.add(product);
    this.notification.success(`${product.name} agregado al carrito`);
  }

  hasVariants(product: Product): boolean {
    return product.variants.length > 0;
  }

  totalStock(product: Product): number {
    if (product.variants.length > 0) {
      return product.variants.reduce((sum, v) => sum + v.stock, 0);
    }
    return product.stock;
  }

  toggleWishlist(product: Product, event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.wishlist.toggle(product);
  }

  clearFilters(): void {
    this.search.set('');
    this.category.set('');
    this.maxPrice.set(null);
    this.sort.set('relevance');
  }

  effective(p: Product): number {
    return effectivePrice(p);
  }

  hasDiscount(p: Product): boolean {
    return p.salePrice != null && p.salePrice < p.price;
  }

  discountPercent(p: Product): number {
    return p.salePrice != null ? Math.round((1 - p.salePrice / p.price) * 100) : 0;
  }

  stars(rating: number): string {
    const r = Math.round(rating);
    return '★'.repeat(r) + '☆'.repeat(5 - r);
  }
}
