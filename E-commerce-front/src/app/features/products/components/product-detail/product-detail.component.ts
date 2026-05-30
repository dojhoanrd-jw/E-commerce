import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ProductsService } from '@features/products/services/products.service';
import { Product } from '@features/products/models/product.model';
import { CartService } from '@core/services/cart.service';
import { WishlistService } from '@core/services/wishlist.service';
import { NotificationService } from '@core/services/notification.service';
import { ReviewService, Review } from '@core/services/review.service';
import { AuthService } from '@core/services/auth.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.css']
})
export class ProductDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly productsService = inject(ProductsService);
  private readonly cart = inject(CartService);
  readonly wishlist = inject(WishlistService);
  private readonly notification = inject(NotificationService);
  private readonly reviewService = inject(ReviewService);
  private readonly auth = inject(AuthService);

  readonly product = signal<Product | null>(null);
  readonly loading = signal(true);
  quantity = 1;

  readonly reviews = signal<Review[]>([]);
  readonly isLoggedIn = this.auth.isAuthenticated;
  readonly average = computed(() => {
    const list = this.reviews();
    if (list.length === 0) {
      return 0;
    }
    return list.reduce((sum, r) => sum + r.rating, 0) / list.length;
  });
  readonly averageStars = computed(() => this.stars(Math.round(this.average())));

  newRating = 5;
  newComment = '';
  readonly submitting = signal(false);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.productsService.getById(id).subscribe({
      next: (p) => {
        this.product.set(p);
        this.loading.set(false);
      },
      error: () => this.loading.set(false)
    });
    this.loadReviews(id);
  }

  private loadReviews(productId: number): void {
    this.reviewService.getByProduct(productId).subscribe({
      next: (data) => this.reviews.set(data)
    });
  }

  addToCart(): void {
    const p = this.product();
    if (!p) {
      return;
    }
    this.cart.add(p, this.quantity);
    this.notification.success(`${p.name} agregado al carrito`);
  }

  toggleWishlist(): void {
    const p = this.product();
    if (p) {
      this.wishlist.toggle(p);
    }
  }

  submitReview(): void {
    const p = this.product();
    if (!p) {
      return;
    }
    this.submitting.set(true);
    this.reviewService.create(p.id, this.newRating, this.newComment).subscribe({
      next: () => {
        this.notification.success('¡Gracias por tu reseña!');
        this.newComment = '';
        this.loadReviews(p.id);
        this.submitting.set(false);
      },
      error: () => this.submitting.set(false)
    });
  }

  stars(rating: number): string {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  }
}
