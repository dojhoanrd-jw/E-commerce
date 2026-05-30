import { Injectable, computed, signal } from '@angular/core';
import { Product } from '@features/products/models/product.model';

const WISHLIST_KEY = 'ecommerce_wishlist';

@Injectable({ providedIn: 'root' })
export class WishlistService {
  private readonly _items = signal<Product[]>(this.load());
  readonly items = this._items.asReadonly();
  readonly count = computed(() => this._items().length);

  has(productId: number): boolean {
    return this._items().some((p) => p.id === productId);
  }

  toggle(product: Product): void {
    if (this.has(product.id)) {
      this.remove(product.id);
    } else {
      this._items.update((list) => [...list, product]);
      this.persist();
    }
  }

  remove(productId: number): void {
    this._items.update((list) => list.filter((p) => p.id !== productId));
    this.persist();
  }

  private persist(): void {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(this._items()));
  }

  private load(): Product[] {
    const raw = localStorage.getItem(WISHLIST_KEY);
    return raw ? (JSON.parse(raw) as Product[]) : [];
  }
}
